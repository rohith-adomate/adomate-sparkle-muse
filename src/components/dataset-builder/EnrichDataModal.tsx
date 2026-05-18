import { useMemo, useRef, useState, KeyboardEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type EnrichSuggestion = { label: string; prompt: string; column: string; allowedValues: string[] };

const DEFAULT_SUGGESTIONS: EnrichSuggestion[] = [
  {
    label: "Ad Objective",
    column: "Ad Objective",
    allowedValues: ["Awareness", "Consideration", "Conversion", "Retargeting", "Retention"],
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
    allowedValues: [
      "Product Showcase","Comparison","Problem-Solution","Social Proof","Educational","Offer-Led","Typographic","Native Mimicry","Lifestyle","Narrative","Curiosity","Cultural","Structured","Tactical",
    ],
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
    allowedValues: [
      "Discount","Free Shipping","Free Gift","Bundle Deal","Limited Time Sale","Promo Code","Trial Offer","Loyalty / Member Offer","No Offer",
    ],
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
  suggestions?: EnrichSuggestion[];
}

const ALLOWED_LINE_RE = /Allowed values:\s*([^\n]*)/i;

// Parse "Allowed values: a, b, c" from any prompt (first occurrence wins).
function parseAllowedValues(text: string): string[] | null {
  const match = text.match(ALLOWED_LINE_RE);
  if (!match) return null;
  const list = match[1]
    .split(/,\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length > 0 ? list : null;
}

// Write a values array back into a prompt's "Allowed values:" line.
// - If the line exists: replace it (or remove the whole line when values is empty).
// - If missing and values is non-empty: append on a new line.
function writeAllowedValues(text: string, values: string[]): string {
  const line = `Allowed values: ${values.join(", ")}`;
  if (ALLOWED_LINE_RE.test(text)) {
    if (values.length === 0) {
      // Remove the line entirely (and a trailing blank line above it if present).
      return text.replace(/\n?\n?Allowed values:\s*[^\n]*/i, "").trimEnd();
    }
    return text.replace(ALLOWED_LINE_RE, line);
  }
  if (values.length === 0) return text;
  const sep = text.trim().length === 0 ? "" : "\n\n";
  return `${text.trimEnd()}${sep}${line}`;
}

export default function EnrichDataModal({ open, onOpenChange, totalRows, onRun, suggestions }: Props) {
  const SUGGESTIONS = suggestions ?? DEFAULT_SUGGESTIONS;
  const [prompt, setPrompt] = useState("");
  const [columnName, setColumnName] = useState("");
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [confirmAll, setConfirmAll] = useState(false);
  const [valuesExpanded, setValuesExpanded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newValue, setNewValue] = useState("");
  const newValueRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setPrompt("");
    setColumnName("");
    setSelectedChip(null);
    setConfirmAll(false);
    setValuesExpanded(false);
    setAdding(false);
    setNewValue("");
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
      setValuesExpanded(false);
      return;
    }
    setSelectedChip(s.prompt);
    setPrompt(s.prompt);
    setColumnName(s.column);
    setValuesExpanded(false);
  };

  const allowedValues = useMemo(() => parseAllowedValues(prompt), [prompt]);
  const COLLAPSE_THRESHOLD = 8;
  const shouldCollapse = (allowedValues?.length ?? 0) > COLLAPSE_THRESHOLD;
  const showValues = !!allowedValues;
  const isExpanded = !shouldCollapse || valuesExpanded;

  const canRun = prompt.trim().length > 0 && columnName.trim().length > 0;

  const updateValues = (next: string[]) => {
    setPrompt((p) => writeAllowedValues(p, next));
    setSelectedChip(null); // any edit unlinks the preset
  };

  const removeValue = (v: string) => {
    if (!allowedValues) return;
    updateValues(allowedValues.filter((x) => x !== v));
  };

  const commitNewValue = () => {
    const trimmed = newValue.trim().replace(/,$/, "").trim();
    if (!trimmed) {
      setAdding(false);
      setNewValue("");
      return;
    }
    const current = allowedValues ?? [];
    if (current.some((v) => v.toLowerCase() === trimmed.toLowerCase())) {
      setNewValue("");
      return;
    }
    updateValues([...current, trimmed]);
    setNewValue("");
  };

  const handleNewValueKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitNewValue();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setAdding(false);
      setNewValue("");
    } else if (e.key === "Backspace" && newValue === "" && allowedValues && allowedValues.length > 0) {
      e.preventDefault();
      removeValue(allowedValues[allowedValues.length - 1]);
    }
  };

  const clearAllValues = () => updateValues([]);

  const startAddFresh = () => {
    setAdding(true);
    setValuesExpanded(true);
    setTimeout(() => newValueRef.current?.focus(), 0);
  };

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

          <div className="space-y-2">
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

            {(showValues || adding) ? (
              <div className="px-1 pt-1">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[10.5px] uppercase tracking-wider text-muted-foreground/70 font-medium">
                    Will output one of
                  </span>
                  <span className="text-[10.5px] text-muted-foreground/50">
                    · {allowedValues?.length ?? 0}
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    {shouldCollapse && (
                      <button
                        type="button"
                        onClick={() => setValuesExpanded((v) => !v)}
                        className="text-[10.5px] text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5 transition-colors"
                      >
                        {isExpanded ? "Hide" : "Show all"}
                        <ChevronDown
                          className={cn(
                            "h-3 w-3 transition-transform",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </button>
                    )}
                    {showValues && (
                      <button
                        type="button"
                        onClick={clearAllValues}
                        className="text-[10.5px] text-muted-foreground hover:text-destructive transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                {isExpanded && (
                  <div className="flex flex-wrap gap-1 items-center">
                    {(allowedValues ?? []).map((v) => (
                      <span
                        key={v}
                        className="group inline-flex items-center gap-1 text-[11px] leading-none pl-2 pr-1 py-1 rounded-full border border-border bg-muted/50 text-foreground/75 hover:border-foreground/30 transition-colors"
                      >
                        {v}
                        <button
                          type="button"
                          onClick={() => removeValue(v)}
                          aria-label={`Remove ${v}`}
                          className="rounded-full p-0.5 text-muted-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-colors"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ))}
                    {adding ? (
                      <input
                        ref={newValueRef}
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        onKeyDown={handleNewValueKey}
                        onBlur={commitNewValue}
                        placeholder="Add value…"
                        className="text-[11px] leading-none px-2 py-1 rounded-full border border-dashed border-primary/50 bg-primary/5 text-foreground/80 placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary min-w-[90px]"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setAdding(true);
                          setValuesExpanded(true);
                          setTimeout(() => newValueRef.current?.focus(), 0);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] leading-none px-2 py-1 rounded-full border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                      >
                        <Plus className="h-2.5 w-2.5" />
                        Add
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="px-1 pt-1">
                <button
                  type="button"
                  onClick={startAddFresh}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  Add values to constrain answers
                </button>
              </div>
            )}
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
