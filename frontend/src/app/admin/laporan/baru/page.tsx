"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Upload, FileText, X, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import api from "@/lib/api";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";

type SourceType = "upload" | "link" | "library";

export default function CreateLaporanPage() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [sourceType, setSourceType] = useState<SourceType>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkFileName, setLinkFileName] = useState("");
  const [libraryMedia, setLibraryMedia] = useState<{ url: string; name: string } | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (f.size > 20 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 20MB");
        return;
      }
      setFile(f);
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
    if (sourceType === "upload" && !file) {
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

      if (sourceType === "upload") {
        const formData = new FormData();
        formData.append("slug", slug);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("release_date", releaseDate);
        formData.append("published", "true");
        formData.append("file", file!);
        await api.post("/reports", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        const payload: Record<string, any> = {
          slug,
          title,
          description,
          release_date: releaseDate,
          published: true,
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
        await api.post("/reports", payload);
      }

      toast.success("Laporan berhasil dibuat");
      router.push("/admin/laporan/" + slug);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Gagal membuat laporan";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/laporan" className="p-2 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white font-[family-name:var(--font-display)]">Laporan Baru</h1>
            <p className="text-sm text-white/40 mt-1">Upload atau tautkan dokumen laporan baru</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FBBF24] text-[#0F172A] text-sm font-semibold hover:bg-[#FCD34D] transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Menyimpan..." : "Buat Laporan"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2">Slug *</label>
          <div className="flex items-center gap-1">
            <span className="text-white/30 text-sm font-mono">/laporan/</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
              placeholder="nama-laporan"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBBF24]/40"
            />
          </div>
          <p className="text-[10px] text-white/30 mt-1">URL: /laporan/{slug || "nama-laporan"}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2">Judul *</label>
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

        {sourceType === "upload" && (
          <>
            {file ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <FileText className="w-8 h-8 text-[#FBBF24]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{file.name}</p>
                  <p className="text-xs text-white/40">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="block w-full p-8 rounded-xl border-2 border-dashed border-white/10 hover:border-[#FBBF24]/40 text-center transition-all group cursor-pointer">
                <Upload className="w-8 h-8 text-white/30 mx-auto mb-2 group-hover:text-[#FBBF24] transition-colors" />
                <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors">
                  Klik untuk upload file PDF
                </p>
                <p className="text-xs text-white/20 mt-1">Maksimal 20MB</p>
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
                className="w-full p-8 rounded-xl border-2 border-dashed border-white/10 hover:border-[#FBBF24]/40 text-center transition-all group cursor-pointer"
              >
                <FileText className="w-8 h-8 text-white/30 mx-auto mb-2 group-hover:text-[#FBBF24] transition-colors" />
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
    </div>
  );
}
