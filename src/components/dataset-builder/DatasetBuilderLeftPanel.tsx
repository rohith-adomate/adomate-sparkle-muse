import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Plus, X, Database, Globe, FileText, List, Plug,
  CheckCircle2, AlertTriangle, XCircle,
  SlidersHorizontal,
} from "lucide-react";
import type { DatasetSource, DatasetFilter } from "./types";

interface Props {
  sources: DatasetSource[];
  onAddSource: (source: DatasetSource) => void;
  onRemoveSource: (id: string) => void;
  filters: DatasetFilter[];
  onAddFilter: (filter: DatasetFilter) => void;
  onRemoveFilter: (id: string) => void;
}

const SOURCE_TYPES = [
  { type: "competitor" as const, label: "Competitor Ad Library URL", icon: Database },
  { type: "landing-page" as const, label: "Landing Page URL", icon: Globe },
  { type: "csv" as const, label: "CSV Upload", icon: FileText },
  { type: "manual" as const, label: "Manual List", icon: List },
  { type: "api" as const, label: "API", icon: Plug },
];

const FILTER_TYPES: { type: DatasetFilter["type"]; label: string; defaultValue: string | number | string[] }[] = [
  { type: "status", label: "Status is Active", defaultValue: "Active" },
  { type: "min-days", label: "Min. days online", defaultValue: 30 },
  { type: "format-contains", label: "Format contains", defaultValue: "" },
  { type: "domain-contains", label: "Landing page domain contains", defaultValue: "" },
  { type: "brand", label: "Brand", defaultValue: [] },
  { type: "funnel-stage", label: "Funnel stage", defaultValue: [] },
];

const statusIcon = (status: DatasetSource["status"]) => {
  switch (status) {
    case "connected": return <CheckCircle2 className="h-3 w-3 text-green-500" />;
    case "needs-auth": return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
    case "error": return <XCircle className="h-3 w-3 text-destructive" />;
  }
};

const statusLabel = (status: DatasetSource["status"]) => {
  switch (status) {
    case "connected": return "Connected";
    case "needs-auth": return "Needs Auth";
    case "error": return "Error";
  }
};

export default function DatasetBuilderLeftPanel({ sources, onAddSource, onRemoveSource, filters, onAddFilter, onRemoveFilter }: Props) {
  const [sourcePopoverOpen, setSourcePopoverOpen] = useState(false);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);

  const handleAddSource = (type: DatasetSource["type"], label: string) => {
    onAddSource({
      id: `src-${Date.now()}`,
      type,
      label: label || type,
      status: "connected",
    });
    setSourcePopoverOpen(false);
  };

  const handleAddFilter = (ft: typeof FILTER_TYPES[0]) => {
    // Don't add duplicate filter types
    if (filters.some(f => f.type === ft.type)) return;
    onAddFilter({
      id: `fil-${Date.now()}`,
      type: ft.type,
      label: ft.label,
      value: ft.defaultValue,
    });
    setFilterPopoverOpen(false);
  };

  const availableFilterTypes = FILTER_TYPES.filter(ft => !filters.some(f => f.type === ft.type));

  return (
    <div className="w-64 shrink-0 border-r border-border bg-card flex flex-col overflow-y-auto">
      {/* Sources */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sources</p>
          <Popover open={sourcePopoverOpen} onOpenChange={setSourcePopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] gap-1">
                <Plus className="h-3 w-3" /> Add
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="start">
              <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1">Add Source</p>
              {SOURCE_TYPES.map(st => {
                const Icon = st.icon;
                return (
                  <button
                    key={st.type}
                    className="w-full flex items-center gap-2 text-left text-xs px-2 py-2 rounded hover:bg-accent transition-colors"
                    onClick={() => handleAddSource(st.type, st.label)}
                  >
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    {st.label}
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1.5">
          {sources.map(src => (
            <div key={src.id} className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-border bg-background group">
              {src.avatar ? (
                <img
                  src={src.avatar}
                  alt={src.label}
                  className="h-5 w-5 rounded-full object-cover bg-muted shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(src.label)}&size=20&background=random`; }}
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Database className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium truncate">{src.label}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {statusIcon(src.status)}
                <span className="text-[9px] text-muted-foreground hidden group-hover:hidden">{statusLabel(src.status)}</span>
                <button
                  onClick={() => onRemoveSource(src.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Filters */}
      <div className="p-4 space-y-3 flex-1">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Filters</p>
          <Popover open={filterPopoverOpen} onOpenChange={setFilterPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] gap-1" disabled={availableFilterTypes.length === 0}>
                <Plus className="h-3 w-3" /> Add
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="start">
              <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1">Add Filter</p>
              {availableFilterTypes.map(ft => (
                <button
                  key={ft.type}
                  className="w-full flex items-center gap-2 text-left text-xs px-2 py-2 rounded hover:bg-accent transition-colors"
                  onClick={() => handleAddFilter(ft)}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  {ft.label}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1.5">
          {filters.length === 0 && (
            <p className="text-[10px] text-muted-foreground py-3 text-center">No filters applied. Click + Add to narrow results.</p>
          )}
          {filters.map(f => (
            <div key={f.id} className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-border bg-background group">
              <SlidersHorizontal className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-[11px] flex-1 truncate">{f.label}</span>
              {f.type === "min-days" && (
                <span className="text-[10px] text-muted-foreground">≥ {String(f.value)}</span>
              )}
              {f.type === "status" && (
                <Badge variant="outline" className="text-[8px] px-1 py-0">{String(f.value)}</Badge>
              )}
              <button onClick={() => onRemoveFilter(f.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
