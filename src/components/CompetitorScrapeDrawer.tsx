import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Plus, X, Search } from "lucide-react";

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
  const [competitorSearch, setCompetitorSearch] = useState("");
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

  const removeCompetitor = (id: string) => {
    setCompetitors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: false } : c))
    );
  };

  const selectedCompetitors = competitors.filter((c) => c.selected);
  const selectedCount = selectedCompetitors.length;

  const unselectedCompetitors = useMemo(() => {
    return competitors.filter(
      (c) => !c.selected && c.name.toLowerCase().includes(competitorSearch.toLowerCase())
    );
  }, [competitors, competitorSearch]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[380px] sm:w-[420px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-base">Competitor Scrape — Settings</SheetTitle>
        </SheetHeader>

        {/* Competitor Selection - Badge tags + search popover (mirrors language selector) */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Competitors
            </Label>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedCompetitors.map((c) => (
              <Badge
                key={c.id}
                variant="secondary"
                className="gap-1.5 py-1 px-2.5 text-xs font-medium"
              >
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="h-3.5 w-3.5 rounded-full object-cover bg-muted shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&size=14&background=random`;
                  }}
                />
                {c.name}
                <button
                  onClick={() => removeCompetitor(c.id)}
                  className="shrink-0 hover:text-destructive transition-colors"
                  aria-label={`Remove ${c.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {/* Add competitor popover */}
            <Popover open={competitorPopoverOpen} onOpenChange={(open) => { setCompetitorPopoverOpen(open); if (!open) setCompetitorSearch(""); }}>
              <PopoverTrigger asChild>
                <button className="h-7 px-2.5 rounded-md border border-dashed border-muted-foreground/30 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Add
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="start">
                <div className="flex items-center gap-2 border-b pb-2 mb-1">
                  <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <input
                    value={competitorSearch}
                    onChange={(e) => setCompetitorSearch(e.target.value)}
                    placeholder="Search competitors..."
                    className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto space-y-0.5">
                  {unselectedCompetitors.length === 0 ? (
                    <p className="text-xs text-muted-foreground p-2 text-center">No competitors found</p>
                  ) : (
                    unselectedCompetitors.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => toggleCompetitor(c.id)}
                        className="w-full flex items-center gap-2.5 text-left text-sm px-2 py-1.5 rounded hover:bg-accent transition-colors"
                      >
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="h-5 w-5 rounded-full object-cover bg-muted shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&size=20&background=random`;
                          }}
                        />
                        {c.name}
                      </button>
                    ))
                  )}
                </div>
                <Separator className="my-1" />
                <button
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-accent transition-colors text-xs font-medium text-muted-foreground"
                  onClick={() => {
                    setCompetitorPopoverOpen(false);
                    setCompetitorSearch("");
                    onOpenChange(false);
                    navigate("/brand-data-room/competitors");
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Ad Competitors
                </button>
              </PopoverContent>
            </Popover>
          </div>
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
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed bg-foreground text-background border-foreground">
                  <p>Only include ads that have been active for at least this many days.</p>
                </TooltipContent>
              </Tooltip>
            </label>
            {daysActiveEnabled && (
              <Input
                type="number"
                min="0"
                value={minDaysActive}
                onChange={(e) => setMinDaysActive(e.target.value)}
                className="h-9 text-sm"
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={reachEnabled}
                onCheckedChange={(v) => setReachEnabled(!!v)}
              />
              <span className="text-xs text-muted-foreground">Min. estimated reach</span>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed bg-foreground text-background border-foreground">
                  <p>Only include ads with at least this estimated reach.</p>
                </TooltipContent>
              </Tooltip>
            </label>
            {reachEnabled && (
              <Input
                type="number"
                min="0"
                value={minReach}
                onChange={(e) => setMinReach(e.target.value)}
                className="h-9 text-sm"
              />
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
