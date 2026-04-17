import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logoIatros from "@/assets/logo-iatros.png";

const navButtons = [
  { label: "Coleta SOAP", href: "/coleta-soap" },
  { label: "Consulta Guiada", href: "/consulta" },
  { label: "Critérios Diagnósticos", href: "/criterios" },
  { label: "Fluxograma Diagnóstico", href: "/fluxogramas" },
  { label: "Calculadoras clínicas", href: "/calculadoras" },
  { label: "PDF editáveis", href: "/pdf" },
];

export default function ConsultaPage() {
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
      <nav className="w-full bg-gradient-to-r from-[#E8720C] to-[#F59E0B] px-6 py-3 relative z-20">
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
      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 py-10">
        <Link
          to="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Voltar ao início</span>
        </Link>

        <div className="border border-border rounded-2xl bg-card p-10 text-center shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Consulta Guiada
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Esta seção será reconstruída em breve.
          </p>
        </div>
      </main>
    </div>
  );
}
