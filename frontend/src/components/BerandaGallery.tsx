"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { GalleryItem } from "@/types";
import { fetchCmsPage } from "@/lib/cms";

export default function BerandaGallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    fetchCmsPage("galeri")
      .then((page) => {
        const blocks = page?.content ?? [];
        const galleryBlock = blocks.find((b: any) => b.type === "gallery");
        const items: GalleryItem[] = galleryBlock?.data?.items ?? galleryBlock?.data?.images ?? [];
        setGalleryItems(items.slice(0, 6));
      })
      .catch(() => {});
  }, []);
  return (
    <section className="relative py-28 sm:py-36 lg:py-44 bg-[#F8FAFC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-16 sm:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#064E3B]/5 text-[#064E3B] text-xs font-medium mb-6 border border-[#064E3B]/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
            Galeri
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#064E3B] leading-[1.1] font-[family-name:var(--font-display)]">
            Jelajahi{" "}
            <span className="bg-gradient-to-r from-[#064E3B] to-[#059669] bg-clip-text text-transparent">
              Kampus Kami
            </span>
          </h2>
        </motion.div>

        <div className="gallery-grid-premium mb-12">
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="gallery-item"
            >
              <div className="w-full h-full min-h-[200px] sm:min-h-[240px] relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-40 mix-blend-multiply`}
                />
              </div>
              <div className="gallery-overlay">
                <div>
                  <h4 className="text-white font-bold text-lg">{item.title}</h4>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Link
            href="/galeri"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#064E3B] text-white font-semibold text-sm hover:bg-[#059669] transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Lihat Semua Galeri
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
