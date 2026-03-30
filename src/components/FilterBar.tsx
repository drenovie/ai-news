import { cn } from "@/lib/utils";

interface FilterBarProps {
  items: { id: string; name: string }[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  className?: string;
}

export function FilterBar({ items, selectedId, onSelect, className }: FilterBarProps) {
  return (
    <div className={cn("w-full overflow-x-auto no-scrollbar py-2", className)}>
      <div className="flex items-center gap-3 px-1">
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
            !selectedId
              ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
              : "bg-white text-bark-700 border-bark-200 hover:border-primary/50"
          )}
        >
          All Sources
        </button>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              "shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
              selectedId === item.id
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                : "bg-white text-bark-700 border-bark-200 hover:border-primary/50"
            )}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
