import { supabase } from "@/integrations/supabase/client";

export interface Content {
  id: string;
  title: string;
  description: string;
  type: "youtube_video" | "article" | "quiz" | "assignment" | "lab";
  duration_in_seconds: number;
  link: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  thumbnail_url: string | null;
  author: string | null;
  published_at: string | null;
  language: string | null;
  ai_transcript: string | null;
  ai_summary: string | null;
  created_at: string;
  updated_at: string;
}

export const listContents = async (): Promise<Content[]> => {
  const { data, error } = await supabase.from("contents").select("*");
  if (error) throw error;
  return (data ?? []) as Content[];
};

export const getContent = async (id: string): Promise<Content | null> => {
  const { data, error } = await supabase.from("contents").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Content | null;
};

export const createContent = async (input: Omit<Content, "id" | "created_at" | "updated_at">): Promise<Content> => {
  const { data, error } = await supabase.from("contents").insert(input).select().single();
  if (error) throw error;
  return data as Content;
};

export const updateContent = async (
  id: string,
  input: Partial<Omit<Content, "id" | "created_at" | "updated_at">>
): Promise<Content> => {
  const { data, error } = await supabase.from("contents").update(input).eq("id", id).select().single();
  if (error) throw error;
  return data as Content;
};

export const deleteContent = async (id: string): Promise<void> => {
  const { error } = await supabase.from("contents").delete().eq("id", id);
  if (error) throw error;
};
