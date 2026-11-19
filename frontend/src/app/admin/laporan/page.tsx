"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FileText, Plus, Loader2, Eye, EyeOff, Trash2, ExternalLink, Download, Search } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import PdfViewer from "@/components/PdfViewer";

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
  created_at: string;
}

function formatBytes(bytes: number) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

export default function LaporanPage() {
  const router = useRouter();
  const [items, setItems] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [viewerTitle, setViewerTitle] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/reports?admin=true");
      setItems(res.data.data);
    } catch {
      toast.error("Gagal memuat daftar laporan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (item: ReportItem) => {
    if (!window.confirm(`Hapus laporan "${item.title}"?`)) return;
    try {
      setDeletingId(item.id);
      await api.delete(`/reports/${item.slug}`);
      toast.success("Laporan berhasil dihapus");
      await load();
    } catch {
      toast.error("Gagal menghapus laporan");
    } finally {
      setDeletingId(null);
    }
  };

  const handlePublishToggle = async (item: ReportItem) => {
    try {
      setUpdatingId(item.id);
      const formData = new FormData();
      formData.append("published", String(!item.published));
      await api.put(`/reports/${item.slug}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(item.published ? "Laporan ditarik" : "Laporan dipublikasikan");
      await load();
    } catch {
      toast.error("Gagal mengubah status publikasi");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white font-[family-name:var(--font-display)]">
            Kelola Laporan
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Kelola dokumen laporan website
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/laporan/baru")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FBBF24] text-[#0F172A] text-sm font-semibold hover:bg-[#FCD34D] transition-all"
        >
          <Plus className="w-4 h-4" />
          Laporan Baru
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 text-[#FBBF24] animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 mb-4">Belum ada laporan</p>
          <button
            onClick={() => router.push("/admin/laporan/baru")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Buat Laporan Pertama
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
                  File
                </th>
                <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider py-3 px-4 w-20">
                  Ukuran
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
              {items.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => router.push(`/admin/laporan/${item.slug}`)}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] cursor-pointer"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-white/30" />
                      <span className="text-white font-medium">{item.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white/40 text-xs">
                    {item.file_name}
                  </td>
                  <td className="py-3 px-4 text-white/40 text-xs">
                    {formatBytes(item.file_size)}
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
                      {item.format === "LINK" ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); window.open(item.file_url, "_blank"); }}
                          className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
                          title="Buka link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); setViewerUrl(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"}/reports/view/${item.slug}`); setViewerTitle(item.title); }}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-[#FBBF24] transition-colors"
                            title="Lihat PDF"
                          >
                            <Search className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); window.open(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"}/reports/download/${item.slug}`, "_blank"); }}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
                            title="Download file"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item);
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

      {viewerUrl && (
        <PdfViewer
          url={viewerUrl}
          title={viewerTitle}
          onClose={() => setViewerUrl(null)}
        />
      )}
    </div>
  );
}
