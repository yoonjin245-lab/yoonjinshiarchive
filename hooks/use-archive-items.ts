"use client";

import { useEffect, useState } from "react";
import type { ArchiveItem } from "@/lib/archive-data";
import { readLocalArchiveItems } from "@/lib/local-archive";

export function useArchiveItems(baseItems: ArchiveItem[]) {
  const [localItems, setLocalItems] = useState<ArchiveItem[]>([]);

  useEffect(() => {
    const sync = () => setLocalItems(readLocalArchiveItems());

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("archive-items-updated", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("archive-items-updated", sync);
    };
  }, []);

  return [...localItems, ...baseItems];
}
