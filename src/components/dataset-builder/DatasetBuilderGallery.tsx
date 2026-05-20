import { useState } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Play, Image as ImageIcon, Layers, ArrowUpDown } from "lucide-react";
import type { DatasetRow } from "./types";
import { daysOnline, formatDate } from "./mockData";
import { oyAdImages } from "@/data/oyImages";
import AdLightbox from "./AdLightbox";

interface Props {
  rows: DatasetRow[];
  selectedRows: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  onRowClick: (row: DatasetRow) => void;
  totalRowCount?: number;
  adGenOn?: boolean;
  onAdGenToggle?: (on: boolean) => void;
  launchedSortAsc?: boolean;
  onToggleLaunchedSort?: () => void;
}

function FormatIcon({ format }: { format: string }) {
  if (format === "Video") return <Play className="h-3 w-3" />;
  if (format === "Carousel") return <Layers className="h-3 w-3" />;
  return <ImageIcon className="h-3 w-3" />;
}

export default function DatasetBuilderGallery({
  rows, selectedRows, onToggleRow, onToggleAll, onRowClick, totalRowCount, adGenOn, onAdGenToggle,
  launchedSortAsc, onToggleLaunchedSort,
}: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const sortValue = launchedSortAsc ? "longest" : "recent";


  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-muted/20">
      {/* Sort toolbar */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-border/60 bg-card/40 shrink-0">
        <div className="text-xs text-muted-foreground">
          {rows.length} {rows.length === 1 ? "ad" : "ads"}
          {totalRowCount !== undefined && totalRowCount !== rows.length && (
            <span> of {totalRowCount}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          <Select
            value={sortValue}
            onValueChange={(v) => {
              if ((v === "longest") !== !!launchedSortAsc) onToggleLaunchedSort?.();
            }}
          >
            <SelectTrigger className="h-7 w-[180px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent" className="text-xs">Most recent</SelectItem>
              <SelectItem value="longest" className="text-xs">Longest running</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Gallery grid */}
      <div className="flex-1 overflow-auto p-5">
        {rows.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No ads match your current filters.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">

            {rows.map((row, idx) => {
              const selected = selectedRows.has(row.id);
              const img = oyAdImages[(parseInt(row.id, 10) || idx) % oyAdImages.length];
              const days = daysOnline(row.firstLaunched);
              return (
                <div
                  key={row.id}
                  onClick={() => setLightboxIndex(idx)}
                  className={cn(
                    "group relative rounded-lg overflow-hidden border bg-card cursor-pointer transition-all flex flex-col",
                    selected
                      ? "border-primary ring-2 ring-primary/30 shadow-md"
                      : "border-border/60 hover:border-border hover:shadow-md",
                  )}
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    <img
                      src={img}
                      alt={row.headline}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform group-hover:scale-[1.02]"
                    />

                    {/* Top-left: selection (click toggles without opening lightbox) */}
                    <div
                      className="absolute top-2 left-2 flex items-center gap-1.5"
                      onClick={(e) => { e.stopPropagation(); onToggleRow(row.id); }}
                    >
                      <div
                        className={cn(
                          "h-6 w-6 rounded-md flex items-center justify-center transition-all",
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-background/85 backdrop-blur border border-border opacity-0 group-hover:opacity-100",
                        )}
                      >
                        <Checkbox
                          checked={selected}
                          className={cn(
                            "h-3.5 w-3.5 border-0 data-[state=checked]:bg-transparent data-[state=checked]:text-primary-foreground",
                            !selected && "bg-transparent",
                          )}
                        />
                      </div>
                    </div>


                    {/* Top-right: format icon + info */}
                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onRowClick(row); }}
                        className="h-6 w-6 rounded-md bg-background/85 backdrop-blur flex items-center justify-center text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="View details"
                      >
                        <Info className="h-3.5 w-3.5" />
                      </button>
                      <div
                        className="h-6 w-6 rounded-md bg-background/85 backdrop-blur flex items-center justify-center text-foreground"
                        aria-label={row.format}
                      >
                        <FormatIcon format={row.format} />
                      </div>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="p-2.5 space-y-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {row.brandAvatar && (
                        <img
                          src={row.brandAvatar}
                          alt={row.brand}
                          className="h-4 w-4 rounded shrink-0"
                          loading="lazy"
                        />
                      )}
                      <span className="text-[11px] font-medium text-foreground/80 truncate">{row.brand}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-auto inline-flex items-center gap-1">
                        {row.status === "Active" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-label="Active" />
                        )}
                        {days}d
                      </span>
                    </div>
                    <p className="text-[12px] leading-snug line-clamp-2 text-foreground">{row.headline}</p>
                    <p className="text-[10px] text-muted-foreground">First launched {formatDate(row.firstLaunched)}</p>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
