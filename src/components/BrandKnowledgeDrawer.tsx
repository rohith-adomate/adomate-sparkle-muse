import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { BookOpen, Image, Plus, X, Info, Check, RefreshCw } from "lucide-react";

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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Knowledge
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[240px] text-xs leading-relaxed p-3">
                      <p className="font-medium mb-1">Includes your brand profile:</p>
                      <ul className="list-disc pl-3.5 space-y-0.5 text-muted-foreground">
                        <li>Description</li>
                        <li>Tone of Voice</li>
                        <li>Brand Positioning</li>
                        <li>Visual Style</li>
                        <li>Brand Colors</li>
                      </ul>
                      <p className="mt-1.5 text-muted-foreground">
                        Manage in{" "}
                        <a href="/brand-data-room/knowledge" className="text-primary underline underline-offset-2 hover:text-primary/80">
                          Data Room → Brand Knowledge
                        </a>
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Switch
                  checked={includeKnowledge}
                  onCheckedChange={setIncludeKnowledge}
                  className="scale-[0.8]"
                />
              </div>
            </div>

            {/* Logo selection — Option A */}
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Logo
              </Label>
              <div className="flex items-center gap-2">
                {selectedLogoData && (
                  <div className="relative rounded-lg border border-primary/30 bg-primary/5 p-2 h-14 w-14 flex items-center justify-center">
                    <img src={selectedLogoData.url} alt={selectedLogoData.name} className="max-h-full max-w-full object-contain opacity-60" />
                    <button
                      onClick={() => setSelectedLogo(null)}
                      className="absolute -top-1 -right-1 rounded-full bg-muted border border-border p-0.5 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                )}
                <Popover open={logoPopoverOpen} onOpenChange={setLogoPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button className="rounded-lg border-2 border-dashed border-border hover:border-muted-foreground/40 h-14 w-14 flex items-center justify-center transition-colors">
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-[240px] p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Select a logo</p>
                    <div className="grid grid-cols-3 gap-2">
                      {MOCK_LOGOS.map((l) => {
                        const isSel = selectedLogo === l.id;
                        return (
                          <button
                            key={l.id}
                            onClick={() => {
                              setSelectedLogo(isSel ? null : l.id);
                              setLogoPopoverOpen(false);
                            }}
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
              </div>
            </div>

            {/* Brand Visuals — Option A */}
            <div className="space-y-2">
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
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}
