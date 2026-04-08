import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Play, Download, Trash2, Sparkles, GripVertical, ArrowUpDown } from "lucide-react";
import type { DatasetColumn, DatasetRow, ActiveFilter } from "./types";
import { daysOnline, formatDate } from "./mockData";
import TableFilterPopover from "./TableFilterPopover";

type SortOption = "none" | "most-recent" | "most-days" | "alignment-high" | "alignment-low";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "most-recent", label: "Most Recent" },
  { value: "most-days", label: "Most Days Online" },
  { value: "alignment-high", label: "Alignment: High → Low" },
  { value: "alignment-low", label: "Alignment: Low → High" },
];

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
}

export default function DatasetBuilderTable({
  columns, rows, selectedRows, onToggleRow, onToggleAll, onColumnClick, onRunRows, onRowClick, activeColumnId, onReorderColumns, activeFilters, onApplyFilter,
}: Props) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [dragColId, setDragColId] = useState<string | null>(null);
  const [dragOverColId, setDragOverColId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("none");

  const factsColumns = columns.filter(c => c.type === "facts");
  const aiColumns = columns.filter(c => c.type === "ai");
  const allColumns = [...factsColumns, ...aiColumns];

  const alignmentOrder: Record<string, number> = { "High": 3, "Med": 2, "Low": 1 };

  const sortedRows = useMemo(() => {
    if (sortBy === "none") return rows;
    return [...rows].sort((a, b) => {
      switch (sortBy) {
        case "most-recent":
          return new Date(b.firstLaunched).getTime() - new Date(a.firstLaunched).getTime();
        case "most-days":
          return daysOnline(a.firstLaunched) > daysOnline(b.firstLaunched) ? -1 : 1;
        case "alignment-high":
          return (alignmentOrder[b.brandAlignment] || 0) - (alignmentOrder[a.brandAlignment] || 0);
        case "alignment-low":
          return (alignmentOrder[a.brandAlignment] || 0) - (alignmentOrder[b.brandAlignment] || 0);
        default:
          return 0;
      }
    });
  }, [rows, sortBy]);

  const allSelected = sortedRows.length > 0 && selectedRows.size === sortedRows.length;

  const getCellValue = (row: DatasetRow, col: DatasetColumn): string => {
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

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border text-xs">
        <TableFilterPopover columns={columns} rows={rows} activeFilters={activeFilters} onApplyFilter={onApplyFilter} />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn("h-7 text-[11px] gap-1.5 px-2.5", sortBy !== "none" && "border-primary/50 text-primary")}>
              <ArrowUpDown className="h-3 w-3" />
              {sortBy === "none" ? "Sort" : SORT_OPTIONS.find(o => o.value === sortBy)?.label}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-1" align="start">
            {SORT_OPTIONS.map(opt => (
              <button key={opt.value} className={cn("w-full text-left px-3 py-1.5 text-xs rounded hover:bg-muted/50 transition-colors", sortBy === opt.value && "bg-primary/10 text-primary font-medium")} onClick={() => setSortBy(opt.value)}>{opt.label}</button>
            ))}
            {sortBy !== "none" && (
              <>
                <div className="h-px bg-border my-1" />
                <button className="w-full text-left px-3 py-1.5 text-xs rounded hover:bg-muted/50 text-muted-foreground transition-colors" onClick={() => setSortBy("none")}>Reset sorting</button>
              </>
            )}
          </PopoverContent>
        </Popover>
        {selectedRows.size > 0 && (
          <>
            <div className="h-4 w-px bg-border" />
            <span className="font-medium">{selectedRows.size} row{selectedRows.size !== 1 ? "s" : ""} selected</span>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px] gap-1" onClick={() => {}}><Download className="h-3 w-3" /> Export</Button>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px] gap-1 text-destructive hover:text-destructive" onClick={() => {}}><Trash2 className="h-3 w-3" /> Remove</Button>
            <Button variant="default" size="sm" className="h-6 px-2 text-[11px] gap-1 bg-primary hover:bg-primary/90" onClick={() => onRunRows([...selectedRows])}><Play className="h-3 w-3" /> Run selected</Button>
          </>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-muted/50 border-b border-border">
              <th className="w-14 px-2 py-2.5 text-left"><Checkbox checked={allSelected} onCheckedChange={onToggleAll} className="h-3.5 w-3.5" /></th>
              <th className="w-8 px-1 py-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">#</th>
              {allColumns.map(col => (
                <th key={col.id} draggable onDragStart={() => handleDragStart(col.id)} onDragOver={(e) => handleDragOver(e, col.id)} onDrop={() => handleDrop(col.id)} onDragEnd={() => { setDragColId(null); setDragOverColId(null); }}
                  className={cn("px-2.5 py-2.5 text-left cursor-pointer transition-colors group", col.type === "ai" && "bg-pink-50/60", activeColumnId === col.id && "bg-primary/10", dragOverColId === col.id && dragColId !== col.id && "bg-primary/20", "hover:bg-primary/5")}
                  onClick={() => onColumnClick(col)}>
                  <div className="flex items-center gap-1.5">
                    <GripVertical className="h-3 w-3 text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-colors shrink-0 cursor-grab" />
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider truncate", col.type === "ai" ? "text-primary" : "text-muted-foreground")}>{col.name}</span>
                      </TooltipTrigger>
                      <TooltipContent className="text-xs">{col.type === "ai" ? "AI-generated column" : "Facts column"}</TooltipContent>
                    </Tooltip>
                    {col.type === "ai" && <Sparkles className="h-3 w-3 text-primary shrink-0" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, idx) => {
              const isSelected = selectedRows.has(row.id);
              const isHovered = hoveredRow === row.id;
              return (
                <tr key={row.id} className={cn("border-b border-border/50 transition-colors cursor-pointer", isSelected ? "bg-primary/5" : "hover:bg-muted/30", row.isRunning && "animate-pulse bg-pink-50/30")}
                  onMouseEnter={() => setHoveredRow(row.id)} onMouseLeave={() => setHoveredRow(null)} onClick={() => onRowClick(row)}>
                  <td className="px-2 py-1.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <Checkbox checked={isSelected} onCheckedChange={() => onToggleRow(row.id)} className="h-3.5 w-3.5" />
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <button className={cn("h-5 w-5 rounded flex items-center justify-center hover:bg-primary/10 transition-colors", (!isHovered || row.isRunning) && "opacity-0 pointer-events-none")} onClick={(e) => { e.stopPropagation(); onRunRows([row.id]); }}>
                            <Play className="h-3 w-3 text-primary" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="text-xs">Run this row</TooltipContent>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="px-1 py-1.5 text-[10px] text-muted-foreground font-mono">{idx + 1}</td>
                  {allColumns.map(col => {
                    const val = getCellValue(row, col);
                    const isAiEmpty = col.type === "ai" && val === "—";
                    return (
                      <td key={col.id} className={cn("px-2.5 py-1.5", col.type === "ai" && "bg-pink-50/20", activeColumnId === col.id && "bg-primary/5")}>
                        {col.id === "col-brand" ? (
                          <div className="flex items-center gap-1.5">
                            <img src={row.brandAvatar || "/placeholder.svg"} alt={row.brand} className="h-4 w-4 rounded-full object-cover bg-muted shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(row.brand)}&size=16&background=random`; }} />
                            <span className="text-[11px] font-medium truncate">{val}</span>
                          </div>
                        ) : col.id === "col-status" ? (
                          <div className="flex items-center gap-1">
                            <div className={cn("h-1.5 w-1.5 rounded-full", val === "Active" ? "bg-green-500" : "bg-muted-foreground/40")} />
                            <span className="text-[10px]">{val}</span>
                          </div>
                        ) : col.id === "col-alignment" ? (
                          <Badge variant="outline" className={cn("text-[9px] py-0 px-1.5 font-medium", val === "High" && "border-green-500/30 text-green-600 bg-green-500/10", val === "Med" && "border-yellow-500/30 text-yellow-600 bg-yellow-500/10", val === "Low" && "border-red-500/30 text-red-600 bg-red-500/10")}>{val}</Badge>
                        ) : col.id === "col-funnel" ? (
                          <Badge variant="outline" className="text-[9px] py-0 px-1.5 font-normal">{val}</Badge>
                        ) : col.id === "col-offer" ? (
                          <div className={cn("h-2 w-2 rounded-full mx-auto", val === "Yes" ? "bg-primary" : "bg-muted-foreground/20")} />
                        ) : isAiEmpty ? (
                          <span className="text-muted-foreground/40">—</span>
                        ) : (
                          <span className={cn("text-[11px] line-clamp-1", col.id === "col-days" && "tabular-nums text-muted-foreground text-right block", (col.id === "col-hook" || col.id === "col-headline") && "text-muted-foreground")}>{val}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-4 py-2 text-[10px] text-muted-foreground border-t border-border/50">
          {sortedRows.length} rows · {allColumns.length} columns · {columns.filter(c => c.type === "ai").length > 0 && `${columns.filter(c => c.type === "ai").length} AI columns`}
        </div>
      </div>
    </div>
  );
}
