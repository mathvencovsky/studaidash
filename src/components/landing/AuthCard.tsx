import { useMemo, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2, CheckCircle2, Circle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { type ProfileKey, profiles, isValidProfile, getStoredProfile } from "./LandingHero";

const SUPPORT_EMAIL = "support@studai.app";

// Dynamic header copy based on tab and profile
const getHeaderCopy = (tab: "login" | "register", profile: ProfileKey) => {
  const profileData = profiles[profile];
  
  if (tab === "login") {
    return {
      title: "Acesse seu painel",
      description: "Entre para continuar seu plano de estudo.",
      contextLine: profileData.contextLine,
    };
  }
  return {
    title: "Crie sua conta",
    description: "Leva poucos minutos. Confirme pelo e-mail.",
    contextLine: profileData.contextLine,
  };
};

export function AuthCard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Get current profile from URL or localStorage
  const currentProfile = useMemo((): ProfileKey => {
    const urlProfile = searchParams.get("perfil");
    if (isValidProfile(urlProfile)) return urlProfile;
    return getStoredProfile();
  }, [searchParams]);

  // Password validation checks
  const passwordChecks = useMemo(() => {
    const hasMinLength = registerPassword.length >= 6;
    const passwordsMatch = registerPassword.length > 0 && confirmPassword.length > 0 && registerPassword === confirmPassword;
    return { hasMinLength, passwordsMatch };
  }, [registerPassword, confirmPassword]);

  // Dynamic header copy based on active tab and profile
  const headerCopy = useMemo(() => {
    return getHeaderCopy(activeTab, currentProfile);
  }, [activeTab, currentProfile]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Preencha e-mail e senha para entrar.");
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setIsLoading(false);

    if (error) {
      const msg = error.message || "";
      if (msg.includes("Invalid login credentials")) {
        toast.error("E-mail ou senha incorretos.");
      } else if (msg.includes("Email not confirmed")) {
        toast.error("Confirme seu e-mail antes de entrar.");
      } else {
        toast.error("Não foi possível entrar. Tente novamente.");
      }
      return;
    }

    toast.success("Bem-vindo de volta.");
    navigate("/dashboard");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerEmail || !registerPassword || !confirmPassword) {
      toast.error("Preencha todos os campos para criar sua conta.");
      return;
    }

    if (registerPassword.length < 6) {
      toast.error("Use uma senha com pelo menos 6 caracteres.");
      return;
    }

    if (registerPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(registerEmail, registerPassword);
    setIsLoading(false);

    if (error) {
      const msg = error.message || "";
      if (msg.includes("already registered")) {
        toast.error("Este e-mail já está cadastrado. Tente entrar.");
        setActiveTab("login");
      } else {
        toast.error("Não foi possível criar sua conta. Tente novamente.");
      }
      return;
    }

    toast.success("Conta criada. Verifique seu e-mail para confirmar.");
    setActiveTab("login");
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-2 border-border/80">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
        <CardHeader className="pb-3 px-4 sm:px-6">
          <CardTitle className="text-lg font-bold">{headerCopy.title}</CardTitle>
          <CardDescription className="text-xs sm:text-sm font-medium">{headerCopy.description}</CardDescription>
          
          {/* Context line based on profile */}
          <p className="text-xs text-primary font-bold pt-1.5">
            {headerCopy.contextLine}
          </p>
          
          <TabsList className="grid w-full grid-cols-2 mt-3">
            <TabsTrigger value="login" className="font-semibold text-sm min-h-[40px]">Entrar</TabsTrigger>
            <TabsTrigger value="register" className="font-semibold text-sm min-h-[40px]">Criar conta</TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <CardContent className="px-4 sm:px-6 pb-5">
          {/* Login Tab */}
          <TabsContent value="login" className="mt-0">
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="font-semibold text-sm">E-mail</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="nome@exemplo.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                  required
                  className="border-2 min-h-[44px] text-base"
                />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password" className="font-semibold text-sm">Senha</Label>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}?subject=Ajuda%20para%20acessar%20minha%20conta`}
                    className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors font-medium min-h-[28px]"
                  >
                    <HelpCircle className="h-3 w-3" />
                    Precisa de ajuda?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
                    className="pr-12 border-2 min-h-[44px] text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded p-2 min-w-[40px] min-h-[40px] flex items-center justify-center"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full font-semibold min-h-[48px] text-base bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>

              <p className="text-[10px] text-muted-foreground text-center pt-1 font-medium">
                Não consegue acessar?{" "}
                <a 
                  href={`mailto:${SUPPORT_EMAIL}?subject=Problema%20de%20acesso`} 
                  className="text-primary font-bold hover:underline"
                >
                  {SUPPORT_EMAIL}
                </a>
              </p>
            </form>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register" className="mt-0">
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="register-email" className="font-semibold text-sm">E-mail</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="nome@exemplo.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                  required
                  className="border-2 min-h-[44px] text-base"
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="register-password" className="font-semibold text-sm">Senha</Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="new-password"
                    className="pr-12 border-2 min-h-[44px] text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded p-2 min-w-[40px] min-h-[40px] flex items-center justify-center"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="font-semibold text-sm">Confirmar senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="new-password"
                  required
                  className="border-2 min-h-[44px] text-base"
                />
              </div>

              {/* Password validation checklist */}
              <div className="space-y-1.5 text-xs">
                <div className={`flex items-center gap-2 ${passwordChecks.hasMinLength ? "text-success" : "text-muted-foreground"}`}>
                  {passwordChecks.hasMinLength ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <Circle className="h-3.5 w-3.5" />
                  )}
                  <span className="font-medium">Mínimo de 6 caracteres</span>
                </div>
                <div className={`flex items-center gap-2 ${passwordChecks.passwordsMatch ? "text-success" : "text-muted-foreground"}`}>
                  {passwordChecks.passwordsMatch ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <Circle className="h-3.5 w-3.5" />
                  )}
                  <span className="font-medium">Senhas iguais</span>
                </div>
              </div>

              <Button type="submit" className="w-full font-semibold min-h-[48px] text-base bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta
                  </>
                ) : (
                  "Criar conta"
                )}
              </Button>

              <p className="text-[10px] text-muted-foreground text-center pt-1 font-medium leading-relaxed">
                Ao criar sua conta, você concorda com os{" "}
                <Link to="/termos" className="text-primary font-bold hover:underline">Termos</Link>
                {" "}e{" "}
                <Link to="/privacidade" className="text-primary font-bold hover:underline">Privacidade</Link>.
              </p>
            </form>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
