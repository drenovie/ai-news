
-- Function to add an RSS feed
CREATE OR REPLACE FUNCTION public.add_rss_feed(
  p_name text,
  p_url text,
  p_club_ids text[] DEFAULT '{}'::text[],
  p_is_active boolean DEFAULT true
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO public.rss_feeds (name, url, club_ids, is_active)
  VALUES (p_name, p_url, p_club_ids, p_is_active)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- Function to add a video channel
CREATE OR REPLACE FUNCTION public.add_video_channel(
  p_name text,
  p_url text,
  p_channel_id text,
  p_club_ids text[] DEFAULT '{}'::text[],
  p_title_filter text DEFAULT NULL,
  p_is_active boolean DEFAULT true
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO public.video_channels (name, url, channel_id, club_ids, title_filter, is_active)
  VALUES (p_name, p_url, p_channel_id, p_club_ids, p_title_filter, p_is_active)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;
