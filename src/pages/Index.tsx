import { useState, useEffect } from 'react'
import { VideoCard } from '@/components/VideoCard'
import { ArticleCard } from '@/components/ArticleCard'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { FilterBar } from '@/components/FilterBar'
import { AIChat } from '@/components/AIChat'
import { cn } from '@/lib/utils'
import { useSearchParams } from 'react-router-dom'
import { Search, Sparkles, TrendingUp, Zap, ChevronRight, X } from 'lucide-react'
import { useArticles, useArticleSources } from '@/hooks/use-articles'
import { useVideos, useVideoChannels } from '@/hooks/use-videos'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'news'>(
    (searchParams.get('tab') as 'all' | 'video' | 'news') || 'all'
  )
  const [search, setSearch] = useState('')
  const [isSearchHeroVisible, setIsSearchHeroVisible] = useState(false)
  const [isAIChatActive, setIsAIChatActive] = useState(false)
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)

  // Intersection Observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView()

  // Hooks for data - Disable standard search filtering when AI is active
  const effectiveSearch = isAIChatActive ? '' : search
  const { 
    data: articlesData, 
    isLoading: articlesLoading, 
    fetchNextPage: fetchNextArticles, 
    hasNextPage: hasMoreArticles 
  } = useArticles(effectiveSearch, selectedSource)

  const { 
    data: videosData, 
    isLoading: videosLoading, 
    fetchNextPage: fetchNextVideos, 
    hasNextPage: hasMoreVideos 
  } = useVideos(effectiveSearch, selectedChannel)

  const { data: sources } = useArticleSources()
  const { data: channels } = useVideoChannels()

  const articles = articlesData?.pages.flat() ?? []
  const videos = videosData?.pages.flat() ?? []
  
  // Layout Logic
  const featuredArticle = articles[0]
  const gridArticles = articles.slice(1, 4)
  const feedArticles = articles.slice(4)

  const featuredVideo = videos[0]
  const gridVideos = videos.slice(1, 4)
  const feedVideos = videos.slice(4)

  const trendingNews = articles.slice(0, 5)

  useEffect(() => {
    const tab = searchParams.get('tab') as 'all' | 'video' | 'news'
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  useEffect(() => {
    const handleToggle = () => setIsSearchHeroVisible(prev => !prev);
    window.addEventListener('toggle-search-hero', handleToggle);
    return () => window.removeEventListener('toggle-search-hero', handleToggle);
  }, []);

  // Infinite Scroll Trigger
  useEffect(() => {
    if (inView && !isAIChatActive) {
      if (activeTab === 'news' || activeTab === 'all') fetchNextArticles()
      if (activeTab === 'video' || activeTab === 'all') fetchNextVideos()
    }
  }, [inView, activeTab, isAIChatActive])

  const handleTabChange = (tab: 'all' | 'video' | 'news') => {
    setActiveTab(tab)
    setSearchParams(tab === 'all' ? {} : { tab })
    setSelectedSource(null)
    setSelectedChannel(null)
    setIsAIChatActive(false)
  }

  const triggerAIChat = () => {
    setSearch("today's top 10 ai trends")
    setIsAIChatActive(true)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      <Header />

      <main className="w-full max-w-[1920px] mx-auto px-global py-12 space-y-16">
        
        {/* Persistent Branding Hero */}
        <section className="text-center space-y-12 pt-8">
           <h2 className="text-4xl md:text-7xl font-black tracking-tight uppercase leading-[0.85]">
            Stay ahead of <br/><span className="text-primary italic font-serif lowercase text-[1.1em]">intelligence</span>
          </h2>
          
          {/* Animated Unified Search & AI Box */}
          <AnimatePresence>
            {(isSearchHeroVisible || isAIChatActive) && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl mx-auto w-full"
              >
                <div className={cn(
                  "bg-sand-50/80 backdrop-blur-xl border border-bark-200 transition-all duration-700 ease-in-out shadow-2xl shadow-bark-900/5",
                  isAIChatActive ? "rounded-[3rem] p-10 md:p-14" : "rounded-full p-2 pl-8 pr-3"
                )}>
                  <div className="relative flex items-center gap-4">
                    {!isAIChatActive && <Search className="w-5 h-5 text-bark-300 shrink-0" />}
                    <input
                      type="text"
                      placeholder="ask AI about latest trends..."
                      value={search}
                      onChange={e => {
                        setSearch(e.target.value)
                        if (!e.target.value) setIsAIChatActive(false)
                      }}
                      className={cn(
                        "bg-transparent border-none focus:outline-none w-full font-medium placeholder:text-bark-300",
                        isAIChatActive ? "text-lg md:text-xl font-bold text-bark-900 lowercase" : "text-lg"
                      )}
                      readOnly={isAIChatActive}
                    />
                    
                    <div className="flex items-center gap-2">
                      {!isAIChatActive ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setIsSearchHeroVisible(false)}
                            className="text-muted-foreground hover:text-bark-900 rounded-full"
                          >
                            <X className="w-5 h-5" />
                          </Button>
                  <Button 
                    onClick={triggerAIChat}
                    className="bg-primary hover:bg-bark-900 text-white px-6 h-12 rounded-full flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ask AI</span>
                  </Button>
                        </>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => { setIsAIChatActive(false); setSearch(''); }}
                          className="bg-bark-900/5 text-bark-900 hover:bg-bark-900 hover:text-white rounded-full h-12 w-12 transition-all"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Streaming Response Content */}
                  {isAIChatActive && (
                    <AIChat onClose={() => { setIsAIChatActive(false); setSearch(''); }} />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Home Layout (Hidden when AI is active to focus on chat) */}
        {!isAIChatActive && (
          <div className="flex flex-col lg:flex-row gap-16 animate-in fade-in duration-1000">
            {/* Main Column */}
            <div className="flex-1 min-w-0 space-y-20">
              {activeTab !== 'video' ? (
                <section className="space-y-12 text-left">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-bark-900">Featured Insight</h3>
                  </div>
                  {featuredArticle && <ArticleCard article={featuredArticle} variant="hero" />}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {gridArticles.map(a => (
                      <ArticleCard key={a.id} article={a} variant="grid" />
                    ))}
                  </div>

                  {activeTab === 'all' && videos.length > 0 && (
                    <div className="pt-16 border-t border-bark-200/30 space-y-10">
                      <div className="flex items-center justify-between border-l-4 border-primary pl-4">
                        <div>
                          <h2 className="text-2xl font-black uppercase tracking-tight">Latest Videos</h2>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Deep dives & tutorials</p>
                        </div>
                        <button onClick={() => handleTabChange('video')} className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">
                          See All Videos →
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {videos.slice(0, 6).map(v => <VideoCard key={v.id} video={v} />)}
                      </div>
                    </div>
                  )}
                </section>
              ) : (
                <section className="space-y-12 text-left">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-primary" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-bark-900">Featured Video</h3>
                  </div>
                  {featuredVideo && (
                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-bark-200 shadow-2xl group cursor-pointer" onClick={() => window.location.href = `/video/${featuredVideo.slug}`}>
                       <img src={featuredVideo.thumbnail_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                       <div className="absolute inset-0 bg-gradient-to-t from-bark-900/90 via-bark-900/40 to-transparent" />
                       <div className="absolute bottom-0 left-0 p-10 max-w-3xl">
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">{featuredVideo.channelName}</p>
                          <h2 className="text-3xl md:text-5xl font-black text-white uppercase leading-[1.1] mb-6">{featuredVideo.title}</h2>
                          <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:scale-105 transition-transform">
                            Watch Now <ChevronRight className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {gridVideos.map(v => <VideoCard key={v.id} video={v} />)}
                  </div>
                </section>
              )}
            </div>

            <aside className="w-full lg:w-80 shrink-0 space-y-16 text-left">
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-bark-900">Most Trending</h3>
                </div>
                <div className="flex flex-col gap-4">
                  {trendingNews.map(a => <ArticleCard key={a.id} article={a} variant="compact" />)}
                </div>
              </section>

              {activeTab !== 'video' && (
                <section className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-primary" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-bark-900">Latest Videos</h3>
                    </div>
                    <button onClick={() => handleTabChange('video')} className="text-primary hover:scale-110 transition-transform"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {videos?.slice(0, 5).map(v => <VideoCard key={v.id} video={v} variant="compact" />)}
                  </div>
                </section>
              )}

              <section className="p-8 bg-bark-900 rounded-[2.5rem] text-sand-25 space-y-4 shadow-2xl shadow-bark-900/20">
                <h4 className="text-lg font-black uppercase leading-tight">Neural Pulse</h4>
                <p className="text-xs text-sand-25/60 font-medium leading-relaxed">Weekly briefing on the frontier of artificial intelligence.</p>
                <div className="pt-2 flex gap-2">
                  <input type="text" placeholder="your@email.com" className="bg-sand-25/10 rounded-xl p-3 text-[10px] w-full focus:outline-none" />
                  <button className="bg-primary text-white px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">Join</button>
                </div>
              </section>
            </aside>
          </div>
        )}

        {/* 100% Wide Bottom Feed (Hidden when AI active) */}
        {!isAIChatActive && (
          <div className="w-full border-t border-bark-200/50 pt-16 space-y-12 text-left animate-in fade-in duration-1000 delay-300">
             <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-bark-200 pb-8">
                <div className="space-y-1">
                   <h2 className="text-2xl font-black uppercase tracking-tight">Most Recent</h2>
                   <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Continuous intelligence stream</p>
                </div>
                <div className="flex gap-4">
                  {(['all', 'news', 'video'] as const).map(t => (
                    <button key={t} onClick={() => handleTabChange(t)}
                      className={cn("text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full border transition-all", 
                        activeTab === t ? "bg-bark-900 text-white border-bark-900 shadow-xl shadow-bark-900/20" : "text-muted-foreground border-bark-200 hover:border-primary/40")}>
                      {t}
                    </button>
                  ))}
                </div>
             </div>
             <div className="max-w-4xl">
                {activeTab === 'news' && sources && <FilterBar items={sources.map(s => ({ id: s, name: s }))} selectedId={selectedSource} onSelect={setSelectedSource} />}
                {activeTab === 'video' && channels && <FilterBar items={channels.map(c => ({ id: c.id, name: c.name }))} selectedId={selectedChannel} onSelect={setSelectedChannel} />}
             </div>
             {activeTab === 'video' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {(selectedChannel ? videos : feedVideos).map(v => <VideoCard key={v.id} video={v} />)}
                </div>
              ) : (
                <div className="space-y-12">
                  {(activeTab === 'news' || selectedSource ? articles : feedArticles).map((a, i) => (
                    <ArticleCard key={a.id} article={a} variant="list" index={i} className="bg-white/50 backdrop-blur-sm" />
                  ))}
                </div>
              )}
              <div ref={loadMoreRef} className="py-32 flex justify-center">
                {(hasMoreArticles || hasMoreVideos) ? (
                  <div className="flex items-center gap-4 text-muted-foreground animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-primary" /><span className="text-[10px] font-black uppercase tracking-[0.4em]">Finding more content</span>
                  </div>
                ) : <div className="text-[10px] font-black uppercase tracking-[0.4em] text-bark-300">You've reached the frontier</div>}
              </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
