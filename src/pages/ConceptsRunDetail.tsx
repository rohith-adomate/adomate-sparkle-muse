import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, X, MessageSquare, Heart, Pencil, Workflow, Check, Package } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { agentRunsById, statusDot, statusBadge } from "@/data/conceptsData";
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
    competitor: { name: "Nivea Men", avatar: niveaMenLogo, ad: niveaFreshKickMorning },
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
    competitor: { name: "Nivea", avatar: niveaMenLogo, ad: niveaShowerMoisturizer },
  },
];

export default function ConceptsRunDetail() {
  const { runId } = useParams();
  const navigate = useNavigate();
  const run = runId ? agentRunsById[runId] : null;

  const [selected, setSelected] = useState<Concept | null>(null);
  const [swipeAnim, setSwipeAnim] = useState<"left" | "right" | null>(null);
  const [showIterate, setShowIterate] = useState(false);

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

  const updateStatus = (id: string, status: "accepted" | "rejected") => {
    setSwipeAnim(status === "accepted" ? "right" : "left");
    setTimeout(() => {
      setSelected(null);
      setSwipeAnim(null);
      setShowIterate(false);
      toast.success(status === "accepted" ? "💚 Concept accepted!" : "❌ Concept rejected");
    }, 400);
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

  return (
    <div className="space-y-6">
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

      {/* Showcase: 10 sidebar card variations */}
      <div className="space-y-6">
        {Array.from({ length: 10 }, (_, varIdx) => {
          const product = rowProducts[0];
          const pair = conceptPairs[0];
          const variationLabel = `Variation ${varIdx + 1}`;

          return (
            <div key={varIdx}>
              <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">{variationLabel}</p>
              <div className="flex gap-4">
                {/* Variation cards */}
                <div className="w-[200px] shrink-0">
                  {varIdx === 0 && (
                    /* V1: Current — stacked sections with divider */
                    <div className="rounded-xl border bg-card p-3 space-y-3 sticky top-4">
                      <div className="space-y-2">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Based on competitor ad</span>
                        <div className="rounded-lg border border-border overflow-hidden">
                          <img src={product.competitor.ad} alt="Competitor ad" className="w-full aspect-square object-cover" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <img src={product.competitor.avatar} alt={product.competitor.name} className="h-4 w-4 rounded-full object-cover border border-border" />
                          <span className="text-[11px] text-muted-foreground">{product.competitor.name}</span>
                        </div>
                      </div>
                      <div className="border-t border-border pt-3 space-y-2">
                        <div className="flex items-center gap-1.5">
                          <Package className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Product</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-20 w-20 rounded-lg bg-muted/30 border border-border/60 flex items-center justify-center overflow-hidden p-1.5">
                            <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
                          </div>
                          <div className="text-center space-y-0.5">
                            <p className="text-xs font-semibold text-foreground">{product.name}</p>
                            <p className="text-[10px] text-muted-foreground">Oy Care</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {varIdx === 1 && (
                    /* V2: Overlapping card — product thumbnail overlaps competitor ad bottom-right */
                    <div className="rounded-xl border bg-card p-3 space-y-2 sticky top-4">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Inspiration</span>
                      <div className="relative">
                        <div className="rounded-lg border border-border overflow-hidden">
                          <img src={product.competitor.ad} alt="Competitor ad" className="w-full aspect-[4/5] object-cover" />
                        </div>
                        <div className="absolute -bottom-3 -right-2 h-14 w-14 rounded-lg border-2 border-card bg-card shadow-md flex items-center justify-center overflow-hidden p-1">
                          <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
                        </div>
                      </div>
                      <div className="pt-2 space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <img src={product.competitor.avatar} alt={product.competitor.name} className="h-4 w-4 rounded-full border border-border" />
                          <span className="text-[11px] text-muted-foreground">{product.competitor.name}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">→ <span className="font-medium text-foreground">{product.name}</span></p>
                      </div>
                    </div>
                  )}

                  {varIdx === 2 && (
                    /* V3: Side-by-side thumbnails — compact horizontal layout */
                    <div className="rounded-xl border bg-card p-3 space-y-2.5 sticky top-4">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Source → Product</span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-lg border border-border overflow-hidden">
                          <img src={product.competitor.ad} alt="Competitor ad" className="w-full aspect-square object-cover" />
                        </div>
                        <div className="flex flex-col items-center gap-0.5 text-muted-foreground">
                          <ArrowLeft className="h-3 w-3 rotate-180" />
                        </div>
                        <div className="w-14 h-14 rounded-lg border border-border bg-muted/30 flex items-center justify-center overflow-hidden p-1 shrink-0">
                          <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1">
                          <img src={product.competitor.avatar} alt={product.competitor.name} className="h-3.5 w-3.5 rounded-full border border-border" />
                          <span className="text-muted-foreground">{product.competitor.name}</span>
                        </div>
                        <span className="font-medium text-foreground">{product.name}</span>
                      </div>
                    </div>
                  )}

                  {varIdx === 3 && (
                    /* V4: Tab-style toggle — two sections shown as pseudo-tabs */
                    <div className="rounded-xl border bg-card sticky top-4 overflow-hidden">
                      <div className="flex border-b border-border">
                        <div className="flex-1 px-2 py-1.5 text-[10px] font-medium text-center bg-muted/50 text-foreground border-b-2 border-primary">Ad</div>
                        <div className="flex-1 px-2 py-1.5 text-[10px] font-medium text-center text-muted-foreground">Product</div>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="rounded-lg border border-border overflow-hidden">
                          <img src={product.competitor.ad} alt="Competitor ad" className="w-full aspect-square object-cover" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <img src={product.competitor.avatar} alt={product.competitor.name} className="h-4 w-4 rounded-full border border-border" />
                          <span className="text-[11px] text-muted-foreground">{product.competitor.name}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/40 rounded-lg p-2">
                          <div className="h-10 w-10 rounded border border-border/60 bg-card flex items-center justify-center overflow-hidden p-0.5 shrink-0">
                            <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-foreground">{product.name}</p>
                            <p className="text-[9px] text-muted-foreground">Oy Care</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {varIdx === 4 && (
                    /* V5: Pill-badge style — ultra compact with inline badges */
                    <div className="rounded-xl border bg-card p-3 space-y-3 sticky top-4">
                      <div className="rounded-lg border border-border overflow-hidden">
                        <img src={product.competitor.ad} alt="Competitor ad" className="w-full aspect-[4/5] object-cover" />
                      </div>
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 bg-muted/60 rounded-full px-2.5 py-1">
                          <img src={product.competitor.avatar} alt={product.competitor.name} className="h-3.5 w-3.5 rounded-full border border-border" />
                          <span className="text-[10px] font-medium text-foreground">{product.competitor.name}</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 bg-muted/60 rounded-full px-2.5 py-1">
                          <div className="h-3.5 w-3.5 rounded border border-border/60 bg-card overflow-hidden flex items-center justify-center">
                            <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
                          </div>
                          <span className="text-[10px] font-medium text-foreground">{product.name}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {varIdx === 5 && (
                    /* V6: Timeline/flow — vertical connector line between competitor and product */
                    <div className="rounded-xl border bg-card p-3 sticky top-4">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="h-5 w-5 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          </div>
                          <div className="w-px flex-1 bg-border my-1" />
                          <div className="h-5 w-5 rounded-full bg-muted border-2 border-border flex items-center justify-center">
                            <Package className="h-2.5 w-2.5 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Competitor Ad</span>
                            <div className="rounded-lg border border-border overflow-hidden">
                              <img src={product.competitor.ad} alt="Competitor ad" className="w-full aspect-square object-cover" />
                            </div>
                            <div className="flex items-center gap-1">
                              <img src={product.competitor.avatar} alt={product.competitor.name} className="h-3.5 w-3.5 rounded-full border border-border" />
                              <span className="text-[10px] text-muted-foreground">{product.competitor.name}</span>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Your Product</span>
                            <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-2">
                              <div className="h-12 w-12 rounded border border-border/60 bg-card flex items-center justify-center overflow-hidden p-1 shrink-0">
                                <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold text-foreground">{product.name}</p>
                                <p className="text-[9px] text-muted-foreground">Oy Care</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {varIdx === 6 && (
                    /* V7: Stacked cards with depth — two layered cards */
                    <div className="sticky top-4 space-y-0">
                      <div className="rounded-xl border bg-card p-2.5 shadow-sm relative z-10">
                        <div className="rounded-lg overflow-hidden border border-border">
                          <img src={product.competitor.ad} alt="Competitor ad" className="w-full aspect-square object-cover" />
                        </div>
                        <div className="flex items-center gap-1.5 mt-2">
                          <img src={product.competitor.avatar} alt={product.competitor.name} className="h-4 w-4 rounded-full border border-border" />
                          <div>
                            <p className="text-[11px] font-medium text-foreground">{product.competitor.name}</p>
                            <p className="text-[9px] text-muted-foreground">Competitor Ad</p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-xl border bg-muted/50 p-2.5 -mt-2 pt-5 relative z-0">
                        <div className="flex items-center gap-2">
                          <div className="h-12 w-12 rounded-lg border border-border/60 bg-card flex items-center justify-center overflow-hidden p-1 shrink-0">
                            <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-foreground">{product.name}</p>
                            <p className="text-[9px] text-muted-foreground">Oy Care</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {varIdx === 7 && (
                    /* V8: Full-bleed image with overlay text */
                    <div className="rounded-xl border overflow-hidden sticky top-4">
                      <div className="relative">
                        <img src={product.competitor.ad} alt="Competitor ad" className="w-full aspect-[3/4] object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                          <div className="flex items-center gap-1.5">
                            <img src={product.competitor.avatar} alt={product.competitor.name} className="h-4 w-4 rounded-full border border-white/30" />
                            <span className="text-[11px] font-medium text-white">{product.competitor.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-card p-2.5 flex items-center gap-2">
                        <div className="h-10 w-10 rounded border border-border/60 bg-muted/30 flex items-center justify-center overflow-hidden p-0.5 shrink-0">
                          <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-foreground">{product.name}</p>
                          <p className="text-[9px] text-muted-foreground">Oy Care</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {varIdx === 8 && (
                    /* V9: Minimal line — just essential info, very compact */
                    <div className="rounded-xl border bg-card p-2 sticky top-4 space-y-2">
                      <div className="rounded-md overflow-hidden">
                        <img src={product.competitor.ad} alt="Competitor ad" className="w-full aspect-square object-cover" />
                      </div>
                      <div className="h-px bg-border" />
                      <div className="flex items-center gap-1.5 px-1">
                        <img src={product.competitor.avatar} alt={product.competitor.name} className="h-3.5 w-3.5 rounded-full border border-border" />
                        <span className="text-[10px] text-muted-foreground flex-1">{product.competitor.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-1">
                        <div className="h-3.5 w-3.5 rounded border border-border/60 bg-muted/30 flex items-center justify-center overflow-hidden">
                          <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
                        </div>
                        <span className="text-[10px] font-medium text-foreground flex-1">{product.name}</span>
                      </div>
                    </div>
                  )}

                  {varIdx === 9 && (
                    /* V10: Split diagonal — competitor ad top with angled product strip */
                    <div className="rounded-xl border bg-card overflow-hidden sticky top-4">
                      <div className="relative">
                        <img src={product.competitor.ad} alt="Competitor ad" className="w-full aspect-square object-cover" />
                        <div className="absolute top-2 left-2">
                          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5">
                            <img src={product.competitor.avatar} alt={product.competitor.name} className="h-3 w-3 rounded-full" />
                            <span className="text-[9px] text-white font-medium">{product.competitor.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-2.5 bg-gradient-to-r from-muted/50 to-card flex items-center gap-2 border-t border-border">
                        <div className="h-12 w-12 rounded-lg border border-border/60 bg-card flex items-center justify-center overflow-hidden p-1 shrink-0 shadow-sm">
                          <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Product</p>
                          <p className="text-[11px] font-semibold text-foreground">{product.name}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Concept images */}
                <div className="flex-1 min-w-0 grid grid-cols-3 gap-4">
                  {pair ? (
                    <>
                      {pair.map((c) => (
                        <Card
                          key={c.id}
                          className={`cursor-pointer overflow-hidden group hover:shadow-md transition-shadow ${c.status === "accepted" ? "ring-[3px] ring-emerald-400/70" : ""}`}
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
                      ))}
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
            </div>
          );
        })}
      </div>

      {/* Tinder-style concept detail */}
      <Dialog open={!!selected} onOpenChange={(o) => { if (!o) { setSelected(null); setSwipeAnim(null); setShowIterate(false); } }}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          {selected && (
            <div className="flex flex-col">
              <div className={`relative transition-all duration-300 ease-out ${
                swipeAnim === "left" ? "-translate-x-full opacity-0 rotate-[-12deg]" :
                swipeAnim === "right" ? "translate-x-full opacity-0 rotate-[12deg]" : ""
              }`}>
                {swipeAnim && (
                  <div className={`absolute inset-0 z-10 rounded-t-lg transition-opacity duration-200 ${
                    swipeAnim === "right" ? "bg-emerald-500/20" : "bg-red-500/20"
                  }`} />
                )}
                <div className="h-72 relative overflow-hidden bg-muted">
                  <img src={selected.img || `https://picsum.photos/seed/${selected.imgSeed}/500/400`} alt={selected.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge variant="outline" className={`text-xs border ${statusBadge[selected.status]} bg-white/90 backdrop-blur-sm`}>{selected.status}</Badge>
                  </div>
                </div>
              </div>
              <div className="px-6 pt-4 pb-2 space-y-2">
                <h2 className="text-xl font-bold tracking-tight">{selected.title}</h2>
                <div className="flex gap-4 text-sm">
                  <div><span className="text-xs text-muted-foreground uppercase tracking-wider">Source</span><p className="font-medium mt-0.5">{selected.source}</p></div>
                  <div><span className="text-xs text-muted-foreground uppercase tracking-wider">Campaign</span><p className="font-medium mt-0.5">{selected.campaign}</p></div>
                </div>
              </div>
              {showIterate && (
                <div className="px-6 py-2 space-y-2">
                  <Textarea placeholder="Provide feedback for iteration..." rows={3} />
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => { setSelected(null); setShowIterate(false); toast.info("Feedback sent for iteration"); }}>Send Feedback</Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowIterate(false)}>Cancel</Button>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-center gap-6 p-6 pt-3">
                <button onClick={() => updateStatus(selected.id, "rejected")} className="h-16 w-16 rounded-full border-2 border-red-300 bg-red-50 flex items-center justify-center hover:bg-red-100 hover:border-red-400 hover:scale-110 transition-all shadow-lg">
                  <X className="h-7 w-7 text-red-500" />
                </button>
                <button onClick={() => setShowIterate(!showIterate)} className="h-12 w-12 rounded-full border-2 border-blue-300 bg-blue-50 flex items-center justify-center hover:bg-blue-100 hover:border-blue-400 hover:scale-110 transition-all shadow-md">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                </button>
                <button onClick={() => updateStatus(selected.id, "accepted")} className="h-16 w-16 rounded-full border-2 border-emerald-300 bg-emerald-50 flex items-center justify-center hover:bg-emerald-100 hover:border-emerald-400 hover:scale-110 transition-all shadow-lg">
                  <Heart className="h-7 w-7 text-emerald-500" />
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
