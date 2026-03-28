
-- RSS Feeds table
CREATE TABLE public.rss_feeds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  club_ids TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Articles table
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  snippet TEXT,
  content TEXT,
  source TEXT NOT NULL,
  source_url TEXT,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  club_ids TEXT[] DEFAULT '{}',
  feed_id UUID REFERENCES public.rss_feeds(id),
  guid TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rss_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Public read access for articles
CREATE POLICY "Articles are publicly readable"
  ON public.articles FOR SELECT
  USING (true);

-- Public read access for rss_feeds
CREATE POLICY "RSS feeds are publicly readable"
  ON public.rss_feeds FOR SELECT
  USING (true);

-- Index for performance
CREATE INDEX idx_articles_published_at ON public.articles (published_at DESC);
CREATE INDEX idx_articles_slug ON public.articles (slug);
CREATE INDEX idx_articles_guid ON public.articles (guid);
