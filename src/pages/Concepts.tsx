import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
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

function UnseenIndicator() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="relative flex h-2.5 w-2.5 cursor-default">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        New — not yet reviewed
      </TooltipContent>
    </Tooltip>
  );
}

export default function Concepts() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRuns = agentRuns.filter((run) => {
    if (statusFilter === "unseen") return !run.seen;
    if (statusFilter === "seen") return run.seen;
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <HoverExplainer text="Concepts Gallery: Agent runs displayed as horizontal rows with fixed-size cards and overflow indicators.">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Concepts</h1>
            <p className="text-muted-foreground text-sm">AI Image Studio generations.</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all"><SelectTrigger className="w-36 h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Campaigns</SelectItem><SelectItem value="competitor">Competitor Ad</SelectItem></SelectContent></Select>
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
            className={`space-y-2.5 group/run cursor-pointer ${style.container} ${style.hover}`}
            onClick={() => navigate(`/concepts/${run.id}`)}
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <h2 className={`text-sm font-semibold transition-colors ${style.titleHover}`}>{run.label}</h2>
                <span className="text-xs text-muted-foreground font-normal">{run.time}</span>
                {!run.seen && <UnseenIndicator />}
              </div>
              <span className="text-xs text-muted-foreground opacity-0 group-hover/run:opacity-100 transition-opacity ml-auto">View all →</span>
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
