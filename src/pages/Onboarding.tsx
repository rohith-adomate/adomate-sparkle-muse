import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HoverExplainer } from "@/components/HoverExplainer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {
  Loader2, Globe, Sparkles, Link as LinkIcon,
  ThumbsUp, ThumbsDown, Facebook, BarChart3, Users, TrendingUp,
  Check, RefreshCw, Package, Plus, Trash2, Pencil,
} from "lucide-react";

const mockTopics = [
  { title: "Customer Success Story Spotlight", desc: "Showcase real results from your users. Social proof ads consistently outperform feature-focused ads by 2-3x.", tags: ["From website", "Industry trend"] },
  { title: "Problem-Agitation-Solution", desc: "Lead with the pain point your users face daily. This framework drives highest click-through rates.", tags: ["From website"] },
  { title: "Competitor Comparison", desc: "Position your unique advantages. Side-by-side ads perform well for consideration-stage prospects.", tags: ["Industry trend"] },
  { title: "Behind the Scenes", desc: "Show your team, culture, and process. Authenticity-driven content builds trust and brand affinity.", tags: ["From website"] },
  { title: "Feature Deep Dive", desc: "Highlight one specific feature that solves a pressing problem. Single-feature focus outperforms feature-list ads.", tags: ["From Meta data", "Industry trend"] },
  { title: "Limited Time Offer", desc: "Create urgency with a time-bound promotion. Urgency-driven CTAs see 30% higher conversion rates.", tags: ["From Meta data"] },
  { title: "User-Generated Content Style", desc: "Ads that look native to the platform. UGC-style creative outperforms polished ads by 2x on Meta.", tags: ["From Meta data", "Industry trend"] },
];

interface OnboardingProps {
  step: number;
  setStep: (step: number) => void;
  onScraping: (v: boolean) => void;
}

export function Onboarding({ step, setStep, onScraping }: OnboardingProps) {
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeProgress, setScrapeProgress] = useState(0);

  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [businessType, setBusinessType] = useState("dtc");

  const [brandDesc, setBrandDesc] = useState("");
  const [tone, setTone] = useState("");

  // Brand dynamic fields
  const [brandFields, setBrandFields] = useState<{ id: string; title: string; value: string }[]>([
    { id: "desc", title: "Description", value: "" },
    { id: "tone", title: "Tone of Voice", value: "" },
    { id: "mv1", title: "Marketing Valuable Field 1", value: "AI-powered ad creation that delivers 10x faster creative output with zero design skills needed." },
    { id: "mv2", title: "Marketing Valuable Field 2", value: "Small-to-medium business marketing teams looking to scale ad creative without hiring designers." },
  ]);
  const [editingBrandField, setEditingBrandField] = useState<string | null>(null);
  const [editBrandTitle, setEditBrandTitle] = useState("");
  const [showAddBrandField, setShowAddBrandField] = useState(false);
  const [newBrandFieldTitle, setNewBrandFieldTitle] = useState("");
  const [newBrandFieldValue, setNewBrandFieldValue] = useState("");
  const [deletingBrandField, setDeletingBrandField] = useState<string | null>(null);

  // Product state
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productImages, setProductImages] = useState<string[]>([]);
  const [productTerms, setProductTerms] = useState<{ key: string; value: string }[]>([
    { key: "Key Feature", value: "" },
    { key: "Price Point", value: "" },
  ]);
  const [productPhase, setProductPhase] = useState<"select" | "scraping" | "details">("select");
  const [selectedProductUrl, setSelectedProductUrl] = useState("");
  const [customProductUrl, setCustomProductUrl] = useState("");
  const [productScrapeProgress, setProductScrapeProgress] = useState(0);

  const [revealedTopics, setRevealedTopics] = useState<number[]>([]);

  const scrapeSteps = ["Extracting brand info...", "Detecting colors & fonts...", "Reading product pages...", "Analyzing tone of voice..."];
  const productScrapeSteps = ["Loading product page...", "Extracting images...", "Reading product details...", "Analyzing features..."];

  const baseUrl = (() => {
    try { return website ? new URL(website.startsWith("http") ? website : `https://${website}`).origin : ""; }
    catch { return ""; }
  })();
  const suggestedProductUrls = baseUrl ? [
    `${baseUrl}/products/pro-plan`,
    `${baseUrl}/products/starter-kit`,
  ] : [];

  const screenshotUrl = website
    ? `https://picsum.photos/seed/${encodeURIComponent(website)}/600/400`
    : null;

  useEffect(() => { onScraping(isScraping || (step === 3 && productPhase !== "details")); }, [isScraping, productPhase, step, onScraping]);

  // Handle Continue on Step 1 → scrape simulation
  useEffect(() => {
    if (step === 1 && isScraping) {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setScrapeProgress(i);
        if (i >= scrapeSteps.length) {
          clearInterval(interval);
          setTimeout(() => {
            try {
              const hostname = new URL(website.startsWith("http") ? website : `https://${website}`).hostname;
              const name = hostname.replace(/^www\./, "").split(".")[0];
              setCompanyName(name.charAt(0).toUpperCase() + name.slice(1));
            } catch {
              setCompanyName("Your Brand");
            }
            setBrandDesc("An innovative company pushing the boundaries of modern advertising.");
            setTone("Professional yet approachable, with a focus on clarity and impact.");
            setBrandFields(prev => prev.map(f =>
              f.id === "desc" ? { ...f, value: "An innovative company pushing the boundaries of modern advertising." } :
              f.id === "tone" ? { ...f, value: "Professional yet approachable, with a focus on clarity and impact." } : f
            ));
            setProductName("Pro Plan");
            setProductDesc("Our flagship offering that combines AI-powered ad creation with performance analytics to deliver measurable results.");
            setProductImages([
              `https://picsum.photos/seed/${encodeURIComponent(website + "-p1")}/400/400`,
              `https://picsum.photos/seed/${encodeURIComponent(website + "-p2")}/400/400`,
              `https://picsum.photos/seed/${encodeURIComponent(website + "-p3")}/400/400`,
            ]);
            setProductTerms([
              { key: "Key Feature", value: "AI-powered creative generation with 10x faster output" },
              { key: "Price Point", value: "Starting at $49/mo" },
            ]);
            // Detect business type from domain heuristic
            setBusinessType("saas");
            setIsScraping(false);
            setStep(2);
          }, 600);
        }
      }, 700);
      return () => clearInterval(interval);
    }
  }, [isScraping, step]);

  // Step 5 (Wow Moment) reveal
  useEffect(() => {
    if (step === 5) {
      setRevealedTopics([]);
      const timers = mockTopics.map((_, i) =>
        setTimeout(() => setRevealedTopics(prev => [...prev, i]), 400 + i * 250)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [step]);

  // Product scraping simulation
  useEffect(() => {
    if (step === 3 && productPhase === "scraping") {
      setProductScrapeProgress(0);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setProductScrapeProgress(i);
        if (i >= productScrapeSteps.length) {
          clearInterval(interval);
          setTimeout(() => {
            const urlToScrape = selectedProductUrl || customProductUrl;
            try {
              const urlObj = new URL(urlToScrape.startsWith("http") ? urlToScrape : `https://${urlToScrape}`);
              const segments = urlObj.pathname.split("/").filter(Boolean);
              const rawName = segments[segments.length - 1] || "Pro Plan";
              setProductName(rawName.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase()));
            } catch {
              setProductName("Pro Plan");
            }
            setProductDesc("Our flagship offering that combines AI-powered ad creation with performance analytics to deliver measurable results.");
            setProductImages([
              `https://picsum.photos/seed/${encodeURIComponent(selectedProductUrl || customProductUrl + "-p1")}/400/400`,
              `https://picsum.photos/seed/${encodeURIComponent(selectedProductUrl || customProductUrl + "-p2")}/400/400`,
              `https://picsum.photos/seed/${encodeURIComponent(selectedProductUrl || customProductUrl + "-p3")}/400/400`,
            ]);
            setProductTerms([
              { key: "Key Feature", value: "AI-powered creative generation with 10x faster output" },
              { key: "Price Point", value: "Starting at $49/mo" },
            ]);
            setProductPhase("details");
          }, 600);
        }
      }, 700);
      return () => clearInterval(interval);
    }
  }, [step, productPhase]);

  const startScrape = () => {
    setScrapeProgress(0);
    setIsScraping(true);
  };

  const startProductScrape = (url: string) => {
    setSelectedProductUrl(url);
    setProductPhase("scraping");
  };

  // ─── Step 1: Website URL only ─────────────────────────────────────────────
  if (step === 1) {
    if (isScraping) {
      return (
        <div className="flex flex-col items-center gap-8 py-12 max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 w-full">
            {screenshotUrl && (
              <div className="relative w-full max-w-[320px] shrink-0">
                <div className="rounded-xl overflow-hidden border border-border/60 shadow-xl bg-muted">
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/80 border-b border-border/40">
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                    <span className="ml-2 text-[10px] text-muted-foreground truncate flex-1">{website}</span>
                  </div>
                  <img src={screenshotUrl} alt="Website preview" className="w-full aspect-[3/2] object-cover" />
                </div>
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10 animate-pulse" />
                  <div className="absolute top-0 left-0 right-0 h-1 gradient-primary animate-[scan_2s_ease-in-out_infinite]" />
                </div>
              </div>
            )}
            <div className="flex flex-col items-center md:items-start gap-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 scale-150 animate-glow" />
                <div className="relative h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shadow-xl animate-float">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                </div>
              </div>
              <div className="text-center md:text-left space-y-1">
                <p className="text-xl font-bold tracking-tight">Analyzing your website...</p>
                <p className="text-sm text-muted-foreground">We're reading your brand to pre-fill your setup</p>
              </div>
              <div className="space-y-3 w-full max-w-xs">
                {scrapeSteps.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{
                      opacity: i <= scrapeProgress ? 1 : 0.2,
                      transitionDelay: `${i * 150}ms`,
                      transform: i <= scrapeProgress ? "translateX(0)" : "translateX(-8px)",
                    }}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      i < scrapeProgress ? "bg-emerald-100" : i === scrapeProgress ? "bg-primary/10" : "bg-muted"
                    }`}>
                      {i < scrapeProgress
                        ? <Check className="h-3.5 w-3.5 text-emerald-600" />
                        : i === scrapeProgress
                          ? <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                          : <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                      }
                    </div>
                    <span className={i < scrapeProgress ? "text-foreground font-medium" : i === scrapeProgress ? "text-foreground" : "text-muted-foreground"}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-5 max-w-lg mx-auto animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center mb-4 shadow-lg">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome to Adomate</h2>
          <p className="text-muted-foreground mt-1">Enter your website and we'll do the rest</p>
        </div>
        <HoverExplainer text="Step 1 collects the website URL. On submit, POST /api/onboarding/scrape { url }. Backend uses Firecrawl to scrape website and LLM to extract brand data.">
          <div className="space-y-4">
            <div>
              <Label>Website URL</Label>
              <Input placeholder="https://acme.com" value={website} onChange={e => setWebsite(e.target.value)} className="mt-1.5" />
            </div>
            <Button className="w-full mt-2 shadow-sm" onClick={startScrape} disabled={!website.trim()}>
              Continue
            </Button>
          </div>
        </HoverExplainer>
      </div>
    );
  }

  // ─── Step 2: Brand ────────────────────────────────────────────────────────
  if (step === 2) {
    const openEditBrandTitle = (fieldId: string) => {
      const field = brandFields.find(f => f.id === fieldId);
      if (field) { setEditBrandTitle(field.title); setEditingBrandField(fieldId); }
    };
    const saveEditBrandTitle = () => {
      if (editingBrandField && editBrandTitle.trim()) {
        setBrandFields(prev => prev.map(f => f.id === editingBrandField ? { ...f, title: editBrandTitle.trim() } : f));
        setEditingBrandField(null);
      }
    };
    const addBrandField = () => {
      if (newBrandFieldTitle.trim()) {
        setBrandFields(prev => [...prev, { id: `custom-${Date.now()}`, title: newBrandFieldTitle.trim(), value: newBrandFieldValue }]);
        setNewBrandFieldTitle(""); setNewBrandFieldValue(""); setShowAddBrandField(false);
      }
    };
    const confirmDeleteBrandField = () => {
      if (deletingBrandField) {
        setBrandFields(prev => prev.filter(f => f.id !== deletingBrandField));
        setDeletingBrandField(null);
      }
    };

    return (
      <div className="space-y-6 animate-scale-in">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold tracking-tight">Brand</h2>
          <p className="text-muted-foreground mt-1">We found this from your website — edit anything that's off</p>
        </div>
        <HoverExplainer text="Step 2 displays scraped results. All answers saved to brand_knowledge table via PUT /api/onboarding/brand-knowledge.">
          <div className="space-y-5">
            {/* Logo + Colors + Brand Name + Business Type */}
            <div className="flex gap-6 items-start">
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-2xl border-2 border-border bg-muted flex items-center justify-center overflow-hidden shadow-sm">
                    <span className="text-2xl font-bold text-primary">{companyName.charAt(0) || "A"}</span>
                  </div>
                  <label className="absolute inset-0 rounded-2xl bg-foreground/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <RefreshCw className="h-5 w-5 text-white" />
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </div>
                <div className="flex gap-1.5">
                  {["#6366f1", "#ec4899", "#f59e0b", "#10b981"].map(c => (
                    <div key={c} className="w-6 h-6 rounded-md border cursor-pointer hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Brand Name</Label>
                    <Input className="mt-1.5" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                  </div>
                  <div>
                    <Label>Business Type</Label>
                    <Select value={businessType} onValueChange={setBusinessType}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="service">Service Business</SelectItem>
                        <SelectItem value="dtc">DTC Brand</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic brand fields with editable titles */}
            {brandFields.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <div className="flex items-center gap-1.5 group">
                  <Label>{field.title}</Label>
                  <button
                    onClick={() => openEditBrandTitle(field.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-accent"
                    aria-label={`Edit ${field.title} title`}
                  >
                    <Pencil className="h-3 w-3 text-muted-foreground" />
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={() => setDeletingBrandField(field.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10"
                    aria-label={`Delete ${field.title}`}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive/70" />
                  </button>
                </div>
                <Textarea
                  value={field.value}
                  onChange={e => setBrandFields(prev => prev.map(f => f.id === field.id ? { ...f, value: e.target.value } : f))}
                  rows={2}
                />
              </div>
            ))}

            {/* Add field button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setShowAddBrandField(true)}
                className="h-8 w-8 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-primary hover:text-primary transition-colors text-muted-foreground"
                aria-label="Add new brand field"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </HoverExplainer>

        {/* Edit Title Dialog */}
        <Dialog open={!!editingBrandField} onOpenChange={(open) => !open && setEditingBrandField(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Edit Field Title</DialogTitle></DialogHeader>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={editBrandTitle} onChange={e => setEditBrandTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && saveEditBrandTitle()} autoFocus />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingBrandField(null)}>Cancel</Button>
              <Button onClick={saveEditBrandTitle}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Field Dialog */}
        <Dialog open={showAddBrandField} onOpenChange={setShowAddBrandField}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Add Knowledge Field</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={newBrandFieldTitle} onChange={e => setNewBrandFieldTitle(e.target.value)} placeholder="e.g. Target Audience" autoFocus />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea value={newBrandFieldValue} onChange={e => setNewBrandFieldValue(e.target.value)} placeholder="Describe this aspect of your brand..." rows={4} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddBrandField(false)}>Cancel</Button>
              <Button onClick={addBrandField} disabled={!newBrandFieldTitle.trim()}>Add Field</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm Dialog */}
        <AlertDialog open={!!deletingBrandField} onOpenChange={(open) => !open && setDeletingBrandField(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete field?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently remove "{brandFields.find(f => f.id === deletingBrandField)?.title}" from your brand knowledge.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteBrandField}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // ─── Step 3: Product ──────────────────────────────────────────────────────
  if (step === 3) {
    const addTerm = () => setProductTerms(prev => [...prev, { key: "", value: "" }]);
    const removeTerm = (idx: number) => setProductTerms(prev => prev.filter((_, i) => i !== idx));
    const updateTerm = (idx: number, field: "key" | "value", val: string) =>
      setProductTerms(prev => prev.map((t, i) => i === idx ? { ...t, [field]: val } : t));

    // Phase: Select product URL
    if (productPhase === "select") {
      return (
        <div className="space-y-8 animate-scale-in flex flex-col items-center">
          <div className="text-center">
            <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center mb-4 shadow-lg">
              <Package className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Which {businessType === "service" ? "service" : businessType === "saas" ? "solution" : "product"} should we onboard?</h2>
            <p className="text-muted-foreground mt-1">We found these on your website — pick one to generate ads for</p>
          </div>

          {/* Suggested URLs */}
          <div className="w-full max-w-lg space-y-3">
            {suggestedProductUrls.map((url, i) => (
              <button
                key={i}
                onClick={() => startProductScrape(url)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-primary hover:bg-accent/50 ${
                  selectedProductUrl === url ? "border-primary bg-accent/50" : "border-border"
                }`}
              >
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <LinkIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{url}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Detected from your homepage</p>
                </div>
              </button>
            ))}
          </div>

          {/* OR divider */}
          <div className="flex items-center gap-4 w-full max-w-lg">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm font-semibold text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Custom URL */}
          <div className="w-full max-w-lg space-y-3">
            <Label>Enter a different product URL</Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://yoursite.com/products/my-product"
                value={customProductUrl}
                onChange={e => setCustomProductUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={() => startProductScrape(customProductUrl)}
                disabled={!customProductUrl.trim()}
              >
                Scrape
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Phase: Scraping animation
    if (productPhase === "scraping") {
      const scrapingUrl = selectedProductUrl || customProductUrl;
      const screenshotSeed = encodeURIComponent(scrapingUrl);
      return (
        <div className="flex flex-col items-center gap-8 py-12 max-w-2xl mx-auto animate-scale-in">
          <div className="flex flex-col md:flex-row items-center gap-8 w-full">
            <div className="relative w-full max-w-[320px] shrink-0">
              <div className="rounded-xl overflow-hidden border border-border/60 shadow-xl bg-muted">
                <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/80 border-b border-border/40">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                  <span className="ml-2 text-[10px] text-muted-foreground truncate flex-1">{scrapingUrl}</span>
                </div>
                <img src={`https://picsum.photos/seed/${screenshotSeed}/600/400`} alt="Product page preview" className="w-full aspect-[3/2] object-cover" />
              </div>
              <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10 animate-pulse" />
                <div className="absolute top-0 left-0 right-0 h-1 gradient-primary animate-[scan_2s_ease-in-out_infinite]" />
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start gap-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 scale-150 animate-glow" />
                <div className="relative h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shadow-xl animate-float">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                </div>
              </div>
              <div className="text-center md:text-left space-y-1">
                <p className="text-xl font-bold tracking-tight">Scraping product page...</p>
                <p className="text-sm text-muted-foreground">Extracting images, details & features</p>
              </div>
              <div className="space-y-3 w-full max-w-xs">
                {productScrapeSteps.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{
                      opacity: i <= productScrapeProgress ? 1 : 0.2,
                      transitionDelay: `${i * 150}ms`,
                      transform: i <= productScrapeProgress ? "translateX(0)" : "translateX(-8px)",
                    }}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      i < productScrapeProgress ? "bg-emerald-100" : i === productScrapeProgress ? "bg-primary/10" : "bg-muted"
                    }`}>
                      {i < productScrapeProgress
                        ? <Check className="h-3.5 w-3.5 text-emerald-600" />
                        : i === productScrapeProgress
                          ? <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                          : <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                      }
                    </div>
                    <span className={i < productScrapeProgress ? "text-foreground font-medium" : i === productScrapeProgress ? "text-foreground" : "text-muted-foreground"}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Phase: Details (after scraping)
    return (
      <div className="space-y-6 animate-scale-in">
        <div className="text-center mb-4">
          <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center mb-4 shadow-lg">
            <Package className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Hero Product</h2>
          <p className="text-muted-foreground mt-1">We found your most prominent {businessType === "service" ? "service" : businessType === "saas" ? "solution" : "product"} — refine the details</p>
        </div>
        <HoverExplainer text="Step 3 displays the hero product scraped from the website. Backend uses Firecrawl to find the most referenced product URL from the homepage, then scrapes that page for images and details.">
          <div className="space-y-5">
            <div>
              <Label>Product Name</Label>
              <Input className="mt-1.5" value={productName} onChange={e => setProductName(e.target.value)} />
            </div>
            <div>
              <Label>Product Images</Label>
              <p className="text-xs text-muted-foreground mt-0.5 mb-2">Scraped from the product page — click to remove, drag to reorder</p>
              <div className="flex gap-3 flex-wrap">
                {productImages.map((img, i) => (
                  <div key={i} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-border/60 shadow-sm">
                    <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => setProductImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute inset-0 bg-foreground/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 rounded-xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary/40 hover:bg-accent/30 transition-colors">
                  <Plus className="h-5 w-5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Add</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setProductImages(prev => [...prev, url]);
                    }
                  }} />
                </label>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea className="mt-1.5" value={productDesc} onChange={e => setProductDesc(e.target.value)} rows={3} />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Product Knowledge</Label>
                <Button variant="ghost" size="sm" onClick={addTerm} className="gap-1 text-xs text-muted-foreground h-7">
                  <Plus className="h-3.5 w-3.5" /> Add field
                </Button>
              </div>
              <div className="space-y-3">
                {productTerms.map((term, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="flex-1 space-y-1.5">
                      <Input
                        value={term.key}
                        onChange={e => updateTerm(i, "key", e.target.value)}
                        placeholder="Field name"
                        className="text-xs font-semibold bg-muted/50 border-border/60"
                      />
                      <Textarea
                        value={term.value}
                        onChange={e => updateTerm(i, "value", e.target.value)}
                        placeholder="Value..."
                        rows={2}
                        className="text-sm"
                      />
                    </div>
                    {productTerms.length > 1 && (
                      <button onClick={() => removeTerm(i)} className="mt-2 p-1.5 rounded-md hover:bg-accent transition-colors">
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </HoverExplainer>
      </div>
    );
  }

  // ─── Step 4: Connect Meta ─────────────────────────────────────────────────
  if (step === 4) {
    return (
      <div className="flex flex-col items-center gap-8 py-4 animate-scale-in">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Connect your Meta Ad Account</h2>
          <p className="text-muted-foreground mt-1">Supercharge your AI ads with real performance data</p>
        </div>
        <HoverExplainer text="Step 4 initiates Meta OAuth. Backend: GET /api/auth/meta/connect. On callback, store access_token, ad_account_id in meta_integrations.">
          <div className="grid grid-cols-3 gap-4 max-w-xl">
            {[
              { icon: BarChart3, title: "Import best-performing ads", desc: "We analyze what already works for your brand" },
              { icon: Users, title: "Audience insights", desc: "Understand who engages with your content" },
              { icon: TrendingUp, title: "Performance benchmarks", desc: "Compare AI ads against your history" },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="p-4 text-center card-hover border-border/60">
                <div className="mx-auto mb-3 w-11 h-11 rounded-xl bg-accent flex items-center justify-center shadow-sm">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-muted-foreground mt-1">{desc}</p>
              </Card>
            ))}
          </div>
        </HoverExplainer>
        <Button className="gap-2 px-8 shadow-sm" size="lg"><Facebook className="h-5 w-5" /> Connect with Meta</Button>
        <p className="text-xs text-muted-foreground">You can always connect later from Brand Data Room → Meta Integration</p>
      </div>
    );
  }

  // ─── Step 5: Wow Moment ───────────────────────────────────────────────────
  if (step === 5) {
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
        <HoverExplainer text="Step 5 displays LLM-generated topics. Backend async job calls POST /api/ai/generate-topics.">
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
        </HoverExplainer>
      </div>
    );
  }

  return null;
}
