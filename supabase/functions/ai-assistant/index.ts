import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Você é um assistente especializado em peças e acessórios automóveis para a loja Auto Segmento.

Suas responsabilidades:
- Ajudar clientes a encontrar peças e produtos para os seus veículos
- Fornecer informações sobre categorias de produtos (Peças, Lubrificantes, Acessórios, Cuidado e Detalhe, Desempenho, Elétrica, Universal, Sinalética)
- Recomendar produtos baseado nas necessidades do cliente
- Responder perguntas sobre manutenção automóvel
- Ser amigável e profissional

Categorias disponíveis:
- Peças: Carroçaria, Travagem, Filtros, Suspensão e Direção, Motor, Sistema de Escape
- Lubrificantes: Óleos de Motor, Óleos de Transmissão, Líquidos de Travões, Líquidos de Arrefecimento, Aditivos
- Acessórios: Interior, Exterior, Multimédia e Eletrónica, Conforto e Utilitários
- Cuidado e Detalhe: Shampoos, Ceras, Polimento, Limpeza Interior/Exterior
- Desempenho e Upgrade: Filtros Desportivos, Escapes, Suspensões, Jantes
- Elétrica: Baterias, Iluminação, Interruptores, Fusíveis
- Universal: Ferramentas, Fixações, Adesivos
- Sinalética e Segurança: Kits de Emergência, Coletes, Triângulos, Extintores

Responda sempre em Português de Portugal. Seja conciso mas útil.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de pedidos excedido. Por favor tente novamente mais tarde." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Por favor adicione créditos." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Erro ao comunicar com o assistente" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("AI assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
