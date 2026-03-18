import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
const PRODUCTS = [
  {
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
  },
  {
    name: "Hydra Glow Serum",
    imageSeeds: ["prod-2a"],
    knowledge: {
      "Product Description": "A lightweight, fast-absorbing hydration serum with triple-weight hyaluronic acid and vitamin C. Delivers instant plumping and a dewy, glass-skin finish.",
      "Target Demographic": "Women and men aged 25–45 seeking daily hydration and glow. Suitable for all skin types including sensitive skin.",
      "Key Claims": "- 72-hour hydration lock technology\n- Visible plumping effect within 15 minutes\n- Fragrance-free and vegan certified\n- Compatible with all skincare routines",
      "Ingredients Highlights": "Triple-Weight Hyaluronic Acid, Vitamin C (Ascorbyl Glucoside) 10%, Niacinamide 4%, Aloe Vera Extract, Beta-Glucan",
      "Brand Positioning": "Accessible premium hydration serum. Price point: $42 USD for 30ml. Entry-level hero product designed to recruit new customers into the brand ecosystem.",
    },
  },
];

function ProductDataOutput() {
  return (
    <div className="space-y-3">
      {PRODUCTS.map((product, idx) => (
        <ProductCardWithKnowledgeModal key={idx} product={product} />
      ))}
    </div>
  );
}

interface ProductInfo {
  name: string;
  imageSeeds: string[];
  knowledge: Record<string, string>;
}

function ProductCardWithKnowledgeModal({ product }: { product: ProductInfo }) {
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);

  return (
    <>
      <div className="rounded-xl border border-border bg-card p-3 relative group/v5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs font-semibold">{product.name}</p>
          </div>
          <Badge variant="secondary" className="text-[9px] gap-0.5 py-0 h-5">
            <Image className="h-2.5 w-2.5" /> {product.imageSeeds.length}
          </Badge>
        </div>
        <div className="flex gap-1.5 mt-2">
          {product.imageSeeds.map((s, i) => (
            <div key={i} className="h-10 w-10 rounded-md overflow-hidden bg-muted border border-border">
              <img src={`https://picsum.photos/seed/${s}/80/80`} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
        {/* Subtle knowledge button */}
        <button
          onClick={() => setKnowledgeOpen(true)}
          className="absolute bottom-2.5 right-2.5 h-7 w-7 rounded-lg flex items-center justify-center bg-muted/30 text-muted-foreground/40 hover:bg-muted hover:text-foreground transition-all duration-200 group-hover/v5:bg-muted/60 group-hover/v5:text-muted-foreground"
        >
          <BookOpen className="h-3.5 w-3.5" />
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
                <TooltipContent side="right" className="max-w-[280px] text-[11px] leading-relaxed">
                  This is a snapshot of the product knowledge that was used during this specific run. Since knowledge can be updated over time, this may differ from the current version in your{" "}
                  <Link to="/brand-data-room/products" className="underline underline-offset-2 font-medium text-primary hover:text-primary/80">
                    Product Data Room
                  </Link>.
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{product.name}</p>
          </DialogHeader>
          <ScrollArea className="flex-1 px-6 pb-6 pt-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {Object.entries(product.knowledge).map(([key, value]) => (
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

/* Generate Ad Variations output — 10 variations */
const PREVIEW_SEEDS = ["gen-c1", "gen-c2", "gen-c3", "gen-c4", "gen-c5"];
const GEN_SETTINGS = [
  { label: "Concepts per image", value: "6" },
  { label: "Visual similarity", value: "Medium", progress: 50 },
  { label: "Messaging similarity", value: "Medium", progress: 50 },
  { label: "Total generated", value: "15 concepts" },
];

function GenerateVariationsOutput() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Generation Settings</p>
        <div className="grid grid-cols-2 gap-2">
          {GEN_SETTINGS.map((s, i) => (
            <div key={i} className="rounded-lg border border-border bg-card px-3 py-2.5">
              <p className="text-[9px] text-muted-foreground">{s.label}</p>
              {s.progress !== undefined ? (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${s.progress}%` }} />
                  </div>
                  <span className="text-[10px] font-semibold">{s.value}</span>
                </div>
              ) : (
                <p className="text-sm font-semibold mt-0.5">{s.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">10 Concept Grid Variations — Choose your favorite</p>

      {/* V1: 1×4 — Minimal hover ring */}
      <ConceptsV1 />
      {/* V2: 2×2 — Glassmorphism overlay */}
      <ConceptsV2 />
      {/* V3: 1×4 — Bottom gradient label */}
      <ConceptsV3 />
      {/* V4: 2×2 — Numbered badges */}
      <ConceptsV4 />
      {/* V5: 1×4 — Scale-up with arrow */}
      <ConceptsV5 />
      {/* V6: 2×2 — Border glow pulse */}
      <ConceptsV6 />
      {/* V7: 1×4 — Slide-up frosted panel */}
      <ConceptsV7 />
      {/* V8: 2×2 — Checkbox-select style */}
      <ConceptsV8 />
      {/* V9: 1×4 — Polaroid style */}
      <ConceptsV9 />
      {/* V10: 2×2 — Magazine layout */}
      <ConceptsV10 />
    </div>
  );
}

/* ── V1: 1×4 row — subtle ring on hover ── */
function ConceptsV1() {
  const navigate = useNavigate();
  const [h, setH] = useState(false);
  return (
    <div>
      <p className="text-[8px] text-muted-foreground mb-1.5">V1 — Minimal Ring (1×4)</p>
      <div className="grid grid-cols-4 gap-2 cursor-pointer" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={() => navigate("/concepts/competitor-ad-variation-1")}>
        {PREVIEW_SEEDS.slice(0, 3).map((seed, i) => (
          <div key={i} className={cn("rounded-lg border overflow-hidden aspect-[4/5] transition-all duration-200", h ? "border-primary ring-2 ring-primary/20" : "border-border")}>
            <img src={`https://picsum.photos/seed/${seed}/320/400`} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
        <div className={cn("rounded-lg border aspect-[4/5] flex flex-col items-center justify-center transition-all duration-200", h ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border bg-muted/40")}>
          <span className={cn("text-lg font-bold", h ? "text-primary" : "text-muted-foreground")}>+12</span>
          <span className={cn("text-[9px]", h ? "text-primary" : "text-muted-foreground")}>View all</span>
        </div>
      </div>
    </div>
  );
}

/* ── V2: 2×2 — Glassmorphism overlay on hover ── */
function ConceptsV2() {
  const navigate = useNavigate();
  const [h, setH] = useState(false);
  const seeds = [PREVIEW_SEEDS[0], PREVIEW_SEEDS[1], PREVIEW_SEEDS[2]];
  return (
    <div>
      <p className="text-[8px] text-muted-foreground mb-1.5">V2 — Glass Overlay (2×2)</p>
      <div className="grid grid-cols-2 gap-2 cursor-pointer" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={() => navigate("/concepts/competitor-ad-variation-1")}>
        {seeds.map((seed, i) => (
          <div key={i} className="rounded-lg border border-border overflow-hidden aspect-square relative">
            <img src={`https://picsum.photos/seed/${seed}/400/400`} alt="" className="h-full w-full object-cover" />
            {h && (
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Eye className="h-5 w-5 text-white drop-shadow-lg" />
              </div>
            )}
          </div>
        ))}
        <div className={cn("rounded-lg border aspect-square flex flex-col items-center justify-center transition-colors", h ? "border-primary bg-primary/10" : "border-dashed border-border bg-muted/30")}>
          <span className={cn("text-xl font-bold", h ? "text-primary" : "text-muted-foreground")}>+12</span>
          <span className={cn("text-[10px] font-medium mt-1", h ? "text-primary" : "text-muted-foreground")}>See all concepts</span>
        </div>
      </div>
    </div>
  );
}

/* ── V3: 1×4 — Bottom gradient label ── */
function ConceptsV3() {
  const navigate = useNavigate();
  const [h, setH] = useState(false);
  return (
    <div>
      <p className="text-[8px] text-muted-foreground mb-1.5">V3 — Gradient Label (1×4)</p>
      <div className="grid grid-cols-4 gap-1.5 cursor-pointer" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={() => navigate("/concepts/competitor-ad-variation-1")}>
        {PREVIEW_SEEDS.slice(0, 3).map((seed, i) => (
          <div key={i} className={cn("rounded-md overflow-hidden aspect-[4/5] relative transition-all duration-200", h && "scale-[1.03]")}>
            <img src={`https://picsum.photos/seed/${seed}/320/400`} alt="" className="h-full w-full object-cover" />
            <div className={cn("absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5 transition-opacity", h ? "opacity-100" : "opacity-0")}>
              <p className="text-[9px] text-white font-medium">Concept {i + 1}</p>
            </div>
          </div>
        ))}
        <div className={cn("rounded-md aspect-[4/5] flex flex-col items-center justify-center border transition-all duration-200", h ? "border-primary bg-primary/5 scale-[1.03]" : "border-dashed border-muted-foreground/30 bg-muted/20")}>
          <span className={cn("text-base font-bold", h ? "text-primary" : "text-muted-foreground")}>+12</span>
          <span className={cn("text-[8px] mt-0.5", h ? "text-primary" : "text-muted-foreground")}>more</span>
        </div>
      </div>
      {h && <p className="text-[10px] text-primary text-center mt-1.5 font-medium">Click to explore all concepts →</p>}
    </div>
  );
}

/* ── V4: 2×2 — Numbered corner badges ── */
function ConceptsV4() {
  const navigate = useNavigate();
  const [h, setH] = useState(false);
  return (
    <div>
      <p className="text-[8px] text-muted-foreground mb-1.5">V4 — Numbered Badges (2×2)</p>
      <div className="grid grid-cols-2 gap-2 cursor-pointer" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={() => navigate("/concepts/competitor-ad-variation-1")}>
        {PREVIEW_SEEDS.slice(0, 3).map((seed, i) => (
          <div key={i} className={cn("rounded-xl overflow-hidden aspect-square relative border transition-all duration-200", h ? "border-primary shadow-lg shadow-primary/10" : "border-border")}>
            <img src={`https://picsum.photos/seed/${seed}/400/400`} alt="" className="h-full w-full object-cover" />
            <div className={cn("absolute top-1.5 left-1.5 h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors", h ? "bg-primary text-primary-foreground" : "bg-background/80 text-foreground")}>
              {i + 1}
            </div>
          </div>
        ))}
        <div className={cn("rounded-xl border aspect-square flex flex-col items-center justify-center gap-1 transition-all duration-200", h ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-border bg-card")}>
          <div className={cn("h-10 w-10 rounded-full flex items-center justify-center transition-colors", h ? "bg-primary/15" : "bg-muted")}>
            <span className={cn("text-sm font-bold", h ? "text-primary" : "text-muted-foreground")}>+12</span>
          </div>
          <span className={cn("text-[9px] font-medium", h ? "text-primary" : "text-muted-foreground")}>View all</span>
        </div>
      </div>
    </div>
  );
}

/* ── V5: 1×4 — Scale-up with centered arrow ── */
function ConceptsV5() {
  const navigate = useNavigate();
  const [h, setH] = useState(false);
  return (
    <div>
      <p className="text-[8px] text-muted-foreground mb-1.5">V5 — Scale Arrow (1×4)</p>
      <div className="grid grid-cols-4 gap-2 cursor-pointer" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={() => navigate("/concepts/competitor-ad-variation-1")}>
        {PREVIEW_SEEDS.slice(0, 3).map((seed, i) => (
          <div key={i} className={cn("rounded-lg overflow-hidden aspect-[4/5] relative border transition-all duration-300", h ? "border-primary scale-105" : "border-border")}>
            <img src={`https://picsum.photos/seed/${seed}/320/400`} alt="" className="h-full w-full object-cover" />
            {h && (
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                <ExternalLink className="h-4 w-4 text-primary drop-shadow" />
              </div>
            )}
          </div>
        ))}
        <div className={cn("rounded-lg border aspect-[4/5] flex flex-col items-center justify-center transition-all duration-300", h ? "border-primary scale-105 bg-primary/10" : "border-border bg-muted/40")}>
          <span className={cn("text-lg font-bold", h ? "text-primary" : "text-muted-foreground")}>+12</span>
          <ExternalLink className={cn("h-3 w-3 mt-1 transition-colors", h ? "text-primary" : "text-muted-foreground/50")} />
        </div>
      </div>
    </div>
  );
}

/* ── V6: 2×2 — Animated border glow ── */
function ConceptsV6() {
  const navigate = useNavigate();
  const [h, setH] = useState(false);
  return (
    <div>
      <p className="text-[8px] text-muted-foreground mb-1.5">V6 — Border Glow (2×2)</p>
      <div className="grid grid-cols-2 gap-2.5 cursor-pointer" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={() => navigate("/concepts/competitor-ad-variation-1")}>
        {PREVIEW_SEEDS.slice(0, 3).map((seed, i) => (
          <div key={i} className={cn("rounded-xl overflow-hidden aspect-square border-2 transition-all duration-300", h ? "border-primary shadow-[0_0_12px_-2px] shadow-primary/40" : "border-transparent")}>
            <img src={`https://picsum.photos/seed/${seed}/400/400`} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
        <div className={cn("rounded-xl aspect-square border-2 flex flex-col items-center justify-center transition-all duration-300", h ? "border-primary shadow-[0_0_12px_-2px] shadow-primary/40 bg-primary/5" : "border-muted bg-muted/20")}>
          <Sparkles className={cn("h-5 w-5 mb-1 transition-colors", h ? "text-primary" : "text-muted-foreground/40")} />
          <span className={cn("text-lg font-bold", h ? "text-primary" : "text-muted-foreground")}>+12</span>
          <span className={cn("text-[9px]", h ? "text-primary" : "text-muted-foreground")}>Explore</span>
        </div>
      </div>
    </div>
  );
}

/* ── V7: 1×4 — Slide-up frosted info panel ── */
function ConceptsV7() {
  const navigate = useNavigate();
  const [h, setH] = useState(false);
  return (
    <div>
      <p className="text-[8px] text-muted-foreground mb-1.5">V7 — Frosted Slide-Up (1×4)</p>
      <div className="grid grid-cols-4 gap-1.5 cursor-pointer" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={() => navigate("/concepts/competitor-ad-variation-1")}>
        {PREVIEW_SEEDS.slice(0, 3).map((seed, i) => (
          <div key={i} className="rounded-lg overflow-hidden aspect-[4/5] relative border border-border">
            <img src={`https://picsum.photos/seed/${seed}/320/400`} alt="" className="h-full w-full object-cover" />
            <div className={cn("absolute inset-x-1 bottom-1 rounded-md bg-white/20 backdrop-blur-md border border-white/30 px-2 py-1 transition-all duration-200", h ? "translate-y-0 opacity-100" : "translate-y-[calc(100%+8px)] opacity-0")}>
              <p className="text-[8px] text-white font-semibold">Concept {i + 1}</p>
            </div>
          </div>
        ))}
        <div className={cn("rounded-lg border aspect-[4/5] flex flex-col items-center justify-center transition-all duration-200", h ? "border-primary/60 bg-primary/5" : "border-dashed border-border bg-muted/30")}>
          <span className={cn("text-base font-bold", h ? "text-primary" : "text-muted-foreground")}>+12</span>
          <span className={cn("text-[8px] mt-0.5", h ? "text-primary" : "text-muted-foreground")}>View all</span>
        </div>
      </div>
    </div>
  );
}

/* ── V8: 2×2 — Checkbox-select style ── */
function ConceptsV8() {
  const navigate = useNavigate();
  const [h, setH] = useState(false);
  return (
    <div>
      <p className="text-[8px] text-muted-foreground mb-1.5">V8 — Checkbox Style (2×2)</p>
      <div className="grid grid-cols-2 gap-2 cursor-pointer" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={() => navigate("/concepts/competitor-ad-variation-1")}>
        {PREVIEW_SEEDS.slice(0, 3).map((seed, i) => (
          <div key={i} className={cn("rounded-lg overflow-hidden aspect-square relative border transition-all duration-200", h ? "border-primary" : "border-border")}>
            <img src={`https://picsum.photos/seed/${seed}/400/400`} alt="" className="h-full w-full object-cover" />
            <div className={cn("absolute top-1.5 right-1.5 h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all", h ? "border-primary bg-primary" : "border-white/60 bg-white/20")}>
              {h && <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />}
            </div>
          </div>
        ))}
        <div className={cn("rounded-lg border aspect-square flex flex-col items-center justify-center transition-all", h ? "border-primary bg-primary/5" : "border-border bg-card")}>
          <span className={cn("text-xl font-bold", h ? "text-primary" : "text-muted-foreground")}>+12</span>
          <span className={cn("text-[10px] mt-0.5", h ? "text-primary font-medium" : "text-muted-foreground")}>Open gallery</span>
        </div>
      </div>
    </div>
  );
}

/* ── V9: 1×4 — Polaroid style with tilt ── */
function ConceptsV9() {
  const navigate = useNavigate();
  const [h, setH] = useState(false);
  const tilts = ["-rotate-1", "rotate-1", "-rotate-2"];
  return (
    <div>
      <p className="text-[8px] text-muted-foreground mb-1.5">V9 — Polaroid (1×4)</p>
      <div className="grid grid-cols-4 gap-3 cursor-pointer py-2" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={() => navigate("/concepts/competitor-ad-variation-1")}>
        {PREVIEW_SEEDS.slice(0, 3).map((seed, i) => (
          <div key={i} className={cn("rounded-sm bg-card border border-border p-1 pb-3 shadow-sm transition-all duration-300", tilts[i], h && "rotate-0 shadow-md shadow-primary/10 border-primary/40")}>
            <div className="aspect-square overflow-hidden rounded-sm bg-muted">
              <img src={`https://picsum.photos/seed/${seed}/400/400`} alt="" className="h-full w-full object-cover" />
            </div>
            <p className={cn("text-[8px] text-center mt-1.5 font-medium transition-colors", h ? "text-primary" : "text-muted-foreground")}>#{i + 1}</p>
          </div>
        ))}
        <div className={cn("rounded-sm border p-1 pb-3 flex flex-col items-center justify-center transition-all duration-300 rotate-2", h ? "rotate-0 border-primary/40 bg-primary/5 shadow-md shadow-primary/10" : "border-dashed border-border bg-card")}>
          <span className={cn("text-base font-bold", h ? "text-primary" : "text-muted-foreground")}>+12</span>
          <span className={cn("text-[8px]", h ? "text-primary" : "text-muted-foreground")}>more</span>
        </div>
      </div>
    </div>
  );
}

/* ── V10: 2×2 — Magazine / editorial layout ── */
function ConceptsV10() {
  const navigate = useNavigate();
  const [h, setH] = useState(false);
  return (
    <div>
      <p className="text-[8px] text-muted-foreground mb-1.5">V10 — Magazine (2×2)</p>
      <div className="grid grid-cols-2 gap-1 cursor-pointer rounded-xl overflow-hidden border border-border" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={() => navigate("/concepts/competitor-ad-variation-1")}>
        {PREVIEW_SEEDS.slice(0, 3).map((seed, i) => (
          <div key={i} className="aspect-square relative overflow-hidden">
            <img src={`https://picsum.photos/seed/${seed}/400/400`} alt="" className={cn("h-full w-full object-cover transition-transform duration-500", h && "scale-110")} />
            {h && <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />}
          </div>
        ))}
        <div className={cn("aspect-square flex flex-col items-center justify-center transition-colors duration-300", h ? "bg-primary/10" : "bg-muted/40")}>
          <span className={cn("text-2xl font-bold tracking-tight transition-colors", h ? "text-primary" : "text-muted-foreground/60")}>+12</span>
          <span className={cn("text-[10px] font-medium tracking-wide uppercase mt-1 transition-colors", h ? "text-primary" : "text-muted-foreground/40")}>View All</span>
          {h && <ExternalLink className="h-3.5 w-3.5 text-primary mt-2" />}
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
