import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTIONS: { label: string; prompt: string; column: string }[] = [
  {
    label: "Offer present",
    prompt:
      "Does this ad contain a promotional offer? Includes discounts, free trials, limited-time deals, BOGO, bundles, coupons, or gift-with-purchase. Answer only: yes or no.",
    column: "Offer present",
  },
  {
    label: "CTA text",
    prompt:
      "What is the primary call-to-action in this ad? Extract exact CTA text if visible. If not, infer the intended action in 1–4 words. If none, return: none.",
    column: "CTA text",
  },
  {
    label: "Ad objective",
    prompt:
      "What is this ad's most likely marketing objective? Choose one from: Awareness, Consideration, Conversion, Retargeting, Retention. Return only the single best match.",
    column: "Ad objective",
  },
  {
    label: "Creative category",
    prompt:
      "Classify this ad into up to 2 creative categories from: Product Showcase, Comparison, Problem–Solution, Social Proof, Educational, Offer-Led, Typographic, Native Mimicry, Lifestyle, Narrative, Curiosity, Cultural, Structured, Tactical. Return as a comma-separated list.",
    column: "Creative category",
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
