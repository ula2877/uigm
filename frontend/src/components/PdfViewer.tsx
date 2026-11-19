"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface PdfViewerProps {
  url: string;
  title?: string;
  onClose: () => void;
}

export default function PdfViewer({ url, title, onClose }: PdfViewerProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/90">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0F172A] border-b border-white/10 shrink-0">
        <p className="text-sm text-white/70 truncate max-w-[70vw]">
          {title || "Lihat PDF"}
        </p>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* PDF embed */}
      <div className="flex-1 w-full">
        <embed
          src={url}
          type="application/pdf"
          className="w-full h-full"
          title={title || "PDF Viewer"}
        />
      </div>
    </div>
  );
}
