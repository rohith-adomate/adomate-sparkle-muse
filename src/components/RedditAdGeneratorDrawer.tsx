import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import DrawerContinueFooter from "./DrawerContinueFooter";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface RedditAdGeneratorDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue?: () => void;
  continueLabel?: string;
}

type OutputType = "commercial" | "meme" | "trend";
type MemeIntensity = "none" | "light" | "medium";
type PromptStyle = "strict" | "balanced" | "reddit-native";

const OUTPUT_TYPE_LABELS: Record<OutputType, string> = {
  commercial: "Commercial Image Static Ads",
  meme: "Meme-Based Ads",
  trend: "Trend-Based Ads",
};

const MEME_DEFAULTS: Record<OutputType, MemeIntensity> = {
  commercial: "none",
  meme: "medium",
  trend: "light",
};

const MEME_LABELS: Record<MemeIntensity, string> = {
  none: "None",
  light: "Light",
  medium: "Medium",
};

const MEME_INDEX: Record<MemeIntensity, number> = {
  none: 0,
  light: 1,
  medium: 2,
};

const INDEX_TO_MEME: MemeIntensity[] = ["none", "light", "medium"];

const DIVERSITY_LABELS = ["Brand-close", "Balanced", "Exploratory"];

export default function RedditAdGeneratorDrawer({ open, onOpenChange }: RedditAdGeneratorDrawerProps) {
  const [outputType, setOutputType] = useState<OutputType>("commercial");
  const [numConcepts, setNumConcepts] = useState("6");
  const [conceptDiversity, setConceptDiversity] = useState(1); // 0=Brand-close, 1=Balanced, 2=Exploratory
  const [memeIntensity, setMemeIntensity] = useState<MemeIntensity>("none");
  const [promptStyle, setPromptStyle] = useState<PromptStyle>("balanced");
  const [includeRedditPhrasing, setIncludeRedditPhrasing] = useState(false);

  // Auto-set meme intensity when output type changes
  useEffect(() => {
    setMemeIntensity(MEME_DEFAULTS[outputType]);
  }, [outputType]);

  return (
    <TooltipProvider>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[380px] sm:w-[420px] overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-base">Reddit Ad Generator — Settings</SheetTitle>
          </SheetHeader>

          <div className="space-y-5">
            {/* Output Type */}
            <div className="space-y-2">
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5 cursor-help">
                    Output Type
                    <Info className="h-3 w-3" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[260px] text-xs">
                  Determines the creative style of generated ads. Commercial = polished brand ads, Meme = Reddit-native humor, Trend = riding current viral formats.
                </TooltipContent>
              </Tooltip>
              <Select value={outputType} onValueChange={(v) => setOutputType(v as OutputType)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.entries(OUTPUT_TYPE_LABELS) as [OutputType, string][]).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Number of Concepts */}
            <div className="space-y-2">
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5 cursor-help">
                    Number of Concepts
                    <Info className="h-3 w-3" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[260px] text-xs">
                  How many unique ad concepts the agent will generate per run. Each concept gets a unique angle derived from scraped Reddit content.
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

            {/* Concept Diversity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5 cursor-help">
                      Concept Diversity
                      <Info className="h-3 w-3" />
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[260px] text-xs">
                    Controls how far concepts stray from your brand guidelines. Brand-close = safe, on-brand. Exploratory = creative, experimental angles.
                  </TooltipContent>
                </Tooltip>
                <span className="text-xs font-medium text-foreground">{DIVERSITY_LABELS[conceptDiversity]}</span>
              </div>
              <div className="px-0.5">
                <Slider
                  min={0}
                  max={2}
                  step={1}
                  value={[conceptDiversity]}
                  onValueChange={([v]) => setConceptDiversity(v)}
                  className="w-full"
                />
                <div className="flex justify-between mt-1">
                  {DIVERSITY_LABELS.map((lbl) => (
                    <span key={lbl} className="text-[10px] text-muted-foreground">{lbl}</span>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Meme Intensity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5 cursor-help">
                      Meme Intensity
                      <Info className="h-3 w-3" />
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[260px] text-xs">
                    How much meme/humor influence to inject. Auto-set based on output type but can be overridden. None = professional, Light = subtle humor, Medium = distinctly meme-flavored.
                  </TooltipContent>
                </Tooltip>
                <span className="text-xs font-medium text-foreground">{MEME_LABELS[memeIntensity]}</span>
              </div>
              <div className="px-0.5">
                <Slider
                  min={0}
                  max={2}
                  step={1}
                  value={[MEME_INDEX[memeIntensity]]}
                  onValueChange={([v]) => setMemeIntensity(INDEX_TO_MEME[v])}
                  className="w-full"
                />
                <div className="flex justify-between mt-1">
                  {Object.values(MEME_LABELS).map((lbl) => (
                    <span key={lbl} className="text-[10px] text-muted-foreground">{lbl}</span>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Prompt Style */}
            <div className="space-y-2">
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5 cursor-help">
                    Prompt Style
                    <Info className="h-3 w-3" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[260px] text-xs">
                  Controls the generation prompt tone. Strict Brand = corporate and on-brand. Balanced = blend of brand and platform-native. Reddit-Native = uses Reddit's language and phrasing style.
                </TooltipContent>
              </Tooltip>
              <div className="flex items-center gap-1">
                {(["strict", "balanced", "reddit-native"] as PromptStyle[]).map((style) => (
                  <div
                    key={style}
                    className={`flex-1 rounded-md border px-2 py-1.5 text-center cursor-pointer transition-colors text-[10px] font-medium ${
                      promptStyle === style
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:bg-muted/40"
                    }`}
                    onClick={() => setPromptStyle(style)}
                  >
                    {style === "strict" ? "Strict Brand" : style === "balanced" ? "Balanced" : "Reddit-Native"}
                  </div>
                ))}
              </div>
            </div>

            {/* Include Reddit Phrasing */}
            <div className="flex items-center justify-between">
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5 cursor-help">
                    Include Direct Reddit Phrasing
                    <Info className="h-3 w-3" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[260px] text-xs">
                  When enabled, the generator may quote or paraphrase real Reddit comments and titles in the ad copy, making it feel more authentic to the platform.
                </TooltipContent>
              </Tooltip>
              <Switch checked={includeRedditPhrasing} onCheckedChange={setIncludeRedditPhrasing} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}
