import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getModules, getModule, createModule, updateModule, deleteModule, getModuleSuggestions } from "@/api/modules";

export const useModulesQuery = () =>
  useQuery({ queryKey: ["modules"], queryFn: getModules });

export const useModuleQuery = (id: string) =>
  useQuery({ queryKey: ["modules", id], queryFn: () => getModule(id), enabled: !!id });

export const useCreateModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createModule,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["modules"] }),
  });
};

export const useUpdateModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string; title?: string; description?: string }) =>
      updateModule(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["modules"] }),
  });
};

export const useDeleteModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteModule,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["modules"] }),
  });
};

export const useModuleSuggestions = (query: string) =>
  useQuery({
    queryKey: ["module-suggestions", query],
    queryFn: () => getModuleSuggestions(query),
    enabled: query.length >= 2,
  });
