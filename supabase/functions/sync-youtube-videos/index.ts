import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Club name → id mapping for title parsing
const CLUB_ALIASES: Record<string, string> = {
  "atalanta": "atalanta",
  "bologna": "bologna",
  "cagliari": "cagliari",
  "como": "como",
  "empoli": "empoli",
  "fiorentina": "fiorentina",
  "genoa": "genoa",
  "inter": "inter",
  "juventus": "juventus",
  "juve": "juventus",
  "lazio": "lazio",
  "lecce": "lecce",
  "milan": "milan",
  "ac milan": "milan",
  "monza": "monza",
  "napoli": "napoli",
  "parma": "parma",
  "roma": "roma",
  "as roma": "roma",
  "torino": "torino",
  "udinese": "udinese",
  "venezia": "venezia",
  "verona": "verona",
  "hellas verona": "verona",
  // Serie B
  "bari": "bari",
  "brescia": "brescia",
  "catanzaro": "catanzaro",
  "cesena": "cesena",
  "cittadella": "cittadella",
  "cosenza": "cosenza",
  "cremonese": "cremonese",
  "frosinone": "frosinone",
  "juve stabia": "juve-stabia",
  "mantova": "mantova",
  "modena": "modena",
  "palermo": "palermo",
  "pisa": "pisa",
  "reggiana": "reggiana",
  "salernitana": "salernitana",
  "sampdoria": "sampdoria",
  "sassuolo": "sassuolo",
  "spezia": "spezia",
  "sudtirol": "sudtirol",
  "südtirol": "sudtirol",
  "carrarese": "carrarese",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

function parseClubIds(title: string): string[] {
  const titleLower = title.toLowerCase();
  const found = new Set<string>();

  // Sort aliases by length descending so longer matches take priority
  const sortedAliases = Object.entries(CLUB_ALIASES).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [alias, clubId] of sortedAliases) {
    // Word boundary match using regex
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?:^|[\\s\\-|,])${escaped}(?:[\\s\\-|,.'!?]|$)`, "i");
    if (regex.test(titleLower)) {
      found.add(clubId);
    }
  }

  return Array.from(found);
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

function extractEntries(xml: string): string[] {
  const entries: string[] = [];
  const pattern = /<entry[\s>]([\s\S]*?)<\/entry>/gi;
  let match;
  while ((match = pattern.exec(xml)) !== null) {
    entries.push(match[0]);
  }
  return entries;
}

function extractVideoId(entryXml: string): string {
  const match = entryXml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/i);
  return match ? match[1].trim() : "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: channels, error: chError } = await supabase
      .from("video_channels")
      .select("*")
      .eq("is_active", true);

    if (chError) throw chError;
    if (!channels || channels.length === 0) {
      return new Response(
        JSON.stringify({ message: "No active video channels" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    let totalSynced = 0;
    const errors: string[] = [];

    for (const channel of channels) {
      try {
        const channelCreatedAt = new Date(channel.created_at);
        const cutoffDate = channelCreatedAt > twoDaysAgo ? channelCreatedAt : twoDaysAgo;

        const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.channel_id}`;
        const response = await fetch(feedUrl, {
          headers: { "User-Agent": "ItaliaKick-YT/1.0" },
        });

        if (!response.ok) {
          errors.push(`${channel.name}: HTTP ${response.status}`);
          continue;
        }

        const xml = await response.text();
        const entries = extractEntries(xml);
        const videos = [];

        for (const entryXml of entries) {
          const title = extractText(entryXml, "title");
          const videoId = extractVideoId(entryXml);
          if (!title || !videoId) continue;

          if (channel.title_filter) {
            if (!title.toLowerCase().includes(channel.title_filter.toLowerCase())) {
              continue;
            }
          }

          const published = extractText(entryXml, "published");
          const publishedAt = published ? new Date(published) : new Date();

          if (publishedAt < cutoffDate) continue;

          const description = extractText(entryXml, "media:description") ||
            extractText(entryXml, "summary") || "";

          // Parse club IDs from title, fall back to channel-level club_ids
          const parsedClubs = parseClubIds(title);
          const clubIds = parsedClubs.length > 0 ? parsedClubs : (channel.club_ids || []);

          const slug = slugify(title) + "-" + videoId.slice(0, 6).replace(/[^a-z0-9]/gi, "").toLowerCase();

          // Check embeddability via oEmbed
          let embeddable = true;
          try {
            const oembedRes = await fetch(
              `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
            );
            embeddable = oembedRes.ok;
          } catch {
            // If oEmbed check fails, assume embeddable
          }

          videos.push({
            video_id: videoId,
            slug,
            channel_id: channel.id,
            title,
            description: description.slice(0, 2000),
            thumbnail_url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            published_at: publishedAt.toISOString(),
            club_ids: clubIds,
            embeddable,
          });
        }

        if (videos.length > 0) {
          const { error: upsertError } = await supabase
            .from("videos")
            .upsert(videos, { onConflict: "video_id", ignoreDuplicates: false });

          if (upsertError) {
            errors.push(`${channel.name}: upsert error - ${upsertError.message}`);
          } else {
            totalSynced += videos.length;
          }
        }

        await supabase
          .from("video_channels")
          .update({ last_synced_at: new Date().toISOString() })
          .eq("id", channel.id);
      } catch (err) {
        errors.push(`${channel.name}: ${(err as Error).message}`);
      }
    }

    return new Response(
      JSON.stringify({
        message: `Synced ${totalSynced} videos from ${channels.length} channels`,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
