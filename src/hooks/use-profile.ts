import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyProfile, updateProfile } from "@/api/profiles";

export const useProfileQuery = () =>
  useQuery({ queryKey: ["profile"], queryFn: getMyProfile });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
};
