import { CheckCircle2, Clock, Calendar, Zap, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const STATUS = "Triggered successfully";
const TIMESTAMP = "Mar 18, 2026 · 09:00 AM";

/* ── Variation 1: Inline pill ── */
function Variation1() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Variation 1 — Inline Pill</p>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          <span className="text-xs font-medium text-emerald-700">{STATUS}</span>
        </div>
        <span className="text-muted-foreground text-xs">·</span>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span className="text-xs">{TIMESTAMP}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Variation 2: Timeline dot ── */
function Variation2() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Variation 2 — Timeline Dot</p>
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center pt-0.5">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10" />
          <div className="w-px h-6 bg-border mt-1" />
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-foreground">{STATUS}</p>
          <p className="text-xs text-muted-foreground">{TIMESTAMP}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Variation 3: Icon-led row ── */
function Variation3() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Variation 3 — Icon-Led Row</p>
      <div className="flex items-center gap-4">
        <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
          <Zap className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{STATUS}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{TIMESTAMP}</p>
        </div>
        <Badge variant="outline" className="text-[10px] border-emerald-200 text-emerald-700 bg-emerald-50 shrink-0">
          Success
        </Badge>
      </div>
    </div>
  );
}

/* ── Variation 4: Split card ── */
function Variation4() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Variation 4 — Split Card</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
          </div>
          <p className="text-sm font-medium text-emerald-600">{STATUS}</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Run Started</span>
          </div>
          <p className="text-sm font-medium text-foreground">{TIMESTAMP}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Variation 5: Minimal bar ── */
function Variation5() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Variation 5 — Minimal Bar</p>
      <div className="rounded-lg bg-emerald-500/5 border border-emerald-100 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-sm font-medium text-foreground">{STATUS}</span>
        </div>
        <span className="text-xs text-muted-foreground">{TIMESTAMP}</span>
      </div>
    </div>
  );
}

/* ── Page ── */

export default function ScheduleNodeVariations() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-8 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="text-xl font-semibold text-foreground mb-1">Schedule Node — Execution Output</h1>
      <p className="text-sm text-muted-foreground mb-8">Five variations showing status and run start time. Pick one to apply.</p>
      <div className="space-y-5">
        <Variation1 />
        <Variation2 />
        <Variation3 />
        <Variation4 />
        <Variation5 />
      </div>
    </div>
  );
}
