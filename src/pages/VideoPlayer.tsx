import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { SEOHead } from "@/components/SEOHead";
import { ShareSidebar } from "@/components/ShareSidebar";
import { useVideos, useVideoBySlug } from "@/hooks/use-videos";
import { useArticles, useArticleSources } from "@/hooks/use-articles";
import { ArrowLeft, ExternalLink, Loader2, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { VideoCard } from "@/components/VideoCard";
import { ArticleCard } from "@/components/ArticleCard";
import { Footer } from "@/components/Footer";

const VideoPlayer = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: video, isLoading: videoLoading, isError } = useVideoBySlug(slug);
  const { data: videosData } = useVideos();
  const { data: articlesData } = useArticles();
  const { data: sources } = useArticleSources();
  
  const allVideos = videosData?.pages.flat() ?? [];
  const allArticles = articlesData?.pages.flat() ?? [];
  
  // Trending news for sidebar
  const trendingArticles = allArticles.slice(0, 5);
  
  // Related videos logic
  const moreFromChannel = allVideos
    .filter((v) => v.id !== video?.id && v.channel_id === video?.channel_id)
    .slice(0, 3);

  const continueWatching = allVideos
    .filter((v) => v.id !== video?.id && v.channel_id !== video?.channel_id)
    .slice(0, 3);

  if (videoLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-32 flex justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (isError || !video) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-32 text-center space-y-4">
          <h1 className="text-4xl font-black text-bark-900 uppercase">Video not found</h1>
          <Link to="/" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs">Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <SEOHead
        title={video.title}
        description={video.description || video.title}
        image={video.thumbnail_url}
        url={`${window.location.origin}/video/${video.slug}`}
        type="video.other"
        publishedAt={video.published_at}
        videoId={video.video_id}
        thumbnailUrl={video.thumbnail_url}
      />
      <Header />

      <main className="w-full max-w-[1920px] mx-auto px-global py-12">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors mb-12 text-left"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to feed
          </Link>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sidebar Left - Sticky Share */}
            <aside className="hidden lg:block w-12 shrink-0">
              <div className="sticky top-32">
                <ShareSidebar url={shareUrl} title={video.title} />
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0 space-y-12">
              <div className="space-y-10">
                <div className="aspect-video rounded-[2.5rem] overflow-hidden bg-bark-900 shadow-2xl shadow-bark-900/20 border border-bark-900/5">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.video_id}?rel=0&modestbranding=1&autoplay=1`}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <div className="space-y-8 text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-bark-900 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-bark-900/10">
                      {(video.channelName || 'V')[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-[0.1em] text-primary mb-1">{video.channelName}</h4>
                      <div className="flex items-center gap-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span>{format(new Date(video.published_at), "MMMM d, yyyy")}</span>
                        <span className="text-bark-200">•</span>
                        <a 
                          href={`https://www.youtube.com/watch?v=${video.video_id}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 hover:text-bark-900 transition-colors"
                        >
                          YouTube Source <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <h1 className="text-3xl md:text-5xl font-black text-bark-900 leading-[1.1] uppercase tracking-tight">
                    {video.title}
                  </h1>

                  {/* Mobile Share Section */}
                  <div className="lg:hidden p-6 bg-sand-50 rounded-3xl border border-bark-200">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-bark-900 mb-4">Share this insight</h5>
                    <ShareSidebar url={shareUrl} title={video.title} />
                  </div>

                  {video.description && (
                    <div className="bg-sand-50/50 rounded-[2rem] p-10 border border-bark-200/60">
                      <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-bark-900 mb-6 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Transcribed Metadata
                      </h5>
                      <div className="text-base text-bark-700 leading-relaxed font-medium whitespace-pre-wrap selection:bg-primary/10">
                        {video.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Related/Next Sections at the bottom of the main column */}
              <footer className="pt-16 border-t border-bark-200 space-y-20 text-left">
                {moreFromChannel.length > 0 && (
                  <section>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-bark-700 mb-8 flex items-center gap-4">
                      More from {video.channelName} <div className="h-px flex-1 bg-bark-200" />
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {moreFromChannel.map((v) => (
                        <VideoCard key={v.id} video={v} />
                      ))}
                    </div>
                  </section>
                )}

                {continueWatching.length > 0 && (
                  <section>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-4">
                      Continue Watching <div className="h-px flex-1 bg-primary/20" />
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {continueWatching.map((v) => (
                        <VideoCard key={v.id} video={v} />
                      ))}
                    </div>
                  </section>
                )}
              </footer>
            </div>

            {/* Sidebar Right - Restored Side Layout */}
            <aside className="hidden lg:block w-80 shrink-0 space-y-16 text-left">
               
               {/* Most Trending News */}
               <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-bark-900">Most Trending News</h3>
                </div>
                <div className="flex flex-col gap-4">
                  {trendingArticles.map(a => (
                    <ArticleCard key={a.id} article={a} variant="compact" />
                  ))}
                </div>
              </section>

              {/* Newsletter Signup */}
              <section className="p-8 bg-bark-900 rounded-[2.5rem] text-sand-25 space-y-4 shadow-2xl shadow-bark-900/20">
                <h4 className="text-lg font-black uppercase leading-tight">Neural Pulse</h4>
                <p className="text-xs text-sand-25/60 font-medium leading-relaxed">
                  Weekly briefing on the frontier of artificial intelligence.
                </p>
                <div className="pt-2">
                  <div className="bg-sand-25/10 rounded-xl p-1.5 flex gap-2">
                    <input type="text" placeholder="your@email.com" className="bg-transparent border-none text-[10px] px-3 w-full focus:outline-none placeholder:text-sand-25/30" />
                    <button className="bg-primary text-white px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">Join</button>
                  </div>
                </div>
              </section>

              {/* Trending Sources Sidebar */}
              <section className="space-y-8 p-8 bg-sand-100 rounded-[2.5rem] border border-bark-200">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-bark-900">Top Intelligence Sources</h3>
                <div className="flex flex-wrap gap-2">
                  {sources?.slice(0, 8).map(s => (
                    <span key={s} className="px-3 py-1.5 rounded-full bg-white border border-bark-200 text-[9px] font-bold uppercase tracking-tight text-bark-700">
                      {s}
                    </span>
                  ))}
                </div>
              </section>

            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VideoPlayer;
