import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Loader2, Trash2, Check, RefreshCw, ExternalLink, Facebook, Instagram } from "lucide-react";
import { toast } from "sonner";

type ScrapingStatus = "scraping" | "ready" | "failed";

type SocialInfo = {
  fbHandle?: string;
  fbFollowers?: string;
  igHandle?: string;
  igFollowers?: string;
};

type Competitor = {
  id: string;
  name: string;
  avatarUrl: string;
  pageId: string;
  lastUpdated: string;
  adsTracked: string;
  scrapingStatus: ScrapingStatus;
  social?: SocialInfo;
};

const initialCompetitors: Competitor[] = [
  { id: "1", name: "Canva Ads", avatarUrl: "https://logo.clearbit.com/canva.com", pageId: "284789375333902", lastUpdated: "4 Mar 2026", adsTracked: "185", scrapingStatus: "ready", social: { fbHandle: "canva", fbFollowers: "4.2M", igHandle: "canva", igFollowers: "1.8M" } },
  { id: "2", name: "Smartly.io", avatarUrl: "https://logo.clearbit.com/smartly.io", pageId: "959624700738003", lastUpdated: "3 Mar 2026", adsTracked: "200", scrapingStatus: "ready", social: { fbHandle: "smartlyio", fbFollowers: "12K", igHandle: undefined, igFollowers: undefined } },
  { id: "3", name: "AdCreative.ai", avatarUrl: "https://logo.clearbit.com/adcreative.ai", pageId: "355782130956396", lastUpdated: "—", adsTracked: "—", scrapingStatus: "failed", social: { fbHandle: "adcreativeai", fbFollowers: "85K", igHandle: "adcreative.ai", igFollowers: "22K" } },
  { id: "4", name: "Icon", avatarUrl: "https://logo.clearbit.com/icon.com", pageId: "111433260868447", lastUpdated: "—", adsTracked: "5", scrapingStatus: "scraping", social: undefined },
];

function StatusChip({ status, onRetry }: { status: ScrapingStatus; onRetry?: () => void }) {
  const base = "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium";

  if (status === "scraping") {
    return (
      <span className={`${base} text-muted-foreground border-border bg-muted/30`}>
        <Loader2 className="h-3 w-3 animate-spin" />
        Scraping…
      </span>
    );
  }
  if (status === "ready") {
    return (
      <span className={`${base} text-emerald-600 border-emerald-200 bg-emerald-50`}>
        <Check className="h-3 w-3" />
        Ready
      </span>
    );
  }
  return (
    <button onClick={onRetry} className={`${base} text-destructive border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors cursor-pointer`}>
      <RefreshCw className="h-3 w-3" />
      Retry
    </button>
  );
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

  const searchDialog = (
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
  );

  const hasSocial = (s?: SocialInfo) => s && (s.fbHandle || s.igHandle);

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <Breadcrumbs items={[{ label: "Data Room", href: "/brand-data-room" }, { label: "Competitors" }]} />

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Competitors</h1>
        <p className="text-muted-foreground text-sm">Track competitors on Meta Ad Library.</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative max-w-[350px] w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search competitors..." value={filterQuery} onChange={(e) => setFilterQuery(e.target.value)} className="pl-9" />
        </div>
        {searchDialog}
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Competitor</TableHead>
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
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
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
                  <TableCell>
                    {hasSocial(c.social) ? (
                      <div className="flex flex-col gap-0.5">
                        {c.social?.fbHandle && (
                          <SocialBadge icon={Facebook} handle={c.social.fbHandle} followers={c.social.fbFollowers!} />
                        )}
                        {c.social?.igHandle && (
                          <SocialBadge icon={Instagram} handle={c.social.igHandle} followers={c.social.igFollowers!} />
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm font-mono">
                    <a href={`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&view_all_page_id=${c.pageId}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground underline hover:text-foreground transition-colors inline-flex items-center gap-1">
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
                  <TableCell className="text-center">
                    <StatusChip status={c.scrapingStatus} onRetry={() => handleRetry(c.id)} />
                  </TableCell>
                  <TableCell>
                    {c.scrapingStatus !== "scraping" && (
                      <button onClick={() => handleDelete(c.id)} className="text-muted-foreground hover:text-destructive transition-colors">
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
