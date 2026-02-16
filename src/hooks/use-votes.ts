import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { castVote, getUserVote, getModuleVotes } from "@/api/votes";

export const useModuleVotesQuery = (moduleId: string) =>
  useQuery({
    queryKey: ["votes", moduleId],
    queryFn: () => getModuleVotes(moduleId),
    enabled: !!moduleId,
  });

export const useUserVoteQuery = (moduleId: string) =>
  useQuery({
    queryKey: ["votes", moduleId, "user"],
    queryFn: () => getUserVote(moduleId),
    enabled: !!moduleId,
  });

export const useCastVote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ moduleId, value }: { moduleId: string; value: 1 | -1 }) =>
      castVote(moduleId, value),
    onSuccess: (_, { moduleId }) => {
      qc.invalidateQueries({ queryKey: ["votes", moduleId] });
      qc.invalidateQueries({ queryKey: ["modules"] });
    },
  });
};
