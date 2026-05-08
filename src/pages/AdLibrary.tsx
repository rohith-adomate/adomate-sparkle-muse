import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Search, CalendarIcon, Image as ImageIcon, Play, X, Filter, Bookmark, Link2, Sparkles, MessageCircle, Target, Compass, ExternalLink, Facebook, Instagram } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { oyAdImages } from "@/data/oyImages";
import type { DateRange } from "react-day-picker";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

type AdType = "image" | "video";
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
  const [tab, setTab] = useState<AdType>("image");
  const [brand, setBrand] = useState<string>("all");
  const [platform, setPlatform] = useState<string>("all");
  const [range, setRange] = useState<DateRange | undefined>();
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);

  const filtered = useMemo(() => {
    return ALL_ADS.filter((a) => a.type === tab)
      .filter((a) => (brand === "all" ? true : a.brand === brand))
      .filter((a) => (platform === "all" ? true : a.platform === platform))
      .filter((a) => {
        if (!range?.from) return true;
        const to = range.to ?? range.from;
        return a.date >= range.from && a.date <= to;
      })
      .filter((a) => (query ? a.copy.toLowerCase().includes(query.toLowerCase()) : true));
  }, [tab, brand, platform, range, query]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const resetFilters = () => {
    setBrand("all");
    setPlatform("all");
    setRange(undefined);
    setQuery("");
    setVisible(PAGE_SIZE);
  };

  const activeFilterCount =
    (brand !== "all" ? 1 : 0) + (platform !== "all" ? 1 : 0) + (range?.from ? 1 : 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Data Room", href: "/brand-data-room" },
          { label: "Ad Library" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ad Library</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Browse every ad in this library — {ALL_ADS.length} ads tracked across{" "}
            <Link to="/brand-data-room/competitors" className="text-primary hover:underline">
              {BRANDS.length} brands
            </Link>.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link to="/brand-data-room/competitors">
            <ExternalLink className="h-3.5 w-3.5" />
            Manage tracked brands
          </Link>
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => { setTab(v as AdType); setVisible(PAGE_SIZE); }}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <TabsList>
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

            <Select value={brand} onValueChange={(v) => { setBrand(v); setVisible(PAGE_SIZE); }}>
              <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Brand" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All brands</SelectItem>
                {BRANDS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={platform} onValueChange={(v) => { setPlatform(v); setVisible(PAGE_SIZE); }}>
              <SelectTrigger className="h-9 w-[130px]"><SelectValue placeholder="Platform" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All platforms</SelectItem>
                {PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>

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

function AdGrid({ ads }: { ads: Ad[] }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]">
      {ads.map((ad) => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </div>
  );
}

function AdCard({ ad }: { ad: Ad }) {
  return (
    <Card className="mb-4 break-inside-avoid overflow-hidden border-border/60 hover:shadow-lg transition-shadow group cursor-pointer">
      <div className="relative bg-muted" style={{ aspectRatio: ad.aspect }}>
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
          variant="secondary"
          className="absolute top-2 left-2 h-5 px-1.5 text-[10px] bg-background/90 backdrop-blur"
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
