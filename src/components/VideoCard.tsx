import { VideoItem } from '@/pages/Index'
import { formatDistanceToNow } from 'date-fns'

export function VideoCard({ video }: { video: VideoItem }) {
  const views = video.viewCount ? formatViews(video.viewCount) : null

  return (
    <a href={video.videoUrl} target="_blank" rel="noopener noreferrer"
      className="video-card group block">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-secondary overflow-hidden">
        {video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z"/>
            </svg>
          </div>
        )}
        {video.duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
            {video.duration}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
          {video.title}
        </h3>
        <div className="flex items-center gap-2">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(video.channelName)}&background=random`}
            alt={video.channelName}
            className="w-5 h-5 rounded-full"
          />
          <span className="text-xs text-muted-foreground truncate">{video.channelName}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {views && <span>{views} views</span>}
          <span>{formatTimeAgo(video.publishedAt)}</span>
        </div>
      </div>
    </a>
  )
}

function formatViews(v: string): string {
  const n = parseInt(v)
  if (isNaN(n)) return v
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

function formatTimeAgo(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
      .replace('about ', '').replace('less than a minute ago', 'just now')
  } catch {
    return dateStr
  }
}
