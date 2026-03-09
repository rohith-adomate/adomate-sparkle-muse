import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
      { id: "c13", title: "Dynamic Retargeting", source: "Competitor Ad A", status: "pending", campaign: "Summer Kickoff", imgSeed: "retargeting" },
      { id: "c14", title: "Story Takeover", source: "Competitor Ad B", status: "accepted", campaign: "Summer Kickoff", imgSeed: "story-takeover" },
      { id: "c15", title: "Influencer Collab", source: "Trending Topic", status: "pending", campaign: "Summer Kickoff", imgSeed: "influencer" },
      { id: "c16", title: "Brand Mashup", source: "Competitor Ad A", status: "rejected", campaign: "Summer Kickoff", imgSeed: "brand-mashup" },
    ],
  },
  {
    id: "competitor-ad-variation-2",
    label: "Competitor Ad Variation",
    time: "Mar 7, 2026 · 11:05",
    concepts: [
      { id: "c20", title: "Neon Gradient Ad", source: "Competitor Ad D", status: "pending", campaign: "Spring Launch", imgSeed: "neon-gradient" },
      { id: "c21", title: "Minimalist Product", source: "Competitor Ad D", status: "accepted", campaign: "Spring Launch", imgSeed: "minimalist-prod" },
      { id: "c22", title: "Split Screen Compare", source: "Competitor Ad E", status: "pending", campaign: "Spring Launch", imgSeed: "split-screen" },
      { id: "c23", title: "Motion Blur Effect", source: "Competitor Ad E", status: "rejected", campaign: "Spring Launch", imgSeed: "motion-blur" },
      { id: "c24", title: "Flat Lay Showcase", source: "Competitor Ad D", status: "pending", campaign: "Spring Launch", imgSeed: "flat-lay" },
      { id: "c25", title: "AR Preview Card", source: "Trending Topic", status: "pending", campaign: "Spring Launch", imgSeed: "ar-preview" },
    ],
  },
  {
    id: "competitor-ad-variation-3",
    label: "Competitor Ad Variation",
    time: "Mar 6, 2026 · 08:22",
    concepts: [
      { id: "c30", title: "Pastel Palette Ad", source: "Competitor Ad F", status: "accepted", campaign: "Q2 Push", imgSeed: "pastel-palette" },
      { id: "c31", title: "Bold Typography", source: "Competitor Ad F", status: "pending", campaign: "Q2 Push", imgSeed: "bold-typo" },
      { id: "c32", title: "Cinematic Still", source: "Competitor Ad G", status: "pending", campaign: "Q2 Push", imgSeed: "cinematic-still" },
    ],
  },
  {
    id: "competitor-ad-variation-4",
    label: "Competitor Ad Variation",
    time: "Mar 5, 2026 · 15:47",
    concepts: [
      { id: "c40", title: "Duotone Effect", source: "Competitor Ad H", status: "pending", campaign: "Flash Sale", imgSeed: "duotone-fx" },
      { id: "c41", title: "Product in Action", source: "Competitor Ad H", status: "accepted", campaign: "Flash Sale", imgSeed: "product-action" },
      { id: "c42", title: "Geometric Overlay", source: "Competitor Ad I", status: "rejected", campaign: "Flash Sale", imgSeed: "geometric-overlay" },
      { id: "c43", title: "Customer Spotlight", source: "Competitor Ad I", status: "pending", campaign: "Flash Sale", imgSeed: "customer-spot" },
      { id: "c44", title: "Animated Banner", source: "Competitor Ad H", status: "pending", campaign: "Flash Sale", imgSeed: "animated-banner" },
      { id: "c45", title: "Before/After Strip", source: "Trending Topic", status: "accepted", campaign: "Flash Sale", imgSeed: "before-after" },
      { id: "c46", title: "Mood Board Style", source: "Competitor Ad I", status: "pending", campaign: "Flash Sale", imgSeed: "mood-board" },
    ],
  },
];

const statusDot = { pending: "bg-amber-400", accepted: "bg-emerald-400", rejected: "bg-red-400" };

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
            <Select defaultValue="all"><SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="accepted">Accepted</SelectItem></SelectContent></Select>
          </div>
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
            <div className="flex items-baseline gap-2">
              <div className="flex items-baseline gap-2">
                <h2 className={`text-sm font-semibold transition-colors ${style.titleHover}`}>{run.label}</h2>
                <span className="text-xs text-muted-foreground font-normal">{run.time}</span>
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
