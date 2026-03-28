import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useClubsContext } from "@/contexts/ClubsContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Standing {
  id: string;
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  club_id: string | null;
  updated_at: string;
}

const DEFAULT_ROWS = 5;

export function LeagueTable() {
  const { getClubById } = useClubsContext();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const { data: standings, isLoading } = useQuery({
    queryKey: ["league-standings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("league_standings")
        .select("id, position, team, played, won, drawn, lost, points, club_id, updated_at")
        .order("position", { ascending: true });
      if (error) throw error;
      return data as Standing[];
    },
    staleTime: 1000 * 60 * 30,
  });

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-5 w-32 mb-4" />
        {Array.from({ length: DEFAULT_ROWS }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full mb-1.5" />
        ))}
      </div>
    );
  }

  if (!standings || standings.length === 0) return null;

  const updatedAt = standings[0]?.updated_at;
  const visibleRows = expanded ? standings : standings.slice(0, DEFAULT_ROWS);

  return (
    <div>
      <h3 className="text-xs font-nav font-bold uppercase tracking-[0.15em] text-italia-green mb-4 pb-2 border-b-2 border-italia-green">
        Serie A Table
      </h3>

      <div className="overflow-hidden">
        <table className="w-full text-[11px] leading-tight">
          <thead>
            <tr className="text-muted-foreground font-nav uppercase tracking-wider">
              <th className="text-left py-1.5 pr-1 w-5">#</th>
              <th className="text-left py-1.5">Team</th>
              <th className="text-center py-1.5 w-6">P</th>
              <th className="text-center py-1.5 w-6">W</th>
              <th className="text-center py-1.5 w-6">D</th>
              <th className="text-center py-1.5 w-6">L</th>
              <th className="text-right py-1.5 w-7 font-bold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => {
              const club = row.club_id ? getClubById(row.club_id) : null;
              return (
                <tr
                  key={row.id}
                  className="border-t border-border/50 hover:bg-muted/40 transition-colors cursor-pointer"
                  onClick={() => club && navigate(`/?club=${club.id}`)}
                >
                  <td className="py-1.5 pr-1 text-muted-foreground font-medium">
                    {row.position}
                  </td>
                  <td className="py-1.5 font-heading font-bold text-foreground truncate max-w-[120px]">
                    <span className="flex items-center gap-1.5">
                      {club && (
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: `hsl(${club.color})` }}
                        />
                      )}
                      {club?.shortName || row.team}
                    </span>
                  </td>
                  <td className="py-1.5 text-center text-muted-foreground">{row.played}</td>
                  <td className="py-1.5 text-center text-muted-foreground">{row.won}</td>
                  <td className="py-1.5 text-center text-muted-foreground">{row.drawn}</td>
                  <td className="py-1.5 text-center text-muted-foreground">{row.lost}</td>
                  <td className="py-1.5 text-right font-bold text-foreground">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {standings.length > DEFAULT_ROWS && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-2 py-1.5 flex items-center justify-center gap-1 text-[11px] font-nav font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? (
            <>Show top {DEFAULT_ROWS} <ChevronUp className="h-3 w-3" /></>
          ) : (
            <>Full table <ChevronDown className="h-3 w-3" /></>
          )}
        </button>
      )}

      {updatedAt && (
        <p className="text-[10px] text-muted-foreground mt-2">
          Updated {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
        </p>
      )}
    </div>
  );
}
