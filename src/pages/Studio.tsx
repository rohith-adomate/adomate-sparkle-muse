import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ImageIcon, Expand, Copy, Trash2, RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";

/* ── Demo data ── */

const demoGenerations = [
  { id: 1, src: "https://picsum.photos/seed/gen1/400/500" },
  { id: 2, src: "https://picsum.photos/seed/gen2/400/500" },
  { id: 3, src: "https://picsum.photos/seed/gen3/400/500" },
  { id: 4, src: "https://picsum.photos/seed/gen4/400/500" },
  { id: 5, src: "https://picsum.photos/seed/gen5/400/500" },
  { id: 6, src: "https://picsum.photos/seed/gen6/400/500" },
];

const aspectRatios = ["1:1", "4:5", "9:16", "16:9"];

export default function Studio() {
  const { setOpen } = useSidebar();

  // Auto-collapse sidebar on mount, restore on unmount
  useEffect(() => {
    setOpen(false);
    return () => setOpen(true);
  }, [setOpen]);

  const [generationMode, setGenerationMode] = useState("from-product");
  const [sendProductImage, setSendProductImage] = useState(true);
  const [model, setModel] = useState("nano-banana-pro");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [language, setLanguage] = useState("en");
  const [prompt, setPrompt] = useState("");
  const [imageCount, setImageCount] = useState(3);

  return (
    <div className="flex gap-0 h-[calc(100vh-4rem)] -m-6">
      {/* Left panel — AI Image Studio config (scrollable) */}
      <div className="w-[420px] shrink-0 border-r border-border overflow-y-auto p-6 space-y-5">
        <h1 className="text-xl font-bold tracking-tight">AI Image Studio</h1>

        {/* Generation mode */}
        <Card className="border border-border/60">
          <CardContent className="p-4 space-y-3">
            <Label className="text-sm font-semibold">Generation mode</Label>
            <Select value={generationMode} onValueChange={setGenerationMode}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="from-product">From product</SelectItem>
                <SelectItem value="from-scratch">From scratch</SelectItem>
                <SelectItem value="from-competitor">From competitor</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Product */}
        <Card className="border border-border/60">
          <CardContent className="p-4 space-y-3">
            <Label className="text-sm font-semibold">Product</Label>
            <div className="flex items-center gap-4">
              <div className="h-24 w-28 rounded-lg bg-muted flex items-center justify-center border border-border/60">
                <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <Button variant="outline" size="sm">Choose images</Button>
            </div>
            <p className="text-xs text-muted-foreground font-mono">345772564264751624​8</p>
            <div className="flex items-center gap-2">
              <Switch checked={sendProductImage} onCheckedChange={setSendProductImage} />
              <span className="text-sm">Send product image with prompt</span>
            </div>
          </CardContent>
        </Card>

        {/* Model */}
        <Card className="border border-border/60">
          <CardContent className="p-4 space-y-4">
            <Label className="text-sm font-semibold">Model</Label>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                className={`flex-1 py-2 text-sm font-medium transition-colors ${model === "nano-banana-pro" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
                onClick={() => setModel("nano-banana-pro")}
              >
                Nano Banana Pro
              </button>
              <button
                className={`flex-1 py-2 text-sm font-medium transition-colors ${model === "openai" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
                onClick={() => setModel("openai")}
              >
                OpenAI
              </button>
            </div>

            <Label className="text-sm font-semibold">Aspect ratio</Label>
            <div className="flex rounded-lg border border-border overflow-hidden">
              {aspectRatios.map((r) => (
                <button
                  key={r}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${aspectRatio === r ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
                  onClick={() => setAspectRatio(r)}
                >
                  {r}
                </button>
              ))}
            </div>

            <Separator />

            <Label className="text-sm font-semibold">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">en</SelectItem>
                <SelectItem value="nl">nl</SelectItem>
                <SelectItem value="de">de</SelectItem>
                <SelectItem value="fr">fr</SelectItem>
                <SelectItem value="es">es</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Trigger</p>
                <p className="text-xs text-muted-foreground">Optional</p>
              </div>
              <Button variant="link" className="text-primary text-sm p-0 h-auto">Select</Button>
            </div>
          </CardContent>
        </Card>

        {/* ImageGPT */}
        <Card className="border border-border/60">
          <CardContent className="p-4 space-y-3">
            <Label className="text-sm font-semibold">ImageGPT (optional)</Label>
            <div className="h-20 w-28 rounded-lg bg-muted flex items-center justify-center border border-border/60">
              <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <p className="text-xs text-muted-foreground">Choose ImageGPT</p>
          </CardContent>
        </Card>

        {/* Prompt */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Prompt</Label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type '/' for Brand/Product knowledge..."
            className="min-h-[100px]"
          />
        </div>

        {/* Images count */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Images</Label>
          <Input type="number" value={imageCount} onChange={(e) => setImageCount(Number(e.target.value))} min={1} max={10} />
        </div>

        {/* Generate button */}
        <Button variant="secondary" className="w-full" disabled>Generate</Button>
      </div>

      {/* Right panel — Generations */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Generations</h2>
          <Select defaultValue="ai-studio">
            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ai-studio">AI Image Studio (8)</SelectItem>
              <SelectItem value="all">All generations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Settings summary */}
        <div className="flex gap-6">
          <Card className="border border-border/60 shrink-0">
            <CardContent className="p-4 space-y-1.5">
              <p className="text-sm font-semibold mb-2">Settings</p>
              {[
                ["Product", "Face Wash Sensitive"],
                ["ImageGPT", "ProblemSolutionGPT"],
                ["Model", "NANO_BANANA_PRO"],
                ["Ratio", "1:1"],
                ["Language", "en"],
                ["Include product context", "Yes"],
                ["Send images", "Yes"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-6 text-xs">
                  <span className="text-muted-foreground">{k}</span>
                  <Badge variant="outline" className="text-[10px] font-medium">{v}</Badge>
                </div>
              ))}
              <Separator className="my-2" />
              <p className="text-sm font-semibold">Prompt</p>
              <Input readOnly value="Seeded demo concept" className="text-xs h-8" />
            </CardContent>
          </Card>

          {/* Image grid */}
          <div className="flex-1 grid grid-cols-3 gap-4">
            {demoGenerations.map((gen) => (
              <div key={gen.id} className="space-y-1">
                <Card className="border border-border/60 overflow-hidden">
                  <CardContent className="p-2">
                    <div className="aspect-[4/5] rounded-lg overflow-hidden bg-muted">
                      <img src={gen.src} alt={`Generation ${gen.id}`} className="w-full h-full object-cover" />
                    </div>
                  </CardContent>
                </Card>
                <div className="flex items-center justify-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Expand className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Copy className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><RefreshCw className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
