import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Filter, ArrowLeft, ChevronRight, X, Plus, Circle } from "lucide-react";
import type { DatasetColumn, DatasetRow, ActiveFilter, FilterMode } from "./types";
import { daysOnline } from "./mockData";

interface Props {
  columns: DatasetColumn[];
  rows: DatasetRow[];
  activeFilters: ActiveFilter[];
  onApplyFilter: (filter: ActiveFilter) => void;
  triggerVariant?: "button" | "icon";
}

function getFilterMode(columnId: string): FilterMode {
  if (columnId === "col-days") return "number-range";
  if (columnId === "col-launched") return "date-range";
  if (columnId === "col-headline") return "text";
  return "select";
}

function getUniqueValues(columnId: string, rows: DatasetRow[]): string[] {
  const values = new Set<string>();
  rows.forEach(row => {
    let val = "";
    switch (columnId) {
      case "col-brand": val = row.brand; break;
      case "col-headline": val = row.headline; break;
      case "col-format": val = row.format; break;
      case "col-platform": val = row.platform; break;
      case "col-status": val = row.status; break;
      case "col-funnel": val = row.funnelStage; break;
      case "col-hook": val = row.hook; break;
      case "col-offer": val = row.offerPresent ? "Yes" : "No"; break;
      case "col-alignment": val = row.brandAlignment; break;
      default: {
        val = row.aiValues[columnId] || "";
        break;
      }
    }
    if (val) values.add(val);
  });
  return [...values].sort();
}

function getNumberRange(columnId: string, rows: DatasetRow[]): { min: number; max: number } {
  if (columnId === "col-days") {
    const days = rows.map(r => daysOnline(r.firstLaunched));
    return { min: Math.min(...days), max: Math.max(...days) };
  }
  return { min: 0, max: 100 };
}

export default function TableFilterPopover({ columns, rows, activeFilters, onApplyFilter, triggerVariant = "button" }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<DatasetColumn | null>(null);
  const [checkedValues, setCheckedValues] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [rangeMin, setRangeMin] = useState("");
  const [rangeMax, setRangeMax] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [textOperator, setTextOperator] = useState<"contains" | "not-contains" | "starts-with" | "ends-with">("contains");
  const [textValue, setTextValue] = useState("");

  const colKey = selectedColumn ? (selectedColumn.templateId || selectedColumn.id) : "";
  const filterMode = selectedColumn ? getFilterMode(colKey) : "select";

  const uniqueValues = useMemo(() => {
    if (!selectedColumn || filterMode !== "select") return [];
    return getUniqueValues(colKey, rows);
  }, [selectedColumn, rows, colKey, filterMode]);

  const numberRange = useMemo(() => {
    if (!selectedColumn || filterMode !== "number-range") return { min: 0, max: 100 };
    return getNumberRange(colKey, rows);
  }, [selectedColumn, rows, colKey, filterMode]);

  const filteredValues = useMemo(() => {
    if (!search) return uniqueValues;
    const q = search.toLowerCase();
    return uniqueValues.filter(v => v.toLowerCase().includes(q));
  }, [uniqueValues, search]);

  const handleColumnSelect = (col: DatasetColumn) => {
    const key = col.templateId || col.id;
    const mode = getFilterMode(key);
    setSelectedColumn(col);
    setSearch("");

    const existing = activeFilters.find(f => f.columnId === key);
    if (mode === "select") {
      setCheckedValues(new Set(existing?.values || []));
    } else if (mode === "number-range") {
      setRangeMin(existing?.min !== undefined ? String(existing.min) : "");
      setRangeMax(existing?.max !== undefined ? String(existing.max) : "");
    } else if (mode === "date-range") {
      setDateFrom(existing?.dateFrom || "");
      setDateTo(existing?.dateTo || "");
    } else if (mode === "text") {
      setTextOperator(existing?.textOperator || "contains");
      setTextValue(existing?.textValue || "");
    }
  };

  const handleBack = () => {
    setSelectedColumn(null);
    setCheckedValues(new Set());
    setSearch("");
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

    const filter: ActiveFilter = {
      id: `filter-${colKey}`,
      columnId: colKey,
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

  const filterableColumns = columns.filter(c => {
    const key = c.templateId || c.id;
    return !["col-hook", "col-brand", "col-platform"].includes(key);
  });

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
              {filterableColumns.map(col => (
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

            {filterMode === "select" && (() => {
              const booleanColumns = new Set(["col-status", "col-offer"]);
              const isSingleSelect = booleanColumns.has(colKey) && uniqueValues.length <= 2;
              const handleSelect = (val: string) => {
                if (isSingleSelect) {
                  setCheckedValues(new Set([val]));
                } else {
                  handleToggleValue(val);
                }
              };
              return (
                <>
                  <div className="max-h-[200px] overflow-y-auto px-1 pt-1.5 pb-2">
                    {uniqueValues.map(val => (
                      <label
                        key={val}
                        className="flex items-center gap-2 px-2.5 py-1.5 text-xs hover:bg-muted/30 rounded cursor-pointer"
                      >
                        {isSingleSelect ? (
                          <span className={cn(
                            "h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0",
                            checkedValues.has(val) ? "border-primary bg-primary" : "border-muted-foreground/40"
                          )}>
                            {checkedValues.has(val) && <Circle className="h-1.5 w-1.5 fill-primary-foreground text-primary-foreground" />}
                          </span>
                        ) : (
                          <Checkbox
                            checked={checkedValues.has(val)}
                            onCheckedChange={() => handleSelect(val)}
                            className="h-3.5 w-3.5"
                          />
                        )}
                        <span onClick={() => handleSelect(val)}>{val}</span>
                      </label>
                    ))}
                    {uniqueValues.length === 0 && (
                      <p className="text-[10px] text-muted-foreground px-3 py-2">No values found</p>
                    )}
                  </div>
                </>
              );
            })()}

            {filterMode === "number-range" && (
              <div className="px-3 pt-3 pb-2 space-y-2">
                <p className="text-[10px] text-muted-foreground">
                  Range: {numberRange.min} – {numberRange.max}
                </p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-muted-foreground font-medium">Min</label>
                    <input
                      type="number"
                      value={rangeMin}
                      onChange={e => setRangeMin(e.target.value)}
                      placeholder={String(numberRange.min)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary mt-0.5"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-muted-foreground font-medium">Max</label>
                    <input
                      type="number"
                      value={rangeMax}
                      onChange={e => setRangeMax(e.target.value)}
                      placeholder={String(numberRange.max)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary mt-0.5"
                    />
                  </div>
                </div>
              </div>
            )}

            {filterMode === "date-range" && (
              <div className="px-3 pt-3 pb-2 space-y-2">
                <div>
                  <label className="text-[10px] text-muted-foreground font-medium">From</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary mt-0.5"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground font-medium">To</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary mt-0.5"
                  />
                </div>
              </div>
            )}

            {filterMode === "text" && (
              <div className="px-3 pt-3 pb-2 space-y-2.5">
                <select
                  value={textOperator}
                  onChange={e => setTextOperator(e.target.value as typeof textOperator)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                >
                  <option value="contains">Contains</option>
                  <option value="not-contains">Doesn&#39;t contain</option>
                  <option value="starts-with">Starts with</option>
                  <option value="ends-with">Ends with</option>
                </select>
                <input
                  type="text"
                  value={textValue}
                  onChange={e => setTextValue(e.target.value)}
                  placeholder="Enter text…"
                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              </div>
            )}

            <div className="px-3 pb-2.5 pt-1">
              <Button
                size="sm"
                className="w-full h-8 text-xs bg-primary hover:bg-primary/90"
                disabled={!canApply()}
                onClick={handleApply}
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
