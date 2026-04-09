import type { DatasetColumn, DatasetFilter, DatasetSource, DatasetRow } from "./types";

export const INITIAL_SOURCES: DatasetSource[] = [
  { id: "s1", type: "competitor", label: "CeraVe", avatar: "https://logo.clearbit.com/cerave.com", url: "https://www.facebook.com/ads/library/?q=cerave", status: "connected" },
  { id: "s2", type: "competitor", label: "The Ordinary", avatar: "https://logo.clearbit.com/theordinary.com", url: "https://www.facebook.com/ads/library/?q=theordinary", status: "connected" },
  { id: "s3", type: "landing-page", label: "CeraVe Landing Page", avatar: "https://logo.clearbit.com/cerave.com", url: "https://cerave.com/...", status: "needs-auth" },
];

export const FACTS_COLUMNS: DatasetColumn[] = [
  { id: "col-brand", name: "Brand", type: "facts" },
  { id: "col-format", name: "Format", type: "facts" },
  { id: "col-launched", name: "First Launched", type: "facts" },
  { id: "col-days", name: "Days Online", type: "facts" },
  { id: "col-status", name: "Active", type: "facts" },
  { id: "col-landing", name: "Landing Page", type: "facts" },
  { id: "col-headline", name: "Headline", type: "facts" },
  { id: "col-alignment", name: "Brand Align.", type: "facts", aiPrompt: `Classify whether the competitor ad fits the brand context as-is, or could be easily adapted to fit it.\n\nReturn exactly one categorical value from allowedValues in Validation.\n\nUse High when the ad already matches the brand's value proposition and tone, or would need only minimal adaptation.\n\nUse Medium when the ad is partially aligned and could fit with moderate adaptation.\n\nUse Low when the ad is weakly aligned, contradictory, or would require major adaptation to fit the brand context.` },
];

export const TEMPLATE_COLUMNS: { id: string; name: string; description: string; columnKind: DatasetColumn["columnKind"]; aiPrompt: string }[] = [
  { id: "tpl-ad-type", name: "Ad Style", description: "Classifies the creative style of the ad, such as UGC, product demo, or lifestyle", columnKind: "classification", aiPrompt: "Analyze the ad creative and classify its style as one of: Static, UGC, or Carousel. Consider visual elements, production style, and format indicators." },
  { id: "tpl-visual-format", name: "Visual Format Signals", description: "Detects testimonials, product demos, founder-led, before/after", columnKind: "classification", aiPrompt: "Identify the visual format of this ad. Classify as one of: Testimonial, Product Demo, Founder-led, Before/After, Lifestyle, or Other." },
  { id: "tpl-landing-page", name: "Landing Page Usage Mix", description: "Top landing pages with % share", columnKind: "extraction", aiPrompt: "Extract the landing page URL this ad points to and categorize it (Homepage, Product Page, Collection, Blog, Custom LP)." },
  { id: "tpl-longest-running", name: "Longest Running Ads", description: "Flags likely winners by longevity", columnKind: "scoring", aiPrompt: "Score this ad's longevity signal from 1-10 based on days running and consistency. Ads running 90+ days with stable performance get 8-10." },
];

export function daysOnline(d: string): number {
  const launched = new Date(d);
  const now = new Date("2026-03-31");
  return Math.max(0, Math.floor((now.getTime() - launched.getTime()) / (1000 * 60 * 60 * 24)));
}

export function formatDate(d: string): string {
  const date = new Date(d);
  const day = date.getDate().toString().padStart(2, "0");
  const mon = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${mon} ${year}`;
}

export const DEFAULT_AI_COLUMN: DatasetColumn = {
  id: "ai-ad-type",
  name: "Ad Style",
  type: "ai",
  columnKind: "classification",
  aiPrompt: "Analyze the ad creative and classify it as one of: Static, UGC, or Carousel.",
  description: "Classifies ads as Static, UGC, or Carousel",
  templateId: "tpl-ad-type",
};

export const INITIAL_ROWS: DatasetRow[] = [
  { id: "1", brand: "CeraVe", brandAvatar: "https://logo.clearbit.com/cerave.com", headline: "Hydrating Facial Cleanser — Dermatologist Recommended", format: "Image", platform: "Meta", firstLaunched: "2025-08-12", status: "Active", funnelStage: "TOFU", hook: "Dermatologists' #1 pick for daily cleansing", offerPresent: false, brandAlignment: "High", landingPage: "https://www.cerave.com/skincare/cleansers/hydrating-facial-cleanser", aiValues: { "tpl-ad-type": "Static" } },
  { id: "2", brand: "CeraVe", brandAvatar: "https://logo.clearbit.com/cerave.com", headline: "Moisturizing Cream for Dry Skin Relief", format: "Image", platform: "Meta", firstLaunched: "2025-11-03", status: "Inactive", funnelStage: "MOFU", hook: "Stop suffering from dry skin this winter", offerPresent: true, brandAlignment: "Med", landingPage: "https://www.cerave.com/skincare/moisturizers/moisturizing-cream", aiValues: { "tpl-ad-type": "Static" } },
  { id: "3", brand: "The Ordinary", brandAvatar: "https://logo.clearbit.com/theordinary.com", headline: "Niacinamide 10% + Zinc 1% — Target Blemishes", format: "Video", platform: "Meta", firstLaunched: "2025-06-20", status: "Active", funnelStage: "TOFU", hook: "The viral serum that cleared my skin in 2 weeks", offerPresent: false, brandAlignment: "High", landingPage: "https://theordinary.com/en/niacinamide-10-zinc-1.html", aiValues: { "tpl-ad-type": "UGC" } },
  { id: "4", brand: "The Ordinary", brandAvatar: "https://logo.clearbit.com/theordinary.com", headline: "AHA 30% + BHA 2% Peeling Solution", format: "Carousel", platform: "Meta", firstLaunched: "2025-12-01", status: "Active", funnelStage: "MOFU", hook: "Professional-grade peel, at home", offerPresent: true, brandAlignment: "Med", landingPage: "https://theordinary.com/en/aha-30-bha-2-peeling-solution.html", aiValues: { "tpl-ad-type": "Carousel" } },
  { id: "5", brand: "CeraVe", brandAvatar: "https://logo.clearbit.com/cerave.com", headline: "AM Facial Moisturizing Lotion with SPF 30", format: "Image", platform: "Meta", firstLaunched: "2025-09-28", status: "Inactive", funnelStage: "BOFU", hook: "SPF + moisturizer in one step — save 5 min daily", offerPresent: true, brandAlignment: "High", landingPage: "https://www.cerave.com/skincare/moisturizers/am-facial-moisturizing-lotion-spf-30", aiValues: { "tpl-ad-type": "Static" } },
  { id: "6", brand: "The Ordinary", brandAvatar: "https://logo.clearbit.com/theordinary.com", headline: "Hyaluronic Acid 2% + B5 — Intense Hydration", format: "Video", platform: "Meta", firstLaunched: "2026-01-15", status: "Active", funnelStage: "TOFU", hook: "Why 10M people swear by this $7 serum", offerPresent: false, brandAlignment: "Med", landingPage: "https://theordinary.com/en/hyaluronic-acid-2-b5.html", aiValues: { "tpl-ad-type": "UGC" } },
  { id: "7", brand: "CeraVe", brandAvatar: "https://logo.clearbit.com/cerave.com", headline: "SA Smoothing Cleanser — Bumpy Skin", format: "Image", platform: "Meta", firstLaunched: "2025-10-10", status: "Active", funnelStage: "MOFU", hook: "Finally smooth skin without irritation", offerPresent: false, brandAlignment: "High", landingPage: "https://www.cerave.com/skincare/cleansers/sa-smoothing-cleanser", aiValues: { "tpl-ad-type": "Static" } },
  { id: "8", brand: "The Ordinary", brandAvatar: "https://logo.clearbit.com/theordinary.com", headline: "Retinol 0.5% in Squalane — Anti-Aging", format: "Carousel", platform: "Meta", firstLaunched: "2026-02-05", status: "Inactive", funnelStage: "BOFU", hook: "Start retinol the right way — no peeling", offerPresent: true, brandAlignment: "Low", landingPage: "https://theordinary.com/en/retinol-0-5-in-squalane.html", aiValues: { "tpl-ad-type": "Carousel" } },
  { id: "9", brand: "CeraVe", brandAvatar: "https://logo.clearbit.com/cerave.com", headline: "Eye Repair Cream — Dark Circles", format: "Image", platform: "Meta", firstLaunched: "2026-02-28", status: "Active", funnelStage: "MOFU", hook: "Dark circles? This cream works overnight", offerPresent: false, brandAlignment: "High", landingPage: "https://www.cerave.com/skincare/eye-cream/eye-repair-cream", aiValues: { "tpl-ad-type": "Static" } },
  { id: "10", brand: "The Ordinary", brandAvatar: "https://logo.clearbit.com/theordinary.com", headline: "Glycolic Acid 7% Toning Solution", format: "Video", platform: "Meta", firstLaunched: "2026-02-18", status: "Active", funnelStage: "TOFU", hook: "The $9 toner that replaced my $60 one", offerPresent: false, brandAlignment: "Med", landingPage: "https://theordinary.com/en/glycolic-acid-7-toning-solution.html", aiValues: { "tpl-ad-type": "UGC" } },
  { id: "11", brand: "CeraVe", brandAvatar: "https://logo.clearbit.com/cerave.com", headline: "Foaming Facial Cleanser — Oily Skin", format: "Image", platform: "Meta", firstLaunched: "2026-03-04", status: "Inactive", funnelStage: "BOFU", hook: "Oil-free clean in 60 seconds", offerPresent: true, brandAlignment: "High", landingPage: "https://www.cerave.com/skincare/cleansers/foaming-facial-cleanser", aiValues: { "tpl-ad-type": "Static" } },
  { id: "12", brand: "The Ordinary", brandAvatar: "https://logo.clearbit.com/theordinary.com", headline: "Squalane Cleanser — Gentle Makeup Removal", format: "Image", platform: "Meta", firstLaunched: "2026-03-01", status: "Active", funnelStage: "TOFU", hook: "Remove every trace of makeup — no tugging", offerPresent: false, brandAlignment: "Low", landingPage: "https://theordinary.com/en/squalane-cleanser.html", aiValues: { "tpl-ad-type": "UGC" } },
];

export const MOCK_AI_VALUES: Record<string, Record<string, string>> = {
  "tpl-ad-type": {
    "1": "Static", "2": "Static", "3": "UGC", "4": "Carousel",
    "5": "Static", "6": "UGC", "7": "Static", "8": "Carousel",
    "9": "Static", "10": "UGC", "11": "Static", "12": "UGC",
  },
  "tpl-visual-format": {
    "1": "Product Demo", "2": "Lifestyle", "3": "Testimonial", "4": "Before/After",
    "5": "Product Demo", "6": "Testimonial", "7": "Product Demo", "8": "Founder-led",
    "9": "Lifestyle", "10": "Testimonial", "11": "Product Demo", "12": "Lifestyle",
  },
  "tpl-landing-page": {
    "1": "Product Page", "2": "Homepage", "3": "Product Page", "4": "Custom LP",
    "5": "Collection", "6": "Product Page", "7": "Product Page", "8": "Blog",
    "9": "Product Page", "10": "Collection", "11": "Homepage", "12": "Product Page",
  },
  "tpl-longest-running": {
    "1": "9/10", "2": "5/10", "3": "8/10", "4": "4/10",
    "5": "6/10", "6": "3/10", "7": "7/10", "8": "2/10",
    "9": "3/10", "10": "4/10", "11": "2/10", "12": "3/10",
  },
};

export function getColumnStats(columnId: string, rows: DatasetRow[]): { label: string; items: { name: string; value: string }[] } | null {
  if (columnId === "col-status") {
    const active = rows.filter(r => r.status === "Active").length;
    const inactive = rows.length - active;
    return { label: "Status Distribution", items: [
      { name: "Active", value: `${Math.round(active / rows.length * 100)}%` },
      { name: "Inactive", value: `${Math.round(inactive / rows.length * 100)}%` },
    ]};
  }
  if (columnId === "col-alignment") {
    const counts: Record<string, number> = {};
    rows.forEach(r => { counts[r.brandAlignment] = (counts[r.brandAlignment] || 0) + 1; });
    return { label: "Brand Alignment", items: Object.entries(counts).map(([k, v]) => ({ name: k, value: `${Math.round(v / rows.length * 100)}%` })) };
  }
  if (columnId === "col-days") {
    const days = rows.map(r => daysOnline(r.firstLaunched));
    return { label: "Days Online", items: [
      { name: "Min", value: `${Math.min(...days)}` },
      { name: "Max", value: `${Math.max(...days)}` },
      { name: "Avg", value: `${Math.round(days.reduce((a, b) => a + b, 0) / days.length)}` },
    ]};
  }
  return null;
}
