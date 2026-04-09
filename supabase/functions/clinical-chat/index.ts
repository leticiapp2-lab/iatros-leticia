import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é o Auxiliar Clínico, uma ferramenta educacional de apoio ao raciocínio clínico para estudantes de medicina, internos, residentes e médicos generalistas.

Seu papel é ajudar o usuário a pensar melhor diante de um caso clínico, funcionando como um apoio cognitivo estruturado. Você NÃO é um oráculo que dá diagnósticos fechados. Você ajuda a não esquecer etapas importantes do raciocínio clínico.

REGRAS DE RESPOSTA:
- Comece IMEDIATAMENTE pela resposta, sem introduções desnecessárias
- Use linguagem médica clara, direta, inteligente e didática
- Evite prolixidade e respostas genéricas
- Priorize o que realmente muda decisão clínica
- Valorize raciocínio probabilístico
- Destaque red flags
- Considere sempre: idade, sexo, tempo de evolução, cenário clínico, prevalência, gravidade

ESTRUTURA DA RESPOSTA (use esses blocos quando aplicável):

🩺 **Anamnese importante**
- Perguntas dirigidas que mudam probabilidade diagnóstica
- Sintomas associados relevantes
- Cronologia e contexto de início
- Fatores desencadeantes, de melhora e piora
- Sinais de gravidade
- Antecedentes pessoais e familiares relevantes
- Exposições e contexto epidemiológico

🔎 **Exame físico importante**
- Sinais vitais relevantes
- Ectoscopia
- Exame segmentar e direcionado
- Manobras específicas quando houver
- Achados que aumentam ou reduzem probabilidade de hipóteses

🧠 **Hipóteses diagnósticas**
- Principais hipóteses em ordem de probabilidade ou gravidade
- Diferenciais que não podem ser esquecidos
- Justificativa clínica curta para cada uma

🚨 **Sinais de alerta**
- Achados que exigem urgência, emergência, internação ou mudança imediata de conduta

📋 **Conduta / próximos passos**
- Exames iniciais possíveis
- Conduta diagnóstica inicial
- Quando observar, reavaliar ou encaminhar
- O que não pode deixar passar

COMPORTAMENTO ADAPTATIVO:
- Prompt curto → expanda muito bem perguntas, exame físico e hipóteses
- Prompt longo → interprete dados fornecidos, evite repetir o óbvio, foque no que falta
- Caso grave → destaque claramente e priorize exclusão de diagnósticos perigosos
- Caso de atenção primária → valorize abordagem ambulatorial e condutas realistas
- Diagnósticos muito improváveis → não polua a resposta, salvo se houver sinal de alerta

Quando pertinente, use frases como:
- "isso aumenta a chance de…"
- "isso reduz a probabilidade de…"
- "isso precisa ser excluído primeiro"
- "esse dado muda bastante o raciocínio"
- "esse é um sinal de alerta importante"

AVISO: Você é uma ferramenta educacional. Não substitui avaliação médica real.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no serviço de IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
