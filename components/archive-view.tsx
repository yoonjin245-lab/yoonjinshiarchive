"use client";

import { useMemo, useState } from "react";
import { ArchiveGrid } from "@/components/archive-grid";
import { ImageLightbox } from "@/components/image-lightbox";
import { useArchiveItems } from "@/hooks/use-archive-items";
import type { ArchiveItem, Project } from "@/lib/archive-data";

type ArchiveViewProps = {
  items: ArchiveItem[];
  projects: Project[];
};

export function ArchiveView({ items, projects }: ArchiveViewProps) {
  const archiveItems = useArchiveItems(items);
  const [selectedProject, setSelectedProject] = useState("All");
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);

  const visibleItems = useMemo(() => {
    if (selectedProject === "All") {
      return archiveItems;
    }

    return archiveItems.filter((item) => item.projectId === selectedProject);
  }, [archiveItems, selectedProject]);

  const filters = ["All", ...Array.from(new Set([...projects.map((project) => project.id), ...archiveItems.map((item) => item.projectId)]))];

  return (
    <div className="grid gap-8">
      <section className="flex flex-wrap items-center gap-2">
        <span className="mr-3 text-sm text-neutral-500">Project Filter</span>
        {filters.map((filter) => {
          const isSelected = selectedProject === filter;

          return (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedProject(filter)}
              className={`text-sm leading-snug underline-offset-4 transition-colors duration-150 ${
                isSelected ? "text-black underline" : "text-neutral-500 hover:text-black hover:underline"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </section>

      <ArchiveGrid items={visibleItems} onItemClick={setSelectedItem} />
      <ImageLightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}