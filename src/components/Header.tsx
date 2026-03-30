import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

const navItems = [
  { label: "Feed", href: "/" },
  { label: "Videos", href: "/?tab=video" },
];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleSearch = () => {
    // Custom event for Index page to catch
    window.dispatchEvent(new CustomEvent('toggle-search-hero'));
  };

  return (
    <header className="w-full bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/40">
      <div className="max-w-[1920px] mx-auto px-global h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform overflow-hidden">
            <img src="/activynews-logo.png" alt="ActivyNews - AI" className="w-7 h-7 object-contain brightness-0 invert" />
          </div>
          <span className="text-xl font-heading font-black tracking-tight text-foreground uppercase">
            Activy AI News
          </span>
        </Link>

        {/* Desktop Nav - Centered */}
        <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || (item.href.includes('tab') && location.search.includes(item.href.split('?')[1]));
            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "text-[10px] font-black tracking-[0.2em] uppercase transition-all hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button 
            onClick={toggleSearch} 
            className="bg-primary hover:bg-bark-900 text-white px-3 h-10 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
            title="Ask AI"
          >
            <Sparkles className="h-4 w-4 text-white" />
          </Button>

          <div className="h-4 w-px bg-bark-200 mx-2 hidden sm:block" />

          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-background p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "text-sm font-black uppercase tracking-widest p-3 rounded-xl transition-colors",
                location.pathname === item.href ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-secondary/50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
