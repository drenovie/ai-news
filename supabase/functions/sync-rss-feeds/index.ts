import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

function extractText(xml: string, tag: string): string {
  const cdataPattern = new RegExp(
    `<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`,
    "i"
  );
  const cdataMatch = xml.match(cdataPattern);
  if (cdataMatch) return cdataMatch[1].trim();

  const pattern = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = xml.match(pattern);
  return match ? match[1].trim().replace(/<[^>]+>/g, "") : "";
}

function extractImage(itemXml: string): string {
  const mediaMatch = itemXml.match(/<media:content[^>]+url=["']([^"']+)["']/i);
  if (mediaMatch) return mediaMatch[1];
  const thumbMatch = itemXml.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
  if (thumbMatch) return thumbMatch[1];
  const encMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image/i);
  if (encMatch) return encMatch[1];
  const imgMatch = itemXml.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];
  return "";
}

function extractItems(xml: string): string[] {
  const items: string[] = [];
  const rssPattern = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = rssPattern.exec(xml)) !== null) {
    items.push(match[0]);
  }
  if (items.length > 0) return items;
  const atomPattern = /<entry[\s>]([\s\S]*?)<\/entry>/gi;
  while ((match = atomPattern.exec(xml)) !== null) {
    items.push(match[0]);
  }
  return items;
}

function extractGuid(itemXml: string): string {
  const guid = extractText(itemXml, "guid");
  if (guid) return guid;
  const id = extractText(itemXml, "id");
  if (id) return id;
  return extractLink(itemXml) || "";
}

function extractLink(itemXml: string): string {
  const atomLink = itemXml.match(/<link[^>]+rel=["']alternate["'][^>]+href=["']([^"']+)["']/i);
  if (atomLink) return atomLink[1];
  const atomLink2 = itemXml.match(/<link[^>]+href=["']([^"']+)["']/i);
  if (atomLink2) return atomLink2[1];
  return extractText(itemXml, "link");
}

function extractComments(itemXml: string): string {
  return extractText(itemXml, "comments");
}

/**
 * Fetch the og:image meta tag from a URL as a fallback image source.
 * Times out after 5 seconds. Returns empty string on any failure.
 */
async function fetchOgImage(url: string): Promise<string> {
  if (!url) return "";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      headers: { "User-Agent": "AI-News-RSS/1.0" },
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);
    if (!res.ok) return "";
    const html = await res.text();
    // Match <meta property="og:image" content="...">
    const ogMatch = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    );
    if (ogMatch) return ogMatch[1];
    // Also try reversed attribute order
    const ogMatch2 = html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
    );
    if (ogMatch2) return ogMatch2[1];
    return "";
  } catch {
    return "";
  }
}

/**
 * Strip <smartframe-embed> tags and their wrapping <p> from content.
 */
function stripSmartFrameEmbeds(html: string): string {
  // Remove <smartframe-embed ...>...</smartframe-embed> and self-closing
  let cleaned = html.replace(/<smartframe-embed[\s\S]*?(?:<\/smartframe-embed>|\/>)/gi, "");
  // Remove empty <p> tags left behind
  cleaned = cleaned.replace(/<p>\s*<\/p>/gi, "");
  return cleaned;
}

/**
 * Basic scraper to fetch full content from a URL if the RSS feed only provides a stub.
 */
async function fetchFullContent(url: string): Promise<string> {
  if (!url || url.includes("news.ycombinator.com/item?id=")) return "";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout
    const res = await fetch(url, {
      headers: { "User-Agent": "AI-News-Scraper/1.0" },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return "";
    const html = await res.text();
    
    // Substack specific extraction
    if (url.includes("substack.com")) {
      const substackMatch = html.match(/<div[^>]+class="[^"]*body[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                           html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
      if (substackMatch) return substackMatch[1];
    }

    // General heuristic: look for <article>
    const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch) return articleMatch[1];
    
    // Fallback: collect significant paragraph blocks
    const paragraphs = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
    if (paragraphs && paragraphs.length > 5) {
      // Return first 15 paragraphs to avoid massive payloads while getting the meat
      return paragraphs.slice(0, 15).join("");
    }
    
    return "";
  } catch {
    return "";
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: feeds, error: feedsError } = await supabase
      .from("rss_feeds")
      .select("*")
      .eq("is_active", true);

    if (feedsError) throw feedsError;
    if (!feeds || feeds.length === 0) {
      return new Response(
        JSON.stringify({ message: "No active feeds" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let totalSynced = 0;
    const errors: string[] = [];

    for (const feed of feeds) {
      try {
        const response = await fetch(feed.url, {
          headers: { "User-Agent": "AI-News-RSS/1.0" },
        });
        if (!response.ok) {
          errors.push(`${feed.name}: HTTP ${response.status}`);
          continue;
        }

        const xml = await response.text();
        const items = extractItems(xml);
        const articles = [];

        for (const itemXml of items) {
          const title = extractText(itemXml, "title");
          const guid = extractGuid(itemXml);
          if (!title || !guid) continue;
          if (/liveblog/i.test(title)) continue;

          const description = extractText(itemXml, "description");
          const contentEncoded = extractText(itemXml, "content:encoded") || extractText(itemXml, "content");
          const rawContent = contentEncoded || description;
          
          // Strip SmartFrame embeds from content
          let content = rawContent ? stripSmartFrameEmbeds(rawContent) : "";
          
          // SCRAPER LOGIC: If content is just an HN comments link or very short, try fetching the actual page
          if (feed.name === "Hacker News" || (content.length < 300 && sourceUrl)) {
            const fullContent = await fetchFullContent(sourceUrl);
            if (fullContent && fullContent.length > content.length) {
              content = fullContent;
            }
          }
          
          // Better snippet logic: use description if available, otherwise strip HTML from content
          const cleanDescription = description ? description.replace(/<[^>]+>/g, "").trim() : "";
          const snippet = cleanDescription || content?.replace(/<[^>]+>/g, "").slice(0, 300).trim() || "";

          const pubDateStr =
            extractText(itemXml, "pubDate") ||
            extractText(itemXml, "published") ||
            extractText(itemXml, "updated");
          const publishedAt = pubDateStr
            ? new Date(pubDateStr).toISOString()
            : new Date().toISOString();

          const sourceUrl = extractLink(itemXml);
          const commentsUrl = extractComments(itemXml);
          let imageUrl = extractImage(itemXml);

          // OG image fallback: if no image found in RSS, try fetching og:image from source
          if (!imageUrl && sourceUrl) {
            imageUrl = await fetchOgImage(sourceUrl);
          }

          const slug =
            slugify(title) + "-" + guid.slice(-6).replace(/[^a-z0-9]/gi, "");

          articles.push({
            slug,
            title,
            snippet,
            content: content?.slice(0, 10000) || "",
            source: feed.name,
            source_url: sourceUrl,
            source_item_url: commentsUrl || null,
            image_url: imageUrl || null,
            published_at: publishedAt,
            feed_id: feed.id,
            guid,
          });
        }

        if (articles.length > 0) {
          const { error: upsertError } = await supabase
            .from("articles")
            .upsert(articles, { onConflict: "guid" }); // Removed ignoreDuplicates: true to allow updating content

          if (upsertError) {
            errors.push(
              `${feed.name}: upsert error - ${upsertError.message}`
            );
          } else {
            totalSynced += articles.length;
          }
        }

        await supabase
          .from("rss_feeds")
          .update({ last_synced_at: new Date().toISOString() })
          .eq("id", feed.id);
      } catch (err) {
        errors.push(`${feed.name}: ${err.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        message: `Synced ${totalSynced} articles from ${feeds.length} feeds`,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});