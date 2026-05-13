import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTIONS: { label: string; prompt: string; column: string }[] = [
  {
    label: "Ad Objective",
    column: "Ad Objective",
    prompt: `You are an expert Meta media buyer. Based on this ad's format, days online, active status, landing page, headline, and visual — classify its campaign objective.

Use these definitions:
- Awareness: broad reach, brand storytelling, no strong CTA, lifestyle visuals
- Consideration: drives traffic, engagement or interest — product education, "learn more", blog or collection pages
- Conversion: direct purchase or sign-up push — "shop now", "get X", product or checkout landing page
- Retargeting: re-engages past visitors — urgency, reminders, specific product the user likely already saw
- Retention: targets existing customers — loyalty, repurchase, upsell, "welcome back" tone

If the ad could fit multiple categories, pick the most dominant one. Return only one of the five values.

Allowed values: Awareness, Consideration, Conversion, Retargeting, Retention`,
  },
  {
    label: "Creative Category",
    column: "Creative Category",
    prompt: `You are an expert Meta creative strategist. Based on this ad's format, headline, visual, and landing page — classify its creative category.

Use these definitions:
- Product Showcase: hero shot of the product, clean background, features front and center
- Comparison: before/after, side-by-side, or explicit contrast between two states or products
- Problem-Solution: opens with a pain point or frustration, resolves it with the product
- Social Proof: reviews, ratings, UGC, testimonials, influencer endorsement, or "X people love this"
- Educational: teaches something — how-to, ingredient breakdown, tutorial, tips
- Offer-Led: discount, bundle, free gift, limited time deal is the hero of the ad
- Typographic: copy-driven creative, text is the main visual element, minimal imagery
- Native Mimicry: designed to look like organic content — selfie style, TikTok-like, lo-fi, no brand polish
- Lifestyle: aspirational scene, product in context of a desirable life, emotion over information
- Narrative: storytelling arc — character, tension, resolution; mini film or series feel
- Curiosity: withholds information to drive clicks — teaser, open loop, unexpected hook
- Cultural: taps into a trend, meme, moment, holiday, or community reference
- Structured: grid layout, checklist, bullet points, infographic — information-dense and organized
- Tactical: urgency or scarcity mechanics — countdown, "last chance", stock warnings, deadlines

If the ad could fit multiple categories, pick the most dominant one. If unclear, pick the category that best describes the primary creative mechanic. Return only one of the fourteen values.

Allowed values: Product Showcase, Comparison, Problem-Solution, Social Proof, Educational, Offer-Led, Typographic, Native Mimicry, Lifestyle, Narrative, Curiosity, Cultural, Structured, Tactical`,
  },
  {
    label: "Offer Type",
    column: "Offer Type",
    prompt: `Look at this ad's headline, visual, and landing page. Identify if it contains a promotional offer and classify it.

Use these definitions:
- Discount: percentage or dollar amount off ("20% off", "$10 off", "half price")
- Free Shipping: shipping cost removed as the main incentive
- Free Gift: bonus product or sample included with purchase ("free mini with every order")
- Bundle Deal: multiple products explicitly sold together at a better price than buying separately — must include a clear saving or quantity mechanic ("buy 2 get 1", "save when you bundle", "kit for $X"). Do NOT classify as Bundle Deal if the ad simply features a set or collection that is a standard product with no stated saving
- Limited Time Sale: time-bound or seasonal promotion ("Black Friday", "sale ends Sunday", "today only")
- Promo Code: a code or voucher is featured ("use code X", "enter at checkout")
- Trial Offer: low-risk entry ("try free", "first month free", "sample for $1")
- Loyalty / Member Offer: exclusive deal for existing customers or members
- No Offer: no promotional mechanic present

If multiple offers are present, return the most prominent one. When in doubt, prefer No Offer over Bundle Deal. Return only one of the values above.

Allowed values: Discount, Free Shipping, Free Gift, Bundle Deal, Limited Time Sale, Promo Code, Trial Offer, Loyalty / Member Offer, No Offer`,
  },
];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  totalRows: number;
  onRun: (args: { columnName: string; prompt: string; scope: "test" | "all" }) => void;
}

export default function EnrichDataModal({ open, onOpenChange, totalRows, onRun }: Props) {
  const [prompt, setPrompt] = useState("");
  const [columnName, setColumnName] = useState("");
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [confirmAll, setConfirmAll] = useState(false);

  const reset = () => {
    setPrompt("");
    setColumnName("");
    setSelectedChip(null);
    setConfirmAll(false);
  };

  const handleClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const pickChip = (s: { prompt: string; column: string }) => {
    if (selectedChip === s.prompt) {
      setSelectedChip(null);
      setPrompt("");
      setColumnName("");
      return;
    }
    setSelectedChip(s.prompt);
    setPrompt(s.prompt);
    setColumnName(s.column);
  };

  const canRun = prompt.trim().length > 0 && columnName.trim().length > 0;

  const runScope = (scope: "test" | "all") => {
    if (!canRun) return;
    onRun({ columnName: columnName.trim(), prompt: prompt.trim(), scope });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[480px] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-base font-semibold">Add an AI column</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          <div className="space-y-1">
            <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70">
              Column header
            </label>
            <Input
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              placeholder="e.g. Offer present"
              className="h-8 text-[12px] font-medium uppercase tracking-wide border-0 border-b border-border/60 rounded-none px-0 shadow-none focus-visible:ring-0 focus-visible:border-primary bg-transparent placeholder:text-muted-foreground/50 placeholder:font-normal placeholder:normal-case placeholder:tracking-normal transition-colors"
            />
          </div>

          <div className="rounded-xl border border-border bg-background shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
            <div className="flex items-start gap-2 px-3 py-3">
              <Sparkles className="h-4 w-4 text-primary shrink-0 mt-1" />
              <textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 480) + "px";
                }}
                placeholder="Ask anything about each row…"
                rows={5}
                className="flex-1 resize-none bg-transparent text-sm placeholder:text-muted-foreground/70 focus:outline-none min-h-[7rem] max-h-[30rem] overflow-y-auto leading-relaxed"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => {
              const active = selectedChip === s.prompt;
              return (
                <button
                  key={s.prompt}
                  type="button"
                  onClick={() => pickChip(s)}
                  className={cn(
                    "text-[12px] font-medium px-3 py-1.5 rounded-full border-[1.5px] transition-all",
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-sm scale-[1.02]"
                      : "border-primary/60 text-primary bg-primary/5 hover:bg-primary/10 hover:border-primary"
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {!confirmAll ? (
            <div className="flex items-center justify-between gap-3 border-t border-border/60 -mx-1 px-1 pt-3">
              <span className="text-[11px] text-muted-foreground">1 credit per row</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canRun}
                  onClick={() => runScope("test")}
                  className="text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Test 10 rows
                </Button>
                <Button
                  size="sm"
                  disabled={!canRun}
                  onClick={() => setConfirmAll(true)}
                  className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  All {totalRows} rows →
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2.5">
              <p className="text-[12px] text-foreground/90">
                Run on all <span className="font-semibold">{totalRows} rows</span> for <span className="font-semibold">{totalRows} credits</span>?
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmAll(false)}
                  className="text-[11px] text-muted-foreground hover:text-foreground px-2"
                >
                  Cancel
                </button>
                <Button
                  size="sm"
                  onClick={() => runScope("all")}
                  className="h-7 bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                >
                  Confirm and run
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
