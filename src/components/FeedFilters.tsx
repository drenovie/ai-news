import { CHANNELS } from '@/lib/sources'
import { cn } from '@/lib/utils'

interface Props {
  selectedChannels: string[]
  onToggle: (id: string) => void
}

export function FeedFilters({ selectedChannels, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {CHANNELS.map(ch => (
        <button key={ch.id} onClick={() => onToggle(ch.id)}
          className={cn(
            'source-badge transition-colors',
            selectedChannels.includes(ch.id) ? 'bg-primary text-primary-foreground' : 'bg-secondary'
          )}>
          {ch.name}
        </button>
      ))}
    </div>
  )
}
