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
  reference?: string;
}

interface ProductBasicInfo {
  name: string;
  url: string;
  image: string;
  category: string;
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
      waitFor: 2000,
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

// Extract basic product info (URL and name) from category page
function parseProductUrlsFromHtml(html: string, categoryUrl: string): ProductBasicInfo[] {
  const products: ProductBasicInfo[] = [];
  
  const productPattern = /<article[^>]*class="[^"]*product-miniature[^"]*"[^>]*data-id-product="(\d+)"[^>]*>[\s\S]*?<\/article>/gi;
  let match;
  
  while ((match = productPattern.exec(html)) !== null) {
    const productHtml = match[0];
    
    try {
      const titleLinkMatch = productHtml.match(/<h5[^>]*class="[^"]*product-title[^"]*"[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/i);
      
      if (!titleLinkMatch) continue;
      
      const productUrl = titleLinkMatch[1];
      const name = titleLinkMatch[2].trim();
      
      if (!name || name.length < 3) continue;

      let image = '/placeholder.svg';
      const imgMatch = productHtml.match(/<img[^>]*class="[^"]*"[^>]*(?:data-src|src)="([^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i);
      if (imgMatch) {
        image = imgMatch[1];
        if (!image.startsWith('http')) {
          image = BASE_URL + image;
        }
      }

      const category = extractCategoryFromUrl(productUrl);

      products.push({
        name,
        url: productUrl,
        image,
        category,
      });
    } catch (e) {
      console.error('Error parsing product URL:', e);
    }
  }

  return products;
}

// Extract detailed product info from individual product page
function parseProductDetailFromHtml(html: string, basicInfo: ProductBasicInfo): ScrapedProduct | null {
  try {
    // Extract reference number - look for patterns like "Ref: 1234", "R: 1234", "Referência: 1234"
    let reference: string | undefined;
    
    // Try to find reference in product page - multiple patterns
    const refPatterns = [
      /R(?:ef)?(?:er[êe]ncia)?[:\s]+(\d+)/i,
      /data-id-product[^>]*>[\s\S]*?(\d{4,})/i,
      /<span[^>]*class="[^"]*reference[^"]*"[^>]*>[\s\S]*?(\d+)/i,
      /product-reference[^>]*>[\s\S]*?(\d+)/i,
    ];
    
    for (const pattern of refPatterns) {
      const refMatch = html.match(pattern);
      if (refMatch) {
        reference = refMatch[1];
        break;
      }
    }
    
    // Also try to extract from the name itself
    if (!reference) {
      const nameRefMatch = basicInfo.name.match(/R[:\s]+(\d+)/i);
      if (nameRefMatch) {
        reference = nameRefMatch[1];
      }
    }

    // Extract price - try multiple methods for accuracy
    let price = 0;
    let originalPrice: number | undefined;
    
    // Method 1: itemprop="price" content attribute (most reliable)
    const priceContentMatch = html.match(/itemprop="price"[^>]*content="([^"]+)"/i) ||
                              html.match(/content="([^"]+)"[^>]*itemprop="price"/i);
    if (priceContentMatch) {
      price = parseFloat(priceContentMatch[1]) || 0;
    }
    
    // Method 2: Look for current-price class
    if (price === 0) {
      const currentPriceMatch = html.match(/class="[^"]*current-price[^"]*"[^>]*>[\s\S]*?€?\s*([\d,]+[.,]\d{2})/i);
      if (currentPriceMatch) {
        price = parseFloat(currentPriceMatch[1].replace(',', '.')) || 0;
      }
    }
    
    // Method 3: Look for price span
    if (price === 0) {
      const priceSpanMatch = html.match(/<span[^>]*class="price"[^>]*>[\s\S]*?€?\s*([\d,]+[.,]\d{2})/i);
      if (priceSpanMatch) {
        price = parseFloat(priceSpanMatch[1].replace(',', '.')) || 0;
      }
    }
    
    // Try to find original price (if on sale)
    const regularPriceMatch = html.match(/class="[^"]*regular-price[^"]*"[^>]*>[\s\S]*?€?\s*([\d,]+[.,]\d{2})/i);
    if (regularPriceMatch) {
      originalPrice = parseFloat(regularPriceMatch[1].replace(',', '.')) || undefined;
    }

    const brand = extractBrandFromName(basicInfo.name);
    const inStock = !html.toLowerCase().includes('esgotado') && !html.toLowerCase().includes('out of stock');

    if (price > 0) {
      return {
        name: basicInfo.name,
        brand,
        category: basicInfo.category,
        price,
        originalPrice,
        image: basicInfo.image,
        inStock,
        sourceUrl: basicInfo.url,
        reference,
      };
    }
    
    return null;
  } catch (e) {
    console.error('Error parsing product detail:', e);
    return null;
  }
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
    
    // First pass: collect all product URLs from category pages
    const allProductUrls: ProductBasicInfo[] = [];
    
    for (let i = 0; i < CATEGORY_URLS.length; i++) {
      const categoryPath = CATEGORY_URLS[i];
      try {
        const categoryUrl = BASE_URL + categoryPath;
        console.log(`[${i + 1}/${totalCategories}] Getting product list from: ${categoryUrl}`);
        
        const html = await scrapeWithFirecrawl(categoryUrl, apiKey);
        const products = parseProductUrlsFromHtml(html, categoryUrl);
        
        for (const product of products) {
          if (!seenUrls.has(product.url)) {
            seenUrls.add(product.url);
            allProductUrls.push(product);
          }
        }
        
        console.log(`Category ${i + 1}/${totalCategories}: Found ${products.length} product URLs (total: ${allProductUrls.length})`);
        
        // Brief pause between category pages
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (categoryError) {
        console.error(`Error scraping ${categoryPath}:`, categoryError);
        if (categoryError instanceof Error && categoryError.message === 'RATE_LIMIT') {
          rateLimited = true;
          break;
        }
      }
    }
    
    if (rateLimited && allProductUrls.length === 0) {
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
    
    console.log(`\nTotal unique products found: ${allProductUrls.length}`);
    console.log('Now scraping individual product pages for accurate pricing and references...\n');
    
    // Second pass: visit each product page for accurate details
    const totalProducts = allProductUrls.length;
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < allProductUrls.length; i++) {
      const productInfo = allProductUrls[i];
      
      try {
        console.log(`[${i + 1}/${totalProducts}] Scraping: ${productInfo.name.substring(0, 50)}...`);
        
        const productHtml = await scrapeWithFirecrawl(productInfo.url, apiKey);
        const productDetail = parseProductDetailFromHtml(productHtml, productInfo);
        
        if (productDetail) {
          allProducts.push(productDetail);
          successCount++;
          console.log(`  ✓ Price: €${productDetail.price} | Ref: ${productDetail.reference || 'N/A'}`);
        } else {
          failCount++;
          console.log(`  ✗ Failed to extract details`);
        }
        
        // Pause between product pages to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1500));
        
      } catch (productError) {
        console.error(`Error scraping product ${productInfo.url}:`, productError);
        failCount++;
        
        if (productError instanceof Error && productError.message === 'RATE_LIMIT') {
          console.log('Rate limited - stopping product scraping');
          rateLimited = true;
          break;
        }
      }
    }
    
    console.log(`\nScraping complete: ${allProducts.length} products scraped successfully`);
    console.log(`Success: ${successCount}, Failed: ${failCount}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        products: allProducts,
        progress: { 
          current: totalProducts, 
          total: totalProducts,
          success: successCount,
          failed: failCount,
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
