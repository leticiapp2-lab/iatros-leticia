import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import logoIatros from "@/assets/logo-iatros.png";
import { interactiveDiseases } from "@/data/interactiveCriteria";
import InteractiveCriteriaCard from "@/components/criteria/InteractiveCriteriaCard";

export default function CriteriosPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = interactiveDiseases[activeIndex];

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      style={{ fontFamily: "'Francois One', sans-serif" }}
    >
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-[#7B2FBE] via-[#9B30FF] to-[#7B2FBE] flex items-center justify-center py-3 px-4">
        <Link to="/">
          <img src={logoIatros} alt="IATROS" className="h-12 sm:h-16 object-contain" />
        </Link>
      </header>

      {/* Nav bar */}
      <nav className="w-full bg-gradient-to-r from-[#E8720C] to-[#F59E0B] px-4 py-2">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <Link
            to="/"
            className="bg-[#F5A623] hover:bg-[#E8960C] border-2 border-[#D4841A] text-foreground font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 rounded-lg transition-colors text-center shadow-sm"
          >
            ← Início
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto w-full px-4 py-6 gap-4">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <h2 className="text-lg font-bold mb-3" style={{ fontFamily: "'Francois One', sans-serif", color: "#4A2800" }}>
            Critérios Diagnósticos
          </h2>

          {/* Mobile horizontal scroll */}
          <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 -mx-4 px-4" style={{ fontFamily: "'Lato', sans-serif" }}>
            {interactiveDiseases.map((d, i) => (
              <button
                key={d.id}
                onClick={() => setActiveIndex(i)}
                className={`shrink-0 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                  i === activeIndex
                    ? "bg-[#E8720C] text-white border-[#D4841A]"
                    : "bg-[#FFF5EB] border-[#E8720C]/30 hover:border-[#E8720C]"
                }`}
                style={{ color: i === activeIndex ? undefined : "#545454" }}
              >
                {d.shortName}
              </button>
            ))}
          </div>

          {/* Desktop vertical list */}
          <div className="hidden lg:flex flex-col gap-1" style={{ fontFamily: "'Lato', sans-serif" }}>
            {interactiveDiseases.map((d, i) => (
              <button
                key={d.id}
                onClick={() => setActiveIndex(i)}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  i === activeIndex
                    ? "bg-[#E8720C] text-white"
                    : "hover:bg-[#FFF5EB]"
                }`}
                style={{ color: i === activeIndex ? undefined : "#545454" }}
              >
                {d.shortName}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <InteractiveCriteriaCard key={active.id} disease={active} />

          {/* Prev / Next */}
          <div className="flex items-center justify-between mt-4" style={{ fontFamily: "'Lato', sans-serif", color: "#545454" }}>
            <button
              onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="flex items-center gap-1 text-sm font-medium text-[#E8720C] disabled:opacity-30 disabled:cursor-not-allowed hover:underline"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            <span className="text-xs" style={{ color: "#545454" }}>
              {activeIndex + 1} / {interactiveDiseases.length}
            </span>
            <button
              onClick={() =>
                setActiveIndex(Math.min(interactiveDiseases.length - 1, activeIndex + 1))
              }
              disabled={activeIndex === interactiveDiseases.length - 1}
              className="flex items-center gap-1 text-sm font-medium text-[#E8720C] disabled:opacity-30 disabled:cursor-not-allowed hover:underline"
            >
              Próximo
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
