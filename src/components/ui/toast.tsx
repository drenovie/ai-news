import * as React from 'react'
import { type ToastProps, ToastProvider, ToastViewport } from '@radix-ui/react-toast'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('group pointer-events-auto fixed bottom-4 right-4 z-50 flex max-w-[420px] flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full', className)}
    {...props}
  />
))
Toast.displayName = 'Toast'

const ToastClose = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(
  ({ className, ...props }, ref) => (
    <button ref={ref} className={cn('absolute right-2 top-2 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none group-hover:opacity-100', className)} {...props}>
      <X className="h-4 w-4" />
    </button>
  )
)

export { Toast, ToastClose, ToastProvider, ToastViewport }
