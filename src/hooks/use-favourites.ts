import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavouriteContents, toggleFavouriteContent, getFavouriteModules, toggleFavouriteModule } from "@/api/favourites";

export const useFavouriteContentsQuery = () =>
  useQuery({ queryKey: ["favourite-contents"], queryFn: getFavouriteContents });

export const useToggleFavouriteContent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleFavouriteContent,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favourite-contents"] }),
  });
};

export const useFavouriteModulesQuery = () =>
  useQuery({ queryKey: ["favourite-modules"], queryFn: getFavouriteModules });

export const useToggleFavouriteModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleFavouriteModule,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favourite-modules"] }),
  });
};
