import type { DatasetColumn, DatasetFilter, DatasetSource, DatasetRow } from "./types";

export const INITIAL_SOURCES: DatasetSource[] = [
  { id: "s1", type: "competitor", label: "CeraVe Meta Ad ...", avatar: "https://logo.clearbit.com/cerave.com", url: "https://www.facebook.com/ads/library/?q=cerave", status: "connected" },
  { id: "s2", type: "competitor", label: "The Ordinary Me...", avatar: "https://logo.clearbit.com/theordinary.com", url: "https://www.facebook.com/ads/library/?q=theordinary", status: "connected" },
  { id: "s3", type: "landing-page", label: "CeraVe Landing...", avatar: "https://logo.clearbit.com/cerave.com", url: "https://cerave.com/...", status: "needs-auth" },
];

export const FACTS_COLUMNS: DatasetColumn[] = [
  { id: "col-brand", name: "Brand", type: "facts" },
  { id: "col-headline", name: "Headline", type: "facts" },
  { id: "col-format", name: "Format", type: "facts" },
  { id: "col-platform", name: "Platform", type: "facts" },
  { id: "col-launched", name: "First Launched", type: "facts" },
  { id: "col-days", name: "Days Online", type: "facts" },
  { id: "col-status", name: "Status", type: "facts" },
  { id: "col-funnel", name: "Funnel", type: "facts" },
  { id: "col-hook", name: "Hook", type: "facts" },
  { id: "col-offer", name: "Offer", type: "facts" },
  { id: "col-alignment", name: "Brand Align.", type: "facts" },
];

export const TEMPLATE_COLUMNS: { id: string; name: string; description: string; columnKind: DatasetColumn["columnKind"]; aiPrompt: string }[] = [
  { id: "tpl-ad-type", name: "Ad Type", description: "Classifies ads as Static, UGC, or Carousel", columnKind: "classification", aiPrompt: "Analyze the ad creative and classify it as one of: Static, UGC, or Carousel. Consider visual elements, production style, and format indicators." },
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

export const INITIAL_ROWS: DatasetRow[] = [
  { id: "1", brand: "CeraVe", brandAvatar: "https://logo.clearbit.com/cerave.com", headline: "Hydrating Facial Cleanser — Dermatologist Recommended", format: "Image", platform: "Meta", firstLaunched: "2025-08-12", status: "Active", funnelStage: "TOFU", hook: "Dermatologists' #1 pick for daily cleansing", offerPresent: false, brandAlignment: "High", aiValues: {} },
  { id: "2", brand: "CeraVe", brandAvatar: "https://logo.clearbit.com/cerave.com", headline: "Moisturizing Cream for Dry Skin Relief", format: "Image", platform: "Meta", firstLaunched: "2025-11-03", status: "Inactive", funnelStage: "MOFU", hook: "Stop suffering from dry skin this winter", offerPresent: true, brandAlignment: "Med", aiValues: {} },
  { id: "3", brand: "The Ordinary", brandAvatar: "https://logo.clearbit.com/theordinary.com", headline: "Niacinamide 10% + Zinc 1% — Target Blemishes", format: "Video", platform: "Meta", firstLaunched: "2025-06-20", status: "Active", funnelStage: "TOFU", hook: "The viral serum that cleared my skin in 2 weeks", offerPresent: false, brandAlignment: "High", aiValues: {} },
  { id: "4", brand: "The Ordinary", brandAvatar: "https://logo.clearbit.com/theordinary.com", headline: "AHA 30% + BHA 2% Peeling Solution", format: "Carousel", platform: "Meta", firstLaunched: "2025-12-01", status: "Active", funnelStage: "MOFU", hook: "Professional-grade peel, at home", offerPresent: true, brandAlignment: "Med", aiValues: {} },
  { id: "5", brand: "CeraVe", brandAvatar: "https://logo.clearbit.com/cerave.com", headline: "AM Facial Moisturizing Lotion with SPF 30", format: "Image", platform: "Meta", firstLaunched: "2025-09-28", status: "Inactive", funnelStage: "BOFU", hook: "SPF + moisturizer in one step — save 5 min daily", offerPresent: true, brandAlignment: "High", aiValues: {} },
  { id: "6", brand: "The Ordinary", brandAvatar: "https://logo.clearbit.com/theordinary.com", headline: "Hyaluronic Acid 2% + B5 — Intense Hydration", format: "Video", platform: "Meta", firstLaunched: "2026-01-15", status: "Active", funnelStage: "TOFU", hook: "Why 10M people swear by this $7 serum", offerPresent: false, brandAlignment: "Med", aiValues: {} },
  { id: "7", brand: "CeraVe", brandAvatar: "https://logo.clearbit.com/cerave.com", headline: "SA Smoothing Cleanser — Bumpy Skin", format: "Image", platform: "Meta", firstLaunched: "2025-10-10", status: "Active", funnelStage: "MOFU", hook: "Finally smooth skin without irritation", offerPresent: false, brandAlignment: "High", aiValues: {} },
  { id: "8", brand: "The Ordinary", brandAvatar: "https://logo.clearbit.com/theordinary.com", headline: "Retinol 0.5% in Squalane — Anti-Aging", format: "Carousel", platform: "Meta", firstLaunched: "2026-02-05", status: "Inactive", funnelStage: "BOFU", hook: "Start retinol the right way — no peeling", offerPresent: true, brandAlignment: "Low", aiValues: {} },
  { id: "9", brand: "CeraVe", brandAvatar: "https://logo.clearbit.com/cerave.com", headline: "Eye Repair Cream — Dark Circles", format: "Image", platform: "Meta", firstLaunched: "2026-02-28", status: "Active", funnelStage: "MOFU", hook: "Dark circles? This cream works overnight", offerPresent: false, brandAlignment: "High", aiValues: {} },
  { id: "10", brand: "The Ordinary", brandAvatar: "https://logo.clearbit.com/theordinary.com", headline: "Glycolic Acid 7% Toning Solution", format: "Video", platform: "Meta", firstLaunched: "2026-02-18", status: "Active", funnelStage: "TOFU", hook: "The $9 toner that replaced my $60 one", offerPresent: false, brandAlignment: "Med", aiValues: {} },
  { id: "11", brand: "CeraVe", brandAvatar: "https://logo.clearbit.com/cerave.com", headline: "Foaming Facial Cleanser — Oily Skin", format: "Image", platform: "Meta", firstLaunched: "2026-03-04", status: "Inactive", funnelStage: "BOFU", hook: "Oil-free clean in 60 seconds", offerPresent: true, brandAlignment: "High", aiValues: {} },
  { id: "12", brand: "The Ordinary", brandAvatar: "https://logo.clearbit.com/theordinary.com", headline: "Squalane Cleanser — Gentle Makeup Removal", format: "Image", platform: "Meta", firstLaunched: "2026-03-01", status: "Active", funnelStage: "TOFU", hook: "Remove every trace of makeup — no tugging", offerPresent: false, brandAlignment: "Low", aiValues: {} },
];

// Mock AI values to fill when "running" a row
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

// Generate column-specific stats
export function getColumnStats(columnId: string, rows: DatasetRow[]): { label: string; items: { name: string; value: string }[] } | null {
  if (columnId === "col-status") {
    const active = rows.filter(r => r.status === "Active").length;
    const inactive = rows.length - active;
    return { label: "Status Distribution", items: [
      { name: "Active", value: `${Math.round(active / rows.length * 100)}%` },
      { name: "Inactive", value: `${Math.round(inactive / rows.length * 100)}%` },
    ]};
  }
  if (columnId === "col-funnel") {
    const counts: Record<string, number> = {};
    rows.forEach(r => { counts[r.funnelStage] = (counts[r.funnelStage] || 0) + 1; });
    return { label: "Funnel Distribution", items: Object.entries(counts).map(([k, v]) => ({ name: k, value: `${Math.round(v / rows.length * 100)}%` })) };
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
  // AI column stats — grouped by brand
  const templateId = columnId;
  const hasData = rows.some(r => r.aiValues[templateId]);
  if (!hasData) return null;

  const brands = [...new Set(rows.map(r => r.brand))];
  const items: { name: string; value: string }[] = [];
  brands.forEach(brand => {
    const brandRows = rows.filter(r => r.brand === brand && r.aiValues[templateId]);
    if (brandRows.length === 0) return;
    const valueCounts: Record<string, number> = {};
    brandRows.forEach(r => { const v = r.aiValues[templateId]; if (v) valueCounts[v] = (valueCounts[v] || 0) + 1; });
    const total = brandRows.length;
    const parts = Object.entries(valueCounts).map(([k, v]) => `${Math.round(v / total * 100)}% ${k}`).join(", ");
    items.push({ name: brand, value: parts });
  });
  return items.length > 0 ? { label: "Breakdown by Brand", items } : null;
}
