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
        className="h-full w-full object-contain object-center opacity-85 transition-opacity duration-200 group-hover:opacity-100"
      />

      <div className="absolute inset-0 bg-white/0 transition-colors duration-150 group-hover:bg-white/65" />

      <span className="absolute bottom-1 right-1 text-[10px] leading-none opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        {item.projectId}
      </span>
    </>
  );

  if (!onClick) {
    return <div className="group relative aspect-[1/1.4] w-full overflow-hidden">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className="group relative aspect-[1/1.4] w-full overflow-hidden text-left"
      aria-label={`Open ${item.caption ?? item.id}`}
    >
      {content}
    </button>
  );
}