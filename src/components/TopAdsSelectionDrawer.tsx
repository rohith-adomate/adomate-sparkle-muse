import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Info, ListFilter, CalendarClock } from "lucide-react";

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
  "brand-alignment": "brand alignment",
  "ad-quality": "ad quality",
  "combined": "combined score",
};

const METRIC_DESCRIPTIONS: Record<RankMetric, string> = {
  "brand-alignment": "Ranks ads by how closely they align with your brand's voice, visuals, and positioning.",
  "ad-quality": "Ranks ads by creative quality — composition, copy clarity, and visual appeal.",
  "combined": "Ranks ads by the average of brand alignment and ad quality scores.",
};

function buildSummary(config: SelectConfig): string {
  if (config.mode === "all-new") {
    return "All new ads since last scheduled run";
  }
  return `Top ${config.count} ads by ${METRIC_LABELS[config.metric]}`;
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

  const summary = buildSummary({ mode, count, metric });

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
                    : `by ${METRIC_LABELS[metric]}`}
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
                  <span className="font-medium text-foreground">{METRIC_LABELS[metric]}</span> and
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
                  <Select value={metric} onValueChange={(v) => handleMetricChange(v as RankMetric)}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brand-alignment">Brand alignment</SelectItem>
                      <SelectItem value="ad-quality">Ad quality</SelectItem>
                      <SelectItem value="combined">Combined score</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    {METRIC_DESCRIPTIONS[metric]}
                  </p>
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
