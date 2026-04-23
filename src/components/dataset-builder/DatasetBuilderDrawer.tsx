import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, Download, Loader2, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { DatasetColumn, DatasetFilter, DatasetSource, DatasetRow, ActiveFilter } from "./types";
import { INITIAL_SOURCES, FACTS_COLUMNS, DEFAULT_AI_COLUMN, INITIAL_ROWS, MOCK_AI_VALUES, daysOnline } from "./mockData";
import DatasetBuilderLeftPanel, { DATA_ROOM_COMPETITORS } from "./DatasetBuilderLeftPanel";
import DatasetBuilderTable from "./DatasetBuilderTable";
import ColumnInspectorPanel from "./ColumnInspectorPanel";
import AddColumnModal from "./AddColumnModal";
import RowDetailDrawer from "./RowDetailDrawer";
import DrawerContinueFooter from "../DrawerContinueFooter";

interface Props {
  open: boolean;
  onClose: () => void;
  initialEmpty?: boolean;
  onSourcesChange?: (count: number) => void;
  onContinue?: () => void;
  continueLabel?: string;
}

export default function DatasetBuilderDrawer({ open, onClose, initialEmpty, onSourcesChange, onContinue, continueLabel }: Props) {
  const [sources, setSources] = useState<DatasetSource[]>(initialEmpty ? [] : INITIAL_SOURCES);
  const [columns, setColumns] = useState<DatasetColumn[]>([...FACTS_COLUMNS, DEFAULT_AI_COLUMN]);
  const [filters, setFilters] = useState<DatasetFilter[]>([]);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [rows, setRows] = useState<DatasetRow[]>(INITIAL_ROWS);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [inspectorColumn, setInspectorColumn] = useState<DatasetColumn | null>(null);
  const [addColumnOpen, setAddColumnOpen] = useState(false);
  const [detailRow, setDetailRow] = useState<DatasetRow | null>(null);
  const [launchedSortAsc, setLaunchedSortAsc] = useState(true);

  useEffect(() => {
    onSourcesChange?.(sources.length);
  }, [sources, onSourcesChange]);


  const handleAddSource = useCallback((src: DatasetSource) => {
    setSources(prev => [...prev, src]);
    toast.success(`Source "${src.label}" added`);
  }, []);

  const handleRemoveSource = useCallback((id: string) => {
    setSources(prev => prev.filter(s => s.id !== id));
  }, []);

  const handleAddFilter = useCallback((f: DatasetFilter) => {
    setFilters(prev => [...prev, f]);
  }, []);

  const handleRemoveFilter = useCallback((id: string) => {
    setFilters(prev => prev.filter(f => f.id !== id));
  }, []);

  const handleAddColumn = useCallback((col: DatasetColumn) => {
    setColumns(prev => [...prev, col]);
    toast.success(`Column "${col.name}" added`);
  }, []);

  const handleDeleteColumn = useCallback((id: string) => {
    setColumns(prev => prev.filter(c => c.id !== id));
    setInspectorColumn(null);
    toast.success("Column deleted");
  }, []);

  const handleUpdateColumn = useCallback((col: DatasetColumn) => {
    setColumns(prev => prev.map(c => c.id === col.id ? col : c));
    setInspectorColumn(col);
  }, []);

  const handleToggleRow = useCallback((id: string) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    setSelectedRows(prev => {
      if (prev.size === rows.length) return new Set();
      return new Set(rows.map(r => r.id));
    });
  }, [rows]);

  const handleRunRows = useCallback((rowIds: string[]) => {
    setRows(prev => prev.map(r => rowIds.includes(r.id) ? { ...r, isRunning: true } : r));

    setTimeout(() => {
      setRows(prev => prev.map(r => {
        if (!rowIds.includes(r.id)) return r;
        const aiCols = columns.filter(c => c.type === "ai");
        const newAiValues = { ...r.aiValues };
        aiCols.forEach(col => {
          const tplId = col.templateId || col.id;
          if (MOCK_AI_VALUES[tplId]?.[r.id]) {
            newAiValues[tplId] = MOCK_AI_VALUES[tplId][r.id];
          } else {
            newAiValues[tplId] = col.columnKind === "scoring" ? `${Math.floor(Math.random() * 5 + 5)}/10` : "Positive";
          }
        });
        return { ...r, isRunning: false, aiValues: newAiValues };
      }));
      toast.success(`Processed ${rowIds.length} row${rowIds.length !== 1 ? "s" : ""}`);
      setSelectedRows(new Set());
    }, 1500);
  }, [columns]);

  const handleRunAll = useCallback(() => {
    if (selectedRows.size > 0) {
      handleRunRows([...selectedRows]);
    } else {
      handleRunRows(rows.map(r => r.id));
    }
  }, [selectedRows, rows, handleRunRows]);

  const handleApplyFilter = useCallback((filter: ActiveFilter) => {
    setActiveFilters(prev => {
      const existing = prev.findIndex(f => f.columnId === filter.columnId);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = filter;
        return next;
      }
      return [...prev, filter];
    });
  }, []);

  const handleRemoveActiveFilter = useCallback((columnId: string) => {
    setActiveFilters(prev => prev.filter(f => f.columnId !== columnId));
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setActiveFilters([]);
  }, []);

  if (!open) return null;

  // Apply active filters to rows
  const filteredRows = rows.filter(row => {
    return activeFilters.every(filter => {
      if (filter.mode === "number-range") {
        const days = daysOnline(row.firstLaunched);
        if (filter.min !== undefined && days < filter.min) return false;
        if (filter.max !== undefined && days > filter.max) return false;
        return true;
      }
      if (filter.mode === "date-range") {
        const date = row.firstLaunched;
        if (filter.dateFrom && date < filter.dateFrom) return false;
        if (filter.dateTo && date > filter.dateTo) return false;
        return true;
      }
      if (filter.mode === "text") {
        let val = "";
        if (filter.columnId === "col-headline") val = row.headline;
        else val = row.aiValues[filter.columnId] || "";
        const v = val.toLowerCase();
        const t = (filter.textValue || "").toLowerCase();
        switch (filter.textOperator) {
          case "contains": return v.includes(t);
          case "not-contains": return !v.includes(t);
          case "starts-with": return v.startsWith(t);
          case "ends-with": return v.endsWith(t);
          default: return true;
        }
      }
      // select mode
      let val = "";
      switch (filter.columnId) {
        case "col-brand": val = row.brand; break;
        case "col-format": val = row.format; break;
        case "col-platform": val = row.platform; break;
        case "col-status": val = row.status === "Active" ? "True" : "False"; break;
        case "col-funnel": val = row.funnelStage; break;
        case "col-offer": val = row.offerPresent ? "Yes" : "No"; break;
        
        default: val = row.aiValues[filter.columnId] || ""; break;
      }
    return filter.values.includes(val);
    });
  }).sort((a, b) => {
    const diff = new Date(a.firstLaunched).getTime() - new Date(b.firstLaunched).getTime();
    return launchedSortAsc ? diff : -diff;
  });

  const hasSelectedRows = selectedRows.size > 0;
  const aiColumnsCount = columns.filter(c => c.type === "ai").length;
  const rowCount = hasSelectedRows ? selectedRows.size : filteredRows.length;
  const estimatedCredits = rowCount * aiColumnsCount;

  return (
    <TooltipProvider>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 flex">
        <div className="w-[5%] bg-black/20" onClick={onClose} />
        <div className="w-[95%] bg-card flex flex-col animate-slide-in-right shadow-2xl border-l border-border">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card shrink-0">
            <div className="flex items-center gap-3">
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs">Back to canvas</TooltipContent>
              </Tooltip>
              <h1 className="text-sm font-bold">Competitor Dataset — Skincare Q1</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={() => {
                const toastId = toast("Exporting to CSV…", {
                  icon: <Loader2 className="h-4 w-4 animate-spin" />,
                  duration: Infinity,
                });
                setTimeout(() => {
                  toast.success("Exported to CSV", {
                    id: toastId,
                    icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
                    duration: 2000,
                  });
                }, 4000);
              }}>
                <Download className="h-3.5 w-3.5" /> Export CSV
              </Button>
            </div>
          </div>

          {/* No-brands-tracked empty state */}
          {sources.length === 0 && (
            <div className="border-b border-border bg-muted/40 px-5 py-3 flex items-start gap-3 shrink-0">
              <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">No brands tracked yet</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                  This dataset pulls from competitor brands you track in your Data Room.
                  Add at least one brand to start collecting ads, then come back here to configure your dataset.
                </p>
              </div>
              <Button asChild size="sm" variant="outline" className="h-7 text-[11px] gap-1.5 shrink-0">
                <Link to="/brand-data-room/competitors" onClick={onClose}>
                  Set up competitors
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          )}

          {/* Main content */}
          <div className="flex flex-1 overflow-hidden">
            <DatasetBuilderLeftPanel
              sources={sources}
              onAddSource={handleAddSource}
              onRemoveSource={handleRemoveSource}
              activeFilters={activeFilters}
              onRemoveFilter={handleRemoveActiveFilter}
              onClearAllFilters={handleClearAllFilters}
              columns={columns}
              rows={rows}
              onApplyFilter={handleApplyFilter}
            />

            <DatasetBuilderTable
              columns={columns}
              rows={filteredRows}
              selectedRows={selectedRows}
              onToggleRow={handleToggleRow}
              onToggleAll={handleToggleAll}
              onColumnClick={setInspectorColumn}
              onRunRows={handleRunRows}
              onRowClick={setDetailRow}
              activeColumnId={inspectorColumn?.id}
              onReorderColumns={setColumns}
              activeFilters={activeFilters}
              onApplyFilter={handleApplyFilter}
              totalRowCount={rows.length}
              launchedSortAsc={launchedSortAsc}
              onToggleLaunchedSort={() => setLaunchedSortAsc(prev => !prev)}
            />

            {inspectorColumn && (
              <ColumnInspectorPanel
                column={inspectorColumn}
                rows={rows}
                onClose={() => setInspectorColumn(null)}
                onUpdateColumn={handleUpdateColumn}
                onDeleteColumn={handleDeleteColumn}
              />
            )}
          </div>

          <DrawerContinueFooter onContinue={onContinue} label={continueLabel} disabled={sources.length === 0} />
        </div>
      </div>

      <AddColumnModal
        open={addColumnOpen}
        onOpenChange={setAddColumnOpen}
        onAddColumn={handleAddColumn}
        existingColumns={columns}
      />

      <RowDetailDrawer
        row={detailRow}
        onClose={() => setDetailRow(null)}
        onRunRow={(id) => handleRunRows([id])}
      />
    </TooltipProvider>
  );
}
