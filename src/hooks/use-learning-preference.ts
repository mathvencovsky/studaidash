import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyLearningPreference, saveLearningPreference } from "@/api/learning-preferences";

export const useMyLearningPreference = () =>
  useQuery({ queryKey: ["learning-preference"], queryFn: getMyLearningPreference });

export const useSaveLearningPreference = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveLearningPreference,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["learning-preference"] }),
  });
};
