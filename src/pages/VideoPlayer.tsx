import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { SEOHead } from "@/components/SEOHead";
import { ShareSidebar } from "@/components/ShareSidebar";
import { useVideos } from "@/hooks/use-videos";
import { ArrowLeft, Newspaper, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useClubsContext } from "@/contexts/ClubsContext";
import { VideoPreviewCard } from "@/components/VideoPreviewCard";
import { Footer } from "@/components/Footer";


const VideoPlayer = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: videos, isLoading } = useVideos(50);
  const video = videos?.find((v) => v.slug === slug);
  const { getClubById } = useClubsContext();
  const clubData = video?.club_ids?.map((id) => getClubById(id)).filter(Boolean) ?? [];

  return (
    <div className="min-h-screen bg-background">
      {video && (
        <SEOHead
          title={video.title}
          description={video.description || video.title}
          image={video.thumbnail_url || undefined}
          url={`${window.location.origin}/video/${video.slug}`}
          type="video.other"
          publishedAt={video.published_at}
          videoId={video.video_id}
          thumbnailUrl={video.thumbnail_url || undefined}
        />
      )}
      <Header />

      <main className="container py-6">
        <Link
          to="/videos"
          className="inline-flex items-center gap-1 text-xs font-nav font-bold uppercase tracking-wider text-muted-foreground hover:text-italia-red transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Videos
        </Link>


        {isLoading && (
          <div>
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-6 mt-4 w-2/3" />
            <Skeleton className="h-4 mt-2 w-1/4" />
          </div>
        )}

        {!isLoading && !video && (
          <p className="py-16 text-center text-muted-foreground">Video not found.</p>
        )}

        {video && (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="hidden lg:block">
              <ShareSidebar url={window.location.href} title={video.title} />
            </div>
            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <iframe
                  src={`https://www.youtube.com/embed/${video.video_id}?rel=0&modestbranding=1`}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Club pill tags */}
              {clubData.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-4 mb-2" onClick={(e) => e.preventDefault()}>
                  {clubData.map((c) => (
                    <Link
                      key={c!.id}
                      to={`/?club=${c!.id}`}
                      className="club-tag-inline text-[10px] font-heading font-bold uppercase tracking-wide px-1.5 py-0.5 rounded hover:opacity-80 transition-opacity"
                      style={{
                        color: `hsl(${c!.color})`,
                        backgroundColor: `hsl(${c!.color} / 0.12)`,
                        '--club-tag-color': `hsl(${c!.color})`,
                      } as React.CSSProperties}
                    >
                      {c!.shortName}
                    </Link>
                  ))}
                </div>
              )}

              <h1 className="text-lg md:text-xl font-bold font-headline leading-snug">
                {video.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 mb-4 pb-4 border-b-2 border-italia-green">
                <time>{format(new Date(video.published_at), "MMMM d, yyyy")}</time>
              </div>

              <div className="lg:hidden mb-6">
                <ShareSidebar url={window.location.href} title={video.title} />
              </div>

              <a
                href={`https://www.youtube.com/watch?v=${video.video_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-italia-red transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Having trouble? Watch on YouTube
              </a>
              {video.description && (
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {video.description}
                </p>
              )}

              {/* Watch Next section */}
              {(() => {
                const nextVideos = videos
                  ?.filter((v) => v.video_id !== video.video_id)
                  .slice(0, 3);
                if (!nextVideos || nextVideos.length === 0) return null;
                return (
                  <section className="mt-10">
                    <h2 className="text-xs font-nav font-bold uppercase tracking-[0.15em] text-italia-red mb-4 pb-2 border-b-2 border-italia-red">
                      Watch Next
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {nextVideos.map((v) => (
                        <VideoPreviewCard key={v.id} video={v} />
                      ))}
                    </div>
                  </section>
                );
              })()}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Mobile FAB: switch to News */}
      <Link
        to="/"
        className="fixed bottom-6 right-6 z-50 md:hidden flex items-center gap-2 bg-italia-red text-white rounded-full px-4 py-3 shadow-lg hover:bg-italia-red/90 active:scale-95 transition-all"
        aria-label="Switch to News"
      >
        <Newspaper className="h-5 w-5" />
        <span className="text-xs font-nav font-bold uppercase tracking-wider">News</span>
      </Link>
    </div>
  );
};

export default VideoPlayer;
