import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function FluxogramasPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="w-full bg-gradient-to-r from-[#7B2FBE] via-[#9B30FF] to-[#7B2FBE] flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-white hover:opacity-80 transition-opacity">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1
          className="text-2xl sm:text-3xl font-bold text-white text-center flex-1"
          style={{ fontFamily: "'Francois One', sans-serif" }}
        >
          Fluxograma Diagnóstico para Problemas
        </h1>
        <div className="w-6" />
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-muted-foreground text-center text-lg">
          Em breve — fluxogramas interativos para auxílio no raciocínio diagnóstico.
        </p>
      </main>
    </div>
  );
}
