import { Building2 } from "lucide-react";

// Placeholder company names for social proof
const companies = [
  "TechCorp",
  "EduPro",
  "CareerPath",
  "StudyHub",
  "LearnWell",
  "PrepMaster",
];

export function LogoStrip() {
  return (
    <section className="py-12 border-y bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Usado por estudantes e equipes que buscam consistência nos estudos
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {companies.map((company) => (
            <div
              key={company}
              className="flex items-center gap-2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              <Building2 className="h-5 w-5" />
              <span className="font-medium text-sm">{company}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
