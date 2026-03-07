import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import {
  Loader2, Globe, Sparkles, Search, Brain, Palette, ShoppingBag,
  Check, ThumbsUp, ThumbsDown, Target, Layers, Zap, Megaphone,
  Info, Package, FileText, Eye, TrendingUp,
} from "lucide-react";
import { BrandProfileModal, type BrandProfileData } from "@/components/BrandProfileModal";

const goalCards = [
  {
    id: "scale-ads",
    icon: Megaphone,
    title: "Scale Ad Creative",
    subtitle: "Generate high-performing ad variations faster without a design team",
  },
  {
    id: "competitor-intel",
    icon: Target,
    title: "Competitor Intelligence",
    subtitle: "Understand what competitors are running and find gaps to exploit",
  },
  {
    id: "creative-testing",
    icon: Layers,
    title: "Creative Testing",
    subtitle: "Systematically test concepts, hooks, and visuals to find winners",
  },
  {
    id: "performance",
    icon: Zap,
    title: "Improve ROAS",
    subtitle: "Use data-driven insights to maximize return on ad spend",
  },
];

const mockTopics = [
  { title: "Customer Success Story Spotlight", desc: "Showcase real results from your users. Social proof ads consistently outperform feature-focused ads by 2-3x.", tags: ["From website", "Industry trend"] },
  { title: "Problem-Agitation-Solution", desc: "Lead with the pain point your users face daily. This framework drives highest click-through rates.", tags: ["From website"] },
  { title: "Competitor Comparison", desc: "Position your unique advantages. Side-by-side ads perform well for consideration-stage prospects.", tags: ["Industry trend"] },
  { title: "Behind the Scenes", desc: "Show your team, culture, and process. Authenticity-driven content builds trust and brand affinity.", tags: ["From website"] },
  { title: "Feature Deep Dive", desc: "Highlight one specific feature that solves a pressing problem. Single-feature focus outperforms feature-list ads.", tags: ["From Meta data", "Industry trend"] },
  { title: "Limited Time Offer", desc: "Create urgency with a time-bound promotion. Urgency-driven CTAs see 30% higher conversion rates.", tags: ["From Meta data"] },
  { title: "User-Generated Content Style", desc: "Ads that look native to the platform. UGC-style creative outperforms polished ads by 2x on Meta.", tags: ["From Meta data", "Industry trend"] },
];

const brandScrapeSteps = [
  { icon: Globe, text: "Scanning your landing page..." },
  { icon: Palette, text: "Extracting brand colors & logo..." },
  { icon: FileText, text: "Reading your brand story & messaging..." },
  { icon: Search, text: "Searching Google for additional brand intel..." },
  { icon: Brain, text: "Building your brand profile with AI..." },
];

const productScrapeSteps = [
  { icon: Eye, text: "Analyzing your product page..." },
  { icon: ShoppingBag, text: "Extracting product details & pricing..." },
  { icon: Search, text: "Researching your market & competitors..." },
  { icon: TrendingUp, text: "Identifying key selling points..." },
  { icon: Brain, text: "Crafting your product positioning..." },
];

interface OnboardingProps {
  step: number;
  setStep: (step: number) => void;
  onScraping: (v: boolean) => void;
  onCanContinue?: (v: boolean) => void;
}

type KnowledgePhase = "url" | "brand-scraping" | "brand-done" | "product-scraping" | "complete";

export function Onboarding({ step, setStep, onScraping, onCanContinue }: OnboardingProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [website, setWebsite] = useState("https://www.adomate.com/pricing");
  const [knowledgePhase, setKnowledgePhase] = useState<KnowledgePhase>("url");
  const [brandStepIndex, setBrandStepIndex] = useState(0);
  const [productStepIndex, setProductStepIndex] = useState(0);
  const [revealedTopics, setRevealedTopics] = useState<number[]>([]);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [openColorIndex, setOpenColorIndex] = useState<number | null>(null);

  // Mock scraped data
  const [brandData, setBrandData] = useState({
    name: "",
    description: "",
    logo: "",
    colors: ["#6366f1", "#ec4899", "#f59e0b", "#10b981"],
  });
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    image: "",
  });

  // Derive base URL (landing page) and product URL
  const baseUrl = (() => {
    try {
      const u = new URL(website.startsWith("http") ? website : `https://${website}`);
      return u.origin;
    } catch { return website; }
  })();
  const productUrl = website;

  // Notify parent about scraping state
  useEffect(() => {
    const isScraping = knowledgePhase === "brand-scraping" || knowledgePhase === "product-scraping" || knowledgePhase === "brand-done";
    onScraping(isScraping);
  }, [knowledgePhase, onScraping]);

  // Notify parent about whether continue is allowed
  useEffect(() => {
    if (step === 1) {
      onCanContinue?.(selectedGoals.length > 0);
    } else if (step === 2) {
      onCanContinue?.(knowledgePhase === "complete");
    } else {
      onCanContinue?.(true);
    }
  }, [step, selectedGoals, knowledgePhase, onCanContinue]);

  // Reset knowledge phase when navigating back to step 2
  useEffect(() => {
    if (step === 2 && knowledgePhase !== "url" && knowledgePhase !== "complete") {
      // Keep current phase
    }
  }, [step]);

  // Brand scraping animation (10 seconds, 2s per step)
  useEffect(() => {
    if (step === 2 && knowledgePhase === "brand-scraping") {
      setBrandStepIndex(0);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setBrandStepIndex(i);
        if (i >= brandScrapeSteps.length) {
          clearInterval(interval);
          // Populate brand data
          try {
            const hostname = new URL(website.startsWith("http") ? website : `https://${website}`).hostname;
            const name = hostname.replace(/^www\./, "").split(".")[0];
            setBrandData({
              name: name.charAt(0).toUpperCase() + name.slice(1),
              description: "An innovative company pushing the boundaries of modern advertising with AI-powered creative solutions.",
              logo: name.charAt(0).toUpperCase(),
              colors: ["#6366f1", "#ec4899", "#f59e0b", "#10b981"],
            });
          } catch {
            setBrandData({
              name: "Your Brand",
              description: "An innovative company pushing the boundaries of modern advertising.",
              logo: "Y",
              colors: ["#6366f1", "#ec4899", "#f59e0b", "#10b981"],
            });
          }
          setTimeout(() => setKnowledgePhase("brand-done"), 600);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [knowledgePhase, step, website]);

  // Auto-start product scraping after brand-done
  useEffect(() => {
    if (knowledgePhase === "brand-done") {
      const timer = setTimeout(() => setKnowledgePhase("product-scraping"), 1500);
      return () => clearTimeout(timer);
    }
  }, [knowledgePhase]);

  // Product scraping animation (10 seconds, 2s per step)
  useEffect(() => {
    if (step === 2 && knowledgePhase === "product-scraping") {
      setProductStepIndex(0);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setProductStepIndex(i);
        if (i >= productScrapeSteps.length) {
          clearInterval(interval);
          try {
            const hostname = new URL(website.startsWith("http") ? website : `https://${website}`).hostname;
            const name = hostname.replace(/^www\./, "").split(".")[0];
            setProductData({
              name: name.charAt(0).toUpperCase() + name.slice(1) + " Pro Plan",
              description: "Our flagship offering that combines AI-powered ad creation with performance analytics to deliver measurable results.",
              image: `https://picsum.photos/seed/${encodeURIComponent(website + "-product")}/400/400`,
            });
          } catch {
            setProductData({
              name: "Pro Plan",
              description: "Our flagship offering combining AI-powered ad creation with performance analytics.",
              image: `https://picsum.photos/seed/product/400/400`,
            });
          }
          setTimeout(() => setKnowledgePhase("complete"), 600);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [knowledgePhase, step, website]);

  // Step 3 (Launch) reveal animation
  useEffect(() => {
    if (step === 3) {
      setRevealedTopics([]);
      const timers = mockTopics.map((_, i) =>
        setTimeout(() => setRevealedTopics(prev => [...prev, i]), 400 + i * 250)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [step]);

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const startKnowledgeScrape = () => {
    setKnowledgePhase("brand-scraping");
  };

  // ─── Step 1: Goals ────────────────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto animate-scale-in">
        <div className="text-center">
          <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center mb-4 shadow-lg">
            <Target className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">What are you looking to achieve?</h2>
          <p className="text-muted-foreground mt-1">Select one or more goals. This helps us tailor your experience.</p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {goalCards.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id);
            const Icon = goal.icon;
            return (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`relative flex flex-col items-start gap-4 p-7 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${
                  isSelected ? "bg-primary/10" : "bg-accent"
                }`}>
                  <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="font-semibold">{goal.title}</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{goal.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Step 2: Knowledge (consolidated) ─────────────────────────────────────
  if (step === 2) {
    // Phase: URL input
    if (knowledgePhase === "url") {
      return (
        <div className="space-y-6 max-w-lg mx-auto animate-scale-in">
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center mb-4 shadow-lg">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">What are you selling?</h2>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              Paste the URL of the product, software, or service you want to build ad workflows for.
              <br />
              This could be a product page, a service landing page, or homepage.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                placeholder="https://acme.com/products/pro-plan"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                className="h-12 text-base"
              />
            </div>
            <TooltipProvider>
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <span>We start with one product or service to keep things simple.</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground/60" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>You can always add more products, services, or offers later from the Data Room.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
            <Button className="w-full h-11 shadow-sm" onClick={startKnowledgeScrape} disabled={!website.trim()}>
              Continue
            </Button>
          </div>
        </div>
      );
    }

    // Scraping phases (brand-scraping, brand-done, product-scraping, complete)
    const isBrandPhase = knowledgePhase === "brand-scraping" || knowledgePhase === "brand-done";
    const isProductPhase = knowledgePhase === "product-scraping";
    const isComplete = knowledgePhase === "complete";

    const currentTitle = isBrandPhase
      ? "Getting to know your brand..."
      : isProductPhase
        ? "Learning about what you sell..."
        : "Knowledge gathered ✨";

    const currentSteps = isBrandPhase ? brandScrapeSteps : productScrapeSteps;
    const currentStepIndex = isBrandPhase ? brandStepIndex : productStepIndex;

    const brandCardReady = knowledgePhase === "brand-done" || knowledgePhase === "product-scraping" || isComplete;
    const productCardReady = isComplete;

    return (
      <div className="space-y-8 max-w-3xl mx-auto animate-scale-in">
        {/* Top scraping rectangle */}
        {!isComplete ? (
          <Card className="overflow-hidden border-border/60">
            <div className="flex flex-col md:flex-row">
              {/* Left: Placeholder for landing page preview */}
              <div className="relative w-full md:w-[320px] shrink-0 bg-muted">
                <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/80 border-b border-border/40">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                  <span className="ml-2 text-[10px] text-muted-foreground truncate flex-1">
                    {isBrandPhase ? baseUrl : website.startsWith("http") ? website : `https://${website}`}
                  </span>
                </div>
                <div className="relative w-full aspect-[3/2] flex flex-col items-center justify-center gap-3 bg-muted/50 border-t border-border/20">
                  <Globe className="h-8 w-8 text-muted-foreground/40" />
                  <p className="text-xs text-muted-foreground/60 font-medium px-4 text-center">
                    {isBrandPhase ? "Landing page preview" : "Product page preview"}
                  </p>
                  <div className="absolute top-0 left-0 right-0 h-1 gradient-primary animate-[scan_2s_ease-in-out_infinite]" />
                </div>
              </div>

              {/* Right: Animated steps */}
              <div className="flex-1 p-6 flex flex-col justify-center">
                <div className="mb-6">
                  <h3 className="text-lg font-bold tracking-tight">{currentTitle}</h3>
                </div>

                <div className="space-y-3">
                  {currentSteps.map((s, i) => {
                    const StepIcon = s.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-sm transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                        style={{
                          opacity: i <= currentStepIndex ? 1 : 0.2,
                          transitionDelay: `${i * 100}ms`,
                          transform: i <= currentStepIndex ? "translateX(0)" : "translateX(-8px)",
                        }}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                          i < currentStepIndex ? "bg-emerald-100 dark:bg-emerald-900/30" : i === currentStepIndex ? "bg-primary/10" : "bg-muted"
                        }`}>
                          {i < currentStepIndex
                            ? <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            : i === currentStepIndex
                              ? <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                              : <StepIcon className="h-3.5 w-3.5 text-muted-foreground/40" />
                          }
                        </div>
                        <span className={
                          i < currentStepIndex ? "text-foreground font-medium" :
                          i === currentStepIndex ? "text-foreground" :
                          "text-muted-foreground"
                        }>{s.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="overflow-hidden border-border/40">
            <div className="px-5 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Check className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">Knowledge collected</p>
                <p className="text-xs text-muted-foreground">Brand profile & product data ready. Review below.</p>
              </div>
            </div>
          </Card>
        )}

        {/* Brand card or skeleton */}
        <div className="space-y-4">
          {/* Brand section */}
          {knowledgePhase === "brand-scraping" && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Brand Profile</p>
              <Card className="p-5">
                <div className="flex gap-5">
                  <div className="space-y-3 shrink-0">
                    <Skeleton className="w-16 h-16 rounded-xl" />
                    <div className="flex gap-1.5">
                      <Skeleton className="w-6 h-6 rounded-md" />
                      <Skeleton className="w-6 h-6 rounded-md" />
                      <Skeleton className="w-6 h-6 rounded-md" />
                      <Skeleton className="w-6 h-6 rounded-md" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {brandCardReady && (
            <div className="space-y-3 animate-scale-in">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Brand Profile</p>
              <Card
                className="p-5 cursor-pointer hover:shadow-md hover:border-primary/40 transition-all duration-200"
                onClick={() => setShowBrandModal(true)}
              >
                <div className="flex gap-5">
                  <div className="space-y-3 shrink-0">
                    <div className="w-28 h-20 rounded-xl border-2 border-border bg-muted flex flex-col items-center justify-center gap-1">
                      <Globe className="h-6 w-6 text-muted-foreground/40" />
                      <span className="text-[10px] text-muted-foreground/60 font-medium">Logo preview</span>
                    </div>
                    <div className="flex gap-1.5 relative" onClick={(e) => e.stopPropagation()}>
                      {brandData.colors.map((c, i) => (
                        <div key={i} className="relative">
                          <button
                            type="button"
                            className="w-6 h-6 rounded-md border shadow-sm hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 cursor-pointer"
                            style={{ backgroundColor: c }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenColorIndex(openColorIndex === i ? null : i);
                            }}
                          />
                          {openColorIndex === i && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setOpenColorIndex(null)} />
                              <div className="absolute bottom-full left-0 mb-2 z-50 w-56 rounded-md border bg-popover p-3 space-y-3 shadow-md animate-in fade-in-0 zoom-in-95">
                                <input
                                  type="color"
                                  value={c}
                                  onChange={(e) => {
                                    const newColors = [...brandData.colors];
                                    newColors[i] = e.target.value;
                                    setBrandData(prev => ({ ...prev, colors: newColors }));
                                  }}
                                  className="w-full h-32 rounded-lg cursor-pointer border-0 p-0 bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-0"
                                />
                                <div className="space-y-1.5">
                                  <label className="text-xs font-medium text-muted-foreground">HEX Color Code</label>
                                  <Input
                                    value={c}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (/^#[0-9a-fA-F]{0,6}$/.test(val) || val === "") {
                                        const newColors = [...brandData.colors];
                                        newColors[i] = val;
                                        setBrandData(prev => ({ ...prev, colors: newColors }));
                                      }
                                    }}
                                    className="h-9 font-mono text-sm"
                                    placeholder="#000000"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold">{brandData.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{brandData.description}</p>
                    <p className="text-xs text-primary mt-3 font-medium">Click to see full brand profile →</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Product section */}
          {(knowledgePhase === "product-scraping") && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Product / Service</p>
              <Card className="p-5">
                <div className="flex gap-5">
                  <Skeleton className="w-20 h-20 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {productCardReady && (
            <div className="space-y-3 animate-scale-in">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Product / Service</p>
              <Card
                className="p-5 cursor-pointer hover:shadow-md hover:border-primary/40 transition-all duration-200"
                onClick={() => setShowProductModal(true)}
              >
                <div className="flex gap-5">
                  <div className="shrink-0 space-y-2">
                    <div className="w-32 h-24 rounded-xl border border-border/60 bg-muted flex flex-col items-center justify-center gap-1">
                      <Package className="h-6 w-6 text-muted-foreground/40" />
                      <span className="text-[10px] text-muted-foreground/60 font-medium">Hero product image</span>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-10 h-10 rounded-lg border border-border/60 bg-muted flex items-center justify-center">
                        <span className="text-[8px] text-muted-foreground/50 font-medium">Img 2</span>
                      </div>
                      <div className="w-10 h-10 rounded-lg border border-border/60 bg-muted flex items-center justify-center">
                        <span className="text-[8px] text-muted-foreground/50 font-medium">Img 3</span>
                      </div>
                      <div className="w-10 h-10 rounded-lg border border-border/60 bg-muted flex items-center justify-center">
                        <span className="text-[9px] text-muted-foreground/50 font-bold">+4</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold">{productData.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{productData.description}</p>
                    <p className="text-xs text-primary mt-3 font-medium">Click to see full product details →</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Brand Detail Modal */}
        <Dialog open={showBrandModal} onOpenChange={setShowBrandModal}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border-2 border-border bg-muted flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{brandData.logo}</span>
                </div>
                {brandData.name} — Brand Profile
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Brand Colors</p>
                <div className="flex gap-2">
                  {brandData.colors.map((c, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 rounded-lg border shadow-sm" style={{ backgroundColor: c }} />
                      <span className="text-[10px] text-muted-foreground font-mono">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Description</p>
                <p className="text-sm text-foreground leading-relaxed">{brandData.description}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Tone of Voice</p>
                <p className="text-sm text-foreground leading-relaxed">Professional yet approachable, with a focus on clarity and impact.</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Target Audience</p>
                <p className="text-sm text-foreground leading-relaxed">Small-to-medium business marketing teams looking to scale ad creative without hiring designers.</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Unique Value Proposition</p>
                <p className="text-sm text-foreground leading-relaxed">AI-powered ad creation that delivers 10x faster creative output with zero design skills needed.</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Product Detail Modal */}
        <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Package className="h-5 w-5 text-primary" />
                {productData.name} — Product Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-2">
              {productData.image && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Product Image</p>
                  <div className="w-full max-w-xs rounded-xl overflow-hidden border border-border/60 shadow-sm">
                    <img src={productData.image} alt={productData.name} className="w-full aspect-square object-cover" />
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Description</p>
                <p className="text-sm text-foreground leading-relaxed">{productData.description}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Key Feature</p>
                <p className="text-sm text-foreground leading-relaxed">AI-powered creative generation with 10x faster output</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Price Point</p>
                <p className="text-sm text-foreground leading-relaxed">Starting at $49/mo</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Target Market</p>
                <p className="text-sm text-foreground leading-relaxed">Growth-stage DTC brands and SaaS companies looking to scale their paid social creative.</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ─── Step 3: Launch (Wow Moment) ──────────────────────────────────────────
  if (step === 3) {
    return (
      <div className="space-y-6 text-center animate-scale-in">
        <div className="py-4">
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="absolute inset-0 rounded-2xl bg-primary/20 scale-150 animate-glow" />
            <Sparkles className="relative h-12 w-12 text-primary animate-float" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Based on everything we know about your brand...</h2>
          <p className="text-muted-foreground mt-1">Here are 7 ad topics we think will crush it this week</p>
        </div>
        <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto text-left">
          {mockTopics.map((topic, i) => (
            <Card
              key={i}
              className={`p-4 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border-border/60 ${
                revealedTopics.includes(i)
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-4 scale-95"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-xs font-bold text-white">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{topic.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{topic.desc}</p>
                  <div className="flex gap-1.5 mt-2">
                    {topic.tags.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button className="p-1.5 rounded-full hover:bg-accent transition-colors"><ThumbsUp className="h-3.5 w-3.5 text-muted-foreground" /></button>
                  <button className="p-1.5 rounded-full hover:bg-accent transition-colors"><ThumbsDown className="h-3.5 w-3.5 text-muted-foreground" /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
