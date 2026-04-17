import { History, X } from "lucide-react";
import { useState } from "react";
import { useColetaStore } from "@/features/coleta-soap/store";

export default function HistoryPanel() {
  const [open, setOpen] = useState(false);
  const history = useColetaStore((s) => s.history);
  const loadHistory = useColetaStore((s) => s.loadHistory);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 border border-border bg-card hover:bg-muted text-foreground font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
      >
        <History className="h-4 w-4" /> Coletas anteriores ({history.length})
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-foreground/40" onClick={() => setOpen(false)}>
          <aside
            className="absolute right-0 top-0 h-full w-full max-w-md bg-background border-l border-border shadow-xl p-5 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-foreground">Coletas anteriores</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {!history.length && (
              <p className="text-sm text-muted-foreground">Nenhuma coleta salva ainda.</p>
            )}
            <ul className="space-y-2">
              {history.map((h) => (
                <li key={h.id}>
                  <button
                    onClick={() => {
                      loadHistory(h.id);
                      setOpen(false);
                    }}
                    className="w-full text-left border border-border rounded-lg p-3 bg-card hover:border-[#7B2FBE]/50 transition-colors"
                  >
                    <p className="font-semibold text-sm text-foreground line-clamp-1">
                      {h.contexto.queixaPrincipal || "(sem queixa)"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {h.contexto.idade} anos, {h.contexto.sexo} —{" "}
                      {new Date(h.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </>
  );
}
