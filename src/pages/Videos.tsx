import { useState, useEffect } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useVideos } from "@/hooks/use-videos";
import { useAuth } from "@/hooks/use-auth";
import { useClubPreferences } from "@/hooks/use-club-preferences";
import { useClubsContext } from "@/contexts/ClubsContext";
import { Loader2, Newspaper, Heart, X } from "lucide-react";
import { VideoPreviewCard } from "@/components/VideoPreviewCard";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";

const CLUB_FILTER_KEY = "kickitalia_club_filter";

const Videos = () => {
  const { user } = useAuth();
  const { preferredClubIds } = useClubPreferences();
  const { getClubById } = useClubsContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [myClubsOnly, setMyClubsOnly] = useState(false);

  // Club filter: read from URL param or sessionStorage
  const urlClub = searchParams.get("club");
  const [clubFilter, setClubFilter] = useState<string | null>(() => {
    if (urlClub) return urlClub;
    try { return sessionStorage.getItem(CLUB_FILTER_KEY); } catch { return null; }
  });

  useEffect(() => {
    if (urlClub && urlClub !== clubFilter) {
      setClubFilter(urlClub);
      try { sessionStorage.setItem(CLUB_FILTER_KEY, urlClub); } catch {}
    }
  }, [urlClub]);

  const clearClubFilter = () => {
    setClubFilter(null);
    try { sessionStorage.removeItem(CLUB_FILTER_KEY); } catch {}
    setSearchParams((prev) => { prev.delete("club"); return prev; }, { replace: true });
  };

  // Pass club filter to DB query
  const { data: videos, isLoading, isError } = useVideos(30, clubFilter);

  const activeClub = clubFilter ? getClubById(clubFilter) : null;

  const hasPreferences = user && preferredClubIds.length > 0;

  let filtered = videos;
  if (!clubFilter && myClubsOnly && hasPreferences) {
    filtered = videos?.filter((v) => v.club_ids?.some((id) => preferredClubIds.includes(id)));
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Active club filter banner */}
        {activeClub && (
          <div className="flex items-center gap-3 mb-6 p-3 rounded-lg border border-border bg-card">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-nav font-bold shrink-0"
              style={{
                backgroundColor: `hsl(${activeClub.color} / 0.12)`,
                color: `hsl(${activeClub.color})`,
              }}
            >
              {activeClub.shortName.slice(0, 3)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-heading font-bold text-foreground">{activeClub.name}</p>
              <p className="text-xs text-muted-foreground">
                Showing videos for {activeClub.name} · {activeClub.city}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={clearClubFilter} className="shrink-0">
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-italia-red">
          <h1 className="text-xs font-nav font-bold uppercase tracking-[0.15em] text-italia-red">
            Video Highlights
          </h1>
          {hasPreferences && !clubFilter && (
            <Button
              variant={myClubsOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setMyClubsOnly(!myClubsOnly)}
              className={myClubsOnly ? "bg-italia-red hover:bg-italia-red/90 text-white" : ""}
            >
              <Heart className={`h-3.5 w-3.5 mr-1.5 ${myClubsOnly ? "fill-current" : ""}`} />
              My Clubs
            </Button>
          )}
        </div>

        {isLoading && (
          <div className="py-16 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {isError && (
          <p className="py-8 text-center text-destructive">Could not load videos.</p>
        )}

        {!isLoading && filtered && filtered.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">
            {clubFilter
              ? `No highlights from ${activeClub?.name || "this club"}.`
              : myClubsOnly
                ? "No highlights from your followed clubs."
                : "No highlights available yet."}
          </p>
        )}

        {!isLoading && filtered && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((video) => (
              <VideoPreviewCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </main>

      <Footer />

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

export default Videos;
