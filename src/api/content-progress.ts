import { supabase } from "@/integrations/supabase/client";

export interface UserContentProgress {
  id: string;
  user_id: string;
  module_id: string;
  content_id: string;
  is_completed: boolean;
  completion_date: string | null;
  created_at: string;
  updated_at: string;
}

export const toggleContentCompletion = async (input: {
  moduleId: string;
  contentId: string;
  isCompleted: boolean;
}): Promise<UserContentProgress> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("user_content_progress")
    .select("*")
    .eq("module_id", input.moduleId)
    .eq("content_id", input.contentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("user_content_progress")
      .update({
        is_completed: input.isCompleted,
        completion_date: input.isCompleted ? new Date().toISOString() : null,
      })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("user_content_progress")
    .insert({
      user_id: user.id,
      module_id: input.moduleId,
      content_id: input.contentId,
      is_completed: input.isCompleted,
      completion_date: input.isCompleted ? new Date().toISOString() : null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getModuleContentProgress = async (moduleId: string): Promise<UserContentProgress[]> => {
  const { data, error } = await supabase
    .from("user_content_progress")
    .select("*")
    .eq("module_id", moduleId);
  if (error) throw error;
  return data ?? [];
};

export const getAllContentProgress = async (): Promise<UserContentProgress[]> => {
  const { data, error } = await supabase.from("user_content_progress").select("*");
  if (error) throw error;
  return data ?? [];
};
