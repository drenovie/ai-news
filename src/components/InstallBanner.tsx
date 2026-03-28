import { useInstallPrompt } from "@/hooks/use-install-prompt";
import { Download, Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InstallBanner() {
  const { canShow, isIOS, install, dismiss } = useInstallPrompt();

  if (!canShow) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="mx-auto max-w-lg p-4">
        <div className="relative rounded-xl border border-border bg-card shadow-2xl p-4">
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3 pr-6">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-italia-green/10 flex items-center justify-center">
              <Download className="h-5 w-5 text-italia-green" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-bold text-sm text-foreground">
                Install Italia Kick
              </p>
              {isIOS ? (
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Tap <Share className="h-3 w-3 inline-block mx-0.5 -mt-0.5" /> then <span className="font-semibold">"Add to Home Screen"</span> to install.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Get instant access from your home screen — fast, offline-ready, no app store needed.
                </p>
              )}
            </div>
          </div>

          {!isIOS && (
            <Button
              onClick={install}
              size="sm"
              className="w-full mt-3 bg-italia-green hover:bg-italia-green/90 text-white font-nav font-bold uppercase tracking-wider text-xs"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Install App
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
