import { supabase } from "@/integrations/supabase/client";

export const extractYoutubeMetadata = async (url: string, contentId?: string) => {
  const { data, error } = await supabase.functions.invoke("youtube-metadata", {
    body: { url, content_id: contentId },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data.metadata as {
    title: string;
    author: string;
    thumbnail_url: string;
    description: string;
    duration_in_seconds: number;
    link: string;
    type: string;
  };
};
