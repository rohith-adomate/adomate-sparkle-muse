import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Plus, X, Filter,
  CheckCircle2, AlertTriangle, XCircle,
  SlidersHorizontal,
} from "lucide-react";
import type { DatasetSource, DatasetFilter } from "./types";
import AddSourceModal from "./AddSourceModal";
import AddFilterModal from "./AddFilterModal";

interface Props {
  sources: DatasetSource[];
  onAddSource: (source: DatasetSource) => void;
  onRemoveSource: (id: string) => void;
  filters: DatasetFilter[];
  onAddFilter: (filter: DatasetFilter) => void;
  onRemoveFilter: (id: string) => void;
}

const PRESET_FILTERS: { label: string; description: string; filter: Omit<DatasetFilter, "id"> }[] = [
  { label: "Active ads only", description: "Status equals Active", filter: { type: "status", label: "Active ads only", value: "Status equals Active" } },
  { label: "Min 14 days running", description: "Days Running ≥ 14", filter: { type: "min-days", label: "Min 14 days running", value: "Days Running ≥ 14" } },
  { label: "Has headline", description: "Headline is_not_empty", filter: { type: "format-contains", label: "Has headline", value: "Headline is_not_empty" } },
  { label: "Instagram only", description: "Platform equals Instagram", filter: { type: "brand", label: "Instagram only", value: "Platform equals Instagram" } },
  { label: "UGC format only", description: "Ad Type equals UGC", filter: { type: "format-contains", label: "UGC format only", value: "Ad Type equals UGC" } },
];

const statusBadge = (status: DatasetSource["status"]) => {
  switch (status) {
    case "connected":
      return (
        <Badge variant="outline" className="text-[9px] py-0 px-1.5 gap-1 border-green-500/30 text-green-600 bg-green-500/10 font-medium">
          <CheckCircle2 className="h-2.5 w-2.5" /> Connected
        </Badge>
      );
    case "needs-auth":
      return (
        <Badge variant="outline" className="text-[9px] py-0 px-1.5 gap-1 border-yellow-500/30 text-yellow-600 bg-yellow-500/10 font-medium">
          <AlertTriangle className="h-2.5 w-2.5" /> Needs Auth
        </Badge>
      );
    case "error":
      return (
        <Badge variant="outline" className="text-[9px] py-0 px-1.5 gap-1 border-red-500/30 text-red-600 bg-red-500/10 font-medium">
          <XCircle className="h-2.5 w-2.5" /> Error
        </Badge>
      );
  }
};

export default function DatasetBuilderLeftPanel({ sources, onAddSource, onRemoveSource, filters, onAddFilter, onRemoveFilter }: Props) {
  const [addSourceOpen, setAddSourceOpen] = useState(false);
  const [addFilterOpen, setAddFilterOpen] = useState(false);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);

  const handlePresetFilter = (preset: typeof PRESET_FILTERS[0]) => {
    onAddFilter({
      id: `fil-${Date.now()}`,
      ...preset.filter,
    });
    setFilterPopoverOpen(false);
  };

  return (
    <>
      <div className="w-72 shrink-0 border-r border-border bg-card flex flex-col overflow-y-auto">
        {/* Sources */}
        <div className="p-4 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sources</p>

          <div className="space-y-2">
            {sources.map(src => (
              <div key={src.id} className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg border border-border bg-background group">
                {src.avatar ? (
                  <img
                    src={src.avatar}
                    alt={src.label}
                    className="h-6 w-6 rounded-full object-cover bg-muted shrink-0 mt-0.5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(src.label)}&size=24&background=random`;
                    }}
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-muted-foreground">
                    {src.label.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-medium truncate">{src.label}</p>
                    {statusBadge(src.status)}
                  </div>
                  {src.url && (
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{src.url}</p>
                  )}
                </div>
                <button
                  onClick={() => onRemoveSource(src.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
          </div>

          <button
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors py-1"
            onClick={() => setAddSourceOpen(true)}
          >
            <Plus className="h-3 w-3" /> Add Source
          </button>
        </div>

        <Separator />

        {/* Filters */}
        <div className="p-4 space-y-3 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-3 w-3 text-muted-foreground" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Filters</p>
            </div>
            {filters.length > 0 && (
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{filters.length} Applied</span>
            )}
          </div>

          <div className="space-y-2">
            {filters.length === 0 && (
              <p className="text-[10px] text-muted-foreground py-3 text-center">No filters applied</p>
            )}
            {filters.map(f => (
              <div key={f.id} className="px-3 py-2.5 rounded-lg border border-border bg-background group">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <Filter className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium">{f.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{String(f.value)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveFilter(f.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Popover open={filterPopoverOpen} onOpenChange={setFilterPopoverOpen}>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors py-1">
                <Plus className="h-3 w-3" /> Add Filter
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="start">
              <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1">Quick Filters</p>
              {PRESET_FILTERS.map((pf, i) => (
                <button
                  key={i}
                  className="w-full flex items-start gap-2 text-left text-xs px-2 py-2 rounded hover:bg-accent transition-colors"
                  onClick={() => handlePresetFilter(pf)}
                >
                  <Filter className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-medium">{pf.label}</p>
                    <p className="text-[10px] text-muted-foreground">{pf.description}</p>
                  </div>
                </button>
              ))}
              <Separator className="my-1" />
              <button
                className="w-full flex items-center gap-2 text-left text-xs px-2 py-2 rounded hover:bg-accent transition-colors font-medium"
                onClick={() => { setFilterPopoverOpen(false); setAddFilterOpen(true); }}
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                Custom Filter...
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <AddSourceModal open={addSourceOpen} onOpenChange={setAddSourceOpen} onAddSource={onAddSource} />
      <AddFilterModal open={addFilterOpen} onOpenChange={setAddFilterOpen} onAddFilter={onAddFilter} />
    </>
  );
}
