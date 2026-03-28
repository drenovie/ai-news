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
