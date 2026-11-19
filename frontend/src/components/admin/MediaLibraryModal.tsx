"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MediaLibrary from "./MediaLibrary";
import type { Media } from "@/types/cms";

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, name: string) => void;
}

export default function MediaLibraryModal({ isOpen, onClose, onSelect }: MediaLibraryModalProps) {
  const handleSelect = (media: Media) => {
    const url = media.url.startsWith("http") ? media.url : `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "")}/${media.url.replace(/^\//, "")}`;
    onSelect(url, media.filename);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Pilih dari Media Library</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <MediaLibrary onSelectMedia={handleSelect} readOnly />
        </div>
      </DialogContent>
    </Dialog>
  );
}
