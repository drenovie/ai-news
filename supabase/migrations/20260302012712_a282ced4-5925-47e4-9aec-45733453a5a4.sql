
-- Add slug column to videos
ALTER TABLE public.videos ADD COLUMN slug text;

-- Create unique index on slug
CREATE UNIQUE INDEX idx_videos_slug ON public.videos (slug);

-- Backfill existing videos with slugs derived from title + video_id suffix
UPDATE public.videos
SET slug = CONCAT(
  LEFT(
    REGEXP_REPLACE(
      REGEXP_REPLACE(LOWER(title), '[^a-z0-9]+', '-', 'g'),
      '^-|-$', '', 'g'
    ),
    120
  ),
  '-',
  LEFT(video_id, 6)
);

-- Make slug NOT NULL after backfill
ALTER TABLE public.videos ALTER COLUMN slug SET NOT NULL;
