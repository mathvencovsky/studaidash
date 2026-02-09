import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Map, BarChart3, Brain, Target, Calendar, RefreshCw, ArrowRight, Eye
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { type ProfileKey, isValidProfile, getStoredProfile } from "./LandingHero";
import { SectionWrapper, KickerBadge, HeadlineHighlight } from "./ui";
import { useI18n } from "@/i18n";

export function ProductSection() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();

  const currentProfile = useMemo((): ProfileKey => {
    const urlProfile = searchParams.get("perfil");
    if (isValidProfile(urlProfile)) return urlProfile;
    return getStoredProfile();
  }, [searchParams]);

  const features = [
    { icon: Map, title: t("product.feature1.title"), description: t("product.feature1.desc"), why: t("product.feature1.why") },
    { icon: Brain, title: t("product.feature2.title"), description: t("product.feature2.desc"), why: t("product.feature2.why") },
    { icon: RefreshCw, title: t("product.feature3.title"), description: t("product.feature3.desc"), why: t("product.feature3.why") },
    { icon: BarChart3, title: t("product.feature4.title"), description: t("product.feature4.desc"), why: t("product.feature4.why") },
    { icon: Target, title: t("product.feature5.title"), description: t("product.feature5.desc"), why: t("product.feature5.why") },
    { icon: Calendar, title: t("product.feature6.title"), description: t("product.feature6.desc"), why: t("product.feature6.why") },
  ];

  const profilePreviews: Record<ProfileKey, any> = {
    concurso: {
      trailName: t("product.concurso.trailName"),
      trailProgress: 42, trailDaysLeft: 98, trailHoursPerDay: "1.5h",
      tasks: [
        { label: t("product.concurso.task1"), done: true },
        { label: t("product.concurso.task2"), done: false },
        { label: t("product.concurso.task3"), done: false },
      ],
      stats: [
        { label: t("product.concurso.stat1Label"), value: t("product.concurso.stat1Value") },
        { label: t("product.concurso.stat2Label"), value: t("product.concurso.stat2Value") },
        { label: t("product.concurso.stat3Label"), value: t("product.concurso.stat3Value") },
      ],
      subtitle: t("product.concurso.subtitle"),
    },
    certificacao: {
      trailName: t("product.certificacao.trailName"),
      trailProgress: 55, trailDaysLeft: 127, trailHoursPerDay: "2h",
      tasks: [
        { label: t("product.certificacao.task1"), done: true },
        { label: t("product.certificacao.task2"), done: false },
        { label: t("product.certificacao.task3"), done: false },
      ],
      stats: [
        { label: t("product.certificacao.stat1Label"), value: t("product.certificacao.stat1Value") },
        { label: t("product.certificacao.stat2Label"), value: t("product.certificacao.stat2Value") },
        { label: t("product.certificacao.stat3Label"), value: t("product.certificacao.stat3Value") },
      ],
      subtitle: t("product.certificacao.subtitle"),
    },
    faculdade: {
      trailName: t("product.faculdade.trailName"),
      trailProgress: 38, trailDaysLeft: 45, trailHoursPerDay: "1h",
      tasks: [
        { label: t("product.faculdade.task1"), done: true },
        { label: t("product.faculdade.task2"), done: false },
        { label: t("product.faculdade.task3"), done: false },
      ],
      stats: [
        { label: t("product.faculdade.stat1Label"), value: t("product.faculdade.stat1Value") },
        { label: t("product.faculdade.stat2Label"), value: t("product.faculdade.stat2Value") },
        { label: t("product.faculdade.stat3Label"), value: t("product.faculdade.stat3Value") },
      ],
      subtitle: t("product.faculdade.subtitle"),
    },
  };

  const preview = profilePreviews[currentProfile];

  const scrollToAuth = () => {
    const el = document.getElementById("auth-card");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      const emailInput = el.querySelector('input[type="email"]') as HTMLInputElement;
      emailInput?.focus();
    }, 150);
  };

  return (
    <SectionWrapper id="produto" variant="plain" tabIndex={-1}>
      <div className="text-center mb-8">
        <KickerBadge variant="primary" className="mb-3">
          <Eye className="h-3.5 w-3.5" />
          {t("product.kicker")}
        </KickerBadge>
        <h2 className="display-h2 text-foreground">
          {t("product.headline")}<HeadlineHighlight variant="primary">{t("product.headlineHighlight")}</HeadlineHighlight>
        </h2>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto text-sm">
          {t("product.previewFor")} <span className="font-bold text-foreground">{preview.subtitle}</span>.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="order-1 lg:order-1">
          <div className="bg-card rounded-xl border-2 border-border shadow-xl p-4 sm:p-5 relative">
            <div className="absolute -top-2.5 left-4">
              <span className="bg-gradient-to-r from-accent-warm to-accent-warm/80 text-accent-warm-foreground text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                {t("common.illustrativeExample")}
              </span>
            </div>

            <div className="space-y-3 mt-2">
              <div className="flex items-center justify-between pb-3 border-b-2">
                <div>
                  <p className="text-sm font-bold text-foreground">{t("product.dashPreview.hello")}</p>
                  <p className="text-xs text-muted-foreground">{t("product.dashPreview.overview")}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <span className="text-xs font-bold text-primary-foreground">J</span>
                </div>
              </div>

              <Card className="border-2 border-primary/40 bg-gradient-to-br from-primary/5 to-accent/5 shadow-md">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-foreground truncate">{preview.trailName}</span>
                    <span className="text-[10px] font-bold bg-primary/15 text-primary px-2 py-0.5 rounded-full shrink-0">{preview.trailProgress}%</span>
                  </div>
                  <Progress value={preview.trailProgress} className="h-2" />
                  <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">
                    {preview.trailDaysLeft} {t("product.dashPreview.days")} • {preview.trailHoursPerDay}/{t("preview.today").toLowerCase()}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md border-2">
                <CardContent className="p-3">
                  <p className="text-sm font-bold mb-2 text-foreground">{t("product.dashPreview.todayPlan")}</p>
                  <div className="space-y-2">
                    {preview.tasks.map((task: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${task.done ? 'bg-success border-success' : 'border-muted-foreground/40'}`}>
                          {task.done && <span className="text-success-foreground text-[8px]">✓</span>}
                        </div>
                        <span className={`truncate font-medium ${task.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-2">
                {preview.stats.map((stat: any) => (
                  <div key={stat.label} className="text-center p-2 bg-muted/50 rounded-lg border-2 border-border">
                    <p className="text-base font-bold text-foreground">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground font-semibold">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="order-2 lg:order-2 flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((feature) => (
              <div key={feature.title} className="p-4 rounded-xl border-2 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 group">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center mb-2 group-hover:from-primary/20 group-hover:to-accent/15 transition-colors">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                <p className="text-xs text-accent-warm font-bold mt-1.5">{feature.why}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              size="lg" 
              onClick={scrollToAuth} 
              className="w-full sm:w-auto text-base font-semibold min-h-[48px] bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-xl shadow-primary/25 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {t("common.startFree")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
