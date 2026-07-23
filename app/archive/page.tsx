import { ArchiveView } from "@/components/archive-view";
import { archiveItems, projects } from "@/lib/archive-data";

export default function ArchivePage() {
  return <ArchiveView items={archiveItems} projects={projects} />;
}
