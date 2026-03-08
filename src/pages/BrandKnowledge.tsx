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
import { useSaveIndicator } from "@/contexts/SaveIndicatorContext";
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

interface LogoItem {
  id: string;
  url: string;
  name: string;
  isDefault: boolean;
}

interface VisualItem {
  id: string;
  url: string;
  name: string;
}

export default function BrandKnowledge() {
  const { triggerSave } = useSaveIndicator();
  const [colors, setColors] = useState(initialColors);
  const [newColor, setNewColor] = useState("#000000");
  const [fields, setFields] = useState<KnowledgeField[]>(initialFields);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFieldTitle, setNewFieldTitle] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");
  const [deletingField, setDeletingField] = useState<string | null>(null);
  const [logos, setLogos] = useState<LogoItem[]>([]);
  const [brandVisuals, setBrandVisuals] = useState<VisualItem[]>([]);

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
    triggerSave();
  }, [triggerSave]);

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Brand Knowledge</h1>
        <p className="text-muted-foreground text-sm">Define your brand identity and visual style. Changes auto-save.</p>
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

          {/* Knowledge Fields */}
          <Card>
            <CardContent className="pt-6 space-y-6">
              {fields.map((field) => (
                <div key={field.id} className="group/field relative flex gap-2">
                  <div className="flex-1 space-y-1.5 min-w-0">
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
                    <MarkdownEditor
                      value={field.value}
                      onChange={(val) => {
                        updateFieldValue(field.id, val);
                        handleFieldChange();
                      }}
                    />
                  </div>
                  <div className="w-8 shrink-0 flex items-center justify-center">
                    <button
                      onClick={() => setDeletingField(field.id)}
                      className="opacity-0 group-hover/field:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-destructive/10"
                      aria-label={`Delete ${field.title}`}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                    </button>
                  </div>
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
          {/* Brand Logos */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Label>Brand Logos</Label>
                  <InfoTooltip text="Upload your brand logos for use in generated ad creative. The starred logo is the default used in campaigns. Supports PNG, JPEG, SVG, and WebP up to 25MB each." />
                </div>
                {logos.length === 0 ? (
                  <label className="border-2 border-dashed border-border rounded-xl p-10 text-center space-y-2 hover:border-primary/50 transition-colors cursor-pointer block">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.svg,.webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && file.size <= 25 * 1024 * 1024) {
                          const url = URL.createObjectURL(file);
                          setLogos([{ id: `logo-${Date.now()}`, url, name: file.name, isDefault: true }]);
                          triggerAutoSave();
                        }
                      }}
                    />
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">upload logo</p>
                    <p className="text-xs text-muted-foreground">(PNG, JPEG, SVG, WEBP)</p>
                    <p className="text-xs text-muted-foreground">Max 25MB per logo.</p>
                  </label>
                ) : (
                  <div className="flex gap-3 flex-wrap">
                    {logos.map((logo) => (
                      <div key={logo.id} className="relative group/logo w-[160px] h-[160px] rounded-xl border bg-muted/30 flex items-center justify-center overflow-hidden">
                        <img src={logo.url} alt={logo.name} className="max-w-full max-h-full object-contain p-2" />
                        {/* Default star */}
                        {logo.isDefault && (
                          <div className="absolute top-2 left-2">
                            <Star className="h-5 w-5 fill-primary text-primary" />
                          </div>
                        )}
                        {!logo.isDefault && (
                          <button
                            onClick={() => {
                              setLogos(logos.map(l => ({ ...l, isDefault: l.id === logo.id })));
                              triggerAutoSave();
                            }}
                            className="absolute top-2 left-2 opacity-0 group-hover/logo:opacity-100 transition-opacity"
                            aria-label="Set as default"
                          >
                            <Star className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                          </button>
                        )}
                        {/* Delete icon */}
                        <Tooltip delayDuration={200}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                if (logos.length > 1) {
                                  const remaining = logos.filter(l => l.id !== logo.id);
                                  if (logo.isDefault && remaining.length > 0) {
                                    remaining[0].isDefault = true;
                                  }
                                  setLogos(remaining);
                                  triggerAutoSave();
                                }
                              }}
                              disabled={logos.length <= 1}
                              className={`absolute top-2 right-2 opacity-0 group-hover/logo:opacity-100 transition-opacity p-1 rounded-md ${
                                logos.length <= 1
                                  ? "cursor-not-allowed text-muted-foreground/40"
                                  : "hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                              }`}
                              aria-label="Delete logo"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          {logos.length <= 1 && (
                            <TooltipContent side="top" className="text-xs">
                              At least one logo is required
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </div>
                    ))}
                    {/* Upload drop zone */}
                    <label className="w-[160px] h-[160px] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.svg,.webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && file.size <= 25 * 1024 * 1024) {
                            const url = URL.createObjectURL(file);
                            setLogos([...logos, { id: `logo-${Date.now()}`, url, name: file.name, isDefault: false }]);
                            triggerAutoSave();
                          }
                        }}
                      />
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground text-center px-2">upload logo</p>
                      <p className="text-[10px] text-muted-foreground text-center px-2">(PNG, JPEG, SVG, WEBP)</p>
                      <p className="text-[10px] text-muted-foreground text-center px-2">Max 25MB per logo.</p>
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Brand Colors */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Label>Brand Colors</Label>
                  <InfoTooltip text="Your brand's primary color palette. These hex colors are used in generated ad creative to ensure brand consistency." />
                </div>
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

          {/* Brand Visuals */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Label>Brand Visuals</Label>
                  <InfoTooltip text="Upload brand imagery such as lifestyle photos, product shots, or campaign visuals. These can be used as reference or directly in generated ads." />
                </div>
                {brandVisuals.length === 0 ? (
                  <label className="border-2 border-dashed border-border rounded-xl p-10 text-center space-y-2 hover:border-primary/50 transition-colors cursor-pointer block">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.svg,.webp"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const valid = files.filter(f => f.size <= 25 * 1024 * 1024);
                        const newVisuals = valid.map(f => ({ id: `visual-${Date.now()}-${Math.random()}`, url: URL.createObjectURL(f), name: f.name }));
                        setBrandVisuals([...brandVisuals, ...newVisuals]);
                        triggerAutoSave();
                      }}
                    />
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">Upload brand visuals</p>
                    <p className="text-xs text-muted-foreground">(PNG, JPEG, SVG, WEBP) · Max 25MB per file</p>
                  </label>
                ) : (
                  <div className="flex gap-3 flex-wrap">
                    {brandVisuals.map((visual) => (
                      <div key={visual.id} className="relative group/visual w-[120px] h-[120px] rounded-xl border bg-muted/30 flex items-center justify-center overflow-hidden">
                        <img src={visual.url} alt={visual.name} className="max-w-full max-h-full object-contain p-1" />
                        <button
                          onClick={() => {
                            setBrandVisuals(brandVisuals.filter(v => v.id !== visual.id));
                            triggerAutoSave();
                          }}
                          className="absolute top-1.5 right-1.5 opacity-0 group-hover/visual:opacity-100 transition-opacity p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                          aria-label="Delete visual"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    <label className="w-[120px] h-[120px] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.svg,.webp"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          const valid = files.filter(f => f.size <= 25 * 1024 * 1024);
                          const newVisuals = valid.map(f => ({ id: `visual-${Date.now()}-${Math.random()}`, url: URL.createObjectURL(f), name: f.name }));
                          setBrandVisuals([...brandVisuals, ...newVisuals]);
                          triggerAutoSave();
                        }}
                      />
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <p className="text-[10px] text-muted-foreground text-center px-2">Add image</p>
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
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
              <MarkdownEditor value={newFieldValue} onChange={(val) => setNewFieldValue(val)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={addNewField} disabled={!newFieldTitle.trim()}>Add Field</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingField} onOpenChange={(open) => !open && setDeletingField(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Knowledge Field</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{fields.find(f => f.id === deletingField)?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingField(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deletingField) {
                  setFields(fields.filter(f => f.id !== deletingField));
                  setDeletingField(null);
                  triggerAutoSave();
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
