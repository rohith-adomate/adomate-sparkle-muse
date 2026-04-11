import { useState, useCallback } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Loader2, Trash2, Check, RefreshCw, ExternalLink } from "lucide-react";
import { toast } from "sonner";

type ScrapingStatus = "scraping" | "ready" | "failed";
type ScrapingVariant = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type Competitor = {
  id: string;
  name: string;
  avatarUrl: string;
  pageId: string;
  lastUpdated: string;
  adsTracked: string;
  scrapingStatus: ScrapingStatus;
  scrapingVariant?: ScrapingVariant;
};

const initialCompetitors: Competitor[] = [
  { id: "1", name: "Canva Ads", avatarUrl: "https://logo.clearbit.com/canva.com", pageId: "284789375333902", lastUpdated: "4 Mar 2026", adsTracked: "185", scrapingStatus: "ready" },
  { id: "2", name: "Smartly.io", avatarUrl: "https://logo.clearbit.com/smartly.io", pageId: "959624700738003", lastUpdated: "3 Mar 2026", adsTracked: "200", scrapingStatus: "ready" },
  { id: "3", name: "AdCreative.ai", avatarUrl: "https://logo.clearbit.com/adcreative.ai", pageId: "355782130956396", lastUpdated: "—", adsTracked: "—", scrapingStatus: "failed" },
  { id: "v1", name: "Icon", avatarUrl: "https://logo.clearbit.com/icon.com", pageId: "111433260868447", lastUpdated: "—", adsTracked: "—", scrapingStatus: "scraping", scrapingVariant: 1 },
  { id: "v2", name: "Icon", avatarUrl: "https://logo.clearbit.com/icon.com", pageId: "211433260868447", lastUpdated: "—", adsTracked: "—", scrapingStatus: "scraping", scrapingVariant: 2 },
  { id: "v3", name: "Icon", avatarUrl: "https://logo.clearbit.com/icon.com", pageId: "311433260868447", lastUpdated: "—", adsTracked: "—", scrapingStatus: "scraping", scrapingVariant: 3 },
  { id: "v4", name: "Icon", avatarUrl: "https://logo.clearbit.com/icon.com", pageId: "411433260868447", lastUpdated: "—", adsTracked: "—", scrapingStatus: "scraping", scrapingVariant: 4 },
  { id: "v5", name: "Icon", avatarUrl: "https://logo.clearbit.com/icon.com", pageId: "511433260868447", lastUpdated: "—", adsTracked: "—", scrapingStatus: "scraping", scrapingVariant: 5 },
  { id: "v6", name: "Icon", avatarUrl: "https://logo.clearbit.com/icon.com", pageId: "611433260868447", lastUpdated: "—", adsTracked: "—", scrapingStatus: "scraping", scrapingVariant: 6 },
  { id: "v7", name: "Icon", avatarUrl: "https://logo.clearbit.com/icon.com", pageId: "711433260868447", lastUpdated: "—", adsTracked: "—", scrapingStatus: "scraping", scrapingVariant: 7 },
  { id: "v8", name: "Icon", avatarUrl: "https://logo.clearbit.com/icon.com", pageId: "811433260868447", lastUpdated: "—", adsTracked: "—", scrapingStatus: "scraping", scrapingVariant: 8 },
  { id: "v9", name: "Icon", avatarUrl: "https://logo.clearbit.com/icon.com", pageId: "911433260868447", lastUpdated: "—", adsTracked: "—", scrapingStatus: "scraping", scrapingVariant: 9 },
  { id: "v10", name: "Icon", avatarUrl: "https://logo.clearbit.com/icon.com", pageId: "011433260868447", lastUpdated: "—", adsTracked: "—", scrapingStatus: "scraping", scrapingVariant: 10 },
];

/* ─── Variant 1: Gradient shimmer bar + text ─── */
function ScrapingV1() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1">
      <div className="relative h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/60 via-primary to-primary/60 animate-[shimmer_1.5s_ease-in-out_infinite]" />
      </div>
      <span className="text-[10px] font-medium text-muted-foreground">Scraping…</span>
    </div>
  );
}

/* ─── Variant 2: Three bouncing dots + text ─── */
function ScrapingV2() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-primary"
          style={{ animation: `bounce-dot 1.4s ease-in-out ${i * 0.16}s infinite` }}
        />
      ))}
      <span className="text-[10px] font-medium text-muted-foreground ml-1">Scraping…</span>
    </div>
  );
}

/* ─── Variant 3: Rotating ring with gradient ─── */
function ScrapingV3() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
      <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="text-primary/20" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary" />
      </svg>
      <span className="text-[10px] font-medium text-primary">Scraping…</span>
    </div>
  );
}

/* ─── Variant 4: Progress wave (equalizer bars) ─── */
function ScrapingV4() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1">
      <div className="flex items-end gap-[2px] h-3">
        {[0, 1, 2, 3, 4].map(i => (
          <span
            key={i}
            className="w-[3px] rounded-full bg-primary"
            style={{ animation: `equalizer 1s ease-in-out ${i * 0.1}s infinite`, minHeight: "3px" }}
          />
        ))}
      </div>
      <span className="text-[10px] font-medium text-muted-foreground">Scraping…</span>
    </div>
  );
}

/* ─── Variant 5: Pulsing glow dot + text ─── */
function ScrapingV5() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
      </span>
      <span className="text-[10px] font-medium text-muted-foreground">Scraping…</span>
    </div>
  );
}

/* ─── Variant 6: Orbiting dots ─── */
function ScrapingV6() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent px-3 py-1">
      <div className="relative h-4 w-4">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-primary"
            style={{
              animation: `orbit 1.5s linear ${i * 0.5}s infinite`,
              top: "50%", left: "50%",
              transformOrigin: "0 0",
            }}
          />
        ))}
      </div>
      <span className="text-[10px] font-medium text-primary/80">Scraping…</span>
    </div>
  );
}

/* ─── Variant 7: Sliding gradient underline ─── */
function ScrapingV7() {
  return (
    <div className="inline-flex flex-col items-center gap-0.5">
      <span className="text-[10px] font-medium text-muted-foreground">Scraping…</span>
      <div className="relative h-[2px] w-14 rounded-full bg-muted overflow-hidden">
        <div className="absolute h-full w-6 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent animate-[slide-bar_1.2s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}

/* ─── Variant 8: Breathing badge ─── */
function ScrapingV8() {
  return (
    <Badge
      variant="outline"
      className="gap-1.5 text-[10px] font-medium border-primary/30 text-primary animate-[breathe_2s_ease-in-out_infinite]"
    >
      <div className="h-1.5 w-1.5 rounded-full bg-primary animate-[breathe_2s_ease-in-out_infinite]" />
      Scraping…
    </Badge>
  );
}

/* ─── Variant 9: Typewriter dots ─── */
function ScrapingV9() {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
      <Loader2 className="h-3 w-3 text-primary animate-[spin_2s_linear_infinite]" />
      <span className="text-[10px] font-medium text-primary tracking-wide animate-[typewriter-dots_1.5s_steps(4)_infinite]">
        Scraping<span className="inline-block w-[1em] text-left animate-[dots_1.5s_steps(4)_infinite]">...</span>
      </span>
    </div>
  );
}

/* ─── Variant 10: Neon outline pulse ─── */
function ScrapingV10() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 border border-primary/40 animate-[neon-pulse_2s_ease-in-out_infinite]">
      <svg className="h-3 w-3 text-primary" viewBox="0 0 24 24" fill="none">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-[spin_3s_linear_infinite] origin-center" />
      </svg>
      <span className="text-[10px] font-medium text-primary">Scraping…</span>
    </div>
  );
}

const scrapingVariants: Record<ScrapingVariant, () => JSX.Element> = {
  1: ScrapingV1, 2: ScrapingV2, 3: ScrapingV3, 4: ScrapingV4, 5: ScrapingV5,
  6: ScrapingV6, 7: ScrapingV7, 8: ScrapingV8, 9: ScrapingV9, 10: ScrapingV10,
};

function StatusChip({ status, onRetry, variant }: { status: ScrapingStatus; onRetry?: () => void; variant?: ScrapingVariant }) {
  if (status === "scraping") {
    const Variant = variant ? scrapingVariants[variant] : ScrapingV1;
    return <Variant />;
  }
  if (status === "ready") {
    return (
      <Badge variant="outline" className="gap-1 text-[10px] text-emerald-600 border-emerald-200 bg-emerald-50">
        <Check className="h-3 w-3" /> Ready
      </Badge>
    );
  }
  return (
    <Button variant="outline" size="sm" className="h-6 gap-1 text-[10px] text-destructive border-destructive/30 hover:bg-destructive/10" onClick={onRetry}>
      <RefreshCw className="h-3 w-3" /> Retry
    </Button>
  );
}

type SearchResult = { id: string; name: string; avatarUrl: string; category: string };

const mockSearch = (query: string): Promise<SearchResult[]> =>
  new Promise((resolve) =>
    setTimeout(() => {
      if (!query.trim()) return resolve([]);
      resolve([
        { id: `r-${Date.now()}-1`, name: `${query} - Official Page`, avatarUrl: `https://logo.clearbit.com/${query.toLowerCase().replace(/\s/g, "")}.com`, category: "Brand" },
        { id: `r-${Date.now()}-2`, name: `${query} Ads`, avatarUrl: `https://logo.clearbit.com/${query.toLowerCase().replace(/\s/g, "")}.com`, category: "Marketing" },
        { id: `r-${Date.now()}-3`, name: `${query} Global`, avatarUrl: `https://logo.clearbit.com/${query.toLowerCase().replace(/\s/g, "")}global.com`, category: "Brand" },
      ]);
    }, 800)
  );

export default function Competitors() {
  const [competitors, setCompetitors] = useState<Competitor[]>(initialCompetitors);

  const simulateScraping = useCallback((comp: Competitor) => {
    const delay = 3000 + Math.random() * 3000;
    setTimeout(() => {
      setCompetitors(prev => prev.map(c =>
        c.id === comp.id ? { ...c, scrapingStatus: "ready" as ScrapingStatus, lastUpdated: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), adsTracked: `${Math.floor(Math.random() * 150 + 50)}` } : c
      ));
      toast.success(`${comp.name} is ready`, { description: "Competitor data has been scraped successfully." });
    }, delay);
  }, []);

  const handleRetry = (id: string) => {
    setCompetitors(prev => prev.map(c => c.id === id ? { ...c, scrapingStatus: "scraping" as ScrapingStatus } : c));
    const comp = competitors.find(c => c.id === id);
    if (comp) simulateScraping({ ...comp, scrapingStatus: "scraping" });
  };
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setResults([]);
    const res = await mockSearch(searchQuery);
    setResults(res);
    setSearching(false);
  };

  const handleAdd = (result: SearchResult) => {
    const newComp: Competitor = {
      id: result.id,
      name: result.name,
      avatarUrl: result.avatarUrl,
      pageId: String(Math.floor(Math.random() * 900000000000000) + 100000000000000),
      lastUpdated: "—",
      adsTracked: "—",
      scrapingStatus: "scraping",
    };
    setCompetitors((prev) => [...prev, newComp]);
    simulateScraping(newComp);
    setOpen(false);
    setSearchQuery("");
    setResults([]);
  };

  const handleDelete = (id: string) => {
    setCompetitors((prev) => prev.filter((c) => c.id !== id));
  };

  const filtered = competitors.filter((c) =>
    c.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <Breadcrumbs items={[{ label: "Data Room", href: "/brand-data-room" }, { label: "Competitors" }]} />

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Competitors</h1>
        <p className="text-muted-foreground text-sm">Track competitors on Meta Ad Library.</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative max-w-[350px] w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search competitors..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setSearchQuery(""); setResults([]); } }}>
          <DialogTrigger asChild>
            <Button className="gap-1.5">
              <Plus className="h-4 w-4" /> Track New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Track New Competitor</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">Search for a brand to find its Facebook pages.</p>
            <div className="flex gap-2 mt-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search brand name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-9"
                />
              </div>
              <Button onClick={handleSearch} disabled={searching || !searchQuery.trim()} size="sm">
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
            </div>

            {searching && (
              <div className="flex items-center justify-center py-8 text-sm text-muted-foreground gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Searching Facebook pages...
              </div>
            )}

            {!searching && results.length > 0 && (
              <div className="mt-3 space-y-1 max-h-64 overflow-y-auto">
                {results.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleAdd(r)}
                    className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-muted transition-colors"
                  >
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

            {!searching && results.length === 0 && searchQuery && (
              <p className="text-center text-sm text-muted-foreground py-6">No results yet. Press Search or Enter.</p>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Competitor</TableHead>
              <TableHead>Page ID</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-center">Ads Tracked</TableHead>
              <TableHead className="text-center w-28">Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                  {filterQuery ? "No competitors match your search." : 'No competitors tracked yet. Click "Track New" to get started.'}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={c.avatarUrl} alt="" className="h-8 w-8 rounded-full bg-muted object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                      <span className="font-medium text-sm">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-mono">
                    <a
                      href={`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&view_all_page_id=${c.pageId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground underline hover:text-foreground transition-colors inline-flex items-center gap-1"
                    >
                      {c.pageId.slice(0, 8)}…
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.lastUpdated}</TableCell>
                  <TableCell className="text-sm text-muted-foreground text-center">{c.adsTracked}</TableCell>
                  <TableCell className="text-center">
                    <StatusChip status={c.scrapingStatus} onRetry={() => handleRetry(c.id)} />
                  </TableCell>
                  <TableCell>
                    {c.scrapingStatus !== "scraping" && (
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
