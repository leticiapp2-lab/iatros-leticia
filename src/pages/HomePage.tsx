import { Link } from "react-router-dom";
import logoIatros from "@/assets/logo-iatros.png";
import mascot from "@/assets/mascot.png";

const navButtons = [
  { label: "Coleta SOAP", href: "/coleta-soap" },
  { label: "Consulta Guiada", href: "/consulta" },
  { label: "Critérios Diagnósticos", href: "/criterios" },
  { label: "Fluxograma Diagnóstico", href: "/fluxogramas" },
  { label: "Calculadoras clínicas", href: "/calculadoras" },
  { label: "PDF editáveis", href: "/pdf" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background" style={{ fontFamily: "'Francois One', sans-serif" }}>
      {/* Header with logo */}
      <header className="w-full bg-gradient-to-r from-[#7B2FBE] via-[#9B30FF] to-[#7B2FBE] flex items-center justify-center py-5 px-6">
        <img src={logoIatros} alt="IATROS" className="h-48 sm:h-56 md:h-64 object-contain -my-14 sm:-my-16 md:-my-20 relative z-10" />
      </header>

      {/* Navigation bar */}
      <nav className="w-full bg-gradient-to-r from-[#E8720C] to-[#F59E0B] px-6 py-3 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {navButtons.map((btn) => (
            <Link
              key={btn.href}
              to={btn.href}
              className="bg-[#F5A623] hover:bg-[#E8960C] border-2 border-[#D4841A] text-foreground font-semibold text-base sm:text-lg px-6 sm:px-10 py-3 rounded-lg transition-colors text-center min-w-[160px] shadow-sm"
              style={{ fontFamily: "'Francois One', sans-serif" }}
            >
              {btn.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 flex items-start justify-center px-6 py-10 sm:py-16">
        <div className="max-w-7xl w-full flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-14">
          {/* Mascot */}
          <div className="shrink-0 w-[21rem] sm:w-[24rem] md:w-[30rem]">
            <img src={mascot} alt="Iatros - Auxiliar Clínico" className="w-full h-auto" />
          </div>

          {/* Speech bubble */}
          <div className="flex-1 w-full">
            <div className="mb-8">
              <p className="text-foreground text-lg sm:text-xl leading-relaxed" style={{ fontFamily: "'Francois One', sans-serif" }}>
                "Olá, meu nome é Iatros e serei seu Auxiliar Clínico! Posso te auxiliar a encontrar as Abas
                Teóricas do site e guiar suas consultas com checklists baseados em evidências."
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
