import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { submitFeedback, getUserFeedback } from "@/api/feedback";

export const useUserFeedbackQuery = () =>
  useQuery({ queryKey: ["feedback"], queryFn: getUserFeedback });

export const useSubmitFeedback = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: submitFeedback,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feedback"] }),
  });
};
