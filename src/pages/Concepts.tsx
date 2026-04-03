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
        <h2 className="text-sm font-semibold text-primary">Pick your favorite &ldquo;Explore More&rdquo; card variation</h2>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>

          {/* V1: Clean centered with icon + descriptive text */}
          <div className="rounded-lg border border-border bg-background flex flex-col items-center justify-center gap-2.5 aspect-square px-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="h-4.5 w-4.5 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">+4 concepts</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">View the full collection</p>
            </div>
          </div>

          {/* V2: Soft card with subtle gradient and CTA */}
          <div className="rounded-lg border border-border bg-gradient-to-b from-background to-muted/40 flex flex-col items-center justify-center gap-3 aspect-square px-4">
            <div className="h-10 w-10 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-semibold text-foreground">4 more concepts</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Tap to explore all</p>
            </div>
          </div>

          {/* V3: Bold count with supporting label and line accent */}
          <div className="rounded-lg border border-border bg-background flex flex-col items-center justify-center gap-2 aspect-square relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/30" />
            <span className="text-2xl font-bold text-primary/80">+4</span>
            <div className="text-center">
              <p className="text-xs font-medium text-foreground">more concepts</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Click to see all</p>
            </div>
          </div>

          {/* V4: Outlined pill badge style */}
          <div className="rounded-lg border border-border bg-muted/10 flex flex-col items-center justify-center gap-3 aspect-square">
            <div className="px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5">
              <span className="text-xs font-semibold text-primary">+4 concepts</span>
            </div>
            <p className="text-[11px] text-muted-foreground text-center px-4">See the complete set</p>
          </div>

          {/* V5: Stacked layers with count */}
          <div className="rounded-lg border border-border bg-background flex flex-col items-center justify-center gap-2.5 aspect-square">
            <div className="relative w-11 h-11">
              <div className="absolute inset-0 rounded-lg bg-muted/60 border border-border/50 translate-x-1.5 translate-y-1.5" />
              <div className="absolute inset-0 rounded-lg bg-muted/40 border border-border/50 translate-x-0.5 translate-y-0.5" />
              <div className="relative rounded-lg bg-background border border-border h-full w-full flex items-center justify-center shadow-sm">
                <span className="text-sm font-bold text-primary">+4</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">More concepts available</p>
          </div>

          {/* V6: Grid preview dots with explore text */}
          <div className="rounded-lg border border-border bg-background flex flex-col items-center justify-center gap-3 aspect-square">
            <div className="grid grid-cols-2 gap-1.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-5 w-5 rounded bg-muted border border-border/60" />
              ))}
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-foreground">+4 more</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Explore full collection</p>
            </div>
          </div>

          {/* V7: Soft card with arrow indicator */}
          <div className="rounded-lg border border-border bg-muted/15 flex flex-col items-center justify-center gap-2 aspect-square group/card hover:bg-muted/25 transition-colors">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-foreground">+4</span>
              <span className="text-xs text-muted-foreground font-medium">concepts</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-[11px]">View all</span>
              <span className="text-xs transition-transform group-hover/card:translate-x-0.5">&rarr;</span>
            </div>
          </div>

          {/* V8: Circular ring with centered count */}
          <div className="rounded-lg border border-border bg-background flex flex-col items-center justify-center gap-2.5 aspect-square">
            <div className="h-14 w-14 rounded-full border-2 border-primary/20 bg-primary/5 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">+4</span>
            </div>
            <p className="text-[11px] text-muted-foreground">View all concepts</p>
          </div>

          {/* V9: Two-line clean with divider */}
          <div className="rounded-lg border border-border bg-background flex flex-col items-center justify-center gap-2 aspect-square px-5">
            <Plus className="h-5 w-5 text-primary/60" />
            <div className="w-8 h-px bg-border" />
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">4 more</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">concepts to review</p>
            </div>
          </div>

          {/* V10: Frosted glass with icon and clear CTA */}
          <div className="rounded-lg border border-border bg-gradient-to-br from-muted/20 via-background to-muted/30 flex flex-col items-center justify-center gap-2.5 aspect-square backdrop-blur-sm">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Plus className="h-4 w-4 text-primary" />
            </div>
            <p className="text-[13px] font-semibold text-foreground">+4 concepts</p>
            <p className="text-[10px] text-muted-foreground">Click to explore</p>
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
