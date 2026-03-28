import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Video {
  id: string;
  video_id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail_url: string;
  published_at: string;
  club_ids: string[] | null;
}

async function triggerSync() {
  try {
    await supabase.functions.invoke("sync-youtube-videos", { method: "POST" });
  } catch {
    // Sync failure is non-blocking; we still show cached videos
  }
}

export function useVideos(limit = 6, clubFilter?: string | null) {
  return useQuery<Video[]>({
    queryKey: ["videos", limit, clubFilter || "all"],
    queryFn: async () => {
      triggerSync();

      let query = supabase
        .from("videos")
        .select("id, video_id, slug, title, description, thumbnail_url, published_at, club_ids")
        .eq("embeddable", true)
        .order("published_at", { ascending: false })
        .limit(limit);

      if (clubFilter) {
        query = query.contains("club_ids", [clubFilter]);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as unknown as Video[]) || [];
    },
    staleTime: 1000 * 60 * 10,
  });
}
