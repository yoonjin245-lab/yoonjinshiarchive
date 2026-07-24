"use client";

import { ArchiveGrid } from "@/components/archive-grid";
import type { ArchiveItem } from "@/lib/archive-data";
import { useArchiveItems } from "@/hooks/use-archive-items";

type HomeViewProps = {
  items: ArchiveItem[];
};

export function HomeView({ items }: HomeViewProps) {
  const archiveItems = useArchiveItems(items);
  const recentAdditions = archiveItems.filter((item) => item.featured).slice(0, 9);

  return (
    <div className="grid gap-12">
      <section className="max-w-[540px] pt-8 text-sm font-normal leading-snug text-black">
        <h1 className="whitespace-pre-line font-normal">
          {"Every project starts\nwith a small idea."}
        </h1>

        <p className="mt-6 whitespace-pre-line">
          {"This archive documents\nthoughts,\nimages,\ndrawings,\nand completed work."}
        </p>
      </section>

      <section className="grid gap-5">
        <h2 className="text-sm font-normal text-black">Recent Additions</h2>
        <ArchiveGrid items={recentAdditions} />
      </section>
    </div>
  );
}