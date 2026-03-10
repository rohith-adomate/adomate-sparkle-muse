import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, Info, Play, Zap, Circle, ChevronDown, Power, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ── Mock data ── */
const MOCK_DATES = [
  new Date(2026, 2, 16), // Mon Mar 16
  new Date(2026, 2, 23), // Mon Mar 23
  new Date(2026, 2, 30), // Mon Mar 30
];

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/* ════════════════════════════════════════════════════
   SECTION 1: Upcoming Runs Preview — 5 variations
   ════════════════════════════════════════════════════ */

function RunsVariation1() {
  return (
    <div className="space-y-2">
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 cursor-help w-fit">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Next runs
            </span>
            <Info className="h-3 w-3 text-muted-foreground/50" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs max-w-[220px]">
          Preview of upcoming scheduled dates. The workflow runs indefinitely on this schedule.
        </TooltipContent>
      </Tooltip>
      <div className="space-y-1">
        {MOCK_DATES.map((d, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-md border border-dashed border-border/50 px-3 py-1.5"
            style={{ opacity: 1 - i * 0.2 }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-success/60" />
            <span className="text-xs text-muted-foreground">{formatDate(d)}</span>
          </div>
        ))}
        <div className="flex items-center justify-center pt-0.5">
          <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground/30" />
        </div>
      </div>
    </div>
  );
}

function RunsVariation2() {
  return (
    <div className="space-y-2">
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 cursor-help w-fit">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Upcoming runs
            </span>
            <Info className="h-3 w-3 text-muted-foreground/50" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs max-w-[220px]">
          These dates are a preview. The schedule continues indefinitely.
        </TooltipContent>
      </Tooltip>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[7px] top-2 bottom-6 w-px bg-border" />
        <div className="space-y-3">
          {MOCK_DATES.map((d, i) => (
            <div key={i} className="flex items-center gap-3 relative">
              <div className="w-[15px] h-[15px] rounded-full border-2 border-primary/40 bg-background z-10 flex items-center justify-center shrink-0">
                <div className="w-[5px] h-[5px] rounded-full bg-primary/60" />
              </div>
              <span className="text-xs text-muted-foreground">{formatDate(d)}</span>
            </div>
          ))}
          {/* Fade-out indicator */}
          <div className="flex items-center gap-3 relative">
            <div className="w-[15px] h-[15px] rounded-full border border-dashed border-muted-foreground/20 bg-background z-10 shrink-0" />
            <span className="text-[10px] text-muted-foreground/40 italic">continues…</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RunsVariation3() {
  return (
    <div className="space-y-2">
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 cursor-help w-fit">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Schedule preview
            </span>
            <Info className="h-3 w-3 text-muted-foreground/50" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs max-w-[220px]">
          Showing next 3 runs. This schedule repeats indefinitely.
        </TooltipContent>
      </Tooltip>
      <div className="rounded-lg border border-border overflow-hidden">
        {MOCK_DATES.map((d, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 text-xs",
              i < MOCK_DATES.length - 1 && "border-b border-border/50"
            )}
          >
            <Calendar className="h-3 w-3 text-muted-foreground/40 shrink-0" />
            <span className="text-muted-foreground">{formatDate(d)}</span>
          </div>
        ))}
        <div className="px-3 py-1.5 bg-muted/30 flex items-center justify-center">
          <span className="text-[10px] text-muted-foreground/40">↓ schedule continues</span>
        </div>
      </div>
    </div>
  );
}

function RunsVariation4() {
  return (
    <div className="space-y-2">
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 cursor-help w-fit">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Next runs
            </span>
            <Info className="h-3 w-3 text-muted-foreground/50" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs max-w-[220px]">
          Preview of upcoming execution dates. Runs repeat on this schedule.
        </TooltipContent>
      </Tooltip>
      <div className="flex items-center gap-2 flex-wrap">
        {MOCK_DATES.map((d, i) => (
          <Badge
            key={i}
            variant="secondary"
            className="text-[11px] font-normal py-1 px-2.5 bg-muted/50"
          >
            {formatDate(d)}
          </Badge>
        ))}
        <span className="text-muted-foreground/30 text-sm">…</span>
      </div>
    </div>
  );
}

function RunsVariation5() {
  return (
    <div className="space-y-2">
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 cursor-help w-fit">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Upcoming
            </span>
            <Info className="h-3 w-3 text-muted-foreground/50" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs max-w-[220px]">
          Next scheduled execution dates. This repeats indefinitely.
        </TooltipContent>
      </Tooltip>
      <div className="flex items-stretch gap-1.5">
        {MOCK_DATES.map((d, i) => (
          <div
            key={i}
            className="flex-1 rounded-md bg-muted/40 border border-border/40 p-2 text-center"
          >
            <p className="text-[10px] text-muted-foreground/60 uppercase">{d.toLocaleDateString("en-US", { weekday: "short" })}</p>
            <p className="text-sm font-semibold text-foreground/80">{d.getDate()}</p>
            <p className="text-[10px] text-muted-foreground/60">{d.toLocaleDateString("en-US", { month: "short" })}</p>
          </div>
        ))}
        <div className="flex items-center px-1">
          <MoreHorizontal className="h-4 w-4 text-muted-foreground/20" />
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   SECTION 2: Active Toggle — 5 variations
   ════════════════════════════════════════════════════ */

function ToggleVariation1() {
  const [active, setActive] = useState(true);
  return (
    <div className="flex items-center gap-2">
      <Switch checked={active} onCheckedChange={setActive} />
      <span className="text-xs text-muted-foreground">{active ? "Active" : "Inactive"}</span>
    </div>
  );
}

function ToggleVariation2() {
  const [active, setActive] = useState(true);
  return (
    <button
      onClick={() => setActive(!active)}
      className={cn(
        "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all border",
        active
          ? "bg-success/10 text-success border-success/30"
          : "bg-muted text-muted-foreground border-border"
      )}
    >
      <Circle className={cn("h-2 w-2 fill-current", active ? "text-success" : "text-muted-foreground/50")} />
      {active ? "Live" : "Paused"}
    </button>
  );
}

function ToggleVariation3() {
  const [active, setActive] = useState(true);
  return (
    <div className="flex items-center rounded-lg bg-muted p-0.5">
      <button
        onClick={() => setActive(false)}
        className={cn(
          "px-3 py-1 text-xs font-medium rounded-md transition-colors",
          !active
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Off
      </button>
      <button
        onClick={() => setActive(true)}
        className={cn(
          "px-3 py-1 text-xs font-medium rounded-md transition-colors",
          active
            ? "bg-success text-success-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Active
      </button>
    </div>
  );
}

function ToggleVariation4() {
  const [active, setActive] = useState(true);
  return (
    <button
      onClick={() => setActive(!active)}
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium transition-colors px-2.5 py-1 rounded-md",
        active
          ? "text-success"
          : "text-muted-foreground"
      )}
    >
      <Power className={cn("h-3.5 w-3.5", active && "drop-shadow-[0_0_4px_hsl(var(--success))]")} />
      {active ? "Active" : "Inactive"}
    </button>
  );
}

function ToggleVariation5() {
  const [active, setActive] = useState(true);
  return (
    <Badge
      variant="outline"
      className={cn(
        "cursor-pointer select-none gap-1.5 py-1 px-2.5 text-xs font-medium transition-all",
        active
          ? "border-success/40 bg-success/5 text-success hover:bg-success/10"
          : "border-border text-muted-foreground hover:bg-muted"
      )}
      onClick={() => setActive(!active)}
    >
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        active ? "bg-success animate-pulse" : "bg-muted-foreground/40"
      )} />
      {active ? "Active" : "Inactive"}
    </Badge>
  );
}

/* ════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════ */

export default function UIVariations() {
  return (
    <div className="min-h-screen bg-background p-8 space-y-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold mb-1">UI Variations Comparison</h1>
        <p className="text-sm text-muted-foreground">Pick your favorite for each element.</p>
      </div>

      {/* ── SECTION 1: Upcoming Runs ── */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold border-b border-border pb-2">
          1 — Upcoming Runs Preview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "A", sub: "Dot indicators + fading opacity + ellipsis icon", Component: RunsVariation1 },
            { label: "B", sub: "Vertical timeline with continues hint", Component: RunsVariation2 },
            { label: "C", sub: "Compact table with footer continuation", Component: RunsVariation3 },
            { label: "D", sub: "Inline badges + ellipsis", Component: RunsVariation4 },
            { label: "E", sub: "Calendar-card tiles", Component: RunsVariation5 },
          ].map(({ label, sub, Component }) => (
            <div key={label} className="border border-border rounded-xl p-5 space-y-3 bg-card">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-primary">Option {label}</span>
                <span className="text-[11px] text-muted-foreground">{sub}</span>
              </div>
              {/* Simulate drawer width context */}
              <div className="max-w-[320px]">
                <Component />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 2: Active Toggle ── */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold border-b border-border pb-2">
          2 — Active Toggle (Top Nav)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "A", sub: "Classic switch + label", Component: ToggleVariation1 },
            { label: "B", sub: "Pill button with live dot", Component: ToggleVariation2 },
            { label: "C", sub: "Segmented Off / Active", Component: ToggleVariation3 },
            { label: "D", sub: "Icon-led power button", Component: ToggleVariation4 },
            { label: "E", sub: "Badge toggle with pulse", Component: ToggleVariation5 },
          ].map(({ label, sub, Component }) => (
            <div key={label} className="border border-border rounded-xl p-5 space-y-4 bg-card">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-primary">Option {label}</span>
                <span className="text-[11px] text-muted-foreground">{sub}</span>
              </div>
              {/* Simulate top-bar context */}
              <div className="flex items-center h-12 px-4 rounded-lg bg-card border border-border">
                <span className="text-sm font-semibold mr-auto">Christmas Campaign</span>
                <Component />
                <Button size="sm" className="h-8 gap-1.5 bg-success hover:bg-success/90 text-success-foreground ml-3">
                  <Play className="h-3.5 w-3.5" /> Run
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
