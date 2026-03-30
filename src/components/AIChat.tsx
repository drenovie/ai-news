import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface AIChatProps {
  onClose: () => void;
}

export function AIChat({ onClose }: AIChatProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateResponse();
  }, []);

  const generateResponse = async () => {
    setLoading(true);
    setError(null);
    setText("");
    
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Connection credentials missing from environment.");
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/ai-summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseAnonKey,
          "Authorization": `Bearer ${supabaseAnonKey}`
        },
        keepalive: true
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to connect to intelligence analyst");
      }

      // 1. Detect Cache vs Stream
      const contentType = response.headers.get("Content-Type");
      const isStream = contentType?.includes("text/event-stream") || response.body?.locked === false;

      if (!isStream) {
        const cachedText = await response.text();
        if (!cachedText) throw new Error("Received empty cache data");
        setText(cachedText);
        setLoading(false);
        return;
      }

      // 2. Handle Live Stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("Stream reader unavailable");

      setLoading(false);
      let result = "";
      let lastUpdate = Date.now();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        result += decoder.decode(value, { stream: true });
        
        // Throttled UI updates (every 100ms) to prevent flickering and over-rendering
        if (result.endsWith("\n") || Date.now() - lastUpdate > 100) {
          setText(result);
          lastUpdate = Date.now();
        }
      }
      setText(result); // Final catch-all for remaining characters

    } catch (err: any) {
      console.error("AI Chat Error:", err);
      setError(`Analyst is currently unavailable (${err.message}).`);
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error ? (
        <div className="p-6 bg-sand-100/50 border border-bark-200/50 rounded-3xl text-bark-700 text-[10px] font-bold uppercase tracking-widest text-center mt-8">
          {error}
        </div>
      ) : (
        <div className="mt-8 min-h-[400px]">
          
          {loading && !text && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
               <Loader2 className="w-5 h-5 animate-spin text-primary/50" />
               <span className="text-[9px] font-black uppercase tracking-[0.4em] text-bark-300 animate-pulse">Scanning Intelligence</span>
            </div>
          )}

          <div className="prose prose-sm prose-bark max-w-none text-left">
            {text && (
              <ReactMarkdown 
                components={{
                  a: ({ node, ...props }) => (
                    <Link to={props.href || "/"} className="text-primary font-black no-underline hover:underline decoration-2 underline-offset-4">
                      {props.children}
                    </Link>
                  ),
                  ol: ({ children }) => <ol className="space-y-4 mt-6 p-0 list-none">{children}</ol>,
                  li: ({ children, index }) => (
                    <motion.li 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-4 py-3 border-b border-bark-100/10 last:border-0 group"
                    >
                      <span className="shrink-0 text-[10px] font-black text-primary/30 mt-1 w-5 tabular-nums text-right group-hover:text-primary transition-colors">
                        {String((index ?? 0) + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 text-sm font-bold tracking-tight text-bark-900">{children}</div>
                    </motion.li>
                  )
                }}
              >
                {text}
              </ReactMarkdown>
            )}
          </div>

          {loading && text && (
            <div className="mt-8 flex items-center gap-3 px-1">
               <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/50 animate-pulse">Receiving Stream</span>
            </div>
          )}

          {!loading && text && (
             <div className="mt-16 pt-8 border-t border-bark-200/40 flex justify-center">
                <button 
                  onClick={onClose}
                  className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-bark-900 transition-colors"
                >
                  Dismiss Briefing
                </button>
             </div>
          )}
        </div>
      )}
    </div>
  );
}