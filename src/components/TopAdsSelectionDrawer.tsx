import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Info, ListFilter } from "lucide-react";

interface TopAdsSelectionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count?: number;
  sortBy?: "new-reach" | "total-reach";
  onConfigChange?: (count: number, sortBy: "new-reach" | "total-reach") => void;
}

export default function TopAdsSelectionDrawer({ open, onOpenChange, count: initialCount = 10, sortBy: initialSortBy = "new-reach", onConfigChange }: TopAdsSelectionDrawerProps) {
  const [topCount, setTopCount] = useState(String(initialCount));
  const [sortBy, setSortBy] = useState<"new-reach" | "total-reach">(initialSortBy);

  const handleCountChange = (val: string) => {
    setTopCount(val);
    const n = parseInt(val) || 10;
    onConfigChange?.(n, sortBy);
  };

  const handleSortChange = (val: "new-reach" | "total-reach") => {
    setSortBy(val);
    onConfigChange?.(parseInt(topCount) || 10, val);
  };

  const count = parseInt(topCount) || 10;

  return (
    <TooltipProvider>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[360px] sm:w-[400px] overflow-y-auto">
          <SheetHeader className="pb-5">
            <SheetTitle className="text-base">Select Top Ads</SheetTitle>
          </SheetHeader>

          {/* Summary card */}
          <div className="rounded-xl border border-border bg-muted/30 p-5 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <ListFilter className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Top {count} ads</p>
                <p className="text-[11px] text-muted-foreground">
                  by {sortBy === "new-reach" ? "new reach" : "total reach"}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The top <Badge variant="secondary" className="text-[10px] px-1.5 py-0 mx-0.5 font-semibold">{count}</Badge> performing ads from your dataset will be selected based on{" "}
              <span className="font-medium text-foreground">{sortBy === "new-reach" ? "new reach" : "total reach"}</span>{" "}
              and passed to the next node for ad generation.
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-5">
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
                  How many top-performing ads to select from the filtered dataset. These ads will be used as reference for generating new ad variations.
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

            {/* Sort criteria */}
            <div className="space-y-2">
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5 cursor-help">
                    Ranked by
                    <Info className="h-3 w-3" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[260px] text-xs">
                  Choose how ads are ranked. "New reach" measures recent growth, while "Total reach" uses the all-time estimated impressions.
                </TooltipContent>
              </Tooltip>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as "new-reach" | "total-reach")}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new-reach">New reach</SelectItem>
                  <SelectItem value="total-reach">Total reach</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}
