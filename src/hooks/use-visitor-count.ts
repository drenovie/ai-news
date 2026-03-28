import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useVisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const increment = async () => {
      const { data } = await supabase.rpc("increment_visitor_count");
      if (typeof data === "number") setCount(data);
    };
    increment();
  }, []);

  return count;
}
