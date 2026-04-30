import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Loader2, Check, ExternalLink, Plus, Trash2, AlertTriangle, Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import oyLogo from "@/assets/oy/oy-logo.png";
import AddReviewSourceModal, { type AddedSource } from "@/components/AddReviewSourceModal";

// ============================================================
// Types & data
// ============================================================
type Source = "Trustpilot" | "Amazon";
type RowStatus = "ready" | "syncing" | "no-products" | "failed";
type RegionLink = { code: string; flag: string; url: string };

type Row = {
  id: string;
  source: Source;
  productName?: string;
  url?: string;
  regions?: RegionLink[];
  reviews?: number;
  rating?: number;
  lastSyncedAt?: string;
  status: RowStatus;
};

type SourcePill = "all" | "trustpilot" | "amazon";
type StatusPill = "all" | "ready" | "failed";

const BRAND_NAME = "Oy Care";
const TP_URL = "https://www.trustpilot.com/review/oycare.com";

const STATE_READY: Row[] = [
  { id: "tp", source: "Trustpilot", url: TP_URL, reviews: 1240, rating: 4.6, lastSyncedAt: "4 Mar 2026", status: "ready" },
  { id: "az1", source: "Amazon", productName: "Vitamin C Serum", regions: [
    { code: "US", flag: "🇺🇸", url: "https://www.amazon.com/dp/B0VITC-US" },
    { code: "DE", flag: "🇩🇪", url: "https://www.amazon.de/dp/B0VITC-DE" },
  ], reviews: 1160, rating: 4.2, lastSyncedAt: "3 Mar 2026", status: "ready" },
  { id: "az2", source: "Amazon", productName: "Daily Boost Facewash", regions: [
    { code: "US", flag: "🇺🇸", url: "https://www.amazon.com/dp/B0DBF-US" },
  ], reviews: 412, rating: 4.5, lastSyncedAt: "3 Mar 2026", status: "ready" },
  { id: "az3", source: "Amazon", productName: "Acne Facewash", regions: [
    { code: "US", flag: "🇺🇸", url: "https://www.amazon.com/dp/B0ACNE-US" },
    { code: "DE", flag: "🇩🇪", url: "https://www.amazon.de/dp/B0ACNE-DE" },
  ], reviews: 685, rating: 4.0, lastSyncedAt: "2 Mar 2026", status: "ready" },
];

type BrandGroup = {
  id: string;
  name: string;
  isOwn?: boolean;
  initials: string;
  color: string;
  rows: Row[];
};

const OY_GROUP: BrandGroup = {
  id: "oy", name: BRAND_NAME, isOwn: true, initials: "OY", color: "hsl(var(--primary))",
  rows: STATE_READY,
};

// ============================================================
// Atoms
// ============================================================
function SourcePillCell({ source, url }: { source: Source; url?: string }) {
  const isTP = source === "Trustpilot";
  const dot = (
    <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", isTP ? "bg-emerald-500" : "bg-amber-500")} aria-hidden />
  );
  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline hover:text-foreground transition-colors"
      >
        {dot}
        {source}
        <ExternalLink className="h-3 w-3" />
      </a>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      {dot}
      {source}
    </span>
  );
}

function StatusBadge({ status }: { status: RowStatus }) {
  if (status === "ready") {
    return (
      <Badge variant="outline" className="gap-1 text-[10px] text-emerald-700 border-emerald-200 bg-emerald-50">
        <Check className="h-3 w-3" /> Ready
      </Badge>
    );
  }
  if (status === "syncing") {
    return (
      <Badge variant="outline" className="gap-1 text-[10px] text-muted-foreground border-border bg-muted/40">
        <Loader2 className="h-3 w-3 animate-spin" /> Syncing…
      </Badge>
    );
  }
  if (status === "failed") {
    return (
      <Badge variant="outline" className="gap-1 text-[10px] text-red-700 border-red-200 bg-red-50">
        <AlertTriangle className="h-3 w-3" /> Failed
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1 text-[10px] text-amber-700 border-amber-200 bg-amber-50">
      No products added
    </Badge>
  );
}

// ============================================================
// Main page
// ============================================================
export default function Reviews() {
  const [brandSearch, setBrandSearch] = useState<string>("");
  const [sourcePill, setSourcePill] = useState<SourcePill>("all");
  const [statusPill, setStatusPill] = useState<StatusPill>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [competitors, setCompetitors] = useState<BrandGroup[]>([]);

  const resolveRow = (brandId: string, rowId: string) => {
    const willFail = Math.random() < 0.1;
    setCompetitors(prev =>
      prev.map(g => {
        if (g.id !== brandId) return g;
        return {
          ...g,
          rows: g.rows.map(r => {
            if (r.id !== rowId) return r;
            if (willFail) return { ...r, status: "failed" as RowStatus };
            const reviews = r.source === "Trustpilot"
              ? 800 + Math.floor(Math.random() * 4000)
              : 200 + Math.floor(Math.random() * 1500);
            const rating = Math.round((3.6 + Math.random() * 1.3) * 10) / 10;
            const productName = r.source === "Amazon" && !r.productName
              ? `Product ${r.id.slice(-6).toUpperCase()}`
              : r.productName;
            return {
              ...r,
              status: "ready" as RowStatus,
              reviews,
              rating,
              productName,
              lastSyncedAt: "Today",
            };
          }),
        };
      }),
    );
  };

  const startSync = (brandId: string, rowId: string) => {
    window.setTimeout(() => resolveRow(brandId, rowId), 2200 + Math.random() * 1600);
  };

  const retryRow = (brandId: string, rowId: string) => {
    setCompetitors(prev =>
      prev.map(g =>
        g.id !== brandId
          ? g
          : { ...g, rows: g.rows.map(r => (r.id === rowId ? { ...r, status: "syncing" as RowStatus } : r)) },
      ),
    );
    startSync(brandId, rowId);
  };

  const handleAdd = (sources: AddedSource[]) => {
    const queue: { brandId: string; rowId: string }[] = [];
    setCompetitors(prev => {
      const map = new Map(prev.map(g => [g.id, { ...g, rows: [...g.rows] }]));
      sources.forEach((s, idx) => {
        const brandId = `${s.source.toLowerCase()}-${s.identifier.toLowerCase()}`;
        const displayName = s.source === "Trustpilot" ? s.identifier : "Amazon product";
        if (!map.has(brandId)) {
          const initials = displayName.slice(0, 2).toUpperCase();
          const palette = ["hsl(220 70% 55%)", "hsl(0 70% 55%)", "hsl(280 60% 55%)", "hsl(160 60% 45%)", "hsl(30 80% 55%)"];
          map.set(brandId, {
            id: brandId,
            name: displayName,
            initials,
            color: palette[map.size % palette.length],
            rows: [],
          });
        }
        const group = map.get(brandId)!;
        const rowId = `${brandId}-${idx}-${Date.now()}`;
        if (s.source === "Trustpilot") {
          group.rows.push({
            id: rowId,
            source: "Trustpilot",
            url: s.url,
            status: "syncing",
          });
        } else {
          group.rows.push({
            id: rowId,
            source: "Amazon",
            productName: undefined,
            regions: s.region
              ? [{ code: s.region.code, flag: s.region.flag, url: s.url }]
              : undefined,
            status: "syncing",
          });
        }
        queue.push({ brandId, rowId });
      });
      return Array.from(map.values());
    });
    queue.forEach(({ brandId, rowId }) => startSync(brandId, rowId));
  };

  type FlatRow = Row & {
    brandId: string;
    brandName: string;
    brandInitials: string;
    brandColor: string;
    isOwn: boolean;
  };

  const v2Groups = useMemo(() => [OY_GROUP, ...competitors], [competitors]);

  const flatRows = useMemo<FlatRow[]>(() => {
    const out: FlatRow[] = [];
    v2Groups.forEach(g => {
      g.rows.forEach(r => {
        const base = {
          brandId: g.id,
          brandName: g.name,
          brandInitials: g.initials,
          brandColor: g.color,
          isOwn: !!g.isOwn,
        };
        if (r.source === "Amazon" && r.regions && r.regions.length > 1) {
          r.regions.forEach(reg => {
            out.push({
              ...r,
              id: `${r.id}-${reg.code}`,
              regions: [reg],
              ...base,
            });
          });
        } else {
          out.push({ ...r, ...base });
        }
      });
    });
    return out;
  }, [v2Groups]);

  const filteredRows = useMemo(() => {
    const q = brandSearch.trim().toLowerCase();
    return flatRows.filter(r => {
      if (q && !r.brandName.toLowerCase().includes(q)) return false;
      if (sourcePill === "trustpilot" && r.source !== "Trustpilot") return false;
      if (sourcePill === "amazon" && r.source !== "Amazon") return false;
      if (statusPill === "ready" && r.status !== "ready") return false;
      if (statusPill === "failed" && r.status !== "failed") return false;
      return true;
    });
  }, [flatRows, brandSearch, sourcePill, statusPill]);

  const sortedRows = useMemo(() => {
    const copy = [...filteredRows];
    copy.sort((a, b) => {
      if (a.isOwn !== b.isOwn) return a.isOwn ? -1 : 1;
      const bn = a.brandName.localeCompare(b.brandName);
      if (bn !== 0) return bn;
      return (b.lastSyncedAt ?? "").localeCompare(a.lastSyncedAt ?? "");
    });
    return copy;
  }, [filteredRows]);

  const removeRow = (brandId: string, rowId: string) => {
    setCompetitors(prev =>
      prev
        .map(g => g.id === brandId ? { ...g, rows: g.rows.filter(r => r.id !== rowId) } : g)
        .filter(g => g.rows.length > 0),
    );
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <Breadcrumbs items={[{ label: "Data Room", href: "/brand-data-room" }, { label: "Reviews" }]} />

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground text-sm">
          Track reviews across Trustpilot and Amazon.
        </p>
      </div>

      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between gap-3">
          <div className="relative max-w-[350px] w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search brands..."
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Button onClick={() => setAddOpen(true)} className="gap-1.5 shrink-0">
            <Plus className="h-4 w-4" /> Track New
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px]">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Source:</span>
            {([
              ["all", "All"],
              ["trustpilot", "Trustpilot"],
              ["amazon", "Amazon"],
            ] as [SourcePill, string][]).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setSourcePill(k)}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 transition-colors",
                  sourcePill === k
                    ? "border-primary/40 bg-primary/[0.06] text-foreground"
                    : "border-border bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Status:</span>
            {([
              ["all", "All"],
              ["ready", "Ready"],
              ["failed", "Failed"],
            ] as [StatusPill, string][]).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setStatusPill(k)}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 transition-colors",
                  statusPill === k
                    ? "border-primary/40 bg-primary/[0.06] text-foreground"
                    : "border-border bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                {([
                  ["Brand", ""],
                  ["Product", ""],
                  ["Source", "w-[14%]"],
                  ["Region", "w-[10%]"],
                  ["Reviews", "text-right w-[10%]"],
                  ["Last Updated", "w-[14%]"],
                  ["Status", "w-[12%]"],
                ] as [string, string][]).map(([label, cls]) => (
                  <TableHead key={label} className={cls}>{label}</TableHead>
                ))}
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map(r => {
                const isTP = r.source === "Trustpilot";
                const itemLabel = isTP ? "Brand reviews" : (r.productName ?? "Amazon");
                return (
                  <TableRow key={`${r.brandId}-${r.id}`} className="group hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3 min-w-0">
                        {r.isOwn ? (
                          <img src={oyLogo} alt="" className="h-8 w-8 rounded-full bg-muted object-cover shrink-0" />
                        ) : (
                          <div
                            className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                            style={{ background: r.brandColor }}
                          >
                            {r.brandInitials}
                          </div>
                        )}
                        <span className="text-sm font-medium truncate">{r.brandName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[220px]">
                      {isTP ? (
                        <span>—</span>
                      ) : (
                        <span className="block truncate" title={itemLabel}>{itemLabel}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <SourcePillCell source={r.source} url={isTP ? r.url : r.regions?.[0]?.url} />
                    </TableCell>
                    <TableCell>
                      {isTP ? (
                        <span className="text-sm text-muted-foreground">—</span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          {r.regions?.map(reg => (
                            <span key={reg.code} title={reg.code} className="text-sm leading-none">
                              {reg.flag}
                            </span>
                          ))}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm text-muted-foreground">
                      {typeof r.reviews === "number" ? r.reviews.toLocaleString() : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.lastSyncedAt ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={r.status} />
                        {r.status === "failed" && !r.isOwn && (
                          <button
                            type="button"
                            onClick={() => retryRow(r.brandId, r.id)}
                            className="text-[11px] text-primary hover:text-primary/80 font-medium transition-colors"
                          >
                            Retry
                          </button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {!r.isOwn && (
                        <button
                          type="button"
                          onClick={() => removeRow(r.brandId, r.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          title="Remove source"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddReviewSourceModal open={addOpen} onOpenChange={setAddOpen} onAdd={handleAdd} />
    </div>
  );
}
