import { fetchCmsPage } from "@/lib/cms";
import BlockRenderer from "@/components/cms/BlockRenderer";
import Hero from "@/components/Hero";

export default async function Home() {
  const page = await fetchCmsPage("");
  const blocks = Array.isArray(page?.content) ? page.content : [];

  if (!page || blocks.length === 0) {
    return <Hero />;
  }

  return <BlockRenderer blocks={blocks} />;
}
