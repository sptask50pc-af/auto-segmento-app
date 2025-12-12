import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Base URL for scraping
const BASE_URL = 'https://www.segmentopositivo.pt';

// Category mapping from URL slugs to app categories
const CATEGORY_MAP: Record<string, string> = {
  'colas-selantes': 'Colas & Selantes',
  'aditivos-de-oleo': 'Aditivos de Óleo',
  'aditivos-de-combustivel': 'Aditivos de Combustível',
  'oleos-de-motor': 'Óleos de Motor',
  'oleos-de-transmissao': 'Óleos de Transmissão',
  'oleos-hidraulicos': 'Óleos Hidráulicos',
  'oleos-especiais': 'Óleos Especiais',
  'liquidos-de-travoes': 'Líquidos de Travões',
  'liquidos-de-arrefecimento': 'Líquidos de Arrefecimento',
  'sprays-manutencao': 'Sprays & Manutenção',
  'shampoos-limpeza': 'Shampoos & Limpeza',
  'ceras-selantes': 'Ceras & Selantes',
  'polimento-correcao': 'Polimento & Correção',
  'exterior': 'Exterior',
  'interiores': 'Interiores',
  'vidros-espelhos': 'Vidros & Espelhos',
  'panos-acessorios': 'Panos & Acessórios',
  'odorizantes': 'Odorizantes',
  'baterias': 'Baterias',
  'iluminacao-lampadas': 'Iluminação & Lâmpadas',
  'fusiveis-reles': 'Fusíveis & Relés',
  'cablagens-conectores': 'Cablagens & Conectores',
  'filtros': 'Filtros',
  'filtros-de-oleo': 'Filtros de Óleo',
  'filtros-de-ar': 'Filtros de Ar',
  'filtros-de-combustivel': 'Filtros de Combustível',
  'travagem': 'Travagem',
  'discos': 'Discos',
  'pastilhas': 'Pastilhas de Travão',
  'suspensao-direcao': 'Suspensão e Direção',
  'amortecedores': 'Amortecedores',
  'motor': 'Motor',
  'sistema-escape': 'Sistema de Escape',
  'universal': 'Universal',
  'sinaletica-seguranca': 'Sinalética e Segurança',
  'acessorios': 'Acessórios',
  'desempenho-upgrade': 'Desempenho e Upgrade',
  'cuidado-detalhe': 'Cuidado e Detalhe',
  'eletrica': 'Elétrica',
  'lubrificantes': 'Lubrificantes',
  'pecas': 'Peças',
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
      // Handle numeric category format like /4528-oleos-de-motor
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

// Known brands to extract from product names
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
  
  console.log('Parsing HTML, length:', html.length);
  
  // PrestaShop uses article.product-miniature for products
  const productPattern = /<article[^>]*class="[^"]*product-miniature[^"]*"[^>]*>[\s\S]*?<\/article>/gi;
  const productMatches = html.match(productPattern);
  
  if (!productMatches) {
    console.log('No product-miniature articles found');
    return products;
  }
  
  console.log(`Found ${productMatches.length} product elements`);

  for (const productHtml of productMatches.slice(0, 100)) {
    try {
      // Extract product name
      const nameMatch = productHtml.match(/<h5[^>]*class="[^"]*product-title[^"]*"[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/i) ||
                       productHtml.match(/itemprop="name"[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/i) ||
                       productHtml.match(/<a[^>]*class="[^"]*product-name[^"]*"[^>]*>([^<]+)<\/a>/i);
      
      const name = nameMatch ? nameMatch[1].trim().replace(/\.{3}$/, '') : '';

      // Extract image
      let image = '/placeholder.svg';
      const fullSizeMatch = productHtml.match(/data-full-size-image-url="([^"]+)"/i);
      const dataSrcMatch = productHtml.match(/<img[^>]*data-src="([^"]+)"[^>]*>/i);
      const srcMatch = productHtml.match(/<img[^>]*src="(https?:\/\/[^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i);
      const anySrcMatch = productHtml.match(/<img[^>]*src="([^"]+)"[^>]*>/i);
      
      if (fullSizeMatch) {
        image = fullSizeMatch[1];
      } else if (dataSrcMatch) {
        image = dataSrcMatch[1];
      } else if (srcMatch) {
        image = srcMatch[1];
      } else if (anySrcMatch && !anySrcMatch[1].includes('data:image') && !anySrcMatch[1].includes('placeholder')) {
        image = anySrcMatch[1];
      }
      
      if (image && !image.startsWith('http') && image !== '/placeholder.svg') {
        image = BASE_URL + image;
      }

      // Extract product URL - this is key for detail page scraping
      const urlMatch = productHtml.match(/<a[^>]*href="([^"]+segmentopositivo\.pt[^"]+)"[^>]*>/i);
      const productUrl = urlMatch ? urlMatch[1] : '';
      const category = extractCategoryFromUrl(productUrl || categoryUrl);
      
      // Extract brand from product name
      const brand = extractBrandFromName(name);

      // Check stock
      const inStock = productHtml.includes('InStock') || 
                     (!productHtml.toLowerCase().includes('esgotado') && 
                      !productHtml.toLowerCase().includes('out of stock'));

      if (name && name.length > 2 && productUrl) {
        products.push({
          name,
          brand,
          category,
          price: 0, // Will be fetched from detail page
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

// Scrape individual product page for accurate price
async function scrapeProductPrice(productUrl: string, apiKey: string): Promise<{ price: number; originalPrice?: number }> {
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: productUrl,
        formats: ['html'],
        onlyMainContent: true,
        waitFor: 2000,
      }),
    });

    if (!response.ok) {
      console.error(`Failed to scrape product page: ${productUrl}`);
      return { price: 0 };
    }

    const data = await response.json();
    const html = data.data?.html || '';
    
    let price = 0;
    let originalPrice: number | undefined;
    
    // Try content attribute first (most reliable)
    const contentPriceMatch = html.match(/itemprop="price"[^>]*content="([^"]+)"/i) ||
                              html.match(/content="([^"]+)"[^>]*itemprop="price"/i);
    
    if (contentPriceMatch) {
      price = parseFloat(contentPriceMatch[1]) || 0;
    }
    
    // If no content price, try other patterns
    if (price === 0) {
      const pricePatterns = [
        /class="current-price"[^>]*>[\s\S]*?<span[^>]*>\s*€?\s*([\d,]+[.,]\d{2})/i,
        /class="product-price"[^>]*>[\s\S]*?€?\s*([\d,]+[.,]\d{2})/i,
        /class="price"[^>]*>\s*€?\s*([\d,]+[.,]\d{2})/i,
        /<span[^>]*class="[^"]*price[^"]*"[^>]*>\s*€?\s*([\d,]+[.,]\d{2})/i,
      ];
      
      for (const pattern of pricePatterns) {
        const match = html.match(pattern);
        if (match) {
          const priceStr = match[1].replace(/\s/g, '').replace(',', '.');
          price = parseFloat(priceStr) || 0;
          if (price > 0) break;
        }
      }
    }
    
    // Try to get original price
    const regularPriceMatch = html.match(/class="regular-price"[^>]*>\s*€?\s*([\d,]+[.,]\d{2})/i);
    if (regularPriceMatch) {
      const origPriceStr = regularPriceMatch[1].replace(/\s/g, '').replace(',', '.');
      originalPrice = parseFloat(origPriceStr) || undefined;
    }
    
    console.log(`Price from detail page ${productUrl}: €${price}`);
    return { price, originalPrice };
  } catch (e) {
    console.error(`Error scraping product price from ${productUrl}:`, e);
    return { price: 0 };
  }
}

// Actual category URLs from the website - limited to avoid rate limits
const CATEGORY_URLS = [
  '', // Homepage - has products in carousel  
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
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl API key not configured', products: [] }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Starting product scrape from segmentopositivo.pt with Firecrawl (detail page prices)');
    
    const allProducts: ScrapedProduct[] = [];
    const seenProducts = new Set<string>();
    
    // Step 1: Scrape category pages to get product list
    for (const categoryPath of CATEGORY_URLS) {
      try {
        const categoryUrl = BASE_URL + categoryPath;
        console.log(`Scraping category: ${categoryUrl}`);
        
        const html = await scrapeWithFirecrawl(categoryUrl, apiKey);
        const products = parseProductsFromHtml(html, categoryUrl);
        
        // Add unique products only
        for (const product of products) {
          const productKey = product.sourceUrl.toLowerCase();
          if (!seenProducts.has(productKey)) {
            seenProducts.add(productKey);
            allProducts.push(product);
          }
        }
        
        console.log(`Category ${categoryPath}: found ${products.length} products (total unique: ${allProducts.length})`);
        
        // Delay between category requests
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (categoryError) {
        console.error(`Error scraping category ${categoryPath}:`, categoryError);
      }
    }
    
    // Step 2: Scrape each product's detail page for accurate price
    console.log(`Fetching prices from ${allProducts.length} product detail pages...`);
    
    for (let i = 0; i < allProducts.length; i++) {
      const product = allProducts[i];
      try {
        const { price, originalPrice } = await scrapeProductPrice(product.sourceUrl, apiKey);
        product.price = price;
        if (originalPrice && originalPrice > price) {
          product.originalPrice = originalPrice;
        }
        console.log(`[${i + 1}/${allProducts.length}] ${product.name}: €${price}`);
        
        // Small delay between product page requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.error(`Failed to get price for ${product.name}:`, e);
      }
    }
    
    // Filter out products with no price
    const validProducts = allProducts.filter(p => p.price > 0);
    
    console.log(`Total products with valid prices: ${validProducts.length}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        products: validProducts,
        timestamp: new Date().toISOString(),
        message: `Scraped ${validProducts.length} products with detail page prices`,
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
