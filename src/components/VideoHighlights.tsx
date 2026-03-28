import { Link } from "react-router-dom";
import { useVideos } from "@/hooks/use-videos";
import { useAuth } from "@/hooks/use-auth";
import { useClubPreferences } from "@/hooks/use-club-preferences";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoPreviewCard } from "@/components/VideoPreviewCard";

interface VideoHighlightsProps {
  clubFilter?: string | null;
}

export function VideoHighlights({ clubFilter }: VideoHighlightsProps) {
  const { data: videos, isLoading } = useVideos(6, clubFilter);
  const { user } = useAuth();
  const { preferredClubIds } = useClubPreferences();

  let filtered = videos;

  // Only apply preference filter when no explicit club filter
  if (!clubFilter && user && preferredClubIds.length > 0) {
    filtered = videos?.filter((v) =>
      v.club_ids?.some((id) => preferredClubIds.includes(id))
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-italia-red">
        <h2 className="text-xs font-nav font-bold uppercase tracking-[0.15em] text-italia-red">
          Video Highlights
        </h2>
        <Link to="/videos" className="text-xs font-nav font-semibold uppercase tracking-wide text-italia-red hover:underline">
          See all →
        </Link>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-video rounded-lg" />
              <Skeleton className="h-4 mt-2 w-3/4" />
              <Skeleton className="h-3 mt-1 w-1/3" />
            </div>
          ))}
        </div>
      ) : !filtered || filtered.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No video highlights {clubFilter ? "for this club" : "available"} yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filtered.map((video) => (
            <VideoPreviewCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </section>
  );
}
