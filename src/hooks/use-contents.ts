import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listContents, getContent, createContent, updateContent, deleteContent, type Content } from "@/api/contents";

export const useContentsQuery = () =>
  useQuery({ queryKey: ["contents"], queryFn: listContents });

export const useContentQuery = (id: string) =>
  useQuery({ queryKey: ["contents", id], queryFn: () => getContent(id), enabled: !!id });

export const useCreateContent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createContent,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contents"] }),
  });
};

export const useUpdateContent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string } & Partial<Content>) => updateContent(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contents"] }),
  });
};

export const useDeleteContent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteContent,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contents"] }),
  });
};
