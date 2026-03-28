import { useState, useEffect } from 'react'
import { VideoCard } from '@/components/VideoCard'
import { FeedFilters } from '@/components/FeedFilters'
import { cn } from '@/lib/utils'

// --- Types ---
export type VideoItem = {
  id: string
  title: string
  description: string
  thumbnail: string
  videoUrl: string
  channelName: string
  channelId: string
  publishedAt: string
  viewCount?: string
  duration?: string
  source: 'youtube'
}

export type FeedItem = {
  id: string
  title: string
  description: string
  url: string
  source: string
  sourceName: string
  publishedAt: string
  imageUrl?: string
  type: 'rss' | 'google'
}

export type CombinedItem = (VideoItem | FeedItem) & { type: 'video' | 'feed' }

export default function Index() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [feeds, setFeeds] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'youtube' | 'news'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    // Load from Supabase (populated by Cloudflare Worker cron)
    const load = async () => {
      const { data: vid } = await import('@/integrations/supabase/client').then(m => m.supabase)
        .then(s => s.from('videos').select('*').order('published_at', { ascending: false }).limit(50))
      const { data: feed } = await import('@/integrations/supabase/client').then(m => m.supabase)
        .then(s => s.from('news_items').select('*').order('published_at', { ascending: false }).limit(50))
      setVideos((vid || []) as VideoItem[])
      setFeeds((feed || []) as FeedItem[])
      setLoading(false)
    }
    load()
  }, [])

  const allItems: CombinedItem[] = [
    ...videos.map(v => ({ ...v, type: 'video' as const })),
    ...feeds.map(f => ({ ...f, type: 'feed' as const })),
  ].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  const filtered = allItems.filter(item => {
    const matchesSearch = !search || item.title.toLowerCase().includes(search.toLowerCase())
    if (activeTab === 'youtube') return matchesSearch && item.type === 'video'
    if (activeTab === 'news') return matchesSearch && item.type === 'feed'
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">AI</div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">AI News</h1>
              <p className="text-xs text-muted-foreground">Videos &amp; articles from top AI sources</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://github.com/drenovie/ai-news" target="_blank" rel="noopener noreferrer"
               className="text-xs text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search AI news, videos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          {(['all', 'youtube', 'news'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={cn('px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize',
                activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
              {tab === 'all' ? `All (${allItems.length})` : tab === 'youtube' ? `YouTube (${videos.length})` : `News (${feeds.length})`}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="video-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="video-card animate-pulse">
                <div className="aspect-video bg-secondary" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-secondary rounded w-3/4" />
                  <div className="h-3 bg-secondary rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Grid */}
        {!loading && activeTab !== 'news' && (
          <div>
            {activeTab === 'all' && <h2 className="text-sm font-medium text-muted-foreground mb-3">Latest Videos</h2>}
            <div className="video-grid">
              {videos.slice(0, activeTab === 'all' ? 8 : 20).map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        )}

        {/* Feed Items */}
        {!loading && activeTab !== 'youtube' && (
          <div className="space-y-3">
            {activeTab === 'all' && <h2 className="text-sm font-medium text-muted-foreground mb-3">Latest News</h2>}
            {feeds.map(item => (
              <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer"
                className="block bg-card rounded-xl border border-border p-4 hover:border-accent transition-colors">
                <div className="flex items-start gap-3">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt="" className="w-20 h-14 object-cover rounded-lg flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">{item.sourceName} • {formatDate(item.publishedAt)}</p>
                    <h3 className="text-sm font-medium text-foreground line-clamp-2">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffH = Math.floor(diffMs / 3600000)
  if (diffH < 1) return 'Just now'
  if (diffH < 24) return `${diffH}h ago`
  const diffD = Math.floor(diffH / 24)
  if (diffD < 7) return `${diffD}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
