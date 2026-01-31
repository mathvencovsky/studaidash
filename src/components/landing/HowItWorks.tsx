import { UserPlus, Settings2, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Crie sua conta",
    description: "Cadastro gratuito em menos de um minuto. Sem cartão de crédito.",
    promise: "Você começa a usar hoje.",
  },
  {
    icon: Settings2,
    number: "02",
    title: "Defina sua meta e disponibilidade",
    description: "Escolha seu objetivo, a data da prova e quanto tempo tem por dia.",
    promise: "O sistema calcula seu plano.",
  },
  {
    icon: TrendingUp,
    number: "03",
    title: "Siga a trilha e acompanhe sua evolução",
    description: "Estude conforme o plano diário, faça revisões e veja métricas claras.",
    promise: "Você sempre sabe o próximo passo.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" tabIndex={-1} className="py-20 bg-muted/30 outline-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Como funciona
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Três passos para sair da desorganização e entrar em uma rotina de estudos que funciona.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-border" />
              )}
              
              <div className="text-center">
                <div className="relative inline-flex">
                  <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-muted-foreground text-sm max-w-xs mx-auto">
                  {step.description}
                </p>
                <p className="mt-2 text-xs text-primary font-medium">
                  {step.promise}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
