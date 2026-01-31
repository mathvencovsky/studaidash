import { UserPlus, Settings2, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Crie sua conta",
    description: "Cadastre-se gratuitamente em menos de um minuto. Sem cartão de crédito.",
  },
  {
    icon: Settings2,
    number: "02",
    title: "Configure seu objetivo",
    description: "Escolha sua certificação ou concurso, defina a data da prova e sua disponibilidade.",
  },
  {
    icon: TrendingUp,
    number: "03",
    title: "Estude e evolua",
    description: "Siga seu plano diário, faça revisões e acompanhe sua evolução com métricas claras.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Como funciona
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Três passos simples para transformar seus estudos
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
