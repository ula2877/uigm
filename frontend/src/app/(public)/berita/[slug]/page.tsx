import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react';

import RichTextRenderer from '@/components/cms/RichTextRenderer';
import { getNewsBySlug, getNews } from '@/services/api';
import { formatDateIndonesian, getTagColor } from '@/lib/utils';
import { fetchNewsBySlug as fetchNewsItem, fetchNewsList } from '@/lib/cms';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const apiItem = await fetchNewsItem(slug);
  const item = apiItem || getNewsBySlug(slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.excerpt,
    openGraph: item.image
      ? { title: item.title, description: item.excerpt, images: [item.image] }
      : { title: item.title, description: item.excerpt },
  };
}

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const apiItem = await fetchNewsItem(slug);
  const item = apiItem || getNewsBySlug(slug);
  if (!item) notFound();

  const apiAll = await fetchNewsList();
  const allNews = (apiAll && apiAll.length > 0 ? apiAll : getNews()) as any[];
  const currentIndex = allNews.findIndex((n: any) => n.slug === slug);
  const prev = currentIndex > 0 ? allNews[currentIndex - 1] : null;
  const next = currentIndex < allNews.length - 1 ? allNews[currentIndex + 1] : null;

  const currentTags = item.tags
    ? item.tags.map((t: any) => t.name)
    : (item.tag || "").split(",").filter(Boolean).map((t: string) => t.trim());

  const related = allNews
    .filter((n: any) => {
      if (n.slug === slug) return false;
      const newsTags = n.tags
        ? n.tags.map((t: any) => t.name)
        : (n.tag || "").split(",").filter(Boolean).map((t: string) => t.trim());
      return currentTags.some((ct: string) => newsTags.includes(ct));
    })
    .slice(0, 3);

  return (
    <>
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-[#064E3B]">
        <div className="absolute inset-0">
          <img src={item.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{
            background: [
              'radial-gradient(ellipse 70% 55% at 25% 25%, rgba(5, 150, 105, 0.35) 0%, transparent 60%)',
              'radial-gradient(ellipse 50% 40% at 75% 75%, rgba(251, 191, 36, 0.06) 0%, transparent 50%)',
              'linear-gradient(180deg, rgba(6, 78, 59, 0.80) 0%, rgba(6, 78, 59, 0.50) 40%, rgba(6, 78, 59, 0.60) 60%, rgba(6, 78, 59, 0.85) 100%)',
            ].join(', '),
          }} />
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FBBF24]/30 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 sm:py-32">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white/80 transition-colors">Beranda</Link>
            <span className="text-white/30">/</span>
            <Link href="/berita" className="hover:text-white/80 transition-colors">Berita</Link>
            <span className="text-white/30">/</span>
            <span className="text-white/80 font-medium truncate">{item.title}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15] font-[family-name:var(--font-display)] text-center">
            {item.title}
          </h1>
          <div className="inline-flex items-center gap-2 text-sm text-white/80 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl mt-4">
            <Calendar className="w-4 h-4" />
            {formatDateIndonesian(item.date)}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full z-10 leading-none">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full h-auto">
            <path d="M0 30C240 65 480 10 720 40C960 70 1200 25 1440 50V80H0V30Z" fill="#F8FAFC" opacity="0.97" />
            <path d="M0 55C240 75 480 50 720 65C960 80 1200 55 1440 70V80H0V55Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      <article className="relative py-16 sm:py-24 bg-white overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="cms-berita-content">
            <RichTextRenderer html={item.content || ""} />
          </div>

          <div className="flex items-center gap-2 pt-8 mt-12 border-t border-gray-100">
            <span className="text-sm font-semibold text-[#064E3B]">Tag :</span>
            <div className="flex flex-wrap gap-2">
              {currentTags.map((t: string) => (
                <span key={t} className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${getTagColor(t)}`}>{t}</span>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-12 pt-8 border-t border-gray-100">
            {prev && (
              <Link href={`/berita/${prev.slug}`} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-[#F8FAFC] transition-colors group">
                <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-[#FBBF24] transition-colors flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs text-gray-400">Sebelumnya</span>
                  <p className="text-sm font-semibold text-[#064E3B] truncate">{prev.title}</p>
                </div>
              </Link>
            )}
            {next && (
              <Link href={`/berita/${next.slug}`} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-[#F8FAFC] transition-colors group sm:text-right sm:flex-row-reverse">
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#FBBF24] transition-colors flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs text-gray-400">Selanjutnya</span>
                  <p className="text-sm font-semibold text-[#064E3B] truncate">{next.title}</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="relative py-16 sm:py-20 bg-[#F8FAFC] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#064E3B] mb-10 font-[family-name:var(--font-display)]">Berita Terkait</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {related.map((r, i) => (
                <Link key={r.slug} href={`/berita/${r.slug}`}>
                  <div className="group rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
                    <div className="relative h-44 overflow-hidden">
                      <img src={r.image} alt={r.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        {(r.tag || "").split(",").filter(Boolean).map((t: string) => (
                          <span key={t} className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${getTagColor(t.trim())}`}>{t.trim()}</span>
                        ))}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDateIndonesian(r.date)}
                      </div>
                      <h3 className="font-bold text-sm text-[#064E3B] group-hover:text-[#059669] transition-colors line-clamp-2">{r.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}


    </>
  );
}
