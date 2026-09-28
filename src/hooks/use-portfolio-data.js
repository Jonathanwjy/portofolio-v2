import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Static content stays visible until the corresponding table has rows.
export function usePortfolioData(table, fallback) {
  const [items, setItems] = useState(() => fallback);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (active && !error && data?.length) setItems(data);
    }

    load();
    return () => {
      active = false;
    };
  }, [table]);

  return items;
}
