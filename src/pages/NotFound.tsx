export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <p className="text-muted-foreground">Page not found</p>
        <a href="/" className="mt-4 inline-block text-primary hover:underline">Go home</a>
      </div>
    </div>
  )
}
