import { Search, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type: "no-results" | "loading" | "error";
  onClearFilters?: () => void;
}

export function EmptyState({ type, onClearFilters }: EmptyStateProps) {
  if (type === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-pulse">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <p className="text-muted-foreground">Carregando trilhas...</p>
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Erro ao carregar trilhas</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          Não foi possível carregar o catálogo de trilhas. Tente recarregar a página.
        </p>
        <Button onClick={() => window.location.reload()}>
          Recarregar página
        </Button>
      </div>
    );
  }

  // No results
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg mb-2">Nenhuma trilha encontrada</h3>
      <p className="text-muted-foreground mb-4 max-w-md">
        Não encontramos trilhas com os filtros selecionados. Tente ajustar seus critérios de busca ou explorar outras categorias.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        {onClearFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            Limpar filtros
          </Button>
        )}
        <Button className="gap-2">
          <Sparkles className="w-4 h-4" />
          Sugerir nova trilha
        </Button>
      </div>
    </div>
  );
}
