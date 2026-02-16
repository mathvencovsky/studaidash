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
import { type ProfileKey, isValidProfile, getStoredProfile, getProfileData } from "./LandingHero";
import { useI18n } from "@/i18n";
import { lovable } from "@/integrations/lovable/index";
import { Separator } from "@/components/ui/separator";

const SUPPORT_EMAIL = "support@studai.app";

export function AuthCard() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const currentProfile = useMemo((): ProfileKey => {
    const urlProfile = searchParams.get("perfil");
    if (isValidProfile(urlProfile)) return urlProfile;
    return getStoredProfile();
  }, [searchParams]);

  const profileData = getProfileData(t);

  const passwordChecks = useMemo(() => {
    const hasMinLength = registerPassword.length >= 6;
    const passwordsMatch = registerPassword.length > 0 && confirmPassword.length > 0 && registerPassword === confirmPassword;
    return { hasMinLength, passwordsMatch };
  }, [registerPassword, confirmPassword]);

  const headerCopy = useMemo(() => {
    const pd = profileData[currentProfile];
    if (activeTab === "login") {
      return { title: t("auth.loginTitle"), description: t("auth.loginDesc"), contextLine: pd.contextLine };
    }
    return { title: t("auth.registerTitle"), description: t("auth.registerDesc"), contextLine: pd.contextLine };
  }, [activeTab, currentProfile, t]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) { toast.error(t("auth.toast.fillFields")); return; }
    setIsLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setIsLoading(false);
    if (error) {
      const msg = error.message || "";
      if (msg.includes("Invalid login credentials")) { toast.error(t("auth.toast.wrongCredentials")); }
      else if (msg.includes("Email not confirmed")) { toast.error(t("auth.toast.confirmEmail")); }
      else { toast.error(t("auth.toast.loginError")); }
      return;
    }
    toast.success(t("auth.toast.welcomeBack"));
    navigate("/dashboard");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerEmail || !registerPassword || !confirmPassword) { toast.error(t("auth.toast.fillAllFields")); return; }
    if (registerPassword.length < 6) { toast.error(t("auth.toast.minPassword")); return; }
    if (registerPassword !== confirmPassword) { toast.error(t("auth.toast.passwordsDontMatch")); return; }
    setIsLoading(true);
    const { error } = await signUp(registerEmail, registerPassword);
    setIsLoading(false);
    if (error) {
      const msg = error.message || "";
      if (msg.includes("already registered")) { toast.error(t("auth.toast.alreadyRegistered")); setActiveTab("login"); }
      else { toast.error(t("auth.toast.registerError")); }
      return;
    }
    toast.success(t("auth.toast.accountCreated"));
    setActiveTab("login");
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    setIsGoogleLoading(false);
    if (error) {
      toast.error(t("auth.toast.loginError"));
    }
  };

  const GoogleButton = () => (
    <>
      <div className="flex items-center gap-3 my-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground font-medium">ou</span>
        <Separator className="flex-1" />
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full min-h-[48px] font-semibold text-base border-2 gap-2"
        onClick={handleGoogleSignIn}
        disabled={isLoading || isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        )}
        Continuar com Google
      </Button>
    </>
  );

  return (
    <Card className="w-full max-w-md shadow-xl border-2 border-border/80">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
        <CardHeader className="pb-3 px-4 sm:px-6">
          <CardTitle className="text-lg font-bold">{headerCopy.title}</CardTitle>
          <CardDescription className="text-xs sm:text-sm font-medium">{headerCopy.description}</CardDescription>
          <p className="text-xs text-primary font-bold pt-1.5">{headerCopy.contextLine}</p>
          <TabsList className="grid w-full grid-cols-2 mt-3">
            <TabsTrigger value="login" className="font-semibold text-sm min-h-[40px]">{t("auth.tabLogin")}</TabsTrigger>
            <TabsTrigger value="register" className="font-semibold text-sm min-h-[40px]">{t("auth.tabRegister")}</TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <CardContent className="px-4 sm:px-6 pb-5">
          <TabsContent value="login" className="mt-0">
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="font-semibold text-sm">{t("auth.email")}</Label>
                <Input id="login-email" type="email" placeholder={t("auth.emailPlaceholder")} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} disabled={isLoading} autoComplete="email" required className="border-2 min-h-[44px] text-base" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password" className="font-semibold text-sm">{t("auth.password")}</Label>
                  <a href={`mailto:${SUPPORT_EMAIL}?subject=Ajuda%20para%20acessar%20minha%20conta`} className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors font-medium min-h-[28px]">
                    <HelpCircle className="h-3 w-3" />
                    {t("auth.needHelp")}
                  </a>
                </div>
                <div className="relative">
                  <Input id="login-password" type={showPassword ? "text" : "password"} placeholder={t("auth.passwordPlaceholder")} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} disabled={isLoading} autoComplete="current-password" className="pr-12 border-2 min-h-[44px] text-base" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded p-2 min-w-[40px] min-h-[40px] flex items-center justify-center" aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")} disabled={isLoading}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full font-semibold min-h-[48px] text-base bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg" disabled={isLoading}>
                {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t("auth.loggingIn")}</>) : t("auth.loginButton")}
              </Button>
              <p className="text-[10px] text-muted-foreground text-center pt-1 font-medium">
                {t("auth.cantAccess")}{" "}
                <a href={`mailto:${SUPPORT_EMAIL}?subject=Problema%20de%20acesso`} className="text-primary font-bold hover:underline">{SUPPORT_EMAIL}</a>
              </p>
              <GoogleButton />
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-0">
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="register-email" className="font-semibold text-sm">{t("auth.email")}</Label>
                <Input id="register-email" type="email" placeholder={t("auth.emailPlaceholder")} value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} disabled={isLoading} autoComplete="email" required className="border-2 min-h-[44px] text-base" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="register-password" className="font-semibold text-sm">{t("auth.password")}</Label>
                <div className="relative">
                  <Input id="register-password" type={showPassword ? "text" : "password"} placeholder={t("auth.minPasswordPlaceholder")} value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} disabled={isLoading} autoComplete="new-password" className="pr-12 border-2 min-h-[44px] text-base" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded p-2 min-w-[40px] min-h-[40px] flex items-center justify-center" aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")} disabled={isLoading}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="font-semibold text-sm">{t("auth.confirmPassword")}</Label>
                <Input id="confirm-password" type="password" placeholder={t("auth.passwordPlaceholder")} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} autoComplete="new-password" required className="border-2 min-h-[44px] text-base" />
              </div>
              <div className="space-y-1.5 text-xs">
                <div className={`flex items-center gap-2 ${passwordChecks.hasMinLength ? "text-success" : "text-muted-foreground"}`}>
                  {passwordChecks.hasMinLength ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                  <span className="font-medium">{t("auth.minChars")}</span>
                </div>
                <div className={`flex items-center gap-2 ${passwordChecks.passwordsMatch ? "text-success" : "text-muted-foreground"}`}>
                  {passwordChecks.passwordsMatch ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                  <span className="font-medium">{t("auth.passwordsMatch")}</span>
                </div>
              </div>
              <Button type="submit" className="w-full font-semibold min-h-[48px] text-base bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg" disabled={isLoading}>
                {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t("auth.registering")}</>) : t("auth.registerButton")}
              </Button>
              <p className="text-[10px] text-muted-foreground text-center pt-1 font-medium leading-relaxed">
                {t("auth.agreeTerms")}{" "}
                <Link to="/termos" className="text-primary font-bold hover:underline">{t("common.terms")}</Link>
                {" "}{t("auth.andPrivacy")}{" "}
                <Link to="/privacidade" className="text-primary font-bold hover:underline">{t("common.privacy")}</Link>.
              </p>
              <GoogleButton />
            </form>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
