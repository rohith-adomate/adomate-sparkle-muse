import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ChevronDown, CheckCircle2, Clock, ExternalLink, Eye, Info, Image,
  Package, Sparkles, Database, ListFilter, ImagePlus,
} from "lucide-react";

/* ── Execution mock data types ── */

export interface ExecutionRun {
  id: string;
  number: number;
  status: "success" | "failed" | "running";
  startedAt: string;
  duration: string;
  nodeStatuses: Record<string, "success" | "error" | "running">;
}

export interface ExecutionNodeOutput {
  type: string;
  label: string;
  status: "success" | "error" | "running";
}

/* ── Mock execution runs ── */

export const MOCK_EXECUTIONS: ExecutionRun[] = [
  {
    id: "exec-13", number: 13, status: "success", startedAt: "Mar 18, 2026 · 09:00", duration: "2m 14s",
    nodeStatuses: { "n0": "success", "n1": "success", "n3": "success", "n2b": "success", "n5": "success" },
  },
  {
    id: "exec-12", number: 12, status: "failed", startedAt: "Mar 17, 2026 · 09:00", duration: "1m 42s",
    nodeStatuses: { "n0": "success", "n1": "success", "n3": "success", "n2b": "success", "n5": "error" },
  },
  {
    id: "exec-11", number: 11, status: "success", startedAt: "Mar 16, 2026 · 09:00", duration: "2m 08s",
    nodeStatuses: { "n0": "success", "n1": "success", "n3": "success", "n2b": "success", "n5": "success" },
  },
  {
    id: "exec-10", number: 10, status: "success", startedAt: "Mar 15, 2026 · 09:00", duration: "1m 55s",
    nodeStatuses: { "n0": "success", "n1": "success", "n3": "success", "n2b": "success", "n5": "success" },
  },
  {
    id: "exec-9", number: 9, status: "failed", startedAt: "Mar 14, 2026 · 09:00", duration: "0m 32s",
    nodeStatuses: { "n0": "success", "n1": "error", "n3": "error", "n2b": "success", "n5": "error" },
  },
  {
    id: "exec-8", number: 8, status: "success", startedAt: "Mar 13, 2026 · 09:00", duration: "2m 21s",
    nodeStatuses: { "n0": "success", "n1": "success", "n3": "success", "n2b": "success", "n5": "success" },
  },
  {
    id: "exec-7", number: 7, status: "success", startedAt: "Mar 12, 2026 · 09:00", duration: "1m 48s",
    nodeStatuses: { "n0": "success", "n1": "success", "n3": "success", "n2b": "success", "n5": "success" },
  },
];

export const MOCK_MANUAL_EXECUTIONS: ExecutionRun[] = [
  {
    id: "mexec-5", number: 5, status: "success", startedAt: "Mar 18, 2026 · 11:32", duration: "1m 45s",
    nodeStatuses: { "n0": "success", "n1": "success", "n2": "success" },
  },
  {
    id: "mexec-4", number: 4, status: "success", startedAt: "Mar 17, 2026 · 14:10", duration: "1m 22s",
    nodeStatuses: { "n0": "success", "n1": "success", "n2": "success" },
  },
  {
    id: "mexec-3", number: 3, status: "failed", startedAt: "Mar 16, 2026 · 10:05", duration: "0m 48s",
    nodeStatuses: { "n0": "success", "n1": "success", "n2": "error" },
  },
];

/* ── Per-node output content ── */

interface ExecutionOutputPanelProps {
  open: boolean;
  onClose: () => void;
  node: ExecutionNodeOutput | null;
  runNumber?: number;
}

/* Schedule output */
function ScheduleOutput() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-lg border border-border bg-card p-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Status</p>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
          <span className="text-xs font-medium">Triggered successfully</span>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card p-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Run started</p>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs">Mar 18, 2026 · 09:00 AM</span>
        </div>
      </div>
    </div>
  );
}

/* Dataset output */
function DatasetOutput() {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-card p-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Active filters at runtime</p>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-[10px] gap-1">
            <img src="https://logo.clearbit.com/cerave.com" alt="" className="h-3 w-3 rounded-full" /> CeraVe
          </Badge>
          <Badge variant="secondary" className="text-[10px] gap-1">
            <img src="https://logo.clearbit.com/theordinary.com" alt="" className="h-3 w-3 rounded-full" /> The Ordinary
          </Badge>
          <Badge variant="outline" className="text-[10px]">Last 30 days</Badge>
          <Badge variant="outline" className="text-[10px]">Min. reach: 1,000</Badge>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card p-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Result</p>
        <p className="text-xs">12 ads matched filters (of 48 total scraped)</p>
        <p className="text-[10px] text-muted-foreground mt-1">Full dataset view coming in a future update.</p>
      </div>
    </div>
  );
}

/* Select output */
const SELECTED_ADS = [
  { id: 1, brand: "CeraVe", headline: "Hydrating Facial Cleanser — Dermatologist Recommended", reach: "245K", format: "Image" },
  { id: 2, brand: "The Ordinary", headline: "Niacinamide 10% + Zinc 1% — Target Blemishes", reach: "312K", format: "Image" },
  { id: 3, brand: "The Ordinary", headline: "AHA 30% + BHA 2% Peeling Solution", reach: "198K", format: "Image" },
  { id: 4, brand: "CeraVe", headline: "Moisturizing Cream for Dry Skin Relief", reach: "189K", format: "Image" },
  { id: 5, brand: "CeraVe", headline: "AM Facial Moisturizing Lotion with SPF 30", reach: "47K", format: "Image" },
  { id: 6, brand: "CeraVe", headline: "SA Smoothing Cleanser — Bumpy Skin", reach: "68K", format: "Image" },
  { id: 7, brand: "The Ordinary", headline: "Hyaluronic Acid 2% + B5 — Intense Hydration", reach: "23K", format: "Image" },
  { id: 8, brand: "The Ordinary", headline: "Retinol 0.5% in Squalane — Anti-Aging", reach: "15K", format: "Image" },
  { id: 9, brand: "CeraVe", headline: "Eye Repair Cream — Dark Circles", reach: "4.2K", format: "Image" },
  { id: 10, brand: "The Ordinary", headline: "Glycolic Acid 7% Toning Solution", reach: "7.3K", format: "Image" },
];

function SelectOutput() {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-card p-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Settings used</p>
        <p className="text-xs">Top <span className="font-semibold">10</span> ads ranked by <span className="font-semibold">new reach</span></p>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="h-7 text-[9px] font-bold uppercase tracking-wider w-8">#</TableHead>
              <TableHead className="h-7 text-[9px] font-bold uppercase tracking-wider w-24">Brand</TableHead>
              <TableHead className="h-7 text-[9px] font-bold uppercase tracking-wider">Headline</TableHead>
              <TableHead className="h-7 text-[9px] font-bold uppercase tracking-wider w-16 text-right">Reach</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SELECTED_ADS.map((ad) => (
              <TableRow key={ad.id} className="hover:bg-muted/20">
                <TableCell className="py-1.5 text-[10px] text-muted-foreground">{ad.id}</TableCell>
                <TableCell className="py-1.5 text-[10px] font-medium">{ad.brand}</TableCell>
                <TableCell className="py-1.5 text-[10px] line-clamp-1">{ad.headline}</TableCell>
                <TableCell className="py-1.5 text-[10px] text-right font-medium">{ad.reach}</TableCell>
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
  { name: "Hydra Glow Serum", images: 1, knowledge: "Lightweight hydrating serum with hyaluronic acid for daily use. Targets young professionals." },
  { name: "Retinol Night Recovery Mask", images: 3, knowledge: "Premium night recovery mask with retinol. Anti-aging focus, 35+ demographic." },
];

function ProductDataOutput() {
  return (
    <div className="space-y-2">
      {SELECTED_PRODUCTS.map((p, i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-3 flex items-start gap-3">
          <div className="h-10 w-10 rounded-md overflow-hidden bg-muted shrink-0">
            <img
              src={`https://picsum.photos/seed/prod-${i}/80/80`}
              alt={p.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold">{p.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className="text-[9px] gap-0.5 py-0 px-1.5">
                <Image className="h-2.5 w-2.5" /> {p.images} image{p.images !== 1 ? "s" : ""}
              </Badge>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <button className="text-[9px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5">
                    <Info className="h-2.5 w-2.5" /> Knowledge
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[260px] text-[10px]">
                  {p.knowledge}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* Generate Ad Variations output */
const GENERATED_CONCEPTS = [
  { id: "c1", title: "Bold Statement", seed: "bold-statement" },
  { id: "c2", title: "Social Proof UGC", seed: "social-proof" },
  { id: "c3", title: "Gradient Pop", seed: "gradient-pop" },
  { id: "c4", title: "Street Style", seed: "street-style" },
];

function GenerateVariationsOutput() {
  const navigate = useNavigate();
  const [previewIdx, setPreviewIdx] = useState(0);

  return (
    <div className="space-y-3">
      {/* Settings summary */}
      <div className="rounded-lg border border-border bg-card p-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Settings used</p>
        <div className="flex flex-wrap gap-2 text-[10px]">
          <Badge variant="outline" className="text-[10px]">6 concepts per image</Badge>
          <Badge variant="outline" className="text-[10px]">Visual: Medium</Badge>
          <Badge variant="outline" className="text-[10px]">Messaging: Medium</Badge>
        </div>
      </div>

      {/* Preview with toggle */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="aspect-[4/3] relative bg-muted">
          <img
            src={`https://picsum.photos/seed/${GENERATED_CONCEPTS[previewIdx].seed}/400/300`}
            alt={GENERATED_CONCEPTS[previewIdx].title}
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
            <p className="text-xs font-semibold text-white">{GENERATED_CONCEPTS[previewIdx].title}</p>
          </div>
        </div>
        {/* Thumbnails toggle */}
        <div className="flex items-center gap-1.5 p-2 border-t border-border">
          {GENERATED_CONCEPTS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setPreviewIdx(i)}
              className={cn(
                "h-10 w-10 rounded-md overflow-hidden border-2 transition-all shrink-0",
                i === previewIdx ? "border-primary ring-1 ring-primary/30" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <img
                src={`https://picsum.photos/seed/${c.seed}/80/80`}
                alt={c.title}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
          <div className="flex-1" />
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[10px] gap-1 shrink-0"
            onClick={() => navigate("/concepts/competitor-ad-variation-1")}
          >
            <ExternalLink className="h-3 w-3" /> View all concepts
          </Button>
        </div>
      </div>
    </div>
  );
}

/* Manual Image Input output */
function ManualInputOutput() {
  const images = [
    "https://picsum.photos/seed/manual-1/200/200",
    "https://picsum.photos/seed/manual-2/200/200",
    "https://picsum.photos/seed/manual-3/200/200",
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-card p-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Uploaded images</p>
        <p className="text-xs text-muted-foreground">{images.length} images provided at runtime</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((src, i) => (
          <div key={i} className="aspect-square rounded-md overflow-hidden border border-border bg-muted">
            <img src={src} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
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

/* ── Main component ── */

export default function ExecutionOutputPanel({ open, onClose, node }: ExecutionOutputPanelProps) {
  if (!open || !node) return null;

  const Icon = NODE_ICONS[node.type] || Database;

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
      <div className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm" onClick={onClose} />

      {/* Bottom panel */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-2xl",
          "transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full"
        )}
        style={{ height: "45vh", minHeight: 280, maxHeight: "55vh" }}
      >
        {/* Handle */}
        <div className="flex items-center justify-center py-1.5 cursor-grab">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-3">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-bold">{node.label}</h3>
            <Badge
              variant={node.status === "success" ? "default" : node.status === "error" ? "destructive" : "secondary"}
              className="text-[9px] px-1.5 py-0"
            >
              {node.status === "success" ? "Completed" : node.status === "error" ? "Failed" : "Running"}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onClose}>
            <ChevronDown className="h-3.5 w-3.5 mr-1" /> Close
          </Button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 pb-6" style={{ maxHeight: "calc(45vh - 72px)" }}>
          {renderOutput()}
        </div>
      </div>
    </>
  );
}
