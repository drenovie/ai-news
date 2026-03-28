import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export function useClubPreferences() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: preferredClubIds = [], isLoading } = useQuery({
    queryKey: ["club-preferences", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_club_preferences")
        .select("club_id")
        .eq("user_id", user.id);
      if (error) throw error;
      return data.map((row: { club_id: string }) => row.club_id);
    },
    enabled: !!user,
  });

  const toggleClub = useMutation({
    mutationFn: async (clubId: string) => {
      if (!user) throw new Error("Not authenticated");
      const isFollowed = preferredClubIds.includes(clubId);

      if (isFollowed) {
        const { error } = await supabase
          .from("user_club_preferences")
          .delete()
          .eq("user_id", user.id)
          .eq("club_id", clubId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_club_preferences")
          .insert({ user_id: user.id, club_id: clubId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club-preferences", user?.id] });
    },
  });

  return { preferredClubIds, isLoading, toggleClub };
}
