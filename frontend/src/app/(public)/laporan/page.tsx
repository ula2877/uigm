"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Search, Shield, FileCheck, Calendar, ExternalLink } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionTitle from "@/components/SectionTitle";
import CTASection from "@/components/CTASection";
import EmptyState from "@/components/EmptyState";
import PdfViewer from "@/components/PdfViewer";
import { fetchReports, getCmsApiBase } from "@/lib/cms";

interface ReportItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  file_url: string;
  file_name: string;
  file_size: number;
  format: string;
  release_date: string;
  created_at: string;
}

function formatBytes(bytes: number) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

function getYear(dateStr: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d.getFullYear();
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
}

export default function LaporanPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [viewerTitle, setViewerTitle] = useState("");

  useEffect(() => {
    fetchReports()
      .then((data) => {
        setReports((data || []) as ReportItem[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const years = [...new Set(reports.map((r) => getYear(r.release_date)).filter(Boolean))].sort((a, b) => (b as number) - (a as number)) as number[];

  const filtered = reports.filter((r) => {
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || (r.description || "").toLowerCase().includes(search.toLowerCase());
    const matchYear = !filterYear || getYear(r.release_date) === filterYear;
    return matchSearch && matchYear;
  });

  const latestYear = reports.length > 0
    ? Math.max(...reports.map((r) => getYear(r.release_date) || 0), 0)
    : null;

  return (
    <>
      <PageHero
        bgImage="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1440&q=80"
        title="Laporan Keberlanjutan"
        subtitle="Dokumen transparansi dan akuntabilitas program Green Campus PPNS"
        breadcrumbs={[{ label: "Beranda", href: "/" }, { label: "Laporan" }]}
      />

      <section className="relative pt-8 sm:pt-12 pb-16 sm:pb-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: FileText, value: String(reports.length), label: "Total Dokumen" },
              { icon: Shield, value: "100%", label: "Transparan" },
              { icon: FileCheck, value: latestYear ? String(latestYear) : "-", label: "Tahun Terbaru" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-[#F8FAFC] border border-gray-100 text-center group hover:shadow-md transition-all"
              >
                <item.icon className="w-8 h-8 text-[#FBBF24] mx-auto mb-3 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <div className="text-3xl font-black text-[#0F172A] font-[family-name:var(--font-display)]">{item.value}</div>
                <div className="text-sm text-gray-400 mt-1">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative pb-20 sm:pb-28 bg-white overflow-hidden">
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.03] pointer-events-none" style={{ background: '#1E3A8A', top: '20%', left: -50 }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle badge="Download Center" title="Dokumen" highlight="Tersedia" align="left" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl bg-[#F8FAFC] border border-gray-100 mb-12"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Cari dokumen..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50 focus:border-[#FBBF24] transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterYear(null)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${!filterYear ? "bg-[#0F172A] text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}
              >
                Semua Tahun
              </button>
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setFilterYear(year === filterYear ? null : year)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${filterYear === year ? "bg-[#0F172A] text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}
                >
                  {year}
                </button>
              ))}
            </div>
          </motion.div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Memuat...</div>
          ) : filtered.length === 0 ? (
            <EmptyState message="Tidak ada dokumen ditemukan" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((report, i) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: '-80px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group p-6 sm:p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-50/50 to-transparent rounded-bl-full -z-10" />
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-7 h-7 text-[#F97316]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 font-[family-name:var(--font-display)]">{report.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-2">{report.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                    <Calendar className="w-3 h-3" />
                    {formatDate(report.release_date)}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">{report.format} &bull; {formatBytes(report.file_size)}</span>
                    {report.format === "LINK" ? (
                      <a
                        href={report.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold hover:bg-[#0F4C81] hover:text-white transition-all duration-300"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Buka Link
                      </a>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setViewerUrl(`${getCmsApiBase()}/reports/view/${report.slug}`); setViewerTitle(report.title); }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0F4C81]/5 text-[#0F4C81] text-xs font-semibold hover:bg-[#0F4C81]/10 transition-all duration-300"
                        >
                          <Search className="w-3.5 h-3.5" />
                          Lihat
                        </button>
                        <a
                          href={`${getCmsApiBase()}/reports/download/${report.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold hover:bg-[#0F4C81] hover:text-white transition-all duration-300"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Unduh
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection
        title="Butuh Dokumen Lain?"
        description="Hubungi kami untuk permintaan dokumen atau informasi lebih lanjut."
        buttons={[{ label: "Hubungi Kami", href: "/kontak", variant: "primary" }]}
        bgImage="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1920&q=80"
      />

      {viewerUrl && (
        <PdfViewer
          url={viewerUrl}
          title={viewerTitle}
          onClose={() => setViewerUrl(null)}
        />
      )}
    </>
  );
}
