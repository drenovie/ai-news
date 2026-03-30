import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_CONSENT_KEY = "cookie-consent-accepted";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setVisible(false);
  };

  const dismiss = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="container max-w-4xl mx-auto">
        <div className="relative bg-card border border-border rounded-xl shadow-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            onClick={dismiss}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-muted rounded-lg p-2">
              <Cookie className="h-5 w-5 text-primary" />
            </div>
          </div>

          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed pr-6 sm:pr-0">
            We use cookies to enhance your experience. Video content is embedded from YouTube, which may set tracking cookies.
            By continuing, you agree to our use of cookies.
          </p>

          <div className="flex gap-2 shrink-0 w-full sm:w-auto">
            <Button
              onClick={accept}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white font-nav text-xs uppercase tracking-wider flex-1 sm:flex-initial"
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
