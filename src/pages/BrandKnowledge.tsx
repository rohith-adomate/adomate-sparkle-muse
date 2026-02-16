import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Check, RefreshCw, Upload, Plus, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { HoverExplainer } from "@/components/HoverExplainer";

const initialColors = [
  { hex: "#6366F1", name: "Indigo" },
  { hex: "#0EA5E9", name: "Sky" },
  { hex: "#F97316", name: "Orange" },
];

export default function BrandKnowledge() {
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [colors, setColors] = useState(initialColors);
  const [newColor, setNewColor] = useState("#000000");

  const triggerAutoSave = useCallback(() => {
    setSaveState("saving");
    const timer = setTimeout(() => {
      setSaveState("saved");
      const resetTimer = setTimeout(() => setSaveState("idle"), 2000);
      return () => clearTimeout(resetTimer);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleFieldChange = useCallback(() => {
    const debounce = setTimeout(() => triggerAutoSave(), 300);
    return () => clearTimeout(debounce);
  }, [triggerAutoSave]);

  const removeColor = (hex: string) => {
    setColors(colors.filter(c => c.hex !== hex));
    triggerAutoSave();
  };

  const addColor = () => {
    if (!colors.find(c => c.hex === newColor)) {
      setColors([...colors, { hex: newColor, name: newColor }]);
      triggerAutoSave();
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumbs items={[{ label: "Brand Data Room", href: "/brand-data-room" }, { label: "Brand Knowledge" }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Brand Knowledge</h1>
          <p className="text-muted-foreground text-sm">Define your brand identity and visual style. Changes auto-save.</p>
        </div>
        {/* Auto-save indicator */}
        <div className="flex items-center gap-2 text-sm">
          {saveState === "saving" && (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-muted-foreground">Saving...</span>
            </>
          )}
          {saveState === "saved" && (
            <>
              <Check className="h-4 w-4 text-emerald-500" />
              <span className="text-emerald-600">Saved</span>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="knowledge">
        <TabsList>
          <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          <TabsTrigger value="visual">Visual Style</TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge" className="mt-4 space-y-4">
          <HoverExplainer text="Brand Name: The primary brand name used in all generated ad copy and creative. Stored in brand_knowledge.name. Auto-saved on blur with 300ms debounce. Max length: 100 characters.">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label>Brand Name</Label>
                  <Input defaultValue="Acme Co" onBlur={handleFieldChange} />
                </div>
                <div className="space-y-1.5">
                  <Label>Languages</Label>
                  <Input defaultValue="English, Spanish" onBlur={handleFieldChange} placeholder="Comma-separated list of languages" />
                  <p className="text-[10px] text-muted-foreground">Languages the AI will generate ad copy in.</p>
                </div>
              </CardContent>
            </Card>
          </HoverExplainer>

          <HoverExplainer text="Website URL: Used by the AI scraper to extract brand context, product info, and tone. 'Refresh Knowledge' triggers a web scrape of the URL and updates the brand context. Backend: POST /api/scrape-brand-url { url }. Returns extracted brand data which populates Description, Tone, and Positioning fields.">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label>Website URL</Label>
                  <div className="flex gap-2">
                    <Input defaultValue="https://acmeco.com" onBlur={handleFieldChange} className="flex-1" />
                    <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                      <RefreshCw className="h-3.5 w-3.5" /> Refresh Knowledge
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">We'll scrape your website to extract brand context automatically.</p>
                </div>
              </CardContent>
            </Card>
          </HoverExplainer>

          <HoverExplainer text="Description: Free-form brand description used as the primary context for AI concept generation. Fed into every LLM prompt alongside products and personas. Backend: brand_knowledge.description (TEXT). No character limit but recommended < 500 words.">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea defaultValue="Acme Co is a B2B SaaS platform that empowers small businesses with AI-driven advertising. We help marketing teams create, test, and optimize ad creative at scale without needing a design team." rows={4} onBlur={handleFieldChange} />
                </div>
                <div className="space-y-1.5">
                  <Label>Tone of Voice</Label>
                  <Textarea defaultValue="Confident but approachable. Data-driven without being dry. We use active voice and short sentences. Avoid jargon. Speak directly to the reader. Be encouraging, not pushy." rows={3} onBlur={handleFieldChange} />
                </div>
                <div className="space-y-1.5">
                  <Label>Brand Positioning</Label>
                  <Textarea defaultValue="The easiest way for small businesses to create high-performing ads. We're not a design tool — we're an AI creative partner that understands your brand, your customers, and what converts." rows={3} onBlur={handleFieldChange} />
                </div>
              </CardContent>
            </Card>
          </HoverExplainer>
        </TabsContent>

        <TabsContent value="visual" className="mt-4 space-y-4">
          <HoverExplainer text="Fonts: Typography used in generated ad creative. The AI will use these font names when generating mockups. Backend: brand_knowledge.fonts (TEXT). Expected format: comma-separated font names.">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label>Fonts</Label>
                  <Input defaultValue="Inter, DM Sans" onBlur={handleFieldChange} />
                  <p className="text-[10px] text-muted-foreground">Primary and secondary fonts used in ad creative.</p>
                </div>
              </CardContent>
            </Card>
          </HoverExplainer>

          <HoverExplainer text="Logos: Brand logos uploaded for use in generated ad creative. Supports PNG, SVG, JPG. Multiple logo variants (light, dark, icon-only) should be uploaded. Backend: stored in Supabase Storage bucket 'brand-assets'. Max file size: 5MB per file.">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label>Logos</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center space-y-2 hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">Upload logo files</p>
                    <p className="text-xs text-muted-foreground">PNG, SVG, or JPG · Max 5MB per file</p>
                    <p className="text-[10px] text-muted-foreground">Upload light, dark, and icon-only variants</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </HoverExplainer>

          <HoverExplainer text="Brand Guidelines: PDF or image files containing the brand's style guide. Used as reference by the AI when generating creative. Backend: stored in Supabase Storage bucket 'brand-assets'. The AI will parse these documents for color, typography, and layout rules.">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label>Brand Guidelines</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center space-y-2 hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">Upload brand guidelines</p>
                    <p className="text-xs text-muted-foreground">PDF, PNG, or JPG · Max 20MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </HoverExplainer>

          <HoverExplainer text="Brand Colors: Hex color values used in generated ad creative. The AI respects these as the primary palette. Backend: brand_knowledge.colors (JSONB array of {hex, name}). Users can add/remove colors. Changes auto-save.">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Brand Colors</Label>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((c) => (
                      <div key={c.hex} className="flex items-center gap-2 rounded-xl border p-2 px-3 group relative">
                        <div className="h-8 w-8 rounded-lg shadow-inner" style={{ background: c.hex }} />
                        <div className="text-left">
                          <p className="text-xs font-medium">{c.name}</p>
                          <p className="text-[10px] text-muted-foreground">{c.hex}</p>
                        </div>
                        <button onClick={() => removeColor(c.hex)} className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 rounded-xl border border-dashed p-2 px-3">
                      <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} className="h-8 w-8 rounded cursor-pointer" />
                      <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={addColor}>
                        <Plus className="h-3 w-3" /> Add
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </HoverExplainer>

          <HoverExplainer text="Visual Style: Free-form guidelines for imagery and visual direction. Fed into the AI image generation prompts. Backend: brand_knowledge.visual_style (TEXT).">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label>Visual Style</Label>
                  <Textarea defaultValue="Prefer lifestyle photography with diverse models. Avoid stock-photo aesthetics. Use warm lighting. Clean layouts with generous whitespace. Product shots should be on neutral backgrounds." rows={4} onBlur={handleFieldChange} />
                </div>
              </CardContent>
            </Card>
          </HoverExplainer>
        </TabsContent>
      </Tabs>
    </div>
  );
}
