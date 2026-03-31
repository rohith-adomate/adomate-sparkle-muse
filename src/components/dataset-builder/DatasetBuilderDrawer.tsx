import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, X, Plus, Save, Play, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { DatasetColumn, DatasetFilter, DatasetSource, DatasetRow } from "./types";
import { INITIAL_SOURCES, FACTS_COLUMNS, INITIAL_ROWS, MOCK_AI_VALUES } from "./mockData";
import DatasetBuilderLeftPanel from "./DatasetBuilderLeftPanel";
import DatasetBuilderTable from "./DatasetBuilderTable";
import ColumnInspectorPanel from "./ColumnInspectorPanel";
import AddColumnModal from "./AddColumnModal";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function DatasetBuilderDrawer({ open, onClose }: Props) {
  const [sources, setSources] = useState<DatasetSource[]>(INITIAL_SOURCES);
  const [columns, setColumns] = useState<DatasetColumn[]>(FACTS_COLUMNS);
  const [filters, setFilters] = useState<DatasetFilter[]>([]);
  const [rows, setRows] = useState<DatasetRow[]>(INITIAL_ROWS);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [inspectorColumn, setInspectorColumn] = useState<DatasetColumn | null>(null);
  const [addColumnOpen, setAddColumnOpen] = useState(false);

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
    // Set running state
    setRows(prev => prev.map(r => rowIds.includes(r.id) ? { ...r, isRunning: true } : r));

    // Simulate AI processing
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
            // Generate a placeholder for custom columns
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

  if (!open) return null;

  const hasSelectedRows = selectedRows.size > 0;
  const aiColumnsCount = columns.filter(c => c.type === "ai").length;

  return (
    <TooltipProvider>
      {/* Backdrop — 5% gap on left */}
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
              <h1 className="text-sm font-bold">Competitor Dataset</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={() => setAddColumnOpen(true)}>
                <Plus className="h-3.5 w-3.5" /> Add Column
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                <Save className="h-3.5 w-3.5" /> Save as Template
              </Button>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    className={cn("h-8 text-xs gap-1.5", "bg-green-600 hover:bg-green-700 text-white")}
                    onClick={handleRunAll}
                  >
                    <Play className="h-3.5 w-3.5" />
                    {hasSelectedRows ? `Run (${selectedRows.size})` : "Run All"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs max-w-[220px]">
                  {hasSelectedRows
                    ? `Process ${selectedRows.size} selected row${selectedRows.size !== 1 ? "s" : ""} with AI enrichment`
                    : aiColumnsCount > 0
                      ? "Process all rows with AI enrichment across all AI columns"
                      : "Add AI columns first, then run to populate them"
                  }
                </TooltipContent>
              </Tooltip>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left panel */}
            <DatasetBuilderLeftPanel
              sources={sources}
              onAddSource={handleAddSource}
              onRemoveSource={handleRemoveSource}
              filters={filters}
              onAddFilter={handleAddFilter}
              onRemoveFilter={handleRemoveFilter}
            />

            {/* Center table */}
            <DatasetBuilderTable
              columns={columns}
              rows={rows}
              selectedRows={selectedRows}
              onToggleRow={handleToggleRow}
              onToggleAll={handleToggleAll}
              onColumnClick={setInspectorColumn}
              onRunRows={handleRunRows}
              activeColumnId={inspectorColumn?.id}
            />

            {/* Right inspector */}
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
        </div>
      </div>

      {/* Add Column Modal */}
      <AddColumnModal
        open={addColumnOpen}
        onOpenChange={setAddColumnOpen}
        onAddColumn={handleAddColumn}
      />
    </TooltipProvider>
  );
}
