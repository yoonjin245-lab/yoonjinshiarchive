import { ArchiveCard } from "@/components/archive-card";
import type { ArchiveItem } from "@/lib/archive-data";

type ArchiveGridProps = {
  items: ArchiveItem[];
  onItemClick?: (item: ArchiveItem) => void;
};

export function ArchiveGrid({ items, onItemClick }: ArchiveGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item, index) => (
        <ArchiveCard key={item.id} item={item} onClick={onItemClick} priority={index < 4} />
      ))}
    </div>
  );
}
