import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import logoIatros from "@/assets/logo-iatros.png";
import { ConsultaProvider, useConsulta } from "@/components/consulta/ConsultaProvider";
import StepIndicator from "@/components/consulta/StepIndicator";
import EntradaStep from "@/components/consulta/EntradaStep";
import SubjetivoStep from "@/components/consulta/SubjetivoStep";

const navButtons = [
  { label: "Chat Auxiliar", href: "/chat" },
  { label: "Consulta Guiada", href: "/consulta" },
  { label: "Critérios Diagnósticos", href: "/criterios" },
  { label: "Calculadoras clínicas", href: "/calculadoras" },
  { label: "PDF editáveis", href: "/pdf" },
];

function ConsultaContent() {
  const { state, goToStep, reset } = useConsulta();

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      style={{ fontFamily: "'Francois One', sans-serif" }}
    >
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-[#7B2FBE] via-[#9B30FF] to-[#7B2FBE] flex items-center justify-center py-5 px-6">
        <img
          src={logoIatros}
          alt="IATROS"
          className="h-48 sm:h-56 md:h-64 object-contain -my-14 sm:-my-16 md:-my-20 relative z-10"
        />
      </header>

      {/* Nav */}
      <nav className="w-full bg-gradient-to-r from-[#E8720C] to-[#F59E0B] px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {navButtons.map((btn) => (
            <Link
              key={btn.href}
              to={btn.href}
              className={`border-2 border-[#D4841A] font-semibold text-base sm:text-lg px-6 sm:px-10 py-3 rounded-lg transition-colors text-center min-w-[160px] shadow-sm ${
                btn.href === "/consulta"
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

      {/* Main */}
      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 py-6">
        {/* Back + reset */}
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Voltar ao início</span>
          </Link>
          {state.currentStep !== "entrada" && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Nova consulta
            </button>
          )}
        </div>

        {/* Step indicator */}
        <StepIndicator currentStep={state.currentStep} onStepClick={goToStep} />

        {/* Step content */}
        <div className="mt-6">
          {state.currentStep === "entrada" && <EntradaStep />}
          {state.currentStep === "subjetivo" && <SubjetivoStep />}
          {state.currentStep === "objetivo" && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">🔬 Etapa Objetivo — Em breve (Fase 2)</p>
            </div>
          )}
          {state.currentStep === "avaliacao" && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">🧠 Etapa Avaliação — Em breve (Fase 3)</p>
            </div>
          )}
          {state.currentStep === "plano" && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">📝 Etapa Plano — Em breve (Fase 3)</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ConsultaPage() {
  return (
    <ConsultaProvider>
      <ConsultaContent />
    </ConsultaProvider>
  );
}
