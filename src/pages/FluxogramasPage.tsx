import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, GitBranch, BarChart3 } from "lucide-react";
import logoIatros from "@/assets/logo-iatros.png";
import { allFlowcharts } from "@/data/flowcharts/allFlowcharts";
import DecisionTree from "@/components/flowcharts/DecisionTree";
import MermaidDiagram from "@/components/flowcharts/MermaidDiagram";

type Tab = "tree" | "diagram";

export default function FluxogramasPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tab, setTab] = useState<Tab>("tree");
  const active = allFlowcharts[activeIndex];

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      style={{ fontFamily: "'Francois One', sans-serif" }}
    >
      <header className="w-full bg-gradient-to-r from-[#7B2FBE] via-[#9B30FF] to-[#7B2FBE] flex items-center justify-center py-3 px-4">
        <Link to="/">
          <img src={logoIatros} alt="IATROS" className="h-12 sm:h-16 object-contain" />
        </Link>
      </header>

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
        <aside className="lg:w-64 shrink-0">
          <h2 className="text-lg font-bold mb-3" style={{ color: "#4A2800" }}>
            Fluxogramas Diagnósticos
          </h2>

          <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {allFlowcharts.map((d, i) => (
              <button
                key={d.diseaseId}
                onClick={() => { setActiveIndex(i); setTab("tree"); }}
                className={`shrink-0 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                  i === activeIndex
                    ? "bg-[#E8720C] text-white border-[#D4841A]"
                    : "bg-[#FFF5EB] text-foreground border-[#E8720C]/30 hover:border-[#E8720C]"
                }`}
              >
                {d.shortName}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex flex-col gap-1">
            {allFlowcharts.map((d, i) => (
              <button
                key={d.diseaseId}
                onClick={() => { setActiveIndex(i); setTab("tree"); }}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  i === activeIndex
                    ? "bg-[#E8720C] text-white"
                    : "text-foreground hover:bg-[#FFF5EB]"
                }`}
              >
                {d.shortName}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-foreground">{active.name}</h3>
            <p className="text-sm text-muted-foreground">{active.shortName} — Fluxograma Diagnóstico</p>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTab("tree")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                tab === "tree"
                  ? "bg-[#E8720C] text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <GitBranch className="h-4 w-4" />
              Árvore Interativa
            </button>
            <button
              onClick={() => setTab("diagram")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                tab === "diagram"
                  ? "bg-[#E8720C] text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Diagrama Visual
            </button>
          </div>

          {tab === "tree" ? (
            <DecisionTree key={active.diseaseId} flowchart={active} />
          ) : (
            <MermaidDiagram key={active.diseaseId} chart={active.mermaid} />
          )}

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="flex items-center gap-1 text-sm font-medium text-[#E8720C] disabled:opacity-30 disabled:cursor-not-allowed hover:underline"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            <span className="text-xs text-muted-foreground">
              {activeIndex + 1} / {allFlowcharts.length}
            </span>
            <button
              onClick={() => setActiveIndex(Math.min(allFlowcharts.length - 1, activeIndex + 1))}
              disabled={activeIndex === allFlowcharts.length - 1}
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