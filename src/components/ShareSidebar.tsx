import { Facebook, Link as LinkIcon, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ShareSidebarProps {
  url: string;
  title: string;
}

export function ShareSidebar({ url, title }: ShareSidebarProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-row lg:flex-col gap-3 lg:sticky lg:top-32">
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-border text-muted-foreground hover:text-[#25D366] hover:border-[#25D366]">
          <MessageCircle className="h-4 w-4" />
        </Button>
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary">
          <Facebook className="h-4 w-4" />
        </Button>
      </a>
      <a
        href={`https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </Button>
      </a>
      <Button
        variant="ghost"
        size="icon"
        className={`h-10 w-10 rounded-full border transition-colors ${
          copied
            ? "border-primary text-primary"
            : "border-border text-muted-foreground hover:text-primary hover:border-primary"
        }`}
        onClick={handleCopy}
        title="Copy link"
      >
        {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
      </Button>
    </div>
  );
}
