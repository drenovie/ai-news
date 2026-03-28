import { Link } from "react-router-dom";
import { Play, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import type { Video } from "@/hooks/use-videos";
import { useClubsContext } from "@/contexts/ClubsContext";

interface VideoPreviewCardProps {
  video: Video;
}

export function VideoPreviewCard({ video }: VideoPreviewCardProps) {
  const { getClubById } = useClubsContext();
  const clubData = (video.club_ids ?? [])
    .map((id) => getClubById(id))
    .filter(Boolean);

  return (
    <div className="group">
      <Link to={`/video/${video.slug}`} className="block">
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center transition-colors">
            <div className="bg-italia-red/90 rounded-full p-3 shadow-lg group-hover:scale-110 transition-transform">
              <Play className="h-6 w-6 text-white fill-white" />
            </div>
          </div>
        </div>
      </Link>

      {clubData.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2" onClick={(e) => e.preventDefault()}>
          {clubData.map((club) => (
            <Link
              key={club!.id}
              to={`/?club=${club!.id}`}
              className="club-tag-inline text-[10px] font-heading font-bold uppercase tracking-wide px-1.5 py-0.5 rounded hover:opacity-80 transition-opacity"
              style={{
                color: `hsl(${club!.color})`,
                backgroundColor: `hsl(${club!.color} / 0.12)`,
                '--club-tag-color': `hsl(${club!.color})`,
              } as React.CSSProperties}
            >
              {club!.shortName}
            </Link>
          ))}
        </div>
      )}

      <Link to={`/video/${video.slug}`}>
        <h3 className="mt-1.5 text-sm font-bold font-headline leading-snug line-clamp-2 group-hover:text-italia-red transition-colors cursor-pointer">
          {video.title}
        </h3>
      </Link>
      <div className="flex items-center justify-between mt-1">
        <p className="text-[11px] text-muted-foreground">
          {format(new Date(video.published_at), "d MMM yyyy")}
        </p>
        <a
          href={`https://www.youtube.com/watch?v=${video.video_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-italia-red transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          YouTube
        </a>
      </div>
    </div>
  );
}
