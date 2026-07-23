"use client";

import { useEffect, useState } from "react";
import type { ArchiveItem } from "@/lib/archive-data";
import { fetchArchiveItems } from "@/lib/archive-api";

export function useArchiveItems(baseItems: ArchiveItem[]) {
  const [remoteItems, setRemoteItems] = useState<ArchiveItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const sync = async () => {
      try {
        const items = await fetchArchiveItems();

        if (isMounted) {
          setRemoteItems(items);
        }
      } catch {
        if (isMounted) {
          setRemoteItems([]);
        }
      }
    };

    sync();
    window.addEventListener("archive-items-updated", sync);

    return () => {
      isMounted = false;
      window.removeEventListener("archive-items-updated", sync);
    };
  }, []);

  return [...remoteItems, ...baseItems];
}
