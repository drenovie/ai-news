-- Add club_ids to videos so they can be tagged by club (inheriting from video_channels)
ALTER TABLE public.videos ADD COLUMN club_ids text[] DEFAULT '{}'::text[];

-- Also add club_ids to video_channels so channels can be associated with clubs
ALTER TABLE public.video_channels ADD COLUMN club_ids text[] DEFAULT '{}'::text[];