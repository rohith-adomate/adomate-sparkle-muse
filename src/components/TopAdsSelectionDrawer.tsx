import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import DrawerContinueFooter from "./DrawerContinueFooter";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Info, ListFilter, CalendarClock } from "lucide-react";

export type SelectionMode = "all-new" | "top-n";

export interface SelectConfig {
  mode: SelectionMode;
  count: number;
  maxAgeEnabled: boolean;
  maxAgeMonths: number;
}

interface TopAdsSelectionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config?: SelectConfig;
  onConfigChange?: (config: SelectConfig) => void;
  onContinue?: () => void;
  continueLabel?: string;
}

function buildSummary(config: SelectConfig): string {
  if (config.mode === "all-new") {
    return "All new ads since last scheduled run";
  }
  let s = `Top ${config.count} ads by days online`;
  if (config.maxAgeEnabled) {
    s += ` (last ${config.maxAgeMonths}mo)`;
  }
  return s;
}

export default function TopAdsSelectionDrawer({
  open,
  onOpenChange,
  config: initialConfig,
  onConfigChange,
  onContinue,
  continueLabel,
}: TopAdsSelectionDrawerProps) {
  const defaultConfig: SelectConfig = {
    mode: "top-n",
    count: 10,
    maxAgeEnabled: false,
    maxAgeMonths: 3,
  };
  const init = initialConfig ?? defaultConfig;

  const [mode, setMode] = useState<SelectionMode>(init.mode);
  const [topCount, setTopCount] = useState(String(init.count));
  const [maxAgeEnabled, setMaxAgeEnabled] = useState(init.maxAgeEnabled);
  const [maxAgeMonths, setMaxAgeMonths] = useState(String(init.maxAgeMonths));

  const count = parseInt(topCount) || 10;
  const months = parseInt(maxAgeMonths) || 3;

  const emitChange = (m: SelectionMode, c: number, ageEnabled: boolean, ageMo: number) => {
    onConfigChange?.({ mode: m, count: c, maxAgeEnabled: ageEnabled, maxAgeMonths: ageMo });
  };

  const handleModeChange = (m: SelectionMode) => {
    setMode(m);
    emitChange(m, count, maxAgeEnabled, months);
  };

  const handleCountChange = (val: string) => {
    setTopCount(val);
    emitChange(mode, parseInt(val) || 10, maxAgeEnabled, months);
  };

  const handleMaxAgeToggle = (checked: boolean) => {
    setMaxAgeEnabled(checked);
    emitChange(mode, count, checked, months);
  };

  const handleMaxAgeMonthsChange = (val: string) => {
    setMaxAgeMonths(val);
    emitChange(mode, count, maxAgeEnabled, parseInt(val) || 3);
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
                    : "by days online"}
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
                  ads with the most days online will be selected and passed to the next node for ad generation.
                  {maxAgeEnabled && (
                    <>
                      {" "}Ads older than{" "}
                      <span className="font-medium text-foreground">{months} month{months !== 1 ? "s" : ""}</span>{" "}
                      will be excluded.
                    </>
                  )}
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
                    { value: "top-n" as SelectionMode, label: "Top N by days online" },
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

                {/* Max age exclusion */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Age exclusion
                  </Label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <Checkbox
                      checked={maxAgeEnabled}
                      onCheckedChange={(v) => handleMaxAgeToggle(!!v)}
                      className="h-3.5 w-3.5"
                    />
                    <span className="text-[11px] text-muted-foreground">Exclude ads older than</span>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <Info className="h-2.5 w-2.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs text-[10px]">
                        Only include ads first launched within this timeframe.
                      </TooltipContent>
                    </Tooltip>
                  </label>
                  {maxAgeEnabled && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        max="24"
                        value={maxAgeMonths}
                        onChange={(e) => handleMaxAgeMonthsChange(e.target.value)}
                        className="h-8 text-xs w-20"
                      />
                      <span className="text-xs text-muted-foreground">months</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <DrawerContinueFooter onContinue={onContinue} label={continueLabel} sticky />
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}

export { buildSummary };
