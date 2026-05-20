import { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Info, Check, Play, Image as ImageIcon, Layers } from "lucide-react";
import type { DatasetRow } from "./types";
import { daysOnline } from "./mockData";
import { oyAdImages } from "@/data/oyImages";

interface Props {
  rows: DatasetRow[];
  index: number;
  selectedRows: Set<string>;
  onChangeIndex: (i: number) => void;
  onToggleSelect: (rowId: string) => void;
  onOpenInfo: (row: DatasetRow) => void;
  onClose: () => void;
}

function FormatIcon({ format, className }: { format: string; className?: string }) {
  if (format === "Video") return <Play className={className} />;
  if (format === "Carousel") return <Layers className={className} />;
  return <ImageIcon className={className} />;
}

export default function AdLightbox({
  rows, index, selectedRows, onChangeIndex, onToggleSelect, onOpenInfo, onClose,
}: Props) {
  const row = rows[index];
  const total = rows.length;

  const goPrev = useCallback(() => {
    onChangeIndex((index - 1 + total) % total);
  }, [index, total, onChangeIndex]);

  const goNext = useCallback(() => {
    onChangeIndex((index + 1) % total);
  }, [index, total, onChangeIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
      else if (e.key === " " || e.key === "Enter") {
        if (row) { e.preventDefault(); onToggleSelect(row.id); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goPrev, goNext, onClose, onToggleSelect, row]);

  if (!row) return null;

  const img = oyAdImages[(parseInt(row.id, 10) || index) % oyAdImages.length];
  const selected = selectedRows.has(row.id);
  const days = daysOnline(row.firstLaunched);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      {/* Click-out */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 py-3 text-white">
        <div className="flex items-center gap-2 min-w-0">
          {row.brandAvatar && (
            <img src={row.brandAvatar} alt={row.brand} className="h-7 w-7 rounded shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{row.brand}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-white/70">
              <FormatIcon format={row.format} className="h-3 w-3" />
              <span>{row.format}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                {row.status === "Active" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                {days}d online
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/70 tabular-nums px-2">
            {index + 1} / {total}
          </span>
          <Button
            variant="secondary"
            size="sm"
            className={cn(
              "h-8 text-xs gap-1.5",
              selected
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-white/10 text-white hover:bg-white/20 border border-white/20",
            )}
            onClick={() => onToggleSelect(row.id)}
          >
            {selected ? <Check className="h-3.5 w-3.5" /> : null}
            {selected ? "Selected" : "Select"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/15"
            onClick={() => onOpenInfo(row)}
            aria-label="View details"
          >
            <Info className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/15"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Prev */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        className="absolute left-4 z-10 h-11 w-11 rounded-full bg-white/90 hover:bg-white text-foreground flex items-center justify-center shadow-lg transition-all"
        aria-label="Previous ad"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Image */}
      <div
        className="relative z-[5] max-w-[min(90vw,720px)] max-h-[85vh] rounded-xl overflow-hidden shadow-2xl bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img}
          alt={row.headline}
          className="block max-w-full max-h-[85vh] object-contain"
        />
      </div>

      {/* Next */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        className="absolute right-4 z-10 h-11 w-11 rounded-full bg-white/90 hover:bg-white text-foreground flex items-center justify-center shadow-lg transition-all"
        aria-label="Next ad"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Bottom caption */}
      <div className="absolute bottom-0 inset-x-0 z-10 px-6 pb-5 pt-10 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
        <p className="text-sm text-white max-w-3xl mx-auto text-center line-clamp-2">{row.headline}</p>
        <p className="text-[11px] text-white/60 mt-1 text-center">← → to navigate · Space to select · Esc to close</p>
      </div>
    </div>
  );
}
