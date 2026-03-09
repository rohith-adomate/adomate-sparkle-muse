import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye } from "lucide-react";
import { useState } from "react";
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
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRuns = agentRuns.filter((run) => {
    if (statusFilter === "unseen") return !run.seen;
    if (statusFilter === "seen") return run.seen;
    return true;
  });

  return (
    <div className="space-y-6">
      <HoverExplainer text="Concepts Gallery: Agent runs displayed as horizontal rows with fixed-size cards and overflow indicators.">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Concepts</h1>
            <p className="text-muted-foreground text-sm">Review, accept, or iterate on generated concepts.</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all"><SelectTrigger className="w-36 h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Workflows</SelectItem><SelectItem value="competitor">Competitor Ad</SelectItem></SelectContent></Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unseen">Unseen</SelectItem>
                <SelectItem value="seen">Seen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </HoverExplainer>

      {filteredRuns.map((run) => {
        const hasOverflow = run.concepts.length > CARDS_PER_ROW;
        const visibleConcepts = run.concepts.slice(0, hasOverflow ? CARDS_PER_ROW - 1 : CARDS_PER_ROW);
        const overflowCount = run.concepts.length - visibleConcepts.length;
        const style = rowStyle;

        return (
          <div
            key={run.id}
            className={`space-y-2.5 group/run cursor-pointer ${style.container} ${style.hover} ${run.seen ? "opacity-60" : ""}`}
            onClick={() => navigate(`/concepts/${run.id}`)}
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {!run.seen && (
                  <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                )}
                <h2 className={`text-sm font-semibold transition-colors ${style.titleHover}`}>{run.label}</h2>
                <span className="text-xs text-muted-foreground font-normal">{run.time}</span>
                {run.seen && (
                  <Badge variant="outline" className="text-[10px] gap-1 border-border text-muted-foreground font-normal">
                    <Eye className="h-3 w-3" /> Seen
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground opacity-0 group-hover/run:opacity-100 transition-opacity ml-auto">View all →</span>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${CARDS_PER_ROW}, 1fr)` }}>
              {visibleConcepts.map((c) => (
                <Card
                  key={c.id}
                  className={`overflow-hidden transition-all duration-200 ${style.cardHover}`}
                >
                  <CardContent className="p-0">
                    <div className="aspect-[3/2] relative overflow-hidden bg-muted">
                      <img
                        src={`https://picsum.photos/seed/${c.imgSeed}/300/200`}
                        alt={c.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute top-2 right-2">
                        <span className={`h-2.5 w-2.5 rounded-full inline-block ${statusDot[c.status]} ring-2 ring-white shadow-sm`} />
                      </div>
                    </div>
                    <div className="p-3 space-y-1">
                      <p className="text-sm font-medium truncate">{c.title}</p>
                      <p className="text-[10px] text-muted-foreground">{c.source}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {hasOverflow && (
                <div className={`rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all ${style.overflowIdle} ${style.overflowHover}`}>
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover/run:bg-primary/10 transition-colors">
                    <Plus className="h-5 w-5 text-muted-foreground group-hover/run:text-primary transition-colors" />
                  </div>
                  <span className="text-xs text-muted-foreground group-hover/run:text-primary font-medium transition-colors">+{overflowCount} more</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
