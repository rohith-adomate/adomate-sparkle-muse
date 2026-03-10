import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, Image, Star } from "lucide-react";

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

interface BrandKnowledgeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BrandKnowledgeDrawer({ open, onOpenChange }: BrandKnowledgeDrawerProps) {
  const [selectedLogo, setSelectedLogo] = useState<string | null>("logo-1");
  const [selectedVisuals, setSelectedVisuals] = useState<string[]>(["vis-1"]);

  const toggleVisual = (id: string) => {
    setSelectedVisuals((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  return (
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
          {/* Logo selection */}
          <div className="space-y-2.5">
            <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Logo
            </Label>
            <p className="text-[11px] text-muted-foreground -mt-1">Choose one logo for this workflow.</p>
            <div className="grid grid-cols-3 gap-2">
              {MOCK_LOGOS.map((logo) => {
                const isSelected = selectedLogo === logo.id;
                return (
                  <button
                    key={logo.id}
                    onClick={() => setSelectedLogo(isSelected ? null : logo.id)}
                    className={`relative rounded-lg border-2 p-3 aspect-square flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-muted-foreground/30 bg-card"
                    }`}
                  >
                    <img
                      src={logo.url}
                      alt={logo.name}
                      className="max-h-full max-w-full object-contain opacity-60"
                    />
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 rounded-full bg-primary p-0.5">
                        <Star className="h-2.5 w-2.5 text-primary-foreground fill-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {selectedLogo && (
              <p className="text-[11px] text-muted-foreground">
                Selected: <span className="font-medium text-foreground">{MOCK_LOGOS.find((l) => l.id === selectedLogo)?.name}</span>
              </p>
            )}
          </div>

          {/* Brand Visuals selection */}
          <div className="space-y-2.5">
            <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Brand Visuals
            </Label>
            <p className="text-[11px] text-muted-foreground -mt-1">Select one or more style visuals.</p>
            <div className="space-y-1.5">
              {MOCK_VISUALS.map((visual) => {
                const isSelected = selectedVisuals.includes(visual.id);
                return (
                  <label
                    key={visual.id}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/30 bg-card"
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleVisual(visual.id)}
                    />
                    <div className="h-9 w-9 rounded-md border border-border bg-muted/50 flex items-center justify-center shrink-0 overflow-hidden">
                      <Image className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-xs font-medium">{visual.name}</span>
                  </label>
                );
              })}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {selectedVisuals.length} visual{selectedVisuals.length !== 1 ? "s" : ""} selected
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
