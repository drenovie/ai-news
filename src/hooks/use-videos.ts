import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Video } from "@/lib/types";
import { getFallbackImage } from "@/lib/image-utils";

const PAGE_SIZE = 12;

export function useVideos(searchFilter?: string | null, channelFilter?: string | null) {
  return useInfiniteQuery<Video[]>({
    queryKey: ["videos", "infinite", searchFilter || "all", channelFilter || "all"],
    queryFn: async ({ pageParam = 0 }) => {
      const from = (pageParam as number) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("videos")
        .select("id, video_id, slug, title, description, thumbnail_url, published_at, video_channels(name)")
        .eq("embeddable", true)
        .order("published_at", { ascending: false })
        .range(from, to);

      if (searchFilter) {
        query = query.ilike("title", `%${searchFilter}%`);
      }

      if (channelFilter) {
        query = query.eq("channel_id", channelFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return (data || []).map(v => ({
        ...v,
        thumbnail_url: v.thumbnail_url || getFallbackImage(v.title),
        channelName: (v.video_channels as any)?.name || 'Video',
        channel_id: v.channel_id
      })) as unknown as Video[];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useVideoBySlug(slug: string | undefined) {
  return useQuery<Video | null>({
    queryKey: ["video", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("videos")
        .select("*, video_channels(name)")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        thumbnail_url: data.thumbnail_url || getFallbackImage(data.title),
        channelName: (data.video_channels as any)?.name || 'Video',
        channel_id: data.channel_id
      } as unknown as Video;
    },
    enabled: !!slug,
  });
}

export function useVideoChannels() {
  return useQuery({
    queryKey: ["video-channels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("video_channels")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data;
    }
  });
}
