import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Categories to scrape from segmentopositivo.pt
const CATEGORIES = [
  { url: 'https://www.segmentopositivo.pt/pecas', category: 'Peças' },
  { url: 'https://www.segmentopositivo.pt/lubrificantes', category: 'Lubrificantes' },
  { url: 'https://www.segmentopositivo.pt/acessorios', category: 'Acessórios' },
  { url: 'https://www.segmentopositivo.pt/cuidado-e-detalhe', category: 'Cuidado e Detalhe' },
  { url: 'https://www.segmentopositivo.pt/desempenho-e-upgrade', category: 'Desempenho e Upgrade' },
  { url: 'https://www.segmentopositivo.pt/electrica', category: 'Elétrica' },
  { url: 'https://www.segmentopositivo.pt/universal', category: 'Universal' },
  { url: 'https://www.segmentopositivo.pt/sinaletica-e-seguranca', category: 'Sinalética e Segurança' },
];

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

async function scrapeCategory(categoryUrl: string, categoryName: string): Promise<ScrapedProduct[]> {
  const products: ScrapedProduct[] = [];
  
  try {
    console.log(`Scraping category: ${categoryName} from ${categoryUrl}`);
    
    const response = await fetch(categoryUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-PT,pt;q=0.9,en;q=0.8',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${categoryUrl}: ${response.status}`);
      return products;
    }

    const html = await response.text();
    
    // Extract product data using regex patterns
    // Look for product cards/items in the HTML
    const productPattern = /<div[^>]*class="[^"]*product[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;
    const namePattern = /<h[23][^>]*class="[^"]*product[^"]*title[^"]*"[^>]*>([^<]+)<\/h[23]>/i;
    const pricePattern = /(?:€|EUR)\s*(\d+[.,]\d{2})/gi;
    const imagePattern = /<img[^>]*src="([^"]+)"[^>]*>/gi;
    const linkPattern = /<a[^>]*href="([^"]+)"[^>]*>/gi;
    
    // Alternative: Look for JSON-LD structured data
    const jsonLdPattern = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    
    while ((match = jsonLdPattern.exec(html)) !== null) {
      try {
        const jsonData = JSON.parse(match[1]);
        if (jsonData['@type'] === 'Product' || (Array.isArray(jsonData['@graph']))) {
          const items = jsonData['@graph'] || [jsonData];
          for (const item of items) {
            if (item['@type'] === 'Product') {
              products.push({
                name: item.name || 'Unknown Product',
                brand: item.brand?.name || 'Segmento Positivo',
                category: categoryName,
                price: parseFloat(item.offers?.price || '0'),
                image: item.image || '/placeholder.svg',
                inStock: item.offers?.availability?.includes('InStock') ?? true,
                sourceUrl: categoryUrl,
              });
            }
          }
        }
      } catch (e) {
        // JSON parse error, continue
      }
    }

    // If no JSON-LD found, try HTML parsing
    if (products.length === 0) {
      // Look for common e-commerce patterns
      const productCardPattern = /<article[^>]*class="[^"]*product[^"]*"[^>]*>([\s\S]*?)<\/article>/gi;
      const altProductPattern = /<div[^>]*class="[^"]*product-card[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi;
      
      // Try to find product listings
      const listingPattern = /<li[^>]*class="[^"]*product[^"]*"[^>]*>([\s\S]*?)<\/li>/gi;
      
      let productMatches = html.match(productCardPattern) || html.match(altProductPattern) || html.match(listingPattern) || [];
      
      for (const productHtml of productMatches.slice(0, 50)) { // Limit to 50 products per category
        const nameMatch = productHtml.match(/<(?:h[1-6]|span|a)[^>]*class="[^"]*(?:title|name)[^"]*"[^>]*>([^<]+)/i) ||
                         productHtml.match(/<a[^>]*title="([^"]+)"/i) ||
                         productHtml.match(/<img[^>]*alt="([^"]+)"/i);
        
        const priceMatch = productHtml.match(/(\d+[.,]\d{2})\s*€|€\s*(\d+[.,]\d{2})/);
        const imageMatch = productHtml.match(/<img[^>]*src="([^"]+)"/i);
        
        if (nameMatch) {
          const priceStr = priceMatch ? (priceMatch[1] || priceMatch[2]) : '0';
          products.push({
            name: nameMatch[1].trim(),
            brand: 'Segmento Positivo',
            category: categoryName,
            price: parseFloat(priceStr.replace(',', '.')),
            image: imageMatch ? imageMatch[1] : '/placeholder.svg',
            inStock: !productHtml.toLowerCase().includes('esgotado') && !productHtml.toLowerCase().includes('out of stock'),
            sourceUrl: categoryUrl,
          });
        }
      }
    }

    console.log(`Found ${products.length} products in ${categoryName}`);
    
  } catch (error) {
    console.error(`Error scraping ${categoryName}:`, error);
  }

  return products;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting product scrape from segmentopositivo.pt');
    
    const allProducts: ScrapedProduct[] = [];
    
    // Scrape each category
    for (const { url, category } of CATEGORIES) {
      const products = await scrapeCategory(url, category);
      allProducts.push(...products);
      
      // Add a small delay between requests to be polite
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`Total products scraped: ${allProducts.length}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        products: allProducts,
        timestamp: new Date().toISOString(),
        message: `Scraped ${allProducts.length} products from ${CATEGORIES.length} categories`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in scrape-products function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        products: []
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
