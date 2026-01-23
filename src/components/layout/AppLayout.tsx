import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { 
  LayoutDashboard, 
  Map, 
  Sparkles,
  GraduationCap,
  BookOpen,
  Clock,
  Calendar,
  Target,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Activity,
  Bookmark,
  Settings,
  Menu,
  ChevronLeft,
  Compass,
  Library
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AppLayoutProps {
  children: React.ReactNode;
}

// Navigation sections matching the design
const aprenderItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/trilha/visao-geral", icon: Map, label: "Visão da Trilha" },
  { to: "/programas", icon: GraduationCap, label: "Programas" },
  { to: "/conteudos", icon: BookOpen, label: "Conteúdos" },
  { to: "/estudar", icon: Sparkles, label: "Assistente IA" },
  { to: "/explorar", icon: Compass, label: "Explorar Trilhas" },
  { to: "/trilha", icon: Library, label: "Minhas Trilhas" },
];

const progressoItems = [
  { to: "/sessoes", icon: Clock, label: "Sessões" },
  { to: "/calendario", icon: Calendar, label: "Calendário" },
  { to: "/metas", icon: Target, label: "Metas" },
  { to: "/revisoes", icon: RefreshCw, label: "Revisões" },
];

const analyticsItems = [
  { to: "/relatorios", icon: BarChart3, label: "Relatórios" },
  { to: "/roi-estudo", icon: TrendingUp, label: "ROI de Estudo" },
  { to: "/engajamento", icon: Activity, label: "Engajamento" },
];

const ferramentasItems = [
  { to: "/salvos", icon: Bookmark, label: "Salvos" },
  { to: "/configuracoes", icon: Settings, label: "Configurações" },
];

// Mobile bottom nav - most important actions
const mobileNavItems = [
  { to: "/", icon: LayoutDashboard, label: "Home" },
  { to: "/estudar", icon: Sparkles, label: "Estudar" },
  { to: "/programas", icon: GraduationCap, label: "Programas" },
  { to: "/sessoes", icon: Clock, label: "Sessões" },
  { to: "/relatorios", icon: BarChart3, label: "Stats" },
];

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const NavSection = ({ 
    items, 
    label,
    collapsed = false 
  }: { 
    items: typeof aprenderItems; 
    label: string;
    collapsed?: boolean;
  }) => (
    <div className="space-y-0.5">
      {!collapsed && (
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      )}
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ${collapsed ? "justify-center" : ""}`}
          activeClassName="bg-primary/10 text-primary font-medium"
          onClick={() => setMobileMenuOpen(false)}
        >
          <item.icon size={18} />
          {!collapsed && <span className="text-sm">{item.label}</span>}
        </NavLink>
      ))}
    </div>
  );

  const NavContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <nav className="flex flex-col gap-1 p-2">
      <NavSection items={aprenderItems} label="Aprender" collapsed={collapsed} />
      <NavSection items={progressoItems} label="Progresso" collapsed={collapsed} />
      <NavSection items={analyticsItems} label="Analytics" collapsed={collapsed} />
      <NavSection items={ferramentasItems} label="Ferramentas" collapsed={collapsed} />
    </nav>
  );

  const UserFooter = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className={`p-3 border-t ${collapsed ? "flex justify-center" : ""}`}>
      <div className={`flex items-center gap-3 ${collapsed ? "" : "px-2"}`}>
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
            J
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">João Silva</p>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              Pro
            </Badge>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col border-r bg-card shrink-0 transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Header */}
        <div className="p-3 border-b">
          <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"}`}>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1A237E] to-[#255FF1] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              {!sidebarCollapsed && <span className="font-bold text-lg">StudAI</span>}
            </div>
            {!sidebarCollapsed && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setSidebarCollapsed(true)}
              >
                <ChevronLeft size={18} />
              </Button>
            )}
          </div>
          {sidebarCollapsed && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 mt-2 w-full"
              onClick={() => setSidebarCollapsed(false)}
            >
              <Menu size={18} />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-2">
          <NavContent collapsed={sidebarCollapsed} />
        </div>

        {/* User Footer */}
        <UserFooter collapsed={sidebarCollapsed} />
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
            <SheetContent side="left" className="w-64 p-0 flex flex-col">
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
              <UserFooter />
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
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
