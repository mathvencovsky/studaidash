import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Map, 
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
  Library,
  Search,
  Plus,
  ChevronDown,
  User,
  HelpCircle,
  LogOut,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppLayoutProps {
  children: React.ReactNode;
}

// YC-style navigation - functional, no fluff
const aprenderItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Início" },
  { to: "/trilha", icon: Map, label: "Trilhas" },
  { to: "/pesquisar", icon: Search, label: "Pesquisar" },
  { to: "/estudar", icon: BookOpen, label: "Estudar" },
  { to: "/quizzes", icon: FileText, label: "Avaliações" },
];

const progressoItems = [
  { to: "/sessoes", icon: Clock, label: "Sessões" },
  { to: "/calendario", icon: Calendar, label: "Calendário" },
  { to: "/metas", icon: Target, label: "Metas" },
  { to: "/revisoes", icon: RefreshCw, label: "Revisões" },
];

const analyticsItems = [
  { to: "/relatorios", icon: BarChart3, label: "Relatórios" },
  { to: "/roi-estudo", icon: TrendingUp, label: "Métricas" },
  { to: "/engajamento", icon: Activity, label: "Atividade" },
];

const ferramentasItems = [
  { to: "/salvos", icon: Bookmark, label: "Salvos" },
  { to: "/configuracoes", icon: Settings, label: "Configurações" },
];

// Mobile bottom nav - core actions only
const mobileNavItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Início" },
  { to: "/estudar", icon: BookOpen, label: "Estudar" },
  { to: "/trilha", icon: Map, label: "Trilhas" },
  { to: "/quizzes", icon: FileText, label: "Avaliações" },
  { to: "/relatorios", icon: BarChart3, label: "Progresso" },
];

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Get user initials and email from auth
  const userEmail = user?.email || "usuario@email.com";
  const userName = user?.user_metadata?.full_name || userEmail.split("@")[0];
  const userInitials = userName.charAt(0).toUpperCase();

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
        <p className="px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
          {label}
        </p>
      )}
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/dashboard"}
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ${collapsed ? "justify-center" : ""}`}
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
    <nav className="flex flex-col gap-4 p-2">
      <NavSection items={aprenderItems} label="Principal" collapsed={collapsed} />
      <NavSection items={progressoItems} label="Progresso" collapsed={collapsed} />
      <NavSection items={analyticsItems} label="Dados" collapsed={collapsed} />
      <NavSection items={ferramentasItems} label="Config" collapsed={collapsed} />
    </nav>
  );

  const UserFooter = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className={`p-3 border-t ${collapsed ? "flex justify-center" : ""}`}>
      <div className={`flex items-center gap-3 ${collapsed ? "" : "px-2"}`}>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col border-r bg-card shrink-0 transition-all duration-200 sticky top-0 h-screen ${
          sidebarCollapsed ? "w-14" : "w-56"
        }`}
      >
        {/* Header */}
        <div className="p-3 border-b">
          <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"}`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
              {!sidebarCollapsed && <span className="font-semibold text-sm">StudAI</span>}
            </div>
            {!sidebarCollapsed && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={() => setSidebarCollapsed(true)}
              >
                <ChevronLeft size={16} />
              </Button>
            )}
          </div>
          {sidebarCollapsed && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 mt-2 w-full"
              onClick={() => setSidebarCollapsed(false)}
            >
              <Menu size={16} />
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
        <header className="md:hidden flex items-center justify-between p-3 border-b bg-card sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">StudAI</span>
          </div>
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-56 p-0 flex flex-col">
              <div className="p-3 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="font-semibold text-sm">StudAI</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                <NavContent />
              </div>
              <UserFooter />
            </SheetContent>
          </Sheet>
        </header>

        {/* Desktop Top Header */}
        <header className="hidden md:flex items-center justify-between gap-4 px-6 py-2.5 border-b bg-card sticky top-0 z-40">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-muted/50 border-0 focus-visible:ring-1 text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => navigate("/estudar")}
              size="sm"
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Nova sessão
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 px-2 hover:bg-muted h-8">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{userName.split(" ")[0]}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover border shadow-md z-50 p-0">
                {/* User Info Header */}
                <div className="flex items-center gap-2 p-3 border-b">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{userName}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">{userEmail}</span>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="p-1">
                  <DropdownMenuItem onClick={() => navigate("/perfil")} className="flex items-center gap-2 px-2 py-1.5 cursor-pointer text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/configuracoes")} className="flex items-center gap-2 px-2 py-1.5 cursor-pointer text-sm">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5 cursor-pointer text-sm">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    <span>Ajuda</span>
                  </DropdownMenuItem>
                </div>
                
                <DropdownMenuSeparator className="my-0" />
                
                <div className="p-1">
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 px-2 py-1.5 cursor-pointer text-sm text-muted-foreground">
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t flex justify-around items-center py-1 px-1 z-40 safe-area-bottom">
          {mobileNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className="flex flex-col items-center gap-0.5 p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors min-w-[48px] min-h-[44px] justify-center touch-manipulation active:scale-95"
              activeClassName="text-primary"
            >
              <item.icon size={20} />
              <span className="text-[10px]">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
