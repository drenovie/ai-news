export default {
  async scheduled(event: any, env: Env) {
    // Fetch YouTube videos for all channels
    await fetchYouTubeVideos(env)
    // Fetch RSS feeds
    await fetchRSSFeeds(env)
    // Fetch Google Alerts
    await fetchGoogleAlerts(env)
    // Cleanup old items
    await cleanupOldItems(env)
  },

  async fetchYouTubeVideos(env: Env) {
    const CHANNELS = [
      { id: 'UC2eYbPPXA7Dq6NqWx3oEbbA', name: 'Two Minute Papers' },
      { id: 'UC8butISFwT-Wl7EV0hUK0BQ', name: 'FreeCodeCamp' },
      { id: 'UCSB_A75C2Np7aDaB3CPqxTA', name: 'Matt Wolfe' },
      { id: 'UCKQZ0oFnNyNyNwYUvIhYFaw', name: 'AI Explained' },
      { id: 'UCBJycsmduvYEL83R_U4JriQ', name: 'Andrej Karpathy' },
      { id: 'UCsBjURrPoezykLs9EqgamOA', name: 'Fireship' },
      { id: 'UUMCjSM6r7Y9mmwolfFKzQXw', name: 'Daily Dose of Internet' },
      { id: 'UCxL2blecXgOEO4D7N7LDY4w', name: 'AltmanNick' },
      { id: 'UCfM3TTQ4UVo7Tn6TgB8GA6g', name: 'AI Alchemy' },
      { id: 'UCZgYw0-F38hZfz8O_X_qLZA', name: 'All About AI' },
      { id: 'UCXumN3ECG8cE4N5q9kvcp8Q', name: 'Prompt Engineering' },
      { id: 'UCwO-DGrfym69R2Zj4z9S9w', name: 'Digital Chief' },
      { id: 'UCs5IKu6tmQ1bMsD7MH与传统IT', name: 'MIT Tech Review' },
      { id: 'UCEG16mH60P7Q2_8_RDRCEKQ', name: 'Google DeepMind' },
      { id: 'UCoMJDAZ6kdPy9FCCqHlnKIA', name: 'Sam Kumar' },
      { id: 'UCz_0OqLtVRt1kfL5xJ-ZhIQ', name: 'Prompt Engineering Memes' },
    ]

    const API_KEY = env.YOUTUBE_API_KEY
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    for (const ch of CHANNELS) {
      try {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${ch.id}&part=snippet,id&order=date&maxResults=10&type=video&publishedAfter=${since}`
        const res = await fetch(url)
        const data = await res.json() as any

        if (!data.items) continue

        for (const item of data.items) {
          const videoId = item.id?.videoId
          if (!videoId) continue

          const snippet = item.snippet
          // Get view count
          const statsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoId}&part=statistics,contentDetails`
          const statsRes = await fetch(statsUrl)
          const statsData = await statsRes.json() as any
          const stats = statsData.items?.[0]?.statistics
          const duration = statsData.items?.[0]?.contentDetails?.duration

          const video = {
            id: videoId,
            title: snippet.title,
            description: snippet.description.slice(0, 500),
            thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || '',
            video_url: `https://www.youtube.com/watch?v=${videoId}`,
            channel_name: ch.name,
            channel_id: ch.id,
            published_at: snippet.publishedAt,
            view_count: stats?.viewCount || '0',
            duration: parseDuration(duration),
            source: 'youtube',
          }

          await env.DB.prepare(`
            INSERT INTO videos (id, title, description, thumbnail, video_url, channel_name, channel_id, published_at, view_count, duration, source)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET view_count = excluded.view_count, title = excluded.title
          `).bind(
            video.id, video.title, video.description, video.thumbnail, video.video_url,
            video.channel_name, video.channel_id, video.published_at, video.view_count, video.duration, video.source
          ).run()
        }
      } catch (e: any) {
        console.error(`YouTube error for ${ch.name}: ${e.message}`)
      }
      await new Promise(r => setTimeout(r, 200)) // rate limit
    }
  },

  async fetchRSSFeeds(env: Env) {
    const FEEDS = [
      { url: 'https://feeds.feedburner.com/TechCrunch/AI', name: 'TechCrunch AI' },
      { url: 'https://venturebeat.com/category/ai/feed/', name: 'VentureBeat AI' },
      { url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', name: 'The Verge AI' },
      { url: 'https://news.ycombinator.com/rss', name: 'Hacker News' },
      { url: 'https://www.technologyreview.com/feed/', name: 'MIT Tech Review' },
      { url: 'https://feeds.arxiv.org/AutoRSS.xml?cat=cs.AI', name: 'ArXiv CS.AI' },
      { url: 'https://www.artificialintelligence-news.com/feed/', name: 'AI News' },
      { url: 'https://blogs.windows.com/ai/feed/', name: 'Microsoft AI Blog' },
      { url: 'https://feeds.arxiv.org/AutoRSS.xml?cat=cs.CL', name: 'ArXiv NLP/CL' },
    ]

    for (const feed of FEEDS) {
      try {
        const res = await fetch(feed.url, { headers: { 'User-Agent': 'AI-News/1.0' } })
        const text = await res.text()
        const items = parseRSS(text)

        for (const item of items.slice(0, 10)) {
          await env.DB.prepare(`
            INSERT INTO news_items (id, title, description, url, source, source_name, published_at, image_url, item_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET title = excluded.title
          `).bind(
            item.id, item.title, item.description || '', item.url, feed.url, feed.name,
            item.pubDate || new Date().toISOString(), item.imageUrl || null, 'rss'
          ).run()
        }
      } catch (e: any) {
        console.error(`RSS error for ${feed.name}: ${e.message}`)
      }
      await new Promise(r => setTimeout(r, 500))
    }
  },

  async fetchGoogleAlerts(env: Env) {
    const ALERTS = [
      'artificial intelligence OR AI 2025',
      'ChatGPT OpenAI GPT-5',
      'Google Gemini AI',
      'Anthropic Claude AI',
      'LLM large language model',
    ]

    for (const query of ALERTS) {
      try {
        const encoded = encodeURIComponent(query)
        const url = `https://news.google.com/rss/search?q=${encoded}&hl=en-AU&gl=AU&ceid=AU:en`
        const res = await fetch(url, { headers: { 'User-Agent': 'AI-News/1.0' } })
        const text = await res.text()
        const items = parseRSS(text)

        for (const item of items.slice(0, 5)) {
          await env.DB.prepare(`
            INSERT INTO news_items (id, title, description, url, source, source_name, published_at, image_url, item_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET title = excluded.title
          `).bind(
            item.id, item.title, item.description || '', item.url, 'google_alerts',
            `Google: ${query}`, item.pubDate || new Date().toISOString(), item.imageUrl || null, 'google'
          ).run()
        }
      } catch (e: any) {
        console.error(`Google Alert error for "${query}": ${e.message}`)
      }
      await new Promise(r => setTimeout(r, 1000))
    }
  },

  async cleanupOldItems(env: Env) {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    await env.DB.prepare('DELETE FROM videos WHERE published_at < ?').bind(cutoff).run()
    await env.DB.prepare('DELETE FROM news_items WHERE published_at < ?').bind(cutoff).run()
  }
}

// --- Helpers ---
function parseDuration(iso: string): string {
  if (!iso) return ''
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return ''
  const h = match[1] ? parseInt(match[1]) : 0
  const m = match[2] ? parseInt(match[2]) : 0
  const s = match[3] ? parseInt(match[3]) : 0
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function parseRSS(xml: string) {
  const items: any[] = []
  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)
  for (const match of itemMatches) {
    const text = match[1]
    const get = (tag: string) => {
      const m = text.match(new RegExp(`<${tag}[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/${tag}|<${tag}[^>]*>([\s\S]*?)<\/${tag}`, 'i'))
      return m ? (m[1] || m[2] || '').trim() : ''
    }
    const getAttr = (tag: string, attr: string) => {
      const m = text.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, 'i'))
      return m ? m[1] : ''
    }
    const title = get('title')
    const link = get('link')
    if (!title || !link) continue
    const rawId = get('guid') || link
    const id = rawId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 64)
    const pubDate = get('pubDate')
    const description = get('description')
    const imageUrl = get('media:thumbnail') || get('enclosure') || ''
    items.push({ id, title, url: link, pubDate, description, imageUrl })
  }
  return items
}

interface Env {
  YOUTUBE_API_KEY: string
  DB: any
}
