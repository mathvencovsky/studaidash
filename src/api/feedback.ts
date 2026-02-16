import { supabase } from "@/integrations/supabase/client";

export interface Feedback {
  id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  url: string;
  created_at: string;
}

export const submitFeedback = async (input: {
  rating: number;
  comment?: string;
  url: string;
}): Promise<Feedback> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("feedback")
    .insert({
      user_id: user.id,
      rating: input.rating,
      comment: input.comment ?? null,
      url: input.url,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getUserFeedback = async (): Promise<Feedback[]> => {
  const { data, error } = await supabase.from("feedback").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
};
