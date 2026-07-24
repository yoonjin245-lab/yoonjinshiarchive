import type { ArchiveItem } from "@/lib/archive-data";

type ArchiveCardProps = {
  item: ArchiveItem;
  onClick?: (item: ArchiveItem) => void;
  priority?: boolean;
};

export function ArchiveCard({ item, onClick }: ArchiveCardProps) {
  const content = (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative max-h-full max-w-full">
        <img
          src={item.imageUrl}
          alt={item.alt ?? item.caption ?? item.id}
          className="block max-h-full max-w-full object-contain object-center opacity-85 transition-opacity duration-200 group-hover:opacity-100"
        />

        <div className="absolute inset-0 bg-white/0 transition-colors duration-150 group-hover:bg-white/65" />

        <span className="absolute bottom-0 right-0 translate-x-full translate-y-full pl-1 pt-1 text-xs opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          {item.projectId}
        </span>
      </div>
    </div>
  );

  if (!onClick) {
    return <div className="group relative aspect-[1/1.4] w-full overflow-visible">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className="group relative aspect-[1/1.4] w-full overflow-visible text-left"
      aria-label={`Open ${item.caption ?? item.id}`}
    >
      {content}
    </button>
  );
}