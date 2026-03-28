import { useVisitorCount } from "@/hooks/use-visitor-count";
import { Eye } from "lucide-react";

export const Footer = () => {
  const visitorCount = useVisitorCount();

  return (
    <footer className="border-t border-border py-8 mt-8">
      <div className="container text-center text-xs text-muted-foreground space-y-2">
        <p>
          © 2026 <span className="text-italia-green">Italia</span>{" "}
          <span className="text-italia-red">Kick</span>. All rights reserved.
        </p>
        {visitorCount !== null && (
          <p className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
            <Eye className="h-3.5 w-3.5" />
            {visitorCount.toLocaleString()} visitors
          </p>
        )}
      </div>
    </footer>
  );
};
