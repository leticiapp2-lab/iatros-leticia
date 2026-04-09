import { MainLayout } from "@/components/MainLayout";
import { LibrarySidebar } from "@/components/LibrarySidebar";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const featured = [
  { label: "Dor Torácica", slug: "dor-toracica", desc: "Abordagem diagnóstica da dor torácica aguda e crônica" },
  { label: "Cefaleia", slug: "cefaleia", desc: "Diagnóstico diferencial e red flags de cefaleia" },
  { label: "Dispneia", slug: "dispneia", desc: "Avaliação sistemática da dispneia aguda" },
  { label: "Dor Abdominal", slug: "dor-abdominal", desc: "Raciocínio clínico para dor abdominal" },
  { label: "Pneumonia", slug: "pneumonia", desc: "Diagnóstico e manejo da pneumonia adquirida na comunidade" },
  { label: "Depressão", slug: "depressao", desc: "Critérios diagnósticos e abordagem da depressão" },
  { label: "Hipotireoidismo", slug: "hipotireoidismo", desc: "Quando suspeitar e como investigar" },
  { label: "Anemia", slug: "anemia", desc: "Fluxograma diagnóstico de investigação de anemia" },
];

export default function LibraryPage() {
  return (
    <MainLayout>
      <LibrarySidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Biblioteca Diagnóstica</h1>
          <p className="text-muted-foreground mb-8">
            Consulte conteúdo estruturado por doenças e síndromes com foco em raciocínio clínico.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {featured.map(item => (
              <Link
                key={item.slug}
                to={`/biblioteca/${item.slug}`}
                className="medical-card group hover:shadow-md transition-all hover:border-primary/30"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.label}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
