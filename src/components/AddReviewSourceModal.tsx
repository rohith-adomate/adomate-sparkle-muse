import { useEffect, useRef, useState, KeyboardEvent, ClipboardEvent } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, ArrowRight, X, Check, Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------- Public types ----------
export type AddedSource = {
  source: "Trustpilot" | "Amazon";
  url: string;
  identifier: string;
  region?: { code: string; flag: string; domain: string };
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (sources: AddedSource[]) => void;
}

const AMAZON_REGIONS: Record<string, { code: string; flag: string }> = {
  "amazon.com": { code: "US", flag: "🇺🇸" },
  "amazon.de": { code: "DE", flag: "🇩🇪" },
  "amazon.co.uk": { code: "UK", flag: "🇬🇧" },
  "amazon.fr": { code: "FR", flag: "🇫🇷" },
  "amazon.com.be": { code: "BE", flag: "🇧🇪" },
  "amazon.nl": { code: "NL", flag: "🇳🇱" },
  "amazon.es": { code: "ES", flag: "🇪🇸" },
  "amazon.it": { code: "IT", flag: "🇮🇹" },
};

type Detected =
  | { ok: true; source: "Trustpilot"; url: string; identifier: string }
  | { ok: true; source: "Amazon"; url: string; identifier: string; region: { code: string; flag: string; domain: string } }
  | { ok: false; reason: string };

function detect(raw: string): Detected {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, reason: "Paste a Trustpilot or Amazon URL to continue." };

  const tp = trimmed.match(/trustpilot\.com\/review\/([^/?#\s]+)/i);
  if (tp) {
    const slug = tp[1].toLowerCase().replace(/^www\./, "");
    return { ok: true, source: "Trustpilot", url: trimmed, identifier: slug };
  }

  const amazonHost = trimmed.match(/(amazon\.[a-z.]+)/i);
  const asin = trimmed.match(/\/dp\/([A-Z0-9]{10})/i);
  if (amazonHost && asin) {
    const domain = amazonHost[1].toLowerCase().replace(/^www\./, "");
    const region = AMAZON_REGIONS[domain] ?? { code: "??", flag: "🌐" };
    return {
      ok: true,
      source: "Amazon",
      url: trimmed,
      identifier: asin[1].toUpperCase(),
      region: { ...region, domain },
    };
  }

  return { ok: false, reason: "Paste a Trustpilot or Amazon URL to continue." };
}

function TrustpilotIcon({ size = 28 }: { size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{ width: size, height: size, backgroundColor: "#00b67a" }}
      aria-label="Trustpilot"
    >
      <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="white" aria-hidden>
        <polygon points="12,2 14.9,8.6 22,9.3 16.5,14 18.2,21 12,17.3 5.8,21 7.5,14 2,9.3 9.1,8.6" />
      </svg>
    </div>
  );
}

function AmazonIcon({ size = 28 }: { size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{ width: size, height: size, backgroundColor: "#FF9900" }}
      aria-label="Amazon"
    >
      <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
        <path d="M5 14c2.5 2.5 6 3.5 9 3.5s5.5-1 7-2.5" />
        <path d="M17 17.5c.7-.4 1.3-.7 1.8-.7" />
      </svg>
    </div>
  );
}

type DetectedRow = {
  id: string;
  source: "Trustpilot" | "Amazon";
  url: string;
  identifier: string;
  region?: { code: string; flag: string; domain: string };
  status: "fetching" | "ready";
  reviews?: number;
  rating?: number;
};

function seededStats(key: string): { reviews: number; rating: number } {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  const reviews = 200 + (h % 9800);
  const rating = Math.round((35 + ((h >> 8) % 16))) / 10;
  return { reviews, rating: Math.min(5, rating) };
}

function truncateUrl(url: string, max = 38): string {
  const clean = url.replace(/^https?:\/\//i, "");
  if (clean.length <= max) return clean;
  return clean.slice(0, max) + "...";
}

export default function AddReviewSourceModal({ open, onOpenChange, onAdd }: Props) {
  const [input, setInput] = useState("");
  const [rows, setRows] = useState<DetectedRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const errorTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setInput("");
        setRows([]);
        setError(null);
      }, 200);
      return () => clearTimeout(t);
    }
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const flashError = (msg: string) => {
    setError(msg);
    if (errorTimerRef.current) window.clearTimeout(errorTimerRef.current);
    errorTimerRef.current = window.setTimeout(() => setError(null), 3000);
  };

  const tryAdd = (raw: string) => {
    const d = detect(raw);
    if (d.ok !== true) {
      flashError((d as Extract<Detected, { ok: false }>).reason);
      return;
    }
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    let added = false;
    setRows(prev => {
      if (prev.some(r => r.source === d.source && r.identifier === d.identifier)) return prev;
      added = true;
      const next: DetectedRow = d.source === "Trustpilot"
        ? { id, source: "Trustpilot", url: d.url, identifier: d.identifier, status: "fetching" }
        : { id, source: "Amazon", url: d.url, identifier: d.identifier, region: d.region, status: "fetching" };
      return [...prev, next];
    });
    setInput("");
    setError(null);
    requestAnimationFrame(() => inputRef.current?.focus());

    if (added) {
      const delay = 900 + Math.random() * 900;
      window.setTimeout(() => {
        setRows(prev => prev.map(r => {
          if (r.id !== id) return r;
          const stats = seededStats(`${r.source}:${r.identifier}`);
          return { ...r, status: "ready", reviews: stats.reviews, rating: stats.rating };
        }));
      }, delay);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim()) tryAdd(input);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").trim();
    if (!pasted) return;
    e.preventDefault();
    tryAdd(pasted);
  };

  const removeRow = (id: string) => setRows(prev => prev.filter(r => r.id !== id));

  const handleSubmit = () => {
    if (rows.length === 0) return;
    const sources: AddedSource[] = rows.map(r => ({
      source: r.source,
      url: r.url,
      identifier: r.identifier,
      region: r.region,
    }));
    onAdd(sources);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 overflow-hidden" style={{ maxWidth: 560, width: "calc(100vw - 2rem)" }}>
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-base font-semibold leading-tight">Track reviews from Trustpilot or Amazon</h2>
        </div>

        <div className="px-6 pb-4 space-y-3">
          <div className="relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Paste a Trustpilot or Amazon URL..."
              className={cn(
                "text-sm pr-20 truncate",
                error && "border-destructive focus-visible:ring-destructive/30",
              )}
            />
            {input.trim() ? (
              <button
                type="button"
                onClick={() => tryAdd(input)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Press ↵
              </button>
            ) : (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground/60 pointer-events-none">
                ⌘V to paste
              </span>
            )}
          </div>

          {error && (
            <p className="text-[11px] text-destructive flex items-center gap-1.5 animate-fade-in">
              <AlertTriangle className="h-3 w-3" />
              {error}
            </p>
          )}

          {rows.length > 0 && (
            <div
              className="divide-y divide-border overflow-y-auto w-full min-w-0 -mx-1 px-1 scroll-smooth"
              style={{ maxHeight: 220 }}
            >
              {rows.map(r => (
                <div
                  key={r.id}
                  title={r.url}
                  className="group flex items-center gap-2.5 px-1 animate-fade-in min-w-0 w-full"
                  style={{ height: 36 }}
                >
                  {r.source === "Trustpilot" ? <TrustpilotIcon size={28} /> : <AmazonIcon size={28} />}
                  <span className="text-sm font-medium truncate flex-1 min-w-0">{truncateUrl(r.url, 28)}</span>
                  <span className="text-muted-foreground text-xs shrink-0">·</span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        r.source === "Amazon" ? "bg-amber-500" : "bg-emerald-500",
                      )}
                    />
                    {r.source}
                    {r.source === "Amazon" && r.region && (
                      <span className="ml-1 text-sm leading-none">{r.region.flag}</span>
                    )}
                  </span>
                  <span className="text-muted-foreground text-xs shrink-0">·</span>
                  {r.status === "fetching" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground shrink-0 animate-fade-in">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Fetching...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground shrink-0 animate-fade-in tabular-nums">
                      {r.reviews?.toLocaleString()} reviews
                      <span className="text-muted-foreground/60">·</span>
                      <span className="inline-flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {r.rating?.toFixed(1)}
                      </span>
                      <Check className="h-3 w-3 text-emerald-500" />
                    </span>
                  )}
                  <button
                    onClick={() => removeRow(r.id)}
                    className="text-muted-foreground hover:text-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t px-6 py-3 flex items-center justify-between bg-background">
          <button
            onClick={() => onOpenChange(false)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={rows.length === 0}
            className="gap-1.5"
          >
            Track {rows.length > 0 ? `${rows.length} ` : ""}source{rows.length === 1 ? "" : "s"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
