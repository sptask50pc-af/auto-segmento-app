import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
  'oleos-de-transmissao-diferencial': 'Oleos De Transmissao Diferencial',
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
      formats: ['html'],
      onlyMainContent: false,
      waitFor: 3000,
    }),
  });

  if (response.status === 429) {
    const errorText = await response.text();
    console.error(`Firecrawl rate limit for ${url}:`, errorText);
    throw new Error('RATE_LIMIT');
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Firecrawl error for ${url}:`, response.status, errorText);
    throw new Error(`Firecrawl error: ${response.status}`);
  }

  const data = await response.json();
  return data.data?.html || '';
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

function parseProductsFromHtml(html: string, categoryUrl: string): ScrapedProduct[] {
  const products: ScrapedProduct[] = [];
  
  // Match each product article
  const productPattern = /<article[^>]*class="[^"]*product-miniature[^"]*"[^>]*data-id-product="(\d+)"[^>]*>[\s\S]*?<\/article>/gi;
  let match;
  
  while ((match = productPattern.exec(html)) !== null) {
    const productId = match[1];
    const productHtml = match[0];
    
    try {
      // Extract product URL from the product-title link specifically
      const titleLinkMatch = productHtml.match(/<h5[^>]*class="[^"]*product-title[^"]*"[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/i);
      
      if (!titleLinkMatch) continue;
      
      const productUrl = titleLinkMatch[1];
      const name = titleLinkMatch[2].trim();
      
      if (!name || name.length < 3) continue;

      // Extract image
      let image = '/placeholder.svg';
      const imgMatch = productHtml.match(/<img[^>]*class="[^"]*"[^>]*(?:data-src|src)="([^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i);
      if (imgMatch) {
        image = imgMatch[1];
        if (!image.startsWith('http')) {
          image = BASE_URL + image;
        }
      }

      // Extract price from itemprop content (most reliable)
      let price = 0;
      const priceContentMatch = productHtml.match(/itemprop="price"[^>]*content="([^"]+)"/i) ||
                                productHtml.match(/content="([^"]+)"[^>]*itemprop="price"/i);
      
      if (priceContentMatch) {
        price = parseFloat(priceContentMatch[1]) || 0;
      }
      
      // Fallback: extract from visible price
      if (price === 0) {
        const visiblePriceMatch = productHtml.match(/class="price"[^>]*>\s*€?\s*([\d,]+[.,]\d{2})/i) ||
                                  productHtml.match(/([\d]+[.,]\d{2})\s*€/);
        if (visiblePriceMatch) {
          price = parseFloat(visiblePriceMatch[1].replace(',', '.')) || 0;
        }
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
        });
        console.log(`Product: ${name} | €${price} | ${category}`);
      }
    } catch (e) {
      console.error('Error parsing product:', e);
    }
  }

  return products;
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

    console.log('Starting product scrape from segmentopositivo.pt');
    
    const allProducts: ScrapedProduct[] = [];
    const seenUrls = new Set<string>();
    const totalCategories = CATEGORY_URLS.length;
    let rateLimited = false;
    
    for (let i = 0; i < CATEGORY_URLS.length; i++) {
      const categoryPath = CATEGORY_URLS[i];
      try {
        const categoryUrl = BASE_URL + categoryPath;
        console.log(`[${i + 1}/${totalCategories}] Scraping: ${categoryUrl}`);
        
        const html = await scrapeWithFirecrawl(categoryUrl, apiKey);
        const products = parseProductsFromHtml(html, categoryUrl);
        
        for (const product of products) {
          if (!seenUrls.has(product.sourceUrl)) {
            seenUrls.add(product.sourceUrl);
            allProducts.push(product);
          }
        }
        
        console.log(`Category ${i + 1}/${totalCategories}: ${products.length} products (total: ${allProducts.length})`);
        
        // Be gentle with the Firecrawl rate limit
        await new Promise(resolve => setTimeout(resolve, 4000));
      } catch (categoryError) {
        console.error(`Error scraping ${categoryPath}:`, categoryError);
        if (categoryError instanceof Error && categoryError.message === 'RATE_LIMIT') {
          rateLimited = true;
          break;
        }
      }
    }
    
    console.log(`Scraping complete: ${allProducts.length} products`);

    if (rateLimited && allProducts.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Limite de pedidos do Firecrawl atingido. Por favor aguarde ~20 segundos e tente novamente.',
          products: [],
          progress: { current: 0, total: totalCategories },
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        products: allProducts,
        progress: { current: totalCategories, total: totalCategories },
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