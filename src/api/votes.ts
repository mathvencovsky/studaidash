import { supabase } from "@/integrations/supabase/client";

export interface Vote {
  id: string;
  user_id: string;
  module_id: string;
  value: number; // 1 or -1
  created_at: string;
  updated_at: string;
}

export const getModuleVotes = async (moduleId: string): Promise<Vote[]> => {
  const { data, error } = await supabase.from("votes").select("*").eq("module_id", moduleId);
  if (error) throw error;
  return data ?? [];
};

export const getUserVote = async (moduleId: string): Promise<Vote | null> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("module_id", moduleId)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const castVote = async (moduleId: string, value: 1 | -1): Promise<Vote> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("votes")
    .select("*")
    .eq("module_id", moduleId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    if (existing.value === value) {
      // Remove vote if same value
      await supabase.from("votes").delete().eq("id", existing.id);
      return { ...existing, value: 0 } as Vote;
    }
    const { data, error } = await supabase
      .from("votes")
      .update({ value })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("votes")
    .insert({ user_id: user.id, module_id: moduleId, value })
    .select()
    .single();
  if (error) throw error;
  return data;
};
