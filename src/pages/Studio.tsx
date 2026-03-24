import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ImageIcon, Maximize2, Copy, Trash2, RotateCcw, X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { getOyImage } from "@/data/oyImages";

/* ── Demo data ── */

interface Generation {
  id: number;
  src: string;
  status: string;
  generated: string;
  product: string;
  model: string;
  ratio: string;
  language: string;
  imageGpt: string;
  sendProductImage: string;
  includeProductContext: string;
  prompt: string;
}

const demoGenerations: Generation[] = [
  { id: 1, src: getOyImage(10), status: "DONE", generated: "05/03/2026, 13:08:15", product: "SCALP & HAIR WASH", model: "NANO BANANA PRO", ratio: "1:1", language: "EN", imageGpt: "PROBLEMSOLUTIONGPT", sendProductImage: "YES", includeProductContext: "YES", prompt: "Seeded demo concept" },
  { id: 2, src: getOyImage(1), status: "DONE", generated: "05/03/2026, 13:08:22", product: "SCALP & HAIR WASH", model: "NANO BANANA PRO", ratio: "1:1", language: "EN", imageGpt: "PROBLEMSOLUTIONGPT", sendProductImage: "YES", includeProductContext: "YES", prompt: "Seeded demo concept" },
  { id: 3, src: getOyImage(2), status: "DONE", generated: "05/03/2026, 13:08:30", product: "DEO WASH", model: "NANO BANANA PRO", ratio: "1:1", language: "EN", imageGpt: "PROBLEMSOLUTIONGPT", sendProductImage: "YES", includeProductContext: "YES", prompt: "Seeded demo concept" },
  { id: 4, src: getOyImage(3), status: "DONE", generated: "05/03/2026, 13:09:01", product: "DEO WASH", model: "NANO BANANA PRO", ratio: "1:1", language: "EN", imageGpt: "PROBLEMSOLUTIONGPT", sendProductImage: "YES", includeProductContext: "YES", prompt: "Seeded demo concept" },
  { id: 5, src: getOyImage(4), status: "DONE", generated: "05/03/2026, 13:09:10", product: "SCALP & HAIR WASH", model: "NANO BANANA PRO", ratio: "1:1", language: "EN", imageGpt: "PROBLEMSOLUTIONGPT", sendProductImage: "YES", includeProductContext: "YES", prompt: "Seeded demo concept" },
  { id: 6, src: getOyImage(5), status: "DONE", generated: "05/03/2026, 13:09:18", product: "DEO WASH", model: "NANO BANANA PRO", ratio: "1:1", language: "EN", imageGpt: "PROBLEMSOLUTIONGPT", sendProductImage: "YES", includeProductContext: "YES", prompt: "Seeded demo concept" },
];

const aspectRatios = ["1:1", "4:5", "9:16", "16:9"];

function ModalTabs({ selectedImage }: { selectedImage: Generation }) {
  const [activeTab, setActiveTab] = useState<"settings" | "prompt">("settings");
  return (
    <div>
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex-1 pb-2 text-sm font-medium text-center transition-colors ${activeTab === "settings" ? "text-foreground" : "text-muted-foreground"}`}
          style={activeTab === "settings" ? { borderBottom: "2px solid hsl(var(--primary))", marginBottom: "-1px" } : {}}
        >
          Settings
        </button>
        <button
          onClick={() => setActiveTab("prompt")}
          className={`flex-1 pb-2 text-sm font-medium text-center transition-colors ${activeTab === "prompt" ? "text-foreground" : "text-muted-foreground"}`}
          style={activeTab === "prompt" ? { borderBottom: "2px solid hsl(var(--primary))", marginBottom: "-1px" } : {}}
        >
          Prompt
        </button>
      </div>
      {activeTab === "settings" ? (
        <div className="mt-4 space-y-2.5">
          {([
            ["Status", selectedImage.status],
            ["Generated", selectedImage.generated],
            ["Product", selectedImage.product],
            ["Model", selectedImage.model],
            ["Ratio", selectedImage.ratio],
            ["Language", selectedImage.language],
            ["ImageGPT", selectedImage.imageGpt],
            ["Send product image", selectedImage.sendProductImage],
            ["Include product context", selectedImage.includeProductContext],
          ] as const).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{k}</span>
              <Badge variant="outline" className="text-[10px] font-semibold">{v}</Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <Input readOnly value={selectedImage.prompt} className="text-sm bg-muted/50" />
        </div>
      )}
    </div>
  );
}

export default function Studio() {
  const { setOpen } = useSidebar();

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
  const [selectedImage, setSelectedImage] = useState<Generation | null>(null);

  return (
    <div className="flex gap-0 h-[calc(100vh-4rem)] -m-6">
      {/* Left panel — AI Image Studio config (scrollable) */}
      <div className="w-[420px] shrink-0 border-r border-border overflow-y-auto p-6 space-y-5">
        <h1 className="text-xl font-bold tracking-tight">AI Image Studio</h1>

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

        <Card className="border border-border/60">
          <CardContent className="p-4 space-y-3">
            <Label className="text-sm font-semibold">Product</Label>
            <div className="flex items-center gap-4">
              <div className="h-24 w-28 rounded-lg bg-muted flex items-center justify-center border border-border/60">
                <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <Button variant="outline" size="sm">Choose images</Button>
            </div>
            <p className="text-xs text-muted-foreground font-mono">3457725642647516248</p>
            <div className="flex items-center gap-2">
              <Switch checked={sendProductImage} onCheckedChange={setSendProductImage} />
              <span className="text-sm">Send product image with prompt</span>
            </div>
          </CardContent>
        </Card>

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

        <Card className="border border-border/60">
          <CardContent className="p-4 space-y-3">
            <Label className="text-sm font-semibold">ImageGPT (optional)</Label>
            <div className="h-20 w-28 rounded-lg bg-muted flex items-center justify-center border border-border/60">
              <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <p className="text-xs text-muted-foreground">Choose ImageGPT</p>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">Prompt</Label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type '/' for Brand/Product knowledge..."
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">Images</Label>
          <Input type="number" value={imageCount} onChange={(e) => setImageCount(Number(e.target.value))} min={1} max={10} />
        </div>

        <Button variant="secondary" className="w-full" disabled>Generate</Button>
      </div>

      {/* Right panel — Generations */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h2 className="text-xl font-bold tracking-tight">Generations</h2>
          </div>
          <Select defaultValue="ai-studio">
            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ai-studio">AI Image Studio (8)</SelectItem>
              <SelectItem value="all">All generations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Settings + grid row */}
        <Card className="border border-border/60">
          <CardContent className="p-5">
            <div className="flex gap-5">
              {/* Settings summary column */}
              <div className="w-[200px] shrink-0 space-y-2">
                <p className="text-sm font-semibold">Settings</p>
                {[
                  ["Product", "Scalp & Hair Wash"],
                  ["ImageGPT", "ProblemSolutionGPT"],
                  ["Model", "NANO_BANANA_PRO"],
                  ["Ratio", "1:1"],
                  ["Language", "en"],
                  ["Include product context", "Yes"],
                  ["Send images", "Yes"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{k}</span>
                    <Badge variant="outline" className="text-[10px] font-semibold">{v}</Badge>
                  </div>
                ))}
                <Separator className="!my-3" />
                <p className="text-sm font-semibold">Prompt</p>
                <Input readOnly value="Seeded demo concept" className="text-xs h-8 bg-muted/50" />
              </div>

              {/* Image grid */}
              <div className="flex-1 grid grid-cols-3 gap-4">
                {demoGenerations.map((gen) => (
                  <div key={gen.id} className="space-y-1">
                    <div
                      className="border-2 border-foreground/80 rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                      onClick={() => setSelectedImage(gen)}
                    >
                      <div className="aspect-[3/4] bg-muted">
                        <img src={gen.src} alt={`Generation ${gen.id}`} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-0.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedImage(gen)}>
                        <Maximize2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <RotateCcw className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Image Detail Modal ── */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden">
          {selectedImage && (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 px-6 pt-5 pb-3">
                <h3 className="text-base font-semibold">Generated ad</h3>
                <Badge variant="outline" className="text-[10px] font-semibold border-primary text-primary bg-transparent">NANO BANANA PRO</Badge>
                <Badge variant="outline" className="text-[10px] font-semibold border-emerald-500 text-emerald-600 bg-transparent">DONE</Badge>
              </div>

              <div className="flex px-6 pb-6 gap-5">
                {/* Large image preview */}
                <div className="flex-1 border border-border/60 rounded-xl overflow-hidden">
                  <img src={selectedImage.src} alt="Generated ad" className="w-full h-full object-cover" />
                </div>

                {/* Details panel */}
                <div className="w-[300px] shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-base font-semibold">Details</p>
                    <div className="flex items-center gap-0.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Copy className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><RotateCcw className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>

                  {/* Custom underline tabs */}
                  <ModalTabs selectedImage={selectedImage} />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
