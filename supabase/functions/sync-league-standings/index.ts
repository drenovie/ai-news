import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Map Wikipedia team names to our club IDs
const TEAM_ALIASES: Record<string, string> = {
  "AC Milan": "milan",
  Milan: "milan",
  "AS Roma": "roma",
  Roma: "roma",
  Atalanta: "atalanta",
  Bologna: "bologna",
  Cagliari: "cagliari",
  Como: "como",
  "Como 1907": "como",
  Cremonese: "cremonese",
  "U.S. Cremonese": "cremonese",
  Fiorentina: "fiorentina",
  "ACF Fiorentina": "fiorentina",
  Genoa: "genoa",
  "Genoa CFC": "genoa",
  "Hellas Verona": "verona",
  Verona: "verona",
  "Inter Milan": "inter",
  Internazionale: "inter",
  Inter: "inter",
  Juventus: "juventus",
  Lazio: "lazio",
  "S.S. Lazio": "lazio",
  Lecce: "lecce",
  "U.S. Lecce": "lecce",
  Napoli: "napoli",
  "SSC Napoli": "napoli",
  Parma: "parma",
  "Parma Calcio 1913": "parma",
  Pisa: "pisa",
  Sassuolo: "sassuolo",
  "U.S. Sassuolo": "sassuolo",
  Torino: "torino",
  "Torino FC": "torino",
  Udinese: "udinese",
  "Udinese Calcio": "udinese",
  Empoli: "empoli",
  Monza: "monza",
  "AC Monza": "monza",
  Venezia: "venezia",
  "Venezia FC": "venezia",
  Sampdoria: "sampdoria",
  Frosinone: "frosinone",
  Salernitana: "salernitana",
};

function resolveClubId(teamName: string): string | null {
  if (TEAM_ALIASES[teamName]) return TEAM_ALIASES[teamName];
  const cleaned = teamName.replace(/\s*\([A-Z]+\)\s*$/, "").trim();
  if (TEAM_ALIASES[cleaned]) return TEAM_ALIASES[cleaned];
  const lower = cleaned.toLowerCase();
  for (const [alias, id] of Object.entries(TEAM_ALIASES)) {
    if (alias.toLowerCase() === lower) return id;
  }
  return null;
}

interface StandingRow {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  club_id: string | null;
}

function stripHtml(s: string): string {
  // Remove <style> blocks entirely
  let clean = s.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  // Remove data-sort-value spans
  clean = clean.replace(/<span[^>]*data-sort-value[^>]*>.*?<\/span>/gi, "");
  // Remove all remaining HTML tags
  clean = clean.replace(/<[^>]*>/g, "");
  // Decode common entities
  clean = clean
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, "");
  return clean.replace(/\s+/g, " ").trim();
}

function parseStandingsFromHtml(html: string): StandingRow[] {
  const rows: StandingRow[] = [];

  // Find tables — try multiple class patterns
  const tablePattern = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let tableMatch;

  while ((tableMatch = tablePattern.exec(html)) !== null) {
    const tableHtml = tableMatch[1];

    // Must have Pts and Pld columns
    const stripped = stripHtml(tableHtml);
    if (!/\bPts\b/.test(stripped) || !/\bPld\b/.test(stripped)) continue;
    if (!/\bPos\b/.test(stripped)) continue;

    console.log("Found candidate standings table");

    // Extract all <tr> rows
    const trPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let trMatch;
    let headerCols: string[] = [];

    while ((trMatch = trPattern.exec(tableHtml)) !== null) {
      const rowHtml = trMatch[1];

      // Extract all cells (<th> and <td>)
      const cellPattern = /<t([hd])[^>]*>([\s\S]*?)<\/t\1>/gi;
      const rawCells: { tag: string; html: string; text: string }[] = [];
      let cellMatch;
      while ((cellMatch = cellPattern.exec(rowHtml)) !== null) {
        const cellHtml = cellMatch[2];
        // For team cells, try to extract link text first
        const linkMatch = cellHtml.match(/<a[^>]*title="[^"]*"[^>]*>([^<]+)<\/a>/);
        const text = linkMatch ? linkMatch[1].trim() : stripHtml(cellHtml);
        rawCells.push({ tag: cellMatch[1], html: cellHtml, text });
      }

      if (rawCells.length < 5) continue;
      const cells = rawCells.map((c) => c.text);

      // Detect header row - normalize header text (may contain CSS noise)
      if (headerCols.length === 0) {
        const normalized = cells.map((c) => {
          // Extract just the first word/abbreviation before any noise
          const m = c.match(/^([A-Za-z]+)/);
          return m ? m[1] : c;
        });
        const hasPos = normalized.some((c) => /^Pos$/i.test(c));
        const hasPts = normalized.some((c) => /^Pts$/i.test(c));
        if (hasPos && hasPts) {
          headerCols = normalized;
          console.log(`Header: ${JSON.stringify(headerCols)}`);
          continue;
        }
      }

      if (headerCols.length === 0) continue;

      const get = (names: string[]): string => {
        for (const name of names) {
          const idx = headerCols.findIndex(
            (h) => h.toLowerCase() === name.toLowerCase() || h.toLowerCase().startsWith(name.toLowerCase()),
          );
          if (idx !== -1 && idx < cells.length) return cells[idx];
        }
        return "0";
      };

      const pos = parseInt(get(["Pos", "#"]), 10);
      const team = get(["Team", "Club"]);
      if (!pos || pos > 25 || !team || team === "0" || team.length < 2) continue;

      rows.push({
        position: pos,
        team,
        played: parseInt(get(["Pld", "P", "MP"]), 10) || 0,
        won: parseInt(get(["W", "Won"]), 10) || 0,
        drawn: parseInt(get(["D", "Drawn"]), 10) || 0,
        lost: parseInt(get(["L", "Lost"]), 10) || 0,
        goals_for: parseInt(get(["GF", "F"]), 10) || 0,
        goals_against: parseInt(get(["GA", "A"]), 10) || 0,
        goal_difference: parseInt(get(["GD"]), 10) || 0,
        points: parseInt(get(["Pts", "Points"]), 10) || 0,
        club_id: resolveClubId(team),
      });
    }

    if (rows.length >= 10) break;
  }

  return rows;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let wikiUrl = "2025%E2%80%9326_Serie_A";
    try {
      const body = await req.json();
      if (body?.wiki_page) wikiUrl = body.wiki_page;
    } catch {
      /* no body */
    }

    const pageTitle = decodeURIComponent(wikiUrl).replace(/^https?:\/\/en\.wikipedia\.org\/wiki\//, "");

    console.log(`Fetching Wikipedia page: ${pageTitle}`);

    // Use action=render for fully rendered HTML with templates expanded
    const url = `https://en.wikipedia.org/w/index.php?title=${encodeURIComponent(pageTitle)}&action=render`;
    const res = await fetch(url, {
      headers: { "User-Agent": "KickItalia-Bot/1.0" },
    });
    if (!res.ok) throw new Error(`Wikipedia returned ${res.status}`);
    const html = await res.text();
    console.log(`HTML length: ${html.length}`);

    const standings = parseStandingsFromHtml(html);
    console.log(`Parsed ${standings.length} standings rows`);

    if (standings.length === 0) {
      return new Response(JSON.stringify({ error: "No standings found in page", pageTitle }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { error: deleteError } = await supabase.from("league_standings").delete().gte("position", 0);
    if (deleteError) console.error("Delete error:", deleteError);

    const now = new Date().toISOString();
    const { error: insertError } = await supabase
      .from("league_standings")
      .insert(standings.map((s) => ({ ...s, updated_at: now })));

    if (insertError) throw new Error(`Insert error: ${insertError.message}`);

    return new Response(
      JSON.stringify({
        message: `Synced ${standings.length} standings rows`,
        standings: standings.map((s) => `${s.position}. ${s.team} (${s.club_id || "?"}) - ${s.points} pts`),
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
