"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Loader2, Trash2, Upload, Copy, Check, Image as ImageIcon, File } from "lucide-react";
import { toast } from "sonner";
import { getMedia, uploadFile, deleteMedia, mediaUrl } from "@/services/cms";
import type { Media } from "@/types/cms";

interface MediaLibraryProps {
  onSelectMedia?: (media: Media) => void;
  readOnly?: boolean;
}

type MediaTab = "all" | "image" | "file";

export default function MediaLibrary({ onSelectMedia, readOnly = false }: MediaLibraryProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const [tab, setTab] = useState<MediaTab>("all");
  const inputRef = useRef<HTMLInputElement>(null);

  const loadMedia = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMedia();
      setMedia(data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat media");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const filteredMedia = media.filter((m) => {
    if (tab === "image") return m.mime_type?.startsWith("image/");
    if (tab === "file") return m.mime_type === "application/pdf";
    return true;
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      toast.error("Hanya file gambar dan PDF yang diperbolehkan");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar (maksimal 20MB)");
      return;
    }

    try {
      setUploading(true);
      await uploadFile(file);
      toast.success("File berhasil diupload");
      await loadMedia();
    } catch (error) {
      console.error(error);
      toast.error("Gagal upload file");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  // Handle delete media
  const handleDelete = async (m: Media) => {
    if (!window.confirm(`Hapus file "${m.filename}"?`)) {
      return;
    }

    try {
      setDeleting(m.id);
      await deleteMedia(m.id);
      toast.success("File berhasil dihapus");
      await loadMedia();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus file");
    } finally {
      setDeleting(null);
    }
  };

  // Copy URL to clipboard
  const handleCopyUrl = (m: Media) => {
    const url = mediaUrl(m.url);
    navigator.clipboard.writeText(url);
    setCopied(m.id);
    setTimeout(() => setCopied(null), 2000);
    toast.success("URL disalin ke clipboard");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 text-[#FBBF24] animate-spin" />
      </div>
    );
  }

  const activeTab = "border-b-2 border-[#FBBF24] text-[#FBBF24]";
  const inactiveTab = "text-white/50 hover:text-white border-b-2 border-transparent";

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/5">
        <button
          onClick={() => setTab("all")}
          className={`px-4 py-2 text-sm font-medium transition-all ${tab === "all" ? activeTab : inactiveTab}`}
        >
          Semua ({media.length})
        </button>
        <button
          onClick={() => setTab("image")}
          className={`px-4 py-2 text-sm font-medium transition-all ${tab === "image" ? activeTab : inactiveTab}`}
        >
          Gambar ({media.filter((m) => m.mime_type?.startsWith("image/")).length})
        </button>
        <button
          onClick={() => setTab("file")}
          className={`px-4 py-2 text-sm font-medium transition-all ${tab === "file" ? activeTab : inactiveTab}`}
        >
          File ({media.filter((m) => m.mime_type === "application/pdf").length})
        </button>
      </div>

      {/* Upload area */}
      {!readOnly && (
         <label className="block border-2 border-dashed border-white/20 rounded-2xl p-8 text-center cursor-pointer hover:border-white/40 hover:bg-white/5 transition-all">
           <input
             ref={inputRef}
             type="file"
             accept="image/*,.pdf,application/pdf"
             onChange={handleUpload}
             disabled={uploading}
             className="hidden"
           />
           <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
           <p className="text-white/70 text-sm font-medium">
             {uploading ? "Mengunggah..." : "Klik atau tarik file ke sini"}
           </p>
           <p className="text-white/40 text-xs mt-1">Format: JPG, PNG, GIF, WebP, PDF (Maksimal 20MB)</p>
         </label>
      )}

      {/* Media grid */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-12">
          {tab === "file" ? (
            <File className="w-12 h-12 text-white/20 mx-auto mb-3" />
          ) : (
            <ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
          )}
          <p className="text-white/40">
            {tab === "all" ? "Belum ada media" : tab === "image" ? "Belum ada gambar" : "Belum ada file"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredMedia.map((m) => {
            const url = mediaUrl(m.url);
            const isPdf = m.mime_type === "application/pdf";
            return (
              <div
                key={m.id}
                className="group relative rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all"
              >
                {/* Thumbnail */}
                {isPdf ? (
                  <div className="w-full h-32 flex items-center justify-center bg-gradient-to-br from-orange-500/10 to-orange-600/5">
                    <File className="w-12 h-12 text-[#FBBF24]" />
                  </div>
                ) : (
                  <img
                    src={url}
                    alt={m.filename}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  {onSelectMedia && (
                    <button
                      onClick={() => onSelectMedia(m)}
                      className="px-3 py-1.5 rounded-lg bg-[#FBBF24] text-[#0F172A] text-xs font-semibold hover:bg-[#FCD34D] transition-all w-full"
                    >
                      Pilih
                    </button>
                  )}

                  <button
                    onClick={() => handleCopyUrl(m)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all w-full"
                    title="Salin URL"
                  >
                    {copied === m.id ? (
                      <Check className="w-3.5 h-3.5 mx-auto" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 mx-auto" />
                    )}
                  </button>

                  {!readOnly && (
                    <button
                      onClick={() => handleDelete(m)}
                      disabled={deleting === m.id}
                      className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all w-full disabled:opacity-50"
                      title="Hapus"
                    >
                      {deleting === m.id ? (
                        <Loader2 className="w-3.5 h-3.5 mx-auto animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5 mx-auto" />
                      )}
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white/70 text-[10px] truncate">{m.filename}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}