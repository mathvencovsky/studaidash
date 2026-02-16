import { supabase } from "@/integrations/supabase/client";

export interface UserTrackProgress {
  id: string;
  user_id: string;
  track_id: string;
  start_date: string;
  completion_date: string | null;
  created_at: string;
  updated_at: string;
}

export const startTrack = async (trackId: string): Promise<UserTrackProgress> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Check existing
  const { data: existing } = await supabase
    .from("user_track_progress")
    .select("*")
    .eq("track_id", trackId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from("user_track_progress")
    .insert({ user_id: user.id, track_id: trackId })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getUserTrackProgress = async (trackId: string): Promise<UserTrackProgress | null> => {
  const { data, error } = await supabase
    .from("user_track_progress")
    .select("*")
    .eq("track_id", trackId)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const getAllUserTrackProgress = async (): Promise<UserTrackProgress[]> => {
  const { data, error } = await supabase.from("user_track_progress").select("*");
  if (error) throw error;
  return data ?? [];
};

export const completeTrack = async (trackId: string): Promise<UserTrackProgress> => {
  const { data, error } = await supabase
    .from("user_track_progress")
    .update({ completion_date: new Date().toISOString() })
    .eq("track_id", trackId)
    .select()
    .single();
  if (error) throw error;
  return data;
};
