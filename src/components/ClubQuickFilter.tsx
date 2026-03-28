import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useClubsContext } from "@/contexts/ClubsContext";
import { ClubBadge } from "@/components/ClubBadge";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface ClubQuickFilterProps {
  activeClubId: string | null;
  onSelect: (id: string | null) => void;
}

export function ClubQuickFilter({ activeClubId, onSelect }: ClubQuickFilterProps) {
  const { getClubById } = useClubsContext();

  const { data: topClubs } = useQuery({
    queryKey: ["top-5-clubs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("league_standings")
        .select("club_id")
        .order("position", { ascending: true })
        .limit(5);
      if (error) throw error;
      return (data ?? [])
        .map((row) => row.club_id)
        .filter(Boolean) as string[];
    },
    staleTime: 1000 * 60 * 60,
  });

  if (!topClubs || topClubs.length === 0) return null;

  const clubs = topClubs.map((id) => getClubById(id)).filter(Boolean);
  if (clubs.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide">
      {clubs.map((club) => (
        <ClubBadge
          key={club!.id}
          club={club!}
          selected={activeClubId === club!.id}
          onClick={() =>
            onSelect(activeClubId === club!.id ? null : club!.id)
          }
        />
      ))}
      <Link
        to="/clubs"
        className="inline-flex items-center gap-0.5 text-xs font-nav font-semibold text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap ml-1"
      >
        See all <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
