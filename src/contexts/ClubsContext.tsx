import { createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Club } from "@/lib/types";

interface ClubsContextValue {
  clubs: Club[];
  getClubById: (id: string) => Club | undefined;
  isLoading: boolean;
}

const ClubsContext = createContext<ClubsContextValue>({
  clubs: [],
  getClubById: () => undefined,
  isLoading: true,
});

export function ClubsProvider({ children }: { children: React.ReactNode }) {
  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["clubs-all"],
    queryFn: async (): Promise<Club[]> => {
      const { data, error } = await supabase
        .from("clubs")
        .select("id, name, short_name, league, city, color")
        .order("name");
      if (error) throw error;
      return (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        shortName: row.short_name,
        logo: "",
        league: row.league as "serie_a" | "serie_b",
        city: row.city,
        color: row.color,
      }));
    },
    staleTime: 1000 * 60 * 60,
  });

  const clubMap = useMemo(() => {
    const map = new Map<string, Club>();
    clubs.forEach((c) => map.set(c.id, c));
    return map;
  }, [clubs]);

  const getClubById = (id: string) => clubMap.get(id);

  return (
    <ClubsContext.Provider value={{ clubs, getClubById, isLoading }}>
      {children}
    </ClubsContext.Provider>
  );
}

export function useClubsContext() {
  return useContext(ClubsContext);
}
