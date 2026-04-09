import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  MessageSquare, BookOpen, ClipboardList, GitBranch, FileCheck, Stethoscope, Menu, X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Chat Auxiliar", href: "/chat", icon: MessageSquare },
  { label: "Biblioteca", href: "/biblioteca", icon: BookOpen },
  { label: "Checklists", href: "/biblioteca?tab=checklists", icon: ClipboardList },
  { label: "Fluxogramas", href: "/biblioteca?tab=fluxogramas", icon: GitBranch },
  { label: "Critérios", href: "/biblioteca?tab=criterios", icon: FileCheck },
];

export function TopNav() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6 max-w-screen-2xl mx-auto">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Stethoscope className="h-6 w-6 text-primary" />
          <span className="font-serif font-bold text-lg text-foreground hidden sm:inline">Raciocínio Clínico</span>
          <span className="font-serif font-bold text-lg text-foreground sm:hidden">RC</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => {
            const active = location.pathname === item.href || 
              (item.href !== "/" && location.pathname.startsWith(item.href.split("?")[0]));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
