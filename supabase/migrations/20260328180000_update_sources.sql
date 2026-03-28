-- Update video_channels table with new AI-focused YouTube channels
INSERT INTO public.video_channels (channel_id, name, url, is_active) VALUES
('UC2eYbPPXA7Dq6NqWx3oEbbA', 'Two Minute Papers', 'https://www.youtube.com/channel/UC2eYbPPXA7Dq6NqWx3oEbbA', true),
('UC8butISFwT-Wl7EV0hUK0BQ', 'FreeCodeCamp', 'https://www.youtube.com/channel/UC8butISFwT-Wl7EV0hUK0BQ', true),
('UCSB_A75C2Np7aDaB3CPqxTA', 'Matt Wolfe', 'https://www.youtube.com/channel/UCSB_A75C2Np7aDaB3CPqxTA', true),
('UCKQZ0oFnNyNyNwYUvIhYFaw', 'AI Explained', 'https://www.youtube.com/channel/UCKQZ0oFnNyNyNwYUvIhYFaw', true),
('UCBJycsmduvYEL83R_U4JriQ', 'Andrej Karpathy', 'https://www.youtube.com/channel/UCBJycsmduvYEL83R_U4JriQ', true),
('UCsBjURrPoezykLs9EqgamOA', 'Fireship', 'https://www.youtube.com/channel/UCsBjURrPoezykLs9EqgamOA', true),
('UCEG16mH60P7Q2_8_RDRCEKQ', 'Google DeepMind', 'https://www.youtube.com/channel/UCEG16mH60P7Q2_8_RDRCEKQ', true)
ON CONFLICT (channel_id) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    is_active = EXCLUDED.is_active,
    last_synced_at = CASE 
        WHEN public.video_channels.is_active <> EXCLUDED.is_active 
        THEN now() 
        ELSE public.video_channels.last_synced_at 
    END;

-- Update rss_feeds table with new AI news sources
INSERT INTO public.rss_feeds (name, url, club_ids, is_active) VALUES
('TechCrunch AI', 'https://feeds.feedburner.com/TechCrunch/AI', '{}', true),
('VentureBeat AI', 'https://venturebeat.com/category/ai/feed/', '{}', true),
('The Verge AI', 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', '{}', true),
('Hacker News', 'https://news.ycombinator.com/rss', '{}', true),
('MIT Tech Review', 'https://www.technologyreview.com/feed/', '{}', true),
('ArXiv CS.AI', 'https://rss.arxiv.org/rss/cs.AI', '{}', true),
('AI News', 'https://www.artificialintelligence-news.com/feed/', '{}', true),
('ArXiv AI (auto)', 'https://feeds.arxiv.org/AutoRSS.xml?cat=cs.AI', '{}', true),
('ArXiv NLP/CL', 'https://feeds.arxiv.org/AutoRSS.xml?cat=cs.CL', '{}', true),
('Microsoft AI Blog', 'https://blogs.windows.com/ai/feed/', '{}', true)
ON CONFLICT (url) DO UPDATE SET
    name = EXCLUDED.name,
    club_ids = EXCLUDED.club_ids,
    is_active = EXCLUDED.is_active,
    last_synced_at = CASE 
        WHEN public.rss_feeds.is_active <> EXCLUDED.is_active 
        THEN now() 
        ELSE public.rss_feeds.last_synced_at 
    END;