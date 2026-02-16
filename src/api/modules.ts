import { supabase } from "@/integrations/supabase/client";

export interface Module {
  id: string;
  title: string;
  description: string;
  upvote_count: number;
  downvote_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const getModules = async (): Promise<Module[]> => {
  const { data, error } = await supabase.from("modules").select("*");
  if (error) throw error;
  return data ?? [];
};

export const getModule = async (id: string): Promise<Module | null> => {
  const { data, error } = await supabase.from("modules").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
};

export const createModule = async (input: {
  title: string;
  description: string;
  contentIds?: string[];
}): Promise<Module> => {
  const { data, error } = await supabase
    .from("modules")
    .insert({ title: input.title, description: input.description })
    .select()
    .single();
  if (error) throw error;

  // Create module-content associations
  if (input.contentIds?.length) {
    const associations = input.contentIds.map((contentId, i) => ({
      module_id: data.id,
      content_id: contentId,
      position: i,
    }));
    await supabase.from("module_contents").insert(associations);
  }

  return data;
};

export const updateModule = async (
  id: string,
  input: Partial<Pick<Module, "title" | "description">>
): Promise<Module> => {
  const { data, error } = await supabase.from("modules").update(input).eq("id", id).select().single();
  if (error) throw error;
  return data;
};

export const deleteModule = async (id: string): Promise<void> => {
  const { error } = await supabase.from("modules").delete().eq("id", id);
  if (error) throw error;
};

export const getModuleSuggestions = async (query: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from("modules")
    .select("title")
    .ilike("title", `%${query}%`)
    .limit(10);
  if (error) throw error;
  return (data ?? []).map((m) => m.title);
};
