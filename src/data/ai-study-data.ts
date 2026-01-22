// ============================================================================
// AI STUDY ENGINE - Core logic for AI-guided study sessions
// ============================================================================

import { CFA_MODULES, CFA_QUIZZES } from "./cfa-mock-data";
import { MOCK_TRAIL_PLAN } from "./trail-planning-data";

// ============================================================================
// TYPES
// ============================================================================

export interface AIStudyRecommendation {
  id: string;
  type: "continue" | "new" | "review" | "quiz";
  moduleId: string;
  moduleName: string;
  competency: string;
  topic: string;
  estimatedMinutes: number;
  reason: string;
  priority: number;
  aiMessage: string;
}

export interface AISessionStep {
  id: string;
  type: "intro" | "content" | "example" | "exercise" | "quiz" | "feedback";
  title: string;
  content: string;
  estimatedMinutes: number;
  completed: boolean;
}

export interface AIStudySession {
  id: string;
  moduleId: string;
  moduleName: string;
  competency: string;
  startedAt: number;
  completedAt?: number;
  steps: AISessionStep[];
  currentStepIndex: number;
  confidenceRating?: 1 | 2 | 3 | 4 | 5;
  xpEarned: number;
}

export interface StudySessionHistory {
  id: string;
  moduleId: string;
  competency: string;
  date: string;
  durationMinutes: number;
  type: "ai_session" | "quiz" | "review" | "simulado";
  score?: number;
}

// ============================================================================
// MOCK SESSION HISTORY (localStorage)
// ============================================================================

const STORAGE_KEY_SESSIONS = "studai_session_history";
const STORAGE_KEY_CURRENT_SESSION = "studai_current_session";

export function getSessionHistory(): StudySessionHistory[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (!stored) return generateMockSessionHistory();
    return JSON.parse(stored);
  } catch {
    return generateMockSessionHistory();
  }
}

export function saveSessionHistory(sessions: StudySessionHistory[]): void {
  localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
}

export function getCurrentSession(): AIStudySession | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CURRENT_SESSION);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function saveCurrentSession(session: AIStudySession | null): void {
  if (session) {
    localStorage.setItem(STORAGE_KEY_CURRENT_SESSION, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEY_CURRENT_SESSION);
  }
}

// ============================================================================
// CORE AI LOGIC - getNextAIStudyAction
// ============================================================================

export function getNextAIStudyAction(): AIStudyRecommendation {
  const modules = CFA_MODULES;
  const quizzes = CFA_QUIZZES;
  const history = getSessionHistory();

  // 1. Check for in_progress module (highest priority)
  const inProgressModule = modules.find(m => m.status === "active" && m.progress > 0 && m.progress < 100);
  if (inProgressModule) {
    return {
      id: `rec-${inProgressModule.id}`,
      type: "continue",
      moduleId: inProgressModule.id,
      moduleName: inProgressModule.name,
      competency: inProgressModule.topic,
      topic: "Quantitative Methods",
      estimatedMinutes: Math.round((inProgressModule.totalLessons - inProgressModule.completedLessons) * 15),
      reason: "Você estava estudando este conteúdo",
      priority: 1,
      aiMessage: `Vamos continuar de onde você parou em "${inProgressModule.name}". Faltam ${inProgressModule.totalLessons - inProgressModule.completedLessons} lições para concluir este módulo.`
    };
  }

  // 2. Check for quiz that needs improvement (score < 70%)
  const lowScoreQuiz = quizzes.find(q => q.lastScore !== undefined && q.lastScore < 70);
  if (lowScoreQuiz) {
    const relatedModule = modules.find(m => m.id === lowScoreQuiz.moduleId);
    return {
      id: `rec-review-${lowScoreQuiz.id}`,
      type: "review",
      moduleId: lowScoreQuiz.moduleId,
      moduleName: lowScoreQuiz.moduleName,
      competency: relatedModule?.topic || "Quantitative Methods",
      topic: "Quantitative Methods",
      estimatedMinutes: 20,
      reason: "Sua última nota foi abaixo de 70%",
      priority: 2,
      aiMessage: `Identifiquei que sua nota em "${lowScoreQuiz.moduleName}" foi ${lowScoreQuiz.lastScore}%. Vamos revisar os conceitos-chave para melhorar seu desempenho.`
    };
  }

  // 3. Check most frequent module in last 3 sessions
  const last3Sessions = history.slice(-3);
  const moduleFrequency: Record<string, number> = {};
  last3Sessions.forEach(s => {
    moduleFrequency[s.moduleId] = (moduleFrequency[s.moduleId] || 0) + 1;
  });
  const mostFrequentModuleId = Object.entries(moduleFrequency).sort((a, b) => b[1] - a[1])[0]?.[0];
  
  if (mostFrequentModuleId) {
    const frequentModule = modules.find(m => m.id === mostFrequentModuleId);
    if (frequentModule && frequentModule.progress < 100) {
      return {
        id: `rec-freq-${frequentModule.id}`,
        type: "continue",
        moduleId: frequentModule.id,
        moduleName: frequentModule.name,
        competency: frequentModule.topic,
        topic: "Quantitative Methods",
        estimatedMinutes: 25,
        reason: "Você tem estudado este tema recentemente",
        priority: 3,
        aiMessage: `Você tem focado em "${frequentModule.name}" ultimamente. Manter a consistência é chave para a retenção!`
      };
    }
  }

  // 4. Find first not_started module
  const nextModule = modules.find(m => m.status === "active" && m.progress === 0) 
    || modules.find(m => m.status === "locked");
  
  if (nextModule) {
    return {
      id: `rec-new-${nextModule.id}`,
      type: "new",
      moduleId: nextModule.id,
      moduleName: nextModule.name,
      competency: nextModule.topic,
      topic: "Quantitative Methods",
      estimatedMinutes: nextModule.estimatedHours * 60 / nextModule.totalLessons,
      reason: "Próximo módulo na sua trilha",
      priority: 4,
      aiMessage: `Hora de começar algo novo! "${nextModule.name}" é o próximo passo na sua jornada CFA.`
    };
  }

  // Default fallback
  return {
    id: "rec-default",
    type: "review",
    moduleId: modules[0].id,
    moduleName: modules[0].name,
    competency: modules[0].topic,
    topic: "Quantitative Methods",
    estimatedMinutes: 30,
    reason: "Recomendação padrão da trilha",
    priority: 5,
    aiMessage: "Vamos revisar os fundamentos para manter o conhecimento fresco!"
  };
}

// ============================================================================
// AI SESSION BUILDER
// ============================================================================

export function createAIStudySession(recommendation: AIStudyRecommendation): AIStudySession {
  const sessionId = `session-${Date.now()}`;
  
  const steps: AISessionStep[] = [
    {
      id: `${sessionId}-intro`,
      type: "intro",
      title: "Introdução",
      content: `Olá! Hoje vamos trabalhar em **${recommendation.moduleName}**.\n\n${recommendation.aiMessage}\n\nEste módulo faz parte de ${recommendation.competency} e é fundamental para sua preparação CFA.`,
      estimatedMinutes: 2,
      completed: false,
    },
    {
      id: `${sessionId}-content`,
      type: "content",
      title: "Conceitos-Chave",
      content: getContentForModule(recommendation.moduleId),
      estimatedMinutes: 10,
      completed: false,
    },
    {
      id: `${sessionId}-example`,
      type: "example",
      title: "Exemplo Prático",
      content: getExampleForModule(recommendation.moduleId),
      estimatedMinutes: 5,
      completed: false,
    },
    {
      id: `${sessionId}-exercise`,
      type: "exercise",
      title: "Exercício Guiado",
      content: getExerciseForModule(recommendation.moduleId),
      estimatedMinutes: 8,
      completed: false,
    },
    {
      id: `${sessionId}-feedback`,
      type: "feedback",
      title: "Feedback",
      content: "Como você se sentiu nesta sessão? Sua avaliação nos ajuda a personalizar ainda mais seu aprendizado.",
      estimatedMinutes: 1,
      completed: false,
    },
  ];

  return {
    id: sessionId,
    moduleId: recommendation.moduleId,
    moduleName: recommendation.moduleName,
    competency: recommendation.competency,
    startedAt: Date.now(),
    steps,
    currentStepIndex: 0,
    xpEarned: 0,
  };
}

// Content generators for each module
function getContentForModule(moduleId: string): string {
  const contents: Record<string, string> = {
    "qm-1": `## Time Value of Money (TVM)

O conceito de **valor do dinheiro no tempo** é fundamental em finanças. A ideia central é que um real hoje vale mais do que um real no futuro.

### Fórmulas Essenciais

**Valor Futuro (FV):**
\`FV = PV × (1 + r)^n\`

**Valor Presente (PV):**
\`PV = FV / (1 + r)^n\`

Onde:
- PV = Valor Presente
- FV = Valor Futuro
- r = Taxa de juros por período
- n = Número de períodos`,

    "qm-2": `## Organizing, Visualizing, and Describing Data

A análise de dados começa com a organização e visualização adequada.

### Medidas de Tendência Central
- **Média Aritmética**: Soma de todos os valores dividida pelo número de observações
- **Mediana**: Valor central quando os dados estão ordenados
- **Moda**: Valor mais frequente

### Medidas de Dispersão
- **Variância**: Média dos quadrados dos desvios
- **Desvio Padrão**: Raiz quadrada da variância
- **Coeficiente de Variação**: Desvio padrão / média`,

    "qm-3": `## Probability Concepts

A probabilidade quantifica a incerteza e é essencial para análise de investimentos.

### Conceitos Fundamentais
- **Probabilidade Condicional**: P(A|B) = P(A ∩ B) / P(B)
- **Independência**: P(A ∩ B) = P(A) × P(B)
- **Teorema de Bayes**: Atualiza probabilidades com nova informação

### Regras de Probabilidade
1. 0 ≤ P(A) ≤ 1
2. P(Ω) = 1
3. P(A ou B) = P(A) + P(B) - P(A e B)`,

    "qm-4": `## Common Probability Distributions

Distribuições de probabilidade modelam o comportamento de variáveis aleatórias.

### Distribuição Normal
- Simétrica em torno da média
- ~68% dos dados entre ±1σ
- ~95% entre ±2σ
- ~99.7% entre ±3σ

### Z-Score
\`z = (X - μ) / σ\`

Permite padronizar qualquer distribuição normal.`,
  };

  return contents[moduleId] || contents["qm-1"];
}

function getExampleForModule(moduleId: string): string {
  const examples: Record<string, string> = {
    "qm-1": `### Exemplo: Investimento de R$ 10.000

**Cenário:** Você investe R$ 10.000 a 8% a.a. por 5 anos.

**Cálculo:**
\`\`\`
FV = 10.000 × (1,08)^5
FV = 10.000 × 1,4693
FV = R$ 14.693,28
\`\`\`

**Ganho:** R$ 4.693,28 (47% de retorno total)

💡 **Insight da IA:** Note como os juros compostos aceleram o crescimento. No 5º ano, você ganha mais juros do que nos dois primeiros anos combinados!`,

    "qm-3": `### Exemplo: Probabilidade Condicional

**Cenário:** Em um mercado, 30% das ações são de tecnologia. Das ações de tecnologia, 40% superaram o índice.

**Pergunta:** Qual a probabilidade de uma ação ser de tech E superar o índice?

**Cálculo:**
\`\`\`
P(Tech) = 0,30
P(Supera | Tech) = 0,40
P(Tech e Supera) = 0,30 × 0,40 = 0,12 = 12%
\`\`\`

💡 **Insight da IA:** Este é um exemplo de probabilidade conjunta usando a regra da multiplicação!`,
  };

  return examples[moduleId] || examples["qm-1"];
}

function getExerciseForModule(moduleId: string): string {
  const exercises: Record<string, string> = {
    "qm-1": `### Exercício Guiado

**Problema:** Uma empresa oferece um título que pagará R$ 50.000 em 10 anos. Se a taxa de desconto é 6% a.a., qual é o valor presente deste título?

**Passo 1:** Identifique as variáveis
- FV = ?
- PV = ?
- r = ?
- n = ?

**Passo 2:** Aplique a fórmula do Valor Presente

**Passo 3:** Calcule e interprete o resultado

---

*Clique em "Próximo" quando tiver resolvido para ver a resposta e explicação da IA.*`,

    "qm-3": `### Exercício Guiado

**Problema:** Se P(A) = 0,5 e P(B) = 0,3, e A e B são eventos independentes:

a) Qual é P(A e B)?
b) Qual é P(A ou B)?

**Passo 1:** Para eventos independentes, P(A e B) = P(A) × P(B)

**Passo 2:** Use a regra da adição: P(A ou B) = P(A) + P(B) - P(A e B)

---

*Resolva e clique em "Próximo" para verificar sua resposta.*`,
  };

  return exercises[moduleId] || exercises["qm-1"];
}

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

function generateMockSessionHistory(): StudySessionHistory[] {
  const history: StudySessionHistory[] = [];
  const today = new Date();
  
  // Generate 30 days of mock history
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Random chance of studying each day (70%)
    if (Math.random() < 0.7) {
      const sessionCount = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < sessionCount; j++) {
        const moduleIndex = Math.floor(Math.random() * 4);
        const modules = ["qm-1", "qm-2", "qm-3", "qm-4"];
        const types: ("ai_session" | "quiz" | "review")[] = ["ai_session", "quiz", "review"];
        
        history.push({
          id: `hist-${i}-${j}`,
          moduleId: modules[moduleIndex],
          competency: "Quantitative Methods",
          date: date.toISOString().split("T")[0],
          durationMinutes: Math.floor(Math.random() * 45) + 15,
          type: types[Math.floor(Math.random() * types.length)],
          score: Math.random() < 0.5 ? Math.floor(Math.random() * 30) + 70 : undefined,
        });
      }
    }
  }
  
  saveSessionHistory(history);
  return history;
}

// ============================================================================
// ANALYTICS HELPERS
// ============================================================================

export interface StudyAnalytics {
  totalMinutes7d: number;
  totalMinutes30d: number;
  totalMinutes90d: number;
  activeDays7d: number;
  activeDays30d: number;
  averageMinutesPerDay: number;
  sessionsCount: number;
  formatDistribution: {
    ai_session: number;
    quiz: number;
    review: number;
    simulado: number;
  };
  weeklyHeatmap: number[]; // 7 values for each day of week
  streakCurrent: number;
  streakBest: number;
}

export function calculateStudyAnalytics(): StudyAnalytics {
  const history = getSessionHistory();
  const today = new Date();
  
  const last7d = history.filter(s => {
    const sessionDate = new Date(s.date);
    const diffDays = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });
  
  const last30d = history.filter(s => {
    const sessionDate = new Date(s.date);
    const diffDays = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  });
  
  const last90d = history.filter(s => {
    const sessionDate = new Date(s.date);
    const diffDays = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 90;
  });

  const uniqueDays7d = new Set(last7d.map(s => s.date)).size;
  const uniqueDays30d = new Set(last30d.map(s => s.date)).size;

  const formatDist = { ai_session: 0, quiz: 0, review: 0, simulado: 0 };
  last30d.forEach(s => {
    formatDist[s.type] = (formatDist[s.type] || 0) + s.durationMinutes;
  });

  // Weekly heatmap (0 = Sunday, 6 = Saturday)
  const weeklyHeatmap = [0, 0, 0, 0, 0, 0, 0];
  last30d.forEach(s => {
    const day = new Date(s.date).getDay();
    weeklyHeatmap[day] += s.durationMinutes;
  });

  return {
    totalMinutes7d: last7d.reduce((sum, s) => sum + s.durationMinutes, 0),
    totalMinutes30d: last30d.reduce((sum, s) => sum + s.durationMinutes, 0),
    totalMinutes90d: last90d.reduce((sum, s) => sum + s.durationMinutes, 0),
    activeDays7d: uniqueDays7d,
    activeDays30d: uniqueDays30d,
    averageMinutesPerDay: Math.round(last30d.reduce((sum, s) => sum + s.durationMinutes, 0) / 30),
    sessionsCount: last30d.length,
    formatDistribution: formatDist,
    weeklyHeatmap,
    streakCurrent: 12, // TODO: Calculate from history
    streakBest: 21,
  };
}

// ROI metrics
export interface StudyROI {
  minutesPerProgressPercent: number;
  weeklyProgressRate: number;
  projectedCompletionWeeks: number;
  efficiency: "high" | "medium" | "low";
}

export function calculateStudyROI(): StudyROI {
  const analytics = calculateStudyAnalytics();
  const progress = 42; // Current progress percent from trail
  const remaining = 100 - progress;
  
  const minutesPerPercent = progress > 0 ? Math.round(analytics.totalMinutes30d / progress) : 0;
  const weeklyMinutes = Math.round(analytics.totalMinutes7d);
  const weeklyProgressRate = minutesPerPercent > 0 ? weeklyMinutes / minutesPerPercent : 0;
  const weeksToComplete = remaining / Math.max(weeklyProgressRate, 0.1);
  
  return {
    minutesPerProgressPercent: minutesPerPercent,
    weeklyProgressRate: Math.round(weeklyProgressRate * 10) / 10,
    projectedCompletionWeeks: Math.round(weeksToComplete),
    efficiency: weeklyProgressRate > 5 ? "high" : weeklyProgressRate > 2 ? "medium" : "low",
  };
}
