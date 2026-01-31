import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    quote: "Consegui manter a consistência que nunca tive antes. O plano diário me ajuda a não procrastinar.",
    name: "Marina Costa",
    role: "Concurso Público - TRF",
    initials: "MC",
  },
  {
    quote: "Passei no CFA Level I na primeira tentativa. O sistema de revisões fez toda a diferença.",
    name: "Ricardo Mendes",
    role: "Analista Financeiro",
    initials: "RM",
  },
  {
    quote: "Finalmente consigo ver meu progresso real. Não é sobre estudar muito, é sobre estudar certo.",
    name: "Juliana Alves",
    role: "Residência Médica",
    initials: "JA",
  },
];

export function Testimonials() {
  return (
    <section id="depoimentos" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            O que nossos usuários dizem
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Estudantes reais, resultados reais
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="relative">
              <CardContent className="pt-8 pb-6">
                <Quote className="absolute top-4 left-4 h-8 w-8 text-primary/20" />
                <p className="text-muted-foreground mb-6 relative z-10">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
