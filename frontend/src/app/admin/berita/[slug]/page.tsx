"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import api from "@/lib/api";
import ImageField from "@/components/admin/ImageField";
import TagInput from "@/components/admin/TagInput";
import TiptapEditor from "@/components/editor/TiptapEditor";

interface NewsItemCMS {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tag: string;
  color: string;
  image: string;
  date: string;
  published: boolean;
}

export default function EditBeritaPage() {
  const router = useRouter();
  const params = useParams();
  const slugParam = params?.slug as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slug, setSlug] = useState(slugParam);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  const [published, setPublished] = useState(true);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    api.get("/tags").then((res) => {
      setAllTags((res.data.data || []).map((t: any) => t.name));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/news/${slugParam}`);
        const item: any = res.data.data;
        setSlug(item.slug);
        setTitle(item.title);
        setExcerpt(item.excerpt || "");
        setContent(item.content || "");
        setTag((item.tags || []).map((t: any) => t.name).join(","));
        setImage(item.image || "");
        setDate(item.date || "");
        setPublished(item.published);
      } catch {
        toast.error("Berita tidak ditemukan");
        router.push("/admin/berita");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slugParam, router]);

  const handleSave = async () => {
    if (!slug || !title) {
      toast.error("Slug dan judul wajib diisi");
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Session expired. Silakan login kembali");
      router.push("/admin");
      return;
    }

    try {
      setSaving(true);
      await api.put(`/news/${slugParam}`, {
        title,
        excerpt,
        content,
        tags: tag ? tag.split(",").map((t) => t.trim()).filter(Boolean) : [],
        image,
        date,
        published,
      });
      toast.success("Berita berhasil disimpan");
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Gagal menyimpan berita";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 text-[#FBBF24] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/berita" className="p-2 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white font-[family-name:var(--font-display)]">Edit Berita</h1>
            <p className="text-sm text-white/40 mt-1">URL: /berita/{slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
            <span className="text-xs text-white/50">Published</span>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 accent-[#FBBF24]"
            />
          </label>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FBBF24] text-[#0F172A] text-sm font-semibold hover:bg-[#FCD34D] transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2">Slug</label>
          <div className="flex items-center gap-1">
            <span className="text-white/30 text-sm font-mono">/berita/</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
              placeholder="judul-berita"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2">Judul</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul berita"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2">Tag</label>
          <TagInput
            value={tag}
            onChange={(val) => setTag(val)}
            allTags={allTags}
            placeholder="Cari atau buat tag baru..."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2">Tanggal</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40 [color-scheme:dark]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-2">Gambar Sampul</label>
        <ImageField
          value={image}
          onChange={(val) => setImage(val)}
          label="Gambar"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-2">Ringkasan (Excerpt)</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Ringkasan singkat berita"
          rows={3}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40 resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-2">Konten</label>
        <TiptapEditor
          value={content}
          onChange={(html) => setContent(html)}
          placeholder="Tulis konten berita..."
        />
      </div>
    </div>
  );
}
