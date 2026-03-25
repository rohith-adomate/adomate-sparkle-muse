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

import {
  Info, Plus, X, Search, ChevronDown, ChevronUp,
  ExternalLink, Eye, TrendingUp,
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

// Mock scraped ad data for the table
const MOCK_ADS = [
  { id: "1", brand: "CeraVe", headline: "Hydrating Facial Cleanser — Dermatologist Recommended", format: "Image", platform: "Facebook", firstLaunched: "2025-08-12", status: "Active", funnelStage: "TOFU", hook: "Dermatologists' #1 pick for daily cleansing", offerPresent: false, brandAlignment: 92, qualityScore: 88 },
  { id: "2", brand: "CeraVe", headline: "Moisturizing Cream for Dry Skin Relief", format: "Image", platform: "Instagram", firstLaunched: "2025-11-03", status: "Inactive", funnelStage: "MOFU", hook: "Stop suffering from dry skin this winter", offerPresent: true, brandAlignment: 78, qualityScore: 71 },
  { id: "3", brand: "The Ordinary", headline: "Niacinamide 10% + Zinc 1% — Target Blemishes", format: "Image", platform: "Facebook", firstLaunched: "2025-06-20", status: "Active", funnelStage: "TOFU", hook: "The viral serum that cleared my skin in 2 weeks", offerPresent: false, brandAlignment: 85, qualityScore: 94 },
  { id: "4", brand: "The Ordinary", headline: "AHA 30% + BHA 2% Peeling Solution", format: "Image", platform: "Instagram", firstLaunched: "2025-12-01", status: "Active", funnelStage: "MOFU", hook: "Professional-grade peel, at home", offerPresent: true, brandAlignment: 67, qualityScore: 82 },
  { id: "5", brand: "CeraVe", headline: "AM Facial Moisturizing Lotion with SPF 30", format: "Image", platform: "Facebook", firstLaunched: "2025-09-28", status: "Inactive", funnelStage: "BOFU", hook: "SPF + moisturizer in one step — save 5 min daily", offerPresent: true, brandAlignment: 91, qualityScore: 65 },
  { id: "6", brand: "The Ordinary", headline: "Hyaluronic Acid 2% + B5 — Intense Hydration", format: "Image", platform: "Instagram", firstLaunched: "2026-01-15", status: "Active", funnelStage: "TOFU", hook: "Why 10M people swear by this $7 serum", offerPresent: false, brandAlignment: 73, qualityScore: 79 },
  { id: "7", brand: "CeraVe", headline: "SA Smoothing Cleanser — Bumpy Skin", format: "Image", platform: "Facebook", firstLaunched: "2025-10-10", status: "Active", funnelStage: "MOFU", hook: "Finally smooth skin without irritation", offerPresent: false, brandAlignment: 88, qualityScore: 91 },
  { id: "8", brand: "The Ordinary", headline: "Retinol 0.5% in Squalane — Anti-Aging", format: "Image", platform: "Instagram", firstLaunched: "2026-02-05", status: "Inactive", funnelStage: "BOFU", hook: "Start retinol the right way — no peeling", offerPresent: true, brandAlignment: 54, qualityScore: 68 },
  { id: "9", brand: "CeraVe", headline: "Eye Repair Cream — Dark Circles", format: "Image", platform: "Instagram", firstLaunched: "2026-02-28", status: "Active", funnelStage: "MOFU", hook: "Dark circles? This cream works overnight", offerPresent: false, brandAlignment: 81, qualityScore: 76 },
  { id: "10", brand: "The Ordinary", headline: "Glycolic Acid 7% Toning Solution", format: "Image", platform: "Facebook", firstLaunched: "2026-02-18", status: "Active", funnelStage: "TOFU", hook: "The $9 toner that replaced my $60 one", offerPresent: false, brandAlignment: 69, qualityScore: 85 },
  { id: "11", brand: "CeraVe", headline: "Foaming Facial Cleanser — Oily Skin", format: "Image", platform: "Facebook", firstLaunched: "2026-03-04", status: "Inactive", funnelStage: "BOFU", hook: "Oil-free clean in 60 seconds", offerPresent: true, brandAlignment: 95, qualityScore: 42 },
  { id: "12", brand: "The Ordinary", headline: "Squalane Cleanser — Gentle Makeup Removal", format: "Image", platform: "Instagram", firstLaunched: "2026-03-01", status: "Active", funnelStage: "TOFU", hook: "Remove every trace of makeup — no tugging", offerPresent: false, brandAlignment: 62, qualityScore: 73 },
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
  const day = date.getDate().toString().padStart(2, "0");
  const mon = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${mon} ${year}`;
}

function daysOnline(d: string): number {
  const launched = new Date(d);
  const now = new Date("2026-03-12");
  return Math.max(0, Math.floor((now.getTime() - launched.getTime()) / (1000 * 60 * 60 * 24)));
}

function MiniSparkline({ data }: { data: number[] }) {
  if (data.length === 0) return <span className="text-[10px] text-muted-foreground">—</span>;
  const max = Math.max(...data);
  const h = 20;
  const w = 48;
  const points = data.map((v, i) => {
    const x = data.length === 1 ? w / 2 : (i / (data.length - 1)) * w;
    const y = max === 0 ? h / 2 : h - (v / max) * (h - 2);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline points={points} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DatasetDrawer({ open, onOpenChange }: DatasetDrawerProps) {
  const navigate = useNavigate();

  // Competitor state
  const [competitors, setCompetitors] = useState(MOCK_COMPETITORS);
  const [competitorPopoverOpen, setCompetitorPopoverOpen] = useState(false);
  const [competitorSearch, setCompetitorSearch] = useState("");

  // Filter state
  const [minDaysOnline, setMinDaysOnline] = useState("30");
  const [daysOnlineEnabled, setDaysOnlineEnabled] = useState(false);


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
    if (daysOnlineEnabled) {
      const min = parseInt(minDaysOnline) || 0;
      ads = ads.filter((ad) => daysOnline(ad.firstLaunched) >= min);
    }
    ads.sort((a, b) => daysOnline(b.firstLaunched) - daysOnline(a.firstLaunched));
    return ads;
  }, [selectedCompetitors, daysOnlineEnabled, minDaysOnline]);

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
          <div>
            <h2 className="text-sm font-bold">Dataset</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">Collection, enrichment and filtering of competitor ads — all in one place.</p>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0" onClick={() => onOpenChange(false)}>
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

            {/* Threshold */}
            <div className="space-y-2 pb-2">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Thresholds
              </Label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <Checkbox checked={daysOnlineEnabled} onCheckedChange={(v) => setDaysOnlineEnabled(!!v)} className="h-3.5 w-3.5" />
                <span className="text-[10px] text-muted-foreground">Min. days online</span>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Info className="h-2.5 w-2.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs text-[10px]">
                    Only include ads that have been online for at least this many days.
                  </TooltipContent>
                </Tooltip>
              </label>
              {daysOnlineEnabled && (
                <Input type="number" min="0" value={minDaysOnline} onChange={(e) => setMinDaysOnline(e.target.value)} className="h-8 text-xs" />
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
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-14 text-right">Days online</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-16">Status</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-16">Funnel</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider">Hook</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-14 text-center">Offer</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-20 text-right">Brand align.</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-20 text-right">Quality</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={14} className="text-center text-xs text-muted-foreground py-12">
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
                      <TableCell className="py-2 text-right text-[11px] text-muted-foreground tabular-nums">{daysOnline(ad.firstLaunched)}</TableCell>
                      <TableCell className="py-2">
                        <div className="flex items-center gap-1">
                          <div className={cn("h-1.5 w-1.5 rounded-full", ad.status === "Active" ? "bg-success" : "bg-muted-foreground/40")} />
                          <span className="text-[10px] text-muted-foreground">{ad.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge variant="outline" className="text-[9px] py-0 px-1.5 font-normal">{ad.funnelStage}</Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        <span className="text-[10px] text-muted-foreground line-clamp-1">{ad.hook}</span>
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        <div className={cn("h-2 w-2 rounded-full mx-auto", ad.offerPresent ? "bg-primary" : "bg-muted-foreground/20")} />
                      </TableCell>
                      <TableCell className="py-2 text-right text-[11px] tabular-nums">{ad.brandAlignment}%</TableCell>
                      <TableCell className="py-2 text-right text-[11px] tabular-nums">{ad.qualityScore}%</TableCell>
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
