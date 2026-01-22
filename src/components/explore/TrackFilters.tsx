import { useState } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  TrackFilters as FiltersType, 
  TrackCategory, 
  TrackLevel, 
  GoalType,
  SortOption 
} from "@/data/tracks-catalog-data";

interface TrackFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
  resultCount: number;
}

const categories: TrackCategory[] = [
  "Programação",
  "UX/UI",
  "Inglês",
  "Concursos",
  "Certificações",
  "Carreira",
];

const levels: TrackLevel[] = ["Iniciante", "Intermediário", "Avançado"];

const goalTypes: { value: GoalType; label: string }[] = [
  { value: "carreira", label: "Carreira" },
  { value: "concurso", label: "Concurso" },
  { value: "certificacao", label: "Certificação" },
  { value: "idiomas", label: "Idiomas" },
  { value: "continuo", label: "Aprendizado contínuo" },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevância" },
  { value: "popular", label: "Mais populares" },
  { value: "rating", label: "Melhor avaliados" },
  { value: "recent", label: "Mais recentes" },
];

const durationOptions = [
  { value: "all", label: "Qualquer duração" },
  { value: "<10", label: "Menos de 10h" },
  { value: "10-30", label: "10 a 30h" },
  { value: "30+", label: "Mais de 30h" },
];

export function TrackFilters({ filters, onFiltersChange, resultCount }: TrackFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const activeFiltersCount = 
    filters.categories.length + 
    filters.levels.length + 
    filters.goalTypes.length + 
    (filters.durationRange !== "all" ? 1 : 0);

  const updateFilter = <K extends keyof FiltersType>(key: K, value: FiltersType[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = <T extends string>(
    key: "categories" | "levels" | "goalTypes",
    value: T
  ) => {
    const current = filters[key] as T[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, updated as FiltersType[typeof key]);
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      categories: [],
      levels: [],
      durationRange: "all",
      goalTypes: [],
      sortBy: "relevance",
    });
  };

  const FilterSection = ({ 
    title, 
    children,
    defaultOpen = true 
  }: { 
    title: string; 
    children: React.ReactNode;
    defaultOpen?: boolean;
  }) => (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
        {title}
        <ChevronDown className="w-4 h-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-4 space-y-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );

  const FiltersContent = () => (
    <div className="space-y-4">
      {/* Categories */}
      <FilterSection title="Categoria">
        {categories.map((category) => (
          <label
            key={category}
            className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded-md transition-colors"
          >
            <Checkbox
              checked={filters.categories.includes(category)}
              onCheckedChange={() => toggleArrayFilter("categories", category)}
            />
            <span className="text-sm">{category}</span>
          </label>
        ))}
      </FilterSection>

      {/* Levels */}
      <FilterSection title="Nível">
        {levels.map((level) => (
          <label
            key={level}
            className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded-md transition-colors"
          >
            <Checkbox
              checked={filters.levels.includes(level)}
              onCheckedChange={() => toggleArrayFilter("levels", level)}
            />
            <span className="text-sm">{level}</span>
          </label>
        ))}
      </FilterSection>

      {/* Duration */}
      <FilterSection title="Duração">
        {durationOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded-md transition-colors"
          >
            <Checkbox
              checked={filters.durationRange === option.value}
              onCheckedChange={() => updateFilter("durationRange", option.value as FiltersType["durationRange"])}
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </FilterSection>

      {/* Goal Types */}
      <FilterSection title="Objetivo">
        {goalTypes.map((goal) => (
          <label
            key={goal.value}
            className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded-md transition-colors"
          >
            <Checkbox
              checked={filters.goalTypes.includes(goal.value)}
              onCheckedChange={() => toggleArrayFilter("goalTypes", goal.value)}
            />
            <span className="text-sm">{goal.label}</span>
          </label>
        ))}
      </FilterSection>

      {activeFiltersCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="w-full text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4 mr-2" />
          Limpar filtros
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar trilhas, habilidades, tags..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10 bg-background"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) => updateFilter("sortBy", value as SortOption)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Mobile Filters Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden relative">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FiltersContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters Pills */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.map((cat) => (
            <Badge
              key={cat}
              variant="secondary"
              className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={() => toggleArrayFilter("categories", cat)}
            >
              {cat}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
          {filters.levels.map((level) => (
            <Badge
              key={level}
              variant="secondary"
              className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={() => toggleArrayFilter("levels", level)}
            >
              {level}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
          {filters.goalTypes.map((goal) => (
            <Badge
              key={goal}
              variant="secondary"
              className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={() => toggleArrayFilter("goalTypes", goal)}
            >
              {goalTypes.find(g => g.value === goal)?.label}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
          {filters.durationRange !== "all" && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={() => updateFilter("durationRange", "all")}
            >
              {durationOptions.find(d => d.value === filters.durationRange)?.label}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {resultCount} {resultCount === 1 ? "trilha encontrada" : "trilhas encontradas"}
      </p>

      {/* Desktop Sidebar Filters - rendered separately in page */}
    </div>
  );
}

// Export desktop sidebar filters component
export function DesktopFilters({ filters, onFiltersChange }: Omit<TrackFiltersProps, "resultCount">) {
  const activeFiltersCount = 
    filters.categories.length + 
    filters.levels.length + 
    filters.goalTypes.length + 
    (filters.durationRange !== "all" ? 1 : 0);

  const updateFilter = <K extends keyof FiltersType>(key: K, value: FiltersType[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = <T extends string>(
    key: "categories" | "levels" | "goalTypes",
    value: T
  ) => {
    const current = filters[key] as T[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, updated as FiltersType[typeof key]);
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      categories: [],
      levels: [],
      durationRange: "all",
      goalTypes: [],
      sortBy: "relevance",
    });
  };

  const FilterSection = ({ 
    title, 
    children,
    defaultOpen = true 
  }: { 
    title: string; 
    children: React.ReactNode;
    defaultOpen?: boolean;
  }) => (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
        {title}
        <ChevronDown className="w-4 h-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-4 space-y-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="space-y-2 p-4 bg-card rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">Filtros</h3>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Limpar
          </Button>
        )}
      </div>

      {/* Categories */}
      <FilterSection title="Categoria">
        {categories.map((category) => (
          <label
            key={category}
            className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded-md transition-colors"
          >
            <Checkbox
              checked={filters.categories.includes(category)}
              onCheckedChange={() => toggleArrayFilter("categories", category)}
            />
            <span className="text-sm">{category}</span>
          </label>
        ))}
      </FilterSection>

      {/* Levels */}
      <FilterSection title="Nível">
        {levels.map((level) => (
          <label
            key={level}
            className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded-md transition-colors"
          >
            <Checkbox
              checked={filters.levels.includes(level)}
              onCheckedChange={() => toggleArrayFilter("levels", level)}
            />
            <span className="text-sm">{level}</span>
          </label>
        ))}
      </FilterSection>

      {/* Duration */}
      <FilterSection title="Duração">
        {durationOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded-md transition-colors"
          >
            <Checkbox
              checked={filters.durationRange === option.value}
              onCheckedChange={() => updateFilter("durationRange", option.value as FiltersType["durationRange"])}
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </FilterSection>

      {/* Goal Types */}
      <FilterSection title="Objetivo">
        {goalTypes.map((goal) => (
          <label
            key={goal.value}
            className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded-md transition-colors"
          >
            <Checkbox
              checked={filters.goalTypes.includes(goal.value)}
              onCheckedChange={() => toggleArrayFilter("goalTypes", goal.value)}
            />
            <span className="text-sm">{goal.label}</span>
          </label>
        ))}
      </FilterSection>
    </div>
  );
}
