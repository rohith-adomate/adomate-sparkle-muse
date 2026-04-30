import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Filter, ArrowLeft, ChevronRight, Plus } from "lucide-react";

export type ReviewFilterMode = "select" | "number-range" | "date-range" | "text";

export interface ReviewActiveFilter {
  id: string;
  columnId: string;
  columnName: string;
  mode: ReviewFilterMode;
  values: string[];
  min?: number;
  max?: number;
  dateFrom?: string;
  dateTo?: string;
  textOperator?: "contains" | "not-contains" | "starts-with" | "ends-with";
  textValue?: string;
}

interface ReviewFilterColumn {
  id: string;
  name: string;
  mode: ReviewFilterMode;
}

export const REVIEW_FILTER_COLUMNS: ReviewFilterColumn[] = [
  { id: "brand", name: "Brand", mode: "select" },
  { id: "platform", name: "Platform", mode: "select" },
  { id: "product", name: "Product", mode: "select" },
  { id: "rating", name: "Rating", mode: "number-range" },
  { id: "title", name: "Title", mode: "text" },
  { id: "text", name: "Review text", mode: "text" },
  { id: "date", name: "Date", mode: "date-range" },
  { id: "votes", name: "Votes", mode: "number-range" },
  { id: "reviewer", name: "Reviewer", mode: "text" },
  { id: "region", name: "Region", mode: "select" },
  { id: "language", name: "Language", mode: "select" },
  { id: "sentiment", name: "✦ Sentiment", mode: "select" },
];

interface FilterableRow {
  platform: string;
  rating: number;
  votes: number;
  product?: string | null;
  brandName?: string;
  region?: { flag: string; code: string } | null;
  language?: string;
  sentiment?: string;
}

interface Props {
  rows: FilterableRow[];
  activeFilters: ReviewActiveFilter[];
  onApplyFilter: (filter: ReviewActiveFilter) => void;
  triggerVariant?: "button" | "icon";
}

function getUniqueValues(columnId: string, rows: Props["rows"]): string[] {
  const set = new Set<string>();
  rows.forEach(r => {
    if (columnId === "platform") set.add(r.platform);
    if (columnId === "product") set.add(r.product || "—");
    if (columnId === "brand" && r.brandName) set.add(r.brandName);
    if (columnId === "region") set.add(r.region ? r.region.code : "Unknown");
    if (columnId === "language" && r.language) set.add(r.language);
    if (columnId === "sentiment" && r.sentiment) set.add(r.sentiment);
  });
  return [...set].sort();
}

function getNumberRange(columnId: string, rows: Props["rows"]): { min: number; max: number } {
  if (columnId === "rating") return { min: 1, max: 5 };
  if (columnId === "votes") {
    const v = rows.map(r => r.votes);
    return { min: v.length ? Math.min(...v) : 0, max: v.length ? Math.max(...v) : 0 };
  }
  return { min: 0, max: 100 };
}

export default function ReviewFilterPopover({ rows, activeFilters, onApplyFilter, triggerVariant = "button" }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<ReviewFilterColumn | null>(null);
  const [checkedValues, setCheckedValues] = useState<Set<string>>(new Set());
  const [rangeMin, setRangeMin] = useState("");
  const [rangeMax, setRangeMax] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [textOperator, setTextOperator] = useState<"contains" | "not-contains" | "starts-with" | "ends-with">("contains");
  const [textValue, setTextValue] = useState("");

  const filterMode = selectedColumn?.mode ?? "select";

  const uniqueValues = useMemo(() => {
    if (!selectedColumn || filterMode !== "select") return [];
    return getUniqueValues(selectedColumn.id, rows);
  }, [selectedColumn, rows, filterMode]);

  const numberRange = useMemo(() => {
    if (!selectedColumn || filterMode !== "number-range") return { min: 0, max: 100 };
    return getNumberRange(selectedColumn.id, rows);
  }, [selectedColumn, rows, filterMode]);

  const handleColumnSelect = (col: ReviewFilterColumn) => {
    setSelectedColumn(col);
    const existing = activeFilters.find(f => f.columnId === col.id);
    if (col.mode === "select") {
      setCheckedValues(new Set(existing?.values || []));
    } else if (col.mode === "number-range") {
      setRangeMin(existing?.min !== undefined ? String(existing.min) : "");
      setRangeMax(existing?.max !== undefined ? String(existing.max) : "");
    } else if (col.mode === "date-range") {
      setDateFrom(existing?.dateFrom || "");
      setDateTo(existing?.dateTo || "");
    } else if (col.mode === "text") {
      setTextOperator(existing?.textOperator || "contains");
      setTextValue(existing?.textValue || "");
    }
  };

  const handleBack = () => {
    setSelectedColumn(null);
    setCheckedValues(new Set());
    setRangeMin("");
    setRangeMax("");
    setDateFrom("");
    setDateTo("");
    setTextOperator("contains");
    setTextValue("");
  };

  const handleToggleValue = (val: string) => {
    setCheckedValues(prev => {
      const next = new Set(prev);
      if (next.has(val)) next.delete(val);
      else next.add(val);
      return next;
    });
  };

  const canApply = () => {
    if (filterMode === "select") return checkedValues.size > 0;
    if (filterMode === "number-range") return rangeMin !== "" || rangeMax !== "";
    if (filterMode === "date-range") return dateFrom !== "" || dateTo !== "";
    if (filterMode === "text") return textValue.trim() !== "";
    return false;
  };

  const handleApply = () => {
    if (!selectedColumn) return;
    const filter: ReviewActiveFilter = {
      id: `filter-${selectedColumn.id}`,
      columnId: selectedColumn.id,
      columnName: selectedColumn.name,
      mode: filterMode,
      values: [],
    };
    if (filterMode === "select") {
      filter.values = [...checkedValues];
    } else if (filterMode === "number-range") {
      if (rangeMin) filter.min = Number(rangeMin);
      if (rangeMax) filter.max = Number(rangeMax);
      const parts: string[] = [];
      if (rangeMin) parts.push(`≥ ${rangeMin}`);
      if (rangeMax) parts.push(`≤ ${rangeMax}`);
      filter.values = parts;
    } else if (filterMode === "date-range") {
      if (dateFrom) filter.dateFrom = dateFrom;
      if (dateTo) filter.dateTo = dateTo;
      const parts: string[] = [];
      if (dateFrom) parts.push(`From ${dateFrom}`);
      if (dateTo) parts.push(`To ${dateTo}`);
      filter.values = parts;
    } else if (filterMode === "text") {
      filter.textOperator = textOperator;
      filter.textValue = textValue.trim();
      const opLabels: Record<string, string> = { "contains": "contains", "not-contains": "doesn't contain", "starts-with": "starts with", "ends-with": "ends with" };
      filter.values = [`${opLabels[textOperator]} "${textValue.trim()}"`];
    }
    onApplyFilter(filter);
    handleBack();
    setOpen(false);
  };

  const handleOpenChange = (o: boolean) => {
    setOpen(o);
    if (!o) handleBack();
  };

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {triggerVariant === "icon" ? (
          <button className="inline-flex items-center justify-center h-5 w-5 rounded-md border border-dashed border-primary/30 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors">
            <Plus className="h-3 w-3" />
          </button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-7 text-[11px] gap-1.5 px-2.5",
              hasActiveFilters && "border-primary/50 text-primary"
            )}
          >
            <Filter className="h-3 w-3" />
            Filter
            {hasActiveFilters && (
              <span className="ml-0.5 h-4 min-w-[16px] rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center px-1">
                {activeFilters.length}
              </span>
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start">
        {!selectedColumn ? (
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground px-3 pt-2.5 pb-1.5">Filter by</p>
            <div className="max-h-[280px] overflow-y-auto pb-1">
              {REVIEW_FILTER_COLUMNS.map(col => (
                <button
                  key={col.id}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-muted/50 transition-colors"
                  onClick={() => handleColumnSelect(col)}
                >
                  <span className="font-medium">{col.name}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <button
              className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold hover:bg-muted/30 transition-colors border-b border-border"
              onClick={handleBack}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {selectedColumn.name}
            </button>

            {filterMode === "select" && (
              <div className="max-h-[200px] overflow-y-auto px-1 pt-1.5 pb-2">
                {uniqueValues.map(val => (
                  <label key={val} className="flex items-center gap-2 px-2.5 py-1.5 text-xs hover:bg-muted/30 rounded cursor-pointer">
                    <Checkbox checked={checkedValues.has(val)} onCheckedChange={() => handleToggleValue(val)} className="h-3.5 w-3.5" />
                    <span onClick={() => handleToggleValue(val)}>{val}</span>
                  </label>
                ))}
                {uniqueValues.length === 0 && <p className="text-[10px] text-muted-foreground px-3 py-2">No values found</p>}
              </div>
            )}

            {filterMode === "number-range" && (
              <div className="px-3 pt-3 pb-2 space-y-2">
                <p className="text-[10px] text-muted-foreground">Range: {numberRange.min} – {numberRange.max}</p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-muted-foreground font-medium">Min</label>
                    <input type="number" value={rangeMin} onChange={e => setRangeMin(e.target.value)} placeholder={String(numberRange.min)} className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary mt-0.5" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-muted-foreground font-medium">Max</label>
                    <input type="number" value={rangeMax} onChange={e => setRangeMax(e.target.value)} placeholder={String(numberRange.max)} className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary mt-0.5" />
                  </div>
                </div>
              </div>
            )}

            {filterMode === "date-range" && (
              <div className="px-3 pt-3 pb-2 space-y-2">
                <div>
                  <label className="text-[10px] text-muted-foreground font-medium">From</label>
                  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary mt-0.5" />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground font-medium">To</label>
                  <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary mt-0.5" />
                </div>
              </div>
            )}

            {filterMode === "text" && (
              <div className="px-3 pt-3 pb-2 space-y-2.5">
                <select value={textOperator} onChange={e => setTextOperator(e.target.value as typeof textOperator)} className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-foreground">
                  <option value="contains">Contains</option>
                  <option value="not-contains">Doesn&#39;t contain</option>
                  <option value="starts-with">Starts with</option>
                  <option value="ends-with">Ends with</option>
                </select>
                <input type="text" value={textValue} onChange={e => setTextValue(e.target.value)} placeholder="Enter text…" className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary" autoFocus />
              </div>
            )}

            <div className="px-3 pb-2.5 pt-1">
              <Button size="sm" className="w-full h-8 text-xs bg-primary hover:bg-primary/90" disabled={!canApply()} onClick={handleApply}>
                Apply
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
