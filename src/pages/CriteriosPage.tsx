import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import logoIatros from "@/assets/logo-iatros.png";
import { interactiveDiseases } from "@/data/interactiveCriteria";
import InteractiveCriteriaCard from "@/components/criteria/InteractiveCriteriaCard";

interface SpecialtyGroup {
  name: string;
  diseaseIds: string[];
}

const specialtyGroups: SpecialtyGroup[] = [
  {
    name: "Psiquiatria",
    diseaseIds: ["depressao", "tag", "tab", "esquizofrenia", "tdah", "tea", "panico", "tept", "toc", "fobia-especifica", "agorafobia"],
  },
  {
    name: "Reumatologia",
    diseaseIds: ["les", "artrite-reumatoide", "osteoartrite-joelho", "fibromialgia-acr", "fibromialgia-aapt", "osteoporose"],
  },
  {
    name: "Endocrinologia",
    diseaseIds: ["diabetes-tipo-2", "hipotireoidismo", "hipertireoidismo"],
  },
  {
    name: "Cardiologia",
    diseaseIds: ["hipertensao", "dislipidemia"],
  },
  {
    name: "Nefrologia",
    diseaseIds: ["drc"],
  },
  {
    name: "Neurologia",
    diseaseIds: ["enxaqueca-sem-aura"],
  },
  {
    name: "Gastroenterologia",
    diseaseIds: ["ibs"],
  },
  {
    name: "Ginecologia",
    diseaseIds: ["pcos"],
  },
  {
    name: "Infectologia",
    diseaseIds: ["tuberculose", "hanseniase", "hiv", "sifilis", "hepatite-c"],
  },
];

// Build a map for quick lookup
const diseaseMap = new Map(interactiveDiseases.map((d) => [d.id, d]));

export default function CriteriosPage() {
  const [activeId, setActiveId] = useState(interactiveDiseases[0].id);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(specialtyGroups.map((g) => g.name))
  );

  const active = diseaseMap.get(activeId) ?? interactiveDiseases[0];

  // flat ordered list for prev/next
  const flatIds = specialtyGroups.flatMap((g) => g.diseaseIds);
  const activeIndex = flatIds.indexOf(activeId);

  const toggleGroup = (name: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

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
        <aside className="lg:w-72 shrink-0">
          <h2 className="text-lg font-bold mb-3" style={{ fontFamily: "'Francois One', sans-serif", color: "#4A2800" }}>
            Critérios Diagnósticos
          </h2>

          {/* Mobile horizontal scroll */}
          <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 -mx-4 px-4" style={{ fontFamily: "'Lato', sans-serif" }}>
            {interactiveDiseases.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveId(d.id)}
                className={`shrink-0 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                  d.id === activeId
                    ? "bg-[#E8720C] text-white border-[#D4841A]"
                    : "bg-[#FFF5EB] border-[#E8720C]/30 hover:border-[#E8720C]"
                }`}
                style={{ color: d.id === activeId ? undefined : "#545454" }}
              >
                {d.shortName}
              </button>
            ))}
          </div>

          {/* Desktop grouped list */}
          <div className="hidden lg:flex flex-col gap-1" style={{ fontFamily: "'Lato', sans-serif" }}>
            {specialtyGroups.map((group) => {
              const isExpanded = expandedGroups.has(group.name);
              const hasActive = group.diseaseIds.includes(activeId);

              return (
                <div key={group.name} className="mb-1">
                  <button
                    onClick={() => toggleGroup(group.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                      hasActive ? "bg-[#E8720C]/10" : "hover:bg-[#FFF5EB]"
                    }`}
                    style={{ fontFamily: "'Francois One', sans-serif", color: "#4A2800" }}
                  >
                    {group.name}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      style={{ color: "#4A2800" }}
                    />
                  </button>

                  {isExpanded && (
                    <div className="ml-2 mt-0.5 flex flex-col gap-0.5">
                      {group.diseaseIds.map((id) => {
                        const d = diseaseMap.get(id);
                        if (!d) return null;
                        return (
                          <button
                            key={id}
                            onClick={() => setActiveId(id)}
                            className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              id === activeId
                                ? "bg-[#E8720C] text-white"
                                : "hover:bg-[#FFF5EB]"
                            }`}
                            style={{ color: id === activeId ? undefined : "#545454" }}
                          >
                            {d.shortName}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <InteractiveCriteriaCard key={active.id} disease={active} />

          {/* Prev / Next */}
          <div className="flex items-center justify-between mt-4" style={{ fontFamily: "'Lato', sans-serif", color: "#545454" }}>
            <button
              onClick={() => activeIndex > 0 && setActiveId(flatIds[activeIndex - 1])}
              disabled={activeIndex <= 0}
              className="flex items-center gap-1 text-sm font-medium text-[#E8720C] disabled:opacity-30 disabled:cursor-not-allowed hover:underline"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            <span className="text-xs" style={{ color: "#545454" }}>
              {activeIndex + 1} / {flatIds.length}
            </span>
            <button
              onClick={() => activeIndex < flatIds.length - 1 && setActiveId(flatIds[activeIndex + 1])}
              disabled={activeIndex >= flatIds.length - 1}
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
