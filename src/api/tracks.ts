import { supabase } from "@/integrations/supabase/client";

export interface Track {
  id: string;
  title: string;
  description: string;
  root_module_id: string;
  parent_by_module_id: Record<string, string>;
  position_by_module_id: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export const getTracks = async (): Promise<Track[]> => {
  const { data, error } = await supabase.from("tracks").select("*");
  if (error) throw error;
  return (data ?? []).map((t) => ({
    ...t,
    parent_by_module_id: (t.parent_by_module_id as Record<string, string>) ?? {},
    position_by_module_id: (t.position_by_module_id as Record<string, string>) ?? {},
  }));
};

export const getTrack = async (id: string): Promise<Track | null> => {
  const { data, error } = await supabase.from("tracks").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    ...data,
    parent_by_module_id: (data.parent_by_module_id as Record<string, string>) ?? {},
    position_by_module_id: (data.position_by_module_id as Record<string, string>) ?? {},
  };
};

export const createTrack = async (input: {
  title: string;
  description: string;
  root_module_id: string;
  parent_by_module_id: Record<string, string>;
  position_by_module_id?: Record<string, string>;
}): Promise<Track> => {
  const { data, error } = await supabase.from("tracks").insert(input).select().single();
  if (error) throw error;
  return {
    ...data,
    parent_by_module_id: (data.parent_by_module_id as Record<string, string>) ?? {},
    position_by_module_id: (data.position_by_module_id as Record<string, string>) ?? {},
  };
};

export const updateTrack = async (
  id: string,
  input: Partial<Omit<Track, "id" | "created_at" | "updated_at">>
): Promise<Track> => {
  const { data, error } = await supabase.from("tracks").update(input).eq("id", id).select().single();
  if (error) throw error;
  return {
    ...data,
    parent_by_module_id: (data.parent_by_module_id as Record<string, string>) ?? {},
    position_by_module_id: (data.position_by_module_id as Record<string, string>) ?? {},
  };
};

export const deleteTrack = async (id: string): Promise<void> => {
  const { error } = await supabase.from("tracks").delete().eq("id", id);
  if (error) throw error;
};
