import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Fetches the current season's Serie A and Serie B team lists from
 * Wikipedia's REST API (returns HTML of the page).  Parses team names
 * from the page and returns them.  This is meant to be run manually
 * once a year after promotions/relegations are confirmed.
 */

interface WikiClub {
  name: string;
  city: string;
  league: "serie_a" | "serie_b";
}

async function fetchWikipediaPage(title: string): Promise<string> {
  const url = `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(title)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "KickItalia-Bot/1.0" },
  });
  if (!res.ok) throw new Error(`Wikipedia returned ${res.status} for ${title}`);
  return res.text();
}

function extractTeamsFromWikipediaHtml(html: string): string[] {
  // Wikipedia team tables typically have links with team names.
  // We look for patterns like: <a ...>Team Name</a> inside table rows.
  // The "Clubs" or "Teams" section usually has a wikitable with team info.
  const teams: string[] = [];

  // Match table rows that contain team links — look for <td> cells with links
  // Pattern: find all anchor tags within table cells
  const tdPattern = /<td[^>]*>[\s\S]*?<\/td>/gi;
  const cells = html.match(tdPattern) || [];

  for (const cell of cells) {
    // Look for links that are likely team names (not footnotes, not external)
    const linkPattern = /<a[^>]+href="\.\/([^"#]+)"[^>]*>([^<]+)<\/a>/gi;
    let match;
    while ((match = linkPattern.exec(cell)) !== null) {
      const text = match[2].trim();
      // Filter: team names are typically 2+ chars, not numbers, not common wiki words
      if (
        text.length > 2 &&
        !/^\d+$/.test(text) &&
        !["Serie A", "Serie B", "Italy", "UEFA", "FIFA", "Season"].includes(text)
      ) {
        // Only add if it looks like a proper noun (starts with uppercase)
        if (/^[A-ZÀ-Ž]/.test(text) && !teams.includes(text)) {
          teams.push(text);
        }
      }
    }
  }

  return teams;
}

function getCurrentSeasonSlug(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  if (m >= 7) {
    return `${y}–${(y + 1).toString().slice(-2)}`;
  }
  return `${y - 1}–${y.toString().slice(-2)}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const season = getCurrentSeasonSlug();
    console.log(`Fetching clubs for season: ${season}`);

    // Fetch Serie A and Serie B Wikipedia pages
    const serieATitle = `${season}_Serie_A`;
    const serieBTitle = `${season}_Serie_B`;

    console.log(`Fetching: ${serieATitle}`);
    const [serieAHtml, serieBHtml] = await Promise.all([
      fetchWikipediaPage(serieATitle),
      fetchWikipediaPage(serieBTitle),
    ]);

    const serieATeams = extractTeamsFromWikipediaHtml(serieAHtml);
    const serieBTeams = extractTeamsFromWikipediaHtml(serieBHtml);

    // Also try the Wikipedia API for structured data as a fallback
    const serieAStructured = await fetchTeamsFromWikiApi(serieATitle);
    const serieBStructured = await fetchTeamsFromWikiApi(serieBTitle);

    return new Response(
      JSON.stringify({
        season,
        serie_a: {
          html_extracted: serieATeams.slice(0, 30), // limit noise
          api_extracted: serieAStructured,
        },
        serie_b: {
          html_extracted: serieBTeams.slice(0, 30),
          api_extracted: serieBStructured,
        },
        instructions:
          "Review the extracted team names above. Use them to manually update src/lib/mock-data.ts with the correct clubs for the current season. The html_extracted list may contain some noise — cross-reference with api_extracted.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

/**
 * Uses Wikipedia's API to get the page summary/extract which often lists
 * teams in a more structured way.
 */
async function fetchTeamsFromWikiApi(pageTitle: string): Promise<string[]> {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&prop=wikitext&section=0&format=json&origin=*`;
    const res = await fetch(url, {
      headers: { "User-Agent": "KickItalia-Bot/1.0" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const wikitext: string = data?.parse?.wikitext?.["*"] || "";

    // Extract team names from wikitext — typically formatted as [[Team Name]]
    const teams: string[] = [];
    const pattern = /\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]/g;
    let match;
    while ((match = pattern.exec(wikitext)) !== null) {
      const name = match[1].trim();
      if (
        name.length > 2 &&
        !name.startsWith("File:") &&
        !name.startsWith("Category:") &&
        !name.includes("Serie") &&
        !name.includes("season") &&
        !name.includes("Italy") &&
        !/^\d{4}/.test(name)
      ) {
        if (!teams.includes(name)) {
          teams.push(name);
        }
      }
    }
    return teams;
  } catch {
    return [];
  }
}
