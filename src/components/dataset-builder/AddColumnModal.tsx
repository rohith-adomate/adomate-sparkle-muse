import { useState, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Info, AtSign, ChevronDown } from "lucide-react";
import { getOyImage } from "@/data/oyImages";
import type { DatasetColumn } from "./types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddColumn: (col: DatasetColumn) => void;
  existingColumns?: DatasetColumn[];
}

const PRESETS = [
  { id: "visual-format", name: "Visual format", description: "Testimonial, product demo, lifestyle, before/after", tags: ["format", "creative"], prompt: "Identify the visual format being used — testimonial, product demo, lifestyle, before/after..." },
  { id: "winner-flag", name: "Winner flag", description: "Highlight long-running active ads as proven performers", tags: ["performance"], prompt: "Flag ads that have been running for 60+ days and are still active — these are likely proven winners." },
  { id: "landing-page", name: "Landing page type", description: "PDP, quiz funnel, collection, or homepage", tags: ["conversion"], prompt: "Classify the landing page type each ad links to — PDP, quiz funnel, collection page, or homepage." },
  { id: "hook-angle", name: "Hook angle", description: "Pain point, social proof, price, curiosity, or authority", tags: ["messaging"], prompt: "Identify the hook angle used — pain point, social proof, price anchor, curiosity, or authority." },
  { id: "translate", name: "Translate & explain", description: "For multi-market datasets in other languages", tags: ["localisation"], prompt: "Translate the ad copy to English and explain the hook, angle, and cultural context behind it." },
  { id: "product-relevance", name: "Product relevance", description: "Match competitor ads to your own product catalogue", tags: ["strategy", "products"], prompt: "Score how relevant each competitor ad is to our own product catalogue, and identify which product it maps to." },
  { id: "emotional-trigger", name: "Emotional trigger", description: "Desire, fear, aspiration, convenience, trust", tags: ["psychology"], prompt: "Classify the primary emotional trigger — desire, fear, aspiration, convenience, or trust." },
  { id: "media-mix", name: "Media mix type", description: "Static, UGC, carousel, animation, influencer", tags: ["format"], prompt: "Classify the media type — static image, UGC video, carousel, animation, or influencer content." },
];

const QUICK_CHIPS = ["Visual format", "Winner flag", "Landing page type", "Hook angle", "Translate & explain"];

const MOCK_PRODUCTS = [
  { id: "p1", name: "Daily Moisturizer SPF30", imgIdx: 1 },
  { id: "p2", name: "Vitamin C Serum", imgIdx: 3 },
  { id: "p3", name: "Hydrating Cleanser", imgIdx: 5 },
  { id: "p4", name: "Body Butter", imgIdx: 7 },
  { id: "p5", name: "Lip Balm SPF15", imgIdx: 9 },
];

const DEFAULT_MENTION_COLS = ["Format", "Hook", "Headline", "Days Online", "Status", "Funnel"];

export default function AddColumnModal({ open, onOpenChange, onAddColumn, existingColumns = [] }: Props) {
  const [tab, setTab] = useState<"presets" | "build">("presets");
  const [prompt, setPrompt] = useState("");
  const [showColDropdown, setShowColDropdown] = useState(false);
  const [productsSelected, setProductsSelected] = useState(false);
  const [audiencesSelected, setAudiencesSelected] = useState(false);
  const [productsExpanded, setProductsExpanded] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const mentionCols = useMemo(() => {
    if (existingColumns.length > 0) return existingColumns;
    return DEFAULT_MENTION_COLS.map((name, i) => ({ id: `ref-${i}`, name, type: "facts" as const }));
  }, [existingColumns]);

  const reset = () => { setTab("presets"); setPrompt(""); setShowColDropdown(false); setProductsSelected(false); setAudiencesSelected(false); setProductsExpanded(false); setSelectedProducts(new Set()); };
  const handleClose = (o: boolean) => { if (!o) reset(); onOpenChange(o); };

  const selectPreset = (preset: typeof PRESETS[0]) => { setPrompt(preset.prompt); setTab("build"); setTimeout(() => textareaRef.current?.focus(), 50); };
  const selectChip = (label: string) => { const preset = PRESETS.find(p => p.name === label); if (preset) setPrompt(preset.prompt); setTimeout(() => textareaRef.current?.focus(), 50); };

  const insertColumn = (colName: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart || prompt.length;
    const insert = `[${colName}]`;
    setPrompt(`${prompt.slice(0, pos)}${insert}${prompt.slice(pos)}`);
    setShowColDropdown(false);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(pos + insert.length, pos + insert.length); }, 0);
  };

  const toggleProduct = (id: string) => { setSelectedProducts(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; }); };

  const handleSubmit = () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    onAddColumn({ id: `col-${Date.now()}`, name: trimmed.length > 40 ? trimmed.slice(0, 40) + "..." : trimmed, type: "ai", columnKind: "ai-summary", aiPrompt: trimmed });
    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[560px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Add AI Column</DialogTitle>
        </DialogHeader>
        <div className="px-5 pt-3">
          <div className="flex gap-4 border-b border-border">
            {(["presets", "build"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={cn("pb-2 text-xs font-medium capitalize transition-colors relative", tab === t ? "text-[#7C3AED]" : "text-muted-foreground hover:text-foreground")}>
                {t === "presets" ? "Presets" : "Build"}
                {tab === t && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#7C3AED] rounded-full" />}
              </button>
            ))}
          </div>
        </div>
        <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
          {tab === "presets" ? (
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map(p => (
                <button key={p.id} onClick={() => selectPreset(p)} className={cn("text-left p-3 rounded-lg border border-border transition-all", "hover:border-[#A78BFA] hover:bg-[#F5F3FF] group")}>
                  <p className="text-xs font-semibold text-foreground group-hover:text-[#7C3AED] mb-0.5">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground leading-snug mb-2">{p.description}</p>
                  <div className="flex gap-1 flex-wrap">{p.tags.map(tag => (<span key={tag} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted text-muted-foreground">{tag}</span>))}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <textarea ref={textareaRef} value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Identify the visual format being used — testimonial, product demo, lifestyle, before/after..."
                  className={cn("w-full min-h-[120px] rounded-lg border border-border bg-background px-3 py-2.5 text-sm", "placeholder:text-muted-foreground/50 resize-none", "focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40", "transition-colors")} autoFocus />
                <div className="absolute bottom-2 left-2">
                  <button onClick={() => setShowColDropdown(!showColDropdown)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                    <AtSign className="h-3 w-3" /> columns
                  </button>
                  {showColDropdown && (
                    <div className="absolute bottom-full left-0 mb-1 w-48 rounded-lg border border-border bg-popover shadow-lg overflow-hidden z-50">
                      <p className="text-[10px] font-semibold text-muted-foreground px-3 pt-2 pb-1">Insert column reference</p>
                      <div className="max-h-40 overflow-y-auto pb-1">
                        {mentionCols.map(col => (
                          <button key={col.id} className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted/50 transition-colors flex items-center gap-2" onMouseDown={e => { e.preventDefault(); insertColumn(col.name); }}>
                            {col.type === "ai" && <Sparkles className="h-3 w-3 text-primary shrink-0" />}
                            <span className="truncate">{col.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_CHIPS.map(label => (<button key={label} onClick={() => selectChip(label)} className={cn("px-2.5 py-1 rounded-full text-[10px] font-medium border transition-colors", "border-border text-muted-foreground hover:border-[#A78BFA] hover:text-[#7C3AED] hover:bg-[#F5F3FF]")}>{label}</button>))}
              </div>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground mb-2">Ground in your knowledge</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => { const next = !productsSelected; setProductsSelected(next); if (!next) setProductsExpanded(false); else setProductsExpanded(true); }}
                    className={cn("text-left p-3 rounded-lg border transition-all", productsSelected ? "border-[#A78BFA] bg-[#F5F3FF]" : "border-border hover:border-[#A78BFA]/50")}>
                    <p className={cn("text-xs font-semibold mb-1", productsSelected ? "text-[#7C3AED]" : "text-foreground")}>Products</p>
                    <div className="flex gap-1">
                      {MOCK_PRODUCTS.slice(0, 3).map(p => (<img key={p.id} src={getOyImage(p.imgIdx)} alt={p.name} className="h-6 w-6 rounded object-cover" />))}
                      {MOCK_PRODUCTS.length > 3 && <span className="h-6 w-6 rounded bg-muted flex items-center justify-center text-[9px] font-medium text-muted-foreground">+{MOCK_PRODUCTS.length - 3}</span>}
                    </div>
                  </button>
                  <button onClick={() => setAudiencesSelected(!audiencesSelected)} className={cn("text-left p-3 rounded-lg border transition-all", audiencesSelected ? "border-[#A78BFA] bg-[#F5F3FF]" : "border-border hover:border-[#A78BFA]/50")}>
                    <p className={cn("text-xs font-semibold mb-0.5", audiencesSelected ? "text-[#7C3AED]" : "text-foreground")}>Audiences</p>
                    <p className="text-[10px] text-muted-foreground">3 segments</p>
                  </button>
                </div>
                {productsSelected && productsExpanded && (
                  <div className="mt-2 rounded-lg border border-border bg-muted/20 p-2.5">
                    <button onClick={() => setProductsExpanded(!productsExpanded)} className="flex items-center justify-between w-full text-[10px] font-semibold text-foreground">
                      <span>Select products ({selectedProducts.size > 0 ? `${selectedProducts.size} selected` : "all by default"})</span>
                      <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform", productsExpanded && "rotate-180")} />
                    </button>
                    <div className="mt-2 space-y-0.5">
                      {MOCK_PRODUCTS.map(product => (
                        <label key={product.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer">
                          <input type="checkbox" checked={selectedProducts.has(product.id)} onChange={() => toggleProduct(product.id)} className="h-3 w-3 rounded border-border text-primary focus:ring-primary/30" />
                          <img src={getOyImage(product.imgIdx)} alt={product.name} className="h-5 w-5 rounded object-cover" />
                          <span className="text-[11px] font-medium">{product.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground"><Info className="h-3 w-3" /> ~24 credits estimated</span>
          <Button size="sm" className="h-8 text-xs gap-1.5" disabled={tab === "build" && !prompt.trim()} onClick={() => { if (tab === "presets") return; handleSubmit(); }}>
            <Sparkles className="h-3.5 w-3.5" /> Add column
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
