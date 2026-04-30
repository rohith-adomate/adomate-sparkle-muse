import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, Download, Loader2, CheckCircle2, X, Plus, Database, Star, ArrowUp, MessageSquare, Filter, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import ReviewFilterPopover, { type ReviewActiveFilter } from "./ReviewFilterPopover";

interface Brand {
  id: string;
  name: string;
  isOwn?: boolean;
}

const ALL_BRANDS: Brand[] = [
  { id: "oycare", name: "Oy Care", isOwn: true },
  { id: "cerave", name: "CeraVe" },
  { id: "lrp", name: "La Roche-Posay" },
];

const ADDITIONAL_BRANDS: Brand[] = [
  { id: "neutrogena", name: "Neutrogena" },
  { id: "the-ordinary", name: "The Ordinary" },
  { id: "bioderma", name: "Bioderma" },
];

// Uniform avatar style matching ad library competitor pills (light primary tint)
const AVATAR_CLASS = "rounded-full flex items-center justify-center font-bold text-primary bg-primary/15 shrink-0";

type Platform = "Trustpilot" | "Amazon";

type Sentiment = "Positive" | "Neutral" | "Negative";

interface ReviewRow {
  id: string;
  brandId: string;
  brandName: string;
  platform: Platform;
  product: string | null; // null for Trustpilot (brand-level)
  rating: number;
  title: string;
  text: string;
  date: string; // ISO date
  votes: number;
  reviewer: string;
  region: { flag: string; code: string } | null; // null for unknown (e.g. some Trustpilot)
  language: string;
  sentiment: Sentiment;
}

const ROWS: ReviewRow[] = [
  { id: "r1", brandId: "oycare", brandName: "Oy Care", platform: "Trustpilot", product: null, rating: 5, title: "Soothes, smoothes, and hydrates", text: "I love the After Baume. This cream glides onto the skin and instantly calms any redness I have after shaving or exfoliating. It feels rich without being greasy and absorbs really well.", date: "2026-04-14", votes: 12, reviewer: "Sarah M.", region: { flag: "🇬🇧", code: "UK" }, language: "English", sentiment: "Positive" },
  { id: "r2", brandId: "oycare", brandName: "Oy Care", platform: "Amazon", product: "Vitamin C Brightening Serum 30ml", rating: 4, title: "Great daily moisturizer", text: "Been using this every morning for 3 months and my skin feels much more balanced. It sits well under makeup and SPF.", date: "2026-04-10", votes: 8, reviewer: "Michael T.", region: { flag: "🇺🇸", code: "US" }, language: "English", sentiment: "Positive" },
  { id: "r3", brandId: "cerave", brandName: "CeraVe", platform: "Trustpilot", product: null, rating: 5, title: "Holy grail cleanser", text: "I have tried every cleanser on the market and this is the only one that doesn't leave my skin feeling tight or stripped.", date: "2026-03-04", votes: 34, reviewer: "Emma L.", region: null, language: "English", sentiment: "Positive" },
  { id: "r4", brandId: "cerave", brandName: "CeraVe", platform: "Amazon", product: "Foaming Facial Cleanser 473ml", rating: 4, title: "Dermatologist recommended for a reason", text: "My skin has never felt so clean without feeling stripped. Gentle enough for daily use.", date: "2026-02-28", votes: 21, reviewer: "Anna K.", region: { flag: "🇩🇪", code: "DE" }, language: "German", sentiment: "Positive" },
  { id: "r5", brandId: "cerave", brandName: "CeraVe", platform: "Amazon", product: "Moisturizing Cream 539g", rating: 3, title: "Good but not great", text: "Does the job but I expected more hydration for the price point. It's fine but nothing special.", date: "2026-02-20", votes: 5, reviewer: "James R.", region: { flag: "🇺🇸", code: "US" }, language: "English", sentiment: "Neutral" },
  { id: "r6", brandId: "lrp", brandName: "La Roche-Posay", platform: "Amazon", product: "Toleriane Double Repair Face Moisturizer", rating: 5, title: "Saved my sensitive skin", text: "After years of trying products for rosacea this is the first one that hasn't caused a flare-up. Genuinely life-changing.", date: "2026-02-02", votes: 55, reviewer: "Sophie B.", region: { flag: "🇫🇷", code: "FR" }, language: "French", sentiment: "Positive" },
  { id: "r7", brandId: "lrp", brandName: "La Roche-Posay", platform: "Trustpilot", product: null, rating: 5, title: "Worth every penny", text: "Expensive but completely transformed my skin barrier in about 6 weeks of consistent use.", date: "2026-01-18", votes: 19, reviewer: "David P.", region: null, language: "English", sentiment: "Positive" },
  { id: "r8", brandId: "oycare", brandName: "Oy Care", platform: "Trustpilot", product: null, rating: 4, title: "Gentle and effective", text: "Works really well for my dry skin type. Would love a larger size option.", date: "2026-01-10", votes: 7, reviewer: "Lotte V.", region: { flag: "🇳🇱", code: "NL" }, language: "Dutch", sentiment: "Positive" },
  { id: "r9", brandId: "cerave", brandName: "CeraVe", platform: "Trustpilot", product: null, rating: 2, title: "Broke me out", text: "Unfortunately this did not agree with my skin and caused breakouts within a week.", date: "2026-01-05", votes: 44, reviewer: "Rachel S.", region: { flag: "🇺🇸", code: "US" }, language: "English", sentiment: "Negative" },
  { id: "r10", brandId: "lrp", brandName: "La Roche-Posay", platform: "Amazon", product: "Anthelios Melt-in Milk Sunscreen SPF 60", rating: 4, title: "Repurchased 5 times", text: "This is my ride or die SPF, never leaves a white cast and feels lightweight.", date: "2025-12-28", votes: 31, reviewer: "Olivia C.", region: { flag: "🇬🇧", code: "UK" }, language: "English", sentiment: "Positive" },
  { id: "r11", brandId: "oycare", brandName: "Oy Care", platform: "Amazon", product: "After Baume Soothing Cream 50ml", rating: 5, title: "Perfect for winter skin", text: "My skin was so dry this winter and this fixed it within days of starting to use it.", date: "2025-12-15", votes: 9, reviewer: "Hans M.", region: { flag: "🇩🇪", code: "DE" }, language: "German", sentiment: "Positive" },
  { id: "r12", brandId: "cerave", brandName: "CeraVe", platform: "Amazon", product: "Hydrating Facial Cleanser 355ml", rating: 4, title: "Great value for money", text: "Huge bottle lasts forever and skin feels amazing. Will definitely repurchase.", date: "2025-12-01", votes: 16, reviewer: "Pieter J.", region: { flag: "🇳🇱", code: "NL" }, language: "Dutch", sentiment: "Positive" },
];

const SENTIMENT_BADGE: Record<Sentiment, string> = {
  Positive: "border-green-500/30 text-green-700 bg-green-500/10",
  Neutral: "border-muted-foreground/30 text-muted-foreground bg-muted",
  Negative: "border-red-500/30 text-red-700 bg-red-500/10",
};

function getInitials(name: string) {
  return name.split(/[\s-]+/).map(p => p[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

interface Props {
  open: boolean;
  onClose: () => void;
  initialEmpty?: boolean;
  onSourcesChange?: (count: number) => void;
  onContinue?: () => void;
  continueLabel?: string;
}

export default function ReviewDatasetDrawer({ open, onClose, initialEmpty = false, onSourcesChange, onContinue, continueLabel = "Continue" }: Props) {
  const OY_BRAND: Brand = { id: "oycare", name: "Oy Care", isOwn: true };
  const [addedBrands, setAddedBrands] = useState<Brand[]>(initialEmpty ? [] : [OY_BRAND]);
  const [addBrandOpen, setAddBrandOpen] = useState(false);
  const activeBrandIds = new Set<string>(addedBrands.map(b => b.id));
  const [sortBy, setSortBy] = useState<"rating" | "votes">("rating");
  const [ratingSortAsc, setRatingSortAsc] = useState(false);
  const [votesSortAsc, setVotesSortAsc] = useState(false);
  const [detailRow, setDetailRow] = useState<ReviewRow | null>(null);
  const [activeFilters, setActiveFilters] = useState<ReviewActiveFilter[]>([]);

  // Notify parent of source count
  useEffect(() => {
    onSourcesChange?.(addedBrands.length);
  }, [addedBrands.length, onSourcesChange]);

  const availableToAdd = [...ALL_BRANDS, ...ADDITIONAL_BRANDS].filter(b => !addedBrands.find(x => x.id === b.id));
  const addBrand = (b: Brand) => {
    setAddedBrands(prev => [...prev, b]);
    setAddBrandOpen(false);
  };
  const removeBrand = (id: string) => {
    setAddedBrands(prev => prev.filter(b => b.id !== id));
  };

  const applyFilter = (filter: ReviewActiveFilter) => {
    setActiveFilters(prev => {
      const idx = prev.findIndex(f => f.columnId === filter.columnId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = filter;
        return next;
      }
      return [...prev, filter];
    });
  };

  const removeFilter = (columnId: string) => {
    setActiveFilters(prev => prev.filter(f => f.columnId !== columnId));
  };

  const clearAllFilters = () => setActiveFilters([]);

  const filteredRows = useMemo(() => {
    return ROWS
      .filter(r => addedBrands.find(b => b.id === r.brandId)) // only show rows for added brands
      .filter(r => activeBrandIds.size === 0 || activeBrandIds.has(r.brandId))
      .filter(r => activeFilters.every(f => {
        if (f.mode === "select") {
          if (f.columnId === "platform") return f.values.includes(r.platform);
          if (f.columnId === "product") return f.values.includes(r.product || "—");
          if (f.columnId === "brand") return f.values.includes(r.brandName);
          if (f.columnId === "region") return f.values.includes(r.region ? r.region.code : "Unknown");
          if (f.columnId === "language") return f.values.includes(r.language);
          if (f.columnId === "sentiment") return f.values.includes(r.sentiment);
          return true;
        }
        if (f.mode === "number-range") {
          const v = f.columnId === "rating" ? r.rating : f.columnId === "votes" ? r.votes : 0;
          if (f.min !== undefined && v < f.min) return false;
          if (f.max !== undefined && v > f.max) return false;
          return true;
        }
        if (f.mode === "date-range") {
          if (f.dateFrom && r.date < f.dateFrom) return false;
          if (f.dateTo && r.date > f.dateTo) return false;
          return true;
        }
        if (f.mode === "text") {
          const val = (
            f.columnId === "title" ? r.title :
            f.columnId === "text" ? r.text :
            f.columnId === "reviewer" ? r.reviewer :
            ""
          ).toLowerCase();
          const t = (f.textValue || "").toLowerCase();
          switch (f.textOperator) {
            case "contains": return val.includes(t);
            case "not-contains": return !val.includes(t);
            case "starts-with": return val.startsWith(t);
            case "ends-with": return val.endsWith(t);
            default: return true;
          }
        }
        return true;
      }))
      .sort((a, b) => {
        if (sortBy === "votes") {
          const diff = a.votes - b.votes;
          return votesSortAsc ? diff : -diff;
        }
        const diff = a.rating - b.rating;
        return ratingSortAsc ? diff : -diff;
      });
  }, [activeBrandIds, addedBrands, sortBy, votesSortAsc, ratingSortAsc, activeFilters]);

  if (!open) return null;

  const totalRowsForAddedBrands = ROWS.filter(r => addedBrands.find(b => b.id === r.brandId)).length;

  return (
    <TooltipProvider>
      <div className="fixed inset-0 z-50 flex">
        <div className="w-[5%] bg-black/20" onClick={onClose} />
        <div className="w-[95%] bg-card flex flex-col animate-slide-in-right shadow-2xl border-l border-border">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card shrink-0">
            <div className="flex items-center gap-3">
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs">Back to canvas</TooltipContent>
              </Tooltip>
              <h1 className="text-sm font-bold">Reviews Dataset — Skincare Sentiment Q1</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={() => {
                const toastId = toast("Exporting to CSV…", {
                  icon: <Loader2 className="h-4 w-4 animate-spin" />,
                  duration: Infinity,
                });
                setTimeout(() => {
                  toast.success("Exported to CSV", {
                    id: toastId,
                    icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
                    duration: 2000,
                  });
                }, 4000);
              }}>
                <Download className="h-3.5 w-3.5" /> Export CSV
              </Button>
              {onContinue && (
                <Button
                  size="sm"
                  className="h-8 text-xs px-4 font-semibold"
                  disabled={addedBrands.length === 0}
                  onClick={() => {
                    onContinue();
                    onClose();
                  }}
                >
                  {addedBrands.length === 0 ? "Add a brand first" : continueLabel}
                </Button>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left panel */}
            <div className="w-64 shrink-0 border-r border-border bg-card flex flex-col overflow-y-auto">
              <div className="p-4 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                  <Database className="h-3 w-3 text-muted-foreground" />Sources
                </p>
                <div className="space-y-2">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70">Brands</p>
                  <div className="flex flex-wrap gap-1.5">
                    {addedBrands.map(b => (
                      <div
                        key={b.id}
                        className={cn(
                          "inline-flex items-center gap-1.5 pl-1.5 pr-1.5 py-1 rounded-full border border-border bg-background text-[11px] group",
                          b.isOwn && "border-primary/40"
                        )}
                      >
                        <div className={cn(AVATAR_CLASS, "h-4 w-4 text-[8px]")}>{getInitials(b.name)}</div>
                        <span className="font-medium truncate max-w-[120px]">{b.name}</span>
                        <button
                          onClick={() => removeBrand(b.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5"
                          aria-label={`Remove ${b.name}`}
                        >
                          <X className="h-2.5 w-2.5 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    ))}
                    <Popover open={addBrandOpen} onOpenChange={setAddBrandOpen}>
                      <PopoverTrigger asChild>
                        <button
                          className="inline-flex items-center gap-1 pl-1.5 pr-2 py-1 rounded-full border border-dashed border-primary/40 text-[11px] text-primary hover:bg-primary/5 transition-colors"
                          disabled={availableToAdd.length === 0}
                        >
                          <Plus className="h-3 w-3" />
                          Add brand
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-1" align="start">
                        {availableToAdd.length === 0 ? (
                          <p className="text-[11px] text-muted-foreground px-2.5 py-2">No more brands available</p>
                        ) : (
                          availableToAdd.map(b => (
                            <button
                              key={b.id}
                              onClick={() => addBrand(b)}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs hover:bg-muted/50 rounded transition-colors"
                            >
                              <div className={cn(AVATAR_CLASS, "h-4 w-4 text-[8px]")}>{getInitials(b.name)}</div>
                              <span className="font-medium truncate">{b.name}</span>
                            </button>
                          ))
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="border-t border-border/40" />
                {activeFilters.length > 0 ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5"><Filter className="h-3 w-3 text-muted-foreground" />Filters</p>
                      <ReviewFilterPopover rows={ROWS} activeFilters={activeFilters} onApplyFilter={applyFilter} triggerVariant="icon" />
                      <button onClick={clearAllFilters} className="text-[10px] text-muted-foreground hover:text-destructive transition-colors ml-auto">Clear all</button>
                    </div>
                    {activeFilters.map(filter => (
                      <div key={filter.columnId} className="space-y-2">
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70">{filter.columnName}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {filter.values.map(val => (
                            <div key={val} className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-full border border-border bg-background group text-[11px]">
                              <span className="font-medium truncate max-w-[140px]">{val}</span>
                              <button onClick={() => removeFilter(filter.columnId)} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"><X className="h-2.5 w-2.5 text-muted-foreground hover:text-destructive" /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <ReviewFilterPopover rows={ROWS} activeFilters={activeFilters} onApplyFilter={applyFilter} triggerVariant="button" />
                )}
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-auto">
                <table className="text-xs border-collapse min-w-max w-full">
                  <thead className="sticky top-0 z-20">
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="w-10 px-2 py-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sticky left-0 z-30 bg-muted/95 backdrop-blur-sm">#</th>
                      <th className="px-2.5 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Brand</th>
                      <th className="px-2.5 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Platform</th>
                      <th className="px-2.5 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Product</th>
                      <th className="px-2.5 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          Rating
                          <ArrowUp
                            className={cn(
                              "h-3 w-3 shrink-0 cursor-pointer transition-all",
                              sortBy === "rating" ? "text-foreground" : "text-muted-foreground/60 hover:text-foreground",
                              sortBy === "rating" && !ratingSortAsc && "rotate-180",
                            )}
                            onClick={() => {
                              if (sortBy === "rating") setRatingSortAsc(p => !p);
                              else { setSortBy("rating"); setRatingSortAsc(false); }
                            }}
                          />
                        </div>
                      </th>
                      <th className="px-2.5 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Title</th>
                      <th className="px-2.5 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Review text</th>
                      <th className="px-2.5 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Date</th>
                      <th className="px-2.5 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          Votes
                          <ArrowUp
                            className={cn(
                              "h-3 w-3 shrink-0 cursor-pointer transition-all",
                              sortBy === "votes" ? "text-foreground" : "text-muted-foreground/60 hover:text-foreground",
                              sortBy === "votes" && !votesSortAsc && "rotate-180",
                            )}
                            onClick={() => {
                              if (sortBy === "votes") setVotesSortAsc(p => !p);
                              else { setSortBy("votes"); setVotesSortAsc(false); }
                            }}
                          />
                        </div>
                      </th>
                      <th className="px-2.5 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Reviewer</th>
                      <th className="px-2.5 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Region</th>
                      <th className="px-2.5 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Language</th>
                      <th className="px-2.5 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider whitespace-nowrap bg-pink-50/60">
                        <div className="flex items-center gap-1.5 text-primary">
                          <Sparkles className="h-3 w-3 text-pink-300/80" />
                          Sentiment
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRows.map((row, idx) => {
                      const brand = addedBrands.find(b => b.id === row.brandId);
                      return (
                        <tr
                          key={row.id}
                          className="group border-b border-border/50 transition-colors cursor-pointer hover:bg-muted/30"
                          onClick={() => setDetailRow(row)}
                        >
                          <td className="px-2 py-1.5 text-[10px] text-muted-foreground font-mono sticky left-0 z-10 bg-card group-hover:bg-muted/30 transition-colors">{idx + 1}</td>
                          <td className="px-2.5 py-1.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <div className={cn(AVATAR_CLASS, "h-4 w-4 text-[8px]")}>
                                {getInitials(row.brandName)}
                              </div>
                              <span className="text-[11px] font-medium truncate">{row.brandName}</span>
                            </div>
                          </td>
                          <td className="px-2.5 py-1.5 whitespace-nowrap">
                            <span className="text-[11px] text-muted-foreground">{row.platform}</span>
                          </td>
                          <td className="px-2.5 py-1.5 max-w-[180px]">
                            {row.product ? (
                              <span className="text-[11px] text-muted-foreground truncate block" title={row.product}>{row.product}</span>
                            ) : (
                              <span className="text-[11px] text-muted-foreground/50">—</span>
                            )}
                          </td>
                          <td className="px-2.5 py-1.5 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-[11px] tabular-nums text-muted-foreground">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              {Number.isInteger(row.rating) ? row.rating : row.rating.toFixed(1)}
                            </span>
                          </td>
                          <td className="px-2.5 py-1.5 max-w-[260px]">
                            <span className="text-[11px] font-semibold line-clamp-1">{row.title}</span>
                          </td>
                          <td className="px-2.5 py-1.5 max-w-[320px]">
                            <span className="text-[11px] text-muted-foreground line-clamp-1">{row.text}</span>
                          </td>
                          <td className="px-2.5 py-1.5 whitespace-nowrap">
                            <span className="text-[11px] tabular-nums text-muted-foreground">{formatDate(row.date)}</span>
                          </td>
                          <td className="px-2.5 py-1.5 text-right whitespace-nowrap">
                            <span className="text-[11px] tabular-nums text-muted-foreground">{row.votes}</span>
                          </td>
                          <td className="px-2.5 py-1.5 max-w-[140px]">
                            <span className="text-[11px] text-muted-foreground truncate block" title={row.reviewer}>{row.reviewer}</span>
                          </td>
                          <td className="px-2.5 py-1.5 whitespace-nowrap">
                            {row.region ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                <span className="text-sm leading-none">{row.region.flag}</span>
                                {row.region.code}
                              </span>
                            ) : (
                              <span className="text-[11px] text-muted-foreground/50">—</span>
                            )}
                          </td>
                          <td className="px-2.5 py-1.5 whitespace-nowrap">
                            <span className="text-[11px] text-muted-foreground">{row.language}</span>
                          </td>
                          <td className="px-2.5 py-1.5 whitespace-nowrap bg-pink-50/20">
                            <Badge variant="outline" className={cn("text-[9px] py-0 px-1.5 font-medium", SENTIMENT_BADGE[row.sentiment])}>
                              {row.sentiment}
                            </Badge>
                          </td>
                        </tr>

                      );
                    })}
                  </tbody>
                </table>
                <div className="px-4 py-2 text-[10px] text-muted-foreground border-t border-border/50">
                  Showing {filteredRows.length} / {totalRowsForAddedBrands} rows
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row detail panel */}
      {detailRow && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="flex-1 bg-black/30" onClick={() => setDetailRow(null)} />
          <div className="w-[440px] bg-card border-l border-border flex flex-col animate-slide-in-right shadow-2xl">
            <div className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Review</h2>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDetailRow(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Reviewer */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-[11px] font-semibold text-muted-foreground shrink-0">
                  {getInitials(detailRow.reviewer)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate leading-tight">{detailRow.reviewer}</p>
                  <p className="text-[11px] text-muted-foreground/80 mt-0.5 flex items-center gap-1.5 flex-wrap">
                    {detailRow.region && (
                      <>
                        <span className="text-[13px] leading-none">{detailRow.region.flag}</span>
                        <span>{detailRow.region.code}</span>
                        <span className="text-muted-foreground/30">·</span>
                      </>
                    )}
                    <span>{detailRow.language}</span>
                    <span className="text-muted-foreground/30">·</span>
                    <span className="tabular-nums">{formatDate(detailRow.date)}</span>
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3.5 w-3.5",
                      i < detailRow.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"
                    )}
                  />
                ))}
                <span className="ml-1.5 text-[11px] tabular-nums text-muted-foreground">{detailRow.rating}.0</span>
              </div>

              {/* Review content — the focal point */}
              <div className="space-y-2">
                <h3 className="text-base font-semibold leading-snug text-foreground">{detailRow.title}</h3>
                <p className="text-[13px] text-foreground/75 leading-relaxed whitespace-pre-line">{detailRow.text}</p>
              </div>

              {/* Inline meta footer — subtle, no boxes */}
              <div className="pt-4 border-t border-border/60 space-y-2.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground/70">Brand</span>
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <div className={cn(AVATAR_CLASS, "h-4 w-4 text-[8px]")}>
                      {getInitials(detailRow.brandName)}
                    </div>
                    {detailRow.brandName}
                  </span>
                </div>
                {detailRow.product && (
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-muted-foreground/70 shrink-0">Product</span>
                    <span className="font-medium text-foreground text-right truncate">{detailRow.product}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground/70">Source</span>
                  <span className={cn(
                    "font-medium",
                    detailRow.platform === "Trustpilot" && "text-green-700",
                    detailRow.platform === "Amazon" && "text-amber-700",
                  )}>{detailRow.platform}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground/70 flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 text-primary/70" />
                    Sentiment
                  </span>
                  <Badge variant="outline" className={cn("text-[10px] py-0 px-1.5 font-medium", SENTIMENT_BADGE[detailRow.sentiment])}>
                    {detailRow.sentiment}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground/70 flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    Helpful votes
                  </span>
                  <span className="font-medium tabular-nums text-foreground">{detailRow.votes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </TooltipProvider>
  );
}
