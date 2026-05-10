import { useMemo, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Search, CalendarIcon, Image as ImageIcon, Play, X, Filter, Sparkles, MessageCircle, Target, Compass, ExternalLink, Facebook, Instagram, Info, Loader2, Check, RefreshCw, Plus, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { oyAdImages } from "@/data/oyImages";
import type { DateRange } from "react-day-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

type AdType = "image" | "video";
type TabValue = "all" | AdType;
type Platform = "Meta" | "TikTok" | "YouTube" | "Reddit";

interface Ad {
  id: string;
  type: AdType;
  brand: string;
  advertiser: string;
  copy: string;
  date: Date;
  platform: Platform;
  src: string;
  poster?: string;
  aspect: number; // width / height
}

const BRANDS = ["Oy Care", "Wellow", "Bloom Naturals", "Pure Co."];
const PLATFORMS: Platform[] = ["Meta", "TikTok", "YouTube", "Reddit"];
const COPIES = [
  "Sleep deeper. Wake brighter. Your nightly ritual reimagined.",
  "Skin that glows from within — clinically proven, pediatrician approved.",
  "Tired of midday crashes? Meet the clean energy your body deserves.",
  "One scoop. Five adaptogens. Endless calm.",
  "The bedtime drink moms swear by. (And dads steal at 11pm.)",
  "Made for sensitive skin. Loved by everyone.",
  "Stop guessing. Start glowing.",
  "Real ingredients. Real results. No fluff.",
];
const ASPECTS = [1, 4 / 5, 9 / 16, 16 / 9, 1, 4 / 5, 9 / 16];

// Sample royalty-free vertical / landscape video posters via Coverr-like static placeholders.
const SAMPLE_VIDEOS = [
  { src: "https://cdn.coverr.co/videos/coverr-pouring-coffee-1573/1080p.mp4", aspect: 16 / 9 },
  { src: "https://cdn.coverr.co/videos/coverr-a-woman-running-on-the-beach-5244/1080p.mp4", aspect: 9 / 16 },
  { src: "https://cdn.coverr.co/videos/coverr-skincare-routine-2633/1080p.mp4", aspect: 1 },
  { src: "https://cdn.coverr.co/videos/coverr-yoga-on-the-beach-7689/1080p.mp4", aspect: 9 / 16 },
  { src: "https://cdn.coverr.co/videos/coverr-a-bottle-of-perfume-2825/1080p.mp4", aspect: 4 / 5 },
];

function seedAds(): Ad[] {
  const out: Ad[] = [];
  const today = new Date();
  for (let i = 0; i < 48; i++) {
    const isVideo = i % 4 === 0;
    const date = new Date(today);
    date.setDate(today.getDate() - i * 2);
    if (isVideo) {
      const v = SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length];
      out.push({
        id: `ad-${i}`,
        type: "video",
        brand: BRANDS[i % BRANDS.length],
        advertiser: BRANDS[i % BRANDS.length],
        copy: COPIES[i % COPIES.length],
        date,
        platform: PLATFORMS[i % PLATFORMS.length],
        src: v.src,
        aspect: v.aspect,
      });
    } else {
      out.push({
        id: `ad-${i}`,
        type: "image",
        brand: BRANDS[i % BRANDS.length],
        advertiser: BRANDS[i % BRANDS.length],
        copy: COPIES[i % COPIES.length],
        date,
        platform: PLATFORMS[i % PLATFORMS.length],
        src: oyAdImages[i % oyAdImages.length],
        aspect: ASPECTS[i % ASPECTS.length],
      });
    }
  }
  return out;
}

const ALL_ADS = seedAds();
const PAGE_SIZE = 12;

const BRAND_META: Record<string, { industry: string; domain: string }> = {
  "Oy Care": { industry: "Baby & Family", domain: "oycare.com" },
  "Wellow": { industry: "Wellness", domain: "wellow.com" },
  "Bloom Naturals": { industry: "Beauty", domain: "bloomnaturals.com" },
  "Pure Co.": { industry: "Skincare", domain: "pureco.com" },
};

export default function AdLibrary() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const brandParam = searchParams.get("brand") ?? undefined;

  if (!brandParam) {
    return <BrandsListView onSelect={(b) => navigate(`/brand-data-room/ad-library?brand=${encodeURIComponent(b)}`)} />;
  }

  return <BrandAdsView brandParam={brandParam} />;
}

function BrandAdsView({ brandParam }: { brandParam: string }) {
  const [tab, setTab] = useState<TabValue>("all");
  const [range, setRange] = useState<DateRange | undefined>();
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);

  // When viewing a single brand, override advertiser/brand on the mock ads
  // so the page looks populated for any tracked brand.
  const sourceAds = useMemo(() => {
    if (!brandParam) return ALL_ADS;
    return ALL_ADS.map((a) => ({ ...a, brand: brandParam, advertiser: brandParam }));
  }, [brandParam]);

  const filtered = useMemo(() => {
    return sourceAds.filter((a) => (tab === "all" ? true : a.type === tab))
      .filter((a) => {
        if (!range?.from) return true;
        const to = range.to ?? range.from;
        return a.date >= range.from && a.date <= to;
      })
      .filter((a) => (query ? a.copy.toLowerCase().includes(query.toLowerCase()) : true));
  }, [sourceAds, tab, range, query]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const resetFilters = () => {
    setRange(undefined);
    setQuery("");
    setVisible(PAGE_SIZE);
  };

  const activeFilterCount = (range?.from ? 1 : 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Breadcrumbs
        items={
          brandParam
            ? [
                { label: "Data Room", href: "/brand-data-room" },
                { label: "Ad Library", href: "/brand-data-room/ad-library" },
                { label: brandParam },
              ]
            : [
                { label: "Data Room", href: "/brand-data-room" },
                { label: "Ad Library" },
              ]
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {brandParam ? `${brandParam} — Ads` : "Ad Library"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {brandParam ? (
              <>Browsing {sourceAds.length} ads tracked for <span className="text-foreground font-medium">{brandParam}</span>.</>
            ) : (
              <>
                Browse every ad in this library — {ALL_ADS.length} ads tracked across{" "}
                <Link to="/brand-data-room/competitors" className="text-primary hover:underline">
                  {BRANDS.length} brands
                </Link>.
              </>
            )}
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link to="/brand-data-room/competitors">
            <ExternalLink className="h-3.5 w-3.5" />
            {brandParam ? "Back to brands" : "Manage tracked brands"}
          </Link>
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => { setTab(v as TabValue); setVisible(PAGE_SIZE); }}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <TabsList>
            <TabsTrigger value="all" className="gap-1.5">
              All
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                {ALL_ADS.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="image" className="gap-1.5">
              <ImageIcon className="h-3.5 w-3.5" />
              Image ads
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                {ALL_ADS.filter((a) => a.type === "image").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="video" className="gap-1.5">
              <Play className="h-3.5 w-3.5" />
              Video ads
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                {ALL_ADS.filter((a) => a.type === "video").length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
                placeholder="Search ad copy..."
                className="pl-8 h-9 w-44"
              />
            </div>



            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1.5 font-normal">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {range?.from
                    ? range.to
                      ? `${format(range.from, "MMM d")} – ${format(range.to, "MMM d")}`
                      : format(range.from, "MMM d, yyyy")
                    : "Date range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={range}
                  onSelect={(r) => { setRange(r); setVisible(PAGE_SIZE); }}
                  numberOfMonths={2}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" className="h-9 gap-1" onClick={resetFilters}>
                <X className="h-3.5 w-3.5" />
                Clear
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <AdGrid ads={shown} onSelect={setSelectedAd} />
        </TabsContent>
        <TabsContent value="image" className="mt-6">
          <AdGrid ads={shown} onSelect={setSelectedAd} />
        </TabsContent>
        <TabsContent value="video" className="mt-6">
          <AdGrid ads={shown} onSelect={setSelectedAd} />
        </TabsContent>
      </Tabs>

      <AdDetailDialog ad={selectedAd} onClose={() => setSelectedAd(null)} />

      {filtered.length === 0 && (
        <div className="text-center py-16 border border-dashed rounded-lg">
          <Filter className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm font-medium">No ads match these filters</p>
          <p className="text-xs text-muted-foreground mt-1">Try clearing filters or switching tabs.</p>
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            Load more ({filtered.length - visible} remaining)
          </Button>
        </div>
      )}

      {!hasMore && filtered.length > PAGE_SIZE && (
        <p className="text-center text-xs text-muted-foreground pt-2">
          You've reached the end — {filtered.length} ads shown.
        </p>
      )}
    </div>
  );
}

type ScrapingStatus = "scraping" | "ready" | "failed";
type SocialInfo = { fbHandle?: string; fbFollowers?: string; igHandle?: string; igFollowers?: string };
type TrackedBrand = {
  id: string;
  name: string;
  avatarUrl: string;
  pageId: string;
  lastUpdated: string;
  adsTracked: string;
  scrapingStatus: ScrapingStatus;
  social?: SocialInfo;
};

const initialBrands: TrackedBrand[] = [
  { id: "1", name: "Canva Ads", avatarUrl: "https://logo.clearbit.com/canva.com", pageId: "284789375333902", lastUpdated: "4 Mar 2026", adsTracked: "185", scrapingStatus: "ready", social: { fbHandle: "canva", fbFollowers: "4.2M", igHandle: "canva", igFollowers: "1.8M" } },
  { id: "2", name: "Smartly.io", avatarUrl: "https://logo.clearbit.com/smartly.io", pageId: "959624700738003", lastUpdated: "3 Mar 2026", adsTracked: "200", scrapingStatus: "ready", social: { fbHandle: "smartlyio", fbFollowers: "12K" } },
  { id: "3", name: "AdCreative.ai", avatarUrl: "https://logo.clearbit.com/adcreative.ai", pageId: "355782130956396", lastUpdated: "—", adsTracked: "—", scrapingStatus: "failed", social: { fbHandle: "adcreativeai", fbFollowers: "85K", igHandle: "adcreative.ai", igFollowers: "22K" } },
  { id: "4", name: "Icon", avatarUrl: "https://logo.clearbit.com/icon.com", pageId: "111433260868447", lastUpdated: "—", adsTracked: "5", scrapingStatus: "scraping" },
];

function StatusChip({ status, onRetry }: { status: ScrapingStatus; onRetry?: () => void }) {
  const base = "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium";
  if (status === "scraping") return <span className={`${base} text-muted-foreground border-border bg-muted/30`}><Loader2 className="h-3 w-3 animate-spin" />Scraping…</span>;
  if (status === "ready") return <span className={`${base} text-emerald-600 border-emerald-200 bg-emerald-50`}><Check className="h-3 w-3" />Ready</span>;
  return <button onClick={onRetry} className={`${base} text-destructive border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors cursor-pointer`}><RefreshCw className="h-3 w-3" />Retry</button>;
}

function SocialBadge({ icon: Icon, handle, followers }: { icon: React.ElementType; handle: string; followers: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
      <Icon className="h-3 w-3" />
      <span className="font-medium text-foreground/80">@{handle}</span>
      <span className="text-muted-foreground/60">·</span>
      <span>{followers}</span>
    </span>
  );
}

type SearchResult = { id: string; name: string; avatarUrl: string; category: string };
const mockSearch = (q: string): Promise<SearchResult[]> =>
  new Promise((resolve) => setTimeout(() => {
    if (!q.trim()) return resolve([]);
    const slug = q.toLowerCase().replace(/\s/g, "");
    resolve([
      { id: `r-${Date.now()}-1`, name: `${q} - Official Page`, avatarUrl: `https://logo.clearbit.com/${slug}.com`, category: "Brand" },
      { id: `r-${Date.now()}-2`, name: `${q} Ads`, avatarUrl: `https://logo.clearbit.com/${slug}.com`, category: "Marketing" },
      { id: `r-${Date.now()}-3`, name: `${q} Global`, avatarUrl: `https://logo.clearbit.com/${slug}global.com`, category: "Brand" },
    ]);
  }, 800));

function BrandsListView({ onSelect }: { onSelect: (brand: string) => void }) {
  const [brands, setBrands] = useState<TrackedBrand[]>(initialBrands);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const simulateScraping = useCallback((b: TrackedBrand) => {
    setTimeout(() => {
      setBrands(prev => prev.map(c => c.id === b.id ? { ...c, scrapingStatus: "ready", lastUpdated: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), adsTracked: `${Math.floor(Math.random() * 150 + 50)}` } : c));
      toast.success(`${b.name} is ready`, { description: "Brand data has been scraped successfully." });
    }, 3000 + Math.random() * 3000);
  }, []);

  const handleRetry = (id: string) => {
    setBrands(prev => prev.map(c => c.id === id ? { ...c, scrapingStatus: "scraping" } : c));
    const b = brands.find(c => c.id === id);
    if (b) simulateScraping({ ...b, scrapingStatus: "scraping" });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true); setResults([]);
    setResults(await mockSearch(searchQuery));
    setSearching(false);
  };

  const handleAdd = (r: SearchResult) => {
    const nb: TrackedBrand = { id: r.id, name: r.name, avatarUrl: r.avatarUrl, pageId: String(Math.floor(Math.random() * 9e14) + 1e14), lastUpdated: "—", adsTracked: "—", scrapingStatus: "scraping" };
    setBrands(prev => [...prev, nb]);
    simulateScraping(nb);
    setOpen(false); setSearchQuery(""); setResults([]);
  };

  const handleDelete = (id: string) => setBrands(prev => prev.filter(c => c.id !== id));
  const hasSocial = (s?: SocialInfo) => s && (s.fbHandle || s.igHandle);
  const filtered = brands.filter(c => c.name.toLowerCase().includes(filterQuery.toLowerCase()));

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <Breadcrumbs items={[{ label: "Data Room", href: "/brand-data-room" }, { label: "Ad Library" }]} />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ad Library</h1>
        <p className="text-muted-foreground text-sm">Track brands on Meta Ad Library. Click a brand to view its ads.</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative max-w-[350px] w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search brands..." value={filterQuery} onChange={(e) => setFilterQuery(e.target.value)} className="pl-9" />
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setSearchQuery(""); setResults([]); } }}>
          <DialogTrigger asChild>
            <Button className="gap-1.5"><Plus className="h-4 w-4" /> Track New</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Track New Brand</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground">Search for a brand to find its Facebook pages.</p>
            <div className="flex gap-2 mt-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search brand name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} className="pl-9" />
              </div>
              <Button onClick={handleSearch} disabled={searching || !searchQuery.trim()} size="sm">
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
            </div>
            {searching && (<div className="flex items-center justify-center py-8 text-sm text-muted-foreground gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Searching Facebook pages...</div>)}
            {!searching && results.length > 0 && (
              <div className="mt-3 space-y-1 max-h-64 overflow-y-auto">
                {results.map((r) => (
                  <button key={r.id} onClick={() => handleAdd(r)} className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-muted transition-colors">
                    <img src={r.avatarUrl} alt="" className="h-8 w-8 rounded-full bg-muted object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.category}</p>
                    </div>
                    <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            )}
            {!searching && results.length === 0 && searchQuery && (<p className="text-center text-sm text-muted-foreground py-6">No results yet. Press Search or Enter.</p>)}
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Socials</TableHead>
              <TableHead>Page ID</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-center">Ads Tracked</TableHead>
              <TableHead className="text-center w-28">Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-12">{filterQuery ? "No brands match your search." : 'No brands tracked yet. Click "Track New" to get started.'}</TableCell></TableRow>
            ) : filtered.map((c) => (
              <TableRow
                key={c.id}
                onClick={() => c.scrapingStatus === "ready" && onSelect(c.name)}
                className={c.scrapingStatus === "ready" ? "cursor-pointer hover:bg-muted/40" : ""}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={c.avatarUrl} alt="" className="h-8 w-8 rounded-full bg-muted object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                    <span className="font-medium text-sm">{c.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {hasSocial(c.social) ? (
                    <div className="flex flex-col gap-0.5">
                      {c.social?.fbHandle && (<SocialBadge icon={Facebook} handle={c.social.fbHandle} followers={c.social.fbFollowers!} />)}
                      {c.social?.igHandle && (<SocialBadge icon={Instagram} handle={c.social.igHandle} followers={c.social.igFollowers!} />)}
                    </div>
                  ) : (<span className="text-xs text-muted-foreground/50">—</span>)}
                </TableCell>
                <TableCell className="text-sm font-mono">
                  <a onClick={(e) => e.stopPropagation()} href={`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&view_all_page_id=${c.pageId}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground underline hover:text-foreground transition-colors inline-flex items-center gap-1">
                    {c.pageId.slice(0, 8)}…
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.lastUpdated}</TableCell>
                <TableCell className="text-sm text-muted-foreground text-center">
                  {c.scrapingStatus === "scraping" ? (
                    <div className="inline-flex flex-col items-center gap-0.5">
                      <span>{c.adsTracked}</span>
                      <div className="relative h-[2px] w-8 rounded-full bg-muted overflow-hidden">
                        <div className="absolute h-full w-4 rounded-full bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-[slide-bar_1.2s_ease-in-out_infinite]" />
                      </div>
                    </div>
                  ) : c.adsTracked}
                </TableCell>
                <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                  <StatusChip status={c.scrapingStatus} onRetry={() => handleRetry(c.id)} />
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {c.scrapingStatus !== "scraping" && (
                    <button onClick={() => handleDelete(c.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function AdGrid({ ads, onSelect }: { ads: Ad[]; onSelect: (ad: Ad) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {ads.map((ad) => (
        <AdCard key={ad.id} ad={ad} onSelect={onSelect} />
      ))}
    </div>
  );
}

function AdCard({ ad, onSelect }: { ad: Ad; onSelect: (ad: Ad) => void }) {
  return (
    <Card
      onClick={() => onSelect(ad)}
      className="overflow-hidden border-border/60 hover:shadow-lg transition-shadow group cursor-pointer flex flex-col h-full"
    >
      <div className="relative bg-muted aspect-square">
        {ad.type === "image" ? (
          <img
            src={ad.src}
            alt={ad.copy}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <video
              src={ad.src}
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
              onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play().catch(() => {})}
              onMouseLeave={(e) => (e.currentTarget as HTMLVideoElement).pause()}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
              <div className="h-10 w-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center shadow">
                <Play className="h-4 w-4 fill-foreground text-foreground ml-0.5" />
              </div>
            </div>
          </>
        )}
        <Badge
          className="absolute top-2 left-2 h-5 px-1.5 text-[10px] bg-primary/90 text-primary-foreground hover:bg-primary backdrop-blur border-0"
        >
          {ad.platform}
        </Badge>
      </div>
      <div className="p-3 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold truncate">{ad.advertiser}</p>
          <span className="text-[11px] text-muted-foreground shrink-0">
            {format(ad.date, "MMM d")}
          </span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">{ad.copy}</p>
      </div>
    </Card>
  );
}

function AdDetailDialog({ ad, onClose }: { ad: Ad | null; onClose: () => void }) {
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  if (!ad) return null;
  const meta = BRAND_META[ad.brand] ?? { industry: "—", domain: "example.com" };
  const daysActive = Math.max(1, Math.floor((Date.now() - ad.date.getTime()) / 86400000));
  const initials = ad.brand.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Dialog open={!!ad} onOpenChange={(o) => { if (!o) { setShowInfoPanel(false); onClose(); } }}>
      <DialogContent
        className="max-w-5xl w-[calc(100vw-8rem)] h-[90vh] max-h-[90vh] p-0 overflow-hidden rounded-xl border-0 gap-0 [&>button]:hidden"
        aria-label={ad.copy}
        aria-describedby={undefined}
      >
        <div className="flex h-full relative">
          {/* Media area — dark canvas with native social-post card */}
          <div className={`relative bg-neutral-900 flex items-start justify-center overflow-y-auto transition-all duration-300 ${showInfoPanel ? "w-[60%]" : "w-full"}`}>
            {/* Top overlay actions */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setShowInfoPanel((v) => !v)}
                    className={`h-9 w-9 rounded-full flex items-center justify-center transition-all ${
                      showInfoPanel
                        ? "bg-white text-neutral-900"
                        : "bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50 hover:text-white"
                    }`}
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Ad details</TooltipContent>
              </Tooltip>
            </div>

            {/* Native ad post card — preserves original aspect ratio */}
            <div className="my-8 w-full max-w-[440px] mx-6 bg-background rounded-xl shadow-2xl overflow-hidden flex flex-col">
              {/* Post header */}
              <div className="flex items-center gap-2.5 px-3.5 py-3">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-tight truncate">{ad.advertiser}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <span>Sponsored</span>
                    <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground" />
                    <span>{format(ad.date, "MMM d")}</span>
                  </p>
                </div>
              </div>

              {/* Copy */}
              {ad.copy && (
                <div className="px-3.5 pb-3 space-y-1.5">
                  <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
                    {ad.copy}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {ad.platform}
                  </p>
                </div>
              )}

              {/* Media in original ratio */}
              <div className="w-full bg-muted" style={{ aspectRatio: ad.aspect }}>
                {ad.type === "image" ? (
                  <img src={ad.src} alt={ad.copy} className="w-full h-full object-cover block" />
                ) : (
                  <video src={ad.src} controls autoPlay loop playsInline className="w-full h-full object-cover block" />
                )}
              </div>

              {/* CTA strip */}
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-muted/40 border-t border-border/60">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{meta.domain}</p>
                  <p className="text-[12px] font-semibold truncate">Shop now</p>
                </div>
                <Button size="sm" variant="secondary" className="h-7 text-xs">Learn more</Button>
              </div>
            </div>
          </div>

          {/* Sliding details panel */}
          <div className={`flex flex-col bg-background overflow-y-auto transition-all duration-300 ${showInfoPanel ? "w-[40%]" : "w-0 overflow-hidden"}`}>
            <div className="min-w-[320px]">
              <div className="px-5 py-4 flex items-center justify-between border-b border-border/50">
                <h3 className="text-sm font-medium text-foreground">Details</h3>
                <button
                  onClick={() => setShowInfoPanel(false)}
                  className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-5 py-4 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight truncate">{ad.advertiser}</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active for {daysActive}d
                    </p>
                  </div>
                </div>

                <p className="text-[12px] text-muted-foreground leading-relaxed bg-muted/50 rounded-lg p-3 border border-border/50">
                  {ad.copy}
                </p>

                <div className="space-y-3">
                  <DetailRow label="Brand" value={
                    <Link to="/brand-data-room/competitors" className="flex items-center gap-2 hover:underline">
                      <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[9px] font-semibold">{initials}</span>
                      {ad.brand}
                    </Link>
                  } />
                  <DetailRow label="Industry" value={<span>{meta.industry}</span>} />
                  <DetailRow label="Date seen" value={<span>{format(ad.date, "MMM d, yyyy")}</span>} />
                  <DetailRow label="Landing page" value={
                    <a href={`https://${meta.domain}`} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate inline-block max-w-[180px]">
                      {meta.domain}
                    </a>
                  } />
                  <DetailRow label="Platforms" value={
                    <span className="flex items-center gap-1.5">
                      <Facebook className="h-4 w-4 text-[#1877F2]" />
                      <Instagram className="h-4 w-4 text-[#E4405F]" />
                      <span className="text-xs text-muted-foreground">+{ad.platform}</span>
                    </span>
                  } />
                  <DetailRow label="Visual format" value={
                    <span className="flex items-center gap-1.5">
                      {ad.type === "image" ? <ImageIcon className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-pink-100 text-pink-700 hover:bg-pink-100">
                        {ad.type === "image" ? "Image" : "Video"}
                      </Badge>
                    </span>
                  } />
                </div>

                <div className="pt-3 border-t border-border space-y-2">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-semibold">Thought starters</h4>
                    <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-purple-100 text-purple-700 hover:bg-purple-100">
                      <Sparkles className="h-2.5 w-2.5 mr-1" />AI
                    </Badge>
                  </div>
                  <ThoughtItem icon={Search} label="Break down what makes this ad work" />
                  <ThoughtItem icon={Target} label="Who is this ad speaking to?" />
                  <ThoughtItem icon={Compass} label="Create testable variations" />
                  <ThoughtItem icon={MessageCircle} label="Ask me anything" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-center gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="text-sm">{value}</div>
    </div>
  );
}

function ThoughtItem({ icon: Icon, label }: { icon: typeof Search; label: string }) {
  return (
    <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-muted text-left text-sm">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span>{label}</span>
    </button>
  );
}
