import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import logoIatros from "@/assets/logo-iatros.png";
import { diseases, type CriteriaSection } from "@/data/diseaseCriteria";

function SectionBlock({ section }: { section: CriteriaSection }) {
  return (
    <div className="mb-5">
      <h3
        className="text-base sm:text-lg font-semibold mb-2"
        style={{ fontFamily: "'Francois One', sans-serif", color: "#4A2800" }}
      >
        {section.title}
      </h3>

      {section.note && (
        <p className="text-sm text-muted-foreground mb-2 italic">{section.note}</p>
      )}

      {section.items && section.items.length > 0 && (
        <ul className="space-y-1.5 ml-1">
          {section.items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground">
              <span className="text-[#E8720C] mt-1 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {section.subsections?.map((sub, i) => (
        <div key={i} className="mt-3 ml-3 border-l-2 border-[#E8720C]/30 pl-3">
          <h4
            className="text-sm font-semibold mb-1.5"
            style={{ color: "#6B3A00" }}
          >
            {sub.title}
          </h4>
          {sub.items.length > 0 && (
            <ul className="space-y-1 ml-1">
              {sub.items.map((item, j) => (
                <li key={j} className="flex gap-2 text-sm text-foreground">
                  <span className="text-[#E8720C] mt-0.5 shrink-0">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {section.table && (
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#E8720C]/10">
                {section.table.headers.map((h, i) => (
                  <th
                    key={i}
                    className="text-left px-3 py-2 font-semibold border border-[#E8720C]/20"
                    style={{ color: "#4A2800" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-[#FFF5EB]/50"}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-1.5 border border-[#E8720C]/20 text-foreground">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function CriteriosPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = diseases[activeIndex];

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
        {/* Sidebar - disease list */}
        <aside className="lg:w-64 shrink-0">
          <h2
            className="text-lg font-bold mb-3"
            style={{ color: "#4A2800" }}
          >
            Critérios Diagnósticos
          </h2>

          {/* Mobile horizontal scroll */}
          <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {diseases.map((d, i) => (
              <button
                key={d.id}
                onClick={() => setActiveIndex(i)}
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

          {/* Desktop vertical list */}
          <div className="hidden lg:flex flex-col gap-1">
            {diseases.map((d, i) => (
              <button
                key={d.id}
                onClick={() => setActiveIndex(i)}
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

        {/* Content area */}
        <main className="flex-1 min-w-0">
          <div className="border-2 border-[#E8720C] rounded-xl bg-[#FFF5EB] p-4 sm:p-6">
            {/* Disease title */}
            <h2
              className="text-xl sm:text-2xl font-bold mb-5 pb-3 border-b-2 border-[#E8720C]/30"
              style={{ color: "#4A2800" }}
            >
              {active.name}
            </h2>

            {/* Sections */}
            <div className="space-y-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              {active.sections.map((section, i) => (
                <SectionBlock key={i} section={section} />
              ))}
            </div>

            {/* Prev / Next nav */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E8720C]/20">
              <button
                onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                className="flex items-center gap-1 text-sm font-medium text-[#E8720C] disabled:opacity-30 disabled:cursor-not-allowed hover:underline"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </button>
              <span className="text-xs text-muted-foreground">
                {activeIndex + 1} / {diseases.length}
              </span>
              <button
                onClick={() => setActiveIndex(Math.min(diseases.length - 1, activeIndex + 1))}
                disabled={activeIndex === diseases.length - 1}
                className="flex items-center gap-1 text-sm font-medium text-[#E8720C] disabled:opacity-30 disabled:cursor-not-allowed hover:underline"
              >
                Próximo
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
