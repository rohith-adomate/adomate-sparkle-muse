import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Play, Image as ImageIcon, Layers, Wand2 } from "lucide-react";
import type { DatasetRow } from "./types";
import { daysOnline, formatDate } from "./mockData";
import { oyAdImages } from "@/data/oyImages";

interface Props {
  rows: DatasetRow[];
  selectedRows: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  onRowClick: (row: DatasetRow) => void;
  totalRowCount?: number;
  adGenOn?: boolean;
  onAdGenToggle?: (on: boolean) => void;
}

function FormatIcon({ format }: { format: string }) {
  if (format === "Video") return <Play className="h-3 w-3" />;
  if (format === "Carousel") return <Layers className="h-3 w-3" />;
  return <ImageIcon className="h-3 w-3" />;
}

export default function DatasetBuilderGallery({
  rows, selectedRows, onToggleRow, onToggleAll, onRowClick, totalRowCount, adGenOn, onAdGenToggle,
}: Props) {
  const allSelected = rows.length > 0 && rows.every(r => selectedRows.has(r.id));
  const someSelected = selectedRows.size > 0 && !allSelected;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-muted/20">

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
                  onClick={() => onToggleRow(row.id)}
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

                    {/* Top-left: format + platform */}
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <Badge className="h-5 px-1.5 text-[10px] gap-1 bg-background/85 text-foreground hover:bg-background/85 backdrop-blur border-0">
                        <FormatIcon format={row.format} />
                        {row.format}
                      </Badge>
                    </div>

                    {/* Top-right: select + info */}
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

                    {/* Bottom-left: status */}
                    <div className="absolute bottom-2 left-2">
                      <span className={cn(
                        "inline-flex items-center gap-1 h-5 px-1.5 rounded text-[10px] font-medium backdrop-blur",
                        row.status === "Active"
                          ? "bg-emerald-500/90 text-white"
                          : "bg-background/85 text-muted-foreground",
                      )}>
                        <span className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          row.status === "Active" ? "bg-white" : "bg-muted-foreground",
                        )} />
                        {row.status}
                      </span>
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
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-auto">{days}d</span>
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
