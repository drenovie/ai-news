import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useClubs } from "@/hooks/use-clubs";
import { Club } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Clubs = () => {
  const [league, setLeague] = useState<"serie_a" | "serie_b">("serie_a");
  const { data: clubs = [], isLoading } = useClubs(league);

  const seasonLabel = (() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    return m >= 7 ? `${y}-${(y + 1).toString().slice(-2)}` : `${y - 1}-${y.toString().slice(-2)}`;
  })();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">
          Clubs
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          Browse Italian football clubs by league — {seasonLabel} Season.
        </p>

        <div className="flex gap-6 mb-8 pb-4 border-b border-border">
          {(["serie_a", "serie_b"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLeague(l)}
              className={cn(
                "text-xs font-nav font-bold uppercase tracking-[0.15em] pb-2 border-b-2 transition-colors",
                league === l
                  ? l === "serie_a"
                    ? "text-italia-green border-italia-green"
                    : "text-italia-red border-italia-red"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              )}
            >
              {l === "serie_a" ? "SERIE A" : "SERIE B"}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {clubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

function ClubCard({ club }: { club: Club }) {
  return (
    <Link
      to={`/?club=${club.id}`}
      className="group flex flex-col items-center gap-3 p-4 rounded-sm border border-border hover:border-italia-green transition-colors"
    >
      <div
        className="club-tag-inline w-12 h-12 rounded-full flex items-center justify-center text-sm font-nav font-bold"
        style={{
          backgroundColor: `hsl(${club.color} / 0.12)`,
          color: `hsl(${club.color})`,
          '--club-tag-color': `hsl(${club.color})`,
        } as React.CSSProperties}
      >
        {club.shortName.slice(0, 3)}
      </div>
      <div className="text-center">
        <p className="text-sm font-heading font-semibold text-foreground group-hover:text-italia-green transition-colors">
          {club.name}
        </p>
        <p className="text-[11px] text-muted-foreground">{club.city}</p>
      </div>
    </Link>
  );
}

export default Clubs;
