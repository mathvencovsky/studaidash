import { useQuery } from "@tanstack/react-query";
import { getBatchModuleProgress, type ModuleProgressMap } from "@/api/batch-module-progress";

export const useBatchModuleProgress = (moduleIds: string[]) =>
  useQuery<ModuleProgressMap>({
    queryKey: ["batch-module-progress", moduleIds],
    queryFn: () => getBatchModuleProgress(moduleIds),
    enabled: moduleIds.length > 0,
  });
