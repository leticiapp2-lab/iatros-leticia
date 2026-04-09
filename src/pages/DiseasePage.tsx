import { MainLayout } from "@/components/MainLayout";
import { LibrarySidebar } from "@/components/LibrarySidebar";
import { ClinicalAlert } from "@/components/ClinicalAlert";
import { ClinicalChecklist } from "@/components/ClinicalChecklist";
import { Flowchart } from "@/components/Flowchart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";

// Example data for Dor Torácica — in a real app, this would come from a CMS or database
const dorToracicaData = {
  title: "Dor Torácica",
  subtitle: "Abordagem diagnóstica da dor torácica aguda e crônica",
  overview: {
    definition: "Dor ou desconforto na região torácica, uma das queixas mais frequentes em pronto-socorro e ambulatório.",
    importance: "Pode representar desde condições benignas (dor musculoesquelética) até emergências com risco de vida (SCA, TEP, dissecção aórtica, pneumotórax hipertensivo).",
    typicalPresentation: "Varia enormemente conforme a etiologia. A localização, irradiação, caráter, duração, fatores desencadeantes e de alívio são fundamentais para o diagnóstico diferencial.",
  },
  suspicion: [
    "Dor retroesternal com irradiação para MSE, mandíbula ou dorso",
    "Dor torácica com dispneia associada",
    "Dor torácica pleurítica + taquicardia",
    "Dor torácica intensa de início súbito",
    "Dor torácica em paciente com fatores de risco cardiovascular",
    "Dor que piora com exercício e melhora com repouso",
  ],
  anamnesis: [
    { question: "Quando começou? É contínua ou intermitente?", rationale: "Cronologia diferencia SCA de dor crônica" },
    { question: "Qual a localização exata e irradiação?", rationale: "Irradiação para MSE/mandíbula sugere isquemia; para dorso sugere dissecção" },
    { question: "Piora com inspiração profunda?", rationale: "Dor pleurítica sugere TEP, pericardite, pneumotórax ou pleural" },
    { question: "Piora com palpação/movimento?", rationale: "Sugere causa musculoesquelética (mas não exclui SCA)" },
    { question: "Relação com esforço físico?", rationale: "Dor ao esforço com alívio ao repouso é altamente sugestiva de angina" },
    { question: "Sintomas associados? (dispneia, náusea, sudorese, síncope)", rationale: "Sintomas neurovegetativos aumentam probabilidade de SCA" },
    { question: "Antecedentes: HAS, DM, tabagismo, dislipidemia, história familiar de DAC?", rationale: "Fatores de risco cardiovascular modificam probabilidade pré-teste" },
    { question: "Uso de anticoncepcional, imobilização recente, viagem longa?", rationale: "Fatores de risco para TEP" },
  ],
  physicalExam: [
    { finding: "PA e FC em ambos os membros", significance: "Diferença > 20 mmHg sugere dissecção aórtica" },
    { finding: "SpO2", significance: "Hipoxemia em TEP, pneumotórax, pneumonia" },
    { finding: "Ausculta cardíaca", significance: "B3, sopros novos, atrito pericárdico" },
    { finding: "Ausculta pulmonar", significance: "MV abolido (pneumotórax), crepitações (pneumonia, ICC), sibilos" },
    { finding: "Palpação torácica", significance: "Dor reprodutível à palpação sugere causa musculoesquelética" },
    { finding: "Edema de MMII unilateral", significance: "Sugere TVP → alto risco de TEP" },
    { finding: "Turgência jugular", significance: "ICC, tamponamento, pneumotórax hipertensivo" },
  ],
  hypotheses: [
    { name: "Síndrome Coronariana Aguda", probability: "alta", justification: "Dor retroesternal típica + fatores de risco. Principal causa a ser excluída em dor torácica aguda." },
    { name: "Tromboembolismo Pulmonar", probability: "média-alta", justification: "Dor pleurítica + dispneia + taquicardia, especialmente com fatores de risco para TEV." },
    { name: "Dissecção Aórtica", probability: "baixa", justification: "Dor dilacerante súbita com irradiação para dorso. Rara, mas letal se não diagnosticada." },
    { name: "Pneumotórax", probability: "média", justification: "Dor torácica aguda + dispneia em jovem longilíneo ou pós-trauma." },
    { name: "Pericardite", probability: "média", justification: "Dor que piora ao deitar e melhora sentado para frente, com atrito pericárdico." },
    { name: "Dor Musculoesquelética", probability: "alta (prevalência)", justification: "Causa mais comum de dor torácica, reprodutível à palpação. Diagnóstico de exclusão." },
    { name: "DRGE / Espasmo esofágico", probability: "média", justification: "Dor retroesternal em queimação, piora pós-prandial. Pode mimetizar SCA." },
  ],
  redFlags: [
    "Dor torácica intensa de início súbito",
    "Instabilidade hemodinâmica (hipotensão, taquicardia)",
    "Dispneia aguda intensa",
    "Diferença de PA entre os membros",
    "Alteração do nível de consciência",
    "Sinais de tamponamento (tríade de Beck)",
    "MV abolido unilateral + desvio de traqueia",
    "Sudorese profusa, palidez, náusea",
  ],
  checklist: [
    { id: "1", label: "Verificar sinais vitais completos (PA bilateral, FC, FR, SpO2, T)", detail: "Diferença de PA > 20 mmHg: pensar em dissecção" },
    { id: "2", label: "ECG de 12 derivações em < 10 min", detail: "Supra de ST, infra de ST, inversão de T, BRE novo" },
    { id: "3", label: "Avaliar troponina", detail: "Troponina de alta sensibilidade se disponível" },
    { id: "4", label: "Radiografia de tórax", detail: "Pneumotórax, alargamento mediastinal, congestão pulmonar" },
    { id: "5", label: "Calcular escore de Wells/Geneva se suspeita de TEP" },
    { id: "6", label: "Avaliar reprodutibilidade da dor à palpação" },
    { id: "7", label: "Verificar história de imobilização, ACO, viagem longa" },
    { id: "8", label: "Reavaliar em 3-6h se primeira troponina negativa e suspeita de SCA" },
  ],
  pitfalls: [
    "Atribuir dor a causa musculoesquelética sem excluir SCA (reprodutibilidade à palpação não exclui isquemia em até 15% dos casos)",
    "Ignorar TEP em paciente jovem com dor pleurítica e taquicardia",
    "Não considerar dissecção aórtica por ser rara — mas letalidade é altíssima se não diagnosticada",
    "Confundir DRGE com SCA — ambas podem responder parcialmente a nitrato",
    "Subestimar dor torácica em mulheres e idosos — apresentações atípicas são comuns",
    "Não verificar PA em ambos os membros",
  ],
  flowchartSteps: [
    {
      id: "1", title: "Dor torácica aguda", type: "start" as const,
      branches: [
        {
          label: "Instável",
          steps: [
            { id: "1a", title: "Estabilizar ABC", type: "action" as const },
            { id: "1b", title: "ECG + monitória + acesso venoso", type: "action" as const },
            { id: "1c", title: "Excluir: SCA, TEP, dissecção, pneumotórax hipertensivo, tamponamento", type: "end" as const },
          ],
        },
        {
          label: "Estável",
          steps: [
            { id: "2a", title: "Anamnese + exame físico dirigido", type: "action" as const },
            { id: "2b", title: "ECG + troponina + RX tórax", type: "action" as const },
            { id: "2c", title: "Classificar: cardíaca vs pulmonar vs GI vs musculoesquelética", type: "decision" as const },
          ],
        },
      ],
    },
  ],
};

// A map for future disease pages
const diseaseMap: Record<string, typeof dorToracicaData> = {
  "dor-toracica": dorToracicaData,
};

function DiseasePlaceholder({ slug }: { slug: string }) {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Em construção</h2>
      <p className="text-muted-foreground">
        O conteúdo sobre <strong>{slug}</strong> está sendo elaborado.
      </p>
    </div>
  );
}

export default function DiseasePage() {
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? diseaseMap[slug] : undefined;

  if (!data) {
    return (
      <MainLayout>
        <LibrarySidebar />
        <main className="flex-1 p-6 lg:p-8">
          <DiseasePlaceholder slug={slug || ""} />
        </main>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <LibrarySidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-1">{data.title}</h1>
          <p className="text-muted-foreground mb-6">{data.subtitle}</p>

          <Tabs defaultValue="visao-geral" className="w-full">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 rounded-xl mb-6">
              <TabsTrigger value="visao-geral" className="rounded-lg text-xs sm:text-sm">Visão Geral</TabsTrigger>
              <TabsTrigger value="anamnese" className="rounded-lg text-xs sm:text-sm">Anamnese</TabsTrigger>
              <TabsTrigger value="exame" className="rounded-lg text-xs sm:text-sm">Exame Físico</TabsTrigger>
              <TabsTrigger value="hipoteses" className="rounded-lg text-xs sm:text-sm">Hipóteses</TabsTrigger>
              <TabsTrigger value="fluxograma" className="rounded-lg text-xs sm:text-sm">Fluxograma</TabsTrigger>
              <TabsTrigger value="checklist" className="rounded-lg text-xs sm:text-sm">Checklist</TabsTrigger>
              <TabsTrigger value="alertas" className="rounded-lg text-xs sm:text-sm">Red Flags</TabsTrigger>
              <TabsTrigger value="armadilhas" className="rounded-lg text-xs sm:text-sm">Armadilhas</TabsTrigger>
            </TabsList>

            {/* Visão Geral */}
            <TabsContent value="visao-geral" className="space-y-4">
              <div className="medical-card">
                <h3 className="section-title">Definição</h3>
                <p className="text-sm text-foreground">{data.overview.definition}</p>
              </div>
              <ClinicalAlert variant="info" title="Importância clínica">
                {data.overview.importance}
              </ClinicalAlert>
              <div className="medical-card">
                <h3 className="section-title">Apresentação típica</h3>
                <p className="text-sm text-foreground">{data.overview.typicalPresentation}</p>
              </div>
              <div className="medical-card">
                <h3 className="section-title">Quando suspeitar</h3>
                <ul className="space-y-2">
                  {data.suspicion.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            {/* Anamnese */}
            <TabsContent value="anamnese" className="space-y-3">
              <h3 className="section-title">🩺 Perguntas que mais ajudam</h3>
              {data.anamnesis.map((q, i) => (
                <div key={i} className="medical-card">
                  <p className="text-sm font-medium text-foreground mb-1">"{q.question}"</p>
                  <p className="text-xs text-muted-foreground">→ {q.rationale}</p>
                </div>
              ))}
            </TabsContent>

            {/* Exame Físico */}
            <TabsContent value="exame">
              <h3 className="section-title">🔎 Exame físico direcionado</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Achado</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Significância</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.physicalExam.map((pe, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-3 px-4 font-medium">{pe.finding}</td>
                        <td className="py-3 px-4 text-muted-foreground">{pe.significance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Hipóteses */}
            <TabsContent value="hipoteses" className="space-y-3">
              <h3 className="section-title">🧠 Hipóteses diagnósticas</h3>
              {data.hypotheses.map((h, i) => (
                <div key={i} className="medical-card">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-foreground">{h.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      h.probability.includes("alta") ? "bg-destructive/10 text-destructive" :
                      h.probability.includes("média") ? "bg-warning/10 text-warning" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {h.probability}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{h.justification}</p>
                </div>
              ))}
            </TabsContent>

            {/* Fluxograma */}
            <TabsContent value="fluxograma">
              <Flowchart title="Fluxograma — Dor Torácica Aguda" steps={data.flowchartSteps} />
            </TabsContent>

            {/* Checklist */}
            <TabsContent value="checklist">
              <ClinicalChecklist title="Checklist — Dor Torácica Aguda" items={data.checklist} />
            </TabsContent>

            {/* Red Flags */}
            <TabsContent value="alertas" className="space-y-3">
              <ClinicalAlert variant="danger" title="🚨 Sinais de alerta — Dor Torácica">
                <ul className="space-y-2 mt-2">
                  {data.redFlags.map((rf, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-destructive font-bold">!</span>
                      <span>{rf}</span>
                    </li>
                  ))}
                </ul>
              </ClinicalAlert>
            </TabsContent>

            {/* Armadilhas */}
            <TabsContent value="armadilhas" className="space-y-3">
              <h3 className="section-title">⚠️ Armadilhas diagnósticas</h3>
              {data.pitfalls.map((p, i) => (
                <ClinicalAlert key={i} variant="warning">
                  {p}
                </ClinicalAlert>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </MainLayout>
  );
}
