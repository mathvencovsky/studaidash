import { supabase } from "@/integrations/supabase/client";

export interface FavouriteContent {
  id: string;
  user_id: string;
  content_id: string;
  created_at: string;
}

export interface FavouriteModule {
  id: string;
  user_id: string;
  module_id: string;
  created_at: string;
}

// Content favourites
export const getFavouriteContents = async (): Promise<FavouriteContent[]> => {
  const { data, error } = await supabase.from("favourite_contents").select("*");
  if (error) throw error;
  return data ?? [];
};

export const toggleFavouriteContent = async (contentId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("favourite_contents")
    .select("id")
    .eq("content_id", contentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("favourite_contents").delete().eq("id", existing.id);
    return false; // unfavourited
  }

  await supabase.from("favourite_contents").insert({ user_id: user.id, content_id: contentId });
  return true; // favourited
};

// Module favourites
export const getFavouriteModules = async (): Promise<FavouriteModule[]> => {
  const { data, error } = await supabase.from("favourite_modules").select("*");
  if (error) throw error;
  return data ?? [];
};

export const toggleFavouriteModule = async (moduleId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("favourite_modules")
    .select("id")
    .eq("module_id", moduleId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("favourite_modules").delete().eq("id", existing.id);
    return false;
  }

  await supabase.from("favourite_modules").insert({ user_id: user.id, module_id: moduleId });
  return true;
};
