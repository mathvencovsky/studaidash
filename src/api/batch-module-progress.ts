import { supabase } from "@/integrations/supabase/client";

export interface ModuleProgressInfo {
  moduleId: string;
  completedCount: number;
  totalCount: number;
  percentage: number;
  status: "not_started" | "in_progress" | "completed";
}

export type ModuleProgressMap = Record<string, ModuleProgressInfo>;

/**
 * Fetches progress for multiple modules in a single batch operation.
 * Mirrors the external repo's getBatchModuleProgress logic.
 */
export const getBatchModuleProgress = async (
  moduleIds: string[]
): Promise<ModuleProgressMap> => {
  if (moduleIds.length === 0) return {};

  const [contentProgressRes, moduleContentsRes] = await Promise.all([
    supabase
      .from("user_content_progress")
      .select("module_id, content_id, is_completed")
      .in("module_id", moduleIds),
    supabase
      .from("module_contents")
      .select("module_id, content_id")
      .in("module_id", moduleIds),
  ]);

  const contentProgress = contentProgressRes.data ?? [];
  const moduleContents = moduleContentsRes.data ?? [];

  // Count total contents per module
  const totalByModule = new Map<string, number>();
  const moduleContentIds = new Map<string, Set<string>>();
  for (const mc of moduleContents) {
    totalByModule.set(mc.module_id, (totalByModule.get(mc.module_id) ?? 0) + 1);
    const ids = moduleContentIds.get(mc.module_id) ?? new Set();
    ids.add(mc.content_id);
    moduleContentIds.set(mc.module_id, ids);
  }

  // Count completed contents per module (only those that belong to the module)
  const completedByModule = new Map<string, number>();
  for (const cp of contentProgress) {
    if (!cp.is_completed) continue;
    const validIds = moduleContentIds.get(cp.module_id);
    if (!validIds?.has(cp.content_id)) continue;
    completedByModule.set(
      cp.module_id,
      (completedByModule.get(cp.module_id) ?? 0) + 1
    );
  }

  const result: ModuleProgressMap = {};
  for (const moduleId of moduleIds) {
    const total = totalByModule.get(moduleId) ?? 0;
    const completed = completedByModule.get(moduleId) ?? 0;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    let status: ModuleProgressInfo["status"] = "not_started";
    if (completed > 0 && completed < total) status = "in_progress";
    else if (total > 0 && completed >= total) status = "completed";

    result[moduleId] = { moduleId, completedCount: completed, totalCount: total, percentage, status };
  }

  return result;
};
