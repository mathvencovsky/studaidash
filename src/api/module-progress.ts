import { supabase } from "@/integrations/supabase/client";

export interface UserModuleProgress {
  id: string;
  user_id: string;
  module_id: string;
  start_date: string;
  completion_date: string | null;
  created_at: string;
  updated_at: string;
}

export const startModule = async (moduleId: string): Promise<UserModuleProgress> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("user_module_progress")
    .select("*")
    .eq("module_id", moduleId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from("user_module_progress")
    .insert({ user_id: user.id, module_id: moduleId })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getUserModuleProgress = async (moduleId: string): Promise<UserModuleProgress | null> => {
  const { data, error } = await supabase
    .from("user_module_progress")
    .select("*")
    .eq("module_id", moduleId)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const getLastStartedModule = async (): Promise<UserModuleProgress | null> => {
  const { data, error } = await supabase
    .from("user_module_progress")
    .select("*")
    .order("start_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const getAllUserModuleProgress = async (): Promise<UserModuleProgress[]> => {
  const { data, error } = await supabase.from("user_module_progress").select("*");
  if (error) throw error;
  return data ?? [];
};

export const completeModule = async (moduleId: string): Promise<UserModuleProgress> => {
  const { data, error } = await supabase
    .from("user_module_progress")
    .update({ completion_date: new Date().toISOString() })
    .eq("module_id", moduleId)
    .select()
    .single();
  if (error) throw error;
  return data;
};
