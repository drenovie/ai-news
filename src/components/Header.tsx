import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

const navItems = [
  { label: "NEWS", href: "/", color: "italia-green" },
  { label: "VIDEOS", href: "/videos", color: "italia-red" },
  { label: "CLUBS", href: "/clubs", color: "italia-red" },
];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background pt-[env(safe-area-inset-top)]">
      {/* Top bar */}
      <div className="border-b border-border">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-1 shrink-0">
            <span className="text-2xl font-heading font-bold tracking-tight">
              <span className="text-italia-green">It</span>
              <span className="text-foreground">al</span>
              <span className="text-italia-red">ia</span>
              <span className="text-foreground"> Kick</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
              <Link to="/auth"><LogIn className="h-4 w-4 mr-1" /> Sign In</Link>
            </Button>
          </div>

          <div className="flex md:hidden items-center gap-1">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Category nav bar */}
      <nav className="hidden md:block border-b border-border">
        <div className="container flex items-center gap-8 h-11">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "text-xs font-nav font-semibold tracking-[0.15em] transition-colors py-3 border-b-2",
                  isActive
                    ? `text-${item.color} border-${item.color}`
                    : "text-muted-foreground hover:text-foreground border-transparent"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-b border-border px-4 py-3 flex flex-col gap-1 bg-background">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "px-3 py-2.5 text-xs font-nav font-semibold tracking-[0.15em]",
                location.pathname === item.href
                  ? `text-${item.color}`
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/auth"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2.5 text-xs font-nav font-semibold tracking-[0.15em] text-muted-foreground"
          >
            SIGN IN
          </Link>
        </nav>
      )}
    </header>
  );
}
