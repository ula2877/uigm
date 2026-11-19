import { getNews } from "@/services/api";
import BeritaPageClient from "@/components/BeritaPageClient";
import { fetchNewsList } from "@/lib/cms";
import type { NewsItem } from "@/types";

export default async function BeritaPage() {
  const apiItems = await fetchNewsList();
  const items: NewsItem[] = apiItems && apiItems.length > 0
    ? apiItems.map((n: any) => ({
        slug: n.slug || "",
        date: n.date || "",
        title: n.title || "",
        excerpt: n.excerpt || "",
        content: n.content || "",
        tag: n.tag || (Array.isArray(n.tags) ? n.tags.map((t: any) => t.name).join(", ") : ""),
        color: n.color || "",
        image: n.image || "",
      }))
    : getNews();
  const trending = items.slice(0, 3);

  return <BeritaPageClient items={items} trending={trending} />;
}
