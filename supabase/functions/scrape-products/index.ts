import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Base URL for scraping
const BASE_URL = 'https://www.segmentopositivo.pt';

interface ScrapedProduct {
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
  sourceUrl: string;
}

async function scrapeWithFirecrawl(url: string, apiKey: string): Promise<string> {
  console.log(`Scraping ${url} with Firecrawl...`);
  
  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      formats: ['html', 'markdown'],
      onlyMainContent: false,
      waitFor: 3000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Firecrawl error for ${url}:`, response.status, errorText);
    throw new Error(`Firecrawl error: ${response.status}`);
  }

  const data = await response.json();
  console.log('Firecrawl response received, HTML length:', (data.data?.html || '').length);
  return data.data?.html || data.data?.markdown || '';
}

function parseProductsFromHtml(html: string, categoryUrl: string): ScrapedProduct[] {
  const products: ScrapedProduct[] = [];
  
  console.log('Parsing HTML, length:', html.length);
  
  // PrestaShop uses article.product-miniature for products
  const productPattern = /<article[^>]*class="[^"]*product-miniature[^"]*"[^>]*>([\s\S]*?)<\/article>/gi;
  const productMatches = html.match(productPattern);
  
  if (!productMatches) {
    console.log('No product-miniature articles found');
    return products;
  }
  
  console.log(`Found ${productMatches.length} product elements`);

  for (const productHtml of productMatches.slice(0, 100)) {
    try {
      // Extract product name from h5.product-title or itemprop="name"
      const nameMatch = productHtml.match(/<h5[^>]*class="[^"]*product-title[^"]*"[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/i) ||
                       productHtml.match(/itemprop="name"[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/i) ||
                       productHtml.match(/<a[^>]*class="[^"]*product-name[^"]*"[^>]*>([^<]+)<\/a>/i);
      
      const name = nameMatch ? nameMatch[1].trim().replace(/\.{3}$/, '') : '';

      // Extract image - look for src in img tags
      const imageMatch = productHtml.match(/<img[^>]*src="([^"]+)"[^>]*>/i);
      let image = '/placeholder.svg';
      if (imageMatch) {
        image = imageMatch[1];
        if (!image.startsWith('http')) {
          image = BASE_URL + image;
        }
      }

      // Extract price - PrestaShop uses span.price with itemprop="price"
      const priceMatch = productHtml.match(/class="price"[^>]*>([^<€]+)/i) ||
                        productHtml.match(/itemprop="price"[^>]*class="price"[^>]*>([^<€]+)/i) ||
                        productHtml.match(/(\d+[.,]\d{2})\s*[€&]/);
      
      let price = 0;
      if (priceMatch) {
        const priceStr = priceMatch[1].replace(/[^\d,.]/g, '').replace(',', '.');
        price = parseFloat(priceStr) || 0;
      }

      // Extract product URL
      const urlMatch = productHtml.match(/<a[^>]*href="([^"]+segmentopositivo\.pt[^"]+)"[^>]*>/i);
      const productUrl = urlMatch ? urlMatch[1] : categoryUrl;

      // Check stock - look for InStock schema or absence of out-of-stock indicators
      const inStock = productHtml.includes('InStock') || 
                     (!productHtml.toLowerCase().includes('esgotado') && 
                      !productHtml.toLowerCase().includes('out of stock'));

      if (name && name.length > 2) {
        products.push({
          name,
          brand: 'Liqui Moly', // Most products seem to be Liqui Moly
          category: 'Geral',
          price,
          image,
          inStock,
          sourceUrl: productUrl,
        });
      }
    } catch (e) {
      console.error('Error parsing product:', e);
    }
  }

  return products;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl API key not configured', products: [] }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Starting product scrape from segmentopositivo.pt with Firecrawl');
    
    const allProducts: ScrapedProduct[] = [];
    
    // Scrape the main page first
    const mainHtml = await scrapeWithFirecrawl(BASE_URL, apiKey);
    const mainProducts = parseProductsFromHtml(mainHtml, BASE_URL);
    allProducts.push(...mainProducts);
    
    console.log(`Total products scraped: ${allProducts.length}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        products: allProducts,
        timestamp: new Date().toISOString(),
        message: `Scraped ${allProducts.length} products from segmentopositivo.pt`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scrape-products function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage, products: [] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
