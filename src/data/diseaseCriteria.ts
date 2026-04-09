export interface CriteriaSection {
  title: string;
  items?: string[];
  subsections?: { title: string; items: string[] }[];
  table?: { headers: string[]; rows: string[][] };
  note?: string;
}

export interface Disease {
  id: string;
  name: string;
  shortName: string;
  sections: CriteriaSection[];
}

export const diseases: Disease[] = [
  {
    id: "fibromialgia",
    name: "Fibromialgia",
    shortName: "Fibromialgia",
    sections: [
      {
        title: "Critérios Diagnósticos Clínicos",
        note: "A fibromialgia é diagnosticada clinicamente em pacientes com sintomas compatíveis, na ausência de características que sugiram diagnóstico alternativo.",
        items: [
          "Dor musculoesquelética generalizada ou de múltiplos sítios (bilateral, acima e abaixo da cintura) por pelo menos 3 meses",
          "Fadiga moderada a severa e/ou distúrbios do sono",
          "Não atribuída a outra doença",
        ],
      },
      {
        title: "Critérios ACR 2010 Revisados",
        items: [
          "Índice de Dor Generalizada (WPI) >7 e escala de gravidade de sintomas (SS) >5, OU WPI 3-6 com SS >9",
          "Sintomas presentes por ≥3 meses",
          "Nenhuma outra doença que explique os sintomas",
        ],
      },
      {
        title: "Critérios AAPT/APS (2019)",
        items: [
          "Dor em ≥6 de 9 sítios possíveis",
          "Problemas moderados a severos de sono ou fadiga",
          "Ambos presentes por ≥3 meses",
        ],
      },
      {
        title: "Avaliação Laboratorial",
        items: [
          "Hemograma completo",
          "Painel metabólico abrangente",
          "Velocidade de hemossedimentação (VHS) / Proteína C reativa",
          "TSH (hormônio estimulante da tireoide)",
          "25-OH Vitamina D (alguns recomendam)",
          "B12 e estudos de ferro (se indicados)",
        ],
      },
    ],
  },
  {
    id: "enxaqueca",
    name: "Enxaqueca com Aura e sem Aura",
    shortName: "Enxaqueca",
    sections: [
      {
        title: "Enxaqueca SEM Aura — Critérios ICHD-3",
        items: [
          "A. Pelo menos 5 crises preenchendo critérios B a D",
          "B. Cefaleia durando 4-72 horas (não tratada ou tratamento malsucedido)",
        ],
        subsections: [
          {
            title: "C. Cefaleia com ≥2 das seguintes:",
            items: [
              "Localização unilateral",
              "Qualidade pulsátil",
              "Intensidade moderada a severa",
              "Piora com ou causando evitar atividade física de rotina",
            ],
          },
          {
            title: "D. Durante cefaleia ≥1 dos seguintes:",
            items: ["Náusea, vômito ou ambos", "Fotofobia e fonofobia"],
          },
        ],
        note: "E. Não melhor explicada por outro diagnóstico ICHD-3",
      },
      {
        title: "Enxaqueca COM Aura — Critérios ICHD-3",
        items: [
          "A. Pelo menos 2 crises preenchendo critérios B e C",
        ],
        subsections: [
          {
            title: "B. Sintomas de aura reversíveis (≥1):",
            items: ["Visual", "Sensorial", "Fala/linguagem", "Motor", "Tronco encefálico", "Retiniana"],
          },
          {
            title: "C. ≥3 das 6 seguintes características:",
            items: [
              "≥1 sintoma de aura se espalha gradualmente ao longo de ≥5 minutos",
              "≥2 sintomas ocorrem em sucessão",
              "Cada sintoma de aura dura 5-60 minutos",
              "≥1 sintoma de aura é unilateral",
              "≥1 sintoma de aura é positivo",
              "Aura acompanhada ou seguida dentro de 60 minutos por cefaleia",
            ],
          },
        ],
        note: "D. Não melhor explicada por outro diagnóstico ICHD-3",
      },
      {
        title: "Fase Prodromal (até 77% dos pacientes, 24-48h antes)",
        items: [
          "Sensibilidade à luz/som",
          "Fadiga",
          "Dor no pescoço",
          "Sintomas cognitivos (irritabilidade/euforia)",
        ],
      },
      {
        title: "Fase de Pós-drome (pode durar horas até 1 dia)",
        items: [
          "Exaustão",
          "Dor residual à movimentação da cabeça",
          "Sensibilidade à luz/som",
        ],
      },
    ],
  },
  {
    id: "diabetes-tipo-2",
    name: "Diabetes Tipo 2",
    shortName: "Diabetes T2",
    sections: [
      {
        title: "Apresentação Clínica",
        subsections: [
          {
            title: "Assintomática (maioria dos pacientes):",
            items: ["Hiperglicemia detectada em avaliação laboratorial de rotina"],
          },
          {
            title: "Sintomática:",
            items: ["Poliúria, polidipsia, nictúria, visão turva, perda de peso"],
          },
        ],
      },
      {
        title: "Critérios Diagnósticos (ADA)",
        subsections: [
          {
            title: "Com Sintomas Clássicos:",
            items: ["Glicose plasmática aleatória ≥200 mg/dL (11,1 mmol/L) + sintomas clássicos"],
          },
          {
            title: "Assintomáticos (confirmar em dia subsequente):",
            items: [
              "Glicose de Jejum (FPG): ≥126 mg/dL (7,0 mmol/L) — jejum ≥8 horas",
              "OGTT: Glicose 2-horas ≥200 mg/dL (11,1 mmol/L) — após 75g de glicose",
              "Hemoglobina Glicada (A1C): ≥6,5% (48 mmol/mol)",
            ],
          },
        ],
      },
      {
        title: "Prediabetes (ADA)",
        items: [
          "Jejum (IFG): 100-125 mg/dL (5,6-6,9 mmol/L)",
          "OGTT: 140-199 mg/dL (7,8-11,0 mmol/L) aos 2 minutos",
          "A1C: 5,7-<6,5% (39-48 mmol/mol)",
        ],
      },
      {
        title: "Testes de Avaliação Inicial",
        items: [
          "A1C (se não medido nos últimos 2-3 meses)",
          "Perfil lipídico em jejum",
          "Testes de função hepática",
          "Razão albumina-creatinina urinária",
          "Creatinina sérica (com TFG estimada)",
        ],
      },
      {
        title: "Diferenciação Tipo 1 vs Tipo 2",
        items: [
          "Autoanticorpos (GAD-65, insulina, IA-2, ZnT8) quando diagnóstico incerto",
          "Peptídeo C pareado com glicose (baixo em Tipo 1)",
        ],
      },
    ],
  },
  {
    id: "les",
    name: "Lupus Eritematoso Sistêmico (LES)",
    shortName: "LES",
    sections: [
      {
        title: "Critérios EULAR/ACR 2019 — Critério de Entrada",
        items: ["ANA ≥1:80 em teste de imunofluorescência indireta"],
        note: "Diagnóstico: ANA ≥1:80 + pontuação ≥10 (sensibilidade 96,1%, especificidade 93,4%)",
      },
      {
        title: "Critérios Clínicos (Ponderados)",
        items: [
          "Constitucionais (2 pts): Febre",
          "Hematológicos (4 pts): Leucopenia OU trombocitopenia OU anemia hemolítica",
          "Neuropsiquiátricos (3 pts): Delirium / psicose / mielite / AVC / encefalite / convulsão",
          "Mucocutâneos (2 pts): Lúpus cutâneo agudo / discóide / úlceras orais-nasais / alopecia",
          "Serosa (2 pts): Pleurite OU pericardite",
          "Musculoesquelético (3 pts): Artrite",
          "Renal (4 pts): Proteinúria >0,5g/24h OU cilindros celulares",
        ],
      },
      {
        title: "Critérios Imunológicos (Ponderados)",
        items: [
          "Anticorpos Antifosfolípides (2 pts): Anticoagulante lúpico / anticardiolipina / anti-β2GPI",
          "Complemento Baixo (3 pts): C3 OU C4 baixo",
          "Anticorpos Específicos (4 pts): Anti-dsDNA OU Anti-Smith",
        ],
      },
      {
        title: "Critérios ACR 1997 (Históricos) — ≥4 de 11",
        items: [
          "Rash malar",
          "Rash discóide",
          "Fotossensibilidade",
          "Úlceras orais",
          "Artrite (2+ articulações)",
          "Serosita (pleurite/pericardite)",
          "Comprometimento renal (proteinúria >0,5g/dia OU cilindros)",
          "Distúrbio neurológico (convulsões OU psicose)",
          "Anormalidades hematológicas",
          "Achados imunológicos (ANA OU anticorpos específicos)",
          "Fator antinuclear positivo",
        ],
      },
      {
        title: "Achados Laboratoriais",
        items: [
          "Hemograma: Leucopenia, linfopenia, anemia, trombocitopenia",
          "Função renal: Creatinina sérica, TFG",
          "Urinálise: Hematúria, cilindros, proteinúria",
          "VHS (elevado), PCR (pode ser normal)",
          "ANA (imunofluorescência indireta)",
          "Anti-Sm, Anti-U1RNP, Anti-Ro/SSA, Anti-La/SSB",
          "Anti-dsDNA",
          "Anticorpos Antifosfolípides",
          "Complemento: C3, C4 ou CH50",
        ],
      },
    ],
  },
  {
    id: "ibs",
    name: "Síndrome do Intestino Irritável (IBS)",
    shortName: "SII",
    sections: [
      {
        title: "Critérios Roma IV",
        note: "Dor abdominal recorrente, em média ≥1 dia/semana nos últimos 3 meses, associada a 2 ou mais:",
        items: [
          "Relacionada à defecação",
          "Mudança na frequência das fezes",
          "Mudança na forma/aparência das fezes",
        ],
      },
      {
        title: "Subtipos (Bristol Stool Form Scale)",
        items: [
          "IBS-C (Constipação): fezes tipos 1-2",
          "IBS-D (Diarréia): fezes tipos 6-7",
          "IBS-M (Misto): >1/4 constipação E >1/4 diarréia",
          "IBS Não Classificado: não se enquadra acima",
        ],
      },
      {
        title: "Apresentação Clínica",
        items: [
          "Dor/desconforto abdominal em cólicas",
          "Diarréia: fezes amolecidas, pequeno-moderado volume, matutinas/pós-prandiais",
          "Constipação: fezes duras, forma de pellets",
          "Mucosidade nas fezes (~50% dos pacientes)",
          "Inchaço/distensão abdominal",
          "Produção aumentada de gases",
        ],
      },
      {
        title: "🚨 Características de Alarme",
        items: [
          "Início após os 50 anos",
          "Sangramento retal/melena",
          "Diarréia noturna",
          "Dor abdominal progressiva",
          "Perda de peso inexplicada",
          "Anormalidades laboratoriais (anemia ferropriva, PCR/calprotectina elevadas)",
          "Histórico familiar de IBD/câncer colorretal",
        ],
      },
      {
        title: "Testes em Pacientes com Diarréia",
        items: [
          "Calprotectina fecal OU lactoferrina fecal (limite >50 mcg/g)",
          "Teste de giardia",
          "Sorologia para doença celíaca",
          "PCR (se calprotectina/lactoferrina não disponível)",
        ],
      },
    ],
  },
  {
    id: "hipotireoidismo",
    name: "Hipotireoidismo",
    shortName: "Hipotireoidismo",
    sections: [
      {
        title: "Prevalência",
        items: [
          "Hipotireoidismo overt: 0.1-2%",
          "Hipotireoidismo subclínico: 4-10% (maior em mulheres idosas)",
          "5-8x mais comum em mulheres",
        ],
      },
      {
        title: "Diagnóstico — Teste Inicial: TSH",
        subsections: [
          {
            title: "Hipotireoidismo Overt:",
            items: ["TSH: ELEVADO (>4.5 mU/L)", "T4 Livre: BAIXO"],
          },
          {
            title: "Hipotireoidismo Subclínico:",
            items: ["TSH: ELEVADO (persistente)", "T4 Livre: NORMAL"],
          },
          {
            title: "Hipotireoidismo Central:",
            items: ["T4 Livre: BAIXO-normal ou BAIXO", "TSH: Baixo, inapropriadamente normal, ou levemente elevado (5-10 mU/L)"],
          },
        ],
      },
      {
        title: "Considerações de Idade/Obesidade",
        items: [
          "Adultos >70 anos: limite superior de TSH pode chegar a 6-8 mU/L",
          "Obesidade classe 3 (IMC ≥40): limite até 7.5 mU/L",
        ],
      },
      {
        title: "Quando Solicitar TSH + T4 Livre Inicialmente",
        items: [
          "Doença pituitária ou hipotalâmica conhecida/suspeita",
          "Pacientes hospitalizados com suspeita de doença tireoidiana",
          "Uso de drogas que afetam TSH (dopamina, glucocorticoides, amiodarona)",
        ],
      },
      {
        title: "Indicações para Testar",
        items: [
          "Sintomas: fadiga, intolerância ao frio, ganho de peso, constipação, pele seca, mialgia",
          "Hipercolesterolemia substancial",
          "Hiponatremia",
          "Elevações de enzimas musculares",
          "Anemia macrocítica",
          "Derrame pericárdico/pleural",
          "História de injúria tireoidiana (radioiodo, cirurgia, radioterapia)",
          "Histórico de doenças autoimunes",
        ],
      },
    ],
  },
  {
    id: "intolerancia-lactose",
    name: "Intolerância à Lactose",
    shortName: "Int. Lactose",
    sections: [
      {
        title: "Diagnóstico Clínico",
        items: [
          "Dor/desconforto abdominal, distensão, diarréia, flatulência, eructações após ingestão de lactose",
          "Sintomas ocorrem 30 min - 2 horas após consumo",
        ],
      },
      {
        title: "Testes Diagnósticos",
        items: [
          "Teste do Hidrogênio Expirado (Gold Standard): elevação ≥20 ppm de H2 sobre baseline",
          "Teste da Tolerância à Lactose: queda de >20 mg/dL em glicose plasmática + sintomas GI",
          "Teste de Carga de Sorbitol: baseline para comparação",
        ],
      },
    ],
  },
  {
    id: "depressao",
    name: "Depressão (Transtorno Depressivo Maior)",
    shortName: "Depressão",
    sections: [
      {
        title: "Critérios DSM-5",
        note: "≥5 dos seguintes sintomas durante ≥2 semanas (incluir ≥1 humor deprimido OU anedonia):",
        items: [
          "1. Humor deprimido a maioria dos dias",
          "2. Anedonia (perda de interesse/prazer)",
          "3. Alteração significativa de peso/apetite",
          "4. Insônia/hipersônia",
          "5. Agitação/retardo psicomotor",
          "6. Fadiga/perda de energia",
          "7. Sentimentos de inutilidade/culpa excessiva",
          "8. Concentração reduzida/tomada de decisão",
          "9. Pensamentos recorrentes de morte/suicídio",
        ],
      },
      {
        title: "Não é atribuído a:",
        items: [
          "Efeito fisiológico de substância/condição médica",
          "Transtorno psicótico",
          "Transtorno bipolar",
          "Luto complicado",
        ],
      },
    ],
  },
  {
    id: "tag",
    name: "Transtorno de Ansiedade Generalizada",
    shortName: "TAG",
    sections: [
      {
        title: "Critérios DSM-5",
        note: "Preocupação excessiva >6 meses, maioria dos dias, difícil de controlar. ≥3 dos seguintes:",
        items: [
          "Inquietação/agitação",
          "Fadiga fácil",
          "Dificuldade de concentração",
          "Irritabilidade",
          "Tensão muscular",
          "Perturbação do sono",
        ],
        subsections: [
          {
            title: "Requisito adicional:",
            items: ["Causa sofrimento clinicamente significativo"],
          },
        ],
      },
    ],
  },
  {
    id: "osteoartrite",
    name: "Osteoartrite",
    shortName: "Osteoartrite",
    sections: [
      {
        title: "Critérios ACR — Mão",
        items: [
          "Dor/rigidez + ≥3 de: inchaço ósseo duro, sensibilidade nodular, nenhuma inflamação de tecido mole",
        ],
      },
      {
        title: "Critérios ACR — Joelho",
        items: [
          "Dor no joelho (maioria dos dias) + ≥3 de: >55 anos, rigidez matutina <30 min, crepitância, osteófitos",
        ],
      },
      {
        title: "Critérios ACR — Quadril",
        items: [
          "Dor no quadril (maioria dos dias) + ≥2 de: >50 anos, rigidez matutina <60 min, limitação abdução",
        ],
      },
      {
        title: "Imagenologia",
        items: ["Radiografia: osteófitos, estreitamento do espaço articular"],
      },
    ],
  },
  {
    id: "drc",
    name: "Doença Renal Crônica",
    shortName: "DRC",
    sections: [
      {
        title: "Classificação KDIGO — Estágios por TFG",
        table: {
          headers: ["Estágio", "TFG (mL/min/1.73m²)", "Descrição"],
          rows: [
            ["1", "≥90", "Lesão renal com TFG normal"],
            ["2", "60-89", "TFG levemente reduzida"],
            ["3a", "45-59", "TFG moderadamente reduzida"],
            ["3b", "30-44", "TFG moderadamente reduzida"],
            ["4", "15-29", "TFG severamente reduzida"],
            ["5", "<15", "Falência renal"],
          ],
        },
      },
      {
        title: "Albumina Urinária",
        items: [
          "Normal: <10 mg/g creatinina",
          "Moderadamente aumentada: 10-29 mg/g",
          "Altamente aumentada: ≥30 mg/g",
        ],
      },
    ],
  },
  {
    id: "pcos",
    name: "Síndrome dos Ovários Policísticos (PCOS)",
    shortName: "PCOS",
    sections: [
      {
        title: "Critérios Rotterdam 2003 (≥2 de 3)",
        subsections: [
          {
            title: "1. Hiperandrogenismo (clínico OU bioquímico):",
            items: [
              "Clínico: hirsutismo, acne, alopecia",
              "Bioquímico: testosterona total/livre elevada",
            ],
          },
          {
            title: "2. Disfunção Ovariana:",
            items: [
              "Oligomenorreia/amenorreia",
              "Ovulação anovulatória",
              "Ultrassom: ≥12 folículos/ovário OU volume >10 mL",
            ],
          },
          {
            title: "3. Exclusão de causas secundárias",
            items: [],
          },
        ],
      },
      {
        title: "Testes Diagnósticos",
        items: [
          "Testosterona total/livre",
          "SHBG",
          "LH, FSH (razão >2-3)",
          "17-OH progesterona",
          "Glicemia de jejum/tolerância",
          "Perfil lipídico",
          "Ultrassom transvaginal",
        ],
      },
    ],
  },
  {
    id: "gerd",
    name: "Doença do Refluxo Gastroesofágico (DRGE)",
    shortName: "DRGE",
    sections: [
      {
        title: "Apresentação Clínica",
        items: [
          "Azia/queimação pós-prandial, retroesternal, >2x/semana",
          "Regurgitação de alimentos",
          "Disfagia",
          "Odinofagia",
        ],
      },
      {
        title: "Classificação",
        items: [
          "Não-erosivo: sintomas sem erosões à endoscopia",
          "Erosivo: erosões visíveis à endoscopia",
          "Esôfago de Barrett: metaplasia intestinal confirmada por biópsia",
        ],
      },
      {
        title: "Diagnóstico",
        items: [
          "Clínico (resposta a inibidor de bomba de prótons)",
          "Endoscopia superior (se sinais de alarme: disfagia, odinofagia, perda de peso, anemia)",
          "Manometria esofágica (avaliar pressão EEI se cirurgia considerada)",
          "pH-metria/impedância (se diagnóstico incerto)",
        ],
      },
    ],
  },
];
