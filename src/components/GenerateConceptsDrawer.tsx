import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
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
import { Info, Brain } from "lucide-react";

interface GenerateConceptsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SIMILARITY_LABELS = ["Low", "Medium", "High"];

export default function GenerateConceptsDrawer({ open, onOpenChange }: GenerateConceptsDrawerProps) {
  const [numConcepts, setNumConcepts] = useState("6");
  const [brandBrainActive, setBrandBrainActive] = useState(true);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [visualSimilarity, setVisualSimilarity] = useState(1); // 0=Low, 1=Medium, 2=High
  const [strategicSimilarity, setStrategicSimilarity] = useState(1);

  const handleBrandBrainClick = () => {
    if (brandBrainActive) {
      setShowDeactivateDialog(true);
    } else {
      setBrandBrainActive(true);
    }
  };

  const SIMILARITY_TOOLTIPS: Record<string, string> = {
    "Visual similarity": "Controls how closely the generated ad variations match the visual style (colors, layout, imagery) of the competitor ads in your dataset.",
    "Messaging similarity": "Controls how closely the generated ad variations follow the messaging approach (copy angle, audience targeting, positioning) of the competitor ads.",
  };

  const SimilaritySlider = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5 cursor-help">
              {label}
              <Info className="h-3 w-3" />
            </Label>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[260px] text-xs">
            {SIMILARITY_TOOLTIPS[label]}
          </TooltipContent>
        </Tooltip>
        <span className="text-xs font-medium text-foreground">{SIMILARITY_LABELS[value]}</span>
      </div>
      <div className="px-0.5">
        <Slider
          min={0}
          max={2}
          step={1}
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          className="w-full"
        />
        <div className="flex justify-between mt-1">
          {SIMILARITY_LABELS.map((lbl) => (
            <span key={lbl} className="text-[10px] text-muted-foreground">{lbl}</span>
          ))}
        </div>
      </div>
    </div>
  );

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

          {/* Number of variations */}
          <div className="space-y-2 mb-6">
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5 cursor-help">
                  Number of variations
                  <Info className="h-3 w-3" />
                </Label>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[240px] text-xs">
                How many unique ad variations the agent will generate per run based on the competitor inputs and your brand profile.
              </TooltipContent>
            </Tooltip>
            <Input
              type="number"
              min="1"
              max="20"
              value={numConcepts}
              onChange={(e) => setNumConcepts(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          <Separator className="mb-6" />

          {/* Similarity Sliders */}
          <div className="space-y-5">
            <SimilaritySlider
              label="Visual similarity"
              value={visualSimilarity}
              onChange={setVisualSimilarity}
            />
            <SimilaritySlider
              label="Strategic similarity"
              value={strategicSimilarity}
              onChange={setStrategicSimilarity}
            />
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
