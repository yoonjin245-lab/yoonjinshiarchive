import type { ArchiveItem } from "@/lib/archive-data";

type ArchiveCardProps = {
  item: ArchiveItem;
  onClick?: (item: ArchiveItem) => void;
  priority?: boolean;
};

export function ArchiveCard({ item, onClick }: ArchiveCardProps) {
  const content = (
    <div className="relative aspect-[1.6/1] w-full overflow-hidden">
      <img
        src={item.imageUrl}
        alt={item.alt ?? item.caption ?? item.id}
        className="h-full w-full object-contain object-center transition-opacity duration-150 group-hover:opacity-0"
      />

      <div className="absolute inset-0 flex items-end justify-end bg-black opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        <span className="p-2 text-[10px] leading-none text-white">
          {item.projectId}
        </span>
      </div>
    </div>
  );

  if (!onClick) {
    return <div className="group w-full">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className="group w-full text-left"
      aria-label={`Open ${item.caption ?? item.id}`}
    >
      {content}
    </button>
  );
}