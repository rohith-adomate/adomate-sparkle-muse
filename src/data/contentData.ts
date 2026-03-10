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

export interface AdHistoryEntry {
  id: string;
  label: string;
  date: string;
  actor: string;
  imgSeed: string;
  status: "approved" | "current" | "rejected";
  note?: string;
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
  history: AdHistoryEntry[];
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
    history: [
      { id: "h1-1", label: "Ad Concept", date: "Mar 6, 2026, 14:20", actor: "Lucas Desard", imgSeed: "beach-ugc-concept", status: "approved", note: "Original concept liked from workflow" },
      { id: "h1-2", label: "First Delivery", date: "Mar 7, 2026, 10:15", actor: "AI Generation", imgSeed: "beach-ugc-v1", status: "approved", note: "All 3 ratios generated successfully" },
      { id: "h1-3", label: "Final Version", date: "Mar 8, 2026, 16:30", actor: "AI Generation", imgSeed: "beach-ugc-4x5", status: "current" },
    ],
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
    history: [
      { id: "h2-1", label: "Ad Concept", date: "Mar 5, 2026, 09:00", actor: "Lucas Desard", imgSeed: "story-takeover-concept", status: "approved" },
      { id: "h2-2", label: "First Delivery (Current)", date: "Mar 8, 2026, 11:30", actor: "AI Generation", imgSeed: "story-takeover-4x5", status: "current", note: "9:16 ratio still pending" },
    ],
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
    history: [
      { id: "h3-1", label: "Ad Concept", date: "Mar 5, 2026, 15:00", actor: "Emma Chen", imgSeed: "minimalist-concept", status: "approved" },
      { id: "h3-2", label: "Final Version", date: "Mar 7, 2026, 09:45", actor: "AI Generation", imgSeed: "minimalist-prod-1x1", status: "current" },
    ],
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
    history: [
      { id: "h4-1", label: "Ad Concept", date: "Mar 3, 2026, 11:00", actor: "Lucas Desard", imgSeed: "pastel-concept", status: "approved" },
      { id: "h4-2", label: "Designer Draft", date: "Mar 5, 2026, 14:20", actor: "Sarah Kim", imgSeed: "pastel-draft", status: "rejected", note: "Colors too muted, needs more contrast" },
      { id: "h4-3", label: "Revised Version (Current)", date: "Mar 6, 2026, 10:00", actor: "Sarah Kim", imgSeed: "pastel-palette-4x5", status: "current", note: "Updated palette with bolder accents" },
    ],
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
    history: [
      { id: "h5-1", label: "Ad Concept", date: "Mar 5, 2026, 08:30", actor: "Lucas Desard", imgSeed: "product-action-concept", status: "current", note: "Awaiting generation" },
    ],
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
    history: [
      { id: "h6-1", label: "Ad Concept", date: "Mar 2, 2026, 16:00", actor: "Emma Chen", imgSeed: "glass-concept", status: "approved" },
      { id: "h6-2", label: "First Delivery", date: "Mar 3, 2026, 09:15", actor: "AI Generation", imgSeed: "glass-morph-v1", status: "approved" },
      { id: "h6-3", label: "Second Delivery", date: "Mar 4, 2026, 11:40", actor: "AI Generation", imgSeed: "glass-morph-4x5", status: "current", note: "16:9 added for LinkedIn" },
    ],
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
    history: [
      { id: "h7-1", label: "Ad Concept", date: "Mar 3, 2026, 13:00", actor: "Lucas Desard", imgSeed: "before-after-concept", status: "approved" },
      { id: "h7-2", label: "Designer Delivery (Current)", date: "Mar 5, 2026, 17:00", actor: "Sarah Kim", imgSeed: "before-after-9x16", status: "current", note: "4:5 version in progress" },
    ],
  },
];
