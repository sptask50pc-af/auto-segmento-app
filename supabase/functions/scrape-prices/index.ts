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

// Extract prices from category page HTML
function extractPricesFromHtml(html: string): Map<string, { price: number; name: string }> {
  const priceMap = new Map<string, { price: number; name: string }>();
  
  const productPattern = /<article[^>]*class="[^"]*product-miniature[^"]*"[^>]*data-id-product="(\d+)"[^>]*>([\s\S]*?)<\/article>/gi;
  let match;
  
  while ((match = productPattern.exec(html)) !== null) {
    const productHtml = match[2];
    
    try {
      // Extract product link and name
      const titleLinkMatch = productHtml.match(/<h5[^>]*class="[^"]*product-title[^"]*"[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/i);
      if (!titleLinkMatch) continue;
      
      const productUrl = titleLinkMatch[1];
      const name = titleLinkMatch[2].trim();
      
      if (!name || name.length < 3) continue;

      // Extract price
      let price = 0;
      
      const priceContentMatch = productHtml.match(/itemprop="price"[^>]*content="([\d.,]+)"/i);
      if (priceContentMatch) {
        price = parseFloat(priceContentMatch[1].replace(',', '.')) || 0;
      }
      
      if (price === 0) {
        const dataPriceMatch = productHtml.match(/data-price="([\d.,]+)"/i);
        if (dataPriceMatch) {
          price = parseFloat(dataPriceMatch[1].replace(',', '.')) || 0;
        }
      }
      
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
      
      if (price === 0) {
        const euroPatterns = [
          /([\d]+[.,]\d{2})\s*€/,
          /€\s*([\d]+[.,]\d{2})/,
        ];
        for (const pattern of euroPatterns) {
          const match = productHtml.match(pattern);
          if (match) {
            price = parseFloat(match[1].replace(/\s/g, '').replace(',', '.')) || 0;
            if (price > 0) break;
          }
        }
      }
      
      if (price > 0) {
        priceMap.set(productUrl, { price, name });
        priceMap.set(name.toLowerCase().trim(), { price, name });
      }
    } catch (e) {
      console.error('Error parsing product price:', e);
    }
  }

  return priceMap;
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
        JSON.stringify({ success: false, error: 'Firecrawl API key not configured', updates: [] }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch existing products from database
    const { data: existingProducts, error: fetchError } = await supabase
      .from('products')
      .select('id, name, price, image');
    
    if (fetchError) {
      console.error('Error fetching products:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch existing products', updates: [] }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!existingProducts || existingProducts.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No products in database to update', updates: [] }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${existingProducts.length} products in database`);
    console.log('Starting price scrape from segmentopositivo.pt');
    
    // Collect all prices from website
    const allPrices = new Map<string, { price: number; name: string }>();
    const totalCategories = CATEGORY_URLS.length;
    let rateLimited = false;
    
    for (let i = 0; i < CATEGORY_URLS.length; i++) {
      const categoryPath = CATEGORY_URLS[i];
      try {
        const categoryUrl = BASE_URL + categoryPath;
        console.log(`[${i + 1}/${totalCategories}] Scraping prices from: ${categoryUrl}`);
        
        const html = await scrapeWithFirecrawl(categoryUrl, apiKey);
        const prices = extractPricesFromHtml(html);
        
        prices.forEach((value, key) => {
          allPrices.set(key, value);
        });
        
        console.log(`  ✓ Found ${prices.size / 2} product prices (total unique: ${allPrices.size / 2})`);
        
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
                error: 'Sem créditos disponíveis para atualização de preços.',
                updates: [],
              }),
              { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          if (categoryError.message === 'MAINTENANCE') {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'O website está em manutenção. Tente novamente mais tarde.',
                updates: [],
              }),
              { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }
      }
    }
    
    if (rateLimited && allPrices.size === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Limite de pedidos atingido. Aguarde e tente novamente.',
          updates: [],
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize function for better matching
    const normalize = (str: string): string => {
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    };

    // Build normalized price map for better matching
    const normalizedPrices = new Map<string, { price: number; name: string }>();
    allPrices.forEach((value, key) => {
      if (typeof key === 'string' && !key.startsWith('http')) {
        normalizedPrices.set(normalize(key), value);
      }
    });

    // Match and update prices
    const priceUpdates: PriceUpdate[] = [];
    let updatedCount = 0;
    let unchangedCount = 0;
    let notFoundCount = 0;
    
    for (const product of existingProducts) {
      // Try exact match first
      const nameLower = product.name.toLowerCase().trim();
      let priceData = allPrices.get(nameLower);
      
      // Try normalized match if exact match fails
      if (!priceData) {
        const normalizedName = normalize(product.name);
        priceData = normalizedPrices.get(normalizedName);
      }
      
      // Try partial match - find if product name contains or is contained in any scraped name
      if (!priceData) {
        const normalizedName = normalize(product.name);
        for (const [key, value] of normalizedPrices.entries()) {
          if (normalizedName.includes(key) || key.includes(normalizedName)) {
            if (normalizedName.length > 10 && key.length > 10) { // Avoid false positives on short names
              priceData = value;
              break;
            }
          }
        }
      }
      
      if (priceData) {
        if (priceData.price !== product.price) {
          console.log(`  Price update: "${product.name.substring(0, 40)}..." ${product.price}€ → ${priceData.price}€`);
          
          const { error: updateError } = await supabase
            .from('products')
            .update({ price: priceData.price })
            .eq('id', product.id);
          
          if (!updateError) {
            priceUpdates.push({
              id: product.id,
              name: product.name,
              oldPrice: product.price,
              newPrice: priceData.price,
            });
            updatedCount++;
          }
        } else {
          unchangedCount++;
        }
      } else {
        notFoundCount++;
        console.log(`  Not found on website: "${product.name.substring(0, 50)}..."`);
      }
    }
    
    console.log(`\nPrice sync complete: ${updatedCount} updated, ${unchangedCount} unchanged`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        updates: priceUpdates,
        summary: {
          total: existingProducts.length,
          updated: updatedCount,
          unchanged: unchangedCount,
          notFound: notFoundCount,
        },
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage, updates: [] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
