import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Calendar, RotateCcw, TrendingUp, Mail, Shield, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCard } from "./AuthCard";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { KickerBadge, HeadlineHighlight } from "./ui";
import { useI18n } from "@/i18n";

export type ProfileKey = "concurso" | "certificacao" | "faculdade";

const STORAGE_KEY = "studai_perfil";

export function getProfileData(t: (key: any) => string) {
  return {
    concurso: {
      label: t("hero.profileConcurso"),
      benefits: [
        t("hero.concurso.benefit1"),
        t("hero.concurso.benefit2"),
        t("hero.concurso.benefit3"),
      ],
      microcopy: t("hero.concurso.microcopy"),
      contextLine: t("hero.concurso.contextLine"),
    },
    certificacao: {
      label: t("hero.profileCertificacao"),
      benefits: [
        t("hero.certificacao.benefit1"),
        t("hero.certificacao.benefit2"),
        t("hero.certificacao.benefit3"),
      ],
      microcopy: t("hero.certificacao.microcopy"),
      contextLine: t("hero.certificacao.contextLine"),
    },
    faculdade: {
      label: t("hero.profileFaculdade"),
      benefits: [
        t("hero.faculdade.benefit1"),
        t("hero.faculdade.benefit2"),
        t("hero.faculdade.benefit3"),
      ],
      microcopy: t("hero.faculdade.microcopy"),
      contextLine: t("hero.faculdade.contextLine"),
    },
  };
}

// Keep static profiles for backward compatibility (used by components that don't have i18n yet)
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

// Mini Product Preview
function MiniProductPreview() {
  const { t } = useI18n();

  const todayTasks = [
    { label: t("preview.task1"), done: true },
    { label: t("preview.task2"), done: true },
    { label: t("preview.task3"), done: false },
  ];

  const reviewQueue = [
    { subject: t("preview.review1"), dueIn: t("preview.reviewDueToday") },
    { subject: t("preview.review2"), dueIn: t("preview.reviewDueTomorrow") },
    { subject: t("preview.review3"), dueIn: t("preview.reviewDue3Days") },
  ];

  return (
    <div className="relative w-full min-w-0">
      <p className="text-xs text-muted-foreground text-center mb-2 font-medium">
        {t("common.illustrativeExample")}
      </p>
      
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory overscroll-x-contain scrollbar-hide -mx-4 px-4 pb-4 pr-8 [scroll-padding-left:1rem] [scroll-padding-right:1rem] md:mx-0 md:px-0 md:pr-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:pb-0">
        {/* Card 1: Today */}
        <Card className="w-[88vw] max-w-[340px] shrink-0 snap-start bg-card border-2 border-border hover:border-primary/40 transition-all duration-300 shadow-lg md:w-auto md:max-w-none md:shrink md:snap-none">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-foreground">{t("preview.today")}</span>
              <span className="ml-auto text-[9px] sm:text-[10px] font-semibold bg-accent-warm/15 text-accent-warm px-1.5 sm:px-2 py-0.5 rounded-full truncate max-w-[72px]">
                {t("preview.tasks")}
              </span>
            </div>
            <ul className="space-y-1.5 sm:space-y-2">
              {todayTasks.map((task, i) => (
                <li key={i} className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
                  <div className={`h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    task.done ? "bg-success border-success" : "border-muted-foreground/30"
                  }`}>
                    {task.done && <CheckCircle2 className="h-2 w-2 text-success-foreground" />}
                  </div>
                  <span className={`truncate ${task.done ? "text-muted-foreground line-through" : "text-foreground font-medium"}`}>
                    {task.label}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 sm:mt-3 font-semibold">{t("preview.completedOf")}</p>
          </CardContent>
        </Card>

        {/* Card 2: Reviews */}
        <Card className="w-[88vw] max-w-[340px] shrink-0 snap-start bg-card border-2 border-border hover:border-accent-warm/40 transition-all duration-300 shadow-lg md:w-auto md:max-w-none md:shrink md:snap-none">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="p-1.5 rounded-lg bg-accent-warm/10">
                <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-accent-warm" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-foreground">{t("preview.reviews")}</span>
            </div>
            <ul className="space-y-1.5 sm:space-y-2">
              {reviewQueue.map((item, i) => (
                <li key={i} className="flex items-center justify-between text-[11px] sm:text-xs">
                  <span className="text-foreground font-medium truncate max-w-[100px] sm:max-w-[120px]">{item.subject}</span>
                  <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold shrink-0 ${
                    item.dueIn === t("preview.reviewDueToday")
                      ? "bg-accent-warm/15 text-accent-warm" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {item.dueIn}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 sm:mt-3 font-semibold">{t("preview.pending")}</p>
          </CardContent>
        </Card>

        {/* Card 3: Week */}
        <Card className="w-[88vw] max-w-[340px] shrink-0 snap-start bg-card border-2 border-border hover:border-success/40 transition-all duration-300 shadow-lg md:w-auto md:max-w-none md:shrink md:snap-none">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="p-1.5 rounded-lg bg-success/10">
                <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-success" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-foreground">{t("preview.week")}</span>
            </div>
            <div className="space-y-2 sm:space-y-2.5">
              <div>
                <div className="flex justify-between text-[11px] sm:text-xs mb-1">
                  <span className="text-muted-foreground">{t("preview.progress")}</span>
                  <span className="text-foreground font-bold">68%</span>
                </div>
                <Progress value={68} className="h-1.5 sm:h-2" />
              </div>
              <div className="flex justify-between text-[11px] sm:text-xs">
                <span className="text-muted-foreground">{t("preview.hours")}</span>
                <span className="text-foreground font-bold">8h 30min</span>
              </div>
              <div className="flex justify-between text-[11px] sm:text-xs">
                <span className="text-muted-foreground">{t("preview.goal")}</span>
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
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [profile, setProfile] = useState<ProfileKey>(() => {
    const urlProfile = searchParams.get("perfil");
    if (isValidProfile(urlProfile)) return urlProfile;
    return getStoredProfile();
  });

  const profileData = getProfileData(t);
  const currentProfile = profileData[profile];

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
    <section className="relative pt-16 pb-10 md:pt-24 md:pb-14 overflow-x-hidden noise-bg">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent-warm/8 pointer-events-none" />
      <div className="hidden md:block absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-accent-warm/15 via-accent/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="hidden md:block absolute bottom-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="min-w-0 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-4">
              <KickerBadge variant="warm" className="max-w-[calc(100vw-2rem)] sm:max-w-none">
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                <span className="min-w-0 whitespace-normal text-center">
                  {t("hero.kicker")}
                </span>
              </KickerBadge>
            </div>

            <h1 className="display-h1 text-foreground">
              {t("hero.headline")}
              <HeadlineHighlight>{t("hero.headlineHighlight")}</HeadlineHighlight>
            </h1>
            
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t("hero.subheadline")}
            </p>

            <div className="mt-6">
              <p className="text-sm text-foreground font-semibold mb-2">{t("hero.studyingFor")}</p>
              <ToggleGroup 
                type="single" 
                value={profile} 
                onValueChange={handleProfileChange}
                className="w-full max-w-[360px] mx-auto lg:mx-0 lg:max-w-none grid grid-cols-3 gap-2"
              >
                {(Object.keys(profileData) as ProfileKey[]).map((key) => (
                  <ToggleGroupItem 
                    key={key} 
                    value={key}
                    variant="outline"
                    className="w-full px-2 sm:px-4 py-2 min-h-[44px] text-xs sm:text-sm whitespace-nowrap font-semibold border-2 rounded-xl data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary data-[state=on]:shadow-lg hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    {key === "certificacao" ? (
                      <>
                        <span className="sm:hidden">{t("hero.profileCertificacaoShort")}</span>
                        <span className="hidden sm:inline">{profileData[key].label}</span>
                      </>
                    ) : (
                      profileData[key].label
                    )}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <ul className="mt-5 space-y-2 w-full max-w-[360px] mx-auto lg:mx-0 lg:max-w-lg text-left">
              {currentProfile.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2.5 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span className="font-medium">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 mt-6 w-full max-w-[360px] mx-auto lg:mx-0 lg:max-w-none lg:flex-row">
              <Button 
                size="lg" 
                onClick={() => scrollToId("auth-card")}
                className="w-full lg:w-auto text-base font-semibold min-h-[48px] bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-xl shadow-primary/30 hover:shadow-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {t("hero.ctaPrimary")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => scrollToId("como-funciona")}
                className="w-full lg:w-auto text-base font-semibold min-h-[48px] border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {t("hero.ctaSecondary")}
              </Button>
            </div>

            <p className="mt-3 text-sm text-muted-foreground text-center lg:text-left font-medium w-full max-w-[360px] mx-auto lg:mx-0 lg:max-w-lg">
              {currentProfile.microcopy}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-2 mt-5 text-sm text-muted-foreground w-full max-w-[360px] mx-auto lg:mx-0 lg:max-w-none">
              <a 
                href="mailto:support@studai.app" 
                className="flex items-center gap-1.5 min-h-[44px] hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded font-medium px-1"
              >
                <Mail className="h-4 w-4 text-primary/70 shrink-0" />
                <span className="text-xs sm:text-sm">support@studai.app</span>
              </a>
              <Link 
                to="/seguranca" 
                className="flex items-center gap-1.5 min-h-[44px] hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded font-medium px-1"
              >
                <Shield className="h-4 w-4 text-primary/70 shrink-0" />
                <span className="text-xs sm:text-sm">{t("common.security")}</span>
              </Link>
              <Link 
                to="/privacidade" 
                className="flex items-center gap-1.5 min-h-[44px] hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded font-medium px-1"
              >
                <FileText className="h-4 w-4 text-primary/70 shrink-0" />
                <span className="text-xs sm:text-sm">{t("common.privacy")}</span>
              </Link>
            </div>

            <div className="mt-8 lg:hidden max-w-full">
              <MiniProductPreview />
            </div>
          </div>

          <div className="min-w-0 flex flex-col gap-6">
            <div id="auth-card" tabIndex={-1} className="outline-none flex justify-center lg:justify-end">
              <AuthCard />
            </div>
            <div className="hidden lg:block">
              <MiniProductPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
