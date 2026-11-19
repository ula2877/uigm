import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const MONTHS_INA = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function formatDateIndonesian(dateStr: string): string {
  if (!dateStr) return "";
  if (/[a-zA-Z]/.test(dateStr)) return dateStr;
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const y = parts[0], m = parseInt(parts[1], 10), d = parseInt(parts[2], 10);
    return `${d} ${MONTHS_INA[m - 1] || parts[1]} ${y}`;
  }
  return dateStr;
}

const TAG_COLOR_PALETTE = [
  "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
  "bg-orange-100 text-orange-700",
  "bg-teal-100 text-teal-700",
  "bg-pink-100 text-pink-700",
  "bg-indigo-100 text-indigo-700",
  "bg-lime-100 text-lime-700",
  "bg-violet-100 text-violet-700",
  "bg-sky-100 text-sky-700",
  "bg-fuchsia-100 text-fuchsia-700",
  "bg-red-100 text-red-700",
  "bg-yellow-100 text-yellow-700",
];

export function getTagColor(tagName: string): string {
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % TAG_COLOR_PALETTE.length;
  return TAG_COLOR_PALETTE[idx];
}

export function extractMediaBlocks(html: string): { textHtml: string; mediaHtml: string } {
  if (!html || !html.includes("<")) return { textHtml: html, mediaHtml: "" };

  const blocks: string[] = [];
  let remaining = html;

  // YouTube: <div data-youtube-video="">...</div>
  remaining = remaining.replace(
    /<div\b[^>]*?data-youtube-video\b[^>]*>[\s\S]*?<\/div>/gi,
    (match) => {
      blocks.push(match);
      return "%%MEDIA_BLOCK%%";
    },
  );

  // Vimeo: <figure class="video-container">...</figure>
  remaining = remaining.replace(
    /<figure\b[^>]*?video-container[^>]*>[\s\S]*?<\/figure>/gi,
    (match) => {
      blocks.push(match);
      return "%%MEDIA_BLOCK%%";
    },
  );

  // Standalone iframes (not inside a wrapper)
  remaining = remaining.replace(
    /<iframe\b([^>]*?)<\/iframe>/gi,
    (match) => {
      blocks.push(match);
      return "%%MEDIA_BLOCK%%";
    },
  );

  // Images
  remaining = remaining.replace(
    /<img\b[^>]*?>/gi,
    (match) => {
      blocks.push(match);
      return "%%MEDIA_BLOCK%%";
    },
  );

  // Strip leftover placeholders from text
  const textHtml = remaining.replace(/%%MEDIA_BLOCK%%/g, "");

  return { textHtml, mediaHtml: blocks.join("\n") };
}
