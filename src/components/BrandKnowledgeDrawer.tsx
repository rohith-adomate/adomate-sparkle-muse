import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { BookOpen, Image, Plus, Star, X, Info } from "lucide-react";

const MOCK_LOGOS = [
  { id: "logo-1", name: "Primary Logo", url: "/placeholder.svg" },
  { id: "logo-2", name: "Icon Mark", url: "/placeholder.svg" },
  { id: "logo-3", name: "Wordmark", url: "/placeholder.svg" },
];

const MOCK_VISUALS = [
  { id: "vis-1", name: "Hero Banner", url: "/placeholder.svg" },
  { id: "vis-2", name: "Lifestyle Shot 1", url: "/placeholder.svg" },
  { id: "vis-3", name: "Lifestyle Shot 2", url: "/placeholder.svg" },
  { id: "vis-4", name: "Product Scene", url: "/placeholder.svg" },
  { id: "vis-5", name: "Texture", url: "/placeholder.svg" },
];

const KNOWLEDGE_FIELDS = [
  "Description",
  "Tone of Voice",
  "Brand Positioning",
  "Visual Style",
  "Brand Colors",
];

interface BrandKnowledgeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BrandKnowledgeDrawer({ open, onOpenChange }: BrandKnowledgeDrawerProps) {
  const [includeKnowledge, setIncludeKnowledge] = useState(true);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [selectedVisuals, setSelectedVisuals] = useState<string[]>([]);
  const [logoPopoverOpen, setLogoPopoverOpen] = useState(false);
  const [visualsPopoverOpen, setVisualsPopoverOpen] = useState(false);

  const selectedLogoData = MOCK_LOGOS.find((l) => l.id === selectedLogo);

  const toggleVisual = (id: string) => {
    setSelectedVisuals((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const removeVisual = (id: string) => {
    setSelectedVisuals((prev) => prev.filter((v) => v !== id));
  };

  return (
    <TooltipProvider>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[360px] sm:max-w-[360px] flex flex-col gap-0 p-0">
          <SheetHeader className="px-5 pt-5 pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="rounded-md p-1.5" style={{ background: "hsl(210 80% 55% / 0.12)" }}>
                <BookOpen className="h-4 w-4" style={{ color: "hsl(210 80% 55%)" }} />
              </div>
              <div>
                <SheetTitle className="text-sm">Brand Knowledge</SheetTitle>
                <SheetDescription className="text-xs">Select brand assets for this workflow.</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
            {/* Knowledge toggle */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Knowledge
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[220px] text-xs">
                      Include your brand's textual knowledge such as description, tone of voice, positioning, visual style, and colors.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Switch
                  checked={includeKnowledge}
                  onCheckedChange={setIncludeKnowledge}
                  className="scale-[0.8]"
                />
              </div>
              <div
                className={`rounded-lg border px-3 py-2.5 space-y-1 transition-opacity ${
                  includeKnowledge
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-muted/30 opacity-50"
                }`}
              >
                {KNOWLEDGE_FIELDS.map((field) => (
                  <div key={field} className="flex items-center gap-2">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${
                        includeKnowledge ? "bg-primary" : "bg-muted-foreground/40"
                      }`}
                    />
                    <span className="text-[11px] text-muted-foreground">{field}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Logo selection */}
            <div className="space-y-2.5">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Logo
              </Label>
              <div className="flex items-center gap-2">
                {selectedLogoData && (
                  <div className="relative rounded-lg border-2 border-primary bg-primary/5 p-3 h-16 w-16 flex items-center justify-center">
                    <img
                      src={selectedLogoData.url}
                      alt={selectedLogoData.name}
                      className="max-h-full max-w-full object-contain opacity-60"
                    />
                    <button
                      onClick={() => setSelectedLogo(null)}
                      className="absolute -top-1.5 -right-1.5 rounded-full bg-muted border border-border p-0.5 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                )}
                <Popover open={logoPopoverOpen} onOpenChange={setLogoPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button className="rounded-lg border-2 border-dashed border-border hover:border-muted-foreground/40 h-16 w-16 flex items-center justify-center transition-colors">
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-[200px] p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1 pb-1.5">
                      Select a logo
                    </p>
                    <div className="space-y-1">
                      {MOCK_LOGOS.map((logo) => {
                        const isCurrent = selectedLogo === logo.id;
                        return (
                          <button
                            key={logo.id}
                            onClick={() => {
                              setSelectedLogo(isCurrent ? null : logo.id);
                              setLogoPopoverOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors ${
                              isCurrent
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted"
                            }`}
                          >
                            <div className="h-8 w-8 rounded border border-border bg-muted/50 flex items-center justify-center shrink-0 overflow-hidden">
                              <img src={logo.url} alt={logo.name} className="max-h-full max-w-full object-contain opacity-60" />
                            </div>
                            <span className="text-xs font-medium">{logo.name}</span>
                            {isCurrent && <Star className="h-3 w-3 ml-auto fill-primary text-primary" />}
                          </button>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Brand Visuals selection */}
            <div className="space-y-2.5">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Brand Visuals
              </Label>
              <div className="flex flex-wrap items-center gap-2">
                {selectedVisuals.map((vId) => {
                  const visual = MOCK_VISUALS.find((v) => v.id === vId);
                  if (!visual) return null;
                  return (
                    <div
                      key={visual.id}
                      className="relative rounded-lg border border-border bg-card h-16 w-16 flex items-center justify-center overflow-hidden"
                    >
                      <Image className="h-5 w-5 text-muted-foreground" />
                      <button
                        onClick={() => removeVisual(visual.id)}
                        className="absolute -top-1.5 -right-1.5 rounded-full bg-muted border border-border p-0.5 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  );
                })}
                <Popover open={visualsPopoverOpen} onOpenChange={setVisualsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button className="rounded-lg border-2 border-dashed border-border hover:border-muted-foreground/40 h-16 w-16 flex items-center justify-center transition-colors">
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-[220px] p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1 pb-1.5">
                      Add visuals
                    </p>
                    <div className="space-y-1">
                      {MOCK_VISUALS.map((visual) => {
                        const isSelected = selectedVisuals.includes(visual.id);
                        return (
                          <button
                            key={visual.id}
                            onClick={() => toggleVisual(visual.id)}
                            className={`w-full flex items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors ${
                              isSelected
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted"
                            }`}
                          >
                            <div className="h-8 w-8 rounded border border-border bg-muted/50 flex items-center justify-center shrink-0 overflow-hidden">
                              <Image className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                            <span className="text-xs font-medium">{visual.name}</span>
                            {isSelected && (
                              <div className="ml-auto h-4 w-4 rounded bg-primary flex items-center justify-center">
                                <Star className="h-2.5 w-2.5 text-primary-foreground fill-primary-foreground" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}
