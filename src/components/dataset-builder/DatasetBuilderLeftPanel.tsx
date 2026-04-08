import { useState } from "react";
import { X, Plus, Database, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import type { DatasetSource, DatasetColumn, DatasetRow, ActiveFilter } from "./types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TableFilterPopover from "./TableFilterPopover";

// These represent the competitors available in the Data Room
const DATA_ROOM_COMPETITORS = [
  { id: "1", name: "Canva Ads", avatar: "https://logo.clearbit.com/canva.com", url: "https://www.facebook.com/ads/library/?q=canva" },
  { id: "2", name: "Smartly.io", avatar: "https://logo.clearbit.com/smartly.io", url: "https://www.facebook.com/ads/library/?q=smartly" },
  { id: "3", name: "AdCreative.ai", avatar: "https://logo.clearbit.com/adcreative.ai", url: "https://www.facebook.com/ads/library/?q=adcreative" },
];

interface Props {
  sources: DatasetSource[];
  onAddSource: (source: DatasetSource) => void;
  onRemoveSource: (id: string) => void;
  activeFilters: ActiveFilter[];
  onRemoveFilter: (columnId: string) => void;
  onClearAllFilters: () => void;
  columns: DatasetColumn[];
  rows: DatasetRow[];
  onApplyFilter: (filter: ActiveFilter) => void;
}

export default function DatasetBuilderLeftPanel({ sources, onAddSource, onRemoveSource, activeFilters, onRemoveFilter, onClearAllFilters, columns, rows, onApplyFilter }: Props) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const competitorSources = sources.filter(s => s.type === "competitor");

  const addedIds = competitorSources.map(s => {
    const match = s.id.match(/^comp-(.+?)-\d+$/);
    return match ? match[1] : s.id;
  });

  const availableCompetitors = DATA_ROOM_COMPETITORS.filter(c => !addedIds.includes(c.id));

  const handleAddCompetitor = (comp: typeof DATA_ROOM_COMPETITORS[0]) => {
    onAddSource({
      id: `comp-${comp.id}-${Date.now()}`,
      type: "competitor",
      label: comp.name,
      avatar: comp.avatar,
      url: comp.url,
      status: "connected",
    });
    setPopoverOpen(false);
  };

  return (
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
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <button className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-dashed border-primary/30 text-[11px] text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors">
                  <Plus className="h-3 w-3" /><span>Add brand</span>
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56 p-1.5">
                {availableCompetitors.length > 0 ? (
                  <div className="space-y-0.5">
                    {availableCompetitors.map(comp => (
                      <button
                        key={comp.id}
                        onClick={() => handleAddCompetitor(comp)}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-muted transition-colors text-left"
                      >
                        <img
                          src={comp.avatar}
                          alt={comp.name}
                          className="h-5 w-5 rounded-full object-cover bg-muted shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comp.name)}&size=20&background=random`; }}
                        />
                        <span className="text-xs font-medium truncate">{comp.name}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-muted-foreground text-center py-3">All competitors already added</p>
                )}
                <div className="border-t border-border mt-1.5 pt-1.5">
                  <Link
                    to="/brand-data-room/competitors"
                    className="flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-muted transition-colors text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setPopoverOpen(false)}
                  >
                    <Plus className="h-3 w-3 shrink-0" />
                    <span>Track new competitor</span>
                  </Link>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Filters section */}
        {activeFilters.length > 0 ? (
          <>
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Filters</p>
              <TableFilterPopover columns={columns} rows={rows} activeFilters={activeFilters} onApplyFilter={onApplyFilter} triggerVariant="icon" />
              <button onClick={onClearAllFilters} className="text-[10px] text-muted-foreground hover:text-destructive transition-colors ml-auto">Clear all</button>
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
        ) : (
          <TableFilterPopover columns={columns} rows={rows} activeFilters={activeFilters} onApplyFilter={onApplyFilter} triggerVariant="button" />
        )}
      </div>
    </div>
  );
}
