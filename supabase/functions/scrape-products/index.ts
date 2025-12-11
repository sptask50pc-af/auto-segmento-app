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
      const categorySlug = segments[0].toLowerCase();
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

      // Extract product URL and category from it
      const urlMatch = productHtml.match(/<a[^>]*href="([^"]+segmentopositivo\.pt[^"]+)"[^>]*>/i);
      const productUrl = urlMatch ? urlMatch[1] : categoryUrl;
      const category = extractCategoryFromUrl(productUrl);
      
      // Extract brand from product name
      const brand = extractBrandFromName(name);

      // Check stock - look for InStock schema or absence of out-of-stock indicators
      const inStock = productHtml.includes('InStock') || 
                     (!productHtml.toLowerCase().includes('esgotado') && 
                      !productHtml.toLowerCase().includes('out of stock'));

      if (name && name.length > 2) {
        products.push({
          name,
          brand,
          category,
          price,
          image,
          inStock,
          sourceUrl: productUrl,
        });
        console.log(`Parsed product: ${name} | Category: ${category} | Brand: ${brand}`);
      }
    } catch (e) {
      console.error('Error parsing product:', e);
    }
  }

  return products;
}

// Category URLs to scrape for comprehensive product coverage
const CATEGORY_URLS = [
  '/lubrificantes',
  '/lubrificantes/oleos-de-motor',
  '/lubrificantes/oleos-de-transmissao',
  '/lubrificantes/oleos-hidraulicos',
  '/lubrificantes/oleos-especiais',
  '/lubrificantes/liquidos-de-travoes',
  '/lubrificantes/liquidos-de-arrefecimento',
  '/lubrificantes/aditivos-de-oleo',
  '/lubrificantes/aditivos-de-combustivel',
  '/cuidado-detalhe',
  '/cuidado-detalhe/shampoos-limpeza',
  '/cuidado-detalhe/ceras-selantes',
  '/cuidado-detalhe/polimento-correcao',
  '/cuidado-detalhe/exterior',
  '/cuidado-detalhe/interiores',
  '/cuidado-detalhe/vidros-espelhos',
  '/cuidado-detalhe/panos-acessorios',
  '/cuidado-detalhe/odorizantes',
  '/eletrica',
  '/eletrica/baterias',
  '/eletrica/iluminacao-lampadas',
  '/eletrica/fusiveis-reles',
  '/eletrica/cablagens-conectores',
  '/pecas',
  '/pecas/filtros',
  '/pecas/travagem',
  '/pecas/suspensao-direcao',
  '/pecas/motor',
  '/pecas/sistema-escape',
  '/acessorios',
  '/desempenho-upgrade',
  '/universal',
  '/sinaletica-seguranca',
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

    console.log('Starting product scrape from segmentopositivo.pt with Firecrawl');
    
    const allProducts: ScrapedProduct[] = [];
    const seenProducts = new Set<string>();
    
    // Scrape each category page
    for (const categoryPath of CATEGORY_URLS) {
      try {
        const categoryUrl = BASE_URL + categoryPath;
        console.log(`Scraping category: ${categoryUrl}`);
        
        const html = await scrapeWithFirecrawl(categoryUrl, apiKey);
        const products = parseProductsFromHtml(html, categoryUrl);
        
        // Add unique products only
        for (const product of products) {
          const productKey = product.name.toLowerCase();
          if (!seenProducts.has(productKey)) {
            seenProducts.add(productKey);
            allProducts.push(product);
          }
        }
        
        console.log(`Category ${categoryPath}: found ${products.length} products (total unique: ${allProducts.length})`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (categoryError) {
        console.error(`Error scraping category ${categoryPath}:`, categoryError);
        // Continue with other categories even if one fails
      }
    }
    
    console.log(`Total unique products scraped: ${allProducts.length}`);

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
