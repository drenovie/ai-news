-- Supabase schema for AI News

-- Videos from YouTube channels
CREATE TABLE IF NOT EXISTS videos (
  id          TEXT PRIMARY KEY,  -- YouTube video ID
  title       TEXT NOT NULL,
  description TEXT DEFAULT '',
  thumbnail   TEXT DEFAULT '',
  video_url   TEXT NOT NULL,
  channel_name TEXT NOT NULL,
  channel_id  TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  view_count  TEXT DEFAULT '0',
  duration    TEXT DEFAULT '',
  source      TEXT DEFAULT 'youtube',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- News items from RSS + Google Alerts
CREATE TABLE IF NOT EXISTS news_items (
  id          TEXT PRIMARY KEY,  -- hashed from URL
  title       TEXT NOT NULL,
  description TEXT DEFAULT '',
  url         TEXT NOT NULL UNIQUE,
  source      TEXT NOT NULL,     -- feed URL or 'google_alerts'
  source_name TEXT NOT NULL,     -- display name
  published_at TIMESTAMPTZ NOT NULL,
  image_url   TEXT DEFAULT '',
  item_type   TEXT DEFAULT 'rss', -- 'rss' or 'google'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_videos_published ON videos(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_channel ON videos(channel_id);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_items(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_source ON news_items(source);

-- Row Level Security
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read videos" ON videos FOR SELECT USING (true);
CREATE POLICY "Public read news" ON news_items FOR SELECT USING (true);

-- Service role can write (for the Cloudflare Worker)
CREATE POLICY "Service write videos" ON videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Service write news" ON news_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Service update videos" ON videos FOR UPDATE USING (true);
CREATE POLICY "Service update news" ON news_items FOR UPDATE USING (true);
