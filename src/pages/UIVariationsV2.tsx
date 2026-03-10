import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { BookOpen, Image, Plus, Star, X, Info, Check, ChevronDown, Brain, Sparkles, Eye, Palette } from "lucide-react";

const MOCK_LOGOS = [
  { id: "logo-1", name: "Primary Logo", url: "/placeholder.svg" },
  { id: "logo-2", name: "Icon Mark", url: "/placeholder.svg" },
  { id: "logo-3", name: "Wordmark", url: "/placeholder.svg" },
];

const MOCK_VISUALS = [
  { id: "vis-1", name: "Hero Banner", url: "/placeholder.svg" },
  { id: "vis-2", name: "Lifestyle Shot 1", url: "/placeholder.svg" },
  { id: "vis-3", name: "Lifestyle Shot 2", url: "/placeholder.svg" },
  { id: "vis-4", name: "Product Scene", url: "/placeholder.svg" },
  { id: "vis-5", name: "Texture", url: "/placeholder.svg" },
];

const KNOWLEDGE_FIELDS = ["Description", "Tone of Voice", "Brand Positioning", "Visual Style", "Brand Colors"];

/* ─── KNOWLEDGE VARIATIONS ─── */

function KnowledgeA() {
  const [on, setOn] = useState(true);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Knowledge</Label>
        <Switch checked={on} onCheckedChange={setOn} className="scale-[0.8]" />
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`w-full rounded-lg border px-3 py-2 flex items-center gap-2 transition-all cursor-pointer ${
          on ? "border-primary/30 bg-primary/5" : "border-border bg-muted/20 opacity-60"
        }`}
      >
        <Brain className={`h-4 w-4 shrink-0 ${on ? "text-primary" : "text-muted-foreground"}`} />
        <span className="text-xs font-medium text-foreground">Brand profile & style</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 text-muted-foreground ml-auto shrink-0" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[200px] text-xs">
              {KNOWLEDGE_FIELDS.join(", ")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </button>
    </div>
  );
}

function KnowledgeB() {
  const [on, setOn] = useState(true);
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Knowledge</Label>
      <label
        className={`flex items-center gap-3 rounded-lg border px-3 py-3 cursor-pointer transition-all ${
          on ? "border-primary/40 bg-gradient-to-r from-primary/5 to-transparent" : "border-border"
        }`}
      >
        <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
          on ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}>
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium">Include brand knowledge</p>
          <p className="text-[10px] text-muted-foreground truncate">
            {on ? KNOWLEDGE_FIELDS.slice(0, 3).join(" · ") + " …" : "Disabled"}
          </p>
        </div>
        <Switch checked={on} onCheckedChange={setOn} className="scale-[0.8]" />
      </label>
    </div>
  );
}

function KnowledgeC() {
  const [on, setOn] = useState(true);
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Knowledge</Label>
        <Switch checked={on} onCheckedChange={setOn} className="scale-[0.8]" />
      </div>
      <div className={`rounded-lg border transition-all ${on ? "border-primary/30" : "border-border opacity-50"}`}>
        <button
          onClick={() => on && setExpanded(!expanded)}
          className="w-full flex items-center gap-2 px-3 py-2 text-left"
        >
          <div className={`h-2 w-2 rounded-full ${on ? "bg-primary animate-pulse" : "bg-muted-foreground/30"}`} />
          <span className="text-xs font-medium flex-1">{on ? "Active" : "Inactive"} — {KNOWLEDGE_FIELDS.length} fields</span>
          <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${expanded && on ? "rotate-180" : ""}`} />
        </button>
        {expanded && on && (
          <div className="px-3 pb-2 flex flex-wrap gap-1">
            {KNOWLEDGE_FIELDS.map((f) => (
              <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{f}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function KnowledgeD() {
  const [on, setOn] = useState(true);
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Knowledge</Label>
      <div
        onClick={() => setOn(!on)}
        className={`relative rounded-lg border px-3 py-2.5 cursor-pointer transition-all overflow-hidden ${
          on ? "border-primary/30" : "border-border"
        }`}
      >
        {on && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-primary/4 to-transparent" />
        )}
        <div className="relative flex items-center gap-2.5">
          <div className={`h-5 w-5 rounded border flex items-center justify-center transition-all ${
            on ? "bg-primary border-primary" : "border-border"
          }`}>
            {on && <Check className="h-3 w-3 text-primary-foreground" />}
          </div>
          <span className="text-xs font-medium">Brand knowledge</span>
          <div className="ml-auto flex items-center gap-1">
            {on && KNOWLEDGE_FIELDS.slice(0, 3).map((f, i) => (
              <span key={i} className="h-1 w-1 rounded-full bg-primary/60" />
            ))}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground ml-1" />
                </TooltipTrigger>
                <TooltipContent className="text-xs max-w-[200px]">{KNOWLEDGE_FIELDS.join(", ")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

function KnowledgeE() {
  const [on, setOn] = useState(true);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Knowledge</Label>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOn(!on)}
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 border text-xs font-medium transition-all ${
            on
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"
          }`}
        >
          {on ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          Brand profile
        </button>
        {on && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-[10px] text-muted-foreground cursor-help underline decoration-dotted">
                  {KNOWLEDGE_FIELDS.length} fields
                </span>
              </TooltipTrigger>
              <TooltipContent className="text-xs max-w-[200px]">{KNOWLEDGE_FIELDS.join(", ")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}

/* ─── LOGO VARIATIONS ─── */

function LogoA() {
  const [sel, setSel] = useState<string | null>(null);
  const [pop, setPop] = useState(false);
  const logo = MOCK_LOGOS.find((l) => l.id === sel);
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Logo</Label>
      <div className="flex items-center gap-2">
        {logo && (
          <div className="relative rounded-lg border border-primary/30 bg-primary/5 p-2 h-14 w-14 flex items-center justify-center">
            <img src={logo.url} alt={logo.name} className="max-h-full max-w-full object-contain opacity-60" />
            <button onClick={() => setSel(null)} className="absolute -top-1 -right-1 rounded-full bg-muted border border-border p-0.5 hover:bg-destructive hover:text-destructive-foreground transition-colors">
              <X className="h-2.5 w-2.5" />
            </button>
          </div>
        )}
        <Popover open={pop} onOpenChange={setPop}>
          <PopoverTrigger asChild>
            <button className="rounded-lg border-2 border-dashed border-border hover:border-muted-foreground/40 h-14 w-14 flex items-center justify-center transition-colors">
              <Plus className="h-4 w-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[240px] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Select a logo</p>
            <div className="grid grid-cols-3 gap-2">
              {MOCK_LOGOS.map((l) => {
                const isSel = sel === l.id;
                return (
                  <button key={l.id} onClick={() => { setSel(isSel ? null : l.id); setPop(false); }}
                    className={`relative rounded-lg border-2 p-2 aspect-square flex flex-col items-center justify-center gap-1 transition-all ${
                      isSel ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                    }`}>
                    <img src={l.url} alt={l.name} className="h-8 w-8 object-contain opacity-60" />
                    <span className="text-[9px] text-muted-foreground truncate w-full text-center">{l.name}</span>
                    {isSel && <div className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function LogoB() {
  const [sel, setSel] = useState<string | null>(null);
  const [pop, setPop] = useState(false);
  const logo = MOCK_LOGOS.find((l) => l.id === sel);
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Logo</Label>
      <Popover open={pop} onOpenChange={setPop}>
        <PopoverTrigger asChild>
          <button className={`w-full rounded-lg border-2 border-dashed px-3 py-3 flex items-center gap-3 transition-all ${
            logo ? "border-primary/30 bg-primary/5" : "border-border hover:border-muted-foreground/40"
          }`}>
            {logo ? (
              <>
                <div className="h-10 w-10 rounded border border-border bg-background flex items-center justify-center shrink-0">
                  <img src={logo.url} alt={logo.name} className="h-7 w-7 object-contain opacity-60" />
                </div>
                <span className="text-xs text-muted-foreground">{logo.name}</span>
                <button onClick={(e) => { e.stopPropagation(); setSel(null); }} className="ml-auto p-0.5 rounded hover:bg-destructive/10">
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Add logo</span>
              </>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[280px] p-2">
          <div className="grid grid-cols-3 gap-1.5">
            {MOCK_LOGOS.map((l) => {
              const isSel = sel === l.id;
              return (
                <button key={l.id} onClick={() => { setSel(l.id); setPop(false); }}
                  className={`rounded-lg border p-3 aspect-square flex flex-col items-center justify-center gap-1.5 transition-all ${
                    isSel ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:bg-muted/50"
                  }`}>
                  <img src={l.url} alt={l.name} className="h-10 w-10 object-contain opacity-70" />
                  <span className="text-[9px] text-muted-foreground/70 truncate w-full text-center">{l.name}</span>
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function LogoC() {
  const [sel, setSel] = useState<string | null>(null);
  const [pop, setPop] = useState(false);
  const logo = MOCK_LOGOS.find((l) => l.id === sel);
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Logo</Label>
      <div className="flex items-center gap-2">
        {logo ? (
          <div className="relative group rounded-xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border p-4 h-20 w-20 flex items-center justify-center">
            <img src={logo.url} alt={logo.name} className="max-h-full max-w-full object-contain opacity-60" />
            <div className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => setSel(null)} className="p-1 rounded-full bg-white/20 hover:bg-white/30">
                <X className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
            <span className="absolute -bottom-4 left-0 right-0 text-[9px] text-muted-foreground text-center truncate">{logo.name}</span>
          </div>
        ) : null}
        <Popover open={pop} onOpenChange={setPop}>
          <PopoverTrigger asChild>
            <button className="rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 h-20 w-20 flex flex-col items-center justify-center gap-1 transition-all">
              <Plus className="h-5 w-5 text-muted-foreground" />
              <span className="text-[9px] text-muted-foreground">Add</span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[260px] p-3">
            <div className="grid grid-cols-3 gap-2">
              {MOCK_LOGOS.map((l) => {
                const isSel = sel === l.id;
                return (
                  <button key={l.id} onClick={() => { setSel(l.id); setPop(false); }}
                    className={`rounded-xl border-2 p-3 flex flex-col items-center justify-center gap-1.5 aspect-square transition-all ${
                      isSel ? "border-primary bg-primary/8 shadow-sm shadow-primary/10" : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
                    }`}>
                    <img src={l.url} alt={l.name} className="h-10 w-10 object-contain opacity-70" />
                    <span className="text-[8px] text-muted-foreground/60 truncate w-full text-center">{l.name}</span>
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function LogoD() {
  const [sel, setSel] = useState<string | null>(null);
  const [pop, setPop] = useState(false);
  const logo = MOCK_LOGOS.find((l) => l.id === sel);
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Logo</Label>
      <Popover open={pop} onOpenChange={setPop}>
        <PopoverTrigger asChild>
          <button className={`rounded-lg border h-16 w-16 flex items-center justify-center transition-all ${
            logo ? "border-primary/40 bg-card shadow-sm" : "border-dashed border-border hover:border-muted-foreground/40"
          }`}>
            {logo ? (
              <img src={logo.url} alt={logo.name} className="h-10 w-10 object-contain opacity-60" />
            ) : (
              <Plus className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-2">
          <div className="flex gap-2">
            {MOCK_LOGOS.map((l) => {
              const isSel = sel === l.id;
              return (
                <TooltipProvider key={l.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button onClick={() => { setSel(isSel ? null : l.id); setPop(false); }}
                        className={`rounded-lg border-2 h-16 w-16 flex items-center justify-center transition-all ${
                          isSel ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                        }`}>
                        <img src={l.url} alt={l.name} className="h-10 w-10 object-contain opacity-60" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">{l.name}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      {logo && (
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground">{logo.name}</span>
          <button onClick={() => setSel(null)} className="text-muted-foreground hover:text-destructive"><X className="h-3 w-3" /></button>
        </div>
      )}
    </div>
  );
}

function LogoE() {
  const [sel, setSel] = useState<string | null>(null);
  const [pop, setPop] = useState(false);
  const logo = MOCK_LOGOS.find((l) => l.id === sel);
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Logo</Label>
      <div className="flex items-center gap-3">
        <Popover open={pop} onOpenChange={setPop}>
          <PopoverTrigger asChild>
            <div className={`relative h-14 w-14 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
              logo ? "border-primary bg-primary/5" : "border-dashed border-border hover:border-muted-foreground/40"
            }`}>
              {logo ? (
                <img src={logo.url} alt={logo.name} className="h-8 w-8 object-contain opacity-60" />
              ) : (
                <Plus className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-2">
            <div className="flex gap-1.5">
              {MOCK_LOGOS.map((l) => {
                const isSel = sel === l.id;
                return (
                  <button key={l.id} onClick={() => { setSel(l.id); setPop(false); }}
                    className={`h-14 w-14 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSel ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                    }`}>
                    <img src={l.url} alt={l.name} className="h-8 w-8 object-contain opacity-60" />
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
        {logo && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">{logo.name}</span>
            <button onClick={() => setSel(null)} className="text-muted-foreground hover:text-destructive"><X className="h-2.5 w-2.5" /></button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── BRAND VISUALS VARIATIONS ─── */

function VisualsA() {
  const [sel, setSel] = useState<string[]>([]);
  const [pop, setPop] = useState(false);
  const toggle = (id: string) => setSel((p) => p.includes(id) ? p.filter((v) => v !== id) : [...p, id]);
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Brand Visuals</Label>
      <div className="flex flex-wrap items-start gap-2">
        {sel.map((vId) => {
          const v = MOCK_VISUALS.find((x) => x.id === vId);
          if (!v) return null;
          return (
            <div key={v.id} className="relative rounded-lg border border-border bg-muted/30 h-14 w-14 flex items-center justify-center group">
              <Image className="h-5 w-5 text-muted-foreground" />
              <button onClick={() => toggle(v.id)} className="absolute -top-1 -right-1 rounded-full bg-muted border border-border p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground">
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          );
        })}
        <Popover open={pop} onOpenChange={setPop}>
          <PopoverTrigger asChild>
            <button className="rounded-lg border-2 border-dashed border-border hover:border-muted-foreground/40 h-14 w-14 flex items-center justify-center transition-colors">
              <Plus className="h-4 w-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[260px] p-3">
            <div className="grid grid-cols-3 gap-2">
              {MOCK_VISUALS.map((v) => {
                const isSel = sel.includes(v.id);
                return (
                  <button key={v.id} onClick={() => toggle(v.id)}
                    className={`relative rounded-lg border-2 aspect-square flex items-center justify-center transition-all ${
                      isSel ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                    }`}>
                    <Image className="h-6 w-6 text-muted-foreground/60" />
                    {isSel && (
                      <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 text-primary-foreground" />
                      </div>
                    )}
                    <span className="absolute bottom-1 left-1 right-1 text-[7px] text-muted-foreground/60 truncate text-center">{v.name}</span>
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function VisualsB() {
  const [sel, setSel] = useState<string[]>([]);
  const [pop, setPop] = useState(false);
  const toggle = (id: string) => setSel((p) => p.includes(id) ? p.filter((v) => v !== id) : [...p, id]);
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Brand Visuals</Label>
      <div className="flex flex-wrap items-start gap-1.5">
        {sel.map((vId) => {
          const v = MOCK_VISUALS.find((x) => x.id === vId);
          if (!v) return null;
          return (
            <div key={v.id} className="relative group">
              <div className="rounded-md bg-gradient-to-br from-muted/60 to-muted/20 border border-border h-12 w-12 flex items-center justify-center">
                <Image className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="absolute inset-0 rounded-md bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => toggle(v.id)}><X className="h-3 w-3 text-white" /></button>
              </div>
            </div>
          );
        })}
        <Popover open={pop} onOpenChange={setPop}>
          <PopoverTrigger asChild>
            <button className="rounded-md border border-dashed border-border hover:border-primary/40 hover:bg-primary/5 h-12 w-12 flex items-center justify-center transition-all">
              <Plus className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[220px] p-2">
            <div className="grid grid-cols-4 gap-1.5">
              {MOCK_VISUALS.map((v) => {
                const isSel = sel.includes(v.id);
                return (
                  <TooltipProvider key={v.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={() => toggle(v.id)}
                          className={`relative rounded-md border aspect-square flex items-center justify-center transition-all ${
                            isSel ? "border-primary bg-primary/10 ring-2 ring-primary/20" : "border-border hover:bg-muted/50"
                          }`}>
                          <Image className="h-5 w-5 text-muted-foreground/50" />
                          {isSel && (
                            <div className="absolute inset-0 rounded-md bg-primary/10 flex items-center justify-center">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="text-xs">{v.name}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function VisualsC() {
  const [sel, setSel] = useState<string[]>([]);
  const [pop, setPop] = useState(false);
  const toggle = (id: string) => setSel((p) => p.includes(id) ? p.filter((v) => v !== id) : [...p, id]);
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Brand Visuals</Label>
      <Popover open={pop} onOpenChange={setPop}>
        <PopoverTrigger asChild>
          <button className="w-full rounded-lg border border-dashed border-border hover:border-muted-foreground/40 px-3 py-2.5 flex items-center gap-2 transition-all">
            <Plus className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Add visuals{sel.length > 0 ? ` (${sel.length})` : ""}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[280px] p-3">
          <div className="grid grid-cols-3 gap-2">
            {MOCK_VISUALS.map((v) => {
              const isSel = sel.includes(v.id);
              return (
                <button key={v.id} onClick={() => toggle(v.id)}
                  className={`relative rounded-lg border overflow-hidden transition-all ${
                    isSel ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/30"
                  }`}>
                  <div className="aspect-square bg-muted/30 flex items-center justify-center">
                    <Image className="h-7 w-7 text-muted-foreground/40" />
                  </div>
                  {isSel && (
                    <div className="absolute top-0 right-0 bg-primary rounded-bl-md p-0.5">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                  <div className="px-1.5 py-1 bg-card">
                    <span className="text-[8px] text-muted-foreground truncate block">{v.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      {sel.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {sel.map((vId) => {
            const v = MOCK_VISUALS.find((x) => x.id === vId);
            if (!v) return null;
            return (
              <div key={v.id} className="relative rounded-md border border-border bg-muted/30 h-12 w-12 flex items-center justify-center group">
                <Image className="h-4 w-4 text-muted-foreground" />
                <button onClick={() => toggle(v.id)} className="absolute -top-1 -right-1 rounded-full bg-muted border border-border p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground">
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function VisualsD() {
  const [sel, setSel] = useState<string[]>([]);
  const [pop, setPop] = useState(false);
  const toggle = (id: string) => setSel((p) => p.includes(id) ? p.filter((v) => v !== id) : [...p, id]);
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Brand Visuals</Label>
      <div className="grid grid-cols-4 gap-1.5">
        {sel.map((vId) => {
          const v = MOCK_VISUALS.find((x) => x.id === vId);
          if (!v) return null;
          return (
            <div key={v.id} className="relative rounded-lg border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent aspect-square flex flex-col items-center justify-center group">
              <Image className="h-5 w-5 text-muted-foreground" />
              <span className="text-[7px] text-muted-foreground/60 mt-0.5 truncate w-full text-center px-1">{v.name}</span>
              <button onClick={() => toggle(v.id)} className="absolute top-0.5 right-0.5 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground">
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          );
        })}
        <Popover open={pop} onOpenChange={setPop}>
          <PopoverTrigger asChild>
            <button className="rounded-lg border-2 border-dashed border-border hover:border-primary/40 aspect-square flex items-center justify-center transition-all">
              <Plus className="h-4 w-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[240px] p-2">
            <div className="grid grid-cols-3 gap-1.5">
              {MOCK_VISUALS.map((v) => {
                const isSel = sel.includes(v.id);
                return (
                  <button key={v.id} onClick={() => toggle(v.id)}
                    className={`relative rounded-lg aspect-square flex items-center justify-center transition-all ${
                      isSel ? "bg-primary/10 ring-2 ring-primary shadow-sm" : "bg-muted/30 hover:bg-muted/60"
                    }`}>
                    <Image className={`h-6 w-6 ${isSel ? "text-primary/60" : "text-muted-foreground/40"}`} />
                    {isSel && (
                      <div className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-2 w-2 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function VisualsE() {
  const [sel, setSel] = useState<string[]>([]);
  const [pop, setPop] = useState(false);
  const toggle = (id: string) => setSel((p) => p.includes(id) ? p.filter((v) => v !== id) : [...p, id]);
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Brand Visuals</Label>
      <div className="flex flex-wrap items-center gap-2">
        {sel.map((vId) => {
          const v = MOCK_VISUALS.find((x) => x.id === vId);
          if (!v) return null;
          return (
            <TooltipProvider key={v.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative rounded-full border-2 border-primary/40 bg-primary/5 h-12 w-12 flex items-center justify-center group cursor-default">
                    <Image className="h-4 w-4 text-muted-foreground" />
                    <button onClick={() => toggle(v.id)} className="absolute -top-0.5 -right-0.5 rounded-full bg-muted border border-border p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground">
                      <X className="h-2 w-2" />
                    </button>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="text-xs">{v.name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
        <Popover open={pop} onOpenChange={setPop}>
          <PopoverTrigger asChild>
            <button className="rounded-full border-2 border-dashed border-border hover:border-primary/40 h-12 w-12 flex items-center justify-center transition-all">
              <Plus className="h-4 w-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-2">
            <div className="flex gap-1.5">
              {MOCK_VISUALS.map((v) => {
                const isSel = sel.includes(v.id);
                return (
                  <TooltipProvider key={v.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={() => toggle(v.id)}
                          className={`rounded-full h-12 w-12 border-2 flex items-center justify-center transition-all ${
                            isSel ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground/30"
                          }`}>
                          <Image className={`h-5 w-5 ${isSel ? "text-primary" : "text-muted-foreground/50"}`} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="text-xs">{v.name}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─── */

const SectionCard = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-card p-4 space-y-1">
    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{label}</span>
    <div>{children}</div>
  </div>
);

export default function UIVariationsV2() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <div>
          <h1 className="text-xl font-bold">UI Variations — Brand Knowledge Drawer</h1>
          <p className="text-sm text-muted-foreground">Pick one option per section (A–E).</p>
        </div>

        {/* Knowledge */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold border-b pb-2">1 · Knowledge Toggle</h2>
          <div className="grid grid-cols-5 gap-4">
            <SectionCard label="A"><KnowledgeA /></SectionCard>
            <SectionCard label="B"><KnowledgeB /></SectionCard>
            <SectionCard label="C"><KnowledgeC /></SectionCard>
            <SectionCard label="D"><KnowledgeD /></SectionCard>
            <SectionCard label="E"><KnowledgeE /></SectionCard>
          </div>
        </section>

        {/* Logo */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold border-b pb-2">2 · Logo Selection</h2>
          <div className="grid grid-cols-5 gap-4">
            <SectionCard label="A"><LogoA /></SectionCard>
            <SectionCard label="B"><LogoB /></SectionCard>
            <SectionCard label="C"><LogoC /></SectionCard>
            <SectionCard label="D"><LogoD /></SectionCard>
            <SectionCard label="E"><LogoE /></SectionCard>
          </div>
        </section>

        {/* Visuals */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold border-b pb-2">3 · Brand Visuals Selection</h2>
          <div className="grid grid-cols-5 gap-4">
            <SectionCard label="A"><VisualsA /></SectionCard>
            <SectionCard label="B"><VisualsB /></SectionCard>
            <SectionCard label="C"><VisualsC /></SectionCard>
            <SectionCard label="D"><VisualsD /></SectionCard>
            <SectionCard label="E"><VisualsE /></SectionCard>
          </div>
        </section>
      </div>
    </div>
  );
}
