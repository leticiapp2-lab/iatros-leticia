import { DiseaseFlowchart } from "./types";

/* ════════════════════════════════════════════════════
   1. DEPRESSÃO (TDM) — DSM-5
   ════════════════════════════════════════════════════ */
const depressao: DiseaseFlowchart = {
  diseaseId: "depressao",
  name: "Depressão (Transtorno Depressivo Maior)",
  shortName: "Depressão",
  startId: "d1",
  steps: [
    { id: "d1", type: "question", text: "O paciente apresenta humor deprimido OU anedonia na maioria dos dias, por ≥2 semanas?", yesNext: "d2", noNext: "d-no" },
    { id: "d2", type: "question", text: "Há ≥5 sintomas totais (incluindo pelo menos 1 nuclear)?\n(peso/apetite, sono, psicomotor, fadiga, culpa, concentração, ideação suicida)", yesNext: "d3", noNext: "d-insuf" },
    { id: "d3", type: "question", text: "Os sintomas causam sofrimento clinicamente significativo ou prejuízo funcional?", yesNext: "d4", noNext: "d-insuf2" },
    { id: "d4", type: "question", text: "Os sintomas NÃO são atribuíveis a substância ou condição médica?", yesNext: "d5", noNext: "d-sec" },
    { id: "d5", type: "question", text: "O episódio NÃO é melhor explicado por transtorno psicótico?", yesNext: "d-yes", noNext: "d-psic" },
    { id: "d-yes", type: "conclusion", text: "Critérios DSM-5 para Transtorno Depressivo Maior preenchidos.", isPositive: true, detail: "Classificar gravidade: leve (5-6 sx), moderado (7-8 sx), grave (9 sx ou ideação suicida ativa)." },
    { id: "d-no", type: "conclusion", text: "Critérios NÃO preenchidos para TDM.", isPositive: false, detail: "Considerar distimia, transtorno de adaptação ou tristeza normal." },
    { id: "d-insuf", type: "conclusion", text: "Número insuficiente de sintomas para TDM.", isPositive: false, detail: "Se 2-4 sintomas por ≥2 semanas, considerar Episódio Depressivo Sublimiar ou Distimia." },
    { id: "d-insuf2", type: "conclusion", text: "Sem prejuízo funcional significativo.", isPositive: false, detail: "Monitorar evolução. Reavaliar se houver piora." },
    { id: "d-sec", type: "conclusion", text: "Sintomas atribuíveis a substância ou condição médica.", isPositive: false, detail: "Investigar: hipotireoidismo, anemia, medicações depressogênicas, uso de álcool/drogas." },
    { id: "d-psic", type: "conclusion", text: "Melhor explicado por transtorno psicótico.", isPositive: false, detail: "Considerar Transtorno Esquizoafetivo ou Esquizofrenia com sintomas depressivos." },
  ],
  mermaid: `graph TD
    D1["Humor deprimido OU anedonia\\npor >= 2 semanas?"]
    D1 -->|Sim| D2[">=5 sintomas totais?\\n(incl. >=1 nuclear)"]
    D1 -->|Nao| DN["Nao preenche TDM\\nConsiderar distimia"]
    D2 -->|Sim| D3["Sofrimento / prejuizo\\nfuncional significativo?"]
    D2 -->|Nao| DI["Sintomas insuficientes\\nConsiderar sublimiar"]
    D3 -->|Sim| D4["Atribuivel a substancia\\nou condicao medica?"]
    D3 -->|Nao| DI2["Sem prejuizo funcional\\nMonitorar"]
    D4 -->|Nao| D5["Melhor explicado por\\ntranstorno psicotico?"]
    D4 -->|Sim| DS["Investigar causa\\nsecundaria"]
    D5 -->|Nao| DY["TDM - Criterios\\nDSM-5 preenchidos"]
    D5 -->|Sim| DP["Transtorno psicotico"]
    style DY fill:#22c55e,color:#fff
    style DN fill:#ef4444,color:#fff
    style DI fill:#f59e0b,color:#000
    style DI2 fill:#f59e0b,color:#000
    style DS fill:#ef4444,color:#fff
    style DP fill:#ef4444,color:#fff`,
};

/* ════════════════════════════════════════════════════
   2. TAG — DSM-5
   ════════════════════════════════════════════════════ */
const tag: DiseaseFlowchart = {
  diseaseId: "tag",
  name: "Transtorno de Ansiedade Generalizada",
  shortName: "TAG",
  startId: "t1",
  steps: [
    { id: "t1", type: "question", text: "Preocupação excessiva e persistente, na maioria dos dias, por >6 meses?", yesNext: "t2", noNext: "t-no" },
    { id: "t2", type: "question", text: "O paciente tem dificuldade em controlar a preocupação?", yesNext: "t3", noNext: "t-no" },
    { id: "t3", type: "question", text: "Há ≥3 sintomas associados?\n(inquietação, fadiga, concentração, irritabilidade, tensão muscular, sono)", yesNext: "t4", noNext: "t-insuf" },
    { id: "t4", type: "question", text: "Causa sofrimento clinicamente significativo ou prejuízo funcional?", yesNext: "t-yes", noNext: "t-func" },
    { id: "t-yes", type: "conclusion", text: "Critérios DSM-5 para TAG preenchidos.", isPositive: true },
    { id: "t-no", type: "conclusion", text: "Critérios NÃO preenchidos para TAG.", isPositive: false, detail: "Considerar ansiedade situacional ou transtorno de adaptação." },
    { id: "t-insuf", type: "conclusion", text: "Sintomas associados insuficientes (<3).", isPositive: false, detail: "Reavaliar; considerar outros transtornos de ansiedade." },
    { id: "t-func", type: "conclusion", text: "Sem prejuízo funcional significativo.", isPositive: false, detail: "Monitorar e orientar medidas não farmacológicas." },
  ],
  mermaid: `graph TD
    T1["Preocupacao excessiva\\n> 6 meses?"]
    T1 -->|Sim| T2["Dificuldade em\\ncontrolar preocupacao?"]
    T1 -->|Nao| TN["Nao preenche TAG"]
    T2 -->|Sim| T3[">=3 sintomas associados?"]
    T2 -->|Nao| TN
    T3 -->|Sim| T4["Prejuizo funcional?"]
    T3 -->|Nao| TI["Sintomas insuficientes"]
    T4 -->|Sim| TY["TAG - Criterios\\nDSM-5 preenchidos"]
    T4 -->|Nao| TF["Sem prejuizo\\nMonitorar"]
    style TY fill:#22c55e,color:#fff
    style TN fill:#ef4444,color:#fff
    style TI fill:#f59e0b,color:#000
    style TF fill:#f59e0b,color:#000`,
};

/* ════════════════════════════════════════════════════
   3. LES — EULAR/ACR 2019
   ════════════════════════════════════════════════════ */
const les: DiseaseFlowchart = {
  diseaseId: "les",
  name: "Lupus Eritematoso Sistêmico",
  shortName: "LES",
  startId: "l1",
  steps: [
    { id: "l1", type: "question", text: "ANA ≥1:80 por imunofluorescência indireta?", yesNext: "l2", noNext: "l-no" },
    { id: "l2", type: "question", text: "Há critérios clínicos presentes?\n(febre, citopenias, cutâneos, articular, renal, serosite, neurológico)", yesNext: "l3", noNext: "l-noc" },
    { id: "l3", type: "question", text: "Há critérios imunológicos presentes?\n(anti-dsDNA, anti-Smith, antifosfolípides, complemento baixo)", yesNext: "l4", noNext: "l4" },
    { id: "l4", type: "question", text: "A soma total de pontos (clínicos + imunológicos) é ≥10?", yesNext: "l-yes", noNext: "l-insuf" },
    { id: "l-yes", type: "conclusion", text: "Critérios EULAR/ACR 2019 para LES preenchidos.", isPositive: true, detail: "Sensibilidade 96,1% e especificidade 93,4%." },
    { id: "l-no", type: "conclusion", text: "ANA negativo — LES muito improvável.", isPositive: false, detail: "ANA ≥1:80 é critério de entrada obrigatório." },
    { id: "l-noc", type: "conclusion", text: "Sem critérios clínicos — diagnóstico não aplicável.", isPositive: false, detail: "Monitorar se ANA positivo com sintomas inespecíficos." },
    { id: "l-insuf", type: "conclusion", text: "Pontuação insuficiente (<10 pontos).", isPositive: false, detail: "Monitorar; LES pode se desenvolver ao longo do tempo (lupus incompleto)." },
  ],
  mermaid: `graph TD
    L1["ANA >= 1:80?"]
    L1 -->|Sim| L2["Criterios clinicos\\npresentes?"]
    L1 -->|Nao| LN["LES muito improvavel"]
    L2 -->|Sim| L3["Criterios imunologicos?"]
    L2 -->|Nao| LNC["Sem criterios clinicos"]
    L3 -->|Sim/Nao| L4["Soma >= 10 pontos?"]
    L4 -->|Sim| LY["LES - EULAR/ACR 2019\\npreenchido"]
    L4 -->|Nao| LI["Pontuacao insuficiente\\nMonitorar"]
    style LY fill:#22c55e,color:#fff
    style LN fill:#ef4444,color:#fff
    style LNC fill:#f59e0b,color:#000
    style LI fill:#f59e0b,color:#000`,
};

/* ════════════════════════════════════════════════════
   4. ENXAQUECA SEM AURA — ICHD-3
   ════════════════════════════════════════════════════ */
const enxaqueca: DiseaseFlowchart = {
  diseaseId: "enxaqueca-sem-aura",
  name: "Enxaqueca sem Aura",
  shortName: "Enxaqueca s/ Aura",
  startId: "e1",
  steps: [
    { id: "e1", type: "question", text: "O paciente teve ≥5 crises de cefaleia?", yesNext: "e2", noNext: "e-no" },
    { id: "e2", type: "question", text: "Cada crise dura 4-72 horas (sem tratamento)?", yesNext: "e3", noNext: "e-dur" },
    { id: "e3", type: "question", text: "Tem ≥2 das 4 características?\n(unilateral, pulsátil, moderada-severa, piora com atividade)", yesNext: "e4", noNext: "e-car" },
    { id: "e4", type: "question", text: "Tem ≥1 sintoma associado?\n(náusea/vômito OU fotofobia+fonofobia)", yesNext: "e5", noNext: "e-ass" },
    { id: "e5", type: "question", text: "Não é melhor explicada por outro diagnóstico?", yesNext: "e-yes", noNext: "e-out" },
    { id: "e-yes", type: "conclusion", text: "Critérios ICHD-3 para Enxaqueca sem Aura preenchidos.", isPositive: true },
    { id: "e-no", type: "conclusion", text: "Número insuficiente de crises (<5).", isPositive: false },
    { id: "e-dur", type: "conclusion", text: "Duração fora do intervalo 4-72h.", isPositive: false, detail: "Considerar cefaleia tensional (<4h) ou cefaleia em salvas (15-180min)." },
    { id: "e-car", type: "conclusion", text: "Características insuficientes (<2/4).", isPositive: false, detail: "Considerar cefaleia tensional." },
    { id: "e-ass", type: "conclusion", text: "Sem sintomas associados típicos.", isPositive: false },
    { id: "e-out", type: "conclusion", text: "Melhor explicada por outro diagnóstico.", isPositive: false, detail: "Investigar cefaleia secundária (red flags)." },
  ],
  mermaid: `graph TD
    E1[">=5 crises de cefaleia?"]
    E1 -->|Sim| E2["Duracao 4-72h?"]
    E1 -->|Nao| EN["Crises insuficientes"]
    E2 -->|Sim| E3[">=2 caracteristicas?\\n(unilateral, pulsatil,\\nmoderada, piora c/ atividade)"]
    E2 -->|Nao| ED["Duracao atipica\\nConsiderar outras cefaleias"]
    E3 -->|Sim| E4[">=1 sintoma associado?\\n(nausea/vomito OU foto+fonofobia)"]
    E3 -->|Nao| EC["Caracteristicas insuficientes"]
    E4 -->|Sim| E5["Excluido outro diagnostico?"]
    E4 -->|Nao| EA["Sem sintomas associados"]
    E5 -->|Sim| EY["Enxaqueca sem Aura\\nICHD-3 preenchido"]
    E5 -->|Nao| EO["Investigar cefaleia\\nsecundaria"]
    style EY fill:#22c55e,color:#fff
    style EN fill:#ef4444,color:#fff
    style ED fill:#f59e0b,color:#000
    style EC fill:#f59e0b,color:#000
    style EA fill:#f59e0b,color:#000
    style EO fill:#ef4444,color:#fff`,
};

/* ════════════════════════════════════════════════════
   5. SII — Roma IV
   ════════════════════════════════════════════════════ */
const sii: DiseaseFlowchart = {
  diseaseId: "ibs",
  name: "Síndrome do Intestino Irritável",
  shortName: "SII",
  startId: "s1",
  steps: [
    { id: "s1", type: "question", text: "Dor abdominal recorrente, ≥1 dia/semana, nos últimos 3 meses?", yesNext: "s2", noNext: "s-no" },
    { id: "s2", type: "question", text: "A dor está relacionada com ≥2 dos seguintes?\n1) Defecação\n2) Mudança na frequência\n3) Mudança na forma das fezes", yesNext: "s3", noNext: "s-insuf" },
    { id: "s3", type: "question", text: "Sintomas iniciaram ≥6 meses antes do diagnóstico?", yesNext: "s-yes", noNext: "s-tempo" },
    { id: "s-yes", type: "conclusion", text: "Critérios Roma IV para SII preenchidos.", isPositive: true, detail: "Classificar subtipo: SII-C (constipação), SII-D (diarreia), SII-M (misto) ou SII-U." },
    { id: "s-no", type: "conclusion", text: "Sem dor abdominal recorrente — não preenche Roma IV.", isPositive: false },
    { id: "s-insuf", type: "conclusion", text: "Associações com defecação insuficientes (<2/3).", isPositive: false },
    { id: "s-tempo", type: "conclusion", text: "Critério temporal não atendido (<6 meses).", isPositive: false, detail: "Reavaliar após o período adequado." },
  ],
  mermaid: `graph TD
    S1["Dor abdominal recorrente\\n>=1x/semana, 3 meses?"]
    S1 -->|Sim| S2[">=2 associacoes com\\ndefecacao?"]
    S1 -->|Nao| SN["Nao preenche Roma IV"]
    S2 -->|Sim| S3["Sintomas >= 6 meses?"]
    S2 -->|Nao| SI["Associacoes insuficientes"]
    S3 -->|Sim| SY["SII - Roma IV\\npreenchido"]
    S3 -->|Nao| ST["Criterio temporal\\nnao atendido"]
    style SY fill:#22c55e,color:#fff
    style SN fill:#ef4444,color:#fff
    style SI fill:#f59e0b,color:#000
    style ST fill:#f59e0b,color:#000`,
};

/* ════════════════════════════════════════════════════
   6. PCOS — Rotterdam
   ════════════════════════════════════════════════════ */
const pcos: DiseaseFlowchart = {
  diseaseId: "pcos",
  name: "Síndrome dos Ovários Policísticos",
  shortName: "PCOS",
  startId: "p1",
  steps: [
    { id: "p1", type: "question", text: "Há hiperandrogenismo (clínico ou bioquímico)?", yesNext: "p2", noNext: "p1b" },
    { id: "p1b", type: "question", text: "Há disfunção ovariana (oligo/anovulação ou morfologia policística na US)?", yesNext: "p1c", noNext: "p-no" },
    { id: "p1c", type: "question", text: "Exclusão de causas secundárias confirmada?\n(HAC, Cushing, tumor adrenal/ovariano, hiperprolactinemia)", yesNext: "p-no2", noNext: "p-no" },
    { id: "p2", type: "question", text: "Há disfunção ovariana (oligo/anovulação ou morfologia policística)?", yesNext: "p3", noNext: "p2b" },
    { id: "p2b", type: "question", text: "Exclusão de causas secundárias confirmada?", yesNext: "p-no2", noNext: "p-no" },
    { id: "p3", type: "question", text: "Exclusão de causas secundárias confirmada?", yesNext: "p-yes", noNext: "p-exc" },
    { id: "p-yes", type: "conclusion", text: "Critérios Rotterdam para PCOS preenchidos (≥2/3).", isPositive: true },
    { id: "p-no", type: "conclusion", text: "Critérios NÃO preenchidos para PCOS.", isPositive: false, detail: "Necessário ≥2 de 3 critérios de Rotterdam." },
    { id: "p-no2", type: "conclusion", text: "Apenas 1 critério presente — insuficiente.", isPositive: false, detail: "Rotterdam exige ≥2 critérios." },
    { id: "p-exc", type: "conclusion", text: "Causas secundárias não excluídas.", isPositive: false, detail: "Investigar: HAC-NC (17-OHP), Cushing, tumores, hiperprolactinemia." },
  ],
  mermaid: `graph TD
    P1["Hiperandrogenismo?"]
    P1 -->|Sim| P2["Disfuncao ovariana?"]
    P1 -->|Nao| P1B["Disfuncao ovariana?"]
    P2 -->|Sim| P3["Causas secundarias\\nexcluidas?"]
    P2 -->|Nao| P2B["Exclusao de causas?"]
    P1B -->|Sim| P1C["Exclusao de causas?"]
    P1B -->|Nao| PN["Nao preenche Rotterdam"]
    P3 -->|Sim| PY["PCOS - Rotterdam\\npreenchido >= 2/3"]
    P3 -->|Nao| PE["Investigar causas\\nsecundarias"]
    P2B -->|Sim| PN2["Apenas 1 criterio"]
    P2B -->|Nao| PN
    P1C -->|Sim| PN2
    P1C -->|Nao| PN
    style PY fill:#22c55e,color:#fff
    style PN fill:#ef4444,color:#fff
    style PN2 fill:#f59e0b,color:#000
    style PE fill:#ef4444,color:#fff`,
};

/* ════════════════════════════════════════════════════
   7. OA JOELHO — ACR
   ════════════════════════════════════════════════════ */
const oaJoelho: DiseaseFlowchart = {
  diseaseId: "osteoartrite-joelho",
  name: "Osteoartrite de Joelho",
  shortName: "OA Joelho",
  startId: "oa1",
  steps: [
    { id: "oa1", type: "question", text: "Dor no joelho na maioria dos dias?", yesNext: "oa2", noNext: "oa-no" },
    { id: "oa2", type: "question", text: "Idade >55 anos?", yesNext: "oa3", noNext: "oa3" },
    { id: "oa3", type: "question", text: "Rigidez matinal <30 minutos?", yesNext: "oa4", noNext: "oa4" },
    { id: "oa4", type: "question", text: "Crepitação presente?", yesNext: "oa5", noNext: "oa5" },
    { id: "oa5", type: "question", text: "Sensibilidade óssea / osteófitos ao exame?", yesNext: "oa-eval", noNext: "oa-eval" },
    { id: "oa-eval", type: "question", text: "Contando os itens acima (idade, rigidez, crepitação, osteófitos): ≥3 de 4 estão presentes?", yesNext: "oa-yes", noNext: "oa-insuf" },
    { id: "oa-yes", type: "conclusion", text: "Critérios ACR para OA de joelho preenchidos.", isPositive: true },
    { id: "oa-no", type: "conclusion", text: "Sem dor no joelho — critério obrigatório não atendido.", isPositive: false },
    { id: "oa-insuf", type: "conclusion", text: "Critérios adicionais insuficientes (<3/4).", isPositive: false, detail: "Considerar outras causas de gonalgia." },
  ],
  mermaid: `graph TD
    OA1["Dor no joelho na\\nmaioria dos dias?"]
    OA1 -->|Sim| OA2["Avaliar 4 criterios:\\n- Idade > 55\\n- Rigidez < 30min\\n- Crepitacao\\n- Osteofitos"]
    OA1 -->|Nao| OAN["Criterio obrigatorio\\nnao atendido"]
    OA2 --> OA3[">=3 de 4 presentes?"]
    OA3 -->|Sim| OAY["OA Joelho - ACR\\npreenchido"]
    OA3 -->|Nao| OAI["Criterios insuficientes\\nConsiderar outras causas"]
    style OAY fill:#22c55e,color:#fff
    style OAN fill:#ef4444,color:#fff
    style OAI fill:#f59e0b,color:#000`,
};

/* ════════════════════════════════════════════════════
   8. FIBROMIALGIA — AAPT/APS 2019
   ════════════════════════════════════════════════════ */
const fibromialgia: DiseaseFlowchart = {
  diseaseId: "fibromialgia",
  name: "Fibromialgia",
  shortName: "Fibromialgia",
  startId: "f1",
  steps: [
    { id: "f1", type: "question", text: "Dor em ≥6 de 9 sítios corporais possíveis?", yesNext: "f2", noNext: "f-no" },
    { id: "f2", type: "question", text: "Problemas moderados a severos de sono OU fadiga significativa?", yesNext: "f3", noNext: "f-insuf" },
    { id: "f3", type: "question", text: "Sintomas presentes por ≥3 meses?", yesNext: "f-yes", noNext: "f-tempo" },
    { id: "f-yes", type: "conclusion", text: "Critérios AAPT/APS 2019 para Fibromialgia preenchidos.", isPositive: true },
    { id: "f-no", type: "conclusion", text: "Dor difusa insuficiente (<6 sítios).", isPositive: false },
    { id: "f-insuf", type: "conclusion", text: "Sem problemas significativos de sono ou fadiga.", isPositive: false },
    { id: "f-tempo", type: "conclusion", text: "Critério temporal não atendido (<3 meses).", isPositive: false },
  ],
  mermaid: `graph TD
    F1["Dor em >= 6 de 9\\nsitios corporais?"]
    F1 -->|Sim| F2["Sono ruim OU\\nfadiga significativa?"]
    F1 -->|Nao| FN["Dor insuficiente"]
    F2 -->|Sim| F3["Sintomas >= 3 meses?"]
    F2 -->|Nao| FI["Sem sono/fadiga"]
    F3 -->|Sim| FY["Fibromialgia\\nAAPT/APS preenchido"]
    F3 -->|Nao| FT["Criterio temporal\\nnao atendido"]
    style FY fill:#22c55e,color:#fff
    style FN fill:#ef4444,color:#fff
    style FI fill:#f59e0b,color:#000
    style FT fill:#f59e0b,color:#000`,
};

/* ════════════════════════════════════════════════════
   9. DIABETES TIPO 2 — ADA
   ════════════════════════════════════════════════════ */
const dm2: DiseaseFlowchart = {
  diseaseId: "diabetes-tipo-2",
  name: "Diabetes Tipo 2",
  shortName: "Diabetes T2",
  startId: "dm1",
  steps: [
    { id: "dm1", type: "question", text: "O paciente apresenta sintomas clássicos de hiperglicemia?\n(poliúria, polidipsia, perda de peso)", yesNext: "dm2a", noNext: "dm3" },
    { id: "dm2a", type: "question", text: "Glicose plasmática aleatória ≥200 mg/dL?", yesNext: "dm-yes-s", noNext: "dm3" },
    { id: "dm-yes-s", type: "conclusion", text: "DM2 diagnosticado pela via sintomática.", isPositive: true, detail: "Glicose aleatória ≥200 + sintomas clássicos = diagnóstico imediato." },
    { id: "dm3", type: "question", text: "Algum dos exames laboratoriais está alterado?\n• Glicose de jejum ≥126 mg/dL\n• OGTT 2h ≥200 mg/dL\n• HbA1c ≥6,5%", yesNext: "dm4", noNext: "dm-no" },
    { id: "dm4", type: "question", text: "Exame confirmado em dia subsequente (se assintomático)?", yesNext: "dm-yes-l", noNext: "dm-conf" },
    { id: "dm-yes-l", type: "conclusion", text: "DM2 diagnosticado pela via laboratorial.", isPositive: true },
    { id: "dm-no", type: "conclusion", text: "Exames normais — sem critérios para DM2.", isPositive: false, detail: "Reavaliar se fatores de risco presentes. Considerar pré-diabetes." },
    { id: "dm-conf", type: "conclusion", text: "Exame alterado mas sem confirmação.", isPositive: false, detail: "Repetir exame em dia subsequente para confirmar diagnóstico." },
  ],
  mermaid: `graph TD
    DM1["Sintomas classicos?\\n(poliuria, polidipsia,\\nperda de peso)"]
    DM1 -->|Sim| DM2["Glicose aleatoria\\n>= 200 mg/dL?"]
    DM1 -->|Nao| DM3["Exame laboratorial\\nalterado?"]
    DM2 -->|Sim| DMY1["DM2 - Via sintomaltica\\nDiagnosticado"]
    DM2 -->|Nao| DM3
    DM3 -->|Sim| DM4["Confirmado em\\ndia subsequente?"]
    DM3 -->|Nao| DMN["Sem criterios para DM2"]
    DM4 -->|Sim| DMY2["DM2 - Via laboratorial\\nDiagnosticado"]
    DM4 -->|Nao| DMC["Repetir exame\\npara confirmar"]
    style DMY1 fill:#22c55e,color:#fff
    style DMY2 fill:#22c55e,color:#fff
    style DMN fill:#ef4444,color:#fff
    style DMC fill:#f59e0b,color:#000`,
};

/* ════════════════════════════════════════════════════
   10. HAS — Diretrizes Brasileiras 2020 + AHA/ACC
   ════════════════════════════════════════════════════ */
const has: DiseaseFlowchart = {
  diseaseId: "has",
  name: "Hipertensão Arterial Sistêmica",
  shortName: "HAS",
  startId: "h1",
  steps: [
    { id: "h1", type: "question", text: "PA de consultório ≥140/90 mmHg em ≥2 consultas?", yesNext: "h2", noNext: "h1b" },
    { id: "h1b", type: "question", text: "PA de consultório ≥180/110 mmHg em medida única?", yesNext: "h-yes-urg", noNext: "h1c" },
    { id: "h1c", type: "question", text: "PA entre 130-139/85-89 mmHg (PA elevada/pré-HAS)?", yesNext: "h-pre", noNext: "h-no" },
    { id: "h2", type: "question", text: "MAPA ou MRPA confirmam?\n(MAPA vigília ≥135/85, 24h ≥130/80, sono ≥120/70)\n(MRPA ≥130/80)", yesNext: "h-yes", noNext: "h-jaleco" },
    { id: "h-yes", type: "conclusion", text: "HAS confirmada.", isPositive: true, detail: "Classificar estágio e estratificar risco cardiovascular." },
    { id: "h-yes-urg", type: "conclusion", text: "HAS confirmada (PA ≥180/110 em medida única).", isPositive: true, detail: "Emergência/Urgência hipertensiva — avaliar LOA." },
    { id: "h-pre", type: "conclusion", text: "PA elevada / Pré-hipertensão.", isPositive: false, detail: "Mudanças de estilo de vida. Monitorar anualmente." },
    { id: "h-jaleco", type: "conclusion", text: "Possível HAS do jaleco branco.", isPositive: false, detail: "PA elevada no consultório mas normal fora dele. Monitorar." },
    { id: "h-no", type: "conclusion", text: "PA normal — sem HAS.", isPositive: false },
  ],
  mermaid: `graph TD
    H1["PA consultorio\\n>= 140/90 em >= 2 consultas?"]
    H1 -->|Sim| H2["MAPA/MRPA confirmam?"]
    H1 -->|Nao| H1B["PA >= 180/110\\nem medida unica?"]
    H2 -->|Sim| HY["HAS confirmada"]
    H2 -->|Nao| HJ["HAS do jaleco branco"]
    H1B -->|Sim| HU["HAS confirmada\\nUrgencia/Emergencia"]
    H1B -->|Nao| H1C["PA 130-139/85-89?"]
    H1C -->|Sim| HP["Pre-hipertensao\\nMEV + monitorar"]
    H1C -->|Nao| HN["PA normal"]
    style HY fill:#22c55e,color:#fff
    style HU fill:#22c55e,color:#fff
    style HJ fill:#f59e0b,color:#000
    style HP fill:#f59e0b,color:#000
    style HN fill:#ef4444,color:#fff`,
};

/* ════════════════════════════════════════════════════
   11. DISLIPIDEMIA
   ════════════════════════════════════════════════════ */
const dislipidemia: DiseaseFlowchart = {
  diseaseId: "dislipidemia",
  name: "Dislipidemia",
  shortName: "Dislipidemia",
  startId: "dl1",
  steps: [
    { id: "dl1", type: "question", text: "Perfil lipídico coletado em jejum de 12h (ou sem jejum para CT, HDL, não-HDL e TG se <440)?", yesNext: "dl2", noNext: "dl-col" },
    { id: "dl-col", type: "conclusion", text: "Solicitar perfil lipídico para avaliação.", isPositive: false },
    { id: "dl2", type: "question", text: "LDL ≥160 mg/dL OU CT ≥240 mg/dL OU TG ≥150 mg/dL OU HDL <40 (H) / <50 (M)?", yesNext: "dl3", noNext: "dl-norm" },
    { id: "dl3", type: "question", text: "Há causas secundárias?\n(hipotireoidismo, DM, nefrose, medicações, hepatopatia)", yesNext: "dl-sec", noNext: "dl-yes" },
    { id: "dl-yes", type: "conclusion", text: "Dislipidemia primária confirmada.", isPositive: true, detail: "Estratificar risco CV e definir metas de LDL conforme risco." },
    { id: "dl-norm", type: "conclusion", text: "Perfil lipídico dentro dos valores de referência.", isPositive: false, detail: "Repetir conforme faixa etária e risco." },
    { id: "dl-sec", type: "conclusion", text: "Provável dislipidemia secundária.", isPositive: true, detail: "Tratar causa base e reavaliar perfil lipídico." },
  ],
  mermaid: `graph TD
    DL1["Perfil lipidico\\ncoletado?"]
    DL1 -->|Sim| DL2["Algum valor alterado?\\nLDL>=160 / CT>=240\\nTG>=150 / HDL baixo"]
    DL1 -->|Nao| DLC["Solicitar exame"]
    DL2 -->|Sim| DL3["Causas secundarias?"]
    DL2 -->|Nao| DLN["Perfil normal"]
    DL3 -->|Sim| DLS["Dislipidemia secundaria\\nTratar causa base"]
    DL3 -->|Nao| DLY["Dislipidemia primaria\\nEstratificar risco CV"]
    style DLY fill:#22c55e,color:#fff
    style DLS fill:#f59e0b,color:#000
    style DLN fill:#ef4444,color:#fff
    style DLC fill:#ef4444,color:#fff`,
};

/* ════════════════════════════════════════════════════
   12. DRC — KDIGO
   ════════════════════════════════════════════════════ */
const drc: DiseaseFlowchart = {
  diseaseId: "drc",
  name: "Doença Renal Crônica",
  shortName: "DRC",
  startId: "dr1",
  steps: [
    { id: "dr1", type: "question", text: "TFG <60 mL/min/1,73m² OU presença de marcadores de lesão renal?\n(albuminúria, hematúria, alteração estrutural)", yesNext: "dr2", noNext: "dr-no" },
    { id: "dr2", type: "question", text: "As alterações persistem por ≥3 meses?", yesNext: "dr3", noNext: "dr-aguda" },
    { id: "dr3", type: "question", text: "TFG <60 mL/min/1,73m²?", yesNext: "dr-tfg", noNext: "dr-marker" },
    { id: "dr-tfg", type: "conclusion", text: "DRC confirmada — classificar por estágio KDIGO (G1-G5) e albuminúria (A1-A3).", isPositive: true, detail: "G1: ≥90 | G2: 60-89 | G3a: 45-59 | G3b: 30-44 | G4: 15-29 | G5: <15" },
    { id: "dr-marker", type: "conclusion", text: "DRC confirmada por marcadores de lesão (com TFG ≥60).", isPositive: true, detail: "Estágio G1 ou G2 com albuminúria. Classificar A1/A2/A3." },
    { id: "dr-no", type: "conclusion", text: "Sem evidência de doença renal.", isPositive: false },
    { id: "dr-aguda", type: "conclusion", text: "Alterações não persistem por ≥3 meses — pode ser lesão renal aguda.", isPositive: false, detail: "Repetir exames em 3 meses para confirmar cronicidade." },
  ],
  mermaid: `graph TD
    DR1["TFG < 60 OU\\nmarcadores de lesao renal?"]
    DR1 -->|Sim| DR2["Persistem >= 3 meses?"]
    DR1 -->|Nao| DRN["Sem doenca renal"]
    DR2 -->|Sim| DR3["TFG < 60?"]
    DR2 -->|Nao| DRA["Possivel lesao aguda\\nRepetir em 3 meses"]
    DR3 -->|Sim| DRY["DRC confirmada\\nClassificar KDIGO G1-G5"]
    DR3 -->|Nao| DRM["DRC por marcadores\\nG1/G2 + albuminuria"]
    style DRY fill:#22c55e,color:#fff
    style DRM fill:#22c55e,color:#fff
    style DRN fill:#ef4444,color:#fff
    style DRA fill:#f59e0b,color:#000`,
};

/* ════════════════════════════════════════════════════
   13. HIPOTIREOIDISMO
   ════════════════════════════════════════════════════ */
const hipotireoidismo: DiseaseFlowchart = {
  diseaseId: "hipotireoidismo",
  name: "Hipotireoidismo",
  shortName: "Hipotireoidismo",
  startId: "ht1",
  steps: [
    { id: "ht1", type: "question", text: "TSH elevado (acima do limite superior)?", yesNext: "ht2", noNext: "ht1b" },
    { id: "ht1b", type: "question", text: "TSH normal-baixo com sintomas de hipotireoidismo?\n(Possível hipotireoidismo central)", yesNext: "ht-central", noNext: "ht-no" },
    { id: "ht2", type: "question", text: "T4 livre está baixo?", yesNext: "ht-yes", noNext: "ht-sub" },
    { id: "ht-yes", type: "conclusion", text: "Hipotireoidismo primário manifesto (clínico).", isPositive: true, detail: "TSH elevado + T4L baixo. Investigar etiologia (Hashimoto: anti-TPO)." },
    { id: "ht-sub", type: "conclusion", text: "Hipotireoidismo subclínico (TSH alto, T4L normal).", isPositive: true, detail: "Confirmar em 6-12 semanas. Tratar se TSH >10 ou se sintomático com TSH 5-10." },
    { id: "ht-central", type: "conclusion", text: "Suspeita de hipotireoidismo central.", isPositive: true, detail: "T4L baixo com TSH inapropriadamente normal/baixo. Investigar hipófise (RM)." },
    { id: "ht-no", type: "conclusion", text: "Sem evidência de hipotireoidismo.", isPositive: false },
  ],
  mermaid: `graph TD
    HT1["TSH elevado?"]
    HT1 -->|Sim| HT2["T4 livre baixo?"]
    HT1 -->|Nao| HT1B["TSH normal-baixo +\\nsintomas?"]
    HT2 -->|Sim| HTY["Hipotireoidismo\\nprimario manifesto"]
    HT2 -->|Nao| HTS["Hipotireoidismo\\nsubclinico"]
    HT1B -->|Sim| HTC["Hipotireoidismo\\ncentral - investigar"]
    HT1B -->|Nao| HTN["Sem hipotireoidismo"]
    style HTY fill:#22c55e,color:#fff
    style HTS fill:#f59e0b,color:#000
    style HTC fill:#f59e0b,color:#000
    style HTN fill:#ef4444,color:#fff`,
};

/* ════════════════════════════════════════════════════
   14. HIPERTIREOIDISMO
   ════════════════════════════════════════════════════ */
const hipertireoidismo: DiseaseFlowchart = {
  diseaseId: "hipertireoidismo",
  name: "Hipertireoidismo",
  shortName: "Hipertireoidismo",
  startId: "hr1",
  steps: [
    { id: "hr1", type: "question", text: "TSH suprimido (abaixo do limite inferior)?", yesNext: "hr2", noNext: "hr-no" },
    { id: "hr2", type: "question", text: "T4 livre elevado?", yesNext: "hr-yes", noNext: "hr3" },
    { id: "hr3", type: "question", text: "T3 total ou livre elevado?", yesNext: "hr-t3", noNext: "hr-sub" },
    { id: "hr-yes", type: "conclusion", text: "Hipertireoidismo manifesto (tireotoxicose).", isPositive: true, detail: "TSH suprimido + T4L alto. Investigar causa: Graves (TRAb), BMT, adenoma tóxico, tireoidite." },
    { id: "hr-t3", type: "conclusion", text: "T3-tireotoxicose.", isPositive: true, detail: "TSH suprimido, T4L normal, T3 elevado. Comum em Graves e adenoma tóxico." },
    { id: "hr-sub", type: "conclusion", text: "Hipertireoidismo subclínico.", isPositive: true, detail: "TSH suprimido com T4L e T3 normais. Monitorar; tratar se TSH <0,1 ou se >65 anos/cardiopata." },
    { id: "hr-no", type: "conclusion", text: "Sem evidência de hipertireoidismo.", isPositive: false },
  ],
  mermaid: `graph TD
    HR1["TSH suprimido?"]
    HR1 -->|Sim| HR2["T4 livre elevado?"]
    HR1 -->|Nao| HRN["Sem hipertireoidismo"]
    HR2 -->|Sim| HRY["Hipertireoidismo\\nmanifesto"]
    HR2 -->|Nao| HR3["T3 elevado?"]
    HR3 -->|Sim| HRT["T3-tireotoxicose"]
    HR3 -->|Nao| HRS["Hipertireoidismo\\nsubclinico"]
    style HRY fill:#22c55e,color:#fff
    style HRT fill:#22c55e,color:#fff
    style HRS fill:#f59e0b,color:#000
    style HRN fill:#ef4444,color:#fff`,
};

/* ════════════════════════════════════════════════════
   15. OSTEOPOROSE
   ════════════════════════════════════════════════════ */
const osteoporose: DiseaseFlowchart = {
  diseaseId: "osteoporose",
  name: "Osteoporose",
  shortName: "Osteoporose",
  startId: "op1",
  steps: [
    { id: "op1", type: "question", text: "O paciente apresenta fratura por fragilidade?\n(trauma mínimo: coluna, quadril, punho, úmero, pelve, costela)", yesNext: "op-yes-fx", noNext: "op2" },
    { id: "op-yes-fx", type: "conclusion", text: "Osteoporose diagnosticada clinicamente (fratura por fragilidade).", isPositive: true, detail: "A DXA servirá para valor basal e monitoramento. Se T-score ≤ -2,5 = osteoporose grave/estabelecida." },
    { id: "op2", type: "question", text: "O paciente é mulher pós-menopausa OU homem ≥50 anos?", yesNext: "op3", noNext: "op-jovem" },
    { id: "op3", type: "question", text: "DXA realizada — qual o resultado do T-score?", yesNext: "op3a", noNext: "op-dxa" },
    { id: "op-dxa", type: "conclusion", text: "Solicitar DXA para diagnóstico.", isPositive: false, detail: "Sítios: coluna L1-L4, fêmur total, colo femoral, rádio 33%." },
    { id: "op3a", type: "question", text: "T-score ≤ -2,5?", yesNext: "op-yes-dxa", noNext: "op3b" },
    { id: "op-yes-dxa", type: "conclusion", text: "Osteoporose densitométrica confirmada.", isPositive: true },
    { id: "op3b", type: "question", text: "T-score entre -1,0 e -2,49 (Osteopenia)?", yesNext: "op4", noNext: "op-norm" },
    { id: "op-norm", type: "conclusion", text: "DMO normal (T-score ≥ -1,0).", isPositive: false },
    { id: "op4", type: "question", text: "Paciente tem diabetes? Se sim, T-score ≤ -2,0?", yesNext: "op-yes-dm", noNext: "op5" },
    { id: "op-yes-dm", type: "conclusion", text: "Osteoporose (corte diferenciado para DM: T-score ≤ -2,0).", isPositive: true, detail: "DM prejudica microarquitetura; DMO subestima risco real." },
    { id: "op5", type: "question", text: "FRAX indica alto risco?\n(fratura maior ≥20% OU quadril ≥3% em 10 anos)", yesNext: "op-yes-frax", noNext: "op-penia" },
    { id: "op-yes-frax", type: "conclusion", text: "Osteoporose por FRAX elevado (osteopenia + alto risco).", isPositive: true, detail: "Indicação de tratamento farmacológico mesmo sem T-score ≤ -2,5." },
    { id: "op-penia", type: "conclusion", text: "Osteopenia sem alto risco — monitorar.", isPositive: false, detail: "MEV, Ca+VitD, repetir DXA em 1-2 anos." },
    { id: "op-jovem", type: "question", text: "DXA com Z-score ≤ -2,0?", yesNext: "op-jov2", noNext: "op-jov-no" },
    { id: "op-jov2", type: "question", text: "Há fratura por fragilidade OU causa secundária robusta?", yesNext: "op-yes-jov", noNext: "op-jov-bma" },
    { id: "op-yes-jov", type: "conclusion", text: "Osteoporose em paciente jovem confirmada.", isPositive: true, detail: "Z-score ≤ -2,0 + fratura ou causa secundária." },
    { id: "op-jov-bma", type: "conclusion", text: "Baixa massa óssea para a idade (não é osteoporose).", isPositive: false, detail: "Z-score ≤ -2,0 sem fratura. Investigar causas secundárias." },
    { id: "op-jov-no", type: "conclusion", text: "DMO adequada para a idade.", isPositive: false },
  ],
  mermaid: `graph TD
    OP1["Fratura por fragilidade?"]
    OP1 -->|Sim| OPY1["Osteoporose clinica\\nDiagnosticada"]
    OP1 -->|Nao| OP2["Pos-menopausa ou\\nHomem >= 50?"]
    OP2 -->|Sim| OP3["T-score na DXA?"]
    OP2 -->|Nao| OPJ["Paciente jovem:\\nZ-score <= -2,0?"]
    OP3 --> OP3A["T-score <= -2,5?"]
    OP3A -->|Sim| OPY2["Osteoporose\\ndensitometrica"]
    OP3A -->|Nao| OP3B["Osteopenia?\\n(-1,0 a -2,49)"]
    OP3B -->|Sim| OP4["Diabetico c/ T <= -2,0\\nOU FRAX alto?"]
    OP3B -->|Nao| OPN["DMO normal"]
    OP4 -->|Sim| OPY3["Osteoporose\\nconfirmada"]
    OP4 -->|Nao| OPP["Osteopenia\\nMonitorar"]
    OPJ -->|Sim| OPJ2["Fratura OU causa\\nsecundaria?"]
    OPJ -->|Nao| OPJN["DMO adequada\\npara idade"]
    OPJ2 -->|Sim| OPY4["Osteoporose\\nem jovem"]
    OPJ2 -->|Nao| OPJB["Baixa massa ossea\\npara idade"]
    style OPY1 fill:#22c55e,color:#fff
    style OPY2 fill:#22c55e,color:#fff
    style OPY3 fill:#22c55e,color:#fff
    style OPY4 fill:#22c55e,color:#fff
    style OPN fill:#ef4444,color:#fff
    style OPP fill:#f59e0b,color:#000
    style OPJN fill:#ef4444,color:#fff
    style OPJB fill:#f59e0b,color:#000`,
};

export const allFlowcharts: DiseaseFlowchart[] = [
  depressao,
  tag,
  les,
  enxaqueca,
  sii,
  pcos,
  oaJoelho,
  fibromialgia,
  dm2,
  has,
  dislipidemia,
  drc,
  hipotireoidismo,
  hipertireoidismo,
  osteoporose,
];
