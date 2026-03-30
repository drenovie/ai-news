import { Video } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface VideoCardProps {
  video: Video;
  variant?: "grid" | "compact";
  className?: string;
}

export function VideoCard({ video, variant = "grid", className }: VideoCardProps) {
  const videoLink = `/video/${video.slug}`

  if (variant === "compact") {
    return (
      <Link 
        to={videoLink}
        className={cn("group flex items-center gap-3 p-2 rounded-xl hover:bg-sand-50 transition-colors", className)}
      >
        <div className="shrink-0 w-20 aspect-video rounded-lg overflow-hidden border border-bark-200/50 relative">
          <img src={video.thumbnail_url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-bark-900/10 group-hover:bg-bark-900/0 transition-colors">
            <div className="w-6 h-6 rounded-full bg-primary/90 flex items-center justify-center text-white scale-75">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3 ml-0.5"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-bark-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {video.title}
          </h4>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-1">
            {video.channelName}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link to={videoLink}
      className={cn("video-card group block bg-sand-50 border border-bark-200 rounded-3xl overflow-hidden hover:bg-white transition-all hover:shadow-2xl hover:shadow-bark-900/5 hover:-translate-y-1", className)}>
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {video.thumbnail_url ? (
          <img src={video.thumbnail_url} alt={video.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-sand-100 text-bark-300">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z"/>
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-bark-900/0 group-hover:bg-bark-900/10 transition-colors duration-300" />
      </div>

      {/* Content Info */}
      <div className="p-5 space-y-4">
        <h3 className="text-sm font-bold text-bark-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-bark-900 flex items-center justify-center text-[8px] font-bold text-white uppercase shrink-0">
              {(video.channelName || 'YT')[0]}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate max-w-[100px]">
              {video.channelName}
            </span>
          </div>
          <span className="text-[9px] font-bold text-bark-300 uppercase tracking-tighter">
            {formatDate(video.published_at)}
          </span>
        </div>
      </div>
    </Link>
  )
}
