import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Info, ListFilter, CalendarClock, ChevronDown, Check } from "lucide-react";

export type SelectionMode = "all-new" | "top-n";
export type RankMetric = "brand-alignment" | "ad-quality" | "combined";

export interface SelectConfig {
  mode: SelectionMode;
  count: number;
  metric: RankMetric;
}

interface TopAdsSelectionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config?: SelectConfig;
  onConfigChange?: (config: SelectConfig) => void;
}

const METRIC_LABELS: Record<RankMetric, string> = {
  "brand-alignment": "Brand alignment",
  "ad-quality": "Ad quality",
  "combined": "Combined score",
};

const METRIC_DESCRIPTIONS: Record<RankMetric, string> = {
  "brand-alignment": "How closely an ad matches your brand's style, tone, and visual identity.",
  "ad-quality": "How well an ad is crafted — clear copy, strong visuals, and effective layout.",
  "combined": "The average of brand alignment and ad quality, giving a balanced overall ranking.",
};

const METRICS: RankMetric[] = ["brand-alignment", "ad-quality", "combined"];

function MetricDropdown({ value, onChange }: { value: RankMetric; onChange: (v: RankMetric) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <span className="inline-flex items-center gap-1.5">
                {METRIC_LABELS[value]}
                <Info className="h-3 w-3 text-muted-foreground" />
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-[220px] text-xs">
          {METRIC_DESCRIPTIONS[value]}
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-1" align="start">
        {METRICS.map((m) => (
          <Tooltip key={m} delayDuration={200}>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer transition-colors",
                  value === m ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                )}
                onClick={() => { onChange(m); setOpen(false); }}
              >
                <Check className={cn("h-3.5 w-3.5 shrink-0", value === m ? "opacity-100" : "opacity-0")} />
                <span className="flex-1 text-left">{METRIC_LABELS[m]}</span>
                <Info className="h-3 w-3 text-muted-foreground shrink-0" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[220px] text-xs">
              {METRIC_DESCRIPTIONS[m]}
            </TooltipContent>
          </Tooltip>
        ))}
      </PopoverContent>
    </Popover>
  );
}

function buildSummary(config: SelectConfig): string {
  if (config.mode === "all-new") {
    return "All new ads since last scheduled run";
  }
  return `Top ${config.count} ads by ${METRIC_LABELS[config.metric].toLowerCase()}`;
}

export default function TopAdsSelectionDrawer({
  open,
  onOpenChange,
  config: initialConfig,
  onConfigChange,
}: TopAdsSelectionDrawerProps) {
  const defaultConfig: SelectConfig = {
    mode: "top-n",
    count: 10,
    metric: "combined",
  };
  const init = initialConfig ?? defaultConfig;

  const [mode, setMode] = useState<SelectionMode>(init.mode);
  const [topCount, setTopCount] = useState(String(init.count));
  const [metric, setMetric] = useState<RankMetric>(init.metric);

  const count = parseInt(topCount) || 10;

  const emitChange = (m: SelectionMode, c: number, met: RankMetric) => {
    onConfigChange?.({ mode: m, count: c, metric: met });
  };

  const handleModeChange = (m: SelectionMode) => {
    setMode(m);
    emitChange(m, count, metric);
  };

  const handleCountChange = (val: string) => {
    setTopCount(val);
    emitChange(mode, parseInt(val) || 10, metric);
  };

  const handleMetricChange = (val: RankMetric) => {
    setMetric(val);
    emitChange(mode, count, val);
  };

  return (
    <TooltipProvider>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[360px] sm:w-[400px] overflow-y-auto">
          <SheetHeader className="pb-5">
            <SheetTitle className="text-base">Select — Settings</SheetTitle>
          </SheetHeader>

          {/* Summary card */}
          <div className="rounded-xl border border-border bg-muted/30 p-5 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-primary/10 p-2">
                {mode === "all-new" ? (
                  <CalendarClock className="h-4 w-4 text-primary" />
                ) : (
                  <ListFilter className="h-4 w-4 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {mode === "all-new" ? "All new ads" : `Top ${count} ads`}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {mode === "all-new"
                    ? "since last scheduled run"
                    : `by ${METRIC_LABELS[metric].toLowerCase()}`}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {mode === "all-new" ? (
                <>
                  Every ad added to your dataset since the last scheduled run will be selected and passed to the next node for ad generation.
                </>
              ) : (
                <>
                  The top{" "}
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 mx-0.5 font-semibold">
                    {count}
                  </Badge>{" "}
                  performing ads from your dataset will be selected based on{" "}
                  <span className="font-medium text-foreground">{METRIC_LABELS[metric].toLowerCase()}</span> and
                  passed to the next node for ad generation.
                </>
              )}
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-5">
            {/* Selection mode */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Selection mode
              </Label>
              <div className="flex items-center gap-1.5">
                {(
                  [
                    { value: "all-new" as SelectionMode, label: "All new since last run" },
                    { value: "top-n" as SelectionMode, label: "Top N by metric" },
                  ] as const
                ).map((opt) => (
                  <div
                    key={opt.value}
                    className={cn(
                      "flex-1 rounded-md border px-3 py-2 text-center cursor-pointer transition-colors text-[11px] font-medium",
                      mode === opt.value
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:bg-muted/40"
                    )}
                    onClick={() => handleModeChange(opt.value)}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Top-N controls */}
            {mode === "top-n" && (
              <>
                {/* Number of ads */}
                <div className="space-y-2">
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5 cursor-help">
                        Number of ads
                        <Info className="h-3 w-3" />
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[240px] text-xs">
                      How many top-performing ads to select from the filtered dataset.
                    </TooltipContent>
                  </Tooltip>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={topCount}
                    onChange={(e) => handleCountChange(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>

                {/* Rank metric */}
                <div className="space-y-2">
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5 cursor-help">
                        Ranked by
                        <Info className="h-3 w-3" />
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[260px] text-xs">
                      Choose how ads are ranked before selecting the top results.
                    </TooltipContent>
                  </Tooltip>
                  <MetricDropdown value={metric} onChange={handleMetricChange} />
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}

export { buildSummary };
