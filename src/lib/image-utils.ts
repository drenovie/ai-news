/**
 * Proxy external images through wsrv.nl for on-the-fly resizing and WebP conversion.
 * This dramatically reduces bandwidth for large external images displayed at small sizes.
 */
export function getOptimizedImageUrl(
  url: string | undefined | null,
  width: number,
  height?: number
): string {
  if (!url) return "/placeholder.svg";

  // Don't proxy local/relative URLs or already-proxied URLs
  if (url.startsWith("/") || url.startsWith("data:") || url.includes("wsrv.nl")) {
    return url;
  }

  const params = new URLSearchParams({
    url,
    w: String(width),
    output: "webp",
    q: "80",
  });

  if (height) {
    params.set("h", String(height));
    params.set("fit", "cover");
  }

  return `https://wsrv.nl/?${params.toString()}`;
}

export function getFallbackImage(title: string): string {
  const techIds = [
    'photo-1677442136019-21780ecad995', // AI Robot
    'photo-1620712943543-bcc4688e7485', // Circuitry
    'photo-1485827404703-89b55fcc595e', // Future tech
    'photo-1518770660439-4636190af475', // Hardware
    'photo-1550751827-4bd374c3f58b', // Cyber security
    'photo-1531297484001-80022131f5a1', // Laptop/Code
  ];
  
  const index = Math.abs(title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % techIds.length;
  const id = techIds[index];

  return `https://images.unsplash.com/${id}?q=80&w=1200&auto=format&fit=crop`;
}
