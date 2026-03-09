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
  {
    id: "competitor-ad-variation-5",
    label: "Competitor Ad Variation",
    time: "Mar 4, 2026 · 10:13",
    concepts: [
      { id: "c50", title: "Retro Halftone", source: "Competitor Ad J", status: "pending", campaign: "Brand Refresh", imgSeed: "retro-halftone" },
      { id: "c51", title: "Glass Morphism", source: "Competitor Ad J", status: "accepted", campaign: "Brand Refresh", imgSeed: "glass-morph" },
      { id: "c52", title: "Isometric Product", source: "Competitor Ad K", status: "pending", campaign: "Brand Refresh", imgSeed: "isometric-prod" },
      { id: "c53", title: "Paper Cut Style", source: "Competitor Ad K", status: "rejected", campaign: "Brand Refresh", imgSeed: "paper-cut" },
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

const CARDS_PER_ROW = 5;

// 5 distinct visual styles for the Competitor Ad Variation rows
const runStyles: Record<string, {
  container: string;
  hover: string;
  titleHover: string;
  cardHover: string;
  overflowIdle: string;
  overflowHover: string;
  label: string;
}> = {
  "competitor-ad-variation-1": {
    label: "Style A — Elevated Glass",
    container: "rounded-2xl p-4 -mx-4 border border-transparent bg-background transition-all duration-300",
    hover: "hover:bg-accent/30 hover:border-border hover:shadow-lg hover:shadow-primary/5 hover:backdrop-blur-sm",
    titleHover: "group-hover/run:text-primary",
    cardHover: "group-hover/run:shadow-md group-hover/run:-translate-y-0.5",
    overflowIdle: "border-dashed border-border bg-muted/20",
    overflowHover: "group-hover/run:bg-primary/5 group-hover/run:border-primary/40",
  },
  "competitor-ad-variation-2": {
    label: "Style B — Soft Gradient Strip",
    container: "rounded-xl p-4 -mx-4 transition-all duration-300 border border-transparent",
    hover: "hover:bg-gradient-to-r hover:from-accent/40 hover:via-accent/20 hover:to-transparent hover:border-border/50",
    titleHover: "group-hover/run:text-pink-600",
    cardHover: "group-hover/run:shadow-sm group-hover/run:ring-1 group-hover/run:ring-pink-200/50",
    overflowIdle: "border-dashed border-border bg-muted/20",
    overflowHover: "group-hover/run:bg-pink-50 group-hover/run:border-pink-300/50",
  },
  "competitor-ad-variation-3": {
    label: "Style C — Left Accent Bar",
    container: "rounded-lg p-4 -mx-4 border-l-4 border-l-transparent border border-transparent transition-all duration-300",
    hover: "hover:border-l-primary hover:bg-muted/30 hover:border-border/40",
    titleHover: "group-hover/run:text-primary",
    cardHover: "group-hover/run:shadow-md",
    overflowIdle: "border-dashed border-border bg-muted/20",
    overflowHover: "group-hover/run:bg-accent/40 group-hover/run:border-primary/30",
  },
  "competitor-ad-variation-4": {
    label: "Style D — Outlined Card",
    container: "rounded-2xl p-4 -mx-4 border-2 border-transparent transition-all duration-300",
    hover: "hover:border-border hover:bg-background hover:shadow-[0_0_0_4px_hsl(var(--accent)/0.3)]",
    titleHover: "group-hover/run:text-foreground group-hover/run:tracking-wide",
    cardHover: "group-hover/run:shadow-none group-hover/run:border-border",
    overflowIdle: "border-2 border-dashed border-muted-foreground/20 bg-transparent",
    overflowHover: "group-hover/run:border-foreground/30 group-hover/run:bg-muted/30",
  },
  "competitor-ad-variation-5": {
    label: "Style E — Warm Glow",
    container: "rounded-2xl p-4 -mx-4 border border-transparent transition-all duration-500",
    hover: "hover:bg-amber-50/40 hover:border-amber-200/60 hover:shadow-xl hover:shadow-amber-100/30",
    titleHover: "group-hover/run:text-amber-700",
    cardHover: "group-hover/run:shadow-lg group-hover/run:shadow-amber-100/40 group-hover/run:-translate-y-1",
    overflowIdle: "border-dashed border-amber-200/40 bg-amber-50/20",
    overflowHover: "group-hover/run:bg-amber-50/60 group-hover/run:border-amber-300/60",
  },
};

const defaultStyle = {
  container: "rounded-xl p-3 -mx-3 transition-all duration-200",
  hover: "hover:bg-muted/40",
  titleHover: "group-hover/run:text-primary",
  cardHover: "group-hover/run:shadow-md",
  overflowIdle: "border-dashed border-border bg-muted/30",
  overflowHover: "group-hover/run:bg-muted/60 group-hover/run:border-primary/30",
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
        const style = runStyles[run.id] || defaultStyle;

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
              {style !== defaultStyle && (
                <span className="text-[10px] text-muted-foreground/60 font-mono">{(style as any).label}</span>
              )}
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
