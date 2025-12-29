import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BASE_URL = 'https://www.segmentopositivo.pt';

const CATEGORY_MAP: Record<string, string> = {
  'colas-selantes': 'Colas & Selantes',
  'aditivos-de-oleo': 'Aditivos de Óleo',
  'aditivos-de-combustivel': 'Aditivos de Combustível',
  'oleos-de-motor': 'Óleos de Motor',
  'oleos-de-transmissao': 'Óleos de Transmissão',
  'oleos-de-transmissao-diferencial': 'Óleos de Transmissão',
  'oleos-hidraulicos': 'Óleos Hidráulicos',
  'oleos-especiais': 'Óleos Especiais',
  'liquidos-de-travoes': 'Líquidos de Travões',
  'liquidos-de-arrefecimento': 'Líquidos de Arrefecimento',
  'sprays': 'Sprays',
  'exterior': 'Exterior',
  'cuidado-e-detalhe': 'Cuidado e Detalhe',
};

interface ScrapedProduct {
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
  sourceUrl: string;
  reference?: string;
}

function extractCategoryFromUrl(url: string): string {
  try {
    const urlPath = new URL(url).pathname;
    const segments = urlPath.split('/').filter(Boolean);
    if (segments.length > 0) {
      const categorySlug = segments[0].toLowerCase().replace(/^\d+-/, '');
      return CATEGORY_MAP[categorySlug] || categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  } catch (e) {
    console.error('Error extracting category from URL:', e);
  }
  return 'Geral';
}

async function scrapeWithFirecrawl(url: string, apiKey: string, maxRetries = 3): Promise<string> {
  console.log(`Scraping ${url}...`);

  const backoffMs = (attempt: number) => {
    // Exponential backoff: 10s, 20s, 40s
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
          // Prefer raw HTML to keep the original markup intact
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
        // Firecrawl credits exhausted
        throw new Error('NO_CREDITS');
      }

      if (!response.ok) {
        throw new Error(`Firecrawl error: ${response.status}`);
      }

      const data = await response.json();
      const html = data.data?.rawHtml || data.data?.html || '';

      // Detect actual maintenance/blocked pages (be specific to avoid false positives)
      const isMaintenancePage = 
        html.includes('class="page-maintenance"') || 
        html.includes('id="maintenance"') ||
        (html.includes('<title>') && html.toLowerCase().includes('manutenção') && html.length < 5000);
      
      if (isMaintenancePage) {
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

const KNOWN_BRANDS = ['Liqui Moly', 'Mannol', 'Motul', 'Castrol', 'Shell', 'Total', 'Wurth', 'WD-40', 'Sonax', 'Meguiars', 'Chemical Guys', 'K2', 'MA', 'Petronas', 'Febi', 'UFI', 'FAST', 'Valvoline'];

function extractBrandFromName(name: string): string {
  const nameLower = name.toLowerCase();
  for (const brand of KNOWN_BRANDS) {
    if (nameLower.includes(brand.toLowerCase())) {
      return brand;
    }
  }
  return 'Segmento Positivo';
}

// Extract reference from product detail page HTML - returns FULL reference like "80LM9511"
function extractReferenceFromDetailPage(html: string): string | undefined {
  // Pattern 1: itemprop="sku" - most reliable (e.g., <span itemprop="sku">80LM9511</span>)
  const skuMatch = html.match(/itemprop="sku"[^>]*>([^<]+)</i);
  if (skuMatch && skuMatch[1]) {
    const sku = skuMatch[1].trim();
    if (sku && sku.length >= 2) {
      console.log(`    ✓ Reference from SKU: ${sku}`);
      return sku; // Return FULL reference like "80LM9511"
    }
  }

  // Pattern 2: product-reference div with label
  const refDivMatch = html.match(/<div[^>]*class="[^"]*product-reference[^"]*"[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>/i);
  if (refDivMatch && refDivMatch[1]) {
    const ref = refDivMatch[1].trim();
    if (ref && ref.length >= 2) {
      console.log(`    ✓ Reference from div: ${ref}`);
      return ref; // Return FULL reference
    }
  }

  // Pattern 3: Look for "Referência:" pattern followed by span
  const refLabelMatch = html.match(/Refer[êe]ncia\s*:\s*<\/label>\s*<span[^>]*>([^<]+)</i);
  if (refLabelMatch && refLabelMatch[1]) {
    const ref = refLabelMatch[1].trim();
    if (ref && ref.length >= 2) {
      console.log(`    ✓ Reference from label: ${ref}`);
      return ref;
    }
  }

  // Pattern 4: Plain text pattern
  const refPatterns = [
    /Refer[êe]ncia[:\s]*<[^>]*>([^<]+)</i,
    /data-reference="([^"]+)"/i,
  ];
  
  for (const pattern of refPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const ref = match[1].trim();
      if (ref && ref.length >= 2) {
        console.log(`    ✓ Reference from pattern: ${ref}`);
        return ref;
      }
    }
  }
  
  console.log(`    ✗ No reference found`);
  return undefined;
}

// Extract products directly from category page with prices
function parseProductsFromCategoryHtml(html: string): { products: ScrapedProduct[], productUrls: string[] } {
  const products: ScrapedProduct[] = [];
  const productUrls: string[] = [];
  
  // Match product articles
  const productPattern = /<article[^>]*class="[^"]*product-miniature[^"]*"[^>]*data-id-product="(\d+)"[^>]*>([\s\S]*?)<\/article>/gi;
  let match;
  
  while ((match = productPattern.exec(html)) !== null) {
    const productId = match[1];
    const productHtml = match[2];
    
    try {
      // Extract product link and name
      const titleLinkMatch = productHtml.match(/<h5[^>]*class="[^"]*product-title[^"]*"[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/i);
      if (!titleLinkMatch) continue;
      
      const productUrl = titleLinkMatch[1];
      const name = titleLinkMatch[2].trim();
      
      if (!name || name.length < 3) continue;

      // Extract image
      let image = '/placeholder.svg';
      const imgMatch = productHtml.match(/<img[^>]*(?:data-src|src)="([^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i);
      if (imgMatch) {
        image = imgMatch[1];
        if (!image.startsWith('http')) {
          image = BASE_URL + image;
        }
      }

      // Extract price - multiple methods
      let price = 0;
      
      // Method 1: itemprop price content attribute (most reliable)
      const priceContentMatch = productHtml.match(/itemprop="price"[^>]*content="([\d.,]+)"/i);
      if (priceContentMatch) {
        price = parseFloat(priceContentMatch[1].replace(',', '.')) || 0;
      }
      
      // Method 2: data-price attribute
      if (price === 0) {
        const dataPriceMatch = productHtml.match(/data-price="([\d.,]+)"/i);
        if (dataPriceMatch) {
          price = parseFloat(dataPriceMatch[1].replace(',', '.')) || 0;
        }
      }
      
      // Method 3: price inside span with price class (format: "9,95 €" or "€ 9,95")
      if (price === 0) {
        const priceSpanMatch = productHtml.match(/<span[^>]*class="[^"]*price[^"]*"[^>]*>([^<]*)<\/span>/gi);
        if (priceSpanMatch) {
          for (const span of priceSpanMatch) {
            const numMatch = span.match(/([\d]+[.,]\d{2})/);
            if (numMatch) {
              const parsed = parseFloat(numMatch[1].replace(/\s/g, '').replace(',', '.'));
              if (parsed > 0) {
                price = parsed;
                break;
              }
            }
          }
        }
      }
      
      // Method 4: Look for price in product-price-and-shipping div
      if (price === 0) {
        const priceDivMatch = productHtml.match(/class="[^"]*product-price[^"]*"[^>]*>([\s\S]*?)<\/(?:div|span)>/i);
        if (priceDivMatch) {
          const numMatch = priceDivMatch[1].match(/([\d]+[.,]\d{2})/);
          if (numMatch) {
            price = parseFloat(numMatch[1].replace(/\s/g, '').replace(',', '.')) || 0;
          }
        }
      }
      
      // Method 5: any price pattern with € symbol
      if (price === 0) {
        const euroPatterns = [
          /([\d]+[.,]\d{2})\s*€/,  // "9,95 €"
          /€\s*([\d]+[.,]\d{2})/,  // "€ 9,95"
        ];
        for (const pattern of euroPatterns) {
          const match = productHtml.match(pattern);
          if (match) {
            price = parseFloat(match[1].replace(/\s/g, '').replace(',', '.')) || 0;
            if (price > 0) break;
          }
        }
      }
      
      console.log(`  Product: ${name.substring(0, 40)}... Price: ${price}€`);

      // Extract reference from name (fallback)
      let reference: string | undefined;
      const refMatch = name.match(/R[:\s]+(\d+)/i);
      if (refMatch) {
        reference = refMatch[1];
      }

      const category = extractCategoryFromUrl(productUrl);
      const brand = extractBrandFromName(name);
      const inStock = !productHtml.toLowerCase().includes('esgotado');

      if (price > 0) {
        products.push({
          name,
          brand,
          category,
          price,
          image,
          inStock,
          sourceUrl: productUrl,
          reference,
        });
        productUrls.push(productUrl);
      }
    } catch (e) {
      console.error('Error parsing product:', e);
    }
  }

  return { products, productUrls };
}

const CATEGORY_URLS = [
  '/4528-oleos-de-motor',
  '/4529-oleos-de-transmissao', 
  '/4531-liquidos-de-arrefecimento',
  '/4532-liquidos-de-travoes',
  '/4534-aditivos-de-oleo',
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl API key not configured', products: [], progress: { current: 0, total: 0 } }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Backend not configured', products: [], progress: { current: 0, total: 0 } }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    console.log('Starting product scrape from segmentopositivo.pt');
    
    const allProducts: ScrapedProduct[] = [];
    const seenUrls = new Set<string>();
    const totalCategories = CATEGORY_URLS.length;
    let rateLimited = false;
    
    // First pass: extract products with prices directly from category pages
    const productUrlsToScrape: Map<string, number> = new Map(); // url -> index in allProducts
    
    for (let i = 0; i < CATEGORY_URLS.length; i++) {
      const categoryPath = CATEGORY_URLS[i];
      try {
        const categoryUrl = BASE_URL + categoryPath;
        console.log(`[${i + 1}/${totalCategories}] Scraping category: ${categoryUrl}`);
        
        const html = await scrapeWithFirecrawl(categoryUrl, apiKey);
        const { products, productUrls } = parseProductsFromCategoryHtml(html);
        
        for (let j = 0; j < products.length; j++) {
          const product = products[j];
          if (!seenUrls.has(product.sourceUrl)) {
            seenUrls.add(product.sourceUrl);
            productUrlsToScrape.set(product.sourceUrl, allProducts.length);
            allProducts.push(product);
          }
        }
        
        console.log(`  ✓ Found ${products.length} products (total: ${allProducts.length})`);
        
        // Brief pause between categories
        if (i < CATEGORY_URLS.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (categoryError) {
        console.error(`Error scraping ${categoryPath}:`, categoryError);
        if (categoryError instanceof Error) {
          if (categoryError.message === 'RATE_LIMIT') {
            rateLimited = true;
            break;
          }
          if (categoryError.message === 'NO_CREDITS') {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'Sem créditos disponíveis para atualização. Recarregue os créditos e tente novamente.',
                products: [],
                progress: { current: 0, total: totalCategories },
              }),
              { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          if (categoryError.message === 'MAINTENANCE') {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'O website está em manutenção ou bloqueou o acesso. Tente novamente mais tarde.',
                products: [],
                progress: { current: 0, total: totalCategories },
              }),
              { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }
      }
    }
    
    if (rateLimited && allProducts.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Limite de pedidos do Firecrawl atingido. Por favor aguarde e tente novamente.',
          products: [],
          progress: { current: 0, total: totalCategories },
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Second pass: scrape individual product pages to get references for ALL products
    console.log(`\nFetching references for ALL ${allProducts.length} products...`);
    
    let refsFetched = 0;
    for (let i = 0; i < allProducts.length; i++) {
      const product = allProducts[i];
      if (rateLimited) break;

      try {
        // If DB already has a non-numeric reference for this exact product name, skip re-scraping.
        const { data: existing } = await supabase
          .from('products')
          .select('reference')
          .eq('name', product.name)
          .maybeSingle();

        const existingRef = (existing as { reference?: string | null } | null)?.reference ?? null;
        if (existingRef && !/^\d{3,}$/.test(existingRef)) {
          // Already has a full SKU-like reference.
          product.reference = existingRef;
          continue;
        }

        console.log(`  [${i + 1}/${allProducts.length}] Fetching reference for: ${product.name.substring(0, 40)}...`);
        const detailHtml = await scrapeWithFirecrawl(product.sourceUrl, apiKey);
        const reference = extractReferenceFromDetailPage(detailHtml);

        if (reference) {
          product.reference = reference;
          refsFetched++;
          console.log(`    ✓ Reference: ${reference}`);

          // Persist reference immediately so the user doesn't depend on the frontend loop completing.
          await supabase
            .from('products')
            .update({ reference })
            .eq('name', product.name);
        } else {
          console.log(`    ✗ No reference found`);
        }

        // Brief pause between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`  Error fetching reference:`, error);
        if (error instanceof Error && error.message === 'RATE_LIMIT') {
          rateLimited = true;
          break;
        }
      }
    }
    
    console.log(`\nScraping complete: ${allProducts.length} products found, ${refsFetched} references fetched`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        products: allProducts,
        progress: { 
          current: totalCategories, 
          total: totalCategories,
          success: allProducts.length,
          failed: 0,
        },
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage, products: [], progress: { current: 0, total: 0 } }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
