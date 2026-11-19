import { getNews, getTrendingNews } from "@/services/api";
import BeritaPageClient from "@/components/BeritaPageClient";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api").replace(/\/+$/, "");

async function fetchNewsFromApi() {
  try {
    const res = await fetch(`${API_BASE}/news`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || [];
  } catch {
    return null;
  }
}

export default async function BeritaPage() {
  const apiItems = await fetchNewsFromApi();
  const items = apiItems && apiItems.length > 0 ? apiItems : getNews();
  const trending = items.slice(0, 3);

  return <BeritaPageClient items={items} trending={trending} />;
}
