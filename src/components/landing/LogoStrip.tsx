import { CheckCircle2 } from "lucide-react";

const credibilityBullets = [
  "Rotina e revisões centralizadas",
  "Progresso visível por semana",
  "Você sempre sabe o próximo passo",
];

// Placeholder logos - geometric shapes representing companies
const placeholderLogos = [
  { name: "Concurseiros", shape: "square" },
  { name: "Universitários", shape: "circle" },
  { name: "Certificações", shape: "hexagon" },
  { name: "Transição de carreira", shape: "diamond" },
  { name: "Residência", shape: "pentagon" },
  { name: "Equipes de estudo", shape: "octagon" },
];

function PlaceholderLogo({ name, shape }: { name: string; shape: string }) {
  const shapeClasses: Record<string, string> = {
    square: "rounded-md",
    circle: "rounded-full",
    hexagon: "rounded-lg",
    diamond: "rotate-45 rounded-sm",
    pentagon: "rounded-lg",
    octagon: "rounded-xl",
  };

  return (
    <div className="flex items-center gap-2 text-muted-foreground/50 hover:text-muted-foreground/70 transition-colors">
      <div 
        className={`w-6 h-6 bg-muted-foreground/20 ${shapeClasses[shape] || "rounded-md"}`} 
      />
      <span className="font-medium text-sm">{name}</span>
    </div>
  );
}

export function LogoStrip() {
  return (
    <section className="py-12 border-y bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Feito para quem precisa estudar com constância — sem depender de motivação.
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-10">
          {placeholderLogos.map((logo) => (
            <PlaceholderLogo key={logo.name} name={logo.name} shape={logo.shape} />
          ))}
        </div>

        {/* Credibility bullets */}
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3">
          {credibilityBullets.map((bullet, index) => (
            <span key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {bullet}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
