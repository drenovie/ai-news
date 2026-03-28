
CREATE TABLE public.site_stats (
  id text PRIMARY KEY DEFAULT 'main',
  visitor_count bigint NOT NULL DEFAULT 1000
);

ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read stats" ON public.site_stats FOR SELECT USING (true);

INSERT INTO public.site_stats (id, visitor_count) VALUES ('main', 1000);

CREATE OR REPLACE FUNCTION public.increment_visitor_count()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count bigint;
BEGIN
  UPDATE public.site_stats SET visitor_count = visitor_count + 1 WHERE id = 'main' RETURNING visitor_count INTO new_count;
  RETURN new_count;
END;
$$;
