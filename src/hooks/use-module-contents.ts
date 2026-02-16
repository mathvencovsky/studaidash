import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getModuleContents, addContentToModule, removeContentFromModule, reorderModuleContents } from "@/api/module-contents";

export const useModuleContentsQuery = (moduleId: string) =>
  useQuery({
    queryKey: ["module-contents", moduleId],
    queryFn: () => getModuleContents(moduleId),
    enabled: !!moduleId,
  });

export const useAddContentToModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addContentToModule,
    onSuccess: (_, variables) =>
      qc.invalidateQueries({ queryKey: ["module-contents", variables.module_id] }),
  });
};

export const useRemoveContentFromModule = (moduleId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeContentFromModule,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["module-contents", moduleId] }),
  });
};

export const useReorderModuleContents = (moduleId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => reorderModuleContents(moduleId, orderedIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["module-contents", moduleId] }),
  });
};
