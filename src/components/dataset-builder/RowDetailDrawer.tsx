import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Play, Image, Video, LayoutGrid } from "lucide-react";
import type { DatasetColumn, DatasetRow } from "./types";
import { daysOnline, formatDate } from "./mockData";

interface Props {
  row: DatasetRow | null;
  columns: DatasetColumn[];
  onClose: () => void;
  onRunRow: (rowId: string) => void;
}

const formatIcon: Record<string, typeof Image> = { Image, Video, Carousel: LayoutGrid };

export default function RowDetailDrawer({ row, columns, onClose, onRunRow }: Props) {
  if (!row) return null;
  const FormatIcon = formatIcon[row.format] || Image;

  const getCellValue = (col: DatasetColumn): string => {
    switch (col.id) {
      case "col-brand": return row.brand;
      case "col-headline": return row.headline;
      case "col-format": return row.format;
      case "col-platform": return row.platform;
      case "col-launched": return formatDate(row.firstLaunched);
      case "col-days": return String(daysOnline(row.firstLaunched));
      case "col-status": return row.status;
      case "col-funnel": return row.funnelStage;
      case "col-hook": return row.hook;
      case "col-offer": return row.offerPresent ? "Yes" : "No";
      case "col-alignment": return row.brandAlignment;
    }
    return row.aiValues[col.templateId || col.id] || "—";
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-[420px] bg-card border-l border-border flex flex-col animate-slide-in-right shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
          <h2 className="text-sm font-bold">Row Detail</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={() => onRunRow(row.id)} disabled={row.isRunning}><Play className="h-3 w-3" /> Run Row</Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}><X className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto flex items-center justify-center p-5">
          <div className="w-full rounded-xl border border-border bg-muted/30 overflow-hidden" style={{ aspectRatio: "4/5" }}>
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <FormatIcon className="h-10 w-10" />
              <div className="text-center">
                <p className="text-xs font-medium">{row.format} Ad</p>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">Preview not available in prototype</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
