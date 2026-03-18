import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface NodeOutputDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: {
    label: string;
    type: string;
    status?: "success" | "running" | "error";
  } | null;
}

/* Mock output data per node type */
const MOCK_OUTPUTS: Record<string, { duration: string; timestamp: string; entries: { label: string; preview: string }[] }> = {
  schedule: {
    duration: "0.1s",
    timestamp: "10 Mar 2026 09:00 AM",
    entries: [
      { label: "Trigger event", preview: "Scheduled run triggered successfully." },
    ],
  },
  "brand-knowledge": {
    duration: "1.2s",
    timestamp: "10 Mar 2026 09:00 AM",
    entries: [
      { label: "Logo", preview: "adomate-logo.png (1 file loaded)" },
      { label: "Brand colors", preview: "#DB2777, #1E1E2F, #FFFFFF" },
      { label: "Style visuals", preview: "3 brand style images loaded" },
      { label: "Brand voice", preview: "Bold, modern, confident — targeting young professionals." },
    ],
  },
  "product-data": {
    duration: "2.4s",
    timestamp: "10 Mar 2026 09:01 AM",
    entries: [
      { label: "Products loaded", preview: "4 products fetched from catalog" },
      { label: "Product images", preview: "12 images across all products" },
      { label: "Descriptions", preview: "All product text knowledge included" },
    ],
  },
  "competitor-scrape": {
    duration: "8.7s",
    timestamp: "10 Mar 2026 09:01 AM",
    entries: [
      { label: "Competitors scraped", preview: "Nike, Adidas (2 of 3 selected)" },
      { label: "Config", preview: "Max 10 ads/competitor · Min 7 days active · Min 1,000 reach · All time" },
      { label: "Ads selected", preview: "14 ads matched thresholds (of 42 total)" },
      { label: "Nike — Ad #1", preview: "\"Just Do It — Spring Drop\" · 34 days active · 82K reach · Carousel" },
      { label: "Nike — Ad #2", preview: "\"Air Max Pulse\" · 21 days active · 54K reach · Video" },
      { label: "Nike — Ad #3", preview: "\"Members Week\" · 12 days active · 28K reach · Static image" },
      { label: "Adidas — Ad #1", preview: "\"Ultraboost Light\" · 45 days active · 120K reach · Video" },
      { label: "Adidas — Ad #2", preview: "\"Originals x Pharrell\" · 18 days active · 67K reach · Carousel" },
      { label: "Adidas — Ad #3", preview: "\"Run With Us\" · 9 days active · 15K reach · Static image" },
      { label: "Top themes", preview: "Seasonal drops, athlete endorsements, lifestyle imagery, UGC-style creatives" },
      { label: "Average engagement", preview: "3.2% CTR across selected ads" },
    ],
  },
  "generate-concepts": {
    duration: "14.3s",
    timestamp: "10 Mar 2026 09:02 AM",
    entries: [
      { label: "Prompt used", preview: "Generate modern, scroll-stopping ad creatives for social media. Use bold visuals with clean typography…" },
      { label: "Inputs received", preview: "Brand Knowledge ✓ · Product Data ✓ · Competitor Data ✓" },
      { label: "Concepts generated", preview: "6 ad concepts created" },
      { label: "Concept 1 — \"Winter Warmth\"", preview: "Cozy lifestyle shot with product overlay, warm amber tones. 1080×1080 static image." },
      { label: "Concept 2 — \"Bold Statement\"", preview: "Minimalist design, large typography, brand pink accent on dark background. 1080×1350 static image." },
      { label: "Concept 3 — \"Social Proof\"", preview: "UGC-style creative with testimonial overlay and product in-hand shot. 1080×1080 static image." },
      { label: "Concept 4 — \"Street Style\"", preview: "Urban photography with product placement, editorial crop. Inspired by Nike competitor ads. 1080×1350." },
      { label: "Concept 5 — \"Gradient Pop\"", preview: "Abstract gradient background (#DB2777 → #1E1E2F) with floating product render. 1080×1080." },
      { label: "Concept 6 — \"Holiday Magic\"", preview: "Festive scene with snow particles, gift-wrapped product hero. 1920×1080 landscape." },
      { label: "Tokens used", preview: "4,280 input / 2,150 output tokens" },
      { label: "Cost estimate", preview: "$0.032" },
    ],
  },
  "send-approval": {
    duration: "0.8s",
    timestamp: "10 Mar 2026 09:02 AM",
    entries: [
      { label: "Sent to", preview: "ankit@adomate.ai, sarah@adomate.ai" },
      { label: "Status", preview: "Awaiting approval (2/6 concepts approved)" },
    ],
  },
  "publish-meta": {
    duration: "3.1s",
    timestamp: "10 Mar 2026 09:05 AM",
    entries: [
      { label: "Published ads", preview: "2 ads published to Meta Ads Manager" },
      { label: "Campaign", preview: "Christmas Campaign — Ad Set: Holiday Promos" },
      { label: "Meta Ad IDs", preview: "act_12345_001, act_12345_002" },
    ],
  },
};

const statusConfig = {
  success: { icon: CheckCircle2, label: "Completed", color: "text-success" },
  running: { icon: Loader2, label: "Running", color: "text-primary" },
  error: { icon: AlertCircle, label: "Failed", color: "text-destructive" },
};

export default function NodeOutputDrawer({ open, onOpenChange, node }: NodeOutputDrawerProps) {
  if (!node) return null;

  const output = MOCK_OUTPUTS[node.type];
  const status = node.status || "success";
  const StatusIcon = statusConfig[status].icon;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[380px] sm:w-[420px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-base">{node.label} — Output</SheetTitle>
        </SheetHeader>

        {/* Status bar */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 mb-5">
          <div className="flex items-center gap-2">
            <StatusIcon className={`h-4 w-4 ${statusConfig[status].color} ${status === "running" ? "animate-spin" : ""}`} />
            <span className="text-xs font-medium">{statusConfig[status].label}</span>
          </div>
          {output && (
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{output.duration}</span>
              <span>{output.timestamp}</span>
            </div>
          )}
        </div>

        {/* Output entries */}
        {output ? (
          <div className="space-y-3">
            {output.entries.map((entry, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{entry.label}</p>
                <p className="text-xs text-foreground leading-relaxed">{entry.preview}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-xs">No output data available for this node.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
