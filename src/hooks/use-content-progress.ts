import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  toggleContentCompletion,
  getModuleContentProgress,
  getAllContentProgress,
} from "@/api/content-progress";

export const useContentProgressQuery = (moduleId: string) =>
  useQuery({
    queryKey: ["content-progress", moduleId],
    queryFn: () => getModuleContentProgress(moduleId),
    enabled: !!moduleId,
  });

export const useAllContentProgressQuery = () =>
  useQuery({ queryKey: ["content-progress"], queryFn: getAllContentProgress });

export const useToggleContentCompletion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleContentCompletion,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content-progress"] }),
  });
};
