import type { ArchiveItem } from "@/lib/archive-data";

export type ArchiveRow = {
  id: string;
  image_url: string;
  image_path: string | null;
  project_id: string;
  tags: string[] | null;
  caption: string | null;
  description: string | null;
  date: string;
  featured: boolean;
  alt: string | null;
  created_at?: string;
};

export function rowToArchiveItem(row: ArchiveRow): ArchiveItem {
  return {
    id: row.id,
    imageUrl: row.image_url,
    imagePath: row.image_path ?? undefined,
    projectId: row.project_id,
    tags: row.tags ?? [],
    caption: row.caption ?? undefined,
    description: row.description ?? undefined,
    date: row.date,
    featured: row.featured,
    alt: row.alt ?? undefined,
  };
}
