import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface DiseaseCategory {
  name: string;
  items: { label: string; slug: string }[];
}

const categories: DiseaseCategory[] = [
  {
    name: "Sintomas e Síndromes",
    items: [
      { label: "Dor Torácica", slug: "dor-toracica" },
      { label: "Cefaleia", slug: "cefaleia" },
      { label: "Dispneia", slug: "dispneia" },
      { label: "Dor Abdominal", slug: "dor-abdominal" },
      { label: "Febre", slug: "febre" },
      { label: "Lombalgia", slug: "lombalgia" },
    ],
  },
  {
    name: "Cardiologia",
    items: [
      { label: "Insuficiência Cardíaca", slug: "insuficiencia-cardiaca" },
      { label: "Fibrilação Atrial", slug: "fibrilacao-atrial" },
    ],
  },
  {
    name: "Pneumologia",
    items: [
      { label: "Pneumonia", slug: "pneumonia" },
      { label: "Asma", slug: "asma" },
      { label: "DPOC", slug: "dpoc" },
    ],
  },
  {
    name: "Endocrinologia",
    items: [
      { label: "Hipotireoidismo", slug: "hipotireoidismo" },
      { label: "Diabetes Mellitus", slug: "diabetes" },
    ],
  },
  {
    name: "Psiquiatria",
    items: [
      { label: "Depressão", slug: "depressao" },
      { label: "TDAH", slug: "tdah" },
      { label: "Ansiedade", slug: "ansiedade" },
    ],
  },
  {
    name: "Hematologia",
    items: [
      { label: "Anemia", slug: "anemia" },
    ],
  },
  {
    name: "Neurologia",
    items: [
      { label: "AVC", slug: "avc" },
    ],
  },
];

export function LibrarySidebar() {
  const location = useLocation();
  const [openCats, setOpenCats] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    categories.forEach(cat => {
      if (cat.items.some(item => location.pathname.includes(item.slug))) {
        initial.add(cat.name);
      }
    });
    if (initial.size === 0) initial.add(categories[0].name);
    return initial;
  });

  const toggleCat = (name: string) => {
    setOpenCats(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card overflow-y-auto hidden lg:block">
      <div className="p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Biblioteca Diagnóstica
        </h2>
        <div className="space-y-1">
          {categories.map(cat => (
            <div key={cat.name}>
              <button
                onClick={() => toggleCat(cat.name)}
                className="flex items-center justify-between w-full px-2 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
              >
                {cat.name}
                {openCats.has(cat.name) ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              {openCats.has(cat.name) && (
                <div className="ml-2 space-y-0.5 mt-0.5">
                  {cat.items.map(item => {
                    const path = `/biblioteca/${item.slug}`;
                    const active = location.pathname === path;
                    return (
                      <Link
                        key={item.slug}
                        to={path}
                        className={cn(
                          "block px-3 py-1.5 text-sm rounded-md transition-colors",
                          active
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
