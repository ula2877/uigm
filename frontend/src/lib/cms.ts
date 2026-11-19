import type { Page } from "@/types/cms";

function resolveApiBase(): string {
  const isServer = typeof window === "undefined";
  const rawApiBase = isServer
    ? process.env.INTERNAL_API_URL ||
      process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:5001/api"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

  const normalizedBase = rawApiBase.replace(/\/+$/, "");
  console.log("[CMS] normalizedBase:", normalizedBase);
  return normalizedBase.endsWith("/api") ? normalizedBase : `${normalizedBase}/api`;
}

const API_BASE = resolveApiBase();

export function getCmsApiBase(): string {
  return API_BASE;
}

export interface NavbarItem {
  id: number;
  label: string;
  page_id?: number;
  page_slug?: string;
  href?: string | null;
  order_index?: number;
  active?: boolean;
  parent_id?: number | null;
  children?: NavbarItem[];
}

export interface NavbarSettings {
  site_name: string;
  logo_url: string | null;
  show_admin: boolean;
  admin_label: string;
  admin_href: string;
  show_info_akademik: boolean;
  info_akademik_label: string;
  info_akademik_href: string;
}

export interface FooterSettings {
  site_name: string;
  tagline: string;
  description: string;
  copyright_text: string;
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
  linkedin_url: string;
  youtube_url: string;
  privacy_label: string;
  privacy_url: string;
  terms_label: string;
  terms_url: string;
  faq_label: string;
  faq_url: string;
}

export interface CmsNewsItem {
  id?: number;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  tag?: string;
  tags?: { id: number; name: string }[];
  color?: string;
  image?: string;
  date?: string;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CmsReportItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  file_url: string;
  file_name: string;
  file_size: number;
  format: string;
  release_date?: string;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

async function fetchJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
    if (!res.ok) return fallback;
    const data = await res.json();
    return (data?.data ?? fallback) as T;
  } catch (error) {
    console.error("[CMS] fetch error:", path, error);
    return fallback;
  }
}

export function normalizeCmsSlug(slug: string): string {
  if (slug === "" || slug === "/") return "";
  return slug;
}

export function findCmsBlock(page: Page | null, type: string) {
  return page?.content?.find((block) => block.type === type)?.data ?? null;
}

export function buildCmsSections(page: Page | null) {
  return (
    page?.content?.reduce(
      (sections, block) => {
        sections[block.type] = block.data;
        return sections;
      },
      {} as Record<string, any>,
    ) ?? {}
  );
}

export async function fetchCmsPage(slug: string): Promise<Page | null> {
  const normalizedSlug = normalizeCmsSlug(slug);
  const apiUrl =
    normalizedSlug === ""
      ? `${API_BASE}/pages/root`
      : `${API_BASE}/pages/${encodeURIComponent(normalizedSlug)}`;

  try {
    const res = await fetch(apiUrl, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data?.data || null;
  } catch (error) {
    console.error("[CMS] fetchCmsPage error:", error);
    return null;
  }
}

export async function fetchNavbarItems(): Promise<NavbarItem[]> {
  return fetchJson<NavbarItem[]>("/navbar", []);
}

export async function fetchNavbarSettings(): Promise<NavbarSettings> {
  return fetchJson<NavbarSettings>("/navbar/settings", {
    site_name: "PPNS",
    logo_url: null,
    show_admin: true,
    admin_label: "Admin",
    admin_href: "/admin",
    show_info_akademik: true,
    info_akademik_label: "Info Akademik",
    info_akademik_href: "/program",
  });
}

export async function fetchFooterSettings(): Promise<FooterSettings> {
  return fetchJson<FooterSettings>("/footer/settings", {
    site_name: "PPNS",
    tagline: "Smart Maritime Campus",
    description:
      "Building Indonesia's Future Maritime Technology Ecosystem since 1996.",
    copyright_text: "PPNS Smart Maritime Campus. All rights reserved.",
    facebook_url: "",
    twitter_url: "",
    instagram_url: "",
    linkedin_url: "",
    youtube_url: "",
    privacy_label: "Kebijakan Privasi",
    privacy_url: "",
    terms_label: "Syarat & Ketentuan",
    terms_url: "",
    faq_label: "FAQ",
    faq_url: "",
  });
}

export async function fetchNewsList(): Promise<CmsNewsItem[]> {
  return fetchJson<CmsNewsItem[]>("/news", []);
}

export async function fetchNewsBySlug(slug: string): Promise<CmsNewsItem | null> {
  return fetchJson<CmsNewsItem | null>(`/news/${encodeURIComponent(slug)}`, null);
}

export async function fetchReports(): Promise<CmsReportItem[]> {
  return fetchJson<CmsReportItem[]>("/reports", []);
}
