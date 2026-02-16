import { supabase } from "@/integrations/supabase/client";

export interface ModuleContent {
  id: string;
  module_id: string;
  content_id: string;
  position: number;
  is_required: boolean;
  created_at: string;
}

export const getModuleContents = async (moduleId: string): Promise<ModuleContent[]> => {
  const { data, error } = await supabase
    .from("module_contents")
    .select("*")
    .eq("module_id", moduleId)
    .order("position");
  if (error) throw error;
  return data ?? [];
};

export const addContentToModule = async (input: {
  module_id: string;
  content_id: string;
  position: number;
  is_required?: boolean;
}): Promise<ModuleContent> => {
  const { data, error } = await supabase.from("module_contents").insert(input).select().single();
  if (error) throw error;
  return data;
};

export const removeContentFromModule = async (id: string): Promise<void> => {
  const { error } = await supabase.from("module_contents").delete().eq("id", id);
  if (error) throw error;
};

export const reorderModuleContents = async (
  moduleId: string,
  orderedIds: string[]
): Promise<void> => {
  const updates = orderedIds.map((id, index) =>
    supabase.from("module_contents").update({ position: index }).eq("id", id)
  );
  await Promise.all(updates);
};
