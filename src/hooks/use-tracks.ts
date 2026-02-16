import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTracks, getTrack, createTrack, updateTrack, deleteTrack, type Track } from "@/api/tracks";

export const useTracksQuery = () =>
  useQuery({ queryKey: ["tracks"], queryFn: getTracks });

export const useTrackQuery = (id: string) =>
  useQuery({ queryKey: ["tracks", id], queryFn: () => getTrack(id), enabled: !!id });

export const useCreateTrack = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTrack,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tracks"] }),
  });
};

export const useUpdateTrack = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string } & Partial<Track>) => updateTrack(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tracks"] }),
  });
};

export const useDeleteTrack = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTrack,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tracks"] }),
  });
};
