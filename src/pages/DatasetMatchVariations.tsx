import { Database, CheckCircle2, BarChart3, Layers } from "lucide-react";

const MATCHED = 12;
const TOTAL = 48;
const PCT = Math.round((MATCHED / TOTAL) * 100);

/* ── Variation 1: Progress bar ── */
function Variation1() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-3.5 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold">Results</span>
        </div>
        <span className="text-[10px] text-muted-foreground">{MATCHED} of {TOTAL} ads</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${PCT}%` }} />
      </div>
      <p className="text-[10px] text-muted-foreground">{PCT}% of scraped ads passed your filters</p>
    </div>
  );
}

/* ── Variation 2: Big number focus ── */
function Variation2() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-3.5 flex items-center gap-4">
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <span className="text-lg font-bold text-primary">{MATCHED}</span>
      </div>
      <div>
        <p className="text-xs font-semibold">Ads matched</p>
        <p className="text-[10px] text-muted-foreground">Filtered from {TOTAL} scraped ads across all sources</p>
      </div>
    </div>
  );
}

/* ── Variation 3: Two-stat split ── */
function Variation3() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-3.5">
      <div className="grid grid-cols-2 divide-x divide-border">
        <div className="pr-3 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Matched</span>
          </div>
          <span className="text-lg font-bold text-foreground">{MATCHED}</span>
        </div>
        <div className="pl-3 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <Layers className="h-3 w-3 text-muted-foreground" />
            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Scraped</span>
          </div>
          <span className="text-lg font-bold text-muted-foreground">{TOTAL}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Variation 4: Inline badge row ── */
function Variation4() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm px-3.5 py-3 flex items-center gap-2.5">
      <Database className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <span className="text-xs font-medium">
        <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary px-1.5 py-0.5 font-bold text-[11px]">{MATCHED}</span>
        {" "}qualifying ads from{" "}
        <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 font-bold text-[11px] text-muted-foreground">{TOTAL}</span>
        {" "}collected
      </span>
    </div>
  );
}

/* ── Variation 5: Donut-style indicator ── */
function Variation5() {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c - (PCT / 100) * c;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-3.5 flex items-center gap-3.5">
      <div className="relative shrink-0" style={{ width: 44, height: 44 }}>
        <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
          <circle cx="22" cy="22" r={r} fill="none" className="stroke-muted" strokeWidth="4" />
          <circle cx="22" cy="22" r={r} fill="none" className="stroke-primary" strokeWidth="4" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-foreground">{PCT}%</span>
      </div>
      <div>
        <p className="text-xs font-semibold">{MATCHED} ads qualified</p>
        <p className="text-[10px] text-muted-foreground">{TOTAL} total ads scraped from sources</p>
      </div>
    </div>
  );
}

const variations = [
  { id: 1, name: "Progress Bar", component: Variation1 },
  { id: 2, name: "Big Number", component: Variation2 },
  { id: 3, name: "Two-Stat Split", component: Variation3 },
  { id: 4, name: "Inline Badges", component: Variation4 },
  { id: 5, name: "Donut Indicator", component: Variation5 },
];

export default function DatasetMatchVariations() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Dataset Match Summary</h1>
          <p className="text-sm text-muted-foreground mt-1">Choose your preferred variation</p>
        </div>
        {variations.map(({ id, name, component: Comp }) => (
          <div key={id} className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Variation {id} — {name}</p>
            <Comp />
          </div>
        ))}
      </div>
    </div>
  );
}
