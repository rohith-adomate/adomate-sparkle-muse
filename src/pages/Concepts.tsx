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

      {/* ===== TEMPORARY: Explore More card variations ===== */}
      <div className="space-y-3 rounded-xl border border-dashed border-primary/30 p-4 bg-primary/5">
        <h2 className="text-sm font-semibold text-primary">Pick your favorite "Explore More" card variation</h2>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
          {/* Variation 1: Current design */}
          <div className="rounded-lg border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center gap-2 aspect-square">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">Explore more</span>
            <span className="text-xs text-muted-foreground text-center">+4 more concepts<br/>available</span>
            <span className="text-xs text-primary font-medium">See more →</span>
          </div>

          {/* Variation 2: Minimal — just count + arrow */}
          <div className="rounded-lg border border-border bg-muted/10 flex flex-col items-center justify-center gap-1.5 aspect-square">
            <span className="text-2xl font-bold text-foreground">+4</span>
            <span className="text-xs text-muted-foreground">more</span>
          </div>

          {/* Variation 3: Icon-forward, no text link */}
          <div className="rounded-lg border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center gap-3 aspect-square">
            <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">4 more</span>
          </div>

          {/* Variation 4: Compact pill style */}
          <div className="rounded-lg border border-border bg-background flex items-center justify-center aspect-square">
            <div className="flex flex-col items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-foreground">+4 concepts</div>
              <span className="text-[11px] text-muted-foreground">Click to explore</span>
            </div>
          </div>

          {/* Variation 5: Bold number with subtle background */}
          <div className="rounded-lg border border-border bg-gradient-to-br from-muted/30 to-muted/10 flex flex-col items-center justify-center gap-1 aspect-square">
            <span className="text-3xl font-bold text-primary/70">+4</span>
            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">concepts</span>
          </div>

          {/* Variation 6: Stacked cards visual metaphor */}
          <div className="rounded-lg border border-dashed border-border bg-muted/10 flex flex-col items-center justify-center gap-2 aspect-square relative">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded bg-muted border border-border transform rotate-6" />
              <div className="absolute inset-0 rounded bg-muted border border-border transform -rotate-3" />
              <div className="absolute inset-0 rounded bg-background border border-border flex items-center justify-center">
                <Plus className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <span className="text-xs text-muted-foreground">+4 more</span>
          </div>

          {/* Variation 7: Grid dots hint */}
          <div className="rounded-lg border border-border bg-muted/10 flex flex-col items-center justify-center gap-3 aspect-square">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-muted-foreground/20" />
              <div className="h-3 w-3 rounded-sm bg-muted-foreground/20" />
              <div className="h-3 w-3 rounded-sm bg-muted-foreground/20" />
              <div className="h-3 w-3 rounded-sm bg-muted-foreground/15" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">+4 more</span>
          </div>

          {/* Variation 8: Arrow-only, ultra minimal */}
          <div className="rounded-lg border border-border bg-background flex items-center justify-center aspect-square hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="text-sm font-medium">+4</span>
              <span className="text-lg">→</span>
            </div>
          </div>

          {/* Variation 9: Blurred preview hint */}
          <div className="rounded-lg border border-border bg-muted/20 flex flex-col items-center justify-center gap-2 aspect-square overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-muted/60 to-muted/90 backdrop-blur-sm" />
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <span className="text-lg font-bold text-foreground/80">+4</span>
              <span className="text-[11px] text-muted-foreground">View all →</span>
            </div>
          </div>

          {/* Variation 10: Outlined circle with count */}
          <div className="rounded-lg border border-border bg-background flex items-center justify-center aspect-square">
            <div className="h-14 w-14 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <span className="text-lg font-semibold text-muted-foreground">+4</span>
            </div>
          </div>
        </div>
      </div>
      {/* ===== END TEMPORARY ===== */}

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
                <div className={`rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${style.overflowIdle} ${style.overflowHover}`}>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">Explore more</span>
                  <span className="text-xs text-muted-foreground text-center">+{overflowCount} more concepts<br/>available</span>
                  <span className="text-xs text-primary font-medium flex items-center gap-1">See more <span>→</span></span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
