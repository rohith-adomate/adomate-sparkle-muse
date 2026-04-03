import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Pencil, Workflow, Check, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HoverExplainer } from "@/components/HoverExplainer";
import { agentRuns, statusDot } from "@/data/conceptsData";

const CARDS_PER_ROW = 5;

const rowStyle = {
  container: "rounded-xl p-4 -mx-4 transition-all duration-300 border border-transparent border-l-4 border-l-transparent",
  hover: "hover:bg-gradient-to-r hover:from-accent/40 hover:via-accent/20 hover:to-transparent hover:border-border/50 hover:border-l-primary",
  titleHover: "group-hover/run:text-pink-600",
  cardHover: "group-hover/run:shadow-sm group-hover/run:ring-1 group-hover/run:ring-pink-200/50",
  overflowIdle: "border-dashed border-border bg-muted/20",
  overflowHover: "group-hover/run:bg-pink-50 group-hover/run:border-pink-300/50",
};


export default function Concepts() {
  const navigate = useNavigate();
  const [editingRunId, setEditingRunId] = useState<string | null>(null);
  const [editedTitles, setEditedTitles] = useState<Record<string, string>>({});
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingRunId && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingRunId]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <HoverExplainer text="Concepts Gallery: Agent runs displayed as horizontal rows with fixed-size cards and overflow indicators.">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Concepts</h1>
          <p className="text-muted-foreground text-sm">AI Image Studio generations.</p>
        </div>
      </HoverExplainer>

      {/* ===== TEMPORARY: Hover effect variations ===== */}
      <div className="space-y-3 rounded-xl border border-dashed border-primary/30 p-4 bg-primary/5">
        <h2 className="text-sm font-semibold text-primary">Pick your favorite hover effect</h2>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>

          {/* H1: Scale up */}
          <div className="rounded-lg border border-border bg-background flex flex-col items-center justify-center gap-2.5 aspect-square cursor-pointer transition-transform duration-200 hover:scale-105">
            <div className="relative w-11 h-11">
              <div className="absolute inset-0 rounded-lg bg-muted/60 border border-border/50 translate-x-1.5 translate-y-1.5" />
              <div className="absolute inset-0 rounded-lg bg-muted/40 border border-border/50 translate-x-0.5 translate-y-0.5" />
              <div className="relative rounded-lg bg-background border border-border h-full w-full flex items-center justify-center shadow-sm">
                <span className="text-sm font-bold text-primary">+4</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-foreground">Concepts available</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Click to see all</p>
            </div>
            <p className="text-[9px] text-primary/60 mt-1">H1: Scale up</p>
          </div>

          {/* H2: Shadow lift */}
          <div className="rounded-lg border border-border bg-background flex flex-col items-center justify-center gap-2.5 aspect-square cursor-pointer transition-shadow duration-200 hover:shadow-lg hover:shadow-primary/10">
            <div className="relative w-11 h-11">
              <div className="absolute inset-0 rounded-lg bg-muted/60 border border-border/50 translate-x-1.5 translate-y-1.5" />
              <div className="absolute inset-0 rounded-lg bg-muted/40 border border-border/50 translate-x-0.5 translate-y-0.5" />
              <div className="relative rounded-lg bg-background border border-border h-full w-full flex items-center justify-center shadow-sm">
                <span className="text-sm font-bold text-primary">+4</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-foreground">Concepts available</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Click to see all</p>
            </div>
            <p className="text-[9px] text-primary/60 mt-1">H2: Shadow lift</p>
          </div>

          {/* H3: Border color change */}
          <div className="rounded-lg border border-border bg-background flex flex-col items-center justify-center gap-2.5 aspect-square cursor-pointer transition-colors duration-200 hover:border-primary/40">
            <div className="relative w-11 h-11">
              <div className="absolute inset-0 rounded-lg bg-muted/60 border border-border/50 translate-x-1.5 translate-y-1.5" />
              <div className="absolute inset-0 rounded-lg bg-muted/40 border border-border/50 translate-x-0.5 translate-y-0.5" />
              <div className="relative rounded-lg bg-background border border-border h-full w-full flex items-center justify-center shadow-sm">
                <span className="text-sm font-bold text-primary">+4</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-foreground">Concepts available</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Click to see all</p>
            </div>
            <p className="text-[9px] text-primary/60 mt-1">H3: Border accent</p>
          </div>

          {/* H4: Background tint */}
          <div className="rounded-lg border border-border bg-background flex flex-col items-center justify-center gap-2.5 aspect-square cursor-pointer transition-colors duration-200 hover:bg-primary/[0.03]">
            <div className="relative w-11 h-11">
              <div className="absolute inset-0 rounded-lg bg-muted/60 border border-border/50 translate-x-1.5 translate-y-1.5" />
              <div className="absolute inset-0 rounded-lg bg-muted/40 border border-border/50 translate-x-0.5 translate-y-0.5" />
              <div className="relative rounded-lg bg-background border border-border h-full w-full flex items-center justify-center shadow-sm">
                <span className="text-sm font-bold text-primary">+4</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-foreground">Concepts available</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Click to see all</p>
            </div>
            <p className="text-[9px] text-primary/60 mt-1">H4: BG tint</p>
          </div>

          {/* H5: Scale + shadow combo */}
          <div className="rounded-lg border border-border bg-background flex flex-col items-center justify-center gap-2.5 aspect-square cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:shadow-md">
            <div className="relative w-11 h-11">
              <div className="absolute inset-0 rounded-lg bg-muted/60 border border-border/50 translate-x-1.5 translate-y-1.5" />
              <div className="absolute inset-0 rounded-lg bg-muted/40 border border-border/50 translate-x-0.5 translate-y-0.5" />
              <div className="relative rounded-lg bg-background border border-border h-full w-full flex items-center justify-center shadow-sm">
                <span className="text-sm font-bold text-primary">+4</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-foreground">Concepts available</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Click to see all</p>
            </div>
            <p className="text-[9px] text-primary/60 mt-1">H5: Scale + shadow</p>
          </div>

          {/* H6: Translate up */}
          <div className="rounded-lg border border-border bg-background flex flex-col items-center justify-center gap-2.5 aspect-square cursor-pointer transition-transform duration-200 hover:-translate-y-1">
            <div className="relative w-11 h-11">
              <div className="absolute inset-0 rounded-lg bg-muted/60 border border-border/50 translate-x-1.5 translate-y-1.5" />
              <div className="absolute inset-0 rounded-lg bg-muted/40 border border-border/50 translate-x-0.5 translate-y-0.5" />
              <div className="relative rounded-lg bg-background border border-border h-full w-full flex items-center justify-center shadow-sm">
                <span className="text-sm font-bold text-primary">+4</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-foreground">Concepts available</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Click to see all</p>
            </div>
            <p className="text-[9px] text-primary/60 mt-1">H6: Float up</p>
          </div>

          {/* H7: Inner card grows */}
          <div className="rounded-lg border border-border bg-background flex flex-col items-center justify-center gap-2.5 aspect-square cursor-pointer group/h7">
            <div className="relative w-11 h-11 transition-transform duration-200 group-hover/h7:scale-110">
              <div className="absolute inset-0 rounded-lg bg-muted/60 border border-border/50 translate-x-1.5 translate-y-1.5" />
              <div className="absolute inset-0 rounded-lg bg-muted/40 border border-border/50 translate-x-0.5 translate-y-0.5" />
              <div className="relative rounded-lg bg-background border border-border h-full w-full flex items-center justify-center shadow-sm">
                <span className="text-sm font-bold text-primary">+4</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-foreground">Concepts available</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Click to see all</p>
            </div>
            <p className="text-[9px] text-primary/60 mt-1">H7: Icon grows</p>
          </div>

          {/* H8: Border + BG + shadow */}
          <div className="rounded-lg border border-border bg-background flex flex-col items-center justify-center gap-2.5 aspect-square cursor-pointer transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.02] hover:shadow-sm">
            <div className="relative w-11 h-11">
              <div className="absolute inset-0 rounded-lg bg-muted/60 border border-border/50 translate-x-1.5 translate-y-1.5" />
              <div className="absolute inset-0 rounded-lg bg-muted/40 border border-border/50 translate-x-0.5 translate-y-0.5" />
              <div className="relative rounded-lg bg-background border border-border h-full w-full flex items-center justify-center shadow-sm">
                <span className="text-sm font-bold text-primary">+4</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-foreground">Concepts available</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Click to see all</p>
            </div>
            <p className="text-[9px] text-primary/60 mt-1">H8: Full subtle</p>
          </div>

          {/* H9: Ring glow */}
          <div className="rounded-lg border border-border bg-background flex flex-col items-center justify-center gap-2.5 aspect-square cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary/20 hover:ring-offset-1">
            <div className="relative w-11 h-11">
              <div className="absolute inset-0 rounded-lg bg-muted/60 border border-border/50 translate-x-1.5 translate-y-1.5" />
              <div className="absolute inset-0 rounded-lg bg-muted/40 border border-border/50 translate-x-0.5 translate-y-0.5" />
              <div className="relative rounded-lg bg-background border border-border h-full w-full flex items-center justify-center shadow-sm">
                <span className="text-sm font-bold text-primary">+4</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-foreground">Concepts available</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Click to see all</p>
            </div>
            <p className="text-[9px] text-primary/60 mt-1">H9: Ring glow</p>
          </div>

          {/* H10: Translate up + shadow + border */}
          <div className="rounded-lg border border-border bg-background flex flex-col items-center justify-center gap-2.5 aspect-square cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20">
            <div className="relative w-11 h-11">
              <div className="absolute inset-0 rounded-lg bg-muted/60 border border-border/50 translate-x-1.5 translate-y-1.5" />
              <div className="absolute inset-0 rounded-lg bg-muted/40 border border-border/50 translate-x-0.5 translate-y-0.5" />
              <div className="relative rounded-lg bg-background border border-border h-full w-full flex items-center justify-center shadow-sm">
                <span className="text-sm font-bold text-primary">+4</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-foreground">Concepts available</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Click to see all</p>
            </div>
            <p className="text-[9px] text-primary/60 mt-1">H10: Float + shadow + border</p>
          </div>

        </div>
      </div>
      {/* ===== END TEMPORARY ===== */}

      {agentRuns.map((run) => {
        const hasOverflow = run.concepts.length > CARDS_PER_ROW;
        const visibleConcepts = run.concepts.slice(0, hasOverflow ? CARDS_PER_ROW - 1 : CARDS_PER_ROW);
        const overflowCount = run.concepts.length - visibleConcepts.length;
        const style = rowStyle;

        return (
          <div
            key={run.id}
            className={`space-y-2.5 group/run cursor-pointer ${style.container} ${style.hover}`}
            onClick={() => navigate(`/concepts/${run.id}`)}
          >
            <div className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2 group/title">
                {editingRunId === run.id ? (
                  <div className="flex items-center gap-1.5">
                    <Input
                      ref={titleInputRef}
                      value={editedTitles[run.id] ?? run.label}
                      onChange={(e) => setEditedTitles(prev => ({ ...prev, [run.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setEditingRunId(null);
                        if (e.key === "Escape") {
                          setEditedTitles(prev => { const n = { ...prev }; delete n[run.id]; return n; });
                          setEditingRunId(null);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm font-semibold h-auto py-1 px-2.5 w-auto max-w-[200px] rounded-full border"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingRunId(null); }}
                      className="p-0.5 rounded hover:bg-accent text-primary"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditedTitles(prev => { const n = { ...prev }; delete n[run.id]; return n; });
                        setEditingRunId(null);
                      }}
                      className="p-0.5 rounded hover:bg-accent text-muted-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className={`text-sm font-semibold transition-colors ${style.titleHover}`}>{editedTitles[run.id] || run.label}</h2>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditedTitles(prev => ({ ...prev, [run.id]: prev[run.id] || run.label }));
                            setEditingRunId(run.id);
                          }}
                          className="opacity-0 group-hover/title:opacity-100 transition-opacity p-0.5 rounded hover:bg-accent"
                        >
                          <Pencil className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Edit title</TooltipContent>
                    </Tooltip>
                  </>
                )}
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
              <span className="text-xs text-muted-foreground ml-auto">{run.time}</span>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${CARDS_PER_ROW}, 1fr)` }}>
              {visibleConcepts.map((c) => (
                <Card
                  key={c.id}
                  className={`overflow-hidden transition-all duration-200 ${c.status === "accepted" ? "ring-[3px] ring-emerald-400/70" : style.cardHover}`}
                >
                  <CardContent className="p-0">
                    <div className="aspect-square relative overflow-hidden bg-muted rounded-lg">
                      <img
                        src={c.img || `https://picsum.photos/seed/${c.imgSeed}/300/300`}
                        alt={c.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {hasOverflow && (
                <div className="rounded-lg border border-border bg-background flex flex-col items-center justify-center gap-2.5 transition-all">
                  <div className="relative w-11 h-11">
                    <div className="absolute inset-0 rounded-lg bg-muted/60 border border-border/50 translate-x-1.5 translate-y-1.5" />
                    <div className="absolute inset-0 rounded-lg bg-muted/40 border border-border/50 translate-x-0.5 translate-y-0.5" />
                    <div className="relative rounded-lg bg-background border border-border h-full w-full flex items-center justify-center shadow-sm">
                      <span className="text-sm font-bold text-primary">+{overflowCount}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-foreground">Concepts available</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Click to see all</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
