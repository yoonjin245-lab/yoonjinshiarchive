import type { ArchiveItem } from "@/lib/archive-data";

type ArchiveCardProps = {
  item: ArchiveItem;
  onClick?: (item: ArchiveItem) => void;
  priority?: boolean;
};

export function ArchiveCard({ item, onClick }: ArchiveCardProps) {
  const content = (
    <>
      <img
        src={item.imageUrl}
        alt={item.alt ?? item.caption ?? item.id}
        className="h-full w-full object-cover transition-opacity duration-150 group-hover:opacity-80"
      />
      <span className="absolute bottom-2 right-2 text-xs opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        {item.projectId}
      </span>
    </>
  );

  if (!onClick) {
    return <div className="group relative aspect-[4/5] overflow-hidden border border-neutral-200 bg-neutral-100">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className="group relative aspect-[4/5] w-full overflow-hidden border border-neutral-200 bg-neutral-100 text-left"
      aria-label={`Open ${item.caption ?? item.id}`}
    >
      {content}
    </button>
  );
}