import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, Check, Upload, Plus, X, Pencil, Info, Star, Search, Trash2 } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { HoverExplainer } from "@/components/HoverExplainer";
import { Badge } from "@/components/ui/badge";

const ALL_LANGUAGES = [
  "Afrikaans","Albanian","Amharic","Arabic","Armenian","Azerbaijani","Basque","Belarusian","Bengali","Bosnian",
  "Bulgarian","Burmese","Catalan","Cebuano","Chinese (Simplified)","Chinese (Traditional)","Croatian","Czech",
  "Danish","Dutch","English","Esperanto","Estonian","Filipino","Finnish","French","Galician","Georgian","German",
  "Greek","Gujarati","Haitian Creole","Hausa","Hawaiian","Hebrew","Hindi","Hmong","Hungarian","Icelandic","Igbo",
  "Indonesian","Irish","Italian","Japanese","Javanese","Kannada","Kazakh","Khmer","Kinyarwanda","Korean","Kurdish",
  "Kyrgyz","Lao","Latin","Latvian","Lithuanian","Luxembourgish","Macedonian","Malagasy","Malay","Malayalam","Maltese",
  "Maori","Marathi","Mongolian","Nepali","Norwegian","Odia","Pashto","Persian","Polish","Portuguese","Punjabi",
  "Romanian","Russian","Samoan","Scottish Gaelic","Serbian","Sesotho","Shona","Sindhi","Sinhala","Slovak","Slovenian",
  "Somali","Spanish","Sundanese","Swahili","Swedish","Tajik","Tamil","Tatar","Telugu","Thai","Turkish","Turkmen",
  "Ukrainian","Urdu","Uyghur","Uzbek","Vietnamese","Welsh","Xhosa","Yiddish","Yoruba","Zulu"
];

const initialColors = [
  { hex: "#6366F1", name: "Indigo" },
  { hex: "#0EA5E9", name: "Sky" },
  { hex: "#F97316", name: "Orange" },
];

interface KnowledgeField {
  id: string;
  title: string;
  value: string;
  rows: number;
}

const initialFields: KnowledgeField[] = [
  { id: "description", title: "Description", value: "Acme Co is a B2B SaaS platform that empowers small businesses with AI-driven advertising. We help marketing teams create, test, and optimize ad creative at scale without needing a design team.", rows: 4 },
  { id: "tone", title: "Tone of Voice", value: "Confident but approachable. Data-driven without being dry. We use active voice and short sentences. Avoid jargon. Speak directly to the reader. Be encouraging, not pushy.", rows: 3 },
  { id: "positioning", title: "Brand Positioning", value: "The easiest way for small businesses to create high-performing ads. We're not a design tool — we're an AI creative partner that understands your brand, your customers, and what converts.", rows: 3 },
  { id: "visual-style", title: "Visual Style", value: "Prefer lifestyle photography with diverse models. Avoid stock-photo aesthetics. Use warm lighting. Clean layouts with generous whitespace. Product shots should be on neutral backgrounds.", rows: 4 },
];

function InfoTooltip({ text }: { text: string }) {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help shrink-0" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default function BrandKnowledge() {
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [colors, setColors] = useState(initialColors);
  const [newColor, setNewColor] = useState("#000000");
  const [fields, setFields] = useState<KnowledgeField[]>(initialFields);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFieldTitle, setNewFieldTitle] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");

  // Languages state
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English", "Spanish"]);
  const [defaultLanguage, setDefaultLanguage] = useState("English");
  const [langSearch, setLangSearch] = useState("");
  const [langPopoverOpen, setLangPopoverOpen] = useState(false);

  const filteredLanguages = useMemo(() => {
    return ALL_LANGUAGES.filter(
      (l) => l.toLowerCase().includes(langSearch.toLowerCase()) && !selectedLanguages.includes(l)
    );
  }, [langSearch, selectedLanguages]);

  const addLanguage = (lang: string) => {
    const updated = [...selectedLanguages, lang];
    setSelectedLanguages(updated);
    if (updated.length === 1) setDefaultLanguage(lang);
    setLangSearch("");
    triggerAutoSave();
  };

  const removeLanguage = (lang: string) => {
    const updated = selectedLanguages.filter((l) => l !== lang);
    setSelectedLanguages(updated);
    if (defaultLanguage === lang && updated.length > 0) {
      setDefaultLanguage(updated[0]);
    }
    triggerAutoSave();
  };

  const setAsDefault = (lang: string) => {
    setDefaultLanguage(lang);
    triggerAutoSave();
  };

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

  const openEditTitle = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      setEditTitle(field.title);
      setEditingField(fieldId);
    }
  };

  const saveEditTitle = () => {
    if (editingField && editTitle.trim()) {
      setFields(fields.map(f => f.id === editingField ? { ...f, title: editTitle.trim() } : f));
      setEditingField(null);
      triggerAutoSave();
    }
  };

  const addNewField = () => {
    if (newFieldTitle.trim()) {
      const id = `custom-${Date.now()}`;
      setFields([...fields, { id, title: newFieldTitle.trim(), value: newFieldValue, rows: 3 }]);
      setNewFieldTitle("");
      setNewFieldValue("");
      setShowAddModal(false);
      triggerAutoSave();
    }
  };

  const updateFieldValue = (fieldId: string, value: string) => {
    setFields(fields.map(f => f.id === fieldId ? { ...f, value } : f));
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Breadcrumbs items={[{ label: "Brand Data Room", href: "/brand-data-room" }, { label: "Brand Knowledge" }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Brand Knowledge</h1>
          <p className="text-muted-foreground text-sm">Define your brand identity and visual style. Changes auto-save.</p>
        </div>
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
          {/* Merged Brand Info Card */}
          <Card>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Label>Brand Name</Label>
                  <InfoTooltip text="The primary name of your brand. This will be used across all generated ad copy and creative materials." />
                </div>
                <Input defaultValue="Acme Co" onBlur={handleFieldChange} />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Label>Website URL</Label>
                  <InfoTooltip text="Your brand's main website. This helps the AI understand your brand context, products, and messaging." />
                </div>
                <Input defaultValue="https://acmeco.com" onBlur={handleFieldChange} />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Label>Ad Languages</Label>
                  <InfoTooltip text="Choose the languages your brand uses for ad creation. The starred language is the default used unless another language is selected." />
                </div>

                {/* Selected languages */}
                <div className="flex flex-wrap gap-2">
                  {selectedLanguages.map((lang) => (
                    <Badge
                      key={lang}
                      variant="secondary"
                      className="gap-1.5 py-1 px-2.5 text-xs font-medium"
                    >
                      <Tooltip delayDuration={600}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setAsDefault(lang)}
                            className="shrink-0"
                            aria-label={`Set ${lang} as default`}
                          >
                            <Star
                              className={`h-3 w-3 transition-colors ${
                                defaultLanguage === lang
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground/40 hover:text-muted-foreground"
                              }`}
                            />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          {defaultLanguage === lang ? "Default language" : "Set as default language"}
                        </TooltipContent>
                      </Tooltip>
                      {lang}
                      <button
                        onClick={() => removeLanguage(lang)}
                        className="shrink-0 hover:text-destructive transition-colors"
                        aria-label={`Remove ${lang}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}

                  {/* Add language popover */}
                  <Popover open={langPopoverOpen} onOpenChange={setLangPopoverOpen}>
                    <PopoverTrigger asChild>
                      <button className="h-7 px-2.5 rounded-md border border-dashed border-muted-foreground/30 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center gap-1">
                        <Plus className="h-3 w-3" /> Add language
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2" align="start">
                      <div className="flex items-center gap-2 border-b pb-2 mb-1">
                        <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <input
                          value={langSearch}
                          onChange={(e) => setLangSearch(e.target.value)}
                          placeholder="Search languages..."
                          className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-0.5">
                        {filteredLanguages.length === 0 ? (
                          <p className="text-xs text-muted-foreground p-2 text-center">No languages found</p>
                        ) : (
                          filteredLanguages.map((lang) => (
                            <button
                              key={lang}
                              onClick={() => addLanguage(lang)}
                              className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-accent transition-colors"
                            >
                              {lang}
                            </button>
                          ))
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Fields Card - no outer tooltip */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              {fields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <div className="flex items-center gap-1.5 group">
                    <Label>{field.title}</Label>
                    <button
                      onClick={() => openEditTitle(field.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-accent"
                      aria-label={`Edit ${field.title} title`}
                    >
                      <Pencil className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </div>
                  <Textarea
                    value={field.value}
                    onChange={(e) => updateFieldValue(field.id, e.target.value)}
                    onBlur={handleFieldChange}
                    rows={field.rows}
                  />
                </div>
              ))}
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="h-8 w-8 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-primary hover:text-primary transition-colors text-muted-foreground"
                  aria-label="Add new knowledge field"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visual" className="mt-4 space-y-4">
          <HoverExplainer text="Fonts: Typography used in generated ad creative. Backend: brand_knowledge.fonts (TEXT). Expected format: comma-separated font names.">
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

          <HoverExplainer text="Logos: Brand logos uploaded for use in generated ad creative. Supports PNG, SVG, JPG. Backend: stored in storage bucket 'brand-assets'. Max file size: 5MB per file.">
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

          <HoverExplainer text="Brand Guidelines: PDF or image files containing the brand's style guide. Backend: stored in storage bucket 'brand-assets'.">
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

          <HoverExplainer text="Brand Colors: Hex color values used in generated ad creative. Backend: brand_knowledge.colors (JSONB array of {hex, name}).">
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
        </TabsContent>
      </Tabs>

      {/* Edit Title Dialog */}
      <Dialog open={!!editingField} onOpenChange={(open) => !open && setEditingField(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Field Title</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveEditTitle()} autoFocus />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingField(null)}>Cancel</Button>
            <Button onClick={saveEditTitle}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Field Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Knowledge Field</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={newFieldTitle} onChange={(e) => setNewFieldTitle(e.target.value)} placeholder="e.g. Target Audience" autoFocus />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea value={newFieldValue} onChange={(e) => setNewFieldValue(e.target.value)} placeholder="Describe this aspect of your brand..." rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={addNewField} disabled={!newFieldTitle.trim()}>Add Field</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
