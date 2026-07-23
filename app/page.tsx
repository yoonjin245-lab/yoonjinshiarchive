import { HomeView } from "@/components/home-view";
import { archiveItems } from "@/lib/archive-data";

export default function Home() {
  return <HomeView items={archiveItems} />;
}
