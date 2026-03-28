
-- Create league_standings table
CREATE TABLE public.league_standings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  position int NOT NULL,
  team text NOT NULL,
  played int NOT NULL DEFAULT 0,
  won int NOT NULL DEFAULT 0,
  drawn int NOT NULL DEFAULT 0,
  lost int NOT NULL DEFAULT 0,
  goals_for int NOT NULL DEFAULT 0,
  goals_against int NOT NULL DEFAULT 0,
  goal_difference int NOT NULL DEFAULT 0,
  points int NOT NULL DEFAULT 0,
  club_id text,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.league_standings ENABLE ROW LEVEL SECURITY;

-- Public read only
CREATE POLICY "League standings are publicly readable"
  ON public.league_standings
  FOR SELECT
  USING (true);
