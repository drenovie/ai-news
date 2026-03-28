import { useClubsContext } from "@/contexts/ClubsContext";

export function useClubs(league?: "serie_a" | "serie_b") {
  const { clubs, isLoading } = useClubsContext();
  const filtered = league ? clubs.filter((c) => c.league === league) : clubs;
  return { data: filtered, isLoading };
}
