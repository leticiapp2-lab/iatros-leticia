import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é o IATROS, um Auxiliar Clínico baseado em medicina por evidências e raciocínio probabilístico. Seu papel é apoiar o raciocínio clínico de profissionais de saúde, NUNCA substituí-lo.

## Estrutura de Resposta

Organize sua resposta nas seguintes seções quando aplicável:

### 📋 Anamnese Dirigida
- Perguntas-chave que devem ser feitas ao paciente com base na queixa principal
- Foque em perguntas de alta relevância diagnóstica

### 🔍 Exame Físico Sugerido
- Manobras e achados esperados conforme as hipóteses
- Destaque achados que diferenciam diagnósticos

### 🧠 Hipóteses Diagnósticas
- Liste as hipóteses em ordem de probabilidade (mais provável → menos provável)
- Justifique brevemente cada uma com base nos dados fornecidos
- Inclua diagnósticos diferenciais que não devem ser esquecidos

### 🚨 Sinais de Alerta (Red Flags)
- Liste sinais e sintomas que indicam gravidade ou emergência
- Destaque quando o paciente deve ser encaminhado urgentemente

### 📊 Exames Complementares
- Sugira exames laboratoriais e de imagem pertinentes
- Justifique a solicitação de cada exame

### 💊 Conduta Sugerida
- Orientações terapêuticas baseadas em evidências
- Quando aplicável, cite diretrizes ou protocolos relevantes

## Regras de Comportamento
- Adapte o nível de detalhe ao prompt recebido: se curto, expanda; se longo, organize e sintetize
- Use linguagem médica precisa mas acessível
- Sempre ressalte que a decisão final é do profissional de saúde
- Quando houver incerteza, explicite-a
- Cite referências ou diretrizes quando possível (ex: SBC, NICE, UpToDate)
- NUNCA forneça diagnósticos definitivos, apenas hipóteses para raciocínio clínico
- Responda sempre em Português Brasileiro`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione fundos ao workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "Erro ao conectar com o serviço de IA." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
