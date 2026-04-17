/**
 * Template inicial a ser colado no OpenEvidence.
 * Garante que a resposta venha estruturada em DUAS PARTES com marcadores fixos:
 *   <<<COLETA>>> ... <<<FIM_COLETA>>>
 *   <<<RACIOCINIO>>> ... <<<FIM_RACIOCINIO>>>
 */
export const TEMPLATE_PROMPT_OPENEVIDENCE = `Você é um assistente clínico baseado em evidências. Vou descrever um paciente e quero que você produza a resposta em DOIS BLOCOS bem demarcados, exatamente nesta ordem e com estes marcadores fixos. NÃO escreva nada antes do primeiro marcador nem depois do último.

REGRAS DO BLOCO 1 (COLETA):
- É uma LISTA EXAUSTIVA de itens a serem coletados/examinados, sem prosa explicativa.
- Use cabeçalhos "## " para seção principal e "### " para subseção.
- Cada item de coleta deve estar em UMA linha começando com "- [TAG] " usando exatamente uma das tags abaixo:
  • [PERGUNTA]  → afirmação clínica curta e em 3ª pessoa, SEM ponto de interrogação. Ex.: "- [PERGUNTA] Dor piora pela manhã"
  • [NUMERO]    → medida numérica. Inclua "| unidade: <unidade>" no final. Ex.: "- [NUMERO] PA sistólica | unidade: mmHg"
  • [MANOBRA]   → manobra/teste especial do exame físico. Ex.: "- [MANOBRA] Straight-leg raise ipsilateral"
  • [ESCALA]    → escala/questionário. Inclua "| min: X | max: Y" se aplicável. Ex.: "- [ESCALA] EVA | min: 0 | max: 10"
- NÃO inclua diagnósticos diferenciais, tratamentos, LRs, raciocínio nem referências bibliográficas neste bloco.
- Seções esperadas (use só as que fizerem sentido para o caso):
  ## ANAMNESE
    ### HDA
    ### Sintomas Associados
    ### Revisão de Sistemas
    ### Red Flags
    ### História Médica Pregressa
    ### Medicações em Uso
    ### Alergias
    ### História Familiar
    ### História Social
  ## SINAIS VITAIS E ANTROPOMETRIA
  ## EXAME FÍSICO
    ### Exame Geral
    ### Exame Neurológico (ou outros sistemas relevantes)
    ### Manobras Especiais
    ### Escalas a Aplicar
  ## EXAMES COMPLEMENTARES
    ### Laboratório
    ### Imagem

REGRAS DO BLOCO 2 (RACIOCINIO):
- Texto livre em prosa e tabelas markdown.
- Inclua: diagnósticos diferenciais com probabilidade pré-teste, red flags com LR+, exames complementares justificados, vieses cognitivos a evitar, sugestões de conduta/tratamento.
- Pode usar referências [1][2] e tabelas markdown.

FORMATO EXATO DA RESPOSTA:

<<<COLETA>>>
## ANAMNESE
### HDA
- [PERGUNTA] ...
...
<<<FIM_COLETA>>>

<<<RACIOCINIO>>>
... raciocínio em prosa e tabelas markdown ...
<<<FIM_RACIOCINIO>>>

Agora, o paciente é:
[DESCREVA AQUI O CASO: idade, sexo, ocupação, queixa principal, contexto de atendimento e dados relevantes]
`;
