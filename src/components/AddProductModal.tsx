import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Globe, Sparkles, Package, Trash2, Pencil, Upload, Star,
  Loader2, Check, Eye, ShoppingBag, Search, TrendingUp, Brain, Info,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { KnowledgeFieldsSection, type KnowledgeField } from "@/components/KnowledgeFieldsSection";

const productScrapeSteps = [
  { icon: Eye, text: "Analyzing your product page..." },
  { icon: ShoppingBag, text: "Extracting product details & pricing..." },
  { icon: Search, text: "Researching your market & competitors..." },
  { icon: TrendingUp, text: "Identifying key selling points..." },
  { icon: Brain, text: "Crafting your product positioning..." },
];

const MAX_IMAGE_SIZE_MB = 25;
const ACCEPTED_IMAGE_TYPES = ".png,.jpg,.jpeg,.webp";

// KnowledgeField type imported from shared component

interface ProductImage {
  id: string;
  name: string;
  url: string;
  isHero: boolean;
}

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ScrapePhase = "idle" | "scraping" | "done";

function InfoTooltip({ text }: { text: string }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground cursor-help transition-colors" />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[240px] text-xs">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function AddProductModal({ open, onOpenChange }: AddProductModalProps) {
  const [activeTab, setActiveTab] = useState<"auto" | "manual">("auto");
  const [url, setUrl] = useState("");
  const [scrapePhase, setScrapePhase] = useState<ScrapePhase>("idle");
  const [stepIndex, setStepIndex] = useState(0);

  // Product data (shared between auto result & manual)
  const [productName, setProductName] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [images, setImages] = useState<ProductImage[]>([]);
  const [knowledgeFields, setKnowledgeFields] = useState<KnowledgeField[]>([
    { id: "description", title: "Description", value: "" },
    { id: "key-features", title: "Key Features", value: "" },
    { id: "pricing", title: "Pricing", value: "" },
    { id: "target-market", title: "Target Market", value: "" },
    { id: "selling-points", title: "Unique Selling Points", value: "" },
  ]);

  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setActiveTab("auto");
        setUrl("");
        setScrapePhase("idle");
        setStepIndex(0);
        setProductName("");
        setProductUrl("");
        setImages([]);
        setKnowledgeFields([
          { id: "description", title: "Description", value: "" },
          { id: "key-features", title: "Key Features", value: "" },
          { id: "pricing", title: "Pricing", value: "" },
          { id: "target-market", title: "Target Market", value: "" },
          { id: "selling-points", title: "Unique Selling Points", value: "" },
        ]);
        setEditingFieldId(null);
      }, 300);
    }
  }, [open]);

  // Scraping animation (10 seconds, 2s per step)
  useEffect(() => {
    if (scrapePhase !== "scraping") return;
    setStepIndex(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setStepIndex(i);
      if (i >= productScrapeSteps.length) {
        clearInterval(interval);
        // Populate mock data
        try {
          const hostname = new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
          const name = hostname.replace(/^www\./, "").split(".")[0];
          const capName = name.charAt(0).toUpperCase() + name.slice(1);
          setProductName(capName + " Pro Plan");
          setProductUrl(url.startsWith("http") ? url : `https://${url}`);
          setImages([{
            id: crypto.randomUUID(),
            name: "product-hero.jpg",
            url: `https://picsum.photos/seed/${encodeURIComponent(url)}/400/400`,
            isHero: true,
          }]);
          setKnowledgeFields([
            { id: "description", title: "Description", value: "Our flagship offering that combines AI-powered ad creation with performance analytics to deliver measurable results." },
            { id: "key-features", title: "Key Features", value: "- AI-powered creative generation with 10x faster output\n- Performance analytics dashboard\n- Multi-channel campaign management" },
            { id: "pricing", title: "Pricing", value: "Starting at **$49/mo** for growth teams" },
            { id: "target-market", title: "Target Market", value: "Growth-stage DTC brands and SaaS companies looking to scale their paid social creative." },
            { id: "selling-points", title: "Unique Selling Points", value: "- Fastest time-to-launch in the market\n- Data-driven creative optimization\n- Enterprise-grade security" },
          ]);
        } catch {
          setProductName("New Product");
          setProductUrl(url);
        }
        setTimeout(() => setScrapePhase("done"), 600);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [scrapePhase, url]);

  const startScrape = () => {
    if (!url.trim()) return;
    setScrapePhase("scraping");
  };

  const tabLocked = scrapePhase === "scraping" || scrapePhase === "done";

  // ─── Field helpers ───
  const updateFieldValue = (id: string, value: string) => {
    setKnowledgeFields(prev => prev.map(f => f.id === id ? { ...f, value } : f));
  };
  const updateFieldTitle = (id: string, title: string) => {
    setKnowledgeFields(prev => prev.map(f => f.id === id ? { ...f, title } : f));
    setEditingFieldId(null);
  };
  const deleteField = (id: string) => {
    setKnowledgeFields(prev => prev.filter(f => f.id !== id));
  };
  const addField = () => {
    setKnowledgeFields(prev => [...prev, { id: crypto.randomUUID(), title: "New Field", value: "" }]);
  };
  const startEditTitle = (id: string) => {
    const field = knowledgeFields.find(f => f.id === id);
    if (field) {
      setEditingFieldId(id);
      setEditingTitle(field.title);
    }
  };

  // ─── Image helpers ───
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const toAdd = Array.from(files).filter(f => f.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024);
    const newImages: ProductImage[] = toAdd.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      url: URL.createObjectURL(file),
      isHero: images.length === 0,
    }));
    setImages(prev => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const setHeroImage = (id: string) => {
    setImages(prev => prev.map(img => ({ ...img, isHero: img.id === id })));
  };
  const deleteImage = (id: string) => {
    if (images.length <= 1) return;
    setImages(prev => {
      const remaining = prev.filter(img => img.id !== id);
      if (!remaining.some(img => img.isHero) && remaining.length > 0) {
        remaining[0].isHero = true;
      }
      return remaining;
    });
  };

  // ─── Determine what to render ───
  const showForm = activeTab === "manual" || (activeTab === "auto" && scrapePhase === "done");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="h-10 w-10 rounded-xl border-2 border-border bg-muted flex items-center justify-center">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
            Add Product
          </DialogTitle>
        </DialogHeader>

        {/* ─── Pill Toggle ─── */}
        <div className="flex justify-center px-6 pt-4 pb-2">
          <div className="inline-flex items-center rounded-full border border-border bg-muted/50 p-0.5">
            <button
              onClick={() => !tabLocked && setActiveTab("auto")}
              disabled={tabLocked}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === "auto"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : tabLocked
                    ? "text-muted-foreground/40 cursor-not-allowed"
                    : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Auto
            </button>
            <button
              onClick={() => !tabLocked && setActiveTab("manual")}
              disabled={tabLocked}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === "manual"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : tabLocked
                    ? "text-muted-foreground/40 cursor-not-allowed"
                    : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Pencil className="h-3.5 w-3.5" />
              Manual
            </button>
          </div>
        </div>

        <ScrollArea className="max-h-[calc(90vh-140px)]">
          {/* ─── AUTO: URL Input ─── */}
          {activeTab === "auto" && scrapePhase === "idle" && (
            <div className="px-6 py-8 space-y-6 max-w-lg mx-auto animate-scale-in">
              <div className="text-center mb-2">
                <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center mb-4 shadow-lg">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">What are you selling?</h2>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Paste the URL of the product or service you want to add.
                  <br />
                  We'll automatically extract all the relevant information.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="https://acme.com/products/pro-plan"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="h-12 text-base"
                  onKeyDown={e => { if (e.key === "Enter") startScrape(); }}
                />
                <Button className="w-full h-11 shadow-sm" onClick={startScrape} disabled={!url.trim()}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* ─── AUTO: Scraping Animation ─── */}
          {activeTab === "auto" && scrapePhase === "scraping" && (
            <div className="px-6 py-8 max-w-3xl mx-auto animate-scale-in">
              <Card className="overflow-hidden border-border/60">
                <div className="flex flex-col md:flex-row">
                  {/* Left: Page preview placeholder */}
                  <div className="relative w-full md:w-[320px] shrink-0 bg-muted">
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/80 border-b border-border/40">
                      <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                      <span className="ml-2 text-[10px] text-muted-foreground truncate flex-1">
                        {url.startsWith("http") ? url : `https://${url}`}
                      </span>
                    </div>
                    <div className="relative w-full aspect-[3/2] flex flex-col items-center justify-center gap-3 bg-muted/50 border-t border-border/20">
                      <Globe className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-xs text-muted-foreground/60 font-medium px-4 text-center">
                        Product page preview
                      </p>
                      <div className="absolute top-0 left-0 right-0 h-1 gradient-primary animate-[scan_2s_ease-in-out_infinite]" />
                    </div>
                  </div>

                  {/* Right: Animated steps */}
                  <div className="flex-1 p-6 flex flex-col justify-center">
                    <div className="mb-6">
                      <h3 className="text-lg font-bold tracking-tight">Learning about your product...</h3>
                    </div>
                    <div className="space-y-3">
                      {productScrapeSteps.map((s, i) => {
                        const StepIcon = s.icon;
                        return (
                          <div
                            key={i}
                            className="flex items-center gap-3 text-sm transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                            style={{
                              opacity: i <= stepIndex ? 1 : 0.2,
                              transitionDelay: `${i * 100}ms`,
                              transform: i <= stepIndex ? "translateX(0)" : "translateX(-8px)",
                            }}
                          >
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                              i < stepIndex ? "bg-emerald-100 dark:bg-emerald-900/30" : i === stepIndex ? "bg-primary/10" : "bg-muted"
                            }`}>
                              {i < stepIndex
                                ? <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                : i === stepIndex
                                  ? <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                                  : <StepIcon className="h-3.5 w-3.5 text-muted-foreground/40" />
                              }
                            </div>
                            <span className={
                              i < stepIndex ? "text-foreground font-medium" :
                              i === stepIndex ? "text-foreground" :
                              "text-muted-foreground"
                            }>{s.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Skeleton preview */}
              <div className="mt-6 space-y-3 animate-fade-in">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Product Profile</p>
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
            </div>
          )}

          {/* ─── FORM (Manual or Auto-done) ─── */}
          {showForm && (
            <div className="flex flex-col lg:flex-row gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border animate-scale-in">
              {/* ═══ LEFT: Product Images ═══ */}
              <div className="lg:w-[380px] shrink-0 p-6 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Label className="text-sm font-semibold">Product Images</Label>
                      <InfoTooltip text="Upload product photos used in ad creative. The starred image is the hero image shown as the primary visual." />
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {images.length} files · ★ = Hero
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {images.map((img) => (
                      <div
                        key={img.id}
                        className="group relative aspect-square rounded-xl border-2 border-border bg-muted/50 flex items-center justify-center overflow-hidden"
                      >
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        {img.isHero && (
                          <div className="absolute top-2 left-2">
                            <Star className="h-5 w-5 fill-warning text-warning" />
                          </div>
                        )}
                        {!img.isHero && (
                          <button
                            type="button"
                            onClick={() => setHeroImage(img.id)}
                            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Set as hero image"
                          >
                            <Star className="h-5 w-5 text-muted-foreground hover:text-warning transition-colors" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteImage(img.id)}
                          className={`absolute top-2 right-2 p-1 rounded bg-background/80 border border-border opacity-0 group-hover:opacity-100 transition-opacity ${
                            images.length <= 1 ? "cursor-not-allowed text-muted-foreground/40" : "text-muted-foreground hover:text-destructive"
                          }`}
                          disabled={images.length <= 1}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-[11px] font-medium text-muted-foreground">Upload image(s)</p>
                        <p className="text-[9px] text-muted-foreground/70">(PNG, JPEG, WEBP)</p>
                        <p className="text-[9px] text-muted-foreground/70">Max {MAX_IMAGE_SIZE_MB}MB per file</p>
                      </div>
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES}
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* ═══ RIGHT: Knowledge ═══ */}
              <div className="flex-1 p-6 space-y-5">
                {/* Product Name */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5" /> Product Name
                  </Label>
                  <Input
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Hydra Glow Serum"
                  />
                </div>

                {/* Product URL */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" /> Product URL
                    <InfoTooltip text="The direct link to this product or service page." />
                  </Label>
                  <Input
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    placeholder="https://example.com/product"
                  />
                </div>

                <div className="border-t border-border" />

                {/* Knowledge Fields */}
                <div className="space-y-4">
                  {knowledgeFields.map((field) => (
                    <div key={field.id} className="space-y-1.5">
                      <div className="flex items-center justify-between group">
                        {editingFieldId === field.id ? (
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={() => updateFieldTitle(field.id, editingTitle)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") updateFieldTitle(field.id, editingTitle);
                              if (e.key === "Escape") setEditingFieldId(null);
                            }}
                            className="h-7 text-sm font-semibold w-48"
                            autoFocus
                          />
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <Label className="text-sm font-semibold">{field.title}</Label>
                            <button
                              type="button"
                              onClick={() => startEditTitle(field.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Pencil className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                          onClick={() => deleteField(field.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <MarkdownEditor
                        value={field.value}
                        onChange={(val) => updateFieldValue(field.id, val)}
                      />
                    </div>
                  ))}

                  <Button variant="outline" size="sm" className="gap-1.5 w-full" onClick={addField}>
                    <Plus className="h-3.5 w-3.5" /> Add Knowledge Field
                  </Button>
                </div>

                {/* Save button */}
                <div className="pt-4 border-t border-border">
                  <Button className="w-full shadow-sm" onClick={() => onOpenChange(false)}>
                    Save Product
                  </Button>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
