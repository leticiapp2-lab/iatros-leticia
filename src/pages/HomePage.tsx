import { Link, useNavigate } from "react-router-dom";
import { Send } from "lucide-react";
import { useState } from "react";
import logoIatros from "@/assets/logo-iatros.png";
import mascot from "@/assets/mascot.png";

const navButtons = [
  { label: "Chat Auxiliar", href: "/chat" },
  { label: "Critérios Diagnósticos", href: "/criterios" },
  { label: "Calculadoras clínicas", href: "/calculadoras" },
  { label: "PDF editáveis", href: "/pdf" },
];

export default function HomePage() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSend = () => {
    if (!input.trim()) return;
    navigate("/chat", { state: { initialMessage: input.trim() } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" style={{ fontFamily: "'Francois One', sans-serif" }}>
      {/* Header with logo */}
      <header className="w-full bg-gradient-to-r from-[#7B2FBE] via-[#9B30FF] to-[#7B2FBE] flex items-center justify-center py-3 px-4">
        <img src={logoIatros} alt="IATROS" className="h-12 sm:h-16 object-contain" />
      </header>

      {/* Navigation bar */}
      <nav className="w-full bg-gradient-to-r from-[#E8720C] to-[#F59E0B] px-4 py-2">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {navButtons.map((btn) => (
            <Link
              key={btn.href}
              to={btn.href}
              className="bg-[#F5A623] hover:bg-[#E8960C] border-2 border-[#D4841A] text-foreground font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 rounded-lg transition-colors text-center min-w-[120px] shadow-sm"
              style={{ fontFamily: "'Francois One', sans-serif" }}
            >
              {btn.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
          {/* Mascot */}
          <div className="shrink-0 w-48 sm:w-56 md:w-64">
            <img src={mascot} alt="Iatros - Auxiliar Clínico" className="w-full h-auto" />
          </div>

          {/* Speech bubble + chat area */}
          <div className="flex-1 w-full">
            {/* Speech bubble */}
            <div className="mb-6">
              <p className="text-foreground text-base sm:text-lg leading-relaxed" style={{ fontFamily: "'Francois One', sans-serif" }}>
                "Olá, meu nome é Iatros e serei seu Auxiliar Clínico! Podemos
                nos falar pelo Chat ou posso te auxiliar a encontrar as Abas
                Teóricas do site."
              </p>
            </div>

            {/* Chat input area */}
            <div className="border-2 border-[#E8720C] rounded-xl bg-[#FFF5EB] p-3 sm:p-4 shadow-sm">
              {/* Message display area */}
              <div className="min-h-[180px] sm:min-h-[220px] mb-3 rounded-lg bg-card p-3">
                {/* Empty chat area */}
              </div>

              {/* Input bar */}
              <div className="flex items-center gap-2 border border-[#E8720C]/40 rounded-lg bg-card px-3 py-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Sexo, idade, queixa principal e tempo..."
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                <button
                  onClick={handleSend}
                  className="text-[#E8720C] hover:text-[#D4841A] transition-colors p-1"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
