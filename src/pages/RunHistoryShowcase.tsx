import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  CheckCircle2, XCircle, Clock, ArrowRight, ChevronRight, Zap,
  BarChart3, Timer, Layers, CircleDot, Activity,
} from "lucide-react";

const runs = [
  { id: "run-1", workflow: "Nike Ad Monitor", type: "competitor" as const, status: "completed" as const, concepts: 9, date: "Mar 12, 2026", time: "14:32", duration: "3m 12s", durationSec: 192 },
  { id: "run-2", workflow: "Christmas Campaign", type: "holiday" as const, status: "completed" as const, concepts: 12, date: "Mar 10, 2026", time: "09:15", duration: "4m 48s", durationSec: 288 },
  { id: "run-3", workflow: "Adidas Creative Tracker", type: "competitor" as const, status: "failed" as const, concepts: 0, date: "Mar 8, 2026", time: "11:05", duration: "1m 03s", durationSec: 63 },
];

const maxDuration = Math.max(...runs.map((r) => r.durationSec));

/* ════════════════════════════════════════════════════════════════
   VARIANT A — Minimal List (status dot + single row)
   ════════════════════════════════════════════════════════════════ */
function VariantA() {
  return (
    <Card className="border border-border/60">
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">A · Minimal List</h3>
        <div className="divide-y divide-border/50">
          {runs.map((run) => (
            <div key={run.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${run.status === "completed" ? "bg-emerald-500" : "bg-red-500"}`} />
                <span className="text-sm font-medium">{run.workflow}</span>
                <span className="text-xs text-muted-foreground">{run.date} · {run.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{run.duration}</span>
                {run.status === "completed" && (
                  <span className="text-xs font-medium text-emerald-600">{run.concepts} concepts</span>
                )}
                {run.status === "failed" && (
                  <span className="text-xs font-medium text-red-600">Failed</span>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   VARIANT B — Card Grid (individual cards per run)
   ════════════════════════════════════════════════════════════════ */
function VariantB() {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">B · Card Grid</h3>
      <div className="grid grid-cols-3 gap-4">
        {runs.map((run) => (
          <Card
            key={run.id}
            className={`border cursor-pointer hover:shadow-md transition-all overflow-hidden ${
              run.status === "failed" ? "border-red-200/60" : "border-border/60"
            }`}
          >
            <div className={`h-1 w-full ${run.status === "completed" ? "bg-emerald-400" : "bg-red-400"}`} />
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                {run.status === "completed" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <Badge variant="outline" className={`text-[10px] ${run.type === "holiday" ? "border-pink-200 text-pink-700 bg-pink-50" : "border-violet-200 text-violet-700 bg-violet-50"}`}>
                  {run.type === "holiday" ? "SEASONAL" : "COMPETITOR"}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-semibold">{run.workflow}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{run.date} · {run.time}</p>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-border/40">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Timer className="h-3.5 w-3.5" />
                  {run.duration}
                </div>
                {run.status === "completed" ? (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                    <Layers className="h-3.5 w-3.5" />
                    {run.concepts} concepts
                  </div>
                ) : (
                  <span className="text-xs font-medium text-red-600">Error</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   VARIANT C — Timeline (vertical timeline with dots)
   ════════════════════════════════════════════════════════════════ */
function VariantC() {
  return (
    <Card className="border border-border/60">
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">C · Timeline</h3>
        <div className="relative pl-6">
          {/* vertical line */}
          <div className="absolute left-[9px] top-1 bottom-1 w-px bg-border" />
          {runs.map((run, i) => (
            <div key={run.id} className={`relative flex gap-4 ${i < runs.length - 1 ? "pb-6" : ""}`}>
              {/* dot */}
              <div className={`absolute -left-6 top-1 h-[18px] w-[18px] rounded-full border-2 flex items-center justify-center ${
                run.status === "completed"
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-red-400 bg-red-50"
              }`}>
                {run.status === "completed" ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-600" />
                )}
              </div>
              {/* content */}
              <div className="flex-1 rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{run.workflow}</p>
                  <span className="text-[10px] text-muted-foreground">{run.date} · {run.time}</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {run.duration}
                  </span>
                  {run.status === "completed" ? (
                    <Badge variant="outline" className="text-[10px] border-emerald-200 text-emerald-700 bg-emerald-50">
                      {run.concepts} concepts generated
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] border-red-200 text-red-700 bg-red-50">
                      Run failed
                    </Badge>
                  )}
                  <Badge variant="outline" className={`text-[10px] ${run.type === "holiday" ? "border-pink-200 text-pink-700 bg-pink-50" : "border-violet-200 text-violet-700 bg-violet-50"}`}>
                    {run.type === "holiday" ? "SEASONAL" : "COMPETITOR"}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   VARIANT D — Table with bar chart (duration visualized)
   ════════════════════════════════════════════════════════════════ */
function VariantD() {
  return (
    <Card className="border border-border/60">
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">D · Table with Duration Bars</h3>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          {/* header */}
          <div className="grid grid-cols-[1fr_120px_100px_140px_80px] gap-2 px-4 py-2 bg-muted/40 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            <span>Workflow</span>
            <span>Date</span>
            <span>Duration</span>
            <span>Output</span>
            <span>Status</span>
          </div>
          {runs.map((run) => (
            <div
              key={run.id}
              className="grid grid-cols-[1fr_120px_100px_140px_80px] gap-2 px-4 py-3 border-t border-border/30 hover:bg-muted/20 transition-colors items-center cursor-pointer"
            >
              <span className="text-sm font-medium">{run.workflow}</span>
              <span className="text-xs text-muted-foreground">{run.date}</span>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${run.status === "completed" ? "bg-primary" : "bg-red-400"}`}
                    style={{ width: `${(run.durationSec / maxDuration) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground w-10 text-right">{run.duration}</span>
              </div>
              <div>
                {run.status === "completed" ? (
                  <span className="text-xs text-emerald-600 font-medium">{run.concepts} concepts</span>
                ) : (
                  <span className="text-xs text-red-500">—</span>
                )}
              </div>
              <div>
                {run.status === "completed" ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                    <CircleDot className="h-3 w-3" /> Done
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-500">
                    <CircleDot className="h-3 w-3" /> Failed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   VARIANT E — Compact Activity Feed (icon + sentence style)
   ════════════════════════════════════════════════════════════════ */
function VariantE() {
  return (
    <Card className="border border-border/60">
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">E · Activity Feed</h3>
        <div className="space-y-2">
          {runs.map((run) => (
            <div
              key={run.id}
              className="flex items-center gap-3 rounded-xl bg-muted/30 border border-border/40 px-4 py-3 hover:border-border transition-colors cursor-pointer group"
            >
              <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                run.status === "completed"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-red-100 text-red-600"
              }`}>
                {run.status === "completed" ? <Zap className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">{run.workflow}</span>
                  {run.status === "completed" ? (
                    <span className="text-muted-foreground"> generated <span className="font-medium text-foreground">{run.concepts} concepts</span> in {run.duration}</span>
                  ) : (
                    <span className="text-red-600"> failed after {run.duration}</span>
                  )}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{run.date} at {run.time}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════ */
export default function RunHistoryShowcase() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Run History — UI Showcase</h1>
        <p className="text-sm text-muted-foreground mt-1">5 alternative implementations displaying the same data. Pick your favorite!</p>
      </div>
      <VariantA />
      <VariantB />
      <VariantC />
      <VariantD />
      <VariantE />
    </div>
  );
}
