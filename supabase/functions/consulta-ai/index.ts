import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUBJECTIVE_CHECKLIST_PROMPT = `Você é um assistente clínico para estudantes de medicina. Com base nos dados iniciais fornecidos (sexo, idade, queixa principal, tempo de evolução), gere um checklist de anamnese altamente direcionado.

REGRAS:
- Gere perguntas curtas, objetivas e clinicamente úteis
- Agrupe por categorias
- Foque em perguntas que MUDAM a probabilidade diagnóstica
- Inclua red flags obrigatórios
- Adapte ao sexo, idade e contexto
- Evite perguntas genéricas ou irrelevantes
- NÃO faça diagnósticos
- Máximo 8-12 perguntas por grupo, priorizando as mais importantes

Você DEVE responder usando a função generate_checklist.`;

const SUBJECTIVE_CHECKLIST_TOOL = {
  type: "function",
  function: {
    name: "generate_checklist",
    description: "Gera checklist de anamnese agrupado por categorias",
    parameters: {
      type: "object",
      properties: {
        groups: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", description: "ID único do grupo (slug)" },
              title: { type: "string", description: "Título do grupo com emoji" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string", description: "ID único do item" },
                    question: { type: "string", description: "Pergunta curta e objetiva" },
                    type: {
                      type: "string",
                      enum: ["yes_no", "text", "select"],
                      description: "Tipo de resposta esperada",
                    },
                    options: {
                      type: "array",
                      items: { type: "string" },
                      description: "Opções para tipo select",
                    },
                    isRedFlag: {
                      type: "boolean",
                      description: "Se é um sinal de alarme",
                    },
                  },
                  required: ["id", "question", "type"],
                },
              },
            },
            required: ["id", "title", "items"],
          },
        },
      },
      required: ["groups"],
    },
  },
};

const SUBJECTIVE_SUMMARY_PROMPT = `Você é um assistente clínico. Com base EXCLUSIVAMENTE nos dados preenchidos pelo usuário, gere:

1. Um resumo estruturado em tópicos do subjetivo
2. Um parágrafo único pronto para prontuário médico

REGRAS CRÍTICAS:
- NUNCA invente dados não fornecidos
- Campos não preenchidos devem ser ignorados ou marcados como "Não avaliado"
- Use linguagem médica objetiva
- O parágrafo deve ser coeso, sem floreios, fiel aos dados
- Distingua claramente entre dados coletados e informações ausentes
- NÃO faça suposições ou preencha lacunas

Você DEVE responder usando a função generate_summary.`;

const SUBJECTIVE_SUMMARY_TOOL = {
  type: "function",
  function: {
    name: "generate_summary",
    description: "Gera resumo estruturado e parágrafo para prontuário",
    parameters: {
      type: "object",
      properties: {
        structured_summary: {
          type: "array",
          items: {
            type: "object",
            properties: {
              category: { type: "string" },
              content: { type: "string" },
            },
            required: ["category", "content"],
          },
          description: "Resumo estruturado em tópicos por categoria",
        },
        prontuario_paragraph: {
          type: "string",
          description: "Parágrafo único pronto para prontuário, apenas com dados coletados",
        },
        red_flags_found: {
          type: "array",
          items: { type: "string" },
          description: "Red flags identificados nos dados preenchidos",
        },
      },
      required: ["structured_summary", "prontuario_paragraph", "red_flags_found"],
    },
  },
};

const RETURN_CHECKLIST_PROMPT = `Você é um assistente clínico. O usuário está realizando uma CONSULTA DE RETORNO. Com base no SOAP anterior e na atualização fornecida, gere um checklist de anamnese focado em:
- Evolução desde a última consulta
- Adesão ao tratamento
- Novos sintomas ou mudanças
- Efeitos colaterais
- Impacto funcional atual
- Red flags de progressão

REGRAS:
- Perguntas curtas, objetivas, direcionadas ao seguimento
- Adapte ao contexto da consulta anterior
- NÃO repita toda anamnese — foque na evolução
- Inclua nova queixa se informada

Você DEVE responder usando a função generate_checklist.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();

    if (!action || !data) {
      return new Response(
        JSON.stringify({ error: "action and data are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt: string;
    let userPrompt: string;
    let tools: any[];
    let toolChoice: any;

    switch (action) {
      case "generate-subjective-checklist": {
        const isReturn = data.consultationType === "retorno";
        systemPrompt = isReturn ? RETURN_CHECKLIST_PROMPT : SUBJECTIVE_CHECKLIST_PROMPT;

        if (isReturn) {
          userPrompt = `SOAP anterior:\n${data.previousSoap || "Não informado"}\n\nAtualização do retorno:\n${data.returnUpdate || "Não informado"}\n\nNova queixa: ${data.newComplaint || "Nenhuma"}\n\nEvolução: ${data.evolution || "Não informado"}`;
        } else {
          userPrompt = `Sexo: ${data.sex}\nIdade: ${data.age}\nQueixa principal: ${data.chiefComplaint}\nTempo de evolução: ${data.duration}`;
        }

        tools = [SUBJECTIVE_CHECKLIST_TOOL];
        toolChoice = { type: "function", function: { name: "generate_checklist" } };
        break;
      }

      case "generate-subjective-summary": {
        systemPrompt = SUBJECTIVE_SUMMARY_PROMPT;
        userPrompt = `Dados iniciais:\nSexo: ${data.sex || "?"}, Idade: ${data.age || "?"}, Queixa: ${data.chiefComplaint || "?"}, Tempo: ${data.duration || "?"}\n\nRespostas do checklist:\n${JSON.stringify(data.answers, null, 2)}\n\nObservações livres:\n${data.freeText || "Nenhuma"}`;

        tools = [SUBJECTIVE_SUMMARY_TOOL];
        toolChoice = { type: "function", function: { name: "generate_summary" } };
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools,
        tool_choice: toolChoice,
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

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      console.error("No tool call in response:", JSON.stringify(result));
      return new Response(
        JSON.stringify({ error: "Resposta inesperada do modelo de IA." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const parsed = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("consulta-ai error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
