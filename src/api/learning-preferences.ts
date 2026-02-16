import { supabase } from "@/integrations/supabase/client";

export interface LearningPreference {
  id: string;
  user_id: string;
  interests: string[];
  minutes_per_day: number | null;
  days: string[] | null;
  formats: string[] | null;
  content_length: "bite_sized" | "short" | "medium" | "deep_dive" | null;
  created_at: string;
  updated_at: string;
}

export const getMyLearningPreference = async (): Promise<LearningPreference | null> => {
  const { data, error } = await supabase
    .from("learning_preferences")
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return data as LearningPreference | null;
};

export const saveLearningPreference = async (input: {
  interests: string[];
  minutes_per_day?: number;
  days?: string[];
  formats?: string[];
  content_length?: "bite_sized" | "short" | "medium" | "deep_dive";
}): Promise<LearningPreference> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("learning_preferences")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("learning_preferences")
      .update(input)
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data as LearningPreference;
  }

  const { data, error } = await supabase
    .from("learning_preferences")
    .insert({ user_id: user.id, ...input })
    .select()
    .single();
  if (error) throw error;
  return data as LearningPreference;
};
