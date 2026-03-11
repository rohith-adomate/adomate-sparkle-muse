import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Plus, Check, ChevronDown, X } from "lucide-react";

interface CompetitorScrapeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MOCK_COMPETITORS = [
  { id: "1", name: "CeraVe", avatar: "https://logo.clearbit.com/cerave.com", selected: true },
  { id: "2", name: "The Ordinary", avatar: "https://logo.clearbit.com/theordinary.com", selected: true },
  { id: "3", name: "La Roche-Posay", avatar: "https://logo.clearbit.com/laroche-posay.com", selected: false },
  { id: "4", name: "Paula's Choice", avatar: "https://logo.clearbit.com/paulaschoice.com", selected: false },
];

type PeriodType = "all-time" | "last-week" | "last-x";
type PeriodUnit = "days" | "weeks" | "months";

export default function CompetitorScrapeDrawer({ open, onOpenChange }: CompetitorScrapeDrawerProps) {
  const navigate = useNavigate();
  const [competitors, setCompetitors] = useState(MOCK_COMPETITORS);
  const [competitorPopoverOpen, setCompetitorPopoverOpen] = useState(false);
  const [maxAds, setMaxAds] = useState("10");
  const [minReach, setMinReach] = useState("1000");
  const [minDaysActive, setMinDaysActive] = useState("7");
  const [daysActiveEnabled, setDaysActiveEnabled] = useState(false);
  const [reachEnabled, setReachEnabled] = useState(false);
  const [periodType, setPeriodType] = useState<PeriodType>("all-time");
  const [lastXValue, setLastXValue] = useState("30");
  const [lastXUnit, setLastXUnit] = useState<PeriodUnit>("days");

  const toggleCompetitor = (id: string) => {
    setCompetitors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  const selectedCompetitors = competitors.filter((c) => c.selected);
  const selectedCount = selectedCompetitors.length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[380px] sm:w-[420px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-base">Competitor Scrape — Settings</SheetTitle>
        </SheetHeader>

        {/* Competitor Selection - Tags + Popover */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Competitors
            </Label>
          </div>

          {/* Selected competitor tags */}
          {selectedCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedCompetitors.map((c) => (
                <div
                  key={c.id}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-2.5 py-1.5 text-xs font-medium"
                >
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="h-4 w-4 rounded-full object-cover bg-muted shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&size=16&background=random`;
                    }}
                  />
                  <span>{c.name}</span>
                  <button
                    onClick={() => toggleCompetitor(c.id)}
                    className="rounded-full hover:bg-muted p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Popover open={competitorPopoverOpen} onOpenChange={setCompetitorPopoverOpen}>
            <PopoverTrigger asChild>
              <button className="w-full flex items-center justify-between rounded-lg border border-dashed border-border px-3 py-2.5 text-left hover:bg-muted/40 transition-colors">
                <span className="text-xs text-muted-foreground">
                  Add competitors…
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-2" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[340px] p-0" align="start">
              <div className="p-1.5 space-y-0.5 max-h-[260px] overflow-y-auto">
                {competitors.map((c) => (
                  <button
                    key={c.id}
                    className="w-full flex items-center gap-3 rounded-md px-2.5 py-2 cursor-pointer hover:bg-muted/60 transition-colors"
                    onClick={() => toggleCompetitor(c.id)}
                  >
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="h-6 w-6 rounded-full object-cover bg-muted shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&size=24&background=random`;
                      }}
                    />
                    <span className="text-xs font-medium flex-1 text-left">{c.name}</span>
                    {c.selected && (
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
              <Separator />
              <button
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition-colors text-xs font-medium text-muted-foreground"
                onClick={() => {
                  setCompetitorPopoverOpen(false);
                  onOpenChange(false);
                  navigate("/brand-data-room/competitors");
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                Add competitor
              </button>
            </PopoverContent>
          </Popover>
        </div>

        <Separator className="mb-6" />

        {/* Max Ads */}
        <TooltipProvider>
          <div className="space-y-2 mb-6">
            <Tooltip>
              <TooltipTrigger asChild>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5 cursor-help">
                  Top ads to select
                  <Info className="h-3 w-3" />
                </Label>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[220px] text-xs">
                The best ads across all selected competitors combined.
              </TooltipContent>
            </Tooltip>
            <Input
              type="number"
              min="1"
              max="100"
              value={maxAds}
              onChange={(e) => setMaxAds(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
        </TooltipProvider>

        <Separator className="mb-6" />

        {/* Thresholds */}
        <div className="space-y-4 mb-6">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Thresholds
          </Label>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={daysActiveEnabled}
                onCheckedChange={(v) => setDaysActiveEnabled(!!v)}
              />
              <span className="text-xs text-muted-foreground">Min. days active</span>
            </label>
            {daysActiveEnabled && (
              <>
                <Input
                  type="number"
                  min="0"
                  value={minDaysActive}
                  onChange={(e) => setMinDaysActive(e.target.value)}
                  className="h-9 text-sm"
                />
                <p className="text-[10px] text-muted-foreground">
                  Only include ads that have been active for at least this many days.
                </p>
              </>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={reachEnabled}
                onCheckedChange={(v) => setReachEnabled(!!v)}
              />
              <span className="text-xs text-muted-foreground">Min. estimated reach</span>
            </label>
            {reachEnabled && (
              <>
                <Input
                  type="number"
                  min="0"
                  value={minReach}
                  onChange={(e) => setMinReach(e.target.value)}
                  className="h-9 text-sm"
                />
                <p className="text-[10px] text-muted-foreground">
                  Only include ads with at least this estimated reach.
                </p>
              </>
            )}
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Time Period */}
        <TooltipProvider>
          <div className="space-y-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5 cursor-help">
                  Time period
                  <Info className="h-3 w-3" />
                </Label>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[220px] text-xs">
                The time period in which the ad has been launched.
              </TooltipContent>
            </Tooltip>

            <div className="space-y-3">
              {/* Period type selector */}
              <div className="flex items-center gap-2">
                {(["all-time", "last-week", "last-x"] as PeriodType[]).map((type) => (
                  <div
                    key={type}
                    className={`flex-1 rounded-lg border px-2.5 py-2 text-center cursor-pointer transition-colors text-xs font-medium ${
                      periodType === type
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:bg-muted/40"
                    }`}
                    onClick={() => setPeriodType(type)}
                  >
                    {type === "all-time" ? "All time" : type === "last-week" ? "Last week" : "Last X"}
                  </div>
                ))}
              </div>

              {/* Last X configuration */}
              {periodType === "last-x" && (
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 p-3">
                  <span className="text-xs text-muted-foreground shrink-0">Last</span>
                  <Input
                    type="number"
                    min="1"
                    value={lastXValue}
                    onChange={(e) => setLastXValue(e.target.value)}
                    className="h-8 text-sm w-20"
                  />
                  <Select value={lastXUnit} onValueChange={(v) => setLastXUnit(v as PeriodUnit)}>
                    <SelectTrigger className="h-8 text-xs w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">days</SelectItem>
                      <SelectItem value="weeks">weeks</SelectItem>
                      <SelectItem value="months">months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </TooltipProvider>
      </SheetContent>
    </Sheet>
  );
}
