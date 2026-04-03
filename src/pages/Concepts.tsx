import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Pencil, Workflow } from "lucide-react";
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
                  <Input
                    ref={titleInputRef}
                    value={editedTitles[run.id] ?? run.label}
                    onChange={(e) => setEditedTitles(prev => ({ ...prev, [run.id]: e.target.value }))}
                    onBlur={() => setEditingRunId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setEditingRunId(null);
                      if (e.key === "Escape") {
                        setEditedTitles(prev => { const n = { ...prev }; delete n[run.id]; return n; });
                        setEditingRunId(null);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm font-semibold h-auto py-0.5 px-1.5 -ml-1.5 w-auto max-w-[200px]"
                  />
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
