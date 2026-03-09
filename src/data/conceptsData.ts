export type Concept = {
  id: string;
  title: string;
  source: string;
  status: "pending" | "accepted" | "rejected";
  campaign: string;
  imgSeed: string;
};

export type AgentRun = {
  id: string;
  label: string;
  time: string;
  seen: boolean;
  concepts: Concept[];
};

export const agentRuns: AgentRun[] = [
  {
    id: "competitor-ad-variation-1",
    label: "Competitor Ad Variation",
    time: "Mar 8, 2026 · 14:32",
    seen: false,
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
    seen: false,
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
    seen: false,
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
    seen: false,
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
    time: "Mar 4, 2026 · 09:58",
    seen: false,
    concepts: [
      { id: "c50", title: "Retro Halftone", source: "Competitor Ad J", status: "pending", campaign: "Brand Refresh", imgSeed: "retro-halftone" },
      { id: "c51", title: "Glass Morphism", source: "Competitor Ad J", status: "accepted", campaign: "Brand Refresh", imgSeed: "glass-morph" },
      { id: "c52", title: "Isometric Product", source: "Competitor Ad K", status: "pending", campaign: "Brand Refresh", imgSeed: "isometric-prod" },
      { id: "c53", title: "Paper Cut Style", source: "Competitor Ad K", status: "rejected", campaign: "Brand Refresh", imgSeed: "paper-cut" },
    ],
  },
];

export const agentRunsById: Record<string, AgentRun> = Object.fromEntries(
  agentRuns.map((r) => [r.id, r])
);

export const statusDot = { pending: "bg-amber-400", accepted: "bg-emerald-400", rejected: "bg-red-400" };
export const statusBadge = { pending: "bg-amber-50 text-amber-700 border-amber-200", accepted: "bg-emerald-50 text-emerald-700 border-emerald-200", rejected: "bg-red-50 text-red-700 border-red-200" };
