import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, Clock, Calendar, Layers, ArrowRight, ArrowLeft, 
  CheckCircle2, GraduationCap, Loader2
} from "lucide-react";
import { useSaveLearningPreference } from "@/hooks/use-learning-preference";
import { toast } from "sonner";

const INTEREST_OPTIONS = [
  { id: "finance", label: "Finanças", emoji: "💰" },
  { id: "tech", label: "Tecnologia", emoji: "💻" },
  { id: "data_science", label: "Data Science", emoji: "📊" },
  { id: "marketing", label: "Marketing", emoji: "📣" },
  { id: "design", label: "Design", emoji: "🎨" },
  { id: "business", label: "Negócios", emoji: "📈" },
  { id: "programming", label: "Programação", emoji: "⚙️" },
  { id: "languages", label: "Idiomas", emoji: "🌍" },
  { id: "math", label: "Matemática", emoji: "🧮" },
  { id: "science", label: "Ciências", emoji: "🔬" },
  { id: "leadership", label: "Liderança", emoji: "👑" },
  { id: "personal_dev", label: "Desenvolvimento Pessoal", emoji: "🧠" },
];

const MINUTES_OPTIONS = [
  { value: 15, label: "15 min", desc: "Rápido e consistente" },
  { value: 30, label: "30 min", desc: "Ideal para manter ritmo" },
  { value: 60, label: "1 hora", desc: "Estudo focado" },
  { value: 90, label: "1h30", desc: "Sessão profunda" },
  { value: 120, label: "2 horas", desc: "Imersão total" },
];

const DAY_OPTIONS = [
  { id: "mon", label: "Seg" },
  { id: "tue", label: "Ter" },
  { id: "wed", label: "Qua" },
  { id: "thu", label: "Qui" },
  { id: "fri", label: "Sex" },
  { id: "sat", label: "Sáb" },
  { id: "sun", label: "Dom" },
];

const FORMAT_OPTIONS = [
  { id: "video", label: "Vídeos", emoji: "🎬" },
  { id: "article", label: "Artigos", emoji: "📝" },
  { id: "podcast", label: "Podcasts", emoji: "🎧" },
  { id: "interactive", label: "Interativo", emoji: "🕹️" },
];

const CONTENT_LENGTH_OPTIONS = [
  { id: "bite_sized" as const, label: "Micro (< 5 min)", desc: "Pílulas rápidas" },
  { id: "short" as const, label: "Curto (5-15 min)", desc: "Direto ao ponto" },
  { id: "medium" as const, label: "Médio (15-30 min)", desc: "Equilíbrio ideal" },
  { id: "deep_dive" as const, label: "Profundo (30+ min)", desc: "Imersão completa" },
];

interface OnboardingQuestionnaireProps {
  onComplete: () => void;
}

export function OnboardingQuestionnaire({ onComplete }: OnboardingQuestionnaireProps) {
  const [step, setStep] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);
  const [minutesPerDay, setMinutesPerDay] = useState<number | null>(null);
  const [days, setDays] = useState<string[]>([]);
  const [formats, setFormats] = useState<string[]>([]);
  const [contentLength, setContentLength] = useState<"bite_sized" | "short" | "medium" | "deep_dive" | null>(null);

  const saveMutation = useSaveLearningPreference();

  const steps = [
    { title: "O que você quer aprender?", icon: BookOpen, desc: "Selecione seus interesses" },
    { title: "Quanto tempo por dia?", icon: Clock, desc: "Defina sua carga diária" },
    { title: "Quais dias da semana?", icon: Calendar, desc: "Monte sua rotina" },
    { title: "Que formatos prefere?", icon: Layers, desc: "Escolha como estudar" },
    { title: "Tamanho do conteúdo?", icon: Layers, desc: "Quanto detalhe por sessão" },
  ];

  const totalSteps = steps.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const toggleInterest = (id: string) => {
    setInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleDay = (id: string) => {
    setDays(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  const toggleFormat = (id: string) => {
    setFormats(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const canAdvance = () => {
    switch (step) {
      case 0: return interests.length > 0;
      case 1: return minutesPerDay !== null;
      case 2: return days.length > 0;
      case 3: return formats.length > 0;
      case 4: return contentLength !== null;
      default: return false;
    }
  };

  const handleFinish = async () => {
    try {
      await saveMutation.mutateAsync({
        interests,
        minutes_per_day: minutesPerDay ?? undefined,
        days,
        formats,
        content_length: contentLength ?? undefined,
      });
      toast.success("Perfil de aprendizado salvo!");
      onComplete();
    } catch {
      toast.error("Erro ao salvar preferências. Tente novamente.");
    }
  };

  const StepIcon = steps[step].icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl border-2">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">StudAI</p>
              <p className="text-xs text-muted-foreground">Passo {step + 1} de {totalSteps}</p>
            </div>
          </div>
          <Progress value={progress} className="h-1.5 mb-3" />
          <CardTitle className="text-xl flex items-center gap-2">
            <StepIcon className="w-5 h-5 text-primary" />
            {steps[step].title}
          </CardTitle>
          <CardDescription>{steps[step].desc}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Step 0: Interests */}
          {step === 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {INTEREST_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => toggleInterest(opt.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 text-left text-sm font-medium transition-all ${
                    interests.includes(opt.id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <span>{opt.emoji}</span>
                  <span>{opt.label}</span>
                  {interests.includes(opt.id) && <CheckCircle2 className="w-4 h-4 ml-auto text-primary" />}
                </button>
              ))}
            </div>
          )}

          {/* Step 1: Minutes per day */}
          {step === 1 && (
            <div className="space-y-2">
              {MINUTES_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setMinutesPerDay(opt.value)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border-2 text-left transition-all ${
                    minutesPerDay === opt.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-sm">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                  {minutesPerDay === opt.value && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Days */}
          {step === 2 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {DAY_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => toggleDay(opt.id)}
                  className={`w-14 h-14 rounded-xl border-2 font-semibold text-sm transition-all ${
                    days.includes(opt.id)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Formats */}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-3">
              {FORMAT_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => toggleFormat(opt.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    formats.includes(opt.id)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="font-medium text-sm">{opt.label}</span>
                  {formats.includes(opt.id) && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </div>
          )}

          {/* Step 4: Content length */}
          {step === 4 && (
            <div className="space-y-2">
              {CONTENT_LENGTH_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setContentLength(opt.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border-2 text-left transition-all ${
                    contentLength === opt.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-sm">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                  {contentLength === opt.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </button>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="ghost"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>

            {step < totalSteps - 1 ? (
              <Button
                onClick={() => setStep(s => s + 1)}
                disabled={!canAdvance()}
                className="gap-1"
              >
                Próximo
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={!canAdvance() || saveMutation.isPending}
                className="gap-1"
              >
                {saveMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Salvando...</>
                ) : (
                  <>Começar<ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
