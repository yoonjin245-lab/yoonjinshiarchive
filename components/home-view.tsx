"use client";

import { ArchiveCard } from "@/components/archive-card";
import type { ArchiveItem } from "@/lib/archive-data";
import { useArchiveItems } from "@/hooks/use-archive-items";

type HomeViewProps = {
  items: ArchiveItem[];
};

export function HomeView({ items }: HomeViewProps) {
  const archiveItems = useArchiveItems(items);
  const recentAdditions = archiveItems.filter((item) => item.featured).slice(0, 8);

  return (
    <div className="grid gap-20">
      <section className="min-h-[54vh] max-w-3xl pt-8">
        <h1 className="whitespace-pre-line text-base font-normal leading-relaxed tracking-normal">
          {"Every project starts\nwith a small idea."}
        </h1>
        <p className="mt-6 whitespace-pre-line text-base font-normal leading-relaxed text-neutral-700">
          {"This archive documents\nthoughts,\nimages,\ndrawings,\nand completed work."}
        </p>
      </section>

      <section className="grid gap-5">
        <h2 className="text-sm font-normal">Recent Additions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {recentAdditions.map((item) => (
            <ArchiveCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}