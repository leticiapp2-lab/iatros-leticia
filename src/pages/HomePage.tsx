import { MainLayout } from "@/components/MainLayout";
import { Link } from "react-router-dom";
import { MessageSquare, BookOpen, ArrowRight, Stethoscope, Brain, Shield, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Brain,
    title: "Raciocínio Estruturado",
    desc: "Organização sistemática do pensamento clínico com anamnese, exame físico e hipóteses diagnósticas.",
  },
  {
    icon: Shield,
    title: "Red Flags em Destaque",
    desc: "Sinais de alarme e diagnósticos que não podem ser esquecidos, sempre em evidência.",
  },
  {
    icon: ClipboardList,
    title: "Checklists e Fluxogramas",
    desc: "Ferramentas práticas para uso à beira do caso, com critérios diagnósticos organizados.",
  },
];

export default function HomePage() {
  return (
    <MainLayout>
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10" />
          <div className="relative max-w-5xl mx-auto px-4 py-20 lg:py-28 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-6">
              <Stethoscope className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Ferramenta Educacional Médica</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight mb-4">
              Apoio Inteligente ao<br />
              <span className="text-primary">Raciocínio Clínico</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Chat auxiliar com IA para análise de casos clínicos e biblioteca diagnóstica estruturada.
              Para estudantes, internos, residentes e médicos generalistas.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="rounded-xl text-base px-8">
                <Link to="/chat">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Chat Auxiliar Clínico
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl text-base px-8">
                <Link to="/biblioteca">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Biblioteca Diagnóstica
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="medical-card group hover:shadow-md transition-shadow">
                <div className="bg-primary/10 rounded-xl p-3 w-fit mb-4 group-hover:bg-primary/15 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Chat */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <div className="medical-card bg-gradient-to-r from-primary/5 to-accent/10 flex flex-col md:flex-row items-center gap-6 p-8">
            <div className="flex-1">
              <h2 className="text-xl font-serif font-bold text-foreground mb-2">
                Descreva um caso clínico agora
              </h2>
              <p className="text-muted-foreground text-sm">
                Insira sexo, idade, queixa principal e contexto. O Auxiliar Clínico organiza o raciocínio
                em anamnese, exame físico, hipóteses e sinais de alerta.
              </p>
            </div>
            <Button asChild size="lg" className="rounded-xl shrink-0">
              <Link to="/chat">
                Iniciar agora <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 text-center">
          <p className="text-xs text-muted-foreground">
            Ferramenta educacional de apoio ao raciocínio clínico — não substitui avaliação médica profissional
          </p>
        </footer>
      </main>
    </MainLayout>
  );
}
