"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { fetchCmsPage, fetchFooterSettings, fetchNavbarItems } from "@/lib/cms";
import type { NavbarItem } from "@/lib/cms";

const SOCIAL_ICONS: Record<string, { path: string; label: string }> = {
  facebook_url: { label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
  twitter_url: { label: "X", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  instagram_url: { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
  linkedin_url: { label: "LinkedIn", path: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zM16 16h-2v-3c0-1.654-2-1.654-2 0v3h-2v-6h2v1.041c.655-.978 2-1.151 2-.19V16z" },
  youtube_url: { label: "YouTube", path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
};

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);
  const [navItems, setNavItems] = useState<NavbarItem[]>([]);
  const [kontakData, setKontakData] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetchFooterSettings(),
      fetchNavbarItems(),
      fetchCmsPage("kontak"),
    ])
      .then(([footerSettings, navbarRes, kontakPage]) => {
        if (footerSettings) setSettings(footerSettings);
        if (Array.isArray(navbarRes)) {
          setNavItems(navbarRes.filter((item: NavbarItem) => !item.parent_id));
        }
        if (kontakPage) {
          const blocks = kontakPage.content ?? [];
          const contactBlock = blocks.find((b: any) => b.type === "contact");
          if (contactBlock?.data) setKontakData(contactBlock.data);
        }
      })
      .catch(() => {});
  }, []);

  const s = settings || {};
  const kontak = kontakData || {};

  return (
    <footer id="kontak" className="relative text-emerald-100/80 bg-[#064E3B]">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FBBF24]/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-5">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#059669] to-[#10B981] flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <span className="text-lg font-bold text-white block leading-tight font-[family-name:var(--font-display)]">
                  {s.site_name || "PPNS"}
                </span>
                <span className="text-[10px] text-emerald-300/60 font-medium tracking-widest uppercase">
                  {s.tagline || "Smart Maritime Campus"}
                </span>
              </div>
            </Link>
            <p className="text-sm text-emerald-100/60 leading-relaxed mb-6 max-w-sm">
              {s.description || "Building Indonesia&apos;s Future Maritime Technology Ecosystem since 1996."}
            </p>
            <div className="flex gap-2.5">
              {Object.entries(SOCIAL_ICONS).map(([key, icon]) => (
                <a
                  key={key}
                  href={s[key] || "#"}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#FBBF24] text-emerald-100/60 hover:text-[#064E3B] flex items-center justify-center transition-all duration-300 group"
                  aria-label={icon.label}
                  target={s[key] ? "_blank" : undefined}
                  rel={s[key] ? "noopener noreferrer" : undefined}
                >
                  <svg className="w-4 h-4 currentColor" fill="currentColor" viewBox="0 0 24 24">
                    <path d={icon.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold text-sm mb-5">Navigasi</h4>
            <ul className="space-y-2.5">
              {navItems.length > 0 ? navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href || "/"}
                    className="text-sm text-emerald-100/60 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    {item.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              )) : (
                <>
                  <li><Link href="/" className="text-sm text-emerald-100/60 hover:text-white transition-colors">Beranda</Link></li>
                  <li><Link href="/tentang" className="text-sm text-emerald-100/60 hover:text-white transition-colors">Tentang</Link></li>
                  <li><Link href="/program" className="text-sm text-emerald-100/60 hover:text-white transition-colors">Program</Link></li>
                  <li><Link href="/berita" className="text-sm text-emerald-100/60 hover:text-white transition-colors">Berita</Link></li>
                  <li><Link href="/galeri" className="text-sm text-emerald-100/60 hover:text-white transition-colors">Galeri</Link></li>
                </>
              )}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-white font-semibold text-sm mb-5">Kontak</h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 group">
                <MapPin className="w-4 h-4 text-[#FBBF24]/70 group-hover:text-[#FBBF24] transition-colors flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <span className="text-sm text-emerald-100/60 group-hover:text-white transition-colors">
                  {kontak.address || "Jl. Teknik Kimia, Keputih, Kec. Sukolilo, Surabaya 60111"}
                </span>
              </li>
              <li className="flex items-start gap-3 group">
                <Mail className="w-4 h-4 text-[#FBBF24]/70 group-hover:text-[#FBBF24] transition-colors flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <a href={`mailto:${kontak.email || "info@ppns.ac.id"}`} className="text-sm text-emerald-100/60 group-hover:text-white transition-colors">
                  {kontak.email || "info@ppns.ac.id"}
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <Phone className="w-4 h-4 text-[#FBBF24]/70 group-hover:text-[#FBBF24] transition-colors flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <a href={`tel:${kontak.phone || "+62315947264"}`} className="text-sm text-emerald-100/60 group-hover:text-white transition-colors">
                  {kontak.phone || "+62 31 594 7264"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-emerald-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-emerald-100/40">
            &copy; {new Date().getFullYear()} {s.copyright_text || s.site_name + " Smart Maritime Campus. All rights reserved."}
          </p>
          <div className="flex items-center gap-4">
            <a
              href={s.privacy_url || "#"}
              className="text-xs text-emerald-100/40 hover:text-white transition-colors"
            >
              {s.privacy_label || "Kebijakan Privasi"}
            </a>
            <a
              href={s.terms_url || "#"}
              className="text-xs text-emerald-100/40 hover:text-white transition-colors"
            >
              {s.terms_label || "Syarat & Ketentuan"}
            </a>
            <a
              href={s.faq_url || "#"}
              className="text-xs text-emerald-100/40 hover:text-white transition-colors"
            >
              {s.faq_label || "FAQ"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
