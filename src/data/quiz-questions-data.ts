import type { Quiz } from "@/types/studai";

// ============================================================================
// QUIZ QUESTIONS - CFA Level I Mock Questions
// ============================================================================

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizSession {
  quizId: string;
  moduleName: string;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: (number | null)[];
  startedAt: number;
  completedAt?: number;
}

export interface QuizResult {
  quizId: string;
  moduleName: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpentSeconds: number;
  questionResults: {
    questionId: string;
    selectedIndex: number | null;
    correctIndex: number;
    isCorrect: boolean;
  }[];
}

// Mock questions for each quiz
export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  "quiz-qm1": [
    {
      id: "q1-1",
      quizId: "quiz-qm1",
      question: "Um investidor deposita R$ 10.000 em uma conta que paga 8% ao ano, composto anualmente. Qual será o valor após 3 anos?",
      options: [
        "R$ 12.400,00",
        "R$ 12.597,12",
        "R$ 12.800,00",
        "R$ 13.000,00"
      ],
      correctIndex: 1,
      explanation: "FV = PV × (1 + r)^n = 10.000 × (1,08)^3 = 10.000 × 1,2597 = R$ 12.597,12"
    },
    {
      id: "q1-2",
      quizId: "quiz-qm1",
      question: "Qual é a taxa efetiva anual (EAR) de uma taxa nominal de 12% ao ano, composta mensalmente?",
      options: [
        "12,00%",
        "12,36%",
        "12,55%",
        "12,68%"
      ],
      correctIndex: 3,
      explanation: "EAR = (1 + 0,12/12)^12 - 1 = (1,01)^12 - 1 = 0,1268 = 12,68%"
    },
    {
      id: "q1-3",
      quizId: "quiz-qm1",
      question: "Um título paga R$ 1.000 em 5 anos. Se a taxa de desconto é 6% a.a., qual o valor presente?",
      options: [
        "R$ 704,96",
        "R$ 747,26",
        "R$ 792,09",
        "R$ 840,00"
      ],
      correctIndex: 1,
      explanation: "PV = FV / (1 + r)^n = 1.000 / (1,06)^5 = 1.000 / 1,3382 = R$ 747,26"
    },
    {
      id: "q1-4",
      quizId: "quiz-qm1",
      question: "Uma perpetuidade paga R$ 500 por ano. Com taxa de desconto de 10%, qual o valor presente?",
      options: [
        "R$ 4.500",
        "R$ 5.000",
        "R$ 5.500",
        "R$ 6.000"
      ],
      correctIndex: 1,
      explanation: "PV de perpetuidade = PMT / r = 500 / 0,10 = R$ 5.000"
    },
    {
      id: "q1-5",
      quizId: "quiz-qm1",
      question: "Qual a diferença entre uma anuidade ordinária e uma anuidade devida?",
      options: [
        "A anuidade devida tem pagamentos no início do período",
        "A anuidade ordinária tem pagamentos no início do período",
        "Não há diferença material entre elas",
        "A anuidade devida só se aplica a perpetuidades"
      ],
      correctIndex: 0,
      explanation: "Na anuidade devida (annuity due), os pagamentos ocorrem no início de cada período, enquanto na anuidade ordinária ocorrem no final."
    }
  ],
  "quiz-qm2": [
    {
      id: "q2-1",
      quizId: "quiz-qm2",
      question: "Qual medida de tendência central é mais afetada por valores extremos (outliers)?",
      options: [
        "Mediana",
        "Moda",
        "Média aritmética",
        "Média geométrica"
      ],
      correctIndex: 2,
      explanation: "A média aritmética é a mais sensível a outliers, pois considera todos os valores no cálculo."
    },
    {
      id: "q2-2",
      quizId: "quiz-qm2",
      question: "Um histograma com cauda longa à direita indica uma distribuição:",
      options: [
        "Simétrica",
        "Negativamente assimétrica",
        "Positivamente assimétrica",
        "Bimodal"
      ],
      correctIndex: 2,
      explanation: "Cauda longa à direita indica assimetria positiva (right-skewed), onde média > mediana > moda."
    },
    {
      id: "q2-3",
      quizId: "quiz-qm2",
      question: "O coeficiente de variação (CV) é útil para:",
      options: [
        "Medir a curtose de uma distribuição",
        "Comparar dispersão relativa entre séries com médias diferentes",
        "Determinar a mediana de um conjunto de dados",
        "Calcular a correlação entre duas variáveis"
      ],
      correctIndex: 1,
      explanation: "O CV (desvio padrão / média) permite comparar a dispersão relativa de diferentes conjuntos de dados."
    },
    {
      id: "q2-4",
      quizId: "quiz-qm2",
      question: "Uma distribuição com curtose maior que 3 é chamada de:",
      options: [
        "Platicúrtica",
        "Mesocúrtica",
        "Leptocúrtica",
        "Assimétrica"
      ],
      correctIndex: 2,
      explanation: "Distribuições leptocúrticas têm curtose > 3 (excess kurtosis > 0), com caudas mais pesadas que a normal."
    },
    {
      id: "q2-5",
      quizId: "quiz-qm2",
      question: "O percentil 75 de uma distribuição também é conhecido como:",
      options: [
        "Primeiro quartil",
        "Segundo quartil",
        "Terceiro quartil",
        "Mediana"
      ],
      correctIndex: 2,
      explanation: "O terceiro quartil (Q3) corresponde ao percentil 75, abaixo do qual estão 75% dos dados."
    }
  ],
  "quiz-qm3": [
    {
      id: "q3-1",
      quizId: "quiz-qm3",
      question: "Se P(A) = 0,3 e P(B) = 0,4, e A e B são eventos independentes, qual é P(A e B)?",
      options: [
        "0,70",
        "0,12",
        "0,10",
        "0,58"
      ],
      correctIndex: 1,
      explanation: "Para eventos independentes: P(A ∩ B) = P(A) × P(B) = 0,3 × 0,4 = 0,12"
    },
    {
      id: "q3-2",
      quizId: "quiz-qm3",
      question: "A probabilidade de um evento dado que outro evento já ocorreu é chamada de:",
      options: [
        "Probabilidade marginal",
        "Probabilidade conjunta",
        "Probabilidade condicional",
        "Probabilidade complementar"
      ],
      correctIndex: 2,
      explanation: "A probabilidade condicional P(A|B) representa a probabilidade de A dado que B ocorreu."
    },
    {
      id: "q3-3",
      quizId: "quiz-qm3",
      question: "Se E(X) = 10 e Var(X) = 4, qual é o desvio padrão de 3X + 5?",
      options: [
        "6",
        "12",
        "17",
        "37"
      ],
      correctIndex: 0,
      explanation: "Var(aX + b) = a²Var(X), então Var(3X + 5) = 9 × 4 = 36. Desvio padrão = √36 = 6."
    },
    {
      id: "q3-4",
      quizId: "quiz-qm3",
      question: "Dois eventos são mutuamente exclusivos quando:",
      options: [
        "Ambos sempre ocorrem juntos",
        "A ocorrência de um impede a ocorrência do outro",
        "São estatisticamente independentes",
        "Têm a mesma probabilidade"
      ],
      correctIndex: 1,
      explanation: "Eventos mutuamente exclusivos não podem ocorrer simultaneamente: P(A ∩ B) = 0."
    },
    {
      id: "q3-5",
      quizId: "quiz-qm3",
      question: "O Teorema de Bayes é usado principalmente para:",
      options: [
        "Calcular médias ponderadas",
        "Atualizar probabilidades com nova informação",
        "Determinar a variância de uma distribuição",
        "Encontrar a moda de um conjunto de dados"
      ],
      correctIndex: 1,
      explanation: "Bayes permite atualizar a probabilidade a priori de um evento com base em novas evidências."
    }
  ],
  "quiz-qm4": [
    {
      id: "q4-1",
      quizId: "quiz-qm4",
      question: "Uma variável aleatória que pode assumir qualquer valor em um intervalo é classificada como:",
      options: [
        "Discreta",
        "Contínua",
        "Binomial",
        "Nominal"
      ],
      correctIndex: 1,
      explanation: "Variáveis contínuas podem assumir infinitos valores em um intervalo (ex: retornos, preços)."
    },
    {
      id: "q4-2",
      quizId: "quiz-qm4",
      question: "Na distribuição normal padrão, aproximadamente qual % dos dados está entre -1 e +1 desvio padrão?",
      options: [
        "50%",
        "68%",
        "95%",
        "99%"
      ],
      correctIndex: 1,
      explanation: "Na distribuição normal: ~68% entre ±1σ, ~95% entre ±2σ, ~99,7% entre ±3σ."
    },
    {
      id: "q4-3",
      quizId: "quiz-qm4",
      question: "O z-score de um valor que está 2 desvios padrão acima da média é:",
      options: [
        "0",
        "1",
        "2",
        "-2"
      ],
      correctIndex: 2,
      explanation: "Z-score = (X - μ) / σ. Se X está 2σ acima da média, z = 2."
    },
    {
      id: "q4-4",
      quizId: "quiz-qm4",
      question: "A distribuição lognormal é frequentemente usada para modelar:",
      options: [
        "Retornos aritméticos de curto prazo",
        "Preços de ativos",
        "Taxas de juros negativas",
        "Número de eventos por período"
      ],
      correctIndex: 1,
      explanation: "Preços de ativos são modelados como lognormal porque são sempre positivos e os log-retornos são normais."
    },
    {
      id: "q4-5",
      quizId: "quiz-qm4",
      question: "Uma distribuição t de Student é usada quando:",
      options: [
        "O tamanho da amostra é grande (n > 100)",
        "A variância populacional é conhecida",
        "A variância populacional é desconhecida e a amostra é pequena",
        "Os dados não são normalmente distribuídos"
      ],
      correctIndex: 2,
      explanation: "A distribuição t é usada quando σ é desconhecido e n é pequeno, tendo caudas mais pesadas que a normal."
    }
  ],
  "quiz-qm5": [
    {
      id: "q5-1",
      quizId: "quiz-qm5",
      question: "O Teorema do Limite Central afirma que:",
      options: [
        "Todas as amostras têm distribuição normal",
        "A média amostral converge para uma distribuição normal conforme n aumenta",
        "A variância da população é sempre conhecida",
        "Amostras pequenas são mais confiáveis"
      ],
      correctIndex: 1,
      explanation: "O TLC garante que a distribuição das médias amostrais se aproxima da normal conforme n → ∞."
    },
    {
      id: "q5-2",
      quizId: "quiz-qm5",
      question: "O erro padrão da média é calculado como:",
      options: [
        "σ × √n",
        "σ / √n",
        "σ / n",
        "σ × n"
      ],
      correctIndex: 1,
      explanation: "Erro padrão = σ / √n. Quanto maior a amostra, menor o erro padrão."
    },
    {
      id: "q5-3",
      quizId: "quiz-qm5",
      question: "Um intervalo de confiança de 95% significa que:",
      options: [
        "95% dos dados estão no intervalo",
        "Há 95% de chance de o parâmetro estar no intervalo",
        "95% dos intervalos construídos dessa forma conterão o parâmetro",
        "O erro é de 95%"
      ],
      correctIndex: 2,
      explanation: "A interpretação frequentista: 95% dos intervalos de confiança construídos conterão o verdadeiro parâmetro."
    },
    {
      id: "q5-4",
      quizId: "quiz-qm5",
      question: "Amostragem estratificada é mais eficiente quando:",
      options: [
        "A população é homogênea",
        "Existem subgrupos distintos na população",
        "O tamanho da amostra é muito pequeno",
        "Não há informação sobre a população"
      ],
      correctIndex: 1,
      explanation: "Amostragem estratificada reduz a variância quando existem subgrupos com características diferentes."
    },
    {
      id: "q5-5",
      quizId: "quiz-qm5",
      question: "O viés de seleção ocorre quando:",
      options: [
        "A amostra é muito grande",
        "O método de seleção favorece sistematicamente certos elementos",
        "A variância é desconhecida",
        "O intervalo de confiança é muito amplo"
      ],
      correctIndex: 1,
      explanation: "Viés de seleção: a amostra não representa a população devido ao processo de seleção."
    }
  ]
};

// Simulado questions - combines questions from multiple modules
export const SIMULADO_QUESTIONS: Record<string, QuizQuestion[]> = {
  "sim-partial": [
    // Mix of TVM and Probability questions for partial simulado
    ...QUIZ_QUESTIONS["quiz-qm1"].map(q => ({ ...q, quizId: "sim-partial" })),
    ...QUIZ_QUESTIONS["quiz-qm2"].map(q => ({ ...q, quizId: "sim-partial" })),
    ...QUIZ_QUESTIONS["quiz-qm3"].map(q => ({ ...q, quizId: "sim-partial" })),
    ...QUIZ_QUESTIONS["quiz-qm4"].map(q => ({ ...q, quizId: "sim-partial" })),
    ...QUIZ_QUESTIONS["quiz-qm5"].map(q => ({ ...q, quizId: "sim-partial" })),
  ],
  "sim-full": [
    // Full exam uses all available questions
    ...QUIZ_QUESTIONS["quiz-qm1"].map(q => ({ ...q, quizId: "sim-full" })),
    ...QUIZ_QUESTIONS["quiz-qm2"].map(q => ({ ...q, quizId: "sim-full" })),
    ...QUIZ_QUESTIONS["quiz-qm3"].map(q => ({ ...q, quizId: "sim-full" })),
    ...QUIZ_QUESTIONS["quiz-qm4"].map(q => ({ ...q, quizId: "sim-full" })),
    ...QUIZ_QUESTIONS["quiz-qm5"].map(q => ({ ...q, quizId: "sim-full" })),
  ]
};

// Get questions for a specific quiz or simulado
export function getQuizQuestions(quizId: string): QuizQuestion[] {
  return QUIZ_QUESTIONS[quizId] || SIMULADO_QUESTIONS[quizId] || [];
}

// Create a new quiz session
export function createQuizSession(quiz: Quiz): QuizSession {
  const questions = getQuizQuestions(quiz.id);
  return {
    quizId: quiz.id,
    moduleName: quiz.moduleName,
    questions,
    currentIndex: 0,
    answers: new Array(questions.length).fill(null),
    startedAt: Date.now()
  };
}

// Create a simulado session
export function createSimuladoSession(simulado: { id: string; name: string; durationMinutes: number }): QuizSession {
  const questions = getQuizQuestions(simulado.id);
  return {
    quizId: simulado.id,
    moduleName: simulado.name,
    questions,
    currentIndex: 0,
    answers: new Array(questions.length).fill(null),
    startedAt: Date.now()
  };
}

// Calculate quiz results
export function calculateQuizResult(session: QuizSession): QuizResult {
  const correctAnswers = session.questions.reduce((count, question, index) => {
    return count + (session.answers[index] === question.correctIndex ? 1 : 0);
  }, 0);

  const questionResults = session.questions.map((question, index) => ({
    questionId: question.id,
    selectedIndex: session.answers[index],
    correctIndex: question.correctIndex,
    isCorrect: session.answers[index] === question.correctIndex
  }));

  return {
    quizId: session.quizId,
    moduleName: session.moduleName,
    totalQuestions: session.questions.length,
    correctAnswers,
    score: Math.round((correctAnswers / session.questions.length) * 100),
    timeSpentSeconds: Math.round((Date.now() - session.startedAt) / 1000),
    questionResults
  };
}
