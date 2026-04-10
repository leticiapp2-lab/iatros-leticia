import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ── Tool definitions ──

const CHECKLIST_TOOL = {
  type: "function",
  function: {
    name: "generate_checklist",
    description: "Gera checklist agrupado por categorias com itens para marcação rápida",
    parameters: {
      type: "object",
      properties: {
        groups: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    question: { type: "string" },
                    type: { type: "string", enum: ["yes_no", "text", "select", "multi_select"] },
                    options: { type: "array", items: { type: "string" } },
                    isRedFlag: { type: "boolean" },
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
            properties: { category: { type: "string" }, content: { type: "string" } },
            required: ["category", "content"],
          },
        },
        prontuario_paragraph: { type: "string" },
        red_flags_found: { type: "array", items: { type: "string" } },
      },
      required: ["structured_summary", "prontuario_paragraph", "red_flags_found"],
    },
  },
};

const OBJECTIVE_SUMMARY_TOOL = {
  type: "function",
  function: {
    name: "generate_objective_summary",
    description: "Gera resumo estruturado do exame físico e parágrafo para prontuário",
    parameters: {
      type: "object",
      properties: {
        structured_summary: {
          type: "array",
          items: {
            type: "object",
            properties: { category: { type: "string" }, content: { type: "string" } },
            required: ["category", "content"],
          },
        },
        prontuario_paragraph: { type: "string" },
        critical_findings: { type: "array", items: { type: "string" } },
      },
      required: ["structured_summary", "prontuario_paragraph", "critical_findings"],
    },
  },
};

const ASSESSMENT_TOOL = {
  type: "function",
  function: {
    name: "generate_assessment",
    description: "Gera avaliação clínica com hipóteses diagnósticas, exames e calculadoras",
    parameters: {
      type: "object",
      properties: {
        hypotheses: {
          type: "array",
          description: "Hipóteses diagnósticas hierarquizadas por probabilidade",
          items: {
            type: "object",
            properties: {
              rank: { type: "number" },
              diagnosis: { type: "string" },
              probability: { type: "string", enum: ["alta", "moderada", "baixa"] },
              reasoning: { type: "string", description: "Justificativa baseada nos achados" },
              criteria: { type: "string", description: "Critérios diagnósticos relevantes (se aplicável)" },
              key_findings_for: { type: "array", items: { type: "string" }, description: "Achados que favorecem" },
              key_findings_against: { type: "array", items: { type: "string" }, description: "Achados que desfavorecem" },
            },
            required: ["rank", "diagnosis", "probability", "reasoning"],
          },
        },
        suggested_exams: {
          type: "array",
          description: "Exames complementares sugeridos",
          items: {
            type: "object",
            properties: {
              exam: { type: "string" },
              justification: { type: "string" },
              priority: { type: "string", enum: ["urgente", "importante", "complementar"] },
            },
            required: ["exam", "justification", "priority"],
          },
        },
        calculators: {
          type: "array",
          description: "Calculadoras/escores clínicos recomendados para este caso",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              purpose: { type: "string" },
              relevance: { type: "string" },
            },
            required: ["name", "purpose"],
          },
        },
        differential_summary: { type: "string", description: "Parágrafo resumo do raciocínio diagnóstico para prontuário" },
        red_flags_assessment: { type: "array", items: { type: "string" }, description: "Alertas de gravidade que exigem ação imediata" },
      },
      required: ["hypotheses", "suggested_exams", "differential_summary"],
    },
  },
};

const PLAN_TOOL = {
  type: "function",
  function: {
    name: "generate_plan",
    description: "Gera plano terapêutico estruturado",
    parameters: {
      type: "object",
      properties: {
        exams_to_request: {
          type: "array",
          description: "Exames a solicitar",
          items: {
            type: "object",
            properties: {
              exam: { type: "string" },
              justification: { type: "string" },
            },
            required: ["exam"],
          },
        },
        therapeutic_measures: {
          type: "array",
          description: "Medidas terapêuticas (medicamentosas e não-medicamentosas)",
          items: {
            type: "object",
            properties: {
              measure: { type: "string" },
              details: { type: "string" },
              type: { type: "string", enum: ["medicamentosa", "nao_medicamentosa", "procedimento"] },
            },
            required: ["measure", "details", "type"],
          },
        },
        patient_orientations: {
          type: "array",
          description: "Orientações ao paciente",
          items: { type: "string" },
        },
        follow_up: {
          type: "object",
          description: "Plano de seguimento",
          properties: {
            return_interval: { type: "string" },
            criteria_return_earlier: { type: "array", items: { type: "string" } },
            monitoring_parameters: { type: "array", items: { type: "string" } },
          },
          required: ["return_interval"],
        },
        referrals: {
          type: "array",
          description: "Encaminhamentos sugeridos",
          items: {
            type: "object",
            properties: {
              specialty: { type: "string" },
              reason: { type: "string" },
              urgency: { type: "string", enum: ["urgente", "prioritario", "eletivo"] },
            },
            required: ["specialty", "reason", "urgency"],
          },
        },
        prontuario_paragraph: { type: "string", description: "Parágrafo para seção Plano do prontuário" },
      },
      required: ["therapeutic_measures", "patient_orientations", "follow_up", "prontuario_paragraph"],
    },
  },
};

// ── Prompts ──

const SUBJECTIVE_CHECKLIST_PROMPT = `Você é um médico clínico experiente com profundo raciocínio clínico probabilístico. Sua tarefa é gerar um CHECKLIST DE ANAMNESE CLINICAMENTE INTELIGENTE, RICO E ALTAMENTE DIRECIONADO.

======================================================================
PROCESSO DE RACIOCÍNIO INTERNO (execute antes de gerar)
======================================================================

1. Identifique a SÍNDROME ou PROBLEMA CLÍNICO PRINCIPAL a partir da queixa.
2. Liste mentalmente os 5-8 DIAGNÓSTICOS DIFERENCIAIS mais prováveis para esse contexto (sexo, idade, tempo de evolução).
3. Liste os DIAGNÓSTICOS GRAVES que NÃO PODEM SER PERDIDOS (tempo-dependentes, potencialmente fatais).
4. Para cada diagnóstico relevante, identifique as perguntas que:
   - AUMENTAM probabilidade (achados típicos)
   - DIMINUEM probabilidade (achados que afastam)
   - SEPARAM hipóteses entre si (discriminatórias)
   - DETECTAM gravidade (red flags)
5. Considere modificadores: idade, sexo, tempo de evolução, contexto epidemiológico.
6. Considere apresentações ATÍPICAS relevantes (idosos, mulheres, imunossuprimidos, etc.).
7. SÓ ENTÃO gere o checklist.

======================================================================
FORMATO OBRIGATÓRIO DOS ITENS
======================================================================

A PRIORIDADE ABSOLUTA é MARCAÇÃO RÁPIDA. Use estes tipos nesta ordem de preferência:

1. **multi_select** (PREFERIDO): Para qualquer pergunta com múltiplas opções possíveis.
   Exemplos: sintomas associados, características da dor, irradiação, fatores de piora/melhora, antecedentes, hábitos.
   SEMPRE inclua opções clínicas prontas + "Nenhum" ou "Não se aplica" quando apropriado.

2. **yes_no**: Para presença/ausência de achados específicos.
   Exemplos: "Febre nas últimas 48h?", "Perda de peso involuntária?", "Já teve episódio semelhante?"

3. **select**: Para escolha ÚNICA entre alternativas mutuamente excludentes.
   Exemplos: intensidade (leve/moderada/intensa), início (súbito/progressivo/recorrente), padrão temporal.

4. **text**: APENAS quando necessário para dados numéricos curtos ou informação impossível de padronizar.
   Exemplos: "Quantos kg perdeu?", "Qual medicamento em uso?", "Há quanto tempo (em dias)?"

REGRA DE OURO: Se uma pergunta pode ser respondida por marcação, NÃO use text.

======================================================================
ESTRUTURA OBRIGATÓRIA DOS GRUPOS
======================================================================

Gere os seguintes grupos (adapte profundidade ao caso, mas inclua TODOS os aplicáveis):

1. **Caracterização da queixa principal**
   - Início: multi_select com [Súbito, Progressivo, Recorrente, Insidioso]
   - Qualidade/Caráter: multi_select com opções específicas para a queixa (ex: dor → Pontada, Queimação, Aperto, Peso, Cólica, Pulsátil, Outro)
   - Localização/Irradiação: multi_select com regiões anatômicas relevantes
   - Intensidade: select com escala (Leve, Moderada, Intensa, Insuportável)
   - Padrão temporal: multi_select com [Contínuo, Intermitente, Cíclico, Piora progressiva, Estável, Melhora espontânea]
   - 8-15 itens

2. **Fatores de piora, melhora e contexto**
   - Fatores que pioram: multi_select com opções clínicas relevantes
   - Fatores que melhoram: multi_select com opções clínicas relevantes
   - Contexto desencadeante: multi_select com opções relevantes
   - 5-10 itens

3. **Sintomas associados**
   - multi_select com sintomas que AUMENTAM ou DIMINUEM probabilidade dos diferenciais
   - Organize por sistema quando houver múltiplos sistemas relevantes
   - Inclua tanto sintomas típicos quanto atípicos
   - 10-20 itens

4. **🚩 Sinais de alarme (Red Flags)** — OBRIGATÓRIO
   - yes_no para cada red flag, TODOS com isRedFlag: true
   - Inclua TODOS os sinais de gravidade, complicações e emergências relevantes
   - Mínimo 5 red flags, adaptados ao caso
   - 5-12 itens

5. **Diferenciação diagnóstica dirigida**
   - Perguntas que ajudam a SEPARAR as hipóteses mais prováveis entre si
   - Perguntas discriminatórias de alta especificidade
   - Critérios clínicos típicos de cada diagnóstico diferencial
   - Apresentações atípicas clinicamente relevantes
   - 8-15 itens

6. **Antecedentes pessoais relevantes**
   - multi_select com comorbidades que impactam o caso
   - Cirurgias/internações: yes_no + text
   - Episódios prévios semelhantes: yes_no + text
   - 5-10 itens

7. **Medicamentos e tratamentos**
   - multi_select para classes de medicamentos em uso relevantes ao caso
   - Tratamentos já tentados para a queixa: multi_select
   - Resposta a tratamentos prévios: select
   - Automedicação e fitoterápicos: yes_no
   - 4-8 itens

8. **Alergias**
   - yes_no para presença de alergias medicamentosas
   - text para especificação quando positivo
   - 2-3 itens

9. **Hábitos e fatores de risco**
   - Tabagismo: select [Nunca, Ex-tabagista, Ativo]
   - Etilismo: select [Não, Social, Regular, Pesado]
   - Outros fatores de risco específicos: multi_select adaptado ao caso
   - Exposições relevantes: multi_select quando aplicável
   - 4-8 itens

10. **História familiar** (quando relevante para o caso)
    - multi_select com doenças familiares que aumentam risco
    - 3-5 itens

11. **Contexto específico** (sexo, idade, epidemiológico)
    - Perguntas adaptadas: contexto reprodutivo para mulheres, exposições por idade, contexto ocupacional
    - 3-8 itens

12. **Impacto funcional e repercussão**
    - multi_select: [Sem limitação, Limita atividades leves, Limita trabalho/estudo, Desperta à noite, Impede atividades habituais]
    - Componente emocional: multi_select relevante
    - 3-5 itens

13. **Exclusão de diagnósticos graves** (se não coberto nos red flags)
    - yes_no para sintomas que excluiriam/confirmariam diagnósticos graves não cobertos acima
    - 3-8 itens

======================================================================
REGRAS FINAIS
======================================================================

- Gere 60-120 itens no total, distribuídos nos grupos relevantes ao caso
- PRIORIZE multi_select e yes_no (>80% dos itens devem ser de marcação)
- text deve representar <10% dos itens
- Cada multi_select deve ter 4-10 opções clínicas prontas
- Adapte COMPLETAMENTE ao sexo, idade, queixa e tempo de evolução
- As perguntas devem parecer feitas POR UM MÉDICO EXPERIENTE para AQUELE caso específico
- NÃO faça diagnósticos — apenas investigue
- NÃO gere checklist genérico — cada pergunta deve ter função diagnóstica clara
- Pense: "que pergunta mudaria minha conduta ou meu ranking de hipóteses?"

Você DEVE responder usando a função generate_checklist.`;

const SUBJECTIVE_SUMMARY_PROMPT = `Você é um assistente clínico. Com base EXCLUSIVAMENTE nos dados preenchidos pelo usuário, gere:

1. Um resumo estruturado em tópicos do subjetivo
2. Um parágrafo único pronto para prontuário médico

REGRAS CRÍTICAS:
- NUNCA invente dados não fornecidos
- Campos não preenchidos devem ser ignorados ou marcados como "Não avaliado"
- Use linguagem médica objetiva
- O parágrafo deve ser coeso, sem floreios, fiel aos dados
- NÃO faça suposições

Você DEVE responder usando a função generate_summary.`;

const OBJECTIVE_CHECKLIST_PROMPT = `Você é um assistente clínico. Com base no subjetivo coletado, gere um CHECKLIST DE EXAME FÍSICO DIRECIONADO.

REGRAS:
- Personalize conforme o caso clínico
- Use tipos: yes_no para achados positivo/negativo, text para valores/descrições, select para opções
- Marque isRedFlag achados de gravidade
- NÃO inclua exames genéricos irrelevantes
- Máximo 8-12 itens por grupo

Você DEVE responder usando a função generate_checklist.`;

const OBJECTIVE_SUMMARY_PROMPT = `Você é um assistente clínico. Com base EXCLUSIVAMENTE nos achados de exame físico preenchidos, gere:

1. Um resumo estruturado em tópicos do exame físico
2. Um parágrafo único pronto para a seção de Objetivo do prontuário

REGRAS CRÍTICAS:
- NUNCA invente achados não preenchidos
- Use linguagem médica objetiva e padronizada
- Liste achados críticos separadamente

Você DEVE responder usando a função generate_objective_summary.`;

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

Você DEVE responder usando a função generate_checklist.`;

const ASSESSMENT_PROMPT = `Você é um assistente clínico experiente. Com base em TODO o caso clínico (dados iniciais + subjetivo + objetivo), gere uma AVALIAÇÃO CLÍNICA COMPLETA.

Você DEVE:
1. Listar hipóteses diagnósticas HIERARQUIZADAS por probabilidade (alta/moderada/baixa)
2. Para cada hipótese: justificar com achados a favor e contra
3. Indicar critérios diagnósticos relevantes quando aplicável
4. Sugerir exames complementares com justificativa e prioridade
5. Recomendar calculadoras/escores clínicos pertinentes
6. Gerar um parágrafo resumo do raciocínio diagnóstico para prontuário
7. Alertar sobre red flags que exigem ação imediata

REGRAS CRÍTICAS:
- Base-se EXCLUSIVAMENTE nos dados coletados
- NÃO confirme diagnósticos — apresente probabilidades
- Priorize hipóteses mais prováveis e mais graves
- Inclua diagnósticos diferenciais relevantes
- Seja objetivo e baseado em evidências

Você DEVE responder usando a função generate_assessment.`;

const PLAN_PROMPT = `Você é um assistente clínico experiente. Com base em TODO o caso clínico (subjetivo + objetivo + avaliação), gere um PLANO TERAPÊUTICO COMPLETO.

Você DEVE gerar:
1. Exames a solicitar (se não cobertos na avaliação)
2. Medidas terapêuticas (medicamentosas e não-medicamentosas)
3. Orientações ao paciente (linguagem acessível)
4. Plano de seguimento (retorno, critérios de retorno antecipado, parâmetros de monitorização)
5. Encaminhamentos necessários com urgência
6. Parágrafo para seção Plano do prontuário

REGRAS CRÍTICAS:
- Base-se nas hipóteses da avaliação
- Priorize medidas para as hipóteses mais prováveis
- Inclua medidas de urgência para red flags
- Orientações devem ser claras e em linguagem acessível
- Para medicamentos: NÃO prescreva doses específicas (é papel do preceptor) — apenas sugira classes ou princípios ativos com indicação
- Seja prático e objetivo

Você DEVE responder usando a função generate_plan.`;

// ── Helper ──

function buildResponse(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function callAI(systemPrompt: string, userPrompt: string, tools: any[], toolChoice: any, apiKey: string) {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
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
    if (response.status === 429) return buildResponse({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }, 429);
    if (response.status === 402) return buildResponse({ error: "Créditos insuficientes. Adicione fundos ao workspace." }, 402);
    const text = await response.text();
    console.error("AI gateway error:", response.status, text);
    return buildResponse({ error: "Erro ao conectar com o serviço de IA." }, 500);
  }

  const result = await response.json();
  const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];

  if (!toolCall) {
    console.error("No tool call in response:", JSON.stringify(result));
    return buildResponse({ error: "Resposta inesperada do modelo de IA." }, 500);
  }

  return buildResponse(JSON.parse(toolCall.function.arguments));
}

// ── Handler ──

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();

    if (!action || !data) return buildResponse({ error: "action and data are required" }, 400);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    switch (action) {
      case "generate-subjective-checklist": {
        const isReturn = data.consultationType === "retorno";
        const prompt = isReturn ? RETURN_CHECKLIST_PROMPT : SUBJECTIVE_CHECKLIST_PROMPT;
        const userPrompt = isReturn
          ? `SOAP anterior:\n${data.previousSoap || "Não informado"}\n\nAtualização do retorno:\n${data.returnUpdate || "Não informado"}\n\nNova queixa: ${data.newComplaint || "Nenhuma"}\n\nEvolução: ${data.evolution || "Não informado"}`
          : `Sexo: ${data.sex}\nIdade: ${data.age}\nQueixa principal: ${data.chiefComplaint}\nTempo de evolução: ${data.duration}`;
        return callAI(prompt, userPrompt, [CHECKLIST_TOOL], { type: "function", function: { name: "generate_checklist" } }, LOVABLE_API_KEY);
      }

      case "generate-subjective-summary": {
        const userPrompt = `Dados iniciais:\nSexo: ${data.sex || "?"}, Idade: ${data.age || "?"}, Queixa: ${data.chiefComplaint || "?"}, Tempo: ${data.duration || "?"}\n\nRespostas do checklist:\n${JSON.stringify(data.answers, null, 2)}\n\nObservações livres:\n${data.freeText || "Nenhuma"}`;
        return callAI(SUBJECTIVE_SUMMARY_PROMPT, userPrompt, [SUBJECTIVE_SUMMARY_TOOL], { type: "function", function: { name: "generate_summary" } }, LOVABLE_API_KEY);
      }

      case "generate-objective-checklist": {
        const userPrompt = `Dados iniciais:\nSexo: ${data.sex || "?"}, Idade: ${data.age || "?"}, Queixa: ${data.chiefComplaint || "?"}, Tempo: ${data.duration || "?"}\n\nResumo do Subjetivo:\n${data.subjectiveSummary || "Não disponível"}\n\nRed flags identificados:\n${JSON.stringify(data.redFlags || [])}`;
        return callAI(OBJECTIVE_CHECKLIST_PROMPT, userPrompt, [CHECKLIST_TOOL], { type: "function", function: { name: "generate_checklist" } }, LOVABLE_API_KEY);
      }

      case "generate-objective-summary": {
        const userPrompt = `Dados iniciais:\nSexo: ${data.sex || "?"}, Idade: ${data.age || "?"}, Queixa: ${data.chiefComplaint || "?"}\n\nResumo do Subjetivo:\n${data.subjectiveSummary || "Não disponível"}\n\nAchados do exame físico:\n${JSON.stringify(data.answers, null, 2)}\n\nObservações livres:\n${data.freeText || "Nenhuma"}`;
        return callAI(OBJECTIVE_SUMMARY_PROMPT, userPrompt, [OBJECTIVE_SUMMARY_TOOL], { type: "function", function: { name: "generate_objective_summary" } }, LOVABLE_API_KEY);
      }

      case "generate-assessment": {
        const userPrompt = `CASO CLÍNICO COMPLETO:

Dados iniciais:
Sexo: ${data.sex || "?"}, Idade: ${data.age || "?"}, Queixa principal: ${data.chiefComplaint || "?"}, Tempo de evolução: ${data.duration || "?"}

SUBJETIVO (Anamnese):
${data.subjectiveSummary || "Não disponível"}

Red flags do subjetivo:
${JSON.stringify(data.subjectiveRedFlags || [])}

OBJETIVO (Exame Físico):
${data.objectiveSummary || "Não disponível"}

Achados críticos do exame físico:
${JSON.stringify(data.criticalFindings || [])}`;
        return callAI(ASSESSMENT_PROMPT, userPrompt, [ASSESSMENT_TOOL], { type: "function", function: { name: "generate_assessment" } }, LOVABLE_API_KEY);
      }

      case "generate-plan": {
        const userPrompt = `CASO CLÍNICO COMPLETO:

Dados iniciais:
Sexo: ${data.sex || "?"}, Idade: ${data.age || "?"}, Queixa principal: ${data.chiefComplaint || "?"}

SUBJETIVO:
${data.subjectiveSummary || "Não disponível"}

OBJETIVO:
${data.objectiveSummary || "Não disponível"}

AVALIAÇÃO:
Hipóteses diagnósticas:
${JSON.stringify(data.hypotheses || [], null, 2)}

Exames sugeridos na avaliação:
${JSON.stringify(data.suggestedExams || [], null, 2)}

Red flags / alertas:
${JSON.stringify(data.redFlagsAssessment || [])}`;
        return callAI(PLAN_PROMPT, userPrompt, [PLAN_TOOL], { type: "function", function: { name: "generate_plan" } }, LOVABLE_API_KEY);
      }

      default:
        return buildResponse({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (e) {
    console.error("consulta-ai error:", e);
    return buildResponse({ error: e instanceof Error ? e.message : "Erro desconhecido" }, 500);
  }
});
