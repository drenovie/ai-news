import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Toast = { id: string; message: string; type?: 'default' | 'success' | 'error' }

let toastListeners: ((t: Toast) => void)[] = []

export function toast(message: string, type: Toast['type'] = 'default') {
  toastListeners.forEach(l => l({ id: Date.now().toString(), message, type }))
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (t: Toast) => setToasts(prev => [...prev.slice(-2), t])
    toastListeners.push(listener)
    return () => { toastListeners = toastListeners.filter(l => l !== listener) }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id}
          className={cn(
            'flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-lg text-sm animate-in slide-in-from-right-full',
            t.type === 'error' && 'border-red-500/50 bg-red-500/10',
            t.type === 'success' && 'border-green-500/50 bg-green-500/10'
          )}>
          <span>{t.message}</span>
          <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))} className="text-muted-foreground hover:text-foreground">
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  )
}
