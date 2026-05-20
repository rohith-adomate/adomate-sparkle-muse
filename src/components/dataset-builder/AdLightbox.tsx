import { useEffect, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X, ChevronLeft, ChevronRight, Info, Check, Play, Image as ImageIcon, Layers, PanelRightClose, ExternalLink,
} from "lucide-react";
import type { DatasetRow } from "./types";
import { daysOnline, formatDate } from "./mockData";
import { oyAdImages } from "@/data/oyImages";

interface Props {
  rows: DatasetRow[];
  index: number;
  selectedRows: Set<string>;
  onChangeIndex: (i: number) => void;
  onToggleSelect: (rowId: string) => void;
  onClose: () => void;
}

function FormatIcon({ format, className }: { format: string; className?: string }) {
  if (format === "Video") return <Play className={className} />;
  if (format === "Carousel") return <Layers className={className} />;
  return <ImageIcon className={className} />;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-[11px] text-muted-foreground shrink-0 pt-0.5">{label}</span>
      <div className="text-xs text-foreground text-right min-w-0 break-words">{children}</div>
    </div>
  );
}

export default function AdLightbox({
  rows, index, selectedRows, onChangeIndex, onToggleSelect, onClose,
}: Props) {
  const [infoOpen, setInfoOpen] = useState(false);
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
      else if (e.key === " ") {
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

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 text-xs text-white/80 tabular-nums bg-black/40 px-2.5 py-1 rounded-full backdrop-blur">
        {index + 1} / {total}
      </div>

      {/* Prev arrow */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        className="absolute left-4 z-20 h-11 w-11 rounded-full bg-white/90 hover:bg-white text-foreground flex items-center justify-center shadow-lg transition-all"
        aria-label="Previous ad"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Next arrow */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        className="absolute right-4 z-20 h-11 w-11 rounded-full bg-white/90 hover:bg-white text-foreground flex items-center justify-center shadow-lg transition-all"
        aria-label="Next ad"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Combined card: visual + optional info panel */}
      <div
        className={cn(
          "relative z-[5] flex rounded-2xl overflow-hidden shadow-2xl bg-card max-h-[88vh] transition-all",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Visual side */}
        <div className="relative bg-muted flex items-center justify-center shrink-0" style={{ width: "min(75vh, 560px)" }}>
          <img
            src={img}
            alt={row.headline}
            className="block w-full h-auto max-h-[88vh] object-contain"
          />

          {/* Selection circle on left of visual */}
          <button
            type="button"
            onClick={() => onToggleSelect(row.id)}
            className={cn(
              "absolute top-4 left-4 h-10 w-10 rounded-full flex items-center justify-center shadow-lg transition-all border-2",
              selected
                ? "bg-primary border-primary text-primary-foreground"
                : "bg-white/95 border-white hover:bg-white text-muted-foreground",
            )}
            aria-label={selected ? "Deselect ad" : "Select ad"}
            aria-pressed={selected}
          >
            {selected ? <Check className="h-5 w-5" strokeWidth={3} /> : <span className="h-4 w-4 rounded-full border-2 border-muted-foreground/40" />}
          </button>

          {/* Top-right action cluster on the visual */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setInfoOpen(v => !v)}
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center shadow-lg transition-all",
                infoOpen
                  ? "bg-foreground text-background"
                  : "bg-white/95 hover:bg-white text-foreground",
              )}
              aria-label="Toggle details"
              aria-pressed={infoOpen}
            >
              <Info className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 rounded-full bg-foreground/80 hover:bg-foreground text-background flex items-center justify-center shadow-lg transition-all"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Info panel */}
        {infoOpen && (
          <div className="w-[340px] border-l border-border bg-card flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <div>
                <p className="text-sm font-semibold">Details</p>
                <p className="text-[11px] text-muted-foreground">Ad information</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setInfoOpen(false)}
                aria-label="Close details"
              >
                <PanelRightClose className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Brand */}
              <div className="flex items-center gap-2.5">
                {row.brandAvatar && (
                  <img src={row.brandAvatar} alt={row.brand} className="h-10 w-10 rounded-md shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{row.brand}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      row.status === "Active" ? "bg-emerald-500" : "bg-muted-foreground/40",
                    )} />
                    <span>{row.status === "Active" ? `Seen ${formatDate(row.firstLaunched)}` : "Inactive"}</span>
                  </div>
                </div>
              </div>

              {/* Headline */}
              <div className="rounded-lg bg-muted/40 border border-border/60 px-3 py-2.5">
                <p className="text-xs leading-snug text-foreground">{row.headline}</p>
              </div>

              {/* Field list */}
              <div className="divide-y divide-border/60">
                <Field label="Format">
                  <span className="inline-flex items-center gap-1.5">
                    <FormatIcon format={row.format} className="h-3.5 w-3.5 text-muted-foreground" />
                    {row.format}
                  </span>
                </Field>
                <Field label="Platform">{row.platform}</Field>
                <Field label="First launched">{formatDate(row.firstLaunched)}</Field>
                <Field label="Days online">{days}d</Field>
                <Field label="Funnel stage">{row.funnelStage}</Field>
                <Field label="Hook">{row.hook}</Field>
                <Field label="Offer">{row.offerPresent ? "Yes" : "No"}</Field>
                <Field label="Brand alignment">
                  <Badge variant="outline" className="h-5 px-1.5 text-[10px]">{row.brandAlignment}</Badge>
                </Field>
                {row.landingPage && (
                  <Field label="Landing page">
                    <a
                      href={row.landingPage}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <span className="truncate max-w-[160px]">{row.landingPage}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </Field>
                )}
              </div>

              {/* AI enrichment */}
              {row.aiValues && Object.keys(row.aiValues).length > 0 && (
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1.5">AI enrichment</p>
                  <div className="divide-y divide-border/60 rounded-lg border border-border/60 bg-muted/20 px-3">
                    {Object.entries(row.aiValues).map(([key, value]) => (
                      <Field key={key} label={key}>{value}</Field>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-[11px] text-white/60 bg-black/30 px-3 py-1 rounded-full backdrop-blur">
        ← → navigate · Space to select · Esc to close
      </div>
    </div>
  );
}
