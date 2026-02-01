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
    description: "Cadastre-se com e-mail e senha. Você recebe um e-mail de confirmação para ativar o acesso.",
  },
  {
    icon: Settings2,
    number: "02",
    title: "Informe seu objetivo e tempo diário",
    description: "Escolha o que está estudando, a data de conclusão e quantos minutos tem por dia. O sistema gera seu plano.",
  },
  {
    icon: TrendingUp,
    number: "03",
    title: "Execute o plano e veja seu progresso",
    description: "Siga as tarefas do dia, marque como feito e acompanhe sua evolução semanal.",
  },
];

const profileExamples: Record<ProfileKey, { examples: string[]; promises: string[] }> = {
  concurso: {
    examples: [
      "Exemplo: conta criada, acesso em 2 minutos.",
      "Exemplo: 45 min hoje, 10 min revisão, 15 questões.",
      "Exemplo: 68% da semana concluído, 3 revisões pendentes.",
    ],
    promises: [
      "Pronto para configurar seu plano.",
      "O cronograma se adapta à sua meta e rotina.",
      "O app mostra o que fazer hoje e o que revisar depois.",
    ],
  },
  certificacao: {
    examples: [
      "Exemplo: conta criada, acesso em 2 minutos.",
      "Exemplo: 60 min por tópico, quiz de fixação.",
      "Exemplo: 4 tópicos cobertos, 2 em revisão.",
    ],
    promises: [
      "Pronto para configurar seu plano.",
      "Trilha organizada por módulo e prioridade.",
      "O app mostra o que fazer hoje e o que revisar depois.",
    ],
  },
  faculdade: {
    examples: [
      "Exemplo: conta criada, acesso em 2 minutos.",
      "Exemplo: 30 min Cálculo, 20 min Física, revisão semanal.",
      "Exemplo: 3 disciplinas em dia, 1 revisão para amanhã.",
    ],
    promises: [
      "Pronto para configurar seu plano.",
      "Organização por disciplina e período.",
      "O app mostra o que fazer hoje e o que revisar depois.",
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
    <SectionWrapper id="como-funciona" variant="tint" tabIndex={-1}>
      <div className="text-center mb-10">
        <KickerBadge variant="warm" className="mb-3">
          <Rocket className="h-3 w-3" />
          Comece em minutos
        </KickerBadge>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Como <HeadlineHighlight>funciona</HeadlineHighlight>
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Três passos para sair da desorganização e entrar em uma rotina de estudos que funciona.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={step.number} className="relative">
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-14 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
            )}
            
            <div className="text-center">
              <div className="relative inline-flex">
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center mx-auto border-2 border-primary/20 shadow-lg">
                  <step.icon className="h-12 w-12 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-accent-warm text-accent-warm-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                  {step.number}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 text-muted-foreground text-sm max-w-xs mx-auto">
                {step.description}
              </p>
              <p className="mt-3 text-xs bg-muted/60 text-muted-foreground px-3 py-1.5 rounded-full inline-block">
                {step.example}
              </p>
              <p className="mt-2 text-xs text-success font-semibold">
                {step.promise}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
