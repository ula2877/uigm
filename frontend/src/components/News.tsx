'use client';

import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { getNews } from '@/services/api';
import { formatDateIndonesian, getTagColor } from '@/lib/utils';
const NEWS_ITEMS = getNews();



export default function News() {
  return (
    <section id="berita" className="relative py-28 sm:py-36 lg:py-44 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 sm:mb-20 gap-6"
        >
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#064E3B]/5 text-[#064E3B] text-xs font-medium mb-6 border border-[#064E3B]/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
              Berita & Artikel
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#064E3B] leading-[1.1] font-[family-name:var(--font-display)]">
              Berita{' '}
              <span className="bg-gradient-to-r from-[#064E3B] to-[#059669] bg-clip-text text-transparent">
                Terkini
              </span>
            </h2>
          </div>
          <button className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#064E3B] transition-colors group">
            Lihat Semua
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {NEWS_ITEMS.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`news-card ${i === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
            >
              <div className={`relative overflow-hidden ${i === 0 ? 'h-56 sm:h-72' : 'h-40 sm:h-48'}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                  {(item.tag || "").split(",").filter(Boolean).map((t) => (
                    <span key={t} className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${getTagColor(t.trim())}`}>
                      {t.trim()}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDateIndonesian(item.date)}
                </div>
                <h3 className={`font-bold text-[#064E3B] leading-snug group-hover:text-[#059669] transition-colors ${i === 0 ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'}`}>
                  {item.title}
                </h3>
                {i === 0 && (
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">{item.excerpt}</p>
                )}
                <div className="flex items-center gap-1.5 text-sm font-medium text-[#FBBF24] mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Baca</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
