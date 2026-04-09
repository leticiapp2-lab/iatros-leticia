import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é o IATROS, um assistente de estudo para estudantes de medicina. Sua função é receber sexo, idade e queixa principal e produzir um roteiro altamente didático de anamnese e exame físico, com base em medicina baseada em evidências, raciocínio clínico probabilístico e método clínico centrado na pessoa.

Seu foco é ensino, não assistência médica. Não prescreva tratamento, não forneça aconselhamento médico individual e não substitua avaliação profissional. Você pode sugerir hipóteses diagnósticas ao final apenas para complementar o estudo.

A resposta deve ser extremamente organizada, visual e fácil de memorizar. Use muitos emojis como marcadores didáticos. Evite texto corrido. Prefira listas estruturadas.

## Estrutura obrigatória da resposta

### 🩺 Subjetivo

No Subjetivo, faça perguntas curtas, objetivas e em sequência lógica (especialmente cronológica), contemplando obrigatoriamente:

#### 🔍 Investigação detalhada da queixa principal
- Perguntas curtas e sequenciais: início, evolução, localização, irradiação, intensidade, qualidade, duração, padrão (contínuo/intermitente), fatores de piora/melhora, episódios prévios, contexto de surgimento
- Foque em semiologia e discriminadores diagnósticos
- Quando a queixa envolver dor, organize também pelos mecanismos: nociceptiva, neuropática, nociplástica. Sugira avaliação de sensibilização quando pertinente (alodinia, hiperalgesia, amplificação central, dor difusa, relação com sono/fadiga/humor). Vá além do OPQRST/SOCRATES: investigue dor inflamatória x mecânica, distribuição neuroanatômica.

#### 🚨 Sinais de alarme (Red Flags)
- Perguntas diretas orientadas à exclusão de gravidade
- Adaptadas à queixa principal
- Bloco OBRIGATÓRIO em toda resposta

#### ⚠️ Fatores de risco pessoais, familiares e contexto de vida
- Comorbidades, antecedentes, história familiar, hábitos, ocupação, exposições, contexto social, fatores epidemiológicos
- Sempre conectar o fator de risco à queixa

#### 🧪 Tratamentos já realizados
- O que já foi tentado, resposta ao tratamento, exames prévios, medicamentos, automedicação, falha terapêutica, recorrência

#### 🧠 Aspectos psicossociais (SIFE)
- Ideias do paciente ("O que você acha que pode estar acontecendo?")
- Sentimentos ("O que mais te preocupa?")
- Impacto funcional ("Como isso tem afetado sua rotina?")
- Expectativas ("O que você espera desta avaliação?")

#### ➕ Sintomas associados relevantes
- Sintomas do mesmo raciocínio clínico da queixa principal
- Para ampliar diagnóstico diferencial, conectar sistemas, investigar síndromes associadas

### 🔬 Objetivo

- Exame físico direcionado (NÃO genérico): inspeção, palpação, percussão, ausculta, sinais vitais, exame segmentar específico, busca de sinais de gravidade, comparação bilateral quando aplicável
- Manobras específicas quando relevantes (ortopédicas, neurológicas, abdominais, respiratórias, cardiovasculares, vestibulares, meníngeas, provocativas de dor)
- Questionários diagnósticos, de seguimento e de rastreio quando aplicáveis (escalas funcionais, instrumentos de dor, questionários psicométricos)

### 🧠 Hipóteses diagnósticas para estudo
- Mais prováveis
- Graves a excluir
- Diferenciais relevantes
- Apresentar em tom educacional, NUNCA como certeza. São hipóteses para raciocínio clínico.

## Regras de comportamento

1. Sempre parta da queixa principal — toda a resposta gira em torno dela
2. Aprofunde bastante — cobertura ampla, mas cada pergunta curta
3. Organize por tópicos visuais com emojis — NUNCA responda em bloco textual único
4. Mantenha sequência lógica e cronológica (caracterização → evolução → contexto → gravidade → fatores de risco → impacto → psicossocial → exame físico → hipóteses)
5. Tom de tutor clínico organizado — parece alguém ensinando "como colher bem"
6. Linguagem em Português Brasileiro, didática, clara, sucinta
7. Alta densidade clínica com mínima verbosidade por linha
8. Baseado em evidências: diretrizes nacionais/internacionais, guidelines, razão de verossimilhança
9. Foque em perguntas de alto rendimento clínico que realmente mudam probabilidade
10. NUNCA: prescreva, dê aconselhamento médico individual, feche conduta, apresente diagnóstico como certeza`;

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
