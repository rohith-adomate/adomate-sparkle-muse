import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { HoverExplainer } from "@/components/HoverExplainer";

type Concept = { id: string; title: string; source: string; status: "pending" | "accepted" | "rejected"; campaign: string; imgSeed: string };

const agentRuns: { id: string; label: string; time: string; concepts: Concept[] }[] = [
  {
    id: "competitor-ad-variation-1",
    label: "Competitor Ad Variation",
    time: "Mar 8, 2026 · 14:32",
    concepts: [
      { id: "c1", title: "Beach Vibes UGC", source: "Competitor Ad A", status: "accepted", campaign: "Summer Kickoff", imgSeed: "beach-ugc" },
      { id: "c2", title: "Sunset Product Shot", source: "Competitor Ad A", status: "pending", campaign: "Summer Kickoff", imgSeed: "sunset-shot" },
      { id: "c3", title: "Bold CTA Banner", source: "Competitor Ad B", status: "pending", campaign: "Summer Kickoff", imgSeed: "cta-banner" },
      { id: "c4", title: "Lifestyle Carousel", source: "Competitor Ad B", status: "rejected", campaign: "Summer Kickoff", imgSeed: "lifestyle" },
      { id: "c5", title: "Testimonial Overlay", source: "Trending Topic", status: "pending", campaign: "Summer Kickoff", imgSeed: "testimonial" },
    ],
  },
  {
    id: "seasonal-trend-2",
    label: "Seasonal Trend Discovery",
    time: "Mar 7, 2026 · 09:15",
    concepts: [
      { id: "c6", title: "Heart Confetti Ad", source: "Seasonal Trend", status: "pending", campaign: "Valentine's Push", imgSeed: "valentine" },
      { id: "c7", title: "Gift Guide Carousel", source: "Product Catalog", status: "accepted", campaign: "Valentine's Push", imgSeed: "gift-guide" },
      { id: "c8", title: "Couple Lifestyle", source: "Competitor Ad C", status: "pending", campaign: "Valentine's Push", imgSeed: "couple" },
    ],
  },
  {
    id: "evergreen-content-3",
    label: "Evergreen Content Generation",
    time: "Mar 6, 2026 · 16:48",
    concepts: [
      { id: "c9", title: "Feature Highlight", source: "Brand Knowledge", status: "accepted", campaign: "Q1 Evergreen", imgSeed: "feature" },
      { id: "c10", title: "Problem/Solution", source: "Persona: Busy Entrepreneur", status: "pending", campaign: "Q1 Evergreen", imgSeed: "problem-solution" },
      { id: "c11", title: "Social Proof Strip", source: "Meta Performance", status: "pending", campaign: "Q1 Evergreen", imgSeed: "social-proof" },
      { id: "c12", title: "How It Works", source: "Brand Knowledge", status: "pending", campaign: "Q1 Evergreen", imgSeed: "how-it-works" },
    ],
  },
];

const statusDot = { pending: "bg-amber-400", accepted: "bg-emerald-400", rejected: "bg-red-400" };

const MAX_VISIBLE = 4;

export default function Concepts() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <HoverExplainer text="Concepts Gallery: Agent runs displayed as horizontal rows. Each row shows a preview of generated concepts with a '+' overflow indicator linking to the full image wall.">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Concepts</h1>
            <p className="text-muted-foreground text-sm">Review, accept, or iterate on generated concepts.</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all"><SelectTrigger className="w-36 h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Workflows</SelectItem><SelectItem value="competitor">Competitor Ad</SelectItem></SelectContent></Select>
            <Select defaultValue="all"><SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="accepted">Accepted</SelectItem></SelectContent></Select>
          </div>
        </div>
      </HoverExplainer>

      {agentRuns.map((run) => {
        const visibleConcepts = run.concepts.slice(0, MAX_VISIBLE);
        const overflowCount = run.concepts.length - MAX_VISIBLE;

        return (
          <div key={run.id} className="space-y-2.5">
            <div className="flex items-baseline gap-2">
              <h2 className="text-sm font-semibold">{run.label}</h2>
              <span className="text-xs text-muted-foreground font-normal">{run.time}</span>
            </div>
            <div className="flex items-stretch gap-3">
              {visibleConcepts.map((c) => (
                <Card
                  key={c.id}
                  className="shrink-0 w-52 cursor-pointer group overflow-hidden hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/concepts/${run.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="h-32 relative overflow-hidden bg-muted">
                      <img
                        src={`https://picsum.photos/seed/${c.imgSeed}/300/200`}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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

              {overflowCount > 0 && (
                <button
                  onClick={() => navigate(`/concepts/${run.id}`)}
                  className="shrink-0 w-20 rounded-lg border border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-1.5 hover:bg-muted/60 hover:border-primary/30 transition-all cursor-pointer group"
                >
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-xs text-muted-foreground group-hover:text-primary font-medium transition-colors">+{overflowCount} more</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
