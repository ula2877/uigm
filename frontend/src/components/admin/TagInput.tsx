"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { X, Plus, Tag, ChevronDown } from "lucide-react";

interface TagInputProps {
  value: string;
  onChange: (value: string) => void;
  allTags: string[];
  placeholder?: string;
}

export default function TagInput({
  value,
  onChange,
  allTags,
  placeholder = "Cari atau ketik tag baru...",
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedTags = useMemo(
    () => value.split(",").filter(Boolean),
    [value],
  );

  const filtered = useMemo(() => {
    if (!inputValue.trim()) return allTags;
    const q = inputValue.toLowerCase();
    return allTags.filter((t) => t.toLowerCase().includes(q));
  }, [allTags, inputValue]);

  const isNewTag =
    inputValue.trim() && !allTags.some((t) => t.toLowerCase() === inputValue.trim().toLowerCase());

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || selectedTags.includes(trimmed)) return;
    const next = [...selectedTags, trimmed].join(",");
    onChange(next);
    setInputValue("");
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  const removeTag = (tag: string) => {
    const next = selectedTags.filter((t) => t !== tag).join(",");
    onChange(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && filtered[focusedIndex]) {
        addTag(filtered[focusedIndex]);
      } else if (isNewTag) {
        addTag(inputValue.trim());
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const max = filtered.length + (isNewTag ? 1 : 0);
      setFocusedIndex((prev) => Math.min(prev + 1, max - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Backspace" && !inputValue && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div
        className="flex flex-wrap items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 cursor-text focus-within:border-[#FBBF24]/40 transition-colors min-h-[42px]"
        onClick={() => inputRef.current?.focus()}
      >
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FBBF24]/15 text-[#FBBF24] text-xs font-medium"
          >
            <Tag className="w-3 h-3" />
            {tag}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setOpen(true);
            setFocusedIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selectedTags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[80px] bg-transparent text-white text-sm placeholder:text-white/30 outline-none border-none"
        />
        <button
          onClick={() => setOpen(!open)}
          className="p-0.5 text-white/30 hover:text-white/60 transition-colors"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {open && (filtered.length > 0 || isNewTag) && (
        <div
          ref={dropdownRef}
          className="absolute z-50 top-full left-0 right-0 mt-1 rounded-xl bg-[#1A1A2E] border border-white/10 shadow-2xl overflow-hidden max-h-48 overflow-y-auto"
        >
          {filtered.map((tag, i) => (
            <button
              key={tag}
              onClick={() => addTag(tag)}
              onMouseEnter={() => setFocusedIndex(i)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                focusedIndex === i ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
              }`}
            >
              <Tag className="w-3.5 h-3.5 flex-shrink-0" />
              {tag}
            </button>
          ))}
          {isNewTag && (
            <button
              onClick={() => addTag(inputValue.trim())}
              onMouseEnter={() => setFocusedIndex(filtered.length)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left border-t border-white/5 transition-colors ${
                focusedIndex === filtered.length ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
              }`}
            >
              <Plus className="w-3.5 h-3.5 flex-shrink-0 text-[#FBBF24]" />
              Buat tag "<span className="font-medium text-[#FBBF24]">{inputValue.trim()}</span>"
            </button>
          )}
        </div>
      )}
    </div>
  );
}
