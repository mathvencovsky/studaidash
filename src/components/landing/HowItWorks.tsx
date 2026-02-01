import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { UserPlus, Settings2, TrendingUp, Rocket } from "lucide-react";
import { type ProfileKey, isValidProfile, getStoredProfile } from "./LandingHero";
import { SectionWrapper, KickerBadge, HeadlineHighlight } from "./ui";

type StepData = {
  icon: typeof UserPlus;
  number: string;
  title: string;
  description: string;
  example: string;
  promise: string;
};

const baseSteps: Omit<StepData, "example" | "promise">[] = [
  {
    icon: UserPlus,
    number: "01",
    title: "Crie sua conta",
    description: "Cadastre-se com e-mail e senha. Você recebe um e-mail de confirmação.",
  },
  {
    icon: Settings2,
    number: "02",
    title: "Informe objetivo e tempo",
    description: "Escolha o que está estudando, a data de conclusão e quanto tempo tem por dia.",
  },
  {
    icon: TrendingUp,
    number: "03",
    title: "Execute e acompanhe",
    description: "Siga as tarefas do dia, marque como feito e acompanhe sua evolução.",
  },
];

const profileExamples: Record<ProfileKey, { examples: string[]; promises: string[] }> = {
  concurso: {
    examples: [
      "Conta criada em 2 minutos",
      "45 min hoje, 10 min revisão",
      "68% da semana concluído",
    ],
    promises: [
      "Pronto para configurar",
      "Cronograma adaptado à rotina",
      "Clareza do que fazer hoje",
    ],
  },
  certificacao: {
    examples: [
      "Conta criada em 2 minutos",
      "60 min por tópico, quiz de fixação",
      "4 tópicos cobertos",
    ],
    promises: [
      "Pronto para configurar",
      "Trilha organizada por módulo",
      "Clareza do que fazer hoje",
    ],
  },
  faculdade: {
    examples: [
      "Conta criada em 2 minutos",
      "30 min Cálculo, 20 min Física",
      "3 disciplinas em dia",
    ],
    promises: [
      "Pronto para configurar",
      "Organização por disciplina",
      "Clareza do que fazer hoje",
    ],
  },
};

export function HowItWorks() {
  const [searchParams] = useSearchParams();

  const currentProfile = useMemo((): ProfileKey => {
    const urlProfile = searchParams.get("perfil");
    if (isValidProfile(urlProfile)) return urlProfile;
    return getStoredProfile();
  }, [searchParams]);

  const steps = useMemo((): StepData[] => {
    const profileData = profileExamples[currentProfile];
    return baseSteps.map((step, index) => ({
      ...step,
      example: profileData.examples[index],
      promise: profileData.promises[index],
    }));
  }, [currentProfile]);

  return (
    <SectionWrapper id="como-funciona" variant="tint" tabIndex={-1} withNoise>
      <div className="text-center mb-8">
        <KickerBadge variant="warm" className="mb-3">
          <Rocket className="h-3.5 w-3.5" />
          Comece em minutos
        </KickerBadge>
        <h2 className="display-h2 text-foreground">
          Como <HeadlineHighlight>funciona</HeadlineHighlight>
        </h2>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto text-sm">
          Três passos para sair da desorganização e entrar em uma rotina que funciona.
        </p>
      </div>

      {/* Mobile: vertical stack, Desktop: 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {steps.map((step, index) => (
          <div key={step.number} className="relative">
            {/* Connector line - desktop only */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/40 to-transparent" />
            )}
            
            <div className="text-center">
              <div className="relative inline-flex">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center mx-auto border-2 border-primary/20 shadow-lg">
                  <step.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                </div>
                <span className="absolute -top-1.5 -right-1.5 w-8 h-8 rounded-full bg-gradient-to-br from-accent-warm to-accent-warm/80 text-accent-warm-foreground text-xs font-bold flex items-center justify-center shadow-lg">
                  {step.number}
                </span>
              </div>
              <h3 className="mt-4 text-base sm:text-lg font-bold text-foreground">{step.title}</h3>
              <p className="mt-1.5 text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
                {step.description}
              </p>
              <p className="mt-2 text-xs bg-card text-muted-foreground px-3 py-1.5 rounded-full inline-block border-2 font-medium">
                {step.example}
              </p>
              <p className="mt-1.5 text-xs text-success font-bold">
                {step.promise}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
