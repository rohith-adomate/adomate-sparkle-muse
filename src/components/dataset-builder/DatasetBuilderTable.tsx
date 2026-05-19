import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { Play, Download, Trash2, Sparkles, ArrowUp, Wand2 } from "lucide-react";

const AI_STYLED_COLS = new Set(["col-alignment"]);

const COLUMN_TOOLTIPS: Record<string, string> = {
  "col-brand": "The company or brand running this ad.",
  "col-headline": "The main text or title used in the ad creative.",
  "col-format": "The type of ad format, like image, video, or carousel.",
  "col-launched": "The date this ad was first seen running.",
  "col-days": "How many days this ad has been running — longer usually means it's working.",
  "col-status": "Whether this ad is currently live or has been paused.",
  "col-landing": "The webpage people land on after clicking this ad.",
  "col-alignment": "How closely this ad matches the brand's overall style and messaging.",
};
import type { DatasetColumn, DatasetRow, ActiveFilter } from "./types";
import { daysOnline, formatDate } from "./mockData";



interface Props {
  columns: DatasetColumn[];
  rows: DatasetRow[];
  selectedRows: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  onColumnClick: (col: DatasetColumn) => void;
  onRunRows: (rowIds: string[]) => void;
  onRowClick: (row: DatasetRow) => void;
  activeColumnId?: string;
  onReorderColumns?: (columns: DatasetColumn[]) => void;
  activeFilters: ActiveFilter[];
  onApplyFilter: (filter: ActiveFilter) => void;
  totalRowCount?: number;
  launchedSortAsc?: boolean;
  onToggleLaunchedSort?: () => void;
  adGenOn?: boolean;
  onAdGenToggle?: (on: boolean) => void;
}

export default function DatasetBuilderTable({
  columns, rows, selectedRows, onToggleRow, onToggleAll, onColumnClick, onRunRows, onRowClick, activeColumnId, onReorderColumns, activeFilters, onApplyFilter, totalRowCount, launchedSortAsc = true, onToggleLaunchedSort, adGenOn, onAdGenToggle,
}: Props) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [dragColId, setDragColId] = useState<string | null>(null);
  const [dragOverColId, setDragOverColId] = useState<string | null>(null);
  const [hoveredColId, setHoveredColId] = useState<string | null>(null);

  const factsColumns = columns.filter(c => c.type === "facts");
  const aiColumns = columns.filter(c => c.type === "ai");
  const allColumns = [...factsColumns, ...aiColumns];


  const allSelected = rows.length > 0 && selectedRows.size === rows.length;

  const getCellValue = (row: DatasetRow, col: DatasetColumn): string => {
    switch (col.id) {
      case "col-brand": return row.brand;
      case "col-headline": return row.headline;
      case "col-format": return row.format;
      case "col-platform": return row.platform;
      case "col-launched": return formatDate(row.firstLaunched);
      case "col-days": return String(daysOnline(row.firstLaunched));
      case "col-status": return row.status;
      case "col-landing": return row.landingPage || "—";
      
    }
    const templateId = col.templateId || col.id;
    return row.aiValues[templateId] || "—";
  };

  const handleDragStart = useCallback((colId: string) => {
    setDragColId(colId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, colId: string) => {
    e.preventDefault();
    setDragOverColId(colId);
  }, []);

  const handleDrop = useCallback((targetColId: string) => {
    if (!dragColId || dragColId === targetColId || !onReorderColumns) {
      setDragColId(null);
      setDragOverColId(null);
      return;
    }
    const dragCol = allColumns.find(c => c.id === dragColId);
    const targetCol = allColumns.find(c => c.id === targetColId);
    if (!dragCol || !targetCol) return;
    if (dragCol.type !== targetCol.type) {
      setDragColId(null);
      setDragOverColId(null);
      return;
    }
    const group = dragCol.type === "facts" ? [...factsColumns] : [...aiColumns];
    const otherGroup = dragCol.type === "facts" ? aiColumns : factsColumns;
    const fromIdx = group.findIndex(c => c.id === dragColId);
    const toIdx = group.findIndex(c => c.id === targetColId);
    const [moved] = group.splice(fromIdx, 1);
    group.splice(toIdx, 0, moved);
    onReorderColumns(dragCol.type === "facts" ? [...group, ...otherGroup] : [...otherGroup, ...group]);
    setDragColId(null);
    setDragOverColId(null);
  }, [dragColId, allColumns, factsColumns, aiColumns, onReorderColumns]);

  const selectionCount = selectedRows.size;

  const handleClearSelection = useCallback(() => {
    rows.forEach(r => { if (selectedRows.has(r.id)) onToggleRow(r.id); });
  }, [rows, selectedRows, onToggleRow]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 py-1.5 text-[10px] text-muted-foreground border-b border-border/50 shrink-0 flex items-center justify-between">
        <span>Showing {rows.length} / {totalRowCount ?? rows.length} rows</span>
        {selectionCount > 0 && <span className="text-primary font-medium">{selectionCount} selected</span>}
      </div>

      {selectionCount > 0 && (
        <div className="mx-4 my-2 flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-primary">
              {selectionCount} row{selectionCount === 1 ? "" : "s"} selected
            </span>
            <span className="text-muted-foreground/40">·</span>
            <button
              type="button"
              onClick={handleClearSelection}
              className="text-[11px] text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
            >
              Clear
            </button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-[11px] gap-1.5 text-foreground hover:bg-primary/10"
              onClick={() => onRunRows([...selectedRows])}
            >
              <Wand2 className="h-3 w-3" /> Run AI analysis
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-muted/50 border-b border-border">
              <th className="w-8 px-2 py-2.5">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onToggleAll}
                  aria-label="Select all rows"
                />
              </th>
              <th className="w-8 px-2 py-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">#</th>
              {allColumns.map(col => {
                const isAiStyled = col.type === "ai" || AI_STYLED_COLS.has(col.id);
                return (
                  <th key={col.id}
                    className={cn("px-2.5 py-2.5 text-left transition-colors", isAiStyled && "bg-pink-50/60 cursor-pointer hover:bg-primary/5", activeColumnId === col.id && "bg-primary/10")}
                    onClick={() => isAiStyled ? onColumnClick(col) : undefined}>
                    <div className="flex items-center gap-1.5">
                      <Tooltip delayDuration={isAiStyled ? 1000 : 200}>
                        <TooltipTrigger asChild>
                          <span className={cn("text-[10px] font-bold uppercase tracking-wider truncate", isAiStyled ? "text-primary" : "text-muted-foreground")}>{col.name}</span>
                        </TooltipTrigger>
                        <TooltipContent className="text-xs max-w-[220px]">{COLUMN_TOOLTIPS[col.id] || col.description || (isAiStyled ? "AI-generated column" : col.name)}</TooltipContent>
                      </Tooltip>
                      {isAiStyled && (
                        <Sparkles className="h-3 w-3 shrink-0 text-pink-300/60 hover:text-primary transition-colors" />
                      )}
                      {col.id === "col-launched" && (
                        <ArrowUp className={cn("h-3 w-3 shrink-0 text-muted-foreground/60 hover:text-foreground cursor-pointer transition-transform", !launchedSortAsc && "rotate-180")} onClick={(e) => { e.stopPropagation(); onToggleLaunchedSort?.(); }} />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const isSelected = selectedRows.has(row.id);
              const isHovered = hoveredRow === row.id;
              return (
                <tr key={row.id} className={cn("border-b border-border/50 transition-colors cursor-pointer", isSelected ? "bg-primary/5" : "hover:bg-muted/30", row.isRunning && "animate-pulse bg-pink-50/30")}
                  onMouseEnter={() => setHoveredRow(row.id)} onMouseLeave={() => setHoveredRow(null)} onClick={() => onRowClick(row)}>
                  <td className="px-2 py-1.5" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleRow(row.id)}
                      aria-label={`Select row ${idx + 1}`}
                    />
                  </td>
                  <td className="px-2 py-1.5 text-[10px] text-muted-foreground font-mono">{idx + 1}</td>
                  {allColumns.map(col => {
                    const val = getCellValue(row, col);
                    const isAiEmpty = col.type === "ai" && val === "—";
                    return (
                      <td key={col.id} className={cn("px-2.5 py-1.5", (col.type === "ai" || AI_STYLED_COLS.has(col.id)) && "bg-pink-50/20", activeColumnId === col.id && "bg-primary/5")}>
                        {col.id === "col-brand" ? (
                          <div className="flex items-center gap-1.5">
                            <img src={row.brandAvatar || "/placeholder.svg"} alt={row.brand} className="h-4 w-4 rounded-full object-cover bg-muted shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(row.brand)}&size=16&background=random`; }} />
                            <span className="text-[11px] font-medium truncate">{val}</span>
                          </div>
                        ) : col.id === "col-status" ? (
                          <div className="flex justify-center"><div className={cn("h-2 w-2 rounded-full", val === "Active" ? "bg-primary" : "bg-muted-foreground/20")} /></div>
                        ) : col.id === "col-landing" ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a href={val !== "—" ? val : undefined} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={cn("text-[11px] truncate block max-w-[140px]", val !== "—" ? "text-primary underline underline-offset-2 hover:text-primary/80" : "text-muted-foreground/40")}>{val !== "—" ? val.replace(/^https?:\/\/(www\.)?/, "") : "—"}</a>
                            </TooltipTrigger>
                            {val !== "—" && <TooltipContent className="text-xs max-w-[400px] break-all">{val}</TooltipContent>}
                          </Tooltip>
                        ) : col.id === "col-alignment" ? (
                          <Badge variant="outline" className={cn("text-[9px] py-0 px-1.5 font-medium", val === "High" && "border-green-500/30 text-green-600 bg-green-500/10", val === "Med" && "border-yellow-500/30 text-yellow-600 bg-yellow-500/10", val === "Low" && "border-red-500/30 text-red-600 bg-red-500/10")}>{val}</Badge>
                        ) : isAiEmpty ? (
                          <span className="text-muted-foreground/40">—</span>
                        ) : (
                          <span className={cn("text-[11px] line-clamp-1", col.id === "col-days" && "tabular-nums text-muted-foreground text-center block", col.id === "col-headline" && "text-muted-foreground")}>{val}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
