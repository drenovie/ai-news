
-- Table for YouTube channels to track
CREATE TABLE public.video_channels (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id text NOT NULL UNIQUE,
  name text NOT NULL,
  url text NOT NULL,
  title_filter text,  -- e.g. "highlights" to only keep matching videos
  is_active boolean NOT NULL DEFAULT true,
  last_synced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.video_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Video channels are publicly readable"
  ON public.video_channels FOR SELECT USING (true);

-- Table for video entries
CREATE TABLE public.videos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id text NOT NULL UNIQUE,
  channel_id uuid REFERENCES public.video_channels(id),
  title text NOT NULL,
  description text,
  thumbnail_url text,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Videos are publicly readable"
  ON public.videos FOR SELECT USING (true);

CREATE INDEX idx_videos_published_at ON public.videos(published_at DESC);
CREATE INDEX idx_videos_channel_id ON public.videos(channel_id);
