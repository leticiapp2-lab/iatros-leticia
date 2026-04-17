import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logoIatros from "@/assets/logo-iatros.png";
import { useColetaStore } from "@/features/coleta-soap/store";
import ColetaStepper from "@/features/coleta-soap/components/ColetaStepper";
import Step1Importar from "@/features/coleta-soap/components/Step1Importar";
import Step2Preencher from "@/features/coleta-soap/components/Step2Preencher";
import Step3Prompt from "@/features/coleta-soap/components/Step3Prompt";
import HistoryPanel from "@/features/coleta-soap/components/HistoryPanel";
import NewColetaButton from "@/features/coleta-soap/components/NewColetaButton";

const navButtons = [
  { label: "Coleta SOAP", href: "/coleta-soap" },
  { label: "Consulta Guiada", href: "/consulta" },
  { label: "Critérios Diagnósticos", href: "/criterios" },
  { label: "Fluxograma Diagnóstico", href: "/fluxogramas" },
  { label: "Calculadoras clínicas", href: "/calculadoras" },
  { label: "PDF editáveis", href: "/pdf" },
];

export default function ColetaSoapPage() {
  const step = useColetaStore((s) => s.step);
  const setStep = useColetaStore((s) => s.setStep);

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      style={{ fontFamily: "'Francois One', sans-serif" }}
    >
      <header className="w-full bg-gradient-to-r from-[#7B2FBE] via-[#9B30FF] to-[#7B2FBE] flex items-center justify-center py-5 px-6">
        <img
          src={logoIatros}
          alt="IATROS"
          className="h-48 sm:h-56 md:h-64 object-contain -my-14 sm:-my-16 md:-my-20 relative z-10"
        />
      </header>

      <nav className="w-full bg-gradient-to-r from-[#E8720C] to-[#F59E0B] px-6 py-3 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {navButtons.map((btn) => (
            <Link
              key={btn.href}
              to={btn.href}
              className={`border-2 border-[#D4841A] font-semibold text-base sm:text-lg px-6 sm:px-10 py-3 rounded-lg transition-colors text-center min-w-[160px] shadow-sm ${
                btn.href === "/coleta-soap"
                  ? "bg-[#D4841A] text-background"
                  : "bg-[#F5A623] hover:bg-[#E8960C] text-foreground"
              }`}
              style={{ fontFamily: "'Francois One', sans-serif" }}
            >
              {btn.label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="flex-1 flex flex-col max-w-6xl w-full mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Voltar ao início</span>
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <HistoryPanel />
            <NewColetaButton />
          </div>
        </div>

        <div className="border border-border rounded-2xl bg-card p-5 sm:p-6 mb-6 shadow-sm">
          <ColetaStepper step={step} onStepClick={setStep} />
        </div>

        <div key={step}>
          {step === 1 && <Step1Importar />}
          {step === 2 && <Step2Preencher />}
          {step === 3 && <Step3Prompt />}
        </div>
      </main>
    </div>
  );
}
