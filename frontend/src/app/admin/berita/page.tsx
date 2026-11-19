"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Newspaper,
  Tags,
  Plus,
  Loader2,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { getTagColor } from "@/lib/utils";

interface NewsItemCMS {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  tags: { id: number; name: string }[];
  color: string;
  image: string;
  date: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface TagItem {
  id: number;
  name: string;
}

type Tab = "news" | "tags";

export default function BeritaPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("news");

  // News state
  const [news, setNews] = useState<NewsItemCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Tags state
  const [tags, setTags] = useState<TagItem[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [deletingTagId, setDeletingTagId] = useState<number | null>(null);

  const loadNews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/news?admin=true");
      setNews(res.data.data);
    } catch {
      toast.error("Gagal memuat daftar berita");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTags = useCallback(async () => {
    try {
      setTagsLoading(true);
      const res = await api.get("/tags");
      setTags(res.data.data || []);
    } catch {
      toast.error("Gagal memuat tag");
    } finally {
      setTagsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  // News handlers
  const handleDeleteNews = async (item: NewsItemCMS) => {
    if (!window.confirm(`Hapus berita "${item.title}"?`)) return;
    try {
      setDeletingId(item.id);
      await api.delete(`/news/${item.slug}`);
      toast.success("Berita berhasil dihapus");
      await loadNews();
    } catch {
      toast.error("Gagal menghapus berita");
    } finally {
      setDeletingId(null);
    }
  };

  const handlePublishToggle = async (item: NewsItemCMS) => {
    try {
      setUpdatingId(item.id);
      await api.put(`/news/${item.slug}`, { published: !item.published });
      toast.success(item.published ? "Berita ditarik" : "Berita dipublikasikan");
      await loadNews();
    } catch {
      toast.error("Gagal mengubah status publikasi");
    } finally {
      setUpdatingId(null);
    }
  };

  // Tag handlers
  const handleDeleteTag = async (id: number, name: string) => {
    if (!window.confirm(`Hapus tag "${name}" secara permanen?`)) return;
    try {
      setDeletingTagId(id);
      await api.delete(`/tags/${id}`);
      toast.success(`Tag "${name}" berhasil dihapus`);
      await loadTags();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Gagal menghapus tag";
      toast.error(msg);
    } finally {
      setDeletingTagId(null);
    }
  };

  const activeTabClass =
    "bg-[#FBBF24]/10 text-[#FBBF24] border-b-2 border-[#FBBF24]";
  const inactiveTabClass =
    "text-white/50 hover:text-white hover:bg-white/5 border-b-2 border-transparent";

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/5">
        <button
          onClick={() => setTab("news")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all ${tab === "news" ? activeTabClass : inactiveTabClass}`}
        >
          <Newspaper className="w-4 h-4" />
          Berita
        </button>
        <button
          onClick={() => { setTab("tags"); loadTags(); }}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all ${tab === "tags" ? activeTabClass : inactiveTabClass}`}
        >
          <Tags className="w-4 h-4" />
          Tag
        </button>
      </div>

      {/* === TAB: NEWS === */}
      {tab === "news" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold text-white font-[family-name:var(--font-display)]">
                Kelola Berita
              </h1>
              <p className="text-sm text-white/40 mt-1">
                Kelola artikel berita website
              </p>
            </div>
            <button
              onClick={() => router.push("/admin/berita/baru")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FBBF24] text-[#0F172A] text-sm font-semibold hover:bg-[#FCD34D] transition-all"
            >
              <Plus className="w-4 h-4" />
              Berita Baru
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-6 h-6 text-[#FBBF24] animate-spin" />
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 mb-4">Belum ada berita</p>
              <button
                onClick={() => router.push("/admin/berita/baru")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                Buat Berita Pertama
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider py-3 px-4">
                      Judul
                    </th>
                    <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider py-3 px-4">
                      Slug
                    </th>
                    <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider py-3 px-4 w-24">
                      Tag
                    </th>
                    <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider py-3 px-4 w-28">
                      Tanggal
                    </th>
                    <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider py-3 px-4 w-24">
                      Status
                    </th>
                    <th className="text-right text-xs font-semibold text-white/40 uppercase tracking-wider py-3 px-4 w-36">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {news.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => router.push(`/admin/berita/${item.slug}`)}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Newspaper className="w-4 h-4 text-white/30" />
                          <span className="text-white font-medium">
                            {item.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/40 font-mono text-xs">
                        /berita/{item.slug}
                      </td>
                      <td className="py-3 px-4">
                        {item.tags && item.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((t: { id: number; name: string }) => (
                              <span
                                key={t.id}
                                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${getTagColor(t.name)}`}
                              >
                                {t.name}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </td>
                      <td className="py-3 px-4 text-white/40 text-xs">
                        {item.date || "—"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            item.published
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-yellow-500/10 text-yellow-400"
                          }`}
                        >
                          {item.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePublishToggle(item);
                            }}
                            disabled={updatingId === item.id}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors disabled:opacity-50"
                          >
                            {updatingId === item.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : item.published ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <a
                            href={`/berita/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNews(item);
                            }}
                            disabled={deletingId === item.id}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors disabled:opacity-50"
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* === TAB: TAGS === */}
      {tab === "tags" && (
        <div className="space-y-4">
          <div>
            <h1 className="text-xl font-bold text-white font-[family-name:var(--font-display)]">
              Kelola Tag
            </h1>
            <p className="text-sm text-white/40 mt-1">
              Kelola tag berita ({tags.length} tag)
            </p>
          </div>

          {tagsLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-6 h-6 text-[#FBBF24] animate-spin" />
            </div>
          ) : tags.length === 0 ? (
            <div className="text-center py-20 text-white/30">
              <Tags className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Belum ada tag</p>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider py-3 px-4">
                      Nama Tag
                    </th>
                    <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider py-3 px-4 w-20">
                      ID
                    </th>
                    <th className="text-right text-xs font-semibold text-white/40 uppercase tracking-wider py-3 px-4 w-20">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tags.map((tag) => (
                    <tr
                      key={tag.id}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="py-3 px-4">
                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${getTagColor(tag.name)}`}>
                          {tag.name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white/30 text-xs">
                        {tag.id}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteTag(tag.id, tag.name)}
                          disabled={deletingTagId === tag.id}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Hapus tag"
                        >
                          {deletingTagId === tag.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
