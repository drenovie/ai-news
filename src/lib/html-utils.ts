/**
 * Strip leading <img> tag and all HTML tags, returning plain text.
 * Useful for generating clean snippets from RSS content.
 */
export function stripHtmlToText(html: string): string {
  return html
    .replace(/^\s*<img[^>]*>\s*/i, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}
