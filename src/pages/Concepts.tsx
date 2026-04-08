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
  cardHover: "group-hover/run:shadow-lg group-hover/run:shadow-primary/10 transition-shadow duration-200",
  overflowIdle: "border-dashed border-border bg-muted/20",
  overflowHover: "group-hover/run:bg-pink-50 group-hover/run:border-pink-300/50",
};


export default function Concepts() {
  const navigate = useNavigate();
  const [editingRunId, setEditingRunId] = useState<string | null>(null);
  const [editedTitles, setEditedTitles] = useState<Record<string, string>>({});
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [visitedRuns, setVisitedRuns] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("visited-concept-runs");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });

  const markVisited = (runId: string) => {
    setVisitedRuns(prev => {
      const next = new Set(prev);
      next.add(runId);
      localStorage.setItem("visited-concept-runs", JSON.stringify([...next]));
      return next;
    });
  };

  useEffect(() => {
    if (editingRunId && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingRunId]);

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <HoverExplainer text="Concepts Gallery: Agent runs displayed as horizontal rows with fixed-size cards and overflow indicators.">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Concepts</h1>
          <p className="text-muted-foreground text-sm">AI Image Studio generations.</p>
        </div>
      </HoverExplainer>



      {agentRuns.map((run) => {
        const hasOverflow = run.concepts.length > CARDS_PER_ROW;
        const visibleConcepts = run.concepts.slice(0, hasOverflow ? CARDS_PER_ROW - 1 : CARDS_PER_ROW);
        const overflowCount = run.concepts.length - visibleConcepts.length;
        const style = rowStyle;

        return (
          <div
            key={run.id}
            className={`space-y-2.5 group/run cursor-pointer ${style.container} ${style.hover}`}
            onClick={() => { markVisited(run.id); navigate(`/concepts/${run.id}`); }}
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
                    {!visitedRuns.has(run.id) && (
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                      </span>
                    )}
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
                <div className="rounded-lg border border-border bg-background flex flex-col items-center justify-center gap-2.5 transition-shadow duration-200 hover:shadow-lg hover:shadow-primary/10 group-hover/run:shadow-lg group-hover/run:shadow-primary/10 cursor-pointer">
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
