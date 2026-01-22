// ============================================================================
// TRACKS CATALOG DATA - StudAI Trail Discovery System
// ============================================================================

export interface TrackModule {
  title: string;
  topics: string[];
  estimatedHours: number;
}

export interface Track {
  id: string;
  title: string;
  category: TrackCategory;
  level: TrackLevel;
  estimatedHours: number;
  summary: string;
  skills: string[];
  tags: string[];
  goalType: GoalType;
  badge?: "popular" | "new" | "recommended";
  rating: number;
  reviewsCount: number;
  modules: TrackModule[];
  instructor?: string;
  prerequisites?: string[];
  targetAudience?: string[];
  createdAt?: string;
}

export type TrackCategory = 
  | "Programação" 
  | "UX/UI" 
  | "Inglês" 
  | "Concursos" 
  | "Certificações" 
  | "Carreira";

export type TrackLevel = "Iniciante" | "Intermediário" | "Avançado";

export type GoalType = 
  | "carreira" 
  | "concurso" 
  | "certificacao" 
  | "idiomas" 
  | "continuo";

export type SortOption = "relevance" | "popular" | "recent" | "rating";

export interface TrackFilters {
  search: string;
  categories: TrackCategory[];
  levels: TrackLevel[];
  durationRange: "all" | "<10" | "10-30" | "30+";
  goalTypes: GoalType[];
  sortBy: SortOption;
}

// ============================================================================
// STORAGE HELPERS
// ============================================================================

const CATALOG_KEY = "studai_tracks_catalog";
const USER_TRACKS_KEY = "studai_user_tracks";

export function loadTracksCatalog(): Track[] {
  try {
    const stored = localStorage.getItem(CATALOG_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading tracks catalog:", error);
  }
  
  // Initialize with default catalog
  const defaultCatalog = getDefaultTracksCatalog();
  saveTracksCatalog(defaultCatalog);
  return defaultCatalog;
}

export function saveTracksCatalog(tracks: Track[]): void {
  try {
    localStorage.setItem(CATALOG_KEY, JSON.stringify(tracks));
  } catch (error) {
    console.error("Error saving tracks catalog:", error);
  }
}

// User's added tracks
export interface UserTrack {
  trackId: string;
  addedAt: string;
  goalId?: string;
  targetDate?: string;
  dailyMinutes?: number;
  status: "active" | "paused" | "completed";
}

export function loadUserTracks(): UserTrack[] {
  try {
    const stored = localStorage.getItem(USER_TRACKS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading user tracks:", error);
  }
  return [];
}

export function saveUserTracks(tracks: UserTrack[]): void {
  try {
    localStorage.setItem(USER_TRACKS_KEY, JSON.stringify(tracks));
  } catch (error) {
    console.error("Error saving user tracks:", error);
  }
}

export function addTrackToUserPlan(
  trackId: string, 
  goalId?: string,
  targetDate?: string,
  dailyMinutes?: number
): UserTrack {
  // TODO API: POST /api/user/tracks
  const userTracks = loadUserTracks();
  
  // Check if already added
  const existing = userTracks.find(t => t.trackId === trackId);
  if (existing) {
    return existing;
  }
  
  const newUserTrack: UserTrack = {
    trackId,
    addedAt: new Date().toISOString(),
    goalId,
    targetDate,
    dailyMinutes,
    status: "active"
  };
  
  userTracks.push(newUserTrack);
  saveUserTracks(userTracks);
  
  return newUserTrack;
}

export function isTrackInUserPlan(trackId: string): boolean {
  const userTracks = loadUserTracks();
  return userTracks.some(t => t.trackId === trackId);
}

// ============================================================================
// FILTERING & SEARCH
// ============================================================================

export function filterTracks(tracks: Track[], filters: TrackFilters): Track[] {
  let filtered = [...tracks];
  
  // Text search
  if (filters.search.trim()) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(track => 
      track.title.toLowerCase().includes(searchLower) ||
      track.summary.toLowerCase().includes(searchLower) ||
      track.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      track.skills.some(skill => skill.toLowerCase().includes(searchLower))
    );
  }
  
  // Category filter
  if (filters.categories.length > 0) {
    filtered = filtered.filter(track => 
      filters.categories.includes(track.category)
    );
  }
  
  // Level filter
  if (filters.levels.length > 0) {
    filtered = filtered.filter(track => 
      filters.levels.includes(track.level)
    );
  }
  
  // Duration filter
  if (filters.durationRange !== "all") {
    filtered = filtered.filter(track => {
      const hours = track.estimatedHours;
      switch (filters.durationRange) {
        case "<10": return hours < 10;
        case "10-30": return hours >= 10 && hours <= 30;
        case "30+": return hours > 30;
        default: return true;
      }
    });
  }
  
  // Goal type filter
  if (filters.goalTypes.length > 0) {
    filtered = filtered.filter(track => 
      filters.goalTypes.includes(track.goalType)
    );
  }
  
  // Sorting
  switch (filters.sortBy) {
    case "popular":
      filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
      break;
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "recent":
      filtered.sort((a, b) => {
        if (a.badge === "new" && b.badge !== "new") return -1;
        if (b.badge === "new" && a.badge !== "new") return 1;
        return 0;
      });
      break;
    case "relevance":
    default:
      // Relevance: popular + recommended first
      filtered.sort((a, b) => {
        const aScore = (a.badge === "popular" ? 2 : 0) + (a.badge === "recommended" ? 1 : 0) + (a.rating / 5);
        const bScore = (b.badge === "popular" ? 2 : 0) + (b.badge === "recommended" ? 1 : 0) + (b.rating / 5);
        return bScore - aScore;
      });
      break;
  }
  
  return filtered;
}

export function getDefaultFilters(): TrackFilters {
  return {
    search: "",
    categories: [],
    levels: [],
    durationRange: "all",
    goalTypes: [],
    sortBy: "relevance"
  };
}

// ============================================================================
// DEFAULT CATALOG DATA
// ============================================================================

function getDefaultTracksCatalog(): Track[] {
  return [
    {
      id: "dev-frontend-react",
      title: "Frontend com React",
      category: "Programação",
      level: "Intermediário",
      estimatedHours: 60,
      summary: "Aprenda React do zero até aplicações modernas usadas no mercado. Domine hooks, state management e boas práticas.",
      skills: ["HTML", "CSS", "JavaScript", "React", "TypeScript"],
      tags: ["frontend", "react", "web", "spa"],
      goalType: "carreira",
      badge: "popular",
      rating: 4.8,
      reviewsCount: 1240,
      instructor: "Maria Santos",
      prerequisites: ["JavaScript básico", "HTML/CSS"],
      targetAudience: ["Desenvolvedores iniciantes", "Profissionais migrando para frontend"],
      modules: [
        { title: "Fundamentos JavaScript Moderno", topics: ["ES6+", "Async/Await", "Modules"], estimatedHours: 10 },
        { title: "React Core", topics: ["JSX", "Components", "Props", "State"], estimatedHours: 15 },
        { title: "Hooks Avançados", topics: ["useEffect", "useContext", "Custom Hooks"], estimatedHours: 12 },
        { title: "State Management", topics: ["Context API", "Redux Basics"], estimatedHours: 10 },
        { title: "Projetos Práticos", topics: ["Dashboard", "E-commerce", "Deploy"], estimatedHours: 13 }
      ]
    },
    {
      id: "dev-fullstack-node",
      title: "Fullstack com Node.js",
      category: "Programação",
      level: "Intermediário",
      estimatedHours: 80,
      summary: "Torne-se desenvolvedor fullstack dominando Node.js, Express, bancos de dados e APIs RESTful.",
      skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs"],
      tags: ["backend", "nodejs", "fullstack", "api"],
      goalType: "carreira",
      badge: "recommended",
      rating: 4.7,
      reviewsCount: 890,
      instructor: "Carlos Oliveira",
      prerequisites: ["JavaScript intermediário"],
      targetAudience: ["Frontend devs querendo expandir", "Iniciantes ambiciosos"],
      modules: [
        { title: "Node.js Fundamentals", topics: ["Runtime", "Modules", "NPM"], estimatedHours: 12 },
        { title: "Express Framework", topics: ["Routing", "Middleware", "Error Handling"], estimatedHours: 15 },
        { title: "Databases", topics: ["MongoDB", "PostgreSQL", "ORMs"], estimatedHours: 18 },
        { title: "Authentication & Security", topics: ["JWT", "OAuth", "Best Practices"], estimatedHours: 15 },
        { title: "Deployment & DevOps", topics: ["Docker", "CI/CD", "Cloud"], estimatedHours: 20 }
      ]
    },
    {
      id: "dev-python-data",
      title: "Python para Análise de Dados",
      category: "Programação",
      level: "Iniciante",
      estimatedHours: 45,
      summary: "Aprenda Python focado em análise de dados com Pandas, NumPy e visualizações profissionais.",
      skills: ["Python", "Pandas", "NumPy", "Matplotlib", "Jupyter"],
      tags: ["python", "data", "analytics", "visualization"],
      goalType: "carreira",
      rating: 4.6,
      reviewsCount: 720,
      instructor: "Ana Paula Lima",
      prerequisites: ["Lógica de programação básica"],
      targetAudience: ["Analistas de negócios", "Profissionais de marketing", "Curiosos por dados"],
      modules: [
        { title: "Python Básico", topics: ["Sintaxe", "Estruturas de dados", "Funções"], estimatedHours: 12 },
        { title: "NumPy & Pandas", topics: ["Arrays", "DataFrames", "Manipulação"], estimatedHours: 15 },
        { title: "Visualização", topics: ["Matplotlib", "Seaborn", "Plotly"], estimatedHours: 10 },
        { title: "Projetos de Análise", topics: ["EDA", "Relatórios", "Dashboards"], estimatedHours: 8 }
      ]
    },
    {
      id: "ux-ui-design",
      title: "UX/UI Design do Zero",
      category: "UX/UI",
      level: "Iniciante",
      estimatedHours: 40,
      summary: "Fundamentos de UX Research, UI Design, Figma e criação de Design Systems profissionais.",
      skills: ["UX Research", "UI Design", "Figma", "Prototyping", "Design Systems"],
      tags: ["design", "produto", "figma", "ux", "ui"],
      goalType: "carreira",
      badge: "new",
      rating: 4.6,
      reviewsCount: 540,
      instructor: "Juliana Costa",
      prerequisites: ["Nenhum conhecimento prévio necessário"],
      targetAudience: ["Designers iniciantes", "Devs querendo entender design", "Product Managers"],
      modules: [
        { title: "UX Foundations", topics: ["Research", "Personas", "User Journeys"], estimatedHours: 12 },
        { title: "UI Fundamentals", topics: ["Layout", "Typography", "Color Theory"], estimatedHours: 10 },
        { title: "Figma Mastery", topics: ["Components", "Auto Layout", "Prototypes"], estimatedHours: 12 },
        { title: "Design Systems", topics: ["Tokens", "Documentation", "Handoff"], estimatedHours: 6 }
      ]
    },
    {
      id: "ux-product-design",
      title: "Product Design Avançado",
      category: "UX/UI",
      level: "Avançado",
      estimatedHours: 55,
      summary: "Metodologias avançadas de product design, métricas, A/B testing e design strategy.",
      skills: ["Product Thinking", "Metrics", "A/B Testing", "Design Strategy"],
      tags: ["product", "strategy", "metrics", "advanced"],
      goalType: "carreira",
      rating: 4.9,
      reviewsCount: 320,
      instructor: "Roberto Mendes",
      prerequisites: ["Experiência com UX/UI", "Conhecimento de Figma"],
      targetAudience: ["Designers sênior", "Product Designers", "Design Leads"],
      modules: [
        { title: "Product Thinking", topics: ["Discovery", "Validation", "OKRs"], estimatedHours: 15 },
        { title: "Design Metrics", topics: ["UX Metrics", "Analytics", "Dashboards"], estimatedHours: 12 },
        { title: "Experimentation", topics: ["A/B Testing", "Hypothesis", "Analysis"], estimatedHours: 14 },
        { title: "Design Leadership", topics: ["Strategy", "Team Building", "Stakeholders"], estimatedHours: 14 }
      ]
    },
    {
      id: "english-business",
      title: "Inglês para Negócios",
      category: "Inglês",
      level: "Intermediário",
      estimatedHours: 35,
      summary: "Comunicação profissional em reuniões, e-mails, apresentações e negociações em inglês.",
      skills: ["Business English", "Presentations", "Negotiations", "Writing"],
      tags: ["idiomas", "carreira", "business", "english"],
      goalType: "idiomas",
      badge: "recommended",
      rating: 4.7,
      reviewsCount: 860,
      instructor: "John Williams",
      prerequisites: ["Inglês intermediário (B1+)"],
      targetAudience: ["Profissionais corporativos", "Empreendedores", "Gestores"],
      modules: [
        { title: "Meetings & Calls", topics: ["Speaking", "Listening", "Idioms"], estimatedHours: 10 },
        { title: "Professional Emails", topics: ["Writing", "Tone", "Templates"], estimatedHours: 8 },
        { title: "Presentations", topics: ["Slides", "Storytelling", "Q&A"], estimatedHours: 10 },
        { title: "Negotiations", topics: ["Vocabulary", "Strategies", "Practice"], estimatedHours: 7 }
      ]
    },
    {
      id: "english-tech",
      title: "Inglês para Tech",
      category: "Inglês",
      level: "Intermediário",
      estimatedHours: 30,
      summary: "Inglês técnico para desenvolvedores, documentação, code reviews e comunicação em times globais.",
      skills: ["Technical English", "Documentation", "Code Reviews"],
      tags: ["idiomas", "tech", "developers", "english"],
      goalType: "idiomas",
      rating: 4.5,
      reviewsCount: 480,
      instructor: "Sarah Johnson",
      prerequisites: ["Inglês básico", "Conhecimento de programação"],
      targetAudience: ["Desenvolvedores", "Tech leads", "Profissionais de TI"],
      modules: [
        { title: "Technical Vocabulary", topics: ["Programming terms", "Documentation"], estimatedHours: 8 },
        { title: "Code Reviews", topics: ["Feedback", "Pull requests", "Comments"], estimatedHours: 8 },
        { title: "Team Communication", topics: ["Daily standups", "Slack", "Meetings"], estimatedHours: 8 },
        { title: "Technical Writing", topics: ["READMEs", "Specs", "Reports"], estimatedHours: 6 }
      ]
    },
    {
      id: "concurso-bacen",
      title: "BACEN — Área Econômica",
      category: "Concursos",
      level: "Avançado",
      estimatedHours: 300,
      summary: "Preparação completa para o concurso do Banco Central do Brasil. Cobertura integral do edital.",
      skills: ["Economia", "RLM", "Português", "Direito", "Conhecimentos Bancários"],
      tags: ["concurso", "bacen", "economia", "federal"],
      goalType: "concurso",
      badge: "popular",
      rating: 4.9,
      reviewsCount: 210,
      instructor: "Prof. André Vieira",
      prerequisites: ["Nível superior em Economia ou áreas afins"],
      targetAudience: ["Candidatos ao BACEN", "Concurseiros de área fiscal"],
      modules: [
        { title: "Economia", topics: ["Macroeconomia", "Microeconomia", "Economia Brasileira"], estimatedHours: 120 },
        { title: "Português", topics: ["Gramática", "Interpretação", "Redação"], estimatedHours: 60 },
        { title: "RLM", topics: ["Lógica", "Matemática", "Estatística"], estimatedHours: 50 },
        { title: "Direito", topics: ["Constitucional", "Administrativo"], estimatedHours: 40 },
        { title: "Conhecimentos Bancários", topics: ["SFN", "Política Monetária"], estimatedHours: 30 }
      ]
    },
    {
      id: "concurso-receita",
      title: "Auditor Fiscal da Receita Federal",
      category: "Concursos",
      level: "Avançado",
      estimatedHours: 400,
      summary: "Preparação completa para AFRFB com foco em legislação tributária e contabilidade.",
      skills: ["Contabilidade", "Legislação Tributária", "Direito", "Auditoria"],
      tags: ["concurso", "receita", "fiscal", "federal"],
      goalType: "concurso",
      rating: 4.8,
      reviewsCount: 180,
      instructor: "Prof. Ricardo Santos",
      prerequisites: ["Nível superior"],
      targetAudience: ["Candidatos à Receita Federal", "Concurseiros de área fiscal"],
      modules: [
        { title: "Contabilidade", topics: ["Geral", "Avançada", "Custos"], estimatedHours: 100 },
        { title: "Legislação Tributária", topics: ["CTN", "Tributos Federais"], estimatedHours: 120 },
        { title: "Direito", topics: ["Constitucional", "Administrativo", "Penal"], estimatedHours: 80 },
        { title: "Auditoria", topics: ["Normas", "Procedimentos", "Relatórios"], estimatedHours: 50 },
        { title: "Comércio Internacional", topics: ["Legislação Aduaneira"], estimatedHours: 50 }
      ]
    },
    {
      id: "cfa-level-1",
      title: "CFA Level I",
      category: "Certificações",
      level: "Avançado",
      estimatedHours: 300,
      summary: "Trilha completa para aprovação no CFA Level I. Cobertura de todos os tópicos do currículo oficial.",
      skills: ["Ethics", "Quantitative Methods", "Economics", "FRA", "Corporate Finance"],
      tags: ["cfa", "finanças", "investimentos", "certificação"],
      goalType: "certificacao",
      badge: "recommended",
      rating: 4.9,
      reviewsCount: 430,
      instructor: "Prof. James Mitchell",
      prerequisites: ["Graduação completa", "Inglês avançado"],
      targetAudience: ["Analistas financeiros", "Profissionais de investimento"],
      modules: [
        { title: "Ethics & Professional Standards", topics: ["Code of Ethics", "Standards of Practice"], estimatedHours: 40 },
        { title: "Quantitative Methods", topics: ["Time Value of Money", "Statistics", "Probability"], estimatedHours: 50 },
        { title: "Economics", topics: ["Micro", "Macro", "International Trade"], estimatedHours: 40 },
        { title: "Financial Reporting & Analysis", topics: ["Financial Statements", "Ratios", "Inventories"], estimatedHours: 80 },
        { title: "Corporate Finance", topics: ["Capital Budgeting", "Cost of Capital", "Leverage"], estimatedHours: 40 },
        { title: "Equity & Fixed Income", topics: ["Valuation", "Bond Pricing", "Risk"], estimatedHours: 50 }
      ]
    },
    {
      id: "pmp-certification",
      title: "PMP — Project Management Professional",
      category: "Certificações",
      level: "Avançado",
      estimatedHours: 60,
      summary: "Preparação completa para certificação PMP do PMI com foco no novo exame baseado em metodologias ágeis e preditivas.",
      skills: ["Project Management", "Agile", "Risk Management", "Stakeholder Management"],
      tags: ["pmp", "gestão", "projetos", "pmi"],
      goalType: "certificacao",
      rating: 4.7,
      reviewsCount: 340,
      instructor: "Patricia Almeida, PMP",
      prerequisites: ["Experiência em gestão de projetos"],
      targetAudience: ["Gerentes de projeto", "Coordenadores", "Líderes técnicos"],
      modules: [
        { title: "People Domain", topics: ["Leadership", "Team Building", "Conflict Management"], estimatedHours: 15 },
        { title: "Process Domain", topics: ["Planning", "Executing", "Monitoring"], estimatedHours: 20 },
        { title: "Business Environment", topics: ["Benefits", "Compliance", "Changes"], estimatedHours: 10 },
        { title: "Agile Practices", topics: ["Scrum", "Kanban", "Hybrid"], estimatedHours: 15 }
      ]
    },
    {
      id: "aws-solutions-architect",
      title: "AWS Solutions Architect Associate",
      category: "Certificações",
      level: "Intermediário",
      estimatedHours: 50,
      summary: "Prepare-se para a certificação AWS SAA-C03 com laboratórios práticos e simulados.",
      skills: ["AWS", "Cloud Architecture", "Security", "Networking"],
      tags: ["aws", "cloud", "devops", "certificação"],
      goalType: "certificacao",
      badge: "new",
      rating: 4.8,
      reviewsCount: 520,
      instructor: "Fernando Tech",
      prerequisites: ["Conhecimentos básicos de TI"],
      targetAudience: ["DevOps", "SysAdmins", "Desenvolvedores cloud"],
      modules: [
        { title: "AWS Fundamentals", topics: ["IAM", "VPC", "EC2", "S3"], estimatedHours: 15 },
        { title: "High Availability", topics: ["ELB", "Auto Scaling", "RDS"], estimatedHours: 12 },
        { title: "Security & Compliance", topics: ["KMS", "WAF", "Shield"], estimatedHours: 10 },
        { title: "Cost Optimization", topics: ["Pricing", "Reserved", "Spot"], estimatedHours: 8 },
        { title: "Exam Preparation", topics: ["Simulados", "Dicas", "Revisão"], estimatedHours: 5 }
      ]
    },
    {
      id: "career-transition-tech",
      title: "Transição de Carreira para Tech",
      category: "Carreira",
      level: "Iniciante",
      estimatedHours: 25,
      summary: "Guia completo para profissionais de outras áreas que desejam migrar para tecnologia.",
      skills: ["Career Planning", "Tech Landscape", "Networking", "Portfolio"],
      tags: ["carreira", "transição", "tech", "iniciante"],
      goalType: "carreira",
      rating: 4.5,
      reviewsCount: 680,
      instructor: "Camila Rodrigues",
      prerequisites: ["Nenhum conhecimento técnico prévio"],
      targetAudience: ["Profissionais em transição", "Recém-formados", "Curiosos por tech"],
      modules: [
        { title: "Panorama Tech", topics: ["Áreas", "Salários", "Tendências"], estimatedHours: 5 },
        { title: "Escolhendo sua Área", topics: ["Dev", "Data", "Design", "Product"], estimatedHours: 5 },
        { title: "Primeiros Passos", topics: ["Cursos", "Projetos", "Comunidade"], estimatedHours: 8 },
        { title: "Mercado de Trabalho", topics: ["LinkedIn", "Portfólio", "Entrevistas"], estimatedHours: 7 }
      ]
    },
    {
      id: "career-data-analyst",
      title: "Data Analyst Júnior",
      category: "Carreira",
      level: "Iniciante",
      estimatedHours: 70,
      summary: "Trilha completa para se tornar Data Analyst: SQL, Excel avançado, visualização e storytelling com dados.",
      skills: ["SQL", "Excel", "Power BI", "Data Storytelling"],
      tags: ["dados", "análise", "bi", "carreira"],
      goalType: "carreira",
      badge: "popular",
      rating: 4.7,
      reviewsCount: 920,
      instructor: "Lucas Data",
      prerequisites: ["Excel básico"],
      targetAudience: ["Analistas de negócios", "Estagiários", "Profissionais administrativos"],
      modules: [
        { title: "Excel Avançado", topics: ["Fórmulas", "Tabelas dinâmicas", "Macros"], estimatedHours: 15 },
        { title: "SQL Fundamentals", topics: ["SELECT", "JOINs", "Agregações"], estimatedHours: 20 },
        { title: "Power BI", topics: ["Dashboards", "DAX", "Publicação"], estimatedHours: 20 },
        { title: "Data Storytelling", topics: ["Visualização", "Narrativa", "Apresentação"], estimatedHours: 15 }
      ]
    }
  ];
}
