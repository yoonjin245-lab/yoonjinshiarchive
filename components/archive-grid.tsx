import { ArchiveCard } from "@/components/archive-card";
import type { ArchiveItem } from "@/lib/archive-data";

type ArchiveGridProps = {
  items: ArchiveItem[];
  onItemClick?: (item: ArchiveItem) => void;
};

export function ArchiveGrid({ items, onItemClick }: ArchiveGridProps) {
  return (
    <div className="grid grid-cols-3 gap-x-6 gap-y-6 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9">
      {items.map((item, index) => (
        <ArchiveCard key={item.id} item={item} onClick={onItemClick} priority={index < 4} />
      ))}
    </div>
  );
}