import { supabase } from "@/integrations/supabase/client";

export interface UserStats {
  totalHoursStudied: number;
  totalModulesStarted: number;
  totalModulesCompleted: number;
  totalContentsCompleted: number;
  totalTracksStarted: number;
  totalTracksCompleted: number;
  totalDaysLoggedIn: number;
  streak: number;
}

export const getUserStats = async (): Promise<UserStats> => {
  const [moduleProgress, contentProgress, trackProgress, loginDays, allContentProgress] =
    await Promise.all([
      supabase.from("user_module_progress").select("id, completion_date"),
      supabase
        .from("user_content_progress")
        .select("id, is_completed, content_id")
        .eq("is_completed", true),
      supabase.from("user_track_progress").select("id, completion_date"),
      supabase
        .from("user_login_days")
        .select("date")
        .order("date", { ascending: false })
        .limit(365),
      supabase
        .from("user_content_progress")
        .select("content_id")
        .eq("is_completed", true),
    ]);

  // Calculate totalHoursStudied from completed content durations
  const completedContentIds = [
    ...new Set((allContentProgress.data ?? []).map((p) => p.content_id)),
  ];
  let totalSeconds = 0;
  if (completedContentIds.length > 0) {
    const { data: contents } = await supabase
      .from("contents")
      .select("duration_in_seconds")
      .in("id", completedContentIds);
    for (const c of contents ?? []) {
      totalSeconds += c.duration_in_seconds ?? 0;
    }
  }

  // Calculate streak
  let streak = 0;
  const dates = loginDays.data ?? [];
  if (dates.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstDate = new Date(dates[0].date);
    firstDate.setHours(0, 0, 0, 0);
    const diffFromToday = Math.floor(
      (today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffFromToday <= 1) {
      streak = 1;
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1].date);
        const curr = new Date(dates[i].date);
        prev.setHours(0, 0, 0, 0);
        curr.setHours(0, 0, 0, 0);
        const diff = Math.floor(
          (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diff === 1) streak++;
        else break;
      }
    }
  }

  const modules = moduleProgress.data ?? [];
  const tracks = trackProgress.data ?? [];

  return {
    totalHoursStudied: Math.round((totalSeconds / 3600) * 10) / 10,
    totalModulesStarted: modules.length,
    totalModulesCompleted: modules.filter((m) => m.completion_date).length,
    totalContentsCompleted: (contentProgress.data ?? []).length,
    totalTracksStarted: tracks.length,
    totalTracksCompleted: tracks.filter((t) => t.completion_date).length,
    totalDaysLoggedIn: dates.length,
    streak,
  };
};
