import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Admin panel URL for product listing
const ADMIN_URL = 'https://www.segmentopositivo.pt/adminloja/index.php/sell/catalog/products?_token=b2rr8ahBFUB0r-_5ro5TzkBUQX_iRMCxqHjQnNoppP0';

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

function parseProductsFromAdminHtml(html: string): ScrapedProduct[] {
  const products: ScrapedProduct[] = [];
  
  console.log('Parsing admin panel HTML, length:', html.length);
  
  // Admin panels typically use tables - look for table rows
  const tableRowPatterns = [
    /<tr[^>]*>([\s\S]*?)<\/tr>/gi,
  ];

  let rows: string[] = [];
  for (const pattern of tableRowPatterns) {
    const matches = html.match(pattern);
    if (matches && matches.length > 1) {
      // Skip header row
      rows = matches.slice(1);
      break;
    }
  }

  console.log(`Found ${rows.length} table rows`);

  // Also try to find product data in other formats (grid, list, etc.)
  if (rows.length === 0) {
    // Try product cards/items
    const productPatterns = [
      /<div[^>]*class="[^"]*product[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi,
      /<article[^>]*>([\s\S]*?)<\/article>/gi,
      /<li[^>]*class="[^"]*product[^"]*"[^>]*>([\s\S]*?)<\/li>/gi,
    ];
    
    for (const pattern of productPatterns) {
      const matches = html.match(pattern);
      if (matches && matches.length > 0) {
        rows = matches;
        console.log(`Found ${rows.length} product items with pattern`);
        break;
      }
    }
  }

  // Parse each row/item
  for (const rowHtml of rows.slice(0, 500)) {
    try {
      // Extract product name from various patterns
      const namePatterns = [
        /<td[^>]*>([^<]{3,100})<\/td>/i,
        /<a[^>]*>([^<]{3,100})<\/a>/i,
        /title="([^"]{3,100})"/i,
        /<span[^>]*class="[^"]*name[^"]*"[^>]*>([^<]+)/i,
        /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/i,
      ];

      let name = '';
      for (const pattern of namePatterns) {
        const match = rowHtml.match(pattern);
        if (match && match[1].trim().length > 2) {
          name = match[1].trim();
          // Skip if it looks like a header or action
          if (!name.toLowerCase().includes('action') && 
              !name.toLowerCase().includes('editar') &&
              !name.toLowerCase().includes('apagar')) {
            break;
          }
          name = '';
        }
      }

      // Extract image
      const imagePatterns = [
        /src="([^"]+\.(?:jpg|jpeg|png|webp|gif)[^"]*)"/i,
        /data-src="([^"]+\.(?:jpg|jpeg|png|webp|gif)[^"]*)"/i,
      ];

      let image = '/placeholder.svg';
      for (const pattern of imagePatterns) {
        const match = rowHtml.match(pattern);
        if (match) {
          image = match[1];
          break;
        }
      }

      // Extract price
      const pricePatterns = [
        /(\d+[.,]\d{2})\s*€/,
        /€\s*(\d+[.,]\d{2})/,
        />(\d+[.,]\d{2})</,
        /price[^>]*>(\d+[.,]\d{2})/i,
      ];

      let price = 0;
      for (const pattern of pricePatterns) {
        const match = rowHtml.match(pattern);
        if (match) {
          price = parseFloat(match[1].replace(',', '.'));
          if (price > 0) break;
        }
      }

      // Extract category if available
      const categoryMatch = rowHtml.match(/category[^>]*>([^<]+)/i) ||
                           rowHtml.match(/data-category="([^"]+)"/i);
      const category = categoryMatch ? categoryMatch[1].trim() : 'Geral';

      // Check stock status
      const inStock = !rowHtml.toLowerCase().includes('esgotado') && 
                     !rowHtml.toLowerCase().includes('out of stock') &&
                     !rowHtml.toLowerCase().includes('indisponível') &&
                     !rowHtml.includes('inactive');

      // Extract brand if available
      const brandMatch = rowHtml.match(/brand[^>]*>([^<]+)/i) ||
                        rowHtml.match(/data-brand="([^"]+)"/i);
      const brand = brandMatch ? brandMatch[1].trim() : 'Segmento Positivo';

      if (name && name.length > 2) {
        products.push({
          name,
          brand,
          category,
          price,
          image,
          inStock,
          sourceUrl: ADMIN_URL,
        });
      }
    } catch (e) {
      console.error('Error parsing product row:', e);
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

    console.log('Starting product scrape from admin panel with Firecrawl');
    
    const html = await scrapeWithFirecrawl(ADMIN_URL, apiKey);
    const products = parseProductsFromAdminHtml(html);
    
    console.log(`Total products scraped: ${products.length}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        products,
        timestamp: new Date().toISOString(),
        message: `Scraped ${products.length} products from admin panel`,
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
