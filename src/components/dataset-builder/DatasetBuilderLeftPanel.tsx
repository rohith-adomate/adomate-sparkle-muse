import { useState } from "react";
import { X, Plus } from "lucide-react";
import type { DatasetSource, ActiveFilter } from "./types";
import SearchCompetitorModal from "./SearchCompetitorModal";

interface Props {
  sources: DatasetSource[];
  onAddSource: (source: DatasetSource) => void;
  onRemoveSource: (id: string) => void;
  activeFilters: ActiveFilter[];
  onRemoveFilter: (columnId: string) => void;
  onClearAllFilters: () => void;
}

export default function DatasetBuilderLeftPanel({ sources, onAddSource, onRemoveSource, activeFilters, onRemoveFilter, onClearAllFilters }: Props) {
  const [searchCompetitorOpen, setSearchCompetitorOpen] = useState(false);
  const competitorSources = sources.filter(s => s.type === "competitor");

  const handleAddCompetitor = (comp: { id: string; name: string; avatar: string; url: string }) => {
    onAddSource({
      id: `comp-${comp.id}-${Date.now()}`,
      type: "competitor",
      label: comp.name,
      avatar: comp.avatar,
      url: comp.url,
      status: "connected",
    });
  };

  return (
    <>
      <div className="w-64 shrink-0 border-r border-border bg-card flex flex-col overflow-y-auto">
        <div className="p-4 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Sources</p>
          <div className="space-y-2">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70">Brands</p>
            <div className="flex flex-wrap gap-1.5">
              {competitorSources.map(src => (
                <div key={src.id} className="inline-flex items-center gap-1.5 pl-1.5 pr-1.5 py-1 rounded-full border border-border bg-background group text-[11px]">
                  <img src={src.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(src.label)}&size=16&background=random`} alt={src.label} className="h-4 w-4 rounded-full object-cover bg-muted shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(src.label)}&size=16&background=random`; }} />
                  <span className="font-medium truncate max-w-[130px]">{src.label}</span>
                  <button onClick={() => onRemoveSource(src.id)} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-0.5"><X className="h-2.5 w-2.5 text-muted-foreground hover:text-destructive" /></button>
                </div>
              ))}
              <button onClick={() => setSearchCompetitorOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-dashed border-primary/30 text-[11px] text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors">
                <Plus className="h-3 w-3" /><span>Add brand</span>
              </button>
            </div>
          </div>
          {activeFilters.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Filters</p>
                <button onClick={onClearAllFilters} className="text-[10px] text-muted-foreground hover:text-destructive transition-colors">Clear all</button>
              </div>
              {activeFilters.map(filter => (
                <div key={filter.columnId} className="space-y-2">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70">{filter.columnName}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {filter.values.map(val => (
                      <div key={val} className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-full border border-border bg-background group text-[11px]">
                        <span className="font-medium truncate max-w-[100px]">{val}</span>
                        <button onClick={() => onRemoveFilter(filter.columnId)} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"><X className="h-2.5 w-2.5 text-muted-foreground hover:text-destructive" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <SearchCompetitorModal open={searchCompetitorOpen} onOpenChange={setSearchCompetitorOpen} onSelect={handleAddCompetitor} existingIds={competitorSources.map(s => s.id)} />
    </>
  );
}
