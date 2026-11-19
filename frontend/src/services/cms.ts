import api from "@/lib/api";
import type { Page, Media } from "@/types/cms";

// ============ NAVBAR ============

export interface NavbarItem {
  id: number;
  label: string;
  page_id: number; // NEW: Link to CMS page
  page_slug: string; // NEW: CMS page slug for reference
  href?: string | null; // Auto-generated: /page_slug
  order_index: number;
  active?: boolean;
  parent_id?: number | null;
  children?: NavbarItem[];
}

// NEW: Interface for available pages in dropdown
export interface AvailablePage {
  id: number;
  label: string;
  slug: string;
  href: string;
}

/**
 * Ambil navbar items (public)
 */
export async function getNavbarItems(): Promise<NavbarItem[]> {
  try {
    const res = await api.get("/navbar");
    return res.data.data || [];
  } catch (error) {
    console.error("[CMS] Error mengambil navbar:", error);
    return [];
  }
}

/**
 * Ambil navbar items untuk admin
 */
export async function getNavbarItemsAdmin(): Promise<NavbarItem[]> {
  if (typeof window !== "undefined" && !localStorage.getItem("token")) {
    throw new Error("AUTH_REQUIRED");
  }

  try {
    const res = await api.get("/navbar/admin");
    return res.data.data || [];
  } catch (error) {
    console.error("[CMS] Error mengambil navbar admin:", error);
    throw error;
  }
}

/**
 * NEW: Ambil list CMS pages yang tersedia untuk navbar selector
 */
export async function getAvailablePagesForNavbar(): Promise<AvailablePage[]> {
  if (typeof window !== "undefined" && !localStorage.getItem("token")) {
    throw new Error("AUTH_REQUIRED");
  }

  try {
    const res = await api.get("/navbar/pages/available");
    return res.data.data || [];
  } catch (error) {
    console.error("[CMS] Error mengambil available pages:", error);
    throw error;
  }
}

/**
 * Tambah navbar item (termasuk submenu)
 * NEW: Requires page_id instead of href
 */
export async function createNavbarItem(data: {
  label: string;
  page_id: number; // NEW: Required - link to CMS page
  parent_id?: number | null;
}): Promise<NavbarItem> {
  try {
    const res = await api.post("/navbar", data);
    return res.data.data;
  } catch (error) {
    console.error("[CMS] Error membuat navbar item:", error);
    throw error;
  }
}

/**
 * Update navbar item
 * NEW: Can update page_id (which updates page_slug and href)
 */
export async function updateNavbarItem(
  id: number,
  data: Partial<NavbarItem>,
): Promise<void> {
  try {
    await api.put(`/navbar/${id}`, data);
  } catch (error) {
    console.error("[CMS] Error update navbar item:", error);
    throw error;
  }
}

/**
 * Reorder navbar items
 */
export async function reorderNavbarItems(
  items: Array<{ id: number; order_index: number }>,
): Promise<void> {
  try {
    await api.put("/navbar/reorder/items", { items });
  } catch (error) {
    console.error("[CMS] Error reorder navbar:", error);
    throw error;
  }
}

/**
 * Hapus navbar item
 */
export async function deleteNavbarItem(id: number): Promise<void> {
  try {
    await api.delete(`/navbar/${id}`);
  } catch (error) {
    console.error("[CMS] Error hapus navbar item:", error);
    throw error;
  }
}

// ============ PAGES ============
export async function getPages(): Promise<Page[]> {
  try {
    const res = await api.get("/pages");
    return res.data.data || [];
  } catch (error) {
    console.error("[CMS] Error mengambil daftar halaman:", error);
    throw error;
  }
}

/**
 * Ambil halaman berdasarkan slug
 */
function getPagePath(slug: string) {
  return slug === "" ? "/pages/root" : `/pages/${slug}`;
}

function getPagePublishPath(slug: string) {
  return slug === ""
    ? "/pages/root/publish"
    : `/pages/${slug}/publish`;
}

function getPageUnpublishPath(slug: string) {
  return slug === ""
    ? "/pages/root/unpublish"
    : `/pages/${slug}/unpublish`;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const path = getPagePath(slug);
    const res = await api.get(path);
    return res.data.data || null;
  } catch (error) {
    console.warn(`[CMS] Halaman dengan slug "${slug}" tidak ditemukan`);
    return null;
  }
}

/**
 * Buat halaman baru
 */
export async function createPage(data: {
  slug: string;
  title: string;
  content: any[];
  published?: boolean;
}): Promise<any> {
  try {
    console.log("[CMS] Creating page:", { slug: data.slug, title: data.title });
    const res = await api.post("/pages", data);
    console.log("[CMS] Page created successfully:", res.data);
    return res.data.data;
  } catch (error: any) {
    console.error("[CMS] Error membuat halaman:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
}

/**
 * Update halaman
 */
export async function updatePage(
  slug: string,
  data: { title: string; content: any; published?: boolean },
): Promise<void> {
  try {
    await api.put(getPagePath(slug), data);
  } catch (error) {
    console.error(`[CMS] Error memperbarui halaman "${slug}":`, error);
    throw error;
  }
}

/**
 * Hapus halaman
 */
export async function deletePage(slug: string): Promise<void> {
  try {
    await api.delete(getPagePath(slug));
  } catch (error) {
    console.error(`[CMS] Error menghapus halaman "${slug}":`, error);
    throw error;
  }
}

/**
 * Publikasikan halaman
 */
export async function publishPage(slug: string): Promise<void> {
  try {
    await api.post(getPagePublishPath(slug), {});
  } catch (error) {
    console.error(`[CMS] Error mempublikasikan halaman "${slug}":`, error);
    throw error;
  }
}

/**
 * Batalkan publikasi halaman
 */
export async function unpublishPage(slug: string): Promise<void> {
  try {
    await api.post(getPageUnpublishPath(slug), {});
  } catch (error) {
    console.error(
      `[CMS] Error membatalkan publikasi halaman "${slug}":`,
      error,
    );
    throw error;
  }
}

/**
 * Update slug halaman
 */
export async function updatePageSlug(
  slug: string,
  newSlug: string,
): Promise<void> {
  try {
    await api.patch(`/pages/${encodeURIComponent(slug)}/slug`, {
      new_slug: newSlug,
    });
  } catch (error) {
    console.error(`[CMS] Error mengubah slug "${slug}" ke "${newSlug}":`, error);
    throw error;
  }
}

/**
 * Upload file
 */
export async function uploadFile(file: File): Promise<Media> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/upload", formData);
    return res.data.data;
  } catch (error: any) {
    console.error("[CMS] Error upload file:", error?.response?.data || error);
    throw error;
  }
}

/**
 * Ambil semua media
 */
export async function getMedia(): Promise<Media[]> {
  try {
    const res = await api.get("/upload");
    return res.data.data || [];
  } catch (error) {
    console.error("[CMS] Error mengambil daftar media:", error);
    throw error;
  }
}

/**
 * Ambil media berdasarkan ID
 */
export async function getMediaById(id: number): Promise<Media | null> {
  try {
    const res = await api.get(`/upload/${id}`);
    return res.data.data || null;
  } catch (error) {
    console.warn(`[CMS] Media dengan ID ${id} tidak ditemukan`);
    return null;
  }
}

/**
 * Hapus media
 */
export async function deleteMedia(id: number): Promise<void> {
  try {
    await api.delete(`/upload/${id}`);
  } catch (error) {
    console.error(`[CMS] Error menghapus media dengan ID ${id}:`, error);
    throw error;
  }
}

/**
 * Generate URL lengkap untuk media
 */
const UPLOADS_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"
).replace("/api", "");

export function mediaUrl(path: string): string {
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return `${UPLOADS_BASE}${path}`;
  return `${UPLOADS_BASE}/${path}`;
}

// ============ REVALIDATION ============

/**
 * Revalidate page cache after create/update
 */
export async function revalidatePageCache(slug: string): Promise<void> {
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    console.log(`[CMS] Cache revalidated untuk slug: ${slug}`);
  } catch (error) {
    console.warn(`[CMS] Failed to revalidate cache untuk ${slug}:`, error);
  }
}

// ============ NAVBAR SETTINGS ============

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

export async function getNavbarSettings(): Promise<NavbarSettings> {
  try {
    const res = await api.get("/navbar/settings");
    return res.data.data;
  } catch (error) {
    console.warn("[CMS] Gagal memuat pengaturan navbar, pakai default");
    return {
      site_name: "PPNS",
      logo_url: null,
      show_admin: true,
      admin_label: "Admin",
      admin_href: "/admin",
      show_info_akademik: true,
      info_akademik_label: "Info Akademik",
      info_akademik_href: "/program",
    };
  }
}

export async function updateNavbarSettings(
  data: Partial<NavbarSettings>,
): Promise<NavbarSettings> {
  const res = await api.put("/navbar/settings", data);
  return res.data.data;
}

// ============ FOOTER SETTINGS ============

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

export async function getFooterSettings(): Promise<FooterSettings> {
  try {
    const res = await api.get("/footer/settings");
    return res.data.data;
  } catch (error) {
    console.warn("[CMS] Gagal memuat pengaturan footer, pakai default");
    return {
      site_name: "PPNS",
      tagline: "Smart Maritime Campus",
      description: "Building Indonesia&apos;s Future Maritime Technology Ecosystem since 1996.",
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
    };
  }
}

export async function updateFooterSettings(
  data: Partial<FooterSettings>,
): Promise<FooterSettings> {
  const res = await api.put("/footer/settings", data);
  return res.data.data;
}

// ============ NEWS ============

export interface NewsItemCMS {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tag: string;
  tags: { id: number; name: string }[];
  color: string;
  image: string;
  date: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export async function getNewsList(): Promise<NewsItemCMS[]> {
  try {
    const res = await api.get("/news");
    return res.data.data || [];
  } catch (error) {
    console.error("[CMS] Error mengambil daftar berita:", error);
    throw error;
  }
}

export async function getNewsBySlugApi(slug: string): Promise<NewsItemCMS | null> {
  try {
    const res = await api.get(`/news/${slug}`);
    return res.data.data || null;
  } catch (error) {
    console.warn(`[CMS] Berita dengan slug "${slug}" tidak ditemukan`);
    return null;
  }
}

export async function createNews(data: {
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  tag?: string;
  color?: string;
  image?: string;
  date?: string;
  published?: boolean;
}): Promise<NewsItemCMS> {
  try {
    const res = await api.post("/news", data);
    return res.data.data;
  } catch (error) {
    console.error("[CMS] Error membuat berita:", error);
    throw error;
  }
}

export async function updateNews(
  slug: string,
  data: Partial<NewsItemCMS>,
): Promise<void> {
  try {
    await api.put(`/news/${slug}`, data);
  } catch (error) {
    console.error(`[CMS] Error memperbarui berita "${slug}":`, error);
    throw error;
  }
}

export async function deleteNews(slug: string): Promise<void> {
  try {
    await api.delete(`/news/${slug}`);
  } catch (error) {
    console.error(`[CMS] Error menghapus berita "${slug}":`, error);
    throw error;
  }
}

// ============ REPORTS ============

export interface ReportCMS {
  id: number;
  slug: string;
  title: string;
  description: string;
  file_url: string;
  file_name: string;
  file_size: number;
  format: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export async function getReportList(): Promise<ReportCMS[]> {
  try {
    const res = await api.get("/reports?admin=true");
    return res.data.data || [];
  } catch (error) {
    console.error("[CMS] Error mengambil daftar laporan:", error);
    throw error;
  }
}

export async function getReportBySlugApi(slug: string): Promise<ReportCMS | null> {
  try {
    const res = await api.get(`/reports/${slug}`);
    return res.data.data || null;
  } catch (error) {
    console.warn(`[CMS] Laporan dengan slug "${slug}" tidak ditemukan`);
    return null;
  }
}

export async function createReport(data: {
  slug: string;
  title: string;
  description?: string;
  published?: boolean;
}): Promise<{ id: number; slug: string }> {
  try {
    const formData = new FormData();
    formData.append("slug", data.slug);
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.published !== undefined) formData.append("published", String(data.published));

    const res = await api.post("/reports", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  } catch (error) {
    console.error("[CMS] Error membuat laporan:", error);
    throw error;
  }
}

export async function updateReport(
  slug: string,
  data: FormData,
): Promise<void> {
  try {
    await api.put(`/reports/${slug}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    console.error(`[CMS] Error memperbarui laporan "${slug}":`, error);
    throw error;
  }
}

export async function deleteReport(slug: string): Promise<void> {
  try {
    await api.delete(`/reports/${slug}`);
  } catch (error) {
    console.error(`[CMS] Error menghapus laporan "${slug}":`, error);
    throw error;
  }
}

export async function getPublicReports(): Promise<ReportCMS[]> {
  try {
    const res = await api.get("/reports");
    return res.data.data || [];
  } catch (error) {
    console.error("[CMS] Error mengambil daftar laporan publik:", error);
    throw error;
  }
}
