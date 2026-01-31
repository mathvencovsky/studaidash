import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute, PublicOnlyRoute } from "@/components/auth";
import { AppLayout } from "@/components/layout/AppLayout";

// Pages
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
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
import PesquisarTrilhas from "./pages/PesquisarTrilhas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public landing page - redirects to dashboard if authenticated */}
              <Route 
                path="/" 
                element={
                  <PublicOnlyRoute>
                    <Landing />
                  </PublicOnlyRoute>
                } 
              />

              {/* Fullscreen routes (protected) */}
              <Route 
                path="/quiz/:quizId" 
                element={
                  <ProtectedRoute>
                    <QuizSession />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/estudar" 
                element={
                  <ProtectedRoute>
                    <EstudarComIA />
                  </ProtectedRoute>
                } 
              />
              
              {/* Main app routes with layout (protected) */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Dashboard /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/objetivo" 
                element={
                  <ProtectedRoute>
                    <AppLayout><MeuObjetivo /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/trilha" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Trilha /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/trilha/visao-geral" 
                element={
                  <ProtectedRoute>
                    <AppLayout><TrailOverview /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/quizzes" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Quizzes /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/explorar" 
                element={
                  <ProtectedRoute>
                    <AppLayout><ExplorarTrilhas /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pesquisar" 
                element={
                  <ProtectedRoute>
                    <AppLayout><PesquisarTrilhas /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/explorar/:trackId" 
                element={
                  <ProtectedRoute>
                    <AppLayout><TrackDetail /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/relatorios" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Relatorios /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/engajamento" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Engajamento /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ranking" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Ranking /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/perfil" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Perfil /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/configuracoes" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Configuracoes /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/programas" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Programas /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/conteudos" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Conteudos /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sessoes" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Sessoes /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/calendario" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Calendario /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/metas" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Metas /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/revisoes" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Revisoes /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/roi-estudo" 
                element={
                  <ProtectedRoute>
                    <AppLayout><ROIEstudo /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/salvos" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Salvos /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
