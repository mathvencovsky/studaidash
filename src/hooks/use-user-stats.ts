import { useQuery } from "@tanstack/react-query";
import { getUserStats } from "@/api/user-stats";

export const useUserStatsQuery = () =>
  useQuery({ queryKey: ["user-stats"], queryFn: getUserStats });
