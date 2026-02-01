import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Calendar, RotateCcw, TrendingUp, Mail, Shield, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCard } from "./AuthCard";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { KickerBadge, HeadlineHighlight } from "./ui";

export type ProfileKey = "concurso" | "certificacao" | "faculdade";

const STORAGE_KEY = "studai_perfil";

export const profiles: Record<ProfileKey, {
  label: string;
  benefits: string[];
  microcopy: string;
  contextLine: string;
}> = {
  concurso: {
    label: "Concurso",
    benefits: [
      "Rotina diária pronta para executar",
      "Revisão automática no tempo certo",
      "Progresso semanal visível",
    ],
    microcopy: "Funciona para concursos federais, estaduais e municipais",
    contextLine: "Foco em constância e revisão.",
  },
  certificacao: {
    label: "Certificação",
    benefits: [
      "Trilha por tópicos e prioridades",
      "Revisões para fixação",
      "Cobertura do conteúdo por semana",
    ],
    microcopy: "CFA, CPA-10/20, CEA, CFP e outras certificações",
    contextLine: "Cobertura e prática por tópico.",
  },
  faculdade: {
    label: "Faculdade",
    benefits: [
      "Organização por disciplina",
      "Revisões semanais sem esquecer",
      "Visão clara do que fazer hoje",
    ],
    microcopy: "Para graduação, pós ou cursos livres",
    contextLine: "Disciplina, revisões e entregas em dia.",
  },
};

export function isValidProfile(value: string | null): value is ProfileKey {
  return value === "concurso" || value === "certificacao" || value === "faculdade";
}

export function getStoredProfile(): ProfileKey {
  if (typeof window === "undefined") return "concurso";
  const stored = localStorage.getItem(STORAGE_KEY);
  return isValidProfile(stored) ? stored : "concurso";
}

export function setStoredProfile(profile: ProfileKey): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, profile);
  }
}

// Mini Product Preview - Bento grid with visual depth
function MiniProductPreview() {
  const todayTasks = [
    { label: "Leitura: Direito Constitucional", done: true },
    { label: "Quiz: Princípios Fundamentais", done: true },
    { label: "Revisão: Art. 5º CF", done: false },
  ];

  const reviewQueue = [
    { subject: "Direito Administrativo", dueIn: "Hoje" },
    { subject: "Português", dueIn: "Amanhã" },
    { subject: "Raciocínio Lógico", dueIn: "3 dias" },
  ];

  return (
    <div className="relative">
      {/* Subtle label */}
      <p className="text-xs text-muted-foreground text-center mb-3 font-medium">
        Exemplo ilustrativo
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Card 1: Hoje - Main card */}
        <Card className="bg-card border-2 border-border hover:border-primary/40 transition-all duration-300 hover:shadow-xl shadow-lg transform hover:-translate-y-1 sm:col-span-1">
          <CardContent className="p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 shadow-sm">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-bold text-foreground">Hoje</span>
              <span className="ml-auto text-[10px] font-semibold bg-accent-warm/15 text-accent-warm px-2 py-0.5 rounded-full">
                3 tarefas
              </span>
            </div>
            <ul className="space-y-2.5">
              {todayTasks.map((task, i) => (
                <li key={i} className="flex items-center gap-2.5 text-xs">
                  <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    task.done 
                      ? "bg-success border-success" 
                      : "border-muted-foreground/30 hover:border-primary/50"
                  }`}>
                    {task.done && <CheckCircle2 className="h-2.5 w-2.5 text-success-foreground" />}
                  </div>
                  <span className={`${task.done ? "text-muted-foreground line-through" : "text-foreground font-medium"}`}>
                    {task.label}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-4 font-semibold">2 de 3 concluídas</p>
          </CardContent>
        </Card>

        {/* Card 2: Revisões - With tilt */}
        <Card className="bg-card border-2 border-border hover:border-accent-warm/40 transition-all duration-300 hover:shadow-xl shadow-lg transform hover:-translate-y-1 sm:-rotate-1 sm:translate-y-1">
          <CardContent className="p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-accent-warm/15 to-accent-warm/5 shadow-sm">
                <RotateCcw className="h-4 w-4 text-accent-warm" />
              </div>
              <span className="text-sm font-bold text-foreground">Revisões</span>
            </div>
            <ul className="space-y-2.5">
              {reviewQueue.map((item, i) => (
                <li key={i} className="flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium truncate max-w-[110px]">{item.subject}</span>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                    item.dueIn === "Hoje" 
                      ? "bg-accent-warm/15 text-accent-warm" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {item.dueIn}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-4 font-semibold">3 pendentes</p>
          </CardContent>
        </Card>

        {/* Card 3: Semana - With opposite tilt */}
        <Card className="bg-card border-2 border-border hover:border-success/40 transition-all duration-300 hover:shadow-xl shadow-lg transform hover:-translate-y-1 sm:rotate-1 sm:translate-y-2">
          <CardContent className="p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-success/15 to-success/5 shadow-sm">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <span className="text-sm font-bold text-foreground">Semana</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground font-medium">Progresso</span>
                  <span className="text-foreground font-bold">68%</span>
                </div>
                <Progress value={68} className="h-2.5" />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Horas</span>
                <span className="text-foreground font-bold">8h 30min</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Meta</span>
                <span className="text-foreground font-bold">12h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function LandingHero() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [profile, setProfile] = useState<ProfileKey>(() => {
    const urlProfile = searchParams.get("perfil");
    if (isValidProfile(urlProfile)) return urlProfile;
    return getStoredProfile();
  });

  const currentProfile = profiles[profile];

  const handleProfileChange = (value: string) => {
    if (!isValidProfile(value)) return;
    
    setProfile(value);
    setStoredProfile(value);
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set("perfil", value);
    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    const urlProfile = searchParams.get("perfil");
    if (isValidProfile(urlProfile) && urlProfile !== profile) {
      setProfile(urlProfile);
      setStoredProfile(urlProfile);
    }
  }, [searchParams]);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });

    window.requestAnimationFrame(() => {
      setTimeout(() => {
        const emailInput = el.querySelector('input[type="email"]') as HTMLInputElement;
        emailInput?.focus();
      }, 150);
    });
  };

  return (
    <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 overflow-hidden noise-bg">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent-warm/8 pointer-events-none" />
      
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-accent-warm/20 via-accent/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Kicker Badge */}
            <KickerBadge variant="warm" className="mb-5">
              <Sparkles className="h-3.5 w-3.5" />
              Para concursos, certificações e faculdade
            </KickerBadge>

            {/* Headline with display font and highlight */}
            <h1 className="display-h1 text-foreground">
              Seu plano de estudo{" "}
              <HeadlineHighlight>pronto todo dia</HeadlineHighlight>
            </h1>
            
            {/* Subheadline - punchy and short */}
            <p className="mt-5 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Defina a meta e a data. O sistema monta o cronograma e mostra onde você está.
            </p>

            {/* Profile Selector - Premium feel */}
            <div className="mt-8">
              <p className="text-sm text-foreground font-semibold mb-3">Estou estudando para:</p>
              <ToggleGroup 
                type="single" 
                value={profile} 
                onValueChange={handleProfileChange}
                className="justify-center lg:justify-start gap-2"
              >
                {(Object.keys(profiles) as ProfileKey[]).map((key) => (
                  <ToggleGroupItem 
                    key={key} 
                    value={key}
                    variant="outline"
                    className="px-5 py-2.5 text-sm font-semibold border-2 rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary data-[state=on]:shadow-lg hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    {profiles[key].label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Dynamic Benefits */}
            <ul className="mt-6 space-y-2.5 max-w-lg mx-auto lg:mx-0">
              {currentProfile.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  <span className="font-medium">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTAs with gradient glow */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mt-8">
              <Button 
                size="lg" 
                onClick={() => scrollToId("auth-card")}
                className="text-base font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Criar meu plano grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => scrollToId("como-funciona")}
                className="text-base font-semibold border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Ver como funciona
              </Button>
            </div>

            {/* Microcopy below CTA */}
            <p className="mt-4 text-sm text-muted-foreground text-center lg:text-left font-medium">
              {currentProfile.microcopy}
            </p>

            {/* Trust Bar */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 mt-6 text-sm text-muted-foreground">
              <a 
                href="mailto:support@studai.app" 
                className="flex items-center gap-1.5 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded font-medium"
              >
                <Mail className="h-4 w-4 text-primary/70" />
                support@studai.app
              </a>
              <Link 
                to="/seguranca" 
                className="flex items-center gap-1.5 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded font-medium"
              >
                <Shield className="h-4 w-4 text-primary/70" />
                Segurança
              </Link>
              <Link 
                to="/privacidade" 
                className="flex items-center gap-1.5 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded font-medium"
              >
                <FileText className="h-4 w-4 text-primary/70" />
                Privacidade
              </Link>
            </div>

            {/* Product Preview - Mobile */}
            <div className="mt-10 lg:hidden">
              <MiniProductPreview />
            </div>
          </div>

          {/* Right Column - Auth Card + Preview Desktop */}
          <div className="flex flex-col gap-8">
            <div id="auth-card" tabIndex={-1} className="outline-none flex justify-center lg:justify-end">
              <AuthCard />
            </div>
            
            {/* Product Preview - Desktop */}
            <div className="hidden lg:block">
              <MiniProductPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
