import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ChevronDown, CheckCircle2, Clock, ExternalLink, Info, Image,
  Package, Sparkles, Database, ListFilter, ImagePlus, XCircle,
  AlertTriangle, Filter, Hash, BarChart3, Eye,
} from "lucide-react";

/* ── Execution mock data types ── */

export interface WorkflowRun {
  id: string;
  number: number;
  status: "success" | "failed" | "running";
  startedAt: string;
  duration: string;
  nodeStatuses: Record<string, "success" | "error" | "running">;
}

export interface RunNodeOutput {
  type: string;
  label: string;
  status: "success" | "error" | "running";
}

/* ── Mock execution runs ── */

export const MOCK_RUNS: WorkflowRun[] = [
  {
    id: "exec-13", number: 13, status: "success", startedAt: "18 Mar 2026 · 09:00", duration: "2m 14s",
    nodeStatuses: { "n0": "success", "n1": "success", "n3": "success", "n2b": "success", "n5": "success" },
  },
  {
    id: "exec-12", number: 12, status: "failed", startedAt: "17 Mar 2026 · 09:00", duration: "1m 42s",
    nodeStatuses: { "n0": "success", "n1": "success", "n3": "success", "n2b": "success", "n5": "error" },
  },
  {
    id: "exec-11", number: 11, status: "success", startedAt: "16 Mar 2026 · 09:00", duration: "2m 08s",
    nodeStatuses: { "n0": "success", "n1": "success", "n3": "success", "n2b": "success", "n5": "success" },
  },
  {
    id: "exec-10", number: 10, status: "success", startedAt: "15 Mar 2026 · 09:00", duration: "1m 55s",
    nodeStatuses: { "n0": "success", "n1": "success", "n3": "success", "n2b": "success", "n5": "success" },
  },
  {
    id: "exec-9", number: 9, status: "failed", startedAt: "14 Mar 2026 · 09:00", duration: "0m 32s",
    nodeStatuses: { "n0": "success", "n1": "error", "n3": "error", "n2b": "success", "n5": "error" },
  },
  {
    id: "exec-8", number: 8, status: "success", startedAt: "13 Mar 2026 · 09:00", duration: "2m 21s",
    nodeStatuses: { "n0": "success", "n1": "success", "n3": "success", "n2b": "success", "n5": "success" },
  },
  {
    id: "exec-7", number: 7, status: "success", startedAt: "12 Mar 2026 · 09:00", duration: "1m 48s",
    nodeStatuses: { "n0": "success", "n1": "success", "n3": "success", "n2b": "success", "n5": "success" },
  },
];

export const MOCK_MANUAL_RUNS: WorkflowRun[] = [
  {
    id: "mexec-5", number: 5, status: "success", startedAt: "18 Mar 2026 · 11:32", duration: "1m 45s",
    nodeStatuses: { "n0": "success", "n1": "success", "n2": "success" },
  },
  {
    id: "mexec-4", number: 4, status: "success", startedAt: "17 Mar 2026 · 14:10", duration: "1m 22s",
    nodeStatuses: { "n0": "success", "n1": "success", "n2": "success" },
  },
  {
    id: "mexec-3", number: 3, status: "failed", startedAt: "16 Mar 2026 · 10:05", duration: "0m 48s",
    nodeStatuses: { "n0": "success", "n1": "success", "n2": "error" },
  },
];

/* ── Drawer width config per node type ── */

const DRAWER_WIDTHS: Record<string, string> = {
  schedule:             "w-[340px]",
  dataset:              "w-[400px]",
  "product-data":       "w-[440px]",
  "top-select":         "w-[560px]",
  "generate-concepts":  "w-[520px]",
  "manual-image-input": "w-[420px]",
};

const DEFAULT_WIDTH = "w-[420px]";

/* ── Per-node output content ── */

interface RunOutputPanelProps {
  open: boolean;
  onClose: () => void;
  node: RunNodeOutput | null;
  runNumber?: number;
}

/* ── Shared stat card ── */
function StatCard({ icon: IconComp, label, children, accent }: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <IconComp className="h-3 w-3 text-muted-foreground" />
        <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
      <div className={cn("text-xs font-medium", accent)}>{children}</div>
    </div>
  );
}

/* Schedule output — Split Card (Variation 4) */
function ScheduleOutput() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-lg border border-border bg-muted/30 p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
        </div>
        <p className="text-sm font-medium text-emerald-600">Triggered successfully</p>
      </div>
      <div className="rounded-lg border border-border bg-muted/30 p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Run Started</span>
        </div>
        <p className="text-sm font-medium text-foreground">18 Mar 2026 · 09:00 AM</p>
      </div>
    </div>
  );
}

/* Dataset output */
function DatasetOutput() {
  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-3 gap-2.5">
        <StatCard icon={Filter} label="Competitors">
          <div className="flex flex-wrap gap-1 mt-0.5">
            <Badge variant="secondary" className="text-[9px] gap-1 py-0 h-5">
              <img src="https://logo.clearbit.com/cerave.com" alt="" className="h-3 w-3 rounded-full" /> CeraVe
            </Badge>
            <Badge variant="secondary" className="text-[9px] gap-1 py-0 h-5">
              <img src="https://logo.clearbit.com/theordinary.com" alt="" className="h-3 w-3 rounded-full" /> The Ordinary
            </Badge>
          </div>
        </StatCard>
        <StatCard icon={Clock} label="Time range">
          Last 30 days
        </StatCard>
        <StatCard icon={BarChart3} label="Min. reach">
          1,000 impressions
        </StatCard>
      </div>
      <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs"><span className="font-semibold">12 ads</span> matched filters <span className="text-muted-foreground">(of 48 total scraped)</span></span>
        </div>
        <Badge variant="outline" className="text-[9px]">Full view coming soon</Badge>
      </div>
    </div>
  );
}

/* Select output */
const SELECTED_ADS = [
  { id: 1, brand: "CeraVe", headline: "Hydrating Facial Cleanser — Dermatologist Recommended", reach: "245K", ctr: "3.2%", spend: "$1.2K" },
  { id: 2, brand: "The Ordinary", headline: "Niacinamide 10% + Zinc 1% — Target Blemishes", reach: "312K", ctr: "4.1%", spend: "$980" },
  { id: 3, brand: "The Ordinary", headline: "AHA 30% + BHA 2% Peeling Solution", reach: "198K", ctr: "2.8%", spend: "$760" },
  { id: 4, brand: "CeraVe", headline: "Moisturizing Cream for Dry Skin Relief", reach: "189K", ctr: "3.5%", spend: "$1.1K" },
  { id: 5, brand: "CeraVe", headline: "AM Facial Moisturizing Lotion with SPF 30", reach: "47K", ctr: "2.1%", spend: "$420" },
  { id: 6, brand: "CeraVe", headline: "SA Smoothing Cleanser — Bumpy Skin", reach: "68K", ctr: "2.6%", spend: "$550" },
  { id: 7, brand: "The Ordinary", headline: "Hyaluronic Acid 2% + B5 — Intense Hydration", reach: "23K", ctr: "1.9%", spend: "$310" },
  { id: 8, brand: "The Ordinary", headline: "Retinol 0.5% in Squalane — Anti-Aging", reach: "15K", ctr: "1.4%", spend: "$280" },
  { id: 9, brand: "CeraVe", headline: "Eye Repair Cream — Dark Circles", reach: "4.2K", ctr: "0.8%", spend: "$120" },
  { id: 10, brand: "The Ordinary", headline: "Glycolic Acid 7% Toning Solution", reach: "7.3K", ctr: "1.1%", spend: "$190" },
];

function SelectOutput() {
  return (
    <div className="space-y-2.5">
      {/* Settings row */}
      <div className="flex items-center gap-3">
        <div className="rounded-lg border border-border bg-card px-3 py-2 flex items-center gap-2">
          <Hash className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Count:</span>
          <span className="text-xs font-semibold">Top 10</span>
        </div>
        <div className="rounded-lg border border-border bg-card px-3 py-2 flex items-center gap-2">
          <BarChart3 className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Ranked by:</span>
          <span className="text-xs font-semibold">New Reach</span>
        </div>
        <div className="rounded-lg border border-border bg-card px-3 py-2 flex items-center gap-2">
          <Database className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Source:</span>
          <span className="text-xs font-semibold">12 ads from Dataset</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="h-7 text-[9px] font-bold uppercase tracking-wider w-8">#</TableHead>
              <TableHead className="h-7 text-[9px] font-bold uppercase tracking-wider w-20">Brand</TableHead>
              <TableHead className="h-7 text-[9px] font-bold uppercase tracking-wider">Headline</TableHead>
              <TableHead className="h-7 text-[9px] font-bold uppercase tracking-wider w-16 text-right">Reach</TableHead>
              <TableHead className="h-7 text-[9px] font-bold uppercase tracking-wider w-14 text-right">CTR</TableHead>
              <TableHead className="h-7 text-[9px] font-bold uppercase tracking-wider w-16 text-right">Spend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SELECTED_ADS.map((ad, idx) => (
              <TableRow key={ad.id} className={cn("hover:bg-muted/20", idx % 2 === 0 && "bg-muted/10")}>
                <TableCell className="py-1.5 text-[10px] text-muted-foreground font-mono">{ad.id}</TableCell>
                <TableCell className="py-1.5">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={`https://logo.clearbit.com/${ad.brand === "CeraVe" ? "cerave.com" : "theordinary.com"}`}
                      alt=""
                      className="h-3.5 w-3.5 rounded-full"
                    />
                    <span className="text-[10px] font-medium">{ad.brand}</span>
                  </div>
                </TableCell>
                <TableCell className="py-1.5 text-[10px] max-w-[300px] truncate">{ad.headline}</TableCell>
                <TableCell className="py-1.5 text-[10px] text-right font-semibold">{ad.reach}</TableCell>
                <TableCell className="py-1.5 text-[10px] text-right text-muted-foreground">{ad.ctr}</TableCell>
                <TableCell className="py-1.5 text-[10px] text-right text-muted-foreground">{ad.spend}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* Product Data output */
const SELECTED_PRODUCTS = [
  {
    name: "Hydra Glow Serum",
    sku: "HGS-001",
    images: 1,
    imageSeeds: ["prod-0a"],
    knowledge: "Lightweight hydrating serum with hyaluronic acid for daily use. Targets young professionals aged 22–35. Key claims: 48hr hydration, non-comedogenic, fragrance-free.",
  },
  {
    name: "Retinol Night Recovery Mask",
    sku: "RNR-042",
    images: 3,
    imageSeeds: ["prod-1a", "prod-1b", "prod-1c"],
    knowledge: "Premium night recovery mask with 0.3% retinol. Anti-aging focus, 35+ demographic. Claims: reduces fine lines in 4 weeks, dermatologist tested.",
  },
];

function ProductDataOutput() {
  return (
    <div className="space-y-2">
      {SELECTED_PRODUCTS.map((p, i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-start gap-3">
            {/* Product images */}
            <div className="flex gap-1.5 shrink-0">
              {p.imageSeeds.map((seed, j) => (
                <div key={j} className="h-12 w-12 rounded-md overflow-hidden bg-muted border border-border">
                  <img
                    src={`https://picsum.photos/seed/${seed}/96/96`}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold">{p.name}</p>
                <Badge variant="outline" className="text-[8px] py-0 px-1.5 font-mono">{p.sku}</Badge>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant="secondary" className="text-[9px] gap-0.5 py-0 h-5">
                  <Image className="h-2.5 w-2.5" /> {p.images} image{p.images !== 1 ? "s" : ""}
                </Badge>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <button className="text-[9px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5 underline underline-offset-2 decoration-dashed">
                      <Info className="h-2.5 w-2.5" /> View knowledge context
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[300px] text-[10px] leading-relaxed">
                    {p.knowledge}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* Generate Ad Variations output */
const GENERATED_CONCEPTS = [
  { id: "c1", title: "Bold Statement", seed: "bold-statement", rating: 4.2 },
  { id: "c2", title: "Social Proof UGC", seed: "social-proof", rating: 3.8 },
  { id: "c3", title: "Gradient Pop", seed: "gradient-pop", rating: 4.5 },
  { id: "c4", title: "Street Style", seed: "street-style", rating: 3.1 },
];

function GenerateVariationsOutput() {
  const navigate = useNavigate();
  const [previewIdx, setPreviewIdx] = useState(0);

  return (
    <div className="flex gap-4">
      {/* Left: settings summary */}
      <div className="w-48 shrink-0 space-y-2">
        <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Generation settings</p>
        <div className="space-y-1.5">
          <div className="rounded-md border border-border bg-card px-2.5 py-1.5">
            <p className="text-[9px] text-muted-foreground">Concepts per image</p>
            <p className="text-xs font-semibold">6</p>
          </div>
          <div className="rounded-md border border-border bg-card px-2.5 py-1.5">
            <p className="text-[9px] text-muted-foreground">Visual similarity</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-1/2 rounded-full bg-primary" />
              </div>
              <span className="text-[9px] font-medium">Medium</span>
            </div>
          </div>
          <div className="rounded-md border border-border bg-card px-2.5 py-1.5">
            <p className="text-[9px] text-muted-foreground">Messaging similarity</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-1/2 rounded-full bg-primary" />
              </div>
              <span className="text-[9px] font-medium">Medium</span>
            </div>
          </div>
          <div className="rounded-md border border-border bg-card px-2.5 py-1.5">
            <p className="text-[9px] text-muted-foreground">Total generated</p>
            <p className="text-xs font-semibold">24 concepts</p>
          </div>
        </div>
      </div>

      {/* Right: preview grid */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Preview (4 of 24)</p>
          <Button
            variant="outline"
            size="sm"
            className="h-6 text-[10px] gap-1"
            onClick={() => navigate("/concepts/competitor-ad-variation-1")}
          >
            <ExternalLink className="h-3 w-3" /> View all concepts
          </Button>
        </div>

        {/* Main preview */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="aspect-[16/9] relative bg-muted">
            <img
              src={`https://picsum.photos/seed/${GENERATED_CONCEPTS[previewIdx].seed}/640/360`}
              alt={GENERATED_CONCEPTS[previewIdx].title}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 py-2.5">
              <p className="text-xs font-semibold text-white">{GENERATED_CONCEPTS[previewIdx].title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-white/70">Rating: {GENERATED_CONCEPTS[previewIdx].rating}/5</span>
                <button
                  onClick={() => navigate("/concepts/competitor-ad-variation-1")}
                  className="text-[10px] text-white/90 hover:text-white underline underline-offset-2 flex items-center gap-0.5"
                >
                  <Eye className="h-2.5 w-2.5" /> View detail
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex items-center gap-1.5">
          {GENERATED_CONCEPTS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setPreviewIdx(i)}
              className={cn(
                "h-12 w-12 rounded-md overflow-hidden border-2 transition-all shrink-0",
                i === previewIdx ? "border-primary ring-2 ring-primary/20 scale-105" : "border-border opacity-50 hover:opacity-100"
              )}
            >
              <img
                src={`https://picsum.photos/seed/${c.seed}/96/96`}
                alt={c.title}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Manual Image Input output */
function ManualInputOutput() {
  const images = [
    { src: "https://picsum.photos/seed/manual-1/200/200", name: "hero-shot.jpg", size: "1.2 MB" },
    { src: "https://picsum.photos/seed/manual-2/200/200", name: "lifestyle-02.png", size: "890 KB" },
    { src: "https://picsum.photos/seed/manual-3/200/200", name: "product-flat.jpg", size: "2.1 MB" },
  ];

  return (
    <div className="space-y-2.5">
      <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 flex items-center gap-2">
        <ImagePlus className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs"><span className="font-semibold">{images.length} images</span> uploaded at runtime</span>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {images.map((img, i) => (
          <div key={i} className="rounded-lg border border-border bg-card overflow-hidden group">
            <div className="aspect-square bg-muted">
              <img src={img.src} alt={img.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="px-2 py-1.5">
              <p className="text-[10px] font-medium truncate">{img.name}</p>
              <p className="text-[9px] text-muted-foreground">{img.size}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Node type icon map ── */
const NODE_ICONS: Record<string, typeof Clock> = {
  schedule: Clock,
  dataset: Database,
  "product-data": Package,
  "top-select": ListFilter,
  "generate-concepts": Sparkles,
  "manual-image-input": ImagePlus,
};

/* ── Status colors ── */
const STATUS_CONFIG = {
  success: { label: "Completed", color: "text-emerald-600", bg: "bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-500" },
  error: { label: "Failed", color: "text-destructive", bg: "bg-destructive/10 border-destructive/20", dot: "bg-destructive" },
  running: { label: "Running", color: "text-blue-600", bg: "bg-blue-500/10 border-blue-500/20", dot: "bg-blue-500 animate-pulse" },
};

/* ── Main component ── */

export default function RunOutputPanel({ open, onClose, node }: RunOutputPanelProps) {
  if (!open || !node) return null;

  const Icon = NODE_ICONS[node.type] || Database;
  const widthClass = DRAWER_WIDTHS[node.type] || DEFAULT_WIDTH;
  const statusCfg = STATUS_CONFIG[node.status] || STATUS_CONFIG.success;

  const renderOutput = () => {
    switch (node.type) {
      case "schedule": return <ScheduleOutput />;
      case "dataset": return <DatasetOutput />;
      case "top-select": return <SelectOutput />;
      case "product-data": return <ProductDataOutput />;
      case "generate-concepts": return <GenerateVariationsOutput />;
      case "manual-image-input": return <ManualInputOutput />;
      default: return <p className="text-xs text-muted-foreground">No output data available.</p>;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-background/40 backdrop-blur-[2px]" onClick={onClose} />

      {/* Right-side drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50 bg-card border-l border-border",
          "shadow-[-8px_0_30px_-12px_rgba(0,0,0,0.15)]",
          "transition-all duration-300 ease-out flex flex-col",
          widthClass,
          open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-md bg-muted/60 flex items-center justify-center">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-tight">{node.label}</h3>
            </div>
            <div className={cn("flex items-center gap-1.5 rounded-full border px-2 py-0.5", statusCfg.bg)}>
              <span className={cn("h-1.5 w-1.5 rounded-full", statusCfg.dot)} />
              <span className={cn("text-[9px] font-medium", statusCfg.color)}>{statusCfg.label}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <XCircle className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {renderOutput()}
        </div>
      </div>
    </>
  );
}
