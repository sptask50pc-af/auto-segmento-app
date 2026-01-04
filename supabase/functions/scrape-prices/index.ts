import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BASE_URL = 'https://www.segmentopositivo.pt';

interface PriceUpdate {
  id: string;
  name: string;
  oldPrice: number;
  newPrice: number;
  sourceUrl?: string;
}

async function scrapeWithFirecrawl(url: string, apiKey: string, maxRetries = 3): Promise<string> {
  console.log(`Scraping ${url}...`);

  const backoffMs = (attempt: number) => {
    const base = 10_000;
    return base * Math.pow(2, attempt - 1);
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          formats: ['rawHtml', 'html'],
          onlyMainContent: false,
          waitFor: 0,
        }),
      });

      if (response.status === 429) {
        console.error(`Rate limit (attempt ${attempt}/${maxRetries})`);
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, backoffMs(attempt)));
          continue;
        }
        throw new Error('RATE_LIMIT');
      }

      if (response.status === 402) {
        throw new Error('NO_CREDITS');
      }

      if (!response.ok) {
        throw new Error(`Firecrawl error: ${response.status}`);
      }

      const data = await response.json();
      const html = data.data?.rawHtml || data.data?.html || '';

       const lower = html.toLowerCase();
       const isSuspendedPage =
         lower.includes('account suspended') ||
         lower.includes('this account has been suspended') ||
         lower.includes('contact your hosting provider');

       // Detect maintenance page - the site uses "page-maintenance" class
       const isMaintenancePage =
         /page-maintenance/i.test(html) ||
         html.includes('id="maintenance"') ||
         (html.includes('<title>') && lower.includes('manuten') && html.length < 5000);

       if (isSuspendedPage) {
         console.log('Blocked page detected: account suspended');
         throw new Error('SITE_SUSPENDED');
       }

       if (isMaintenancePage) {
         console.log('Maintenance page detected');
         throw new Error('MAINTENANCE');
       }

       return html;
    } catch (e) {
      if (attempt === maxRetries) throw e;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  throw new Error('RATE_LIMIT');
}

// Extract price from product detail page HTML
function extractPriceFromDetailPage(html: string): number | null {
  // Try itemprop price content first
  const priceContentMatch = html.match(/itemprop="price"[^>]*content="([\d.,]+)"/i);
  if (priceContentMatch) {
    const price = parseFloat(priceContentMatch[1].replace(',', '.'));
    if (price > 0) return price;
  }

  // Try data-price attribute
  const dataPriceMatch = html.match(/data-price="([\d.,]+)"/i);
  if (dataPriceMatch) {
    const price = parseFloat(dataPriceMatch[1].replace(',', '.'));
    if (price > 0) return price;
  }

  // Try current-price span
  const currentPriceMatch = html.match(/<span[^>]*class="[^"]*current-price[^"]*"[^>]*>[^<]*?([\d]+[.,]\d{2})/i);
  if (currentPriceMatch) {
    const price = parseFloat(currentPriceMatch[1].replace(',', '.'));
    if (price > 0) return price;
  }

  // Try price span
  const priceSpanMatch = html.match(/<span[^>]*class="[^"]*price[^"]*"[^>]*>([^<]*)<\/span>/gi);
  if (priceSpanMatch) {
    for (const span of priceSpanMatch) {
      const numMatch = span.match(/([\d]+[.,]\d{2})/);
      if (numMatch) {
        const price = parseFloat(numMatch[1].replace(/\s/g, '').replace(',', '.'));
        if (price > 0) return price;
      }
    }
  }

  // Try euro patterns
  const euroPatterns = [
    /([\d]+[.,]\d{2})\s*€/,
    /€\s*([\d]+[.,]\d{2})/,
  ];
  for (const pattern of euroPatterns) {
    const match = html.match(pattern);
    if (match) {
      const price = parseFloat(match[1].replace(/\s/g, '').replace(',', '.'));
      if (price > 0) return price;
    }
  }

  return null;
}

// Extract reference from product detail page HTML
function extractReferenceFromDetailPage(html: string): string | null {
  // Pattern 1: Look for itemprop="sku" (most reliable - contains actual product reference)
  const skuMatch = html.match(/itemprop="sku"[^>]*>([^<]+)</i);
  if (skuMatch && skuMatch[1]) {
    const ref = skuMatch[1].trim();
    if (ref && ref.length >= 2) {
      console.log(`Found reference in itemprop="sku": ${ref}`);
      return ref;
    }
  }

  // Pattern 2: Look in product-reference div with label/span structure
  const refDivMatch = html.match(/<div[^>]*class="[^"]*product-reference[^"]*"[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>/i);
  if (refDivMatch && refDivMatch[1]) {
    const ref = refDivMatch[1].trim();
    if (ref && ref.length >= 2) {
      console.log(`Found reference in product-reference div: ${ref}`);
      return ref;
    }
  }

  // Pattern 3: "Referência: XXXX" followed by reference value
  const refLabelMatch = html.match(/Refer[êe]ncia\s*:\s*<\/label>\s*<span[^>]*>([^<]+)</i);
  if (refLabelMatch && refLabelMatch[1]) {
    const ref = refLabelMatch[1].trim();
    if (ref && ref.length >= 2) {
      console.log(`Found reference after Referência label: ${ref}`);
      return ref;
    }
  }

  // Pattern 4: Plain text "Referência: XXXX" pattern (no nested tags)
  const refTextMatch = html.match(/Refer[êe]ncia\s*:\s*([A-Z0-9][A-Z0-9\-_]+)/i);
  if (refTextMatch && refTextMatch[1]) {
    const ref = refTextMatch[1].trim();
    if (ref && ref.length >= 2) {
      console.log(`Found reference via text pattern: ${ref}`);
      return ref;
    }
  }

  console.log('No reference found in HTML');
  return null;
}

// Search for product by reference using website search
async function searchProductByReference(reference: string, apiKey: string): Promise<{ url: string; price: number; scrapedReference: string | null } | null> {
  const normalizeUrl = (href: string) => {
    const trimmed = href.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    if (trimmed.startsWith('/')) return `${BASE_URL}${trimmed}`;
    return `${BASE_URL}/${trimmed}`;
  };

  try {
    const searchUrl = `${BASE_URL}/pesquisa?controller=search&s=${encodeURIComponent(reference)}`;
    console.log(`Searching for reference "${reference}" at: ${searchUrl}`);

    const html = await scrapeWithFirecrawl(searchUrl, apiKey);

    // Look for product cards in search results
    const productPattern = /<article[^>]*class="[^"]*product-miniature[^"]*"[^>]*>([\s\S]*?)<\/article>/gi;
    let match;

    while ((match = productPattern.exec(html)) !== null) {
      const productHtml = match[1];

      // Try to find the product link + title
      const titleMatch =
        productHtml.match(/<a[^>]*href="([^"]+)"[^>]*class="[^"]*product-title[^"]*"[^>]*>([^<]+)<\/a>/i) ||
        productHtml.match(/<h5[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/i);

      if (!titleMatch) continue;

      const productUrl = normalizeUrl(titleMatch[1]);
      const productName = (titleMatch[2] || '').trim();

      // If the search term appears in the name, accept this card
      const matchesRef = productName.toLowerCase().includes(reference.toLowerCase());
      if (!matchesRef) continue;

      // Extract price from the search result card
      let price = 0;
      const priceContentMatch = productHtml.match(/itemprop="price"[^>]*content="([\d.,]+)"/i);
      if (priceContentMatch) price = parseFloat(priceContentMatch[1].replace(',', '.')) || 0;

      if (price === 0) {
        const dataPriceMatch = productHtml.match(/data-price="([\d.,]+)"/i);
        if (dataPriceMatch) price = parseFloat(dataPriceMatch[1].replace(',', '.')) || 0;
      }

      if (price === 0) {
        const euroMatch = productHtml.match(/([\d]+[.,]\d{2})\s*€/);
        if (euroMatch) price = parseFloat(euroMatch[1].replace(',', '.')) || 0;
      }

      // Always fetch detail page to get reference
      console.log(`Fetching detail page for reference: ${productUrl}`);
      const detailHtml = await scrapeWithFirecrawl(productUrl, apiKey);
      const scrapedReference = extractReferenceFromDetailPage(detailHtml);
      
      if (price > 0) {
        console.log(`Found product in search: ${productName} - ${price}€, ref: ${scrapedReference} (${productUrl})`);
        return { url: productUrl, price, scrapedReference };
      }

      // If price wasn't on the card, try the detail page
      const detailPrice = extractPriceFromDetailPage(detailHtml);
      if (detailPrice) {
        console.log(`Found price on detail page: ${detailPrice}€, ref: ${scrapedReference}`);
        return { url: productUrl, price: detailPrice, scrapedReference };
      }
    }

    // Fallback: collect a few product-page links (often relative URLs)
    const hrefPattern = /<a[^>]*href="([^"]+\.html[^"]*)"/gi;
    const productUrls: string[] = [];
    let hrefMatch;

    while ((hrefMatch = hrefPattern.exec(html)) !== null) {
      const url = normalizeUrl(hrefMatch[1]);
      if (!url.includes('/blogue') &&
          !url.includes('/blog') &&
          !url.includes('/contact') &&
          !url.includes('/sobre') &&
          !url.includes('/about') &&
          !url.includes('/termos') &&
          !url.includes('/politica') &&
          !url.includes('/content/')) {
        if (!productUrls.includes(url)) productUrls.push(url);
      }
    }

    console.log(`Fallback: found ${productUrls.length} candidate .html links`);

    for (const productUrl of productUrls.slice(0, 5)) {
      console.log(`Checking product detail page: ${productUrl}`);
      try {
        const detailHtml = await scrapeWithFirecrawl(productUrl, apiKey);

        // Verify this page matches the reference (loose check)
        if (detailHtml.toLowerCase().includes(reference.toLowerCase())) {
          const price = extractPriceFromDetailPage(detailHtml);
          const scrapedReference = extractReferenceFromDetailPage(detailHtml);
          if (price) {
            console.log(`Found price on detail page: ${price}€, ref: ${scrapedReference}`);
            return { url: productUrl, price, scrapedReference };
          }
        }
      } catch (e) {
        console.error(`Error checking ${productUrl}:`, e);
      }
    }

    console.log(`Product with reference "${reference}" not found in search results`);
    return null;
  } catch (error) {
    console.error(`Error searching for reference "${reference}":`, error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl API key not configured', updates: [] }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body for reference parameter
    let reference: string | null = null;
    try {
      const body = await req.json();
      reference = body?.reference || null;
    } catch {
      // No body or invalid JSON, proceed without reference
    }

    if (reference) {
      // Single product price sync by reference
      console.log(`Looking up price for reference: ${reference}`);
      
      // First, find the product in database
      const { data: products, error: fetchError } = await supabase
        .from('products')
        .select('id, name, price, reference')
        .or(`reference.eq.${reference},name.ilike.%R: ${reference}%,name.ilike.%${reference}%`);
      
      if (fetchError) {
        console.error('Error fetching product:', fetchError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to find product in database', updates: [] }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!products || products.length === 0) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Product with reference "${reference}" not found in database`, 
            updates: [] 
          }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const product = products[0];
      console.log(`Found product in database: ${product.name}`);

      // Search for product on website
      const searchResult = await searchProductByReference(reference, apiKey);
      
      if (!searchResult) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Product with reference "${reference}" not found on website`, 
            updates: [] 
          }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const priceUpdates: PriceUpdate[] = [];
      const priceChanged = searchResult.price !== product.price;
      const referenceChanged = searchResult.scrapedReference && searchResult.scrapedReference !== product.reference;
      
      // Build update object
      const updateData: { price?: number; reference?: string } = {};
      if (priceChanged) {
        updateData.price = searchResult.price;
        console.log(`Price update: ${product.price}€ → ${searchResult.price}€`);
      }
      if (referenceChanged && searchResult.scrapedReference) {
        updateData.reference = searchResult.scrapedReference;
        console.log(`Reference update: ${product.reference || 'none'} → ${searchResult.scrapedReference}`);
      }
      
      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', product.id);
        
        if (updateError) {
          console.error('Error updating product:', updateError);
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to update product in database', updates: [] }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        if (priceChanged) {
          priceUpdates.push({
            id: product.id,
            name: product.name,
            oldPrice: product.price,
            newPrice: searchResult.price,
            sourceUrl: searchResult.url,
          });
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          updates: priceUpdates,
          summary: {
            total: 1,
            updated: priceUpdates.length,
            unchanged: priceUpdates.length === 0 ? 1 : 0,
            notFound: 0,
          },
          product: {
            name: product.name,
            oldPrice: product.price,
            newPrice: searchResult.price,
            priceChanged: priceChanged,
            oldReference: product.reference,
            newReference: searchResult.scrapedReference,
            referenceChanged: referenceChanged,
          },
          timestamp: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Original bulk price sync logic (when no reference provided)
    // This should not be reached now since we require a reference
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Please provide a product reference to sync price', 
        updates: [] 
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage === 'RATE_LIMIT') {
      return new Response(
        JSON.stringify({ success: false, error: 'Rate limit reached. Please try again later.', updates: [] }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (errorMessage === 'NO_CREDITS') {
      return new Response(
        JSON.stringify({ success: false, error: 'No credits available for price sync.', updates: [] }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (errorMessage === 'SITE_SUSPENDED') {
      return new Response(
        JSON.stringify({ success: false, error: 'Website returned "Account Suspended" (blocked/unavailable). Try again later.', updates: [] }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (errorMessage === 'MAINTENANCE') {
      return new Response(
        JSON.stringify({ success: false, error: 'Website is under maintenance. Try again later.', updates: [] }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: false, error: errorMessage, updates: [] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});