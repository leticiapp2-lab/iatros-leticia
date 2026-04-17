import { useEffect, useState } from "react";
import { RotateCcw, X } from "lucide-react";
import { useColetaStore } from "@/features/coleta-soap/store";
import { toast } from "sonner";

export default function NewColetaButton() {
  const [open, setOpen] = useState(false);
  const novaColeta = useColetaStore((s) => s.novaColeta);
  const salvarESnova = useColetaStore((s) => s.salvarESnova);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && e.shiftKey && (e.key === "N" || e.key === "n")) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleConfirm = () => {
    novaColeta();
    setOpen(false);
    toast.success("Nova coleta iniciada.");
  };

  const handleSalvarENova = () => {
    salvarESnova();
    setOpen(false);
    toast.success("Coleta atual salva no histórico. Nova coleta iniciada.");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Nova coleta (Ctrl+Shift+N)"
        className="flex items-center gap-2 border-2 border-destructive/40 bg-card hover:bg-destructive/5 text-destructive font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
      >
        <RotateCcw className="h-4 w-4" />
        Nova coleta
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] bg-foreground/40 grid place-items-center px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-lg text-foreground">Iniciar nova coleta?</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Descartar a coleta atual e começar uma nova? Todos os dados preenchidos serão perdidos.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSalvarENova}
                className="w-full px-4 py-2.5 rounded-md bg-[#7B2FBE] text-white text-sm font-semibold hover:bg-[#6A28A6] transition-colors"
              >
                Salvar coleta atual e iniciar nova
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-md border border-border text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-2.5 rounded-md bg-destructive text-destructive-foreground text-sm font-semibold hover:bg-destructive/90 transition-colors"
                >
                  Sim, começar do zero
                </button>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3 text-center">
              Atalho: Ctrl+Shift+N (Cmd+Shift+N no Mac)
            </p>
          </div>
        </div>
      )}
    </>
  );
}
