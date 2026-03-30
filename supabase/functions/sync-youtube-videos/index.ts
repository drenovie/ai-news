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

    let totalSynced = 0;
    const errors: string[] = [];

    for (const channel of channels) {
      try {
        const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.channel_id}`;
        const response = await fetch(feedUrl, {
          headers: { "User-Agent": "AI-News-YT/1.0" },
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

          const description = extractText(entryXml, "media:description") ||
            extractText(entryXml, "summary") || "";

          const slug = slugify(title) + "-" + videoId.slice(0, 6).replace(/[^a-z0-9]/gi, "").toLowerCase();

          videos.push({
            video_id: videoId,
            slug,
            channel_id: channel.id,
            title,
            description: description.slice(0, 2000),
            thumbnail_url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            published_at: publishedAt.toISOString(),
            embeddable: true,
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