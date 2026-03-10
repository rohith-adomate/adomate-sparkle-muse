export type AspectRatio = "1:1" | "4:5" | "9:16" | "16:9";

export type Platform = "facebook" | "linkedin";

export type CompletionMethod = "ai" | "designer";

export type AdStatus = "ready" | "incomplete" | "draft";

export interface AdVersion {
  id: string;
  aspectRatio: AspectRatio;
  imgSeed: string;
  createdAt: string;
}

export interface ContentAd {
  id: string;
  conceptId: string;
  title: string;
  headline: string;
  adCopy: string;
  cta: string;
  status: AdStatus;
  platforms: Platform[];
  requiredRatios: AspectRatio[];
  completedRatios: AspectRatio[];
  completionMethod: CompletionMethod;
  versions: AdVersion[];
  imgSeed: string;
  sourceWorkflow: string;
  likedAt: string;
}

export const contentAds: ContentAd[] = [
  {
    id: "ad-1",
    conceptId: "c1",
    title: "Beach Vibes UGC",
    headline: "3-in-1: Calms, Hydrates & Cleanses",
    adCopy: "Sensitive skin that gets irritated easily? Experience softness tailored to you. 🧡",
    cta: "Shop Now",
    status: "ready",
    platforms: ["facebook", "linkedin"],
    requiredRatios: ["4:5", "9:16", "1:1"],
    completedRatios: ["4:5", "9:16", "1:1"],
    completionMethod: "ai",
    versions: [
      { id: "v1-1", aspectRatio: "4:5", imgSeed: "beach-ugc-4x5", createdAt: "Mar 8, 2026" },
      { id: "v1-2", aspectRatio: "9:16", imgSeed: "beach-ugc-9x16", createdAt: "Mar 8, 2026" },
      { id: "v1-3", aspectRatio: "1:1", imgSeed: "beach-ugc-1x1", createdAt: "Mar 9, 2026" },
    ],
    imgSeed: "beach-ugc",
    sourceWorkflow: "Competitor Ad Variation",
    likedAt: "Mar 8, 2026",
  },
  {
    id: "ad-2",
    conceptId: "c14",
    title: "Story Takeover",
    headline: "Your Skin Deserves Better",
    adCopy: "Discover the power of natural ingredients. Made with care, made in Belgium.",
    cta: "Learn More",
    status: "incomplete",
    platforms: ["facebook"],
    requiredRatios: ["4:5", "9:16"],
    completedRatios: ["4:5"],
    completionMethod: "ai",
    versions: [
      { id: "v2-1", aspectRatio: "4:5", imgSeed: "story-takeover-4x5", createdAt: "Mar 8, 2026" },
    ],
    imgSeed: "story-takeover",
    sourceWorkflow: "Competitor Ad Variation",
    likedAt: "Mar 8, 2026",
  },
  {
    id: "ad-3",
    conceptId: "c21",
    title: "Minimalist Product",
    headline: "Pure Simplicity",
    adCopy: "Less is more. Our minimalist formula delivers maximum results without the clutter.",
    cta: "Shop Now",
    status: "ready",
    platforms: ["linkedin"],
    requiredRatios: ["1:1"],
    completedRatios: ["1:1"],
    completionMethod: "ai",
    versions: [
      { id: "v3-1", aspectRatio: "1:1", imgSeed: "minimalist-prod-1x1", createdAt: "Mar 7, 2026" },
    ],
    imgSeed: "minimalist-prod",
    sourceWorkflow: "Competitor Ad Variation",
    likedAt: "Mar 7, 2026",
  },
  {
    id: "ad-4",
    conceptId: "c30",
    title: "Pastel Palette Ad",
    headline: "Gentle Care, Bold Results",
    adCopy: "Embrace the softness. Our pastel collection brings gentle care to your daily routine. 🌸",
    cta: "Discover",
    status: "incomplete",
    platforms: ["facebook", "linkedin"],
    requiredRatios: ["4:5", "9:16", "1:1"],
    completedRatios: ["4:5"],
    completionMethod: "designer",
    versions: [
      { id: "v4-1", aspectRatio: "4:5", imgSeed: "pastel-palette-4x5", createdAt: "Mar 6, 2026" },
    ],
    imgSeed: "pastel-palette",
    sourceWorkflow: "Competitor Ad Variation",
    likedAt: "Mar 6, 2026",
  },
  {
    id: "ad-5",
    conceptId: "c41",
    title: "Product in Action",
    headline: "See It Work",
    adCopy: "Real results from real people. Watch our product transform your skincare routine.",
    cta: "Shop Now",
    status: "draft",
    platforms: ["facebook"],
    requiredRatios: ["4:5", "9:16"],
    completedRatios: [],
    completionMethod: "ai",
    versions: [],
    imgSeed: "product-action",
    sourceWorkflow: "Competitor Ad Variation",
    likedAt: "Mar 5, 2026",
  },
  {
    id: "ad-6",
    conceptId: "c51",
    title: "Glass Morphism",
    headline: "Transparency You Can Trust",
    adCopy: "Clean ingredients, clear results. Our glass-inspired design reflects our commitment to transparency.",
    cta: "Learn More",
    status: "ready",
    platforms: ["facebook", "linkedin"],
    requiredRatios: ["4:5", "1:1", "16:9"],
    completedRatios: ["4:5", "1:1", "16:9"],
    completionMethod: "ai",
    versions: [
      { id: "v6-1", aspectRatio: "4:5", imgSeed: "glass-morph-4x5", createdAt: "Mar 4, 2026" },
      { id: "v6-2", aspectRatio: "1:1", imgSeed: "glass-morph-1x1", createdAt: "Mar 4, 2026" },
      { id: "v6-3", aspectRatio: "16:9", imgSeed: "glass-morph-16x9", createdAt: "Mar 5, 2026" },
    ],
    imgSeed: "glass-morph",
    sourceWorkflow: "Competitor Ad Variation",
    likedAt: "Mar 4, 2026",
  },
  {
    id: "ad-7",
    conceptId: "c45",
    title: "Before/After Strip",
    headline: "The Proof Is in the Results",
    adCopy: "See the difference for yourself. Before and after — no filters, just results.",
    cta: "Try Now",
    status: "incomplete",
    platforms: ["facebook"],
    requiredRatios: ["4:5", "9:16"],
    completedRatios: ["9:16"],
    completionMethod: "designer",
    versions: [
      { id: "v7-1", aspectRatio: "9:16", imgSeed: "before-after-9x16", createdAt: "Mar 5, 2026" },
    ],
    imgSeed: "before-after",
    sourceWorkflow: "Competitor Ad Variation",
    likedAt: "Mar 5, 2026",
  },
];
