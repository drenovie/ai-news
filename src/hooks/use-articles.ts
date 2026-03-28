import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "@/lib/types";

interface DbArticle {
  id: string;
  slug: string;
  title: string;
  snippet: string | null;
  content: string | null;
  source: string;
  source_url: string | null;
  image_url: string | null;
  published_at: string;
  club_ids: string[];
  guid: string | null;
}

function decodeHtmlEntities(value: string): string {
  if (!value || typeof window === "undefined") return value;

  const textarea = window.document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function mapDbArticle(row: DbArticle): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: decodeHtmlEntities(row.title),
    snippet: decodeHtmlEntities(row.snippet || ""),
    content: row.content || "",
    source: decodeHtmlEntities(row.source),
    sourceUrl: row.source_url || "",
    imageUrl: row.image_url || "/pwa-512x512.png",
    publishedAt: row.published_at,
    clubIds: row.club_ids || [],
  };
}

const PAGE_SIZE = 20;

export function useArticles(clubFilter?: string | null) {
  return useInfiniteQuery<Article[]>({
    queryKey: ["articles", "infinite", clubFilter || "all"],
    queryFn: async ({ pageParam = 0 }) => {
      const from = (pageParam as number) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("articles")
        .select("*")
        .not("slug", "ilike", "%liveblog%")
        .order("published_at", { ascending: false })
        .range(from, to);

      if (clubFilter) {
        query = query.contains("club_ids", [clubFilter]);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (!data || data.length === 0) return [];

      return (data as unknown as DbArticle[]).map(mapDbArticle);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !allPages || lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useArticleBySlug(slug: string | undefined) {
  return useQuery<Article | null>({
    queryKey: ["article", slug],
    queryFn: async () => {
      if (!slug) return null;

      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return mapDbArticle(data as unknown as DbArticle);
    },
    enabled: !!slug,
  });
}
