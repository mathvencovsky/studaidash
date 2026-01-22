import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { 
  Home, 
  Map, 
  Sparkles,
  FileQuestion, 
  Trophy, 
  User, 
  Settings, 
  Menu, 
  BarChart3,
  GraduationCap,
  Target,
  Eye,
  PlayCircle,
  Activity,
  Compass
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface AppLayoutProps {
  children: React.ReactNode;
}

// Main navigation - DataCamp style organization
const mainNavItems = [
  { to: "/", icon: Home, label: "Dashboard" },
  { to: "/objetivo", icon: Target, label: "Meu Objetivo" },
  { to: "/trilha/visao-geral", icon: Eye, label: "Visão Geral" },
  { to: "/estudar", icon: Sparkles, label: "Estudar com IA" },
  { to: "/explorar", icon: Compass, label: "Explorar Trilhas" },
  { to: "/trilha", icon: Map, label: "Minhas Trilhas" },
  { to: "/quizzes", icon: FileQuestion, label: "Simulados" },
];

const insightNavItems = [
  { to: "/relatorios", icon: BarChart3, label: "Relatórios" },
  { to: "/engajamento", icon: Activity, label: "Engajamento" },
  { to: "/ranking", icon: Trophy, label: "Ranking" },
];

const userNavItems = [
  { to: "/perfil", icon: User, label: "Perfil" },
  { to: "/configuracoes", icon: Settings, label: "Configurações" },
];

// Mobile bottom nav - most important actions
const mobileNavItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/estudar", icon: Sparkles, label: "Estudar" },
  { to: "/trilha", icon: Map, label: "Trilha" },
  { to: "/quizzes", icon: FileQuestion, label: "Quiz" },
  { to: "/relatorios", icon: BarChart3, label: "Stats" },
];

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavSection = ({ items, label }: { items: typeof mainNavItems; label?: string }) => (
    <div className="space-y-1">
      {label && (
        <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      )}
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          activeClassName="bg-primary/10 text-primary font-medium"
          onClick={() => setMobileMenuOpen(false)}
        >
          <item.icon size={18} />
          <span className="text-sm">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );

  const NavContent = () => (
    <nav className="flex flex-col gap-4 p-3">
      <NavSection items={mainNavItems} />
      <Separator className="mx-2" />
      <NavSection items={insightNavItems} label="Insights" />
      <Separator className="mx-2" />
      <NavSection items={userNavItems} label="Conta" />
    </nav>
  );

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Desktop Sidebar - DataCamp style */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card shrink-0">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1A237E] to-[#255FF1] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">StudAI</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <NavContent />
        </div>
        {/* Version Badge */}
        <div className="p-3 border-t">
          <p className="text-[10px] text-muted-foreground text-center">
            v1.0 • PMF Ready
          </p>
        </div>
      </aside>

      {/* Mobile Header + Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-card sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1A237E] to-[#255FF1] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">StudAI</span>
          </div>
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1A237E] to-[#255FF1] flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-lg">StudAI</span>
                </div>
              </div>
              <div className="py-2">
                <NavContent />
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>

        {/* Mobile Bottom Navigation - Improved touch targets */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t flex justify-around items-center py-1.5 px-1 z-40 safe-area-bottom">
          {mobileNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className="flex flex-col items-center gap-0.5 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors min-w-[52px] min-h-[48px] justify-center touch-manipulation active:scale-95"
              activeClassName="text-primary"
            >
              <item.icon size={22} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
