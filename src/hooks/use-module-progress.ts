import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  startModule,
  getUserModuleProgress,
  getLastStartedModule,
  getAllUserModuleProgress,
  completeModule,
} from "@/api/module-progress";

export const useModuleProgressQuery = (moduleId: string) =>
  useQuery({
    queryKey: ["module-progress", moduleId],
    queryFn: () => getUserModuleProgress(moduleId),
    enabled: !!moduleId,
  });

export const useAllModuleProgressQuery = () =>
  useQuery({ queryKey: ["module-progress"], queryFn: getAllUserModuleProgress });

export const useLastStartedModule = () =>
  useQuery({ queryKey: ["module-progress", "last"], queryFn: getLastStartedModule });

export const useStartModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: startModule,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["module-progress"] }),
  });
};

export const useCompleteModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: completeModule,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["module-progress"] }),
  });
};
