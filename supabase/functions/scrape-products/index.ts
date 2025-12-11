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
      waitFor: 2000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Firecrawl error for ${url}:`, response.status, errorText);
    throw new Error(`Firecrawl error: ${response.status}`);
  }

  const data = await response.json();
  return data.data?.html || data.data?.markdown || '';
}

function parseProductsFromHtml(html: string, categoryName: string, sourceUrl: string): ScrapedProduct[] {
  const products: ScrapedProduct[] = [];
  
  // Try to find product listings in the HTML
  // Common patterns for e-commerce sites
  
  // Pattern 1: Look for product cards with price and name
  const productPatterns = [
    // WooCommerce style
    /<li[^>]*class="[^"]*product[^"]*"[^>]*>([\s\S]*?)<\/li>/gi,
    // Generic product cards
    /<div[^>]*class="[^"]*product-card[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi,
    /<article[^>]*class="[^"]*product[^"]*"[^>]*>([\s\S]*?)<\/article>/gi,
    // Grid items
    /<div[^>]*class="[^"]*grid-item[^"]*product[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
  ];

  let productMatches: string[] = [];
  for (const pattern of productPatterns) {
    const matches = html.match(pattern);
    if (matches && matches.length > 0) {
      productMatches = matches;
      break;
    }
  }

  console.log(`Found ${productMatches.length} potential product blocks in ${categoryName}`);

  for (const productHtml of productMatches.slice(0, 100)) {
    try {
      // Extract product name
      const namePatterns = [
        /<h[1-6][^>]*class="[^"]*(?:title|name|product-title|woocommerce-loop-product__title)[^"]*"[^>]*>([^<]+)/i,
        /<a[^>]*class="[^"]*(?:title|name|product-title)[^"]*"[^>]*>([^<]+)/i,
        /<a[^>]*title="([^"]+)"/i,
        /data-product-name="([^"]+)"/i,
        /<span[^>]*class="[^"]*product-name[^"]*"[^>]*>([^<]+)/i,
      ];

      let name = '';
      for (const pattern of namePatterns) {
        const match = productHtml.match(pattern);
        if (match) {
          name = match[1].trim();
          break;
        }
      }

      // Extract image
      const imagePatterns = [
        /<img[^>]*src="([^"]+)"[^>]*class="[^"]*(?:product|attachment)[^"]*"/i,
        /<img[^>]*class="[^"]*(?:product|attachment)[^"]*"[^>]*src="([^"]+)"/i,
        /data-src="([^"]+\.(?:jpg|jpeg|png|webp|gif))"/i,
        /<img[^>]*src="([^"]+\.(?:jpg|jpeg|png|webp|gif))"/i,
      ];

      let image = '/placeholder.svg';
      for (const pattern of imagePatterns) {
        const match = productHtml.match(pattern);
        if (match) {
          image = match[1];
          break;
        }
      }

      // Extract price
      const pricePatterns = [
        /(\d+[.,]\d{2})\s*€/,
        /€\s*(\d+[.,]\d{2})/,
        /class="[^"]*price[^"]*"[^>]*>[^€]*€?\s*(\d+[.,]\d{2})/i,
        /data-price="(\d+[.,]?\d*)"/i,
        /<span[^>]*class="[^"]*amount[^"]*"[^>]*>(\d+[.,]\d{2})/i,
      ];

      let price = 0;
      for (const pattern of pricePatterns) {
        const match = productHtml.match(pattern);
        if (match) {
          price = parseFloat(match[1].replace(',', '.'));
          break;
        }
      }

      // Check stock status
      const outOfStock = productHtml.toLowerCase().includes('esgotado') || 
                        productHtml.toLowerCase().includes('out of stock') ||
                        productHtml.toLowerCase().includes('indisponível') ||
                        productHtml.includes('class="outofstock"');

      // Extract brand if available
      const brandMatch = productHtml.match(/data-brand="([^"]+)"/i) ||
                        productHtml.match(/<span[^>]*class="[^"]*brand[^"]*"[^>]*>([^<]+)/i);
      const brand = brandMatch ? brandMatch[1].trim() : 'Segmento Positivo';

      if (name && name.length > 2) {
        products.push({
          name,
          brand,
          category: categoryName,
          price,
          image,
          inStock: !outOfStock,
          sourceUrl,
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
    const errors: string[] = [];
    
    for (const { url, category } of CATEGORIES) {
      try {
        const html = await scrapeWithFirecrawl(url, apiKey);
        const products = parseProductsFromHtml(html, category, url);
        allProducts.push(...products);
        console.log(`Scraped ${products.length} products from ${category}`);
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error scraping ${category}:`, errorMsg);
        errors.push(`${category}: ${errorMsg}`);
      }
    }

    console.log(`Total products scraped: ${allProducts.length}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        products: allProducts,
        timestamp: new Date().toISOString(),
        message: `Scraped ${allProducts.length} products from ${CATEGORIES.length} categories`,
        errors: errors.length > 0 ? errors : undefined,
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
