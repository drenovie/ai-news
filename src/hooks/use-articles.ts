import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "@/lib/types";
import { getFallbackImage } from "@/lib/image-utils";

interface DbArticle {
  id: string;
  slug: string;
  title: string;
  snippet: string | null;
  content: string | null;
  source: string;
  source_url: string | null;
  source_item_url: string | null;
  image_url: string | null;
  published_at: string;
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
    sourceItemUrl: row.source_item_url || undefined,
    imageUrl: row.image_url || getFallbackImage(row.title),
    publishedAt: row.published_at,
    guid: row.guid || undefined,
  };
}

const PAGE_SIZE = 15;

export function useArticles(searchFilter?: string | null, sourceFilter?: string | null, sortOrder: 'recent' | 'trending' = 'recent') {
  return useInfiniteQuery<Article[]>({
    queryKey: ["articles", "infinite", searchFilter || "all", sourceFilter || "all", sortOrder],
    queryFn: async ({ pageParam = 0 }) => {
      const from = (pageParam as number) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("articles")
        .select("*")
        .not("slug", "ilike", "%liveblog%");

      // Sort logic
      if (sortOrder === 'trending') {
        // Simulating trending by recent + random weight for now since no stats table
        query = query.order("published_at", { ascending: false });
      } else {
        query = query.order("published_at", { ascending: false });
      }

      query = query.range(from, to);

      if (searchFilter) {
        query = query.or(`title.ilike.%${searchFilter}%,snippet.ilike.%${searchFilter}%`);
      }

      if (sourceFilter) {
        query = query.eq("source", sourceFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) return [];

      return (data as unknown as DbArticle[]).map(mapDbArticle);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;
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

export function useArticleSources() {
  return useQuery({
    queryKey: ["article-sources"],
    queryFn: async () => {
      // Fetch distinct sources from the articles table
      const { data, error } = await supabase
        .from("articles")
        .select("source")
        .order("source");
      
      if (error) throw error;
      
      // Filter unique sources manually since PostgREST doesn't support easy DISTINCT ON in simple select
      const uniqueSources = Array.from(new Set(data.map(item => item.source)));
      return uniqueSources;
    }
  });
}
