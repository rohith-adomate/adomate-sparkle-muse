import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sparkles, Plus, X, Check, RefreshCw, Image, Brain } from "lucide-react";

const MOCK_LOGOS = [
  { id: "logo-1", name: "Primary Logo", url: "/placeholder.svg" },
  { id: "logo-2", name: "Icon Mark", url: "/placeholder.svg" },
  { id: "logo-3", name: "Wordmark", url: "/placeholder.svg" },
];

const MOCK_VISUALS = [
  { id: "vis-1", name: "Hero Banner", url: "/placeholder.svg" },
  { id: "vis-2", name: "Summer Campaign Lifestyle Photography 2025", url: "/placeholder.svg" },
  { id: "vis-3", name: "Lifestyle Shot 2", url: "/placeholder.svg" },
  { id: "vis-4", name: "Product Scene", url: "/placeholder.svg" },
  { id: "vis-5", name: "Brand Guidelines Background Texture Collection", url: "/placeholder.svg" },
];

interface GenerateConceptsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GenerateConceptsDrawer({ open, onOpenChange }: GenerateConceptsDrawerProps) {
  const [prompt, setPrompt] = useState(
    "Generate modern, scroll-stopping ad creatives for social media. Use bold visuals with clean typography. Incorporate the brand colors and product imagery. Each concept should have a distinct visual style — try lifestyle, minimalist, and UGC-inspired approaches."
  );
  const [numConcepts, setNumConcepts] = useState("6");
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [selectedVisuals, setSelectedVisuals] = useState<string[]>([]);
  const [logoPopoverOpen, setLogoPopoverOpen] = useState(false);
  const [visualsPopoverOpen, setVisualsPopoverOpen] = useState(false);
  const [brandBrainActive, setBrandBrainActive] = useState(true);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);

  const selectedLogoData = MOCK_LOGOS.find((l) => l.id === selectedLogo);

  const toggleVisual = (id: string) => {
    setSelectedVisuals((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleBrandBrainClick = () => {
    if (brandBrainActive) {
      setShowDeactivateDialog(true);
    } else {
      setBrandBrainActive(true);
    }
  };

  return (
    <TooltipProvider>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[380px] sm:w-[420px] overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-base">Generate Ad Variations — Settings</SheetTitle>
          </SheetHeader>

          {/* Brand Brain Indicator */}
          <div className="mb-6 flex justify-center">
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <button
                  onClick={handleBrandBrainClick}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-colors ${
                    brandBrainActive
                      ? "border-primary/20 bg-primary/5"
                      : "border-border bg-muted/30"
                  }`}
                >
                  <Brain className={`h-4 w-4 ${brandBrainActive ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-xs font-medium ${brandBrainActive ? "text-primary" : "text-muted-foreground"}`}>
                    {brandBrainActive ? "Brand Brain active" : "Brand Brain inactive"}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[280px] p-3 text-xs leading-relaxed">
                <p className="font-semibold mb-1.5">
                  {brandBrainActive ? "Brand Knowledge is always on" : "Brand Knowledge is disabled"}
                </p>
                <p className="text-muted-foreground">
                  {brandBrainActive
                    ? "Your brand's description, tone of voice, positioning, visual style, and colors are automatically inserted by the agent at the right point in the generation process. No manual configuration needed."
                    : "Brand knowledge is currently disabled. Click to re-enable and improve brand compliance of generated concepts."}
                </p>
                <p className="mt-1.5 text-muted-foreground">
                  Manage in{" "}
                  <a href="/brand-data-room/knowledge" className="text-primary underline underline-offset-2 hover:text-primary/80">
                    Data Room → Brand Knowledge
                  </a>
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Prompt */}
          <div className="space-y-2 mb-6">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Image generation prompt
            </Label>
            <div className="relative">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={8}
                className="text-sm resize-none pr-8"
                placeholder="Describe how the AI should generate your ad concepts…"
              />
              <Sparkles className="absolute top-2.5 right-2.5 h-3.5 w-3.5 text-muted-foreground/50" />
            </div>
            <p className="text-[10px] text-muted-foreground">
              This prompt is combined with your brand knowledge, product data, and competitor insights to generate variations.
            </p>
          </div>

          <Separator className="mb-6" />

          {/* Number of concepts */}
          <div className="space-y-2 mb-6">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Number of variations
            </Label>
            <Input
              type="number"
              min="1"
              max="20"
              value={numConcepts}
              onChange={(e) => setNumConcepts(e.target.value)}
              className="h-9 text-sm"
            />
            <p className="text-[10px] text-muted-foreground">
              How many ad variations to generate per run.
            </p>
          </div>

          <Separator className="mb-6" />

          {/* Logo selection */}
          <div className="space-y-2 mb-6">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Logo
            </Label>
            <div className="flex items-center gap-2">
              {selectedLogoData ? (
                <Popover open={logoPopoverOpen} onOpenChange={setLogoPopoverOpen}>
                  <div className="relative group">
                    <PopoverTrigger asChild>
                      <button className="rounded-lg border border-primary/30 bg-primary/5 p-2 h-14 w-14 flex items-center justify-center cursor-pointer">
                        <img src={selectedLogoData.url} alt={selectedLogoData.name} className="max-h-full max-w-full object-contain opacity-60" />
                      </button>
                    </PopoverTrigger>
                    <div className="absolute -top-1 -left-1 rounded-full bg-muted border border-border p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-accent">
                      <PopoverTrigger asChild>
                        <RefreshCw className="h-2.5 w-2.5 text-muted-foreground" />
                      </PopoverTrigger>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedLogo(null); }}
                      className="absolute -top-1 -right-1 rounded-full bg-muted border border-border p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                  <PopoverContent align="start" className="w-[240px] p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Replace logo</p>
                    <div className="grid grid-cols-3 gap-2">
                      {MOCK_LOGOS.map((l) => {
                        const isSel = selectedLogo === l.id;
                        return (
                          <button
                            key={l.id}
                            onClick={() => { setSelectedLogo(l.id); setLogoPopoverOpen(false); }}
                            className={`relative rounded-lg border-2 p-2 aspect-square flex flex-col items-center justify-center gap-1 transition-all ${
                              isSel ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                            }`}
                          >
                            <img src={l.url} alt={l.name} className="h-8 w-8 object-contain opacity-60" />
                            <span className="text-[9px] text-muted-foreground truncate w-full text-center">{l.name}</span>
                            {isSel && <div className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-primary" />}
                          </button>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <Popover open={logoPopoverOpen} onOpenChange={setLogoPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button className="rounded-lg border-2 border-dashed border-border hover:border-muted-foreground/40 h-14 w-14 flex items-center justify-center transition-colors">
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-[240px] p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Select a logo</p>
                    <div className="grid grid-cols-3 gap-2">
                      {MOCK_LOGOS.map((l) => (
                        <button
                          key={l.id}
                          onClick={() => { setSelectedLogo(l.id); setLogoPopoverOpen(false); }}
                          className="relative rounded-lg border-2 border-border hover:border-muted-foreground/30 p-2 aspect-square flex flex-col items-center justify-center gap-1 transition-all"
                        >
                          <img src={l.url} alt={l.name} className="h-8 w-8 object-contain opacity-60" />
                          <span className="text-[9px] text-muted-foreground truncate w-full text-center">{l.name}</span>
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          {/* Brand Visuals */}
          <div className="space-y-2 mb-6">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Brand Visuals
            </Label>
            <div className="flex flex-wrap items-center gap-2">
              {selectedVisuals.map((vId) => {
                const visual = MOCK_VISUALS.find((v) => v.id === vId);
                if (!visual) return null;
                return (
                  <div
                    key={visual.id}
                    className="relative rounded-lg border border-border bg-muted/30 h-14 w-14 flex items-center justify-center group"
                  >
                    <Image className="h-5 w-5 text-muted-foreground" />
                    <button
                      onClick={() => toggleVisual(visual.id)}
                      className="absolute -top-1 -right-1 rounded-full bg-muted border border-border p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                );
              })}
              <Popover open={visualsPopoverOpen} onOpenChange={setVisualsPopoverOpen}>
                <PopoverTrigger asChild>
                  <button className="rounded-lg border-2 border-dashed border-border hover:border-muted-foreground/40 h-14 w-14 flex items-center justify-center transition-colors">
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[260px] p-3">
                  <div className="grid grid-cols-3 gap-2">
                    {MOCK_VISUALS.map((v) => {
                      const isSel = selectedVisuals.includes(v.id);
                      return (
                        <Tooltip key={v.id}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => toggleVisual(v.id)}
                              className={`relative rounded-lg border-2 aspect-square flex items-center justify-center transition-all ${
                                isSel ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                              }`}
                            >
                              <Image className="h-6 w-6 text-muted-foreground/60" />
                              {isSel && (
                                <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                                  <Check className="h-2.5 w-2.5 text-primary-foreground" />
                                </div>
                              )}
                              <span className="absolute bottom-1 left-1 right-1 text-[7px] text-muted-foreground/60 truncate text-center">{v.name}</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="text-xs max-w-[200px]">{v.name}</TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Deactivate Brand Brain Confirmation */}
      <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Brand Brain?</AlertDialogTitle>
            <AlertDialogDescription>
              It is <span className="font-semibold text-foreground">not recommended</span> to deactivate the Brand Brain. 
              Disabling it will reduce the brand compliance of your generated ad variations, resulting in concepts that may 
              not align with your brand's tone of voice, visual identity, and positioning.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep active</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => setBrandBrainActive(false)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deactivate anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
