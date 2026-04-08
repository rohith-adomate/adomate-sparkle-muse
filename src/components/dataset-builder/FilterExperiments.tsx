import { useState } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Filter, ChevronDown, ChevronRight, Search, X, Clock,
  Sparkles, BarChart3, Layers, Tag, SlidersHorizontal,
  Zap, Target, Calendar, Hash,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

/* ── Shared demo data ── */

const FILTER_DIMS = [
  { id: "brand", label: "Brand", icon: Target, values: ["CeraVe", "The Ordinary"] },
  { id: "format", label: "Format", icon: Layers, values: ["Image", "Video", "Carousel"] },
  { id: "status", label: "Status", icon: Zap, values: ["Active", "Inactive"] },
  { id: "funnel", label: "Funnel", icon: BarChart3, values: ["TOFU", "MOFU", "BOFU"] },
  { id: "alignment", label: "Brand Align.", icon: Sparkles, values: ["High", "Med", "Low"] },
];

const PRESETS = [
  { id: "high-perf", label: "High performers", desc: "Active + High alignment", icon: Zap },
  { id: "recent", label: "Recent ads", desc: "Last 30 days", icon: Clock },
  { id: "ugc-only", label: "UGC & Video", desc: "Video format only", icon: Layers },
  { id: "low-align", label: "Low alignment", desc: "Opportunities to improve", icon: Target },
];

const sectionTitle = "text-[10px] font-bold uppercase tracking-widest text-primary";
const sectionSub = "text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70";
const divider = "border-t border-border my-4";

/* ════════════════════════════════════════════════
   VARIANT 1 — Accordion Checkboxes
   Classic collapsible groups with checkboxes
   ════════════════════════════════════════════════ */

function Variant1() {
  const [open, setOpen] = useState<Record<string, boolean>>({ brand: true });
  const [checked, setChecked] = useState<Record<string, Set<string>>>({});

  const toggle = (dim: string, val: string) => {
    setChecked((prev) => {
      const set = new Set(prev[dim] || []);
      if (set.has(val)) set.delete(val);
      else set.add(val);
      return { ...prev, [dim]: set };
    });
  };

  return (
    <div className="space-y-1">
      {FILTER_DIMS.map((dim) => (
        <Collapsible
          key={dim.id}
          open={open[dim.id] || false}
          onOpenChange={(o) => setOpen((p) => ({ ...p, [dim.id]: o }))}
        >
          <CollapsibleTrigger className="w-full flex items-center justify-between px-1 py-1.5 rounded-md hover:bg-muted/50 transition-colors">
            <span className="flex items-center gap-2 text-xs font-medium">
              <dim.icon className="h-3.5 w-3.5 text-muted-foreground" />
              {dim.label}
            </span>
            <ChevronDown
              className={cn(
                "h-3 w-3 text-muted-foreground transition-transform",
                open[dim.id] && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6 pr-1 pb-1 space-y-0.5">
            {dim.values.map((val) => (
              <label
                key={val}
                className="flex items-center gap-2 py-1 text-[11px] cursor-pointer hover:text-foreground text-muted-foreground"
              >
                <Checkbox
                  checked={checked[dim.id]?.has(val) || false}
                  onCheckedChange={() => toggle(dim.id, val)}
                  className="h-3.5 w-3.5"
                />
                {val}
              </label>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════
   VARIANT 2 — Chip/Tag Toggles
   All values rendered as clickable chips
   ════════════════════════════════════════════════ */

function Variant2() {
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});

  const toggle = (dim: string, val: string) => {
    setSelected((prev) => {
      const set = new Set(prev[dim] || []);
      if (set.has(val)) set.delete(val);
      else set.add(val);
      return { ...prev, [dim]: set };
    });
  };

  return (
    <div className="space-y-3">
      {FILTER_DIMS.map((dim) => (
        <div key={dim.id}>
          <p className={sectionSub}>{dim.label}</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {dim.values.map((val) => {
              const active = selected[dim.id]?.has(val);
              return (
                <button
                  key={val}
                  onClick={() => toggle(dim.id, val)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all",
                    active
                      ? "bg-primary/10 border-primary/40 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  )}
                >
                  {val}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════
   VARIANT 3 — Quick Preset Cards
   Pre-defined filter combos as selectable cards
   ════════════════════════════════════════════════ */

function Variant3() {
  const [activePreset, setActivePreset] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <p className={sectionSub}>Quick filters</p>
      {PRESETS.map((p) => (
        <button
          key={p.id}
          onClick={() => setActivePreset(activePreset === p.id ? null : p.id)}
          className={cn(
            "w-full flex items-start gap-2.5 p-2.5 rounded-lg border transition-all text-left",
            activePreset === p.id
              ? "border-primary/40 bg-primary/5 shadow-sm"
              : "border-border bg-background hover:border-primary/20 hover:bg-muted/30"
          )}
        >
          <div
            className={cn(
              "h-7 w-7 rounded-md flex items-center justify-center shrink-0",
              activePreset === p.id ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
            )}
          >
            <p.icon className="h-3.5 w-3.5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold">{p.label}</p>
            <p className="text-[10px] text-muted-foreground">{p.desc}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════
   VARIANT 4 — Segmented Toggle Buttons
   Horizontal toggle groups per dimension
   ════════════════════════════════════════════════ */

function Variant4() {
  const [selected, setSelected] = useState<Record<string, string | null>>({});

  return (
    <div className="space-y-3.5">
      {FILTER_DIMS.slice(0, 4).map((dim) => (
        <div key={dim.id}>
          <p className={sectionSub}>{dim.label}</p>
          <div className="flex mt-1.5 rounded-lg border border-border overflow-hidden">
            {dim.values.map((val, i) => (
              <button
                key={val}
                onClick={() =>
                  setSelected((p) => ({
                    ...p,
                    [dim.id]: p[dim.id] === val ? null : val,
                  }))
                }
                className={cn(
                  "flex-1 py-1.5 text-[10px] font-medium transition-all",
                  i > 0 && "border-l border-border",
                  selected[dim.id] === val
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted/50"
                )}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════
   VARIANT 5 — Inline Dropdowns
   Compact select dropdowns for each filter
   ════════════════════════════════════════════════ */

function Variant5() {
  const [values, setValues] = useState<Record<string, string>>({});

  return (
    <div className="space-y-2.5">
      {FILTER_DIMS.map((dim) => (
        <div key={dim.id} className="flex items-center gap-2">
          <dim.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-[11px] font-medium min-w-[60px]">{dim.label}</span>
          <select
            value={values[dim.id] || ""}
            onChange={(e) =>
              setValues((p) => ({ ...p, [dim.id]: e.target.value }))
            }
            className="flex-1 text-[11px] px-2 py-1 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All</option>
            {dim.values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════
   VARIANT 6 — Search-First with Suggestions
   A search bar that shows filter suggestions
   ════════════════════════════════════════════════ */

function Variant6() {
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState<string[]>([]);

  const allValues = FILTER_DIMS.flatMap((d) =>
    d.values.map((v) => ({ dim: d.label, value: v, key: `${d.id}:${v}` }))
  );

  const suggestions = query
    ? allValues.filter(
        (v) =>
          v.value.toLowerCase().includes(query.toLowerCase()) &&
          !applied.includes(v.key)
      )
    : [];

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search filters..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {applied.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {applied.map((key) => {
            const item = allValues.find((v) => v.key === key);
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium"
              >
                {item?.value}
                <button onClick={() => setApplied((p) => p.filter((k) => k !== key))}>
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="rounded-lg border border-border overflow-hidden">
          {suggestions.slice(0, 6).map((s) => (
            <button
              key={s.key}
              onClick={() => {
                setApplied((p) => [...p, s.key]);
                setQuery("");
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
            >
              <span className="font-medium">{s.value}</span>
              <Badge variant="outline" className="text-[9px] h-4 px-1.5">
                {s.dim}
              </Badge>
            </button>
          ))}
        </div>
      )}

      {!query && applied.length === 0 && (
        <p className="text-[10px] text-muted-foreground text-center py-2">
          Type to search across all filter dimensions
        </p>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════
   VARIANT 7 — Toggle Switches
   On/off switches for each value with counts
   ════════════════════════════════════════════════ */

function Variant7() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const counts: Record<string, number> = {
    CeraVe: 6, "The Ordinary": 6, Image: 7, Video: 3, Carousel: 2,
    Active: 8, Inactive: 4, TOFU: 4, MOFU: 4, BOFU: 4,
    High: 5, Med: 4, Low: 3,
  };

  return (
    <div className="space-y-3">
      {FILTER_DIMS.map((dim) => (
        <div key={dim.id}>
          <p className={sectionSub}>{dim.label}</p>
          <div className="mt-1.5 space-y-1">
            {dim.values.map((val) => {
              const key = `${dim.id}:${val}`;
              return (
                <div
                  key={val}
                  className="flex items-center justify-between py-1.5 px-1"
                >
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={enabled[key] || false}
                      onCheckedChange={(c) =>
                        setEnabled((p) => ({ ...p, [key]: c }))
                      }
                      className="h-4 w-7 data-[state=checked]:bg-primary"
                    />
                    <span className="text-[11px] font-medium">{val}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {counts[val] || 0}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════
   VARIANT 8 — Slider + Pills Hybrid
   Sliders for numeric, pills for categorical
   ════════════════════════════════════════════════ */

function Variant8() {
  const [daysRange, setDaysRange] = useState([0, 300]);
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});

  const toggle = (dim: string, val: string) => {
    setSelected((prev) => {
      const set = new Set(prev[dim] || []);
      if (set.has(val)) set.delete(val);
      else set.add(val);
      return { ...prev, [dim]: set };
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <p className={sectionSub}>Days Online</p>
          <span className="text-[10px] text-muted-foreground">
            {daysRange[0]} – {daysRange[1]}
          </span>
        </div>
        <Slider
          value={daysRange}
          onValueChange={setDaysRange}
          min={0}
          max={400}
          step={10}
          className="mt-2"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <p className={sectionSub}>Launch Date</p>
        </div>
        <div className="flex gap-1.5 mt-1.5">
          {["7d", "30d", "90d", "All"].map((v) => (
            <button
              key={v}
              onClick={() => toggle("date", v)}
              className={cn(
                "flex-1 py-1 rounded-md text-[10px] font-medium border transition-all",
                selected["date"]?.has(v)
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30"
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {FILTER_DIMS.filter((d) => d.id !== "brand").map((dim) => (
        <div key={dim.id}>
          <p className={sectionSub}>{dim.label}</p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {dim.values.map((val) => {
              const active = selected[dim.id]?.has(val);
              return (
                <button
                  key={val}
                  onClick={() => toggle(dim.id, val)}
                  className={cn(
                    "px-2 py-0.5 rounded-md text-[10px] font-medium transition-all",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {val}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════
   VARIANT 9 — Stacked Mini-Cards
   Each active filter as an editable card
   ════════════════════════════════════════════════ */

function Variant9() {
  const [expanded, setExpanded] = useState<string | null>("brand");
  const [checked, setChecked] = useState<Record<string, Set<string>>>({
    brand: new Set(["CeraVe"]),
  });

  const toggle = (dim: string, val: string) => {
    setChecked((prev) => {
      const set = new Set(prev[dim] || []);
      if (set.has(val)) set.delete(val);
      else set.add(val);
      return { ...prev, [dim]: set };
    });
  };

  return (
    <div className="space-y-2">
      {FILTER_DIMS.map((dim) => {
        const isExpanded = expanded === dim.id;
        const activeCount = checked[dim.id]?.size || 0;
        return (
          <div
            key={dim.id}
            className={cn(
              "rounded-lg border transition-all",
              isExpanded
                ? "border-primary/30 bg-primary/[0.02]"
                : "border-border bg-background hover:border-border/80"
            )}
          >
            <button
              className="w-full flex items-center justify-between px-3 py-2"
              onClick={() => setExpanded(isExpanded ? null : dim.id)}
            >
              <span className="flex items-center gap-2">
                <dim.icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] font-medium">{dim.label}</span>
                {activeCount > 0 && (
                  <span className="h-4 min-w-[16px] rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center px-1">
                    {activeCount}
                  </span>
                )}
              </span>
              <ChevronRight
                className={cn(
                  "h-3 w-3 text-muted-foreground transition-transform",
                  isExpanded && "rotate-90"
                )}
              />
            </button>
            {isExpanded && (
              <div className="px-3 pb-2.5 space-y-0.5">
                {dim.values.map((val) => (
                  <label
                    key={val}
                    className="flex items-center gap-2 py-1 text-[11px] cursor-pointer text-muted-foreground hover:text-foreground"
                  >
                    <Checkbox
                      checked={checked[dim.id]?.has(val) || false}
                      onCheckedChange={() => toggle(dim.id, val)}
                      className="h-3.5 w-3.5"
                    />
                    {val}
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════
   VARIANT 10 — Visual Bar Distribution
   Shows value distribution bars, click to filter
   ════════════════════════════════════════════════ */

function Variant10() {
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});
  const distributions: Record<string, Record<string, number>> = {
    brand: { CeraVe: 6, "The Ordinary": 6 },
    format: { Image: 7, Video: 3, Carousel: 2 },
    status: { Active: 8, Inactive: 4 },
    funnel: { TOFU: 4, MOFU: 4, BOFU: 4 },
    alignment: { High: 5, Med: 4, Low: 3 },
  };

  const toggle = (dim: string, val: string) => {
    setSelected((prev) => {
      const set = new Set(prev[dim] || []);
      if (set.has(val)) set.delete(val);
      else set.add(val);
      return { ...prev, [dim]: set };
    });
  };

  return (
    <div className="space-y-3.5">
      {FILTER_DIMS.map((dim) => {
        const dist = distributions[dim.id] || {};
        const total = Object.values(dist).reduce((a, b) => a + b, 0);
        return (
          <div key={dim.id}>
            <p className={sectionSub}>{dim.label}</p>
            <div className="mt-1.5 space-y-1">
              {dim.values.map((val) => {
                const count = dist[val] || 0;
                const pct = Math.round((count / total) * 100);
                const active = selected[dim.id]?.has(val);
                return (
                  <button
                    key={val}
                    onClick={() => toggle(dim.id, val)}
                    className={cn(
                      "w-full flex items-center gap-2 py-1 px-1 rounded transition-all group",
                      active && "bg-primary/5"
                    )}
                  >
                    <span
                      className={cn(
                        "text-[11px] font-medium min-w-[65px] text-left",
                        active ? "text-primary" : "text-foreground"
                      )}
                    >
                      {val}
                    </span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          active ? "bg-primary" : "bg-muted-foreground/30 group-hover:bg-primary/50"
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground min-w-[20px] text-right">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════
   MAIN EXPORT — All 10 experiments stacked
   ════════════════════════════════════════════════ */

const VARIANTS = [
  { id: 1, title: "Accordion Checkboxes", desc: "Collapsible groups with checkboxes", Component: Variant1 },
  { id: 2, title: "Chip Toggles", desc: "Clickable pill-style tags", Component: Variant2 },
  { id: 3, title: "Quick Preset Cards", desc: "Pre-defined filter combos", Component: Variant3 },
  { id: 4, title: "Segmented Controls", desc: "Horizontal toggle buttons", Component: Variant4 },
  { id: 5, title: "Inline Dropdowns", desc: "Compact select per dimension", Component: Variant5 },
  { id: 6, title: "Search-First", desc: "Type to discover & apply filters", Component: Variant6 },
  { id: 7, title: "Toggle Switches", desc: "On/off per value with counts", Component: Variant7 },
  { id: 8, title: "Slider + Pills", desc: "Sliders for numeric, pills for rest", Component: Variant8 },
  { id: 9, title: "Stacked Cards", desc: "Expandable cards with badges", Component: Variant9 },
  { id: 10, title: "Distribution Bars", desc: "Visual bars showing value distribution", Component: Variant10 },
];

export default function FilterExperiments() {
  return (
    <div className="space-y-0">
      <div className="sticky top-0 bg-card z-10 px-4 pt-3 pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
          <p className={sectionTitle}>Filter Experiments</p>
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          10 UI variants — scroll to compare
        </p>
      </div>

      {VARIANTS.map(({ id, title, desc, Component }, i) => (
        <div key={id} className="px-4 py-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="h-5 min-w-[20px] rounded-md bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center px-1.5">
              {id}
            </span>
            <p className="text-[11px] font-semibold">{title}</p>
          </div>
          <p className="text-[10px] text-muted-foreground mb-3">{desc}</p>
          <Component />
          {i < VARIANTS.length - 1 && <div className={divider} />}
        </div>
      ))}
    </div>
  );
}
