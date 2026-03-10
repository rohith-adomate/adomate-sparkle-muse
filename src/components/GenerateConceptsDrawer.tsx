import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sparkles } from "lucide-react";

interface GenerateConceptsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GenerateConceptsDrawer({ open, onOpenChange }: GenerateConceptsDrawerProps) {
  const [prompt, setPrompt] = useState(
    "Generate modern, scroll-stopping ad creatives for social media. Use bold visuals with clean typography. Incorporate the brand colors and product imagery. Each concept should have a distinct visual style — try lifestyle, minimalist, and UGC-inspired approaches."
  );
  const [numConcepts, setNumConcepts] = useState("6");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[380px] sm:w-[420px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-base">Generate Concepts — Settings</SheetTitle>
        </SheetHeader>

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
            This prompt is combined with your brand knowledge, product data, and competitor insights to generate concepts.
          </p>
        </div>

        <Separator className="mb-6" />

        {/* Number of concepts */}
        <div className="space-y-2 mb-6">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Number of concepts
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
            How many ad concepts to generate per run.
          </p>
        </div>

        <Separator className="mb-6" />

        {/* Info */}
        <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Inputs used</p>
          <div className="flex flex-wrap gap-1.5">
            {["Brand Knowledge", "Product Data", "Competitor Data"].map((input) => (
              <span key={input} className="text-[10px] bg-primary/10 text-primary rounded-md px-2 py-0.5 font-medium">
                {input}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            These are automatically pulled from connected upstream nodes.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
