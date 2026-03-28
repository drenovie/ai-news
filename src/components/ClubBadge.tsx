import { Club } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ClubBadgeProps {
  club: Club;
  selected?: boolean;
  onClick?: () => void;
}

export function ClubBadge({ club, selected, onClick }: ClubBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-heading font-bold transition-all whitespace-nowrap border",
        selected
          ? "text-white border-transparent shadow-sm"
          : "bg-card text-card-foreground border-border hover:shadow-sm"
      )}
      style={
        selected
          ? { backgroundColor: `hsl(${club.color})`, borderColor: `hsl(${club.color})` }
          : undefined
      }
    >
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: `hsl(${club.color})` }}
      />
      {club.shortName}
    </button>
  );
}
