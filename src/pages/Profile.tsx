import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/use-auth";
import { useClubPreferences } from "@/hooks/use-club-preferences";
import { useClubsContext } from "@/contexts/ClubsContext";
import { ClubBadge } from "@/components/ClubBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, signOut } = useAuth();
  const { preferredClubIds, toggleClub } = useClubPreferences();
  const { clubs } = useClubsContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const serieA = clubs.filter((c) => c.league === "serie_a");
  const serieB = clubs.filter((c) => c.league === "serie_b");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-2xl py-8 space-y-8">
        {/* Account info */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Signed in as <span className="text-foreground font-medium">{user?.email}</span>
            </p>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Club preferences */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-heading text-lg">My Clubs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { label: "Serie A", list: serieA },
              { label: "Serie B", list: serieB },
            ].map(({ label, list }) => (
              <div key={label}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">{label}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {list.map((club) => {
                    const checked = preferredClubIds.includes(club.id);
                    return (
                      <label
                        key={club.id}
                        className="flex items-center gap-3 p-2.5 rounded-md border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleClub.mutate(club.id)}
                        />
                        <ClubBadge club={club} />
                        <span className="text-sm font-medium">{club.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
