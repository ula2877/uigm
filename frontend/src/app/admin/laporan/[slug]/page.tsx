"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2, Upload, FileText, X, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import api from "@/lib/api";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";
import PdfViewer from "@/components/PdfViewer";

type SourceType = "upload" | "link" | "library";

interface ReportItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  file_url: string;
  file_name: string;
  file_size: number;
  format: string;
  published: boolean;
  release_date: string;
}

export default function EditLaporanPage() {
  const router = useRouter();
  const params = useParams();
  const slugParam = params?.slug as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slug, setSlug] = useState(slugParam);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(true);
  const [releaseDate, setReleaseDate] = useState("");
  const [existingFile, setExistingFile] = useState<{ name: string; url: string; size: number; format: string } | null>(null);
  const [sourceType, setSourceType] = useState<SourceType>("upload");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkFileName, setLinkFileName] = useState("");
  const [libraryMedia, setLibraryMedia] = useState<{ url: string; name: string } | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/reports/${slugParam}`);
        const item: ReportItem = res.data.data;
        setTitle(item.title);
        setDescription(item.description || "");
        setPublished(item.published);
        setReleaseDate(item.release_date || "");
        setExistingFile({
          name: item.file_name,
          url: item.file_url,
          size: item.file_size,
          format: item.format,
        });
        if (item.format === "LINK") {
          setSourceType("link");
          setLinkUrl(item.file_url);
          setLinkFileName(item.file_name);
        } else if (item.file_url) {
          setSourceType("upload");
        }
      } catch {
        toast.error("Laporan tidak ditemukan");
        router.push("/admin/laporan");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slugParam, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (f.size > 20 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 20MB");
        return;
      }
      setNewFile(f);
    }
  };

  const handleSelectFromLibrary = (url: string, name: string) => {
    setLibraryMedia({ url, name });
    setShowLibrary(false);
  };

  const handleSave = async () => {
    if (!slug || !title) {
      toast.error("Slug dan judul wajib diisi");
      return;
    }
    if (sourceType === "upload" && !newFile && !existingFile) {
      toast.error("Pilih file PDF untuk diupload");
      return;
    }
    if (sourceType === "link" && !linkUrl) {
      toast.error("Masukkan URL link laporan");
      return;
    }
    if (sourceType === "library" && !libraryMedia) {
      toast.error("Pilih file dari Media Library");
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

      if (sourceType === "upload" && newFile) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("published", String(published));
        formData.append("release_date", releaseDate);
        formData.append("file", newFile);
        await api.put(`/reports/${slugParam}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        const payload: Record<string, any> = {
          title,
          description,
          published: String(published),
          release_date: releaseDate,
        };
        if (sourceType === "link") {
          payload.file_url = linkUrl;
          payload.file_name = linkFileName || "Laporan via Link";
          payload.format = "LINK";
        } else if (sourceType === "library") {
          payload.file_url = libraryMedia!.url;
          payload.file_name = libraryMedia!.name;
          payload.format = "PDF";
        }
        await api.put(`/reports/${slugParam}`, payload);
      }

      toast.success("Laporan berhasil disimpan");
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Gagal menyimpan laporan";
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
          <Link href="/admin/laporan" className="p-2 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white font-[family-name:var(--font-display)]">Edit Laporan</h1>
            <p className="text-sm text-white/40 mt-1">URL: /laporan/{slug}</p>
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
          <input
            value={slug}
            disabled
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/40 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2">Judul</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul laporan"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2">Tanggal Rilis</label>
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40 [color-scheme:dark]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-2">Deskripsi</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi singkat laporan"
          rows={3}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40 resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-3">Sumber File *</label>
        <div className="flex gap-2 mb-4">
          {[
            { key: "upload" as const, icon: Upload, label: "Upload PDF" },
            { key: "link" as const, icon: LinkIcon, label: "Link URL" },
            { key: "library" as const, icon: FileText, label: "Dari Library" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSourceType(opt.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                sourceType === opt.key
                  ? "bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20"
                  : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/70"
              }`}
            >
              <opt.icon className="w-4 h-4" />
              {opt.label}
            </button>
          ))}
        </div>

        {/* Existing file info */}
        {existingFile && !newFile && sourceType !== "link" && sourceType !== "library" && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 mb-3">
            <FileText className="w-8 h-8 text-[#FBBF24]" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{existingFile.name}</p>
              <p className="text-xs text-white/40">
                {existingFile.format === "LINK" ? "Link eksternal" : `${(existingFile.size / (1024 * 1024)).toFixed(1)} MB`}
              </p>
            </div>
            {existingFile?.format === "LINK" ? (
              <button
                onClick={() => window.open(existingFile.url, "_blank")}
                className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors text-xs"
              >
                Buka Link
              </button>
            ) : (
              <>
                <button
                  onClick={() => setViewerUrl(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"}/reports/view/${slug}`)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-[#FBBF24] transition-colors text-xs"
                >
                  Lihat
                </button>
                <button
                  onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"}/reports/download/${slug}`, "_blank")}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors text-xs"
                >
                  Download
                </button>
              </>
            )}
          </div>
        )}

        {sourceType === "upload" && (
          <>
            {newFile ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FBBF24]/5 border border-[#FBBF24]/20">
                <FileText className="w-8 h-8 text-[#FBBF24]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{newFile.name}</p>
                  <p className="text-xs text-white/40">{(newFile.size / (1024 * 1024)).toFixed(1)} MB (baru)</p>
                </div>
                <button
                  onClick={() => setNewFile(null)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="block w-full p-6 rounded-xl border-2 border-dashed border-white/10 hover:border-[#FBBF24]/40 text-center transition-all group cursor-pointer">
                <Upload className="w-6 h-6 text-white/30 mx-auto mb-2 group-hover:text-[#FBBF24] transition-colors" />
                <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors">
                  {existingFile ? "Ganti file PDF" : "Klik untuk upload file PDF"}
                </p>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </>
        )}

        {sourceType === "link" && (
          <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">URL Laporan</label>
              <input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Nama File (opsional)</label>
              <input
                value={linkFileName}
                onChange={(e) => setLinkFileName(e.target.value)}
                placeholder="Laporan Tahunan 2026"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40"
              />
            </div>
          </div>
        )}

        {sourceType === "library" && (
          <div>
            {libraryMedia ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <FileText className="w-8 h-8 text-[#FBBF24]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{libraryMedia.name}</p>
                  <p className="text-xs text-white/40 truncate">{libraryMedia.url}</p>
                </div>
                <button
                  onClick={() => setLibraryMedia(null)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLibrary(true)}
                className="w-full p-6 rounded-xl border-2 border-dashed border-white/10 hover:border-[#FBBF24]/40 text-center transition-all group cursor-pointer"
              >
                <FileText className="w-6 h-6 text-white/30 mx-auto mb-2 group-hover:text-[#FBBF24] transition-colors" />
                <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors">
                  Pilih dari Media Library
                </p>
              </button>
            )}
          </div>
        )}
      </div>

      {showLibrary && (
        <MediaLibraryModal
          isOpen={showLibrary}
          onClose={() => setShowLibrary(false)}
          onSelect={handleSelectFromLibrary}
        />
      )}

      {viewerUrl && (
        <PdfViewer
          url={viewerUrl}
          title={title}
          onClose={() => setViewerUrl(null)}
        />
      )}
    </div>
  );
}
