import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronDown, CheckCircle2, Clock, ExternalLink, Info, Image,
  Package, Sparkles, Database, ListFilter, ImagePlus, XCircle,
  AlertTriangle, Filter, Hash, BarChart3, Eye, BookOpen,
} from "lucide-react";

/* ── Run mock data types ── */

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

/* ── Mock runs ── */

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

/* Schedule output */
function ScheduleOutput() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-3.5">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Clock className="h-3 w-3 text-muted-foreground" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Run Started</span>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[220px] text-[10px]">
            The exact date and time this workflow run was triggered by the schedule.
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="text-sm font-medium text-foreground">18 Mar 2026 · 09:00 AM</p>
    </div>
  );
}

/* Dataset output */
function DatasetOutput() {
  return (
    <div className="space-y-4">
      {/* Sources */}
      <div className="rounded-xl border border-border bg-card shadow-sm p-3.5">
        <div className="flex items-center gap-1.5 mb-2.5">
          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Sources</p>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[240px] text-[10px]">
              The competitor brands whose ads were scraped and collected for this run.
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          {[
            { name: "CeraVe", logo: "https://logo.clearbit.com/cerave.com" },
            { name: "The Ordinary", logo: "https://logo.clearbit.com/theordinary.com" },
          ].map((c) => (
            <div key={c.name} className="flex items-center gap-1.5 rounded-full border border-border bg-muted/40 pl-1 pr-2.5 py-1">
              <img src={c.logo} alt="" className="h-4 w-4 rounded-full" />
              <span className="text-[10px] font-medium">{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card shadow-sm p-3.5">
        <div className="flex items-center gap-1.5 mb-2.5">
          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Filters</p>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[260px] text-[10px]">
              Criteria used to narrow down scraped ads — time range limits recency, and minimum reach sets the lowest audience threshold.
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-lg border border-border bg-muted/20 p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Time range</span>
            </div>
            <p className="text-xs font-medium">Last 30 days</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <BarChart3 className="h-3 w-3 text-muted-foreground" />
              <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Min. reach</span>
            </div>
            <p className="text-xs font-medium">1,000 impressions</p>
          </div>
        </div>
      </div>

      {/* Match summary — Inline Badges (Variation 4) */}
      <div className="rounded-xl border border-border bg-card shadow-sm px-3.5 py-3 flex items-center gap-2.5">
        <Database className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="text-xs font-medium">
          <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary px-1.5 py-0.5 font-bold text-[11px]">12</span>
          {" "}qualifying ads from{" "}
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 font-bold text-[11px] text-muted-foreground">48</span>
          {" "}collected
        </span>
      </div>
    </div>
  );
}

/* Format reach: ≤9999 shown in full, above that use K/M notation */
function formatReach(n: number): string {
  if (n <= 9999) return n.toLocaleString();
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
}

/* Select output */
const SELECTED_ADS = [
  { id: 1, brand: "CeraVe", headline: "Hydrating Facial Cleanser — Dermatologist Recommended", reach: 245000, ctr: "3.2%", spend: "$1.2K" },
  { id: 2, brand: "The Ordinary", headline: "Niacinamide 10% + Zinc 1% — Target Blemishes", reach: 312000, ctr: "4.1%", spend: "$980" },
  { id: 3, brand: "The Ordinary", headline: "AHA 30% + BHA 2% Peeling Solution", reach: 198000, ctr: "2.8%", spend: "$760" },
  { id: 4, brand: "CeraVe", headline: "Moisturizing Cream for Dry Skin Relief", reach: 189000, ctr: "3.5%", spend: "$1.1K" },
  { id: 5, brand: "CeraVe", headline: "AM Facial Moisturizing Lotion with SPF 30", reach: 47000, ctr: "2.1%", spend: "$420" },
  { id: 6, brand: "CeraVe", headline: "SA Smoothing Cleanser — Bumpy Skin", reach: 68000, ctr: "2.6%", spend: "$550" },
  { id: 7, brand: "The Ordinary", headline: "Hyaluronic Acid 2% + B5 — Intense Hydration", reach: 23000, ctr: "1.9%", spend: "$310" },
  { id: 8, brand: "The Ordinary", headline: "Retinol 0.5% in Squalane — Anti-Aging", reach: 15000, ctr: "1.4%", spend: "$280" },
  { id: 9, brand: "CeraVe", headline: "Eye Repair Cream — Dark Circles", reach: 4200, ctr: "0.8%", spend: "$120" },
  { id: 10, brand: "The Ordinary", headline: "Glycolic Acid 7% Toning Solution", reach: 7300, ctr: "1.1%", spend: "$190" },
];

function SelectOutput() {
  return (
    <div className="space-y-3">
      {/* Settings row */}
      <div className="flex items-center gap-3">
        <div className="rounded-lg border border-border bg-card px-3 py-2 flex items-center gap-2">
          <Hash className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Count:</span>
          <span className="text-xs font-semibold">10</span>
        </div>
        <div className="rounded-lg border border-border bg-card px-3 py-2 flex items-center gap-2">
          <BarChart3 className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Ranked by:</span>
          <span className="text-xs font-semibold">New Reach</span>
        </div>
      </div>

      {/* Ad cards grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {SELECTED_ADS.map((ad) => {
          const logo = `https://logo.clearbit.com/${ad.brand === "CeraVe" ? "cerave.com" : "theordinary.com"}`;
          const imgSrc = `https://picsum.photos/seed/ad-select-${ad.id}/400/500`;
          return (
            <div key={ad.id} className="rounded-lg border border-border overflow-hidden bg-card group">
              <div className="aspect-[4/5] bg-muted relative">
                <img src={imgSrc} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-x-2 bottom-2 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 p-1.5 translate-y-[calc(100%+8px)] group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <img src={logo} alt="" className="h-3.5 w-3.5 rounded-full" />
                      <span className="text-[9px] font-semibold text-white">{ad.brand}</span>
                    </div>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <span className="text-[9px] font-bold text-white cursor-help">{formatReach(ad.reach)}</span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-[10px]">
                        Total reach: {ad.reach.toLocaleString()} impressions
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Product Data output — V5 style with knowledge modal */
const PRODUCT = {
  name: "Retinol Night Recovery Mask",
  imageSeeds: ["prod-1a", "prod-1b", "prod-1c"],
  knowledge: {
    "Product Description": "A luxurious overnight recovery mask formulated with 0.3% encapsulated retinol and ceramide complex. Designed to accelerate cell turnover while maintaining the skin's moisture barrier during sleep.",
    "Target Demographic": "Women aged 35–55 with visible signs of aging including fine lines, uneven skin tone, and loss of firmness. Primary markets: US, UK, and Western Europe.",
    "Key Claims": "- Clinically proven to reduce fine lines by 42% in 4 weeks\n- Dermatologist tested and approved\n- Non-comedogenic formula\n- 94% of users reported smoother skin after first use",
    "Ingredients Highlights": "Encapsulated Retinol 0.3%, Niacinamide 5%, Hyaluronic Acid, Squalane, Ceramide NP, Peptide Complex, Vitamin E",
    "Brand Positioning": "Premium skincare positioned at the intersection of clinical efficacy and sensorial luxury. Price point: $68 USD for 50ml. Competes with brands like Drunk Elephant, Paula's Choice, and Sunday Riley.",
    "Tone of Voice": "Confident yet approachable. Scientific credibility balanced with warmth. Avoids fear-based aging language — focuses on skin health and radiance rather than anti-aging anxiety.",
  },
};

function ProductDataOutput() {
  return (
    <div className="space-y-3">
      <ProductCardWithKnowledgeModal />
    </div>
  );
}

function ProductCardWithKnowledgeModal() {
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);

  return (
    <>
      <div className="rounded-xl border border-border bg-card p-3 relative group/v5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs font-semibold">{PRODUCT.name}</p>
          </div>
          <Badge variant="secondary" className="text-[9px] gap-0.5 py-0 h-5">
            <Image className="h-2.5 w-2.5" /> 3
          </Badge>
        </div>
        <div className="flex gap-1.5 mt-2">
          {PRODUCT.imageSeeds.map((s, i) => (
            <div key={i} className="h-10 w-10 rounded-md overflow-hidden bg-muted border border-border">
              <img src={`https://picsum.photos/seed/${s}/80/80`} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
        {/* Subtle knowledge button — always slightly visible, more visible on hover */}
        <button
          onClick={() => setKnowledgeOpen(true)}
          className="absolute bottom-2 right-2 h-6 w-6 rounded-md flex items-center justify-center bg-muted/30 text-muted-foreground/40 hover:bg-muted hover:text-foreground transition-all duration-200 group-hover/v5:bg-muted/60 group-hover/v5:text-muted-foreground"
        >
          <BookOpen className="h-3 w-3" />
        </button>
      </div>

      {/* Knowledge Modal */}
      <Dialog open={knowledgeOpen} onOpenChange={setKnowledgeOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
            <div className="flex items-center gap-2">
              <DialogTitle className="text-base">Product Knowledge</DialogTitle>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <button className="h-5 w-5 rounded-full bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors">
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[260px] text-[11px] leading-relaxed">
                  This is a snapshot of the product knowledge that was used during this specific run. Since knowledge can be updated over time, this may differ from the current version in your Data Room.
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{PRODUCT.name}</p>
          </DialogHeader>
          <ScrollArea className="flex-1 px-6 pb-6 pt-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {Object.entries(PRODUCT.knowledge).map(([key, value]) => (
                <div key={key} className="mb-4 last:mb-0">
                  <h3 className="text-sm font-semibold mt-0 mb-1.5">{key}</h3>
                  {value.split("\n").map((line, i) => (
                    <p key={i} className="text-xs text-muted-foreground leading-relaxed my-0.5">
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
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
