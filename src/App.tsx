import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Trilha from "./pages/Trilha";
import TrailOverview from "./pages/TrailOverview";
import MeuObjetivo from "./pages/MeuObjetivo";
import Quizzes from "./pages/Quizzes";
import QuizSession from "./pages/QuizSession";
import EstudarComIA from "./pages/EstudarComIA";
import Relatorios from "./pages/Relatorios";
import Engajamento from "./pages/Engajamento";
import Ranking from "./pages/Ranking";
import Perfil from "./pages/Perfil";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Fullscreen routes */}
          <Route path="/quiz/:quizId" element={<QuizSession />} />
          <Route path="/estudar" element={<EstudarComIA />} />
          
          {/* Main app routes with layout */}
          <Route element={<AppLayout><Index /></AppLayout>} path="/" />
          <Route element={<AppLayout><MeuObjetivo /></AppLayout>} path="/objetivo" />
          <Route element={<AppLayout><Trilha /></AppLayout>} path="/trilha" />
          <Route element={<AppLayout><TrailOverview /></AppLayout>} path="/trilha/visao-geral" />
          <Route element={<AppLayout><Quizzes /></AppLayout>} path="/quizzes" />
          <Route element={<AppLayout><Relatorios /></AppLayout>} path="/relatorios" />
          <Route element={<AppLayout><Engajamento /></AppLayout>} path="/engajamento" />
          <Route element={<AppLayout><Ranking /></AppLayout>} path="/ranking" />
          <Route element={<AppLayout><Perfil /></AppLayout>} path="/perfil" />
          <Route element={<AppLayout><Configuracoes /></AppLayout>} path="/configuracoes" />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
