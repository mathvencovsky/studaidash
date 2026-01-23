import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Trilha from "./pages/Trilha";
import TrailOverview from "./pages/TrailOverview";
import MeuObjetivo from "./pages/MeuObjetivo";
import Quizzes from "./pages/Quizzes";
import QuizSession from "./pages/QuizSession";
import EstudarComIA from "./pages/EstudarComIA";
import ExplorarTrilhas from "./pages/ExplorarTrilhas";
import TrackDetail from "./pages/TrackDetail";
import Relatorios from "./pages/Relatorios";
import Engajamento from "./pages/Engajamento";
import Ranking from "./pages/Ranking";
import Perfil from "./pages/Perfil";
import Configuracoes from "./pages/Configuracoes";
import Programas from "./pages/Programas";
import Conteudos from "./pages/Conteudos";
import Sessoes from "./pages/Sessoes";
import Calendario from "./pages/Calendario";
import Metas from "./pages/Metas";
import Revisoes from "./pages/Revisoes";
import ROIEstudo from "./pages/ROIEstudo";
import Salvos from "./pages/Salvos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
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
            <Route element={<AppLayout><ExplorarTrilhas /></AppLayout>} path="/explorar" />
            <Route element={<AppLayout><TrackDetail /></AppLayout>} path="/explorar/:trackId" />
            <Route element={<AppLayout><Relatorios /></AppLayout>} path="/relatorios" />
            <Route element={<AppLayout><Engajamento /></AppLayout>} path="/engajamento" />
            <Route element={<AppLayout><Ranking /></AppLayout>} path="/ranking" />
            <Route element={<AppLayout><Perfil /></AppLayout>} path="/perfil" />
            <Route element={<AppLayout><Configuracoes /></AppLayout>} path="/configuracoes" />
            
            {/* New pages */}
            <Route element={<AppLayout><Programas /></AppLayout>} path="/programas" />
            <Route element={<AppLayout><Conteudos /></AppLayout>} path="/conteudos" />
            <Route element={<AppLayout><Sessoes /></AppLayout>} path="/sessoes" />
            <Route element={<AppLayout><Calendario /></AppLayout>} path="/calendario" />
            <Route element={<AppLayout><Metas /></AppLayout>} path="/metas" />
            <Route element={<AppLayout><Revisoes /></AppLayout>} path="/revisoes" />
            <Route element={<AppLayout><ROIEstudo /></AppLayout>} path="/roi-estudo" />
            <Route element={<AppLayout><Salvos /></AppLayout>} path="/salvos" />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
