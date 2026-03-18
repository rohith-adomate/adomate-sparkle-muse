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

/* Generate Ad Variations output */
const PREVIEW_SEEDS = ["gen-c1", "gen-c2", "gen-c3", "gen-c4", "gen-c5"];

/* Knob component for similarity — 3 positions: Low, Medium, High */
function SimilarityKnob({ label, value, tooltip }: { label: string; value: "Low" | "Medium" | "High"; tooltip: string }) {
  const positions = ["Low", "Medium", "High"] as const;
  const idx = positions.indexOf(value);
  const angle = -45 + idx * 45;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-1">
        <p className="text-[9px] text-muted-foreground font-medium">{label}</p>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <button className="h-3.5 w-3.5 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
              <Info className="h-2.5 w-2.5 text-muted-foreground/50" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[220px] text-[10px] leading-relaxed">{tooltip}</TooltipContent>
        </Tooltip>
      </div>
      <div className="relative h-12 w-12 rounded-full border-2 border-border bg-card shadow-sm">
        {positions.map((pos, i) => {
          const tickAngle = -45 + i * 45;
          return (
            <div key={pos} className="absolute inset-0 flex justify-center" style={{ transform: `rotate(${tickAngle}deg)` }}>
              <div className={cn("w-0.5 h-1.5 rounded-full mt-0.5", i === idx ? "bg-primary" : "bg-muted-foreground/30")} />
            </div>
          );
        })}
        <div className="absolute inset-0 flex justify-center transition-transform duration-300" style={{ transform: `rotate(${angle}deg)` }}>
          <div className="w-1 h-4 mt-1.5 rounded-full bg-primary" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2.5 w-2.5 rounded-full bg-muted border border-border" />
        </div>
      </div>
      <span className="text-[9px] font-semibold text-foreground">{value}</span>
    </div>
  );
}

const TOTAL_TOOLTIP = "10 ads (Select) × 2 products × 3 concepts/image = 60 concepts";

function GenerateVariationsOutput() {
  const navigate = useNavigate();
  const [h, setH] = useState(false);

  return (
    <div className="space-y-4">
      <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Generation Settings — 10 Variations</p>

      {/* V1: Clean Split — left stack, right knobs */}
      <div className="rounded-xl border border-border bg-card p-3">
        <p className="text-[8px] text-muted-foreground mb-2">V1 — Clean Split</p>
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
              <p className="text-[9px] text-muted-foreground">Concepts per image</p>
              <p className="text-sm font-semibold">3</p>
            </div>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div className="rounded-md border border-border bg-muted/30 px-3 py-2 cursor-help">
                  <p className="text-[9px] text-muted-foreground">Total generated</p>
                  <p className="text-sm font-semibold">60 concepts</p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-[10px] leading-relaxed max-w-[240px]">{TOTAL_TOOLTIP}</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-4">
            <SimilarityKnob label="Visual" value="Medium" />
            <SimilarityKnob label="Messaging" value="Medium" />
          </div>
        </div>
      </div>

      {/* V2: Compact Bar */}
      <div className="rounded-xl border border-border bg-card px-3 py-2.5">
        <p className="text-[8px] text-muted-foreground mb-2">V2 — Compact Bar</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2">
            <div className="rounded-md bg-primary/10 px-2.5 py-1.5">
              <p className="text-[8px] text-muted-foreground">Per image</p>
              <p className="text-xs font-bold text-primary">3</p>
            </div>
            <span className="text-muted-foreground/40 text-xs">×</span>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div className="rounded-md bg-primary/10 px-2.5 py-1.5 cursor-help">
                  <p className="text-[8px] text-muted-foreground">Total</p>
                  <p className="text-xs font-bold text-primary">60</p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-[10px] max-w-[240px]">{TOTAL_TOOLTIP}</TooltipContent>
            </Tooltip>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-3">
            <SimilarityKnob label="Visual" value="Medium" />
            <SimilarityKnob label="Messaging" value="Medium" />
          </div>
        </div>
      </div>

      {/* V3: Card Grid 2×2 */}
      <div className="rounded-xl border border-border bg-card p-3">
        <p className="text-[8px] text-muted-foreground mb-2">V3 — Card Grid</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-border px-3 py-2.5">
            <p className="text-[9px] text-muted-foreground">Concepts per image</p>
            <p className="text-lg font-bold">3</p>
          </div>
          <div className="rounded-lg border border-border px-3 py-2.5 flex flex-col items-center justify-center">
            <SimilarityKnob label="Visual" value="Medium" />
          </div>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <div className="rounded-lg border border-border px-3 py-2.5 cursor-help">
                <p className="text-[9px] text-muted-foreground">Total generated</p>
                <p className="text-lg font-bold">60</p>
                <p className="text-[8px] text-muted-foreground">concepts</p>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-[10px] max-w-[240px]">{TOTAL_TOOLTIP}</TooltipContent>
          </Tooltip>
          <div className="rounded-lg border border-border px-3 py-2.5 flex flex-col items-center justify-center">
            <SimilarityKnob label="Messaging" value="Medium" />
          </div>
        </div>
      </div>

      {/* V4: Big Numbers */}
      <div className="rounded-xl border border-border bg-card p-3">
        <p className="text-[8px] text-muted-foreground mb-2">V4 — Big Numbers</p>
        <div className="flex gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">3</span>
              <span className="text-[10px] text-muted-foreground">concepts per image</span>
            </div>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div className="flex items-baseline gap-2 cursor-help">
                  <span className="text-2xl font-bold">60</span>
                  <span className="text-[10px] text-muted-foreground underline underline-offset-2 decoration-dashed">total concepts</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-[10px] max-w-[240px]">{TOTAL_TOOLTIP}</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-4 border-l border-border pl-4">
            <SimilarityKnob label="Visual" value="Medium" />
            <SimilarityKnob label="Messaging" value="Medium" />
          </div>
        </div>
      </div>

      {/* V5: Pill Badges */}
      <div className="rounded-xl border border-border bg-card p-3">
        <p className="text-[8px] text-muted-foreground mb-2">V5 — Pill Badges</p>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className="text-[10px] py-1 px-3 gap-1">
            <Hash className="h-3 w-3" /> 3 per image
          </Badge>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="text-[10px] py-1 px-3 gap-1 cursor-help">
                <BarChart3 className="h-3 w-3" /> 60 total
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-[10px] max-w-[240px]">{TOTAL_TOOLTIP}</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-5 justify-center">
          <SimilarityKnob label="Visual" value="Medium" />
          <SimilarityKnob label="Messaging" value="Medium" />
        </div>
      </div>

      {/* V6: Vertical List */}
      <div className="rounded-xl border border-border bg-card p-3">
        <p className="text-[8px] text-muted-foreground mb-2">V6 — Vertical List</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2">
            <span className="text-[10px] text-muted-foreground">Concepts per image</span>
            <span className="text-xs font-bold">3</span>
          </div>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2 cursor-help">
                <span className="text-[10px] text-muted-foreground">Total generated</span>
                <span className="text-xs font-bold">60 concepts</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-[10px] max-w-[240px]">{TOTAL_TOOLTIP}</TooltipContent>
          </Tooltip>
          <div className="flex items-center justify-around pt-1">
            <SimilarityKnob label="Visual" value="Medium" />
            <SimilarityKnob label="Messaging" value="Medium" />
          </div>
        </div>
      </div>

      {/* V7: Dashboard Metrics */}
      <div className="rounded-xl border border-border bg-card p-3">
        <p className="text-[8px] text-muted-foreground mb-2">V7 — Dashboard Metrics</p>
        <div className="flex items-stretch gap-2">
          <div className="flex-1 rounded-lg bg-primary/5 border border-primary/20 p-2.5 text-center">
            <p className="text-xl font-bold text-primary">3</p>
            <p className="text-[8px] text-muted-foreground mt-0.5">per image</p>
          </div>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <div className="flex-1 rounded-lg bg-primary/5 border border-primary/20 p-2.5 text-center cursor-help">
                <p className="text-xl font-bold text-primary">60</p>
                <p className="text-[8px] text-muted-foreground mt-0.5">total concepts</p>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-[10px] max-w-[240px]">{TOTAL_TOOLTIP}</TooltipContent>
          </Tooltip>
          <div className="flex-1 rounded-lg border border-border p-2 flex items-center justify-center">
            <SimilarityKnob label="Visual" value="Medium" />
          </div>
          <div className="flex-1 rounded-lg border border-border p-2 flex items-center justify-center">
            <SimilarityKnob label="Messaging" value="Medium" />
          </div>
        </div>
      </div>

      {/* V8: Minimal Text */}
      <div className="rounded-xl border border-border bg-card p-3">
        <p className="text-[8px] text-muted-foreground mb-2">V8 — Minimal Text</p>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs"><span className="font-bold">3</span> <span className="text-muted-foreground">concepts per image</span></p>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <p className="text-xs cursor-help"><span className="font-bold">60</span> <span className="text-muted-foreground underline underline-offset-2 decoration-dashed">total concepts generated</span></p>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-[10px] max-w-[240px]">{TOTAL_TOOLTIP}</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex gap-3">
            <SimilarityKnob label="Visual" value="Medium" />
            <SimilarityKnob label="Messaging" value="Medium" />
          </div>
        </div>
      </div>

      {/* V9: Equation */}
      <div className="rounded-xl border border-border bg-card p-3">
        <p className="text-[8px] text-muted-foreground mb-2">V9 — Equation</p>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 cursor-help mb-3">
              <div className="rounded-md bg-muted px-2 py-1 text-center">
                <p className="text-[8px] text-muted-foreground">Ads</p>
                <p className="text-xs font-bold">10</p>
              </div>
              <span className="text-muted-foreground text-xs">×</span>
              <div className="rounded-md bg-muted px-2 py-1 text-center">
                <p className="text-[8px] text-muted-foreground">Products</p>
                <p className="text-xs font-bold">2</p>
              </div>
              <span className="text-muted-foreground text-xs">×</span>
              <div className="rounded-md bg-muted px-2 py-1 text-center">
                <p className="text-[8px] text-muted-foreground">Per image</p>
                <p className="text-xs font-bold">3</p>
              </div>
              <span className="text-muted-foreground text-xs">=</span>
              <div className="rounded-md bg-primary/10 border border-primary/20 px-2 py-1 text-center">
                <p className="text-[8px] text-primary">Total</p>
                <p className="text-xs font-bold text-primary">60</p>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-[10px] max-w-[240px]">{TOTAL_TOOLTIP}</TooltipContent>
        </Tooltip>
        <div className="flex items-center justify-center gap-5">
          <SimilarityKnob label="Visual" value="Medium" />
          <SimilarityKnob label="Messaging" value="Medium" />
        </div>
      </div>

      {/* V10: Glass */}
      <div className="rounded-xl border border-white/20 bg-gradient-to-br from-muted/40 to-muted/10 backdrop-blur-sm p-4">
        <p className="text-[8px] text-muted-foreground mb-2">V10 — Glass</p>
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <div className="rounded-lg bg-white/10 border border-white/20 px-3 py-2">
              <p className="text-[9px] text-muted-foreground">Concepts per image</p>
              <p className="text-sm font-semibold">3</p>
            </div>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div className="rounded-lg bg-white/10 border border-white/20 px-3 py-2 cursor-help">
                  <div className="flex items-center gap-1">
                    <p className="text-[9px] text-muted-foreground">Total generated</p>
                    <Info className="h-2.5 w-2.5 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-semibold">60 concepts</p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-[10px] max-w-[240px]">{TOTAL_TOOLTIP}</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-4">
            <SimilarityKnob label="Visual" value="Medium" />
            <SimilarityKnob label="Messaging" value="Medium" />
          </div>
        </div>
      </div>

      {/* ── Generated Concepts Grid (Magazine) ── */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Generated Concepts</p>
        <div className="grid grid-cols-2 gap-1 cursor-pointer rounded-xl overflow-hidden border border-border" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={() => navigate("/concepts/competitor-ad-variation-1")}>
          {PREVIEW_SEEDS.slice(0, 3).map((seed, i) => (
            <div key={i} className="aspect-square relative overflow-hidden">
              <img src={`https://picsum.photos/seed/${seed}/400/400`} alt="" className={cn("h-full w-full object-cover transition-transform duration-500", h && "scale-110")} />
              {h && <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />}
            </div>
          ))}
          <div className={cn("aspect-square flex flex-col items-center justify-center transition-colors duration-300", h ? "bg-primary/10" : "bg-muted/40")}>
            <span className={cn("text-2xl font-bold tracking-tight transition-colors", h ? "text-primary" : "text-muted-foreground/60")}>+57</span>
            <span className={cn("text-[10px] font-medium tracking-wide uppercase mt-1 transition-colors", h ? "text-primary" : "text-muted-foreground/40")}>View All</span>
            {h && <ExternalLink className="h-3.5 w-3.5 text-primary mt-2" />}
          </div>
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
