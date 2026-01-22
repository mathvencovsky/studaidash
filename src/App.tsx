import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Trilha from "./pages/Trilha";
import Quizzes from "./pages/Quizzes";
import QuizSession from "./pages/QuizSession";
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
          {/* Quiz session runs outside AppLayout for fullscreen experience */}
          <Route path="/quiz/:quizId" element={<QuizSession />} />
          
          {/* Main app routes with layout */}
          <Route element={<AppLayout><Index /></AppLayout>} path="/" />
          <Route element={<AppLayout><Trilha /></AppLayout>} path="/trilha" />
          <Route element={<AppLayout><Quizzes /></AppLayout>} path="/quizzes" />
          <Route element={<AppLayout><Ranking /></AppLayout>} path="/ranking" />
          <Route element={<AppLayout><Perfil /></AppLayout>} path="/perfil" />
          <Route element={<AppLayout><Configuracoes /></AppLayout>} path="/configuracoes" />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
