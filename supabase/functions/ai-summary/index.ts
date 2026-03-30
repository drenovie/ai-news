import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const atlasKey = Deno.env.get("ATLASCLOUD_API_KEY");
    
    console.log("ATLASCLOUD_API_KEY present:", !!atlasKey);
    if (atlasKey) {
      console.log("Key prefix:", atlasKey.substring(0, 5) + "...");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // 1. Check Cache (12 hours)
    const { data: cache } = await supabase
      .from("site_cache")
      .select("*")
      .eq("key", "top_10_trends")
      .maybeSingle();

    const now = new Date();
    const isCacheValid = cache && (now.getTime() - new Date(cache.updated_at).getTime() < 12 * 60 * 60 * 1000);

    if (isCacheValid && cache.value) {
      return new Response(JSON.stringify({ summary: cache.value, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Fetch fresh context (Lighter context for speed)
    const [{ data: articles }, { data: videos }] = await Promise.all([
      supabase.from("articles").select("title, slug").order("published_at", { ascending: false }).limit(10),
      supabase.from("videos").select("title, slug").order("published_at", { ascending: false }).limit(10)
    ]);

    const context = [
      ...(articles || []).map(a => `[ARTICLE] Title: ${a.title}, Snippet: ${a.snippet}, Slug: ${a.slug}`),
      ...(videos || []).map(v => `[VIDEO] Title: ${v.title}, Description: ${v.description?.slice(0, 200)}, Slug: ${v.slug}`)
    ].join("\n");

    const prompt = `
      Identify EXACTLY 10 significant items.
      Format: A numbered list 1 to 10.
      Each item: [Title](/article/slug) or [Title](/video/slug)
      
      RULES:
      - 10 items only.
      - Numbered list format only (1. Title).
      - Natural case (not all caps).
      - NO summaries.
      
      CONTENT:
      ${context}
    `;

    // 3. Call AtlasCloud (Streaming)
    const atlasResponse = await fetch("https://api.atlascloud.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${atlasKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: "You are a trends analyst. Use internal markdown links provided." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        stream: true
      })
    });

    if (!atlasResponse.ok) {
      const errText = await atlasResponse.text();
      console.error("AtlasCloud API Error:", atlasResponse.status, errText);
      throw new Error(`AI API Error: ${errText}`);
    }

    // Set up a TransformStream to handle the streaming data
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const reader = atlasResponse.body?.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let fullSummary = "";

    (async () => {
      try {
        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.slice(6).trim();
              if (dataStr === "[DONE]") continue;

              try {
                const data = JSON.parse(dataStr);
                const content = data.choices[0]?.delta?.content || "";
                if (content) {
                  fullSummary += content;
                  // Write RAW text to our own stream for simpler frontend parsing
                  await writer.write(encoder.encode(content));
                }
              } catch (e) {}
            }
          }
        }
      } catch (err) {
        console.error("Stream error:", err);
      } finally {
        await writer.close();
        
        // Cache the result in the background
        if (fullSummary) {
          supabase
            .from("site_cache")
            .upsert({ key: "top_10_trends", value: fullSummary, updated_at: now.toISOString() })
            .then(() => console.log("Cache updated."))
            .catch(e => console.error("Cache update failed:", e));
        }
      }
    })();

    return new Response(readable, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });

  } catch (err: any) {
    console.error("Function level error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
