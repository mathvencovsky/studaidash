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

// Mini Product Preview - simula interface real do app
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Card 1: Hoje */}
      <Card className="bg-card shadow-lg border-border/60 hover:border-primary/30 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">Hoje</span>
          </div>
          <ul className="space-y-2">
            {todayTasks.map((task, i) => (
              <li key={i} className="flex items-center gap-2 text-xs">
                <div className={`h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center ${
                  task.done 
                    ? "bg-success border-success" 
                    : "border-muted-foreground/40"
                }`}>
                  {task.done && <CheckCircle2 className="h-2.5 w-2.5 text-success-foreground" />}
                </div>
                <span className={task.done ? "text-muted-foreground line-through" : "text-foreground"}>
                  {task.label}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground mt-3 font-medium">2 de 3 concluídas</p>
        </CardContent>
      </Card>

      {/* Card 2: Próxima revisão */}
      <Card className="bg-card shadow-lg border-border/60 hover:border-primary/30 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5 sm:-rotate-1">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-accent-warm/10">
              <RotateCcw className="h-4 w-4 text-accent-warm" />
            </div>
            <span className="text-sm font-semibold text-foreground">Revisões</span>
          </div>
          <ul className="space-y-2">
            {reviewQueue.map((item, i) => (
              <li key={i} className="flex items-center justify-between text-xs">
                <span className="text-foreground truncate max-w-[100px]">{item.subject}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  item.dueIn === "Hoje" 
                    ? "bg-accent-warm/15 text-accent-warm" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {item.dueIn}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground mt-3 font-medium">3 revisões pendentes</p>
        </CardContent>
      </Card>

      {/* Card 3: Semana */}
      <Card className="bg-card shadow-lg border-border/60 hover:border-primary/30 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5 sm:rotate-1">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-success/10">
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <span className="text-sm font-semibold text-foreground">Semana</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progresso</span>
                <span className="text-foreground font-semibold">68%</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Horas estudadas</span>
              <span className="text-foreground font-semibold">8h 30min</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Meta semanal</span>
              <span className="text-foreground font-semibold">12h</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function LandingHero() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize profile from URL, then localStorage, then default
  const [profile, setProfile] = useState<ProfileKey>(() => {
    const urlProfile = searchParams.get("perfil");
    if (isValidProfile(urlProfile)) return urlProfile;
    return getStoredProfile();
  });

  const currentProfile = profiles[profile];

  // Sync profile changes to URL and localStorage
  const handleProfileChange = (value: string) => {
    if (!isValidProfile(value)) return;
    
    setProfile(value);
    setStoredProfile(value);
    
    // Update URL without navigation
    const newParams = new URLSearchParams(searchParams);
    newParams.set("perfil", value);
    setSearchParams(newParams, { replace: true });
  };

  // Sync URL to state on mount (for shared links)
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
    <section className="relative pt-20 pb-12 md:pt-24 md:pb-16 overflow-hidden">
      {/* Background with warm accent corner */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent-warm/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-accent-warm/15 via-accent/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Kicker Badge */}
            <KickerBadge variant="warm" className="mb-4">
              <Sparkles className="h-3 w-3" />
              Para concursos, certificações e faculdade
            </KickerBadge>

            {/* Headline with highlight */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Seu plano de estudo diário com{" "}
              <HeadlineHighlight>revisões automáticas</HeadlineHighlight>{" "}
              e progresso visível
            </h1>
            
            {/* Subheadline - shorter and punchier */}
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Defina a meta e a data. O sistema monta o cronograma e mostra onde você está.
            </p>

            {/* Profile Selector - Premium feel */}
            <div className="mt-8">
              <p className="text-sm text-foreground font-medium mb-3">Estou estudando para:</p>
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
                    className="px-5 py-2.5 text-sm font-medium border-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary hover:border-primary/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    {profiles[key].label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Dynamic Benefits */}
            <ul className="mt-6 space-y-2.5 max-w-lg mx-auto lg:mx-0">
              {currentProfile.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2.5 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTAs with warm accent glow */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mt-8">
              <Button 
                size="lg" 
                onClick={() => scrollToId("auth-card")}
                className="text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Criar meu plano grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => scrollToId("como-funciona")}
                className="text-base border-2 hover:border-primary/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Ver como funciona
              </Button>
            </div>

            {/* Microcopy below CTA */}
            <p className="mt-4 text-sm text-muted-foreground text-center lg:text-left">
              {currentProfile.microcopy}
            </p>

            {/* Trust Bar */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 mt-6 text-sm text-muted-foreground">
              <a 
                href="mailto:support@studai.app" 
                className="flex items-center gap-1.5 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                <Mail className="h-4 w-4 text-primary/70" />
                support@studai.app
              </a>
              <Link 
                to="/seguranca" 
                className="flex items-center gap-1.5 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                <Shield className="h-4 w-4 text-primary/70" />
                Segurança
              </Link>
              <Link 
                to="/privacidade" 
                className="flex items-center gap-1.5 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
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
          <div className="flex flex-col gap-6">
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
