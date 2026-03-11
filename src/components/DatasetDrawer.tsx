import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Info, Plus, X, Search, ChevronDown, ChevronUp,
  Clock, ExternalLink, Eye, TrendingUp,
} from "lucide-react";

interface DatasetDrawerProps {
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
type RecurrenceType = "days" | "weeks" | "months" | "years";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

// Mock scraped ad data for the table
const MOCK_ADS = [
  // High reach (100K+)
  { id: "1", brand: "CeraVe", headline: "Hydrating Facial Cleanser — Dermatologist Recommended", format: "Image", platform: "Facebook", reach: 245000, firstLaunched: "2025-08-12", reach7d: 18000, reach30d: 67000, reach3m: 145000, reach12m: 245000, status: "Active" },
  { id: "2", brand: "CeraVe", headline: "Moisturizing Cream for Dry Skin Relief", format: "Image", platform: "Instagram", reach: 189000, firstLaunched: "2025-11-03", reach7d: 12000, reach30d: 54000, reach3m: 189000, reach12m: null, status: "Inactive" },
  { id: "3", brand: "The Ordinary", headline: "Niacinamide 10% + Zinc 1% — Target Blemishes", format: "Image", platform: "Facebook", reach: 312000, firstLaunched: "2025-06-20", reach7d: 9500, reach30d: 48000, reach3m: 178000, reach12m: 312000, status: "Active" },
  { id: "4", brand: "The Ordinary", headline: "AHA 30% + BHA 2% Peeling Solution", format: "Image", platform: "Instagram", reach: 198000, firstLaunched: "2025-12-01", reach7d: 8200, reach30d: 42000, reach3m: 198000, reach12m: null, status: "Active" },
  // Mid reach (10K–99K)
  { id: "5", brand: "CeraVe", headline: "AM Facial Moisturizing Lotion with SPF 30", format: "Image", platform: "Facebook", reach: 47000, firstLaunched: "2025-09-28", reach7d: 6200, reach30d: 21000, reach3m: 47000, reach12m: null, status: "Inactive" },
  { id: "6", brand: "The Ordinary", headline: "Hyaluronic Acid 2% + B5 — Intense Hydration", format: "Image", platform: "Instagram", reach: 23000, firstLaunched: "2026-01-15", reach7d: 4800, reach30d: 23000, reach3m: null, reach12m: null, status: "Active" },
  { id: "7", brand: "CeraVe", headline: "SA Smoothing Cleanser — Bumpy Skin", format: "Image", platform: "Facebook", reach: 68000, firstLaunched: "2025-10-10", reach7d: 8100, reach30d: 34000, reach3m: 68000, reach12m: null, status: "Active" },
  { id: "8", brand: "The Ordinary", headline: "Retinol 0.5% in Squalane — Anti-Aging", format: "Image", platform: "Instagram", reach: 15000, firstLaunched: "2026-02-05", reach7d: 3400, reach30d: 15000, reach3m: null, reach12m: null, status: "Inactive" },
  // Low reach (under 10K)
  { id: "9", brand: "CeraVe", headline: "Eye Repair Cream — Dark Circles", format: "Image", platform: "Instagram", reach: 4200, firstLaunched: "2026-02-28", reach7d: 1800, reach30d: null, reach3m: null, reach12m: null, status: "Active" },
  { id: "10", brand: "The Ordinary", headline: "Glycolic Acid 7% Toning Solution", format: "Image", platform: "Facebook", reach: 7300, firstLaunched: "2026-02-18", reach7d: 2900, reach30d: null, reach3m: null, reach12m: null, status: "Active" },
  { id: "11", brand: "CeraVe", headline: "Foaming Facial Cleanser — Oily Skin", format: "Image", platform: "Facebook", reach: 1850, firstLaunched: "2026-03-04", reach7d: 620, reach30d: null, reach3m: null, reach12m: null, status: "Inactive" },
  { id: "12", brand: "The Ordinary", headline: "Squalane Cleanser — Gentle Makeup Removal", format: "Image", platform: "Instagram", reach: 3100, firstLaunched: "2026-03-01", reach7d: 980, reach30d: null, reach3m: null, reach12m: null, status: "Active" },
];

function formatReach(n: number | null): string {
  if (n == null) return "—";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function formatDate(d: string | null): string {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function DatasetDrawer({ open, onOpenChange }: DatasetDrawerProps) {
  const navigate = useNavigate();

  // Competitor state
  const [competitors, setCompetitors] = useState(MOCK_COMPETITORS);
  const [competitorPopoverOpen, setCompetitorPopoverOpen] = useState(false);
  const [competitorSearch, setCompetitorSearch] = useState("");

  // Filter state
  const [maxAds, setMaxAds] = useState("10");
  const [minReach, setMinReach] = useState("1000");
  const [reachEnabled, setReachEnabled] = useState(false);
  const [periodType, setPeriodType] = useState<PeriodType>("all-time");
  const [lastXValue, setLastXValue] = useState("30");
  const [lastXUnit, setLastXUnit] = useState<PeriodUnit>("days");

  // Schedule state
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("weeks");
  const [interval, setScheduleInterval] = useState(1);
  const [weekDays, setWeekDays] = useState<string[]>(["Mon"]);

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
  const unselectedCompetitors = useMemo(() => {
    return competitors.filter(
      (c) => !c.selected && c.name.toLowerCase().includes(competitorSearch.toLowerCase())
    );
  }, [competitors, competitorSearch]);

  // Filter ads based on selected competitors & settings
  const filteredAds = useMemo(() => {
    const selectedNames = new Set(selectedCompetitors.map((c) => c.name));
    let ads = MOCK_ADS.filter((ad) => selectedNames.has(ad.brand));
    if (reachEnabled) {
      const min = parseInt(minReach) || 0;
      ads = ads.filter((ad) => ad.reach >= min);
    }
    ads.sort((a, b) => b.reach - a.reach);
    const max = parseInt(maxAds) || 10;
    return ads.slice(0, max);
  }, [selectedCompetitors, reachEnabled, minReach, maxAds]);

  if (!open) return null;

  return (
    <TooltipProvider>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Bottom drawer */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-2xl",
          "transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full"
        )}
        style={{ height: "70vh", minHeight: 400 }}
      >
        {/* Handle bar */}
        <div className="flex items-center justify-center py-2 cursor-grab">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-3">
          <h2 className="text-sm font-bold">Dataset</h2>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onOpenChange(false)}>
            <ChevronDown className="h-3.5 w-3.5 mr-1" /> Close
          </Button>
        </div>

        <Separator />

        {/* Content: two columns */}
        <div className="flex h-[calc(100%-56px)] overflow-hidden">
          {/* Left: Settings panel */}
          <div className="w-80 shrink-0 border-r border-border overflow-y-auto p-5 space-y-2">

            {/* ── SECTION: Sources ── */}
            <p className="text-[9px] font-bold uppercase tracking-widest text-primary/70 mb-1">Sources</p>
            <div className="space-y-2.5 pb-4">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Competitors
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {selectedCompetitors.map((c) => (
                  <Badge key={c.id} variant="secondary" className="gap-1 py-0.5 px-2 text-[11px]">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="h-3.5 w-3.5 rounded-full object-cover bg-muted shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&size=14&background=random`;
                      }}
                    />
                    {c.name}
                    <button onClick={() => removeCompetitor(c.id)} className="shrink-0 hover:text-destructive transition-colors" aria-label={`Remove ${c.name}`}>
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))}
                <Popover open={competitorPopoverOpen} onOpenChange={(o) => { setCompetitorPopoverOpen(o); if (!o) setCompetitorSearch(""); }}>
                  <PopoverTrigger asChild>
                    <button className="h-6 px-2 rounded-md border border-dashed border-muted-foreground/30 text-[10px] text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center gap-0.5">
                      <Plus className="h-2.5 w-2.5" /> Add
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2" align="start">
                    <div className="flex items-center gap-2 border-b pb-2 mb-1">
                      <Search className="h-3 w-3 text-muted-foreground shrink-0" />
                      <input value={competitorSearch} onChange={(e) => setCompetitorSearch(e.target.value)} placeholder="Search..." className="flex-1 text-xs bg-transparent outline-none placeholder:text-muted-foreground" autoFocus />
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-0.5">
                      {unselectedCompetitors.length === 0 ? (
                        <p className="text-[10px] text-muted-foreground p-2 text-center">No competitors found</p>
                      ) : (
                        unselectedCompetitors.map((c) => (
                          <button key={c.id} onClick={() => toggleCompetitor(c.id)} className="w-full flex items-center gap-2 text-left text-xs px-2 py-1.5 rounded hover:bg-accent transition-colors">
                            <img src={c.avatar} alt={c.name} className="h-4 w-4 rounded-full object-cover bg-muted shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&size=16&background=random`; }} />
                            {c.name}
                          </button>
                        ))
                      )}
                    </div>
                    <Separator className="my-1" />
                    <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent transition-colors text-[10px] font-medium text-muted-foreground" onClick={() => { setCompetitorPopoverOpen(false); setCompetitorSearch(""); onOpenChange(false); navigate("/brand-data-room/competitors"); }}>
                      <Plus className="h-3 w-3" /> Manage Competitors
                    </button>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Separator />

            {/* ── SECTION: Filtering ── */}
            <p className="text-[9px] font-bold uppercase tracking-widest text-primary/70 pt-3 mb-1">Filtering</p>

            {/* Time Period */}
            <div className="space-y-2 pb-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1 cursor-help">
                    Time period
                    <Info className="h-2.5 w-2.5" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[200px] text-[10px]">
                  The time period in which the ad has been launched.
                </TooltipContent>
              </Tooltip>
              <div className="flex items-center gap-1">
                {(["all-time", "last-week", "last-x"] as PeriodType[]).map((type) => (
                  <div
                    key={type}
                    className={cn(
                      "flex-1 rounded-md border px-2 py-1.5 text-center cursor-pointer transition-colors text-[10px] font-medium",
                      periodType === type
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:bg-muted/40"
                    )}
                    onClick={() => setPeriodType(type)}
                  >
                    {type === "all-time" ? "All time" : type === "last-week" ? "Last week" : "Last X"}
                  </div>
                ))}
              </div>
              {periodType === "last-x" && (
                <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/20 p-2">
                  <span className="text-[10px] text-muted-foreground shrink-0">Last</span>
                  <Input type="number" min="1" value={lastXValue} onChange={(e) => setLastXValue(e.target.value)} className="h-7 text-xs w-14" />
                  <Select value={lastXUnit} onValueChange={(v) => setLastXUnit(v as PeriodUnit)}>
                    <SelectTrigger className="h-7 text-[10px] w-[80px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">days</SelectItem>
                      <SelectItem value="weeks">weeks</SelectItem>
                      <SelectItem value="months">months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Threshold */}
            <div className="space-y-2 pb-2">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Thresholds
              </Label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <Checkbox checked={reachEnabled} onCheckedChange={(v) => setReachEnabled(!!v)} className="h-3.5 w-3.5" />
                <span className="text-[10px] text-muted-foreground">Min. estimated reach</span>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Info className="h-2.5 w-2.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs text-[10px]">
                    Only include ads with at least this estimated reach.
                  </TooltipContent>
                </Tooltip>
              </label>
              {reachEnabled && (
                <Input type="number" min="0" value={minReach} onChange={(e) => setMinReach(e.target.value)} className="h-8 text-xs" />
              )}
            </div>

            <Separator />

            {/* ── SECTION: Generation ── */}
            <p className="text-[9px] font-bold uppercase tracking-widest text-primary/70 pt-3 mb-1">Generation</p>

            {/* Top ads to select */}
            <div className="space-y-2 pb-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1 cursor-help">
                    Top ads to select
                    <Info className="h-2.5 w-2.5" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[200px] text-[10px]">
                  The best ads across all selected competitors combined.
                </TooltipContent>
              </Tooltip>
              <Input type="number" min="1" max="100" value={maxAds} onChange={(e) => setMaxAds(e.target.value)} className="h-8 text-xs" />
            </div>

            {/* Schedule */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" /> Schedule
              </Label>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground shrink-0">Every</span>
                <Input
                  type="number"
                  min={1}
                  max={99}
                  value={interval}
                  onChange={(e) => setScheduleInterval(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 h-7 text-center text-xs"
                />
                <Select value={recurrenceType} onValueChange={(v) => setRecurrenceType(v as RecurrenceType)}>
                  <SelectTrigger className="h-7 flex-1 text-[10px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Day(s)</SelectItem>
                    <SelectItem value="weeks">Week(s)</SelectItem>
                    <SelectItem value="months">Month(s)</SelectItem>
                    <SelectItem value="years">Year(s)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {recurrenceType === "weeks" && (
                <ToggleGroup type="multiple" value={weekDays} onValueChange={(v) => setWeekDays(v.length > 0 ? v : weekDays)} className="flex flex-wrap gap-0.5">
                  {DAYS_OF_WEEK.map((day) => (
                    <ToggleGroupItem key={day} value={day} className="h-6 w-8 text-[9px] font-medium rounded data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                      {day}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
            </div>
          </div>

          {/* Right: Excel-like table */}
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-12">Preview</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-8">#</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-28">Brand</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider">Headline</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-16">Format</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-24">Platform</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-24">First launched</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-20 text-right">
                    <span className="inline-flex items-center gap-1"><TrendingUp className="h-2.5 w-2.5" /> Reach</span>
                  </TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-16 text-right">+7d</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-16 text-right">+30d</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-16 text-right">+3m</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-16 text-right">+12m</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-16">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={13} className="text-center text-xs text-muted-foreground py-12">
                      No ads match the current filters. Try adjusting competitors or thresholds.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAds.map((ad, idx) => (
                    <TableRow key={ad.id} className="group hover:bg-muted/20">
                      <TableCell className="py-1.5">
                        <div className="w-8 rounded overflow-hidden bg-muted" style={{ aspectRatio: "4/5" }}>
                          <img src="/placeholder.svg" alt="Ad preview" className="w-full h-full object-cover" />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 text-[10px] text-muted-foreground font-mono">{idx + 1}</TableCell>
                      <TableCell className="py-2">
                        <span className="text-[11px] font-medium truncate">{ad.brand}</span>
                      </TableCell>
                      <TableCell className="py-2">
                        <span className="text-[11px] line-clamp-1">{ad.headline}</span>
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge variant="outline" className="text-[9px] py-0 px-1.5 font-normal">
                          {ad.format}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 text-[11px] text-muted-foreground">{ad.platform}</TableCell>
                      <TableCell className="py-2 text-[11px] text-muted-foreground">{formatDate(ad.firstLaunched)}</TableCell>
                      <TableCell className="py-2 text-right text-[11px] font-medium tabular-nums">{formatReach(ad.reach)}</TableCell>
                      <TableCell className="py-2 text-right text-[11px] text-muted-foreground tabular-nums">{formatReach(ad.reach7d)}</TableCell>
                      <TableCell className="py-2 text-right text-[11px] text-muted-foreground tabular-nums">{formatReach(ad.reach30d)}</TableCell>
                      <TableCell className="py-2 text-right text-[11px] text-muted-foreground tabular-nums">{formatReach(ad.reach3m)}</TableCell>
                      <TableCell className="py-2 text-right text-[11px] text-muted-foreground tabular-nums">{formatReach(ad.reach12m)}</TableCell>
                      <TableCell className="py-2">
                        <div className="flex items-center gap-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-success" />
                          <span className="text-[10px] text-muted-foreground">{ad.status}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
