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
    if (dir === "prev") {
      setSelected(allConcepts[(idx - 1 + allConcepts.length) % allConcepts.length]);
    } else {
      setSelected(allConcepts[(idx + 1) % allConcepts.length]);
    }
  }, [selected, allConcepts]);

  const handleStatusChange = useCallback((id: string, status: "accepted" | "rejected") => {
    toast.success(status === "accepted" ? "💚 Concept accepted!" : "❌ Concept rejected");
  }, []);

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

      {/* Concept rows */}
      <div className="space-y-6 px-4">
        {Array.from({ length: Math.max(4, conceptPairs.length) }, (_, rowIdx) => {
          const product = rowProducts[rowIdx % rowProducts.length];
          const pair = conceptPairs[rowIdx] ?? [];
          const minRows = 4;

          return (
            <div key={rowIdx} className="flex gap-4">
              {/* Sidebar card – V9: Compact inline title */}
              {isFirstProject && (
                <div className="w-[200px] shrink-0">
                  <div className="sticky top-4 space-y-0">
                    <div className="rounded-xl border bg-card p-2.5 shadow-sm relative z-10">
                      <div className="flex items-center gap-1.5 mb-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Competitor Ad</p>
                        <span className="text-[9px] text-muted-foreground/60">·</span>
                        <div className="flex items-center gap-1">
                          <img src={product.competitor.avatar} alt={product.competitor.name} className="h-3 w-3 rounded-full border border-border" />
                          <span className="text-[10px] text-muted-foreground">{product.competitor.name}</span>
                        </div>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-border">
                        <img src={product.competitor.ad} alt="Competitor ad" className="w-full aspect-square object-cover" />
                      </div>
                    </div>
                    <div className="rounded-xl border bg-muted/50 p-2.5 -mt-2 pt-5 relative z-0">
                      <div className="flex items-center gap-2">
                        <div className="h-12 w-12 rounded-lg border border-border/60 bg-card flex items-center justify-center overflow-hidden p-1 shrink-0">
                          <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
                        </div>
                        <p className="text-[11px] font-semibold text-foreground">{product.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Concept images – strict 3-column grid */}
              <div className="flex-1 min-w-0 grid grid-cols-3 gap-4">
                {pair.length > 0 ? (
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
      />
    </div>
  );
}
