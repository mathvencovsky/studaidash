import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  startTrack,
  getUserTrackProgress,
  getAllUserTrackProgress,
  completeTrack,
} from "@/api/track-progress";

export const useTrackProgressQuery = (trackId: string) =>
  useQuery({
    queryKey: ["track-progress", trackId],
    queryFn: () => getUserTrackProgress(trackId),
    enabled: !!trackId,
  });

export const useAllTrackProgressQuery = () =>
  useQuery({ queryKey: ["track-progress"], queryFn: getAllUserTrackProgress });

export const useStartTrack = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: startTrack,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["track-progress"] }),
  });
};

export const useCompleteTrack = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: completeTrack,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["track-progress"] }),
  });
};
