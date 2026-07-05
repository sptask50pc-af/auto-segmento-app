import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const FIRECRAWL_V2 = "https://api.firecrawl.dev/v2";

interface ProductRow {
  id: string;
  name: string;
  brand: string | null;
  image: string;
}

async function searchImages(query: string, apiKey: string): Promise<string[]> {
  const res = await fetch(`${FIRECRAWL_V2}/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      limit: 5,
      sources: ["images"],
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    console.error("Firecrawl search failed", res.status, t);
    return [];
  }
  const data = await res.json();
  const imgs = data?.data?.images || data?.images || [];
  const urls: string[] = [];
  for (const item of imgs) {
    const u = item?.imageUrl || item?.url || item?.src;
    if (typeof u === "string" && u.startsWith("http")) urls.push(u);
  }
  return urls;
}

async function downloadImage(
  url: string,
): Promise<{ bytes: Uint8Array; contentType: string } | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SegmentoPositivoBot/1.0)",
      },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "image/jpeg";
    if (!ct.startsWith("image/")) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    if (buf.byteLength < 2000) return null; // skip tiny/broken images
    return { bytes: buf, contentType: ct };
  } catch (e) {
    console.error("download error", url, e);
    return null;
  }
}

function extFromContentType(ct: string): string {
  if (ct.includes("png")) return "png";
  if (ct.includes("webp")) return "webp";
  if (ct.includes("gif")) return "gif";
  return "jpg";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");

  if (!firecrawlKey) {
    return new Response(
      JSON.stringify({ success: false, error: "FIRECRAWL_API_KEY not set" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const admin = createClient(supabaseUrl, serviceKey);

  let body: { limit?: number; onlyMissing?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    // ignore
  }
  const limit = Math.min(Math.max(body.limit ?? 25, 1), 100);
  const onlyMissing = body.onlyMissing ?? true;

  // Fetch products that need images
  let query = admin
    .from("products")
    .select("id, name, brand, image")
    .limit(limit);

  if (onlyMissing) {
    // rehost anything not already stored in Supabase storage
    query = query.not("image", "ilike", "%supabase.co/storage%");
  }

  const { data: products, error } = await query;
  if (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const rows = (products || []) as ProductRow[];
  const summary = { total: rows.length, updated: 0, failed: 0 };

  for (const p of rows) {
    try {
      const q = [p.brand, p.name].filter(Boolean).join(" ").trim();
      if (!q) {
        summary.failed++;
        continue;
      }

      const candidates = await searchImages(q, firecrawlKey);
      let uploaded = false;

      for (const url of candidates) {
        const dl = await downloadImage(url);
        if (!dl) continue;

        const ext = extFromContentType(dl.contentType);
        const path = `${p.id}.${ext}`;

        const { error: upErr } = await admin.storage
          .from("product-images")
          .upload(path, dl.bytes, {
            contentType: dl.contentType,
            upsert: true,
          });

        if (upErr) {
          console.error("upload failed", p.id, upErr.message);
          continue;
        }

        const { data: pub } = admin.storage
          .from("product-images")
          .getPublicUrl(path);

        const publicUrl = pub.publicUrl;

        const { error: updErr } = await admin
          .from("products")
          .update({ image: publicUrl })
          .eq("id", p.id);

        if (updErr) {
          console.error("db update failed", p.id, updErr.message);
          continue;
        }

        uploaded = true;
        summary.updated++;
        break;
      }

      if (!uploaded) summary.failed++;

      // small delay to be polite to Firecrawl
      await new Promise((r) => setTimeout(r, 250));
    } catch (e) {
      console.error("product error", p.id, e);
      summary.failed++;
    }
  }

  return new Response(
    JSON.stringify({ success: true, summary }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
