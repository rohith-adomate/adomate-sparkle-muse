import { useState } from "react";
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
import { Plus, Search, Loader2 } from "lucide-react";

type Competitor = {
  id: string;
  name: string;
  avatarUrl: string;
  lastScraped: string;
  status: "success" | "pending";
};

const initialCompetitors: Competitor[] = [
  { id: "1", name: "Canva Ads", avatarUrl: "https://logo.clearbit.com/canva.com", lastScraped: "4 Mar 2026", status: "success" },
  { id: "2", name: "Smartly.io", avatarUrl: "https://logo.clearbit.com/smartly.io", lastScraped: "3 Mar 2026", status: "success" },
  { id: "3", name: "AdCreative.ai", avatarUrl: "https://logo.clearbit.com/adcreative.ai", lastScraped: "1 Mar 2026", status: "success" },
];

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
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
      lastScraped: "Not yet",
      status: "pending",
    };
    setCompetitors((prev) => [...prev, newComp]);
    setOpen(false);
    setSearchQuery("");
    setResults([]);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumbs items={[{ label: "Data Room", href: "/brand-data-room" }, { label: "Competitors" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Competitors</h1>
          <p className="text-muted-foreground text-sm">Track competitor ad activity from Meta.</p>
        </div>

        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setSearchQuery(""); setResults([]); } }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
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
              <TableHead>Last Scraped</TableHead>
              <TableHead className="w-24 text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {competitors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-12">
                  No competitors tracked yet. Click "Track New" to get started.
                </TableCell>
              </TableRow>
            ) : (
              competitors.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={c.avatarUrl} alt="" className="h-8 w-8 rounded-full bg-muted object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                      <span className="font-medium text-sm">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.lastScraped}</TableCell>
                  <TableCell className="text-center">
                    {c.status === "success" ? (
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" title="Scraped" />
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">Pending</Badge>
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
