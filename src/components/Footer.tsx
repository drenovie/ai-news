import { useVisitorCount } from "@/hooks/use-visitor-count";
import { Eye } from "lucide-react";

export const Footer = () => {
  const visitorCount = useVisitorCount();

  return (
    <footer className="bg-sand-100 border-t border-bark-200 py-16 mt-20">
      <div className="max-w-[1920px] mx-auto px-global flex flex-col items-center gap-8 text-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-bark-900 flex items-center justify-center overflow-hidden">
            <img src="/logo.jpg" alt="AI News" className="w-5 h-5 object-contain brightness-0 invert" />
          </div>
          <span className="font-heading font-black tracking-tight text-bark-900 uppercase">
            AI News
          </span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm font-bold text-bark-700 uppercase tracking-widest">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-bark-700/60 font-medium">
            © 2026 AI News. Built with an organic tech aesthetic.
          </p>
          {visitorCount !== null && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bark-900/5 text-[11px] font-bold text-bark-700 uppercase tracking-widest">
              <Eye className="h-3.5 w-3.5" />
              {visitorCount.toLocaleString()} global visitors
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
