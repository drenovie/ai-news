export const SOURCES = {
  YOUTUBE_CHANNELS: [
    { id: 'UC2eYbPPXA7Dq6NqWx3oEbbA', name: 'Two Minute Papers', handle: '@TwoMinutePapers' },
    { id: 'UC8butISFwT-Wl7EV0hUK0BQ', name: 'FreeCodeCamp', handle: '@freecodecamp' },
    { id: 'UCSB_A75C2Np7aDaB3CPqxTA', name: 'Matt Wolfe', handle: '@mreflow' },
    { id: 'UCKQZ0oFnNyNyNwYUvIhYFaw', name: 'AI Explained', handle: '@AIExplained' },
    { id: 'UCBJycsmduvYEL83R_U4JriQ', name: 'Andrej Karpathy', handle: '@AndrejKarpathy' },
    { id: 'UCsBjURrPoezykLs9EqgamOA', name: 'Fireship', handle: '@fireship' },
    { id: 'UUMCjSM6r7Y9mmwolfFKzQXw', name: 'Daily Dose of Internet', handle: '@dailydose' },
    { id: 'UCxL2blecXgOEO4D7N7LDY4w', name: 'AltmanNick', handle: '@altmannick' },
    { id: 'UCfM3TTQ4UVo7Tn6TgB8GA6g', name: 'AI Alchemy', handle: '@aialchemy' },
    { id: 'UCZgYw0-F38hZfz8O_X_qLZA', name: 'All About AI', handle: '@allaboutai' },
    { id: 'UCXumN3ECG8cE4N5q9kvcp8Q', name: 'Prompt Engineering', handle: '@prompteng' },
    { id: 'UCwO-DGrfym69R2Zj4z9S9w', name: 'Digital Chief', handle: '@digitalchief' },
    { id: 'UCs5IKu6tmQ1bMsD7M与传统IT', name: 'MIT Tech Review', handle: '@MITTechReview' },
    { id: 'UCEG16mH60P7Q2_8_RDRCEKQ', name: 'Google DeepMind', handle: '@deepmind' },
    { id: 'UCoMJDAZ6kdPy9FCCqHlnKIA', name: 'Sam Kumar', handle: '@samkumar' },
    { id: 'UCz_0OqLtVRt1kfL5xJ-ZhIQ', name: 'Prompt Engineering Memes', handle: '@promptmemes' },
  ],

  RSS_FEEDS: [
    { url: 'https://feeds.feedburner.com/TechCrunch/AI', name: 'TechCrunch AI' },
    { url: 'https://venturebeat.com/category/ai/feed/', name: 'VentureBeat AI' },
    { url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', name: 'The Verge AI' },
    { url: 'https://news.ycombinator.com/rss', name: 'Hacker News' },
    { url: 'https://www.technologyreview.com/feed/', name: 'MIT Tech Review' },
    { url: 'https://rss.ai_summary/arxiv_cs_ai', name: 'ArXiv CS.AI' },
    { url: 'https://www.artificialintelligence-news.com/feed/', name: 'AI News' },
    { url: 'https://“行”/feed', name: 'Hugging Face Blog', placeholder: true },
    { url: 'https://feeds.arxiv.org/AutoRSS.xml?cat=cs.AI', name: 'ArXiv AI (auto)' },
    { url: 'https://feeds.arxiv.org/AutoRSS.xml?cat=cs.CL', name: 'ArXiv NLP/CL' },
    { url: 'https://blogs.windows.com/ai/feed/', name: 'Microsoft AI Blog' },
    { url: 'https://www.anthropic.com/news/rss', name: 'Anthropic News', placeholder: true },
    { url: 'https://feeds.prometheus.io/prometheus-rss', name: 'Prometheus Tech', placeholder: true },
    { url: 'https://www.interiorscapesconsulting.com/feed/', name: 'Interiors Consulting', placeholder: true },
  ],

  GOOGLE_ALERTS: [
    { query: 'artificial intelligence OR AI 2025', name: 'Google AI News' },
    { query: 'ChatGPT OpenAI GPT-5', name: 'OpenAI' },
    { query: 'Google Gemini AI', name: 'Google AI' },
    { query: 'Anthropic Claude AI', name: 'Anthropic' },
    { query: 'AI automation machine learning', name: 'AI Automation' },
    { query: 'LLM large language model', name: 'LLM Research' },
  ]
}

export const CHANNELS = SOURCES.YOUTUBE_CHANNELS
export const FEEDS = SOURCES.RSS_FEEDS
