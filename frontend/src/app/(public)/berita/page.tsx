import { getNews } from "@/services/api";
import BeritaPageClient from "@/components/BeritaPageClient";
import { fetchNewsList } from "@/lib/cms";

export default async function BeritaPage() {
  const apiItems = await fetchNewsList();
  const items = apiItems && apiItems.length > 0 ? apiItems : getNews();
  const trending = items.slice(0, 3);

  return <BeritaPageClient items={items} trending={trending} />;
}
