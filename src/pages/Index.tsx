import { useState } from "react";
import { Search, Flame, Clock, CheckCircle2, Target, BookOpen, Menu, X } from "lucide-react";

// Mock Data
const userData = {
  name: "João Silva",
  plan: "Premium",
  streak: 12,
};

const weeklyStudy7Days = [
  { day: "Seg", minutes: 45 },
  { day: "Ter", minutes: 60 },
  { day: "Qua", minutes: 30 },
  { day: "Qui", minutes: 75 },
  { day: "Sex", minutes: 50 },
  { day: "Sáb", minutes: 90 },
  { day: "Dom", minutes: 40 },
];

const weeklyStudy30Days = [
  { day: "S1", minutes: 320 },
  { day: "S2", minutes: 280 },
  { day: "S3", minutes: 410 },
  { day: "S4", minutes: 350 },
];

const tracks = [
  { id: 1, name: "Matemática", progress: 72, status: "Em andamento" },
  { id: 2, name: "Português", progress: 100, status: "Concluída" },
  { id: 3, name: "Programação", progress: 45, status: "Em andamento" },
  { id: 4, name: "Inglês", progress: 0, status: "A iniciar" },
  { id: 5, name: "Física", progress: 28, status: "Em andamento" },
];

const recentSessions = [
  { date: "17/01", theme: "Álgebra Linear", duration: "45 min", result: "Quiz 9/10" },
  { date: "16/01", theme: "Gramática", duration: "30 min", result: "Leitura" },
  { date: "15/01", theme: "Python Básico", duration: "60 min", result: "Quiz 8/10" },
  { date: "14/01", theme: "Trigonometria", duration: "40 min", result: "Quiz 7/10" },
  { date: "13/01", theme: "Mecânica", duration: "35 min", result: "Quiz 6/10" },
  { date: "12/01", theme: "Redação", duration: "50 min", result: "Exercício" },
];

const goals = {
  dailyGoal: 60,
  completed: 35,
};

const checklistItems = [
  { id: 1, text: "Revisar fórmulas de física", checked: false },
  { id: 2, text: "Fazer quiz de matemática", checked: true },
  { id: 3, text: "Ler capítulo de gramática", checked: false },
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [period, setPeriod] = useState<"7" | "30">("7");
  const [checklist, setChecklist] = useState(checklistItems);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredTracks = tracks.filter((track) =>
    track.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = period === "7" ? weeklyStudy7Days : weeklyStudy30Days;
  const maxMinutes = Math.max(...chartData.map((d) => d.minutes));
  const totalWeeklyHours = (weeklyStudy7Days.reduce((acc, d) => acc + d.minutes, 0) / 60).toFixed(1);
  const tasksCompleted = tracks.filter((t) => t.status === "Concluída").length;
  const quizAccuracy = 82;

  const toggleCheck = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleContinue = (name: string) => {
    alert(`Continuando: ${name}`);
  };

  const getStatusColor = (status: string) => {
    if (status === "Concluída") return "text-success";
    if (status === "Em andamento") return "text-accent";
    return "text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[hsl(260,80%,20%)] to-[hsl(222,89%,55%)] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-bold tracking-tight">StudAI</h1>
          </div>

          <div className="hidden sm:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
              <input
                type="text"
                placeholder="Buscar conteúdo, trilhas, temas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <span className="text-white/90 hover:text-white cursor-pointer border-b-2 border-white pb-1">Dashboard</span>
            <span className="text-white/70 hover:text-white cursor-pointer">Trilhas</span>
            <span className="text-white/70 hover:text-white cursor-pointer">Simulados</span>
          </nav>
        </div>
      </header>

      {/* Mobile Search */}
      <div className="sm:hidden px-4 py-3 bg-card border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* Welcome */}
            <div>
              <h2 className="text-2xl font-bold text-card-foreground">
                Olá, {userData.name}! 👋
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Continue sua jornada de aprendizado
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<Flame className="text-warning" size={24} />}
                value={`${userData.streak} dias`}
                label="Streak"
                sublabel={`Meta: ${goals.dailyGoal} min/dia`}
              />
              <StatCard
                icon={<Clock className="text-accent" size={24} />}
                value={`${totalWeeklyHours}h`}
                label="Tempo estudado"
                sublabel="Esta semana"
              />
              <StatCard
                icon={<CheckCircle2 className="text-success" size={24} />}
                value={tasksCompleted.toString()}
                label="Tarefas concluídas"
                sublabel={`de ${tracks.length} trilhas`}
              />
              <StatCard
                icon={<Target className="text-primary" size={24} />}
                value={`${quizAccuracy}%`}
                label="Precisão"
                sublabel="Em quizzes"
              />
            </div>

            {/* Chart */}
            <div className="bg-card rounded-xl border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-card-foreground">Minutos estudados</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPeriod("7")}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                      period === "7"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-muted"
                    }`}
                  >
                    7 dias
                  </button>
                  <button
                    onClick={() => setPeriod("30")}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                      period === "30"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-muted"
                    }`}
                  >
                    30 dias
                  </button>
                </div>
              </div>
              <div className="flex items-end justify-between gap-2 h-40">
                {chartData.map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex justify-center">
                      <div
                        className="w-full max-w-[40px] bg-accent rounded-t-md transition-all duration-300"
                        style={{ height: `${(item.minutes / maxMinutes) * 120}px` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracks */}
            <div className="bg-card rounded-xl border p-5">
              <h3 className="font-semibold text-card-foreground mb-4">Trilhas / Disciplinas</h3>
              <div className="space-y-3">
                {filteredTracks.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-4 text-center">
                    Nenhuma trilha encontrada
                  </p>
                ) : (
                  filteredTracks.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg"
                    >
                      <BookOpen className="text-primary shrink-0" size={20} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-medium text-card-foreground truncate">
                            {track.name}
                          </span>
                          <span className={`text-xs font-medium ${getStatusColor(track.status)}`}>
                            {track.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent rounded-full transition-all"
                              style={{ width: `${track.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-10">
                            {track.progress}%
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleContinue(track.name)}
                        className="shrink-0 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Continuar
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card rounded-xl border p-5 overflow-x-auto">
              <h3 className="font-semibold text-card-foreground mb-4">Atividade recente</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium text-muted-foreground">Data</th>
                    <th className="pb-2 font-medium text-muted-foreground">Tema</th>
                    <th className="pb-2 font-medium text-muted-foreground">Duração</th>
                    <th className="pb-2 font-medium text-muted-foreground">Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSessions.map((session, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-3 text-card-foreground">{session.date}</td>
                      <td className="py-3 text-card-foreground">{session.theme}</td>
                      <td className="py-3 text-muted-foreground">{session.duration}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-md font-medium">
                          {session.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>

          {/* Sidebar */}
          <aside
            className={`
              lg:w-72 shrink-0 space-y-4
              fixed lg:static inset-0 top-[57px] z-40 bg-background lg:bg-transparent
              transform transition-transform lg:transform-none
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
              p-4 lg:p-0 overflow-y-auto
            `}
          >
            {/* Daily Goal */}
            <div className="bg-card rounded-xl border p-5">
              <h3 className="font-semibold text-card-foreground mb-3">Meta de hoje</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-primary">
                  {goals.completed}/{goals.dailyGoal}
                </span>
                <span className="text-sm text-muted-foreground">minutos</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[hsl(260,80%,20%)] to-[hsl(222,89%,55%)] rounded-full transition-all"
                  style={{ width: `${(goals.completed / goals.dailyGoal) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Faltam {goals.dailyGoal - goals.completed} min para bater a meta!
              </p>
            </div>

            {/* Recommendation */}
            <div className="bg-card rounded-xl border p-5">
              <h3 className="font-semibold text-card-foreground mb-3">Próxima recomendação</h3>
              <div className="p-3 bg-accent/10 rounded-lg">
                <p className="font-medium text-card-foreground text-sm">
                  Quiz: Derivadas e Integrais
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  15 questões • ~20 min
                </p>
                <button className="mt-3 w-full py-2 text-sm font-medium bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity">
                  Iniciar
                </button>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-card rounded-xl border p-5">
              <h3 className="font-semibold text-card-foreground mb-3">Checklist rápido</h3>
              <div className="space-y-3">
                {checklist.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleCheck(item.id)}
                      className="mt-0.5 w-4 h-4 rounded border-2 border-muted-foreground checked:bg-success checked:border-success accent-success"
                    />
                    <span
                      className={`text-sm ${
                        item.checked
                          ? "text-muted-foreground line-through"
                          : "text-card-foreground"
                      }`}
                    >
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({
  icon,
  value,
  label,
  sublabel,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel: string;
}) => (
  <div className="bg-card rounded-xl border p-4">
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <span className="text-xl font-bold text-card-foreground">{value}</span>
    </div>
    <p className="text-sm font-medium text-card-foreground">{label}</p>
    <p className="text-xs text-muted-foreground">{sublabel}</p>
  </div>
);

export default Index;
