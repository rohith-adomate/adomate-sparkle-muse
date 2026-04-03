import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, X, Pencil, Workflow, Check, Package } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { ConceptDetailDialog } from "@/components/ConceptDetailDialog";
import { toast } from "sonner";
import { agentRunsById } from "@/data/conceptsData";
import type { Concept } from "@/data/conceptsData";
import oyProductDeoWashHavana from "@/assets/oy/oy-product-deo-wash-havana.png";
import oyProductScalpHairWash from "@/assets/oy/oy-product-scalp-hair-wash.png";
import niveaFreshKickMorning from "@/assets/competitors/nivea-fresh-kick-morning.png";
import niveaFreshKickConcert from "@/assets/competitors/nivea-fresh-kick-concert.png";
import niveaShowerMoisturizer from "@/assets/competitors/nivea-shower-moisturizer.png";
import niveaAntiHairloss from "@/assets/competitors/nivea-anti-hairloss.png";
import niveaMenLogo from "@/assets/competitors/nivea-men-logo.webp";

const rowProducts = [
  {
    name: "Deo Wash Havana", img: oyProductDeoWashHavana,
    competitor: { name: "Nivea", avatar: niveaMenLogo, ad: niveaShowerMoisturizer },
  },
  {
    name: "Scalp & Hair Wash", img: oyProductScalpHairWash,
    competitor: { name: "Nivea Men", avatar: niveaMenLogo, ad: niveaAntiHairloss },
  },
  {
    name: "Deo Wash Havana", img: oyProductDeoWashHavana,
    competitor: { name: "Nivea Men", avatar: niveaMenLogo, ad: niveaFreshKickConcert },
  },
  {
    name: "Scalp & Hair Wash", img: oyProductScalpHairWash,
    competitor: { name: "Nivea Men", avatar: niveaMenLogo, ad: niveaFreshKickMorning },
  },
];

export default function ConceptsRunDetail() {
  const { runId } = useParams();
  const navigate = useNavigate();
  const run = runId ? agentRunsById[runId] : null;

  const [selected, setSelected] = useState<Concept | null>(null);



  // All concepts flat list for navigation
  const allConcepts = run?.concepts ?? [];

  const handleNavigate = useCallback((dir: "prev" | "next") => {
    if (!selected || allConcepts.length === 0) return;
    const idx = allConcepts.findIndex(c => c.id === selected.id);
    if (dir === "prev" && idx > 0) {
      setSelected(allConcepts[idx - 1]);
    } else if (dir === "next" && idx < allConcepts.length - 1) {
      setSelected(allConcepts[idx + 1]);
    }
  }, [selected, allConcepts]);

  const [statusOverrides, setStatusOverrides] = useState<Record<string, "pending" | "accepted" | "rejected">>({});

  const handleStatusChange = useCallback((id: string, status: "pending" | "accepted" | "rejected") => {
    setStatusOverrides(prev => ({ ...prev, [id]: status }));
  }, []);

  const getStatus = useCallback((id: string) => {
    return statusOverrides[id] ?? allConcepts.find(c => c.id === id)?.status ?? "pending";
  }, [statusOverrides, allConcepts]);

  // Editable title state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(run?.label ?? "");
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const saveTitle = () => {
    if (editedTitle.trim()) {
      toast.success("Title updated");
    }
    setIsEditingTitle(false);
  };
  if (!run) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <p className="text-muted-foreground">Agent run not found.</p>
        <Button variant="outline" onClick={() => navigate("/concepts")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Concepts
        </Button>
      </div>
    );
  }

  // Group concepts into pairs of 2
  const conceptPairs: Concept[][] = [];
  for (let i = 0; i < run.concepts.length; i += 2) {
    conceptPairs.push(run.concepts.slice(i, i + 2));
  }

  // Show product card only for the first project
  const isFirstProject = runId === "ai-image-studio-1";

  // Derive context images and prompt for the selected concept
  const selectedRowIdx = selected
    ? conceptPairs.findIndex(pair => pair.some(c => c.id === selected.id))
    : -1;
  const selectedProduct = selectedRowIdx >= 0
    ? rowProducts[selectedRowIdx % rowProducts.length]
    : null;
  const selectedContextImages = selectedProduct
    ? [
        { src: selectedProduct.competitor.ad, label: `${selectedProduct.competitor.name} Ad` },
        { src: selectedProduct.img, label: selectedProduct.name },
      ]
    : [];
  const selectedPrompt = selected
    ? `Generate ad concepts for ${selectedProduct?.name ?? "product"} inspired by ${selectedProduct?.competitor.name ?? "competitor"} ad creative. Campaign: ${selected.campaign}. Source: ${selected.source}. Focus on competitive positioning and visual differentiation.`
    : undefined;

  return (
    <div className="space-y-6 px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/concepts")} className="shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="space-y-1">
          {/* Editable title row */}
          <div className="flex items-center gap-2 group/title">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <Input
                  ref={titleInputRef}
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveTitle();
                    if (e.key === "Escape") { setEditedTitle(run.label); setIsEditingTitle(false); }
                  }}
                  className="text-2xl font-bold tracking-tight h-auto py-1 px-2.5 w-auto max-w-md rounded-full border"
                />
                <button
                  onClick={() => saveTitle()}
                  className="p-0.5 rounded hover:bg-accent text-primary"
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  onClick={() => { setEditedTitle(run.label); setIsEditingTitle(false); }}
                  className="p-0.5 rounded hover:bg-accent text-muted-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold tracking-tight">{editedTitle || run.label}</h1>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => { setEditedTitle(editedTitle || run.label); setIsEditingTitle(true); }}
                      className="opacity-0 group-hover/title:opacity-100 transition-opacity p-1 rounded-md hover:bg-accent"
                    >
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Edit title</TooltipContent>
                </Tooltip>
              </>
            )}
          </div>

          {/* Time + workflow badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{run.time} · {run.concepts.length} concepts generated</span>
            {run.workflowName && (
              <Badge
                variant="outline"
                className="text-xs bg-muted/50 text-muted-foreground border-border cursor-pointer hover:bg-muted transition-colors gap-1"
                onClick={(e) => { e.stopPropagation(); navigate(`/workflows/${run.workflowId}`); }}
              >
                <Workflow className="h-3 w-3" />
                {run.workflowName}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Concept rows — 10 variations of the sidebar */}
      <div className="space-y-6 px-4">
        {Array.from({ length: 10 }, (_, rowIdx) => {
          const product = rowProducts[0];
          const pair = conceptPairs[0] ?? [];

          const renderSidebar = (variant: number) => {
            switch (variant) {
              /* V1 — Nested cards + horizontal product row */
              case 0:
                return (
                  <div className="rounded-xl border bg-muted/30 p-2 shadow-sm space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">V1</p>
                    <div className="rounded-lg border bg-card p-2 space-y-2">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">Based on</p>
                      <div className="rounded-md overflow-hidden border border-border">
                        <img src={product.competitor.ad} alt="Based on" className="w-full aspect-square object-cover" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <img src={product.competitor.avatar} alt={product.competitor.name} className="h-3.5 w-3.5 rounded-full border border-border" />
                        <span className="text-[10px] text-muted-foreground">{product.competitor.name}</span>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-card p-2 flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg border border-border/60 bg-muted flex items-center justify-center overflow-hidden p-1 shrink-0">
                        <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <p className="text-[11px] font-semibold text-foreground truncate">{product.name}</p>
                        <span className="text-[9px] text-muted-foreground">Product</span>
                      </div>
                    </div>
                  </div>
                );

              /* V2 — Nested cards, compact image with "vs" connector */
              case 1:
                return (
                  <div className="rounded-xl border bg-muted/30 p-2 shadow-sm space-y-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">V2</p>
                    <div className="rounded-lg border bg-card p-2 space-y-2">
                      <div className="rounded-md overflow-hidden border border-border">
                        <img src={product.competitor.ad} alt="Based on" className="w-full aspect-[4/3] object-cover" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <img src={product.competitor.avatar} alt={product.competitor.name} className="h-3.5 w-3.5 rounded-full border border-border" />
                        <span className="text-[10px] text-muted-foreground">{product.competitor.name}</span>
                        <span className="text-[9px] text-muted-foreground ml-auto">Based on</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-[9px] text-muted-foreground/60 font-medium">×</span>
                    </div>
                    <div className="rounded-lg border bg-card p-2 flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg border border-border/60 bg-muted flex items-center justify-center overflow-hidden p-1 shrink-0">
                        <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
                      </div>
                      <p className="text-[11px] font-semibold text-foreground truncate">{product.name}</p>
                    </div>
                  </div>
                );

              /* V3 — Single card, horizontal product + stacked competitor */
              case 2:
                return (
                  <div className="rounded-xl border bg-card p-3 shadow-sm space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">V3</p>
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-lg border border-border/60 bg-muted flex items-center justify-center overflow-hidden p-1.5 shrink-0">
                        <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <p className="text-[11px] font-semibold text-foreground truncate">{product.name}</p>
                        <span className="text-[9px] text-muted-foreground">Product</span>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-muted/30 p-2 space-y-2">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">Based on</p>
                      <div className="rounded-md overflow-hidden border border-border">
                        <img src={product.competitor.ad} alt="Based on" className="w-full aspect-square object-cover" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <img src={product.competitor.avatar} alt={product.competitor.name} className="h-3.5 w-3.5 rounded-full border border-border" />
                        <span className="text-[10px] text-muted-foreground">{product.competitor.name}</span>
                      </div>
                    </div>
                  </div>
                );

              /* V4 — Nested cards, no labels, avatar badge on image */
              case 3:
                return (
                  <div className="rounded-xl border bg-muted/30 p-2 shadow-sm space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">V4</p>
                    <div className="rounded-lg border bg-card p-2 space-y-0">
                      <div className="relative rounded-md overflow-hidden border border-border">
                        <img src={product.competitor.ad} alt="Based on" className="w-full aspect-square object-cover" />
                        <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-card/90 backdrop-blur-sm rounded-full px-1.5 py-0.5 border border-border/50">
                          <img src={product.competitor.avatar} alt={product.competitor.name} className="h-3 w-3 rounded-full" />
                          <span className="text-[9px] font-medium text-foreground">{product.competitor.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-card p-2 flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg border border-border/60 bg-muted flex items-center justify-center overflow-hidden p-1 shrink-0">
                        <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
                      </div>
                      <p className="text-[11px] font-semibold text-foreground truncate">{product.name}</p>
                    </div>
                  </div>
                );

              /* V5 — Compact horizontal with nested "based on" pill */
              case 4:
                return (
                  <div className="rounded-xl border bg-card p-3 shadow-sm space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">V5</p>
                    <div className="rounded-lg overflow-hidden border border-border">
                      <img src={product.competitor.ad} alt="Based on" className="w-full aspect-[4/3] object-cover" />
                    </div>
                    <div className="rounded-lg bg-muted/40 p-2 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-muted-foreground font-medium">Based on</span>
                        <img src={product.competitor.avatar} alt={product.competitor.name} className="h-3.5 w-3.5 rounded-full border border-border" />
                        <span className="text-[10px] text-muted-foreground truncate">{product.competitor.name}</span>
                      </div>
                      <div className="h-px bg-border/50" />
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-lg border border-border/60 bg-card flex items-center justify-center overflow-hidden p-1 shrink-0">
                          <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
                        </div>
                        <p className="text-[11px] font-semibold text-foreground truncate">{product.name}</p>
                      </div>
                    </div>
                  </div>
                );

              /* V6 — Nested cards, product card on top */
              case 5:
                return (
                  <div className="rounded-xl border bg-muted/30 p-2 shadow-sm space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">V6</p>
                    <div className="rounded-lg border bg-card p-2 flex items-center gap-3">
                      <div className="h-14 w-14 rounded-lg border border-border/60 bg-muted flex items-center justify-center overflow-hidden p-1.5 shrink-0">
                        <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <p className="text-[11px] font-semibold text-foreground truncate">{product.name}</p>
                        <span className="text-[9px] text-muted-foreground">Product</span>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-card p-2 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">Based on</span>
                        <span className="text-[9px] text-muted-foreground/60">·</span>
                        <img src={product.competitor.avatar} alt={product.competitor.name} className="h-3 w-3 rounded-full border border-border" />
                        <span className="text-[9px] text-muted-foreground">{product.competitor.name}</span>
                      </div>
                      <div className="rounded-md overflow-hidden border border-border">
                        <img src={product.competitor.ad} alt="Based on" className="w-full aspect-square object-cover" />
                      </div>
                    </div>
                  </div>
                );

              /* V7 — Compact horizontal, product overlay on competitor */
              case 6:
                return (
                  <div className="rounded-xl border bg-card p-3 shadow-sm space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">V7</p>
                    <div className="relative rounded-lg overflow-hidden border border-border">
                      <img src={product.competitor.ad} alt="Based on" className="w-full aspect-square object-cover" />
                      <div className="absolute bottom-2 right-2 h-14 w-14 rounded-lg border-2 border-card bg-card shadow-lg flex items-center justify-center overflow-hidden p-1">
                        <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <p className="text-[11px] font-semibold text-foreground truncate">{product.name}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-muted-foreground">Based on</span>
                          <img src={product.competitor.avatar} alt={product.competitor.name} className="h-3.5 w-3.5 rounded-full border border-border" />
                          <span className="text-[10px] text-muted-foreground truncate">{product.competitor.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );

              /* V8 — Nested, dashed separator between cards */
              case 7:
                return (
                  <div className="rounded-xl border bg-muted/30 p-2 shadow-sm space-y-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-2">V8</p>
                    <div className="rounded-t-lg border border-b-0 bg-card p-2 space-y-2">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">Based on</p>
                      <div className="rounded-md overflow-hidden border border-border">
                        <img src={product.competitor.ad} alt="Based on" className="w-full aspect-square object-cover" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <img src={product.competitor.avatar} alt={product.competitor.name} className="h-3.5 w-3.5 rounded-full border border-border" />
                        <span className="text-[10px] text-muted-foreground">{product.competitor.name}</span>
                      </div>
                    </div>
                    <div className="border-t border-dashed border-border" />
                    <div className="rounded-b-lg border border-t-0 bg-card p-2 flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg border border-border/60 bg-muted flex items-center justify-center overflow-hidden p-1 shrink-0">
                        <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
                      </div>
                      <p className="text-[11px] font-semibold text-foreground truncate">{product.name}</p>
                    </div>
                  </div>
                );

              /* V9 — Horizontal bottom row, large image, compact meta */
              case 8:
                return (
                  <div className="rounded-xl border bg-card p-2.5 shadow-sm space-y-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">V9</p>
                    <div className="rounded-lg overflow-hidden border border-border">
                      <img src={product.competitor.ad} alt="Based on" className="w-full aspect-square object-cover" />
                    </div>
                    <div className="rounded-lg bg-muted/30 border border-border/50 p-2 flex items-center gap-2">
                      <div className="h-10 w-10 rounded border border-border/60 bg-card flex items-center justify-center overflow-hidden p-0.5 shrink-0">
                        <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
                      </div>
                      <div className="flex flex-col gap-0 min-w-0 flex-1">
                        <p className="text-[10px] font-semibold text-foreground truncate">{product.name}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-[8px] text-muted-foreground">based on</span>
                          <img src={product.competitor.avatar} alt={product.competitor.name} className="h-3 w-3 rounded-full border border-border" />
                          <span className="text-[9px] text-muted-foreground truncate">{product.competitor.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );

              /* V10 — Nested cards, side-by-side thumbnails */
              case 9:
                return (
                  <div className="rounded-xl border bg-muted/30 p-2 shadow-sm space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">V10</p>
                    <div className="rounded-lg border bg-card p-2 space-y-2">
                      <div className="rounded-md overflow-hidden border border-border">
                        <img src={product.competitor.ad} alt="Based on" className="w-full aspect-square object-cover" />
                      </div>
                    </div>
                    <div className="rounded-lg border bg-card p-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <img src={product.competitor.avatar} alt={product.competitor.name} className="h-4 w-4 rounded-full border border-border shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] text-muted-foreground truncate">{product.competitor.name}</span>
                            <span className="text-[8px] text-muted-foreground/60">Based on</span>
                          </div>
                        </div>
                        <div className="w-px h-8 bg-border" />
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <div className="h-8 w-8 rounded border border-border/60 bg-muted flex items-center justify-center overflow-hidden p-0.5 shrink-0">
                            <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-medium text-foreground truncate">{product.name}</span>
                            <span className="text-[8px] text-muted-foreground/60">Product</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );

              default:
                return null;
            }
          };

          return (
            <div key={rowIdx} className="flex gap-4">
              {/* Sidebar variation */}
              <div className="w-[200px] shrink-0">
                <div className="sticky top-4">
                  {renderSidebar(rowIdx)}
                </div>
              </div>

              {/* Concept images – strict 3-column grid */}
              <div className="flex-1 min-w-0 grid grid-cols-3 gap-4">
                {pair.length > 0 ? (
                  <>
                    {pair.map((c) => {
                      const cStatus = getStatus(c.id);
                      return (
                      <Card
                        key={c.id}
                        className={`cursor-pointer overflow-hidden group hover:shadow-md transition-shadow ${cStatus === "accepted" ? "ring-[3px] ring-emerald-400/70" : cStatus === "rejected" ? "ring-[3px] ring-red-400/70" : ""}`}
                        onClick={() => setSelected(c)}
                      >
                        <CardContent className="p-0">
                          <div className="aspect-square relative overflow-hidden bg-muted">
                            <img
                              src={c.img || `https://picsum.photos/seed/${c.imgSeed}/400/400`}
                              alt={c.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </CardContent>
                      </Card>
                      );
                    })}
                    {Array.from({ length: 3 - pair.length }, (_, i) => (
                      <div key={`empty-${i}`} className="aspect-square" />
                    ))}
                  </>
                ) : (
                  <>
                    <div className="aspect-square" />
                    <div className="aspect-square" />
                    <div className="aspect-square" />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ConceptDetailDialog
        concept={selected}
        run={run}
        runLabel={editedTitle || run.label}
        open={!!selected}
        onOpenChange={(o) => { if (!o) setSelected(null); }}
        onStatusChange={handleStatusChange}
        onNavigate={handleNavigate}
        getStatus={getStatus}
        contextImages={selectedContextImages}
        prompt={selectedPrompt}
        conceptIndex={selected ? allConcepts.findIndex(c => c.id === selected.id) : 0}
        totalConcepts={allConcepts.length}
      />
    </div>
  );
}
