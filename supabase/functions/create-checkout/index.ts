import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  product_id: string;
  name: string;
  price: number; // Client-supplied, NOT trusted
  quantity: number;
  image?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY not configured");
      throw new Error("Stripe not configured");
    }

    const { items } = await req.json() as { items: CartItem[] };

    if (!items || items.length === 0) {
      throw new Error("No items provided");
    }

    console.log("Creating checkout session for", items.length, "items");

    // ========== SERVER-SIDE PRICE VALIDATION ==========
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get product IDs from items
    const productIds = items.map(item => item.product_id).filter(Boolean);
    
    if (productIds.length === 0) {
      throw new Error("Invalid cart items: missing product IDs");
    }

    // Fetch real prices from database
    const { data: products, error: dbError } = await supabase
      .from('products')
      .select('id, name, price, image')
      .in('id', productIds);

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to validate products");
    }

    if (!products || products.length === 0) {
      throw new Error("No valid products found");
    }

    // Create a map of product_id -> product for quick lookup
    const productMap = new Map(products.map(p => [p.id, p]));

    // Validate and build line items with DATABASE prices
    const lineItems = items.map((item) => {
      const dbProduct = productMap.get(item.product_id);
      
      if (!dbProduct) {
        throw new Error(`Product not found: ${item.name || item.product_id}`);
      }

      // Use database price, NOT client-supplied price
      const validatedPrice = dbProduct.price;
      const validatedName = dbProduct.name;
      const validatedImage = dbProduct.image;

      // Validate quantity
      const quantity = Math.max(1, Math.min(100, item.quantity));

      console.log(`Validated: ${validatedName} @ €${validatedPrice} x ${quantity}`);

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: validatedName,
            images: validatedImage && validatedImage !== "/placeholder.svg" ? [validatedImage] : [],
          },
          unit_amount: Math.round(validatedPrice * 100), // Convert to cents
        },
        quantity,
      };
    });
    // ========== END PRICE VALIDATION ==========

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Get origin from request headers for redirect URLs
    const origin = req.headers.get("origin") || "https://preview--giyxivnpvezhmphqzdlx.lovable.app";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/checkout/success`,
      cancel_url: `${origin}/cart`,
      shipping_address_collection: {
        allowed_countries: ["PT", "ES", "FR", "DE", "IT", "GB"],
      },
      // Custom branding options
      custom_text: {
        submit: {
          message: "Segmento Positivo - Peças Automotivas Premium",
        },
      },
      locale: "pt",
      payment_intent_data: {
        description: "Compra - Segmento Positivo",
      },
    });

    console.log("Checkout session created:", session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
