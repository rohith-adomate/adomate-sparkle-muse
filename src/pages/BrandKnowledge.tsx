import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, Check, Upload, Plus, X, Pencil, Info, Star, Search, Trash2, BookOpen, Palette, ChevronDown, RefreshCw, Globe, Instagram, Facebook, Youtube } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { useSaveIndicator } from "@/contexts/SaveIndicatorContext";
import { HoverExplainer } from "@/components/HoverExplainer";
import { Badge } from "@/components/ui/badge";
import adomateLogoSquare from "@/assets/adomate_logo_1024_white_bg.png";
import imagePvd1 from "@/assets/Image_PVD_1.png";
import imagePvd2 from "@/assets/Image_PVD_2.png";
import imagePvd3 from "@/assets/Image_PVD_3.png";
import adomateLogoWide from "@/assets/adomate_logo.png";

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
  section: string;
}

const initialFields: KnowledgeField[] = [
  { id: "description", title: "Description", value: "Acme Co is a B2B SaaS platform that empowers small businesses with AI-driven advertising. We help marketing teams create, test, and optimize ad creative at scale without needing a design team.", rows: 4, section: "basics" },
  { id: "positioning", title: "Brand Positioning", value: "The easiest way for small businesses to create high-performing ads. We're not a design tool — we're an AI creative partner that understands your brand, your customers, and what converts.", rows: 3, section: "basics" },
  { id: "target-audience", title: "Target Audience", value: "Small to mid-sized business owners and marketing managers who need professional ad creative but don't have dedicated design resources.", rows: 3, section: "basics" },
  { id: "tone", title: "Tone of Voice", value: "Confident but approachable. Data-driven without being dry. We use active voice and short sentences. Avoid jargon. Speak directly to the reader. Be encouraging, not pushy.", rows: 3, section: "tone" },
  { id: "visual-style", title: "Visual Style", value: "Prefer lifestyle photography with diverse models. Avoid stock-photo aesthetics. Use warm lighting. Clean layouts with generous whitespace. Product shots should be on neutral backgrounds.", rows: 4, section: "tone" },
  { id: "do-not-say", title: "Words to Avoid", value: "Never say 'disrupting', 'synergy', 'leverage' or 'game-changer'. Don't use superlatives like 'best in class' without data.", rows: 2, section: "tone" },
];

interface SocialLink {
  id: string;
  url: string;
  platform: string;
}

function detectPlatform(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes("instagram.com") || lower.includes("instagr.am")) return "instagram";
  if (lower.includes("facebook.com") || lower.includes("fb.com")) return "facebook";
  if (lower.includes("tiktok.com")) return "tiktok";
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "youtube";
  if (lower.includes("x.com") || lower.includes("twitter.com")) return "x";
  if (lower.includes("linkedin.com")) return "linkedin";
  if (url.trim()) return "website";
  return "website";
}

function PlatformIcon({ platform, className = "h-4 w-4" }: { platform: string; className?: string }) {
  switch (platform) {
    case "instagram": return <Instagram className={`${className} text-pink-500`} />;
    case "facebook": return <Facebook className={`${className} text-blue-600`} />;
    case "youtube": return <Youtube className={`${className} text-red-500`} />;
    case "tiktok": return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.39a8.16 8.16 0 004.76 1.53V7.47a4.85 4.85 0 01-1-.78z"/>
      </svg>
    );
    case "x": return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    );
    case "linkedin": return (
      <svg className={`${className} text-blue-700`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    );
    default: return <Globe className={`${className} text-muted-foreground`} />;
  }
}

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

interface LogoItem { id: string; url: string; name: string; isDefault: boolean; }
interface VisualItem { id: string; url: string; name: string; }

function CollapsibleSection({
  title,
  summary,
  defaultOpen = true,
  children,
}: {
  title: string;
  summary?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-xl bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-sm font-semibold">{title}</h3>
          {!open && summary && (
            <span className="text-xs text-muted-foreground truncate max-w-[300px]">{summary}</span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`transition-all overflow-hidden ${open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-5 pb-5 pt-1 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
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
  const [newFieldSection, setNewFieldSection] = useState("basics");
  const [deletingField, setDeletingField] = useState<string | null>(null);
  const [logos, setLogos] = useState<LogoItem[]>([
    { id: "logo-default-1", url: adomateLogoSquare, name: "Adomate Icon", isDefault: true },
    { id: "logo-default-2", url: adomateLogoWide, name: "Adomate Logo", isDefault: false },
  ]);
  const [activeTab, setActiveTab] = useState<"knowledge" | "visual">("knowledge");
  const [brandVisuals, setBrandVisuals] = useState<VisualItem[]>([
    { id: "pvd1", name: "Image_PVD_1.png", url: imagePvd1 },
    { id: "pvd2", name: "Image_PVD_2.png", url: imagePvd2 },
    { id: "pvd3", name: "Image_PVD_3.png", url: imagePvd3 },
  ]);
  const [deletingLogoId, setDeletingLogoId] = useState<string | null>(null);
  const [deletingVisualId, setDeletingVisualId] = useState<string | null>(null);
  const [showRescrapeConfirm, setShowRescrapeConfirm] = useState(false);
  const [isRescraping, setIsRescraping] = useState(false);

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { id: "s1", url: "https://instagram.com/acmeco", platform: "instagram" },
    { id: "s2", url: "https://facebook.com/acmeco", platform: "facebook" },
    { id: "s3", url: "https://tiktok.com/@acmeco", platform: "tiktok" },
  ]);

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
    if (defaultLanguage === lang && updated.length > 0) setDefaultLanguage(updated[0]);
    triggerAutoSave();
  };

  const setAsDefault = (lang: string) => {
    setDefaultLanguage(lang);
    triggerAutoSave();
  };

  const triggerAutoSave = useCallback(() => { triggerSave(); }, [triggerSave]);

  const handleFieldChange = useCallback(() => {
    const debounce = setTimeout(() => triggerAutoSave(), 300);
    return () => clearTimeout(debounce);
  }, [triggerAutoSave]);

  const removeColor = (hex: string) => { setColors(colors.filter(c => c.hex !== hex)); triggerAutoSave(); };
  const addColor = () => {
    if (!colors.find(c => c.hex === newColor)) { setColors([...colors, { hex: newColor, name: newColor }]); triggerAutoSave(); }
  };

  const openEditTitle = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (field) { setEditTitle(field.title); setEditingField(fieldId); }
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
      setFields([...fields, { id, title: newFieldTitle.trim(), value: newFieldValue, rows: 3, section: newFieldSection }]);
      setNewFieldTitle("");
      setNewFieldValue("");
      setShowAddModal(false);
      triggerAutoSave();
    }
  };

  const updateFieldValue = (fieldId: string, value: string) => {
    setFields(fields.map(f => f.id === fieldId ? { ...f, value } : f));
  };

  const handleRescrape = () => {
    setShowRescrapeConfirm(false);
    setIsRescraping(true);
    setTimeout(() => { setIsRescraping(false); triggerAutoSave(); }, 3000);
  };

  const updateSocialLink = (id: string, url: string) => {
    setSocialLinks(prev => prev.map(l => l.id === id ? { ...l, url, platform: detectPlatform(url) } : l));
    triggerAutoSave();
  };

  const addSocialLink = () => {
    setSocialLinks(prev => [...prev, { id: `s-${Date.now()}`, url: "", platform: "website" }]);
  };

  const removeSocialLink = (id: string) => {
    setSocialLinks(prev => prev.filter(l => l.id !== id));
    triggerAutoSave();
  };

  const basicsFields = fields.filter(f => f.section === "basics");
  const toneFields = fields.filter(f => f.section === "tone");

  const getSectionSummary = (sectionFields: KnowledgeField[]) => {
    const filled = sectionFields.filter(f => f.value.trim());
    if (filled.length === 0) return "No content yet";
    return `${filled.length} field${filled.length > 1 ? "s" : ""}: ${filled.map(f => f.title).join(", ")}`;
  };

  const socialSummary = socialLinks.filter(l => l.url.trim()).length > 0
    ? socialLinks.filter(l => l.url.trim()).map(l => l.platform).join(", ")
    : "No links added";

  const renderFieldGroup = (sectionFields: KnowledgeField[]) => (
    <>
      {sectionFields.map((field) => (
        <div key={field.id} className="group/field relative flex gap-2">
          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="flex items-center gap-1.5 group">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{field.title}</Label>
              <button
                onClick={() => openEditTitle(field.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-accent"
              >
                <Pencil className="h-2.5 w-2.5 text-muted-foreground" />
              </button>
            </div>
            <MarkdownEditor
              value={field.value}
              onChange={(val) => { updateFieldValue(field.id, val); handleFieldChange(); }}
            />
          </div>
          <div className="w-6 shrink-0 flex items-start pt-6">
            <button
              onClick={() => setDeletingField(field.id)}
              className="opacity-0 group-hover/field:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive transition-colors" />
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() => setShowAddModal(true)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors py-1"
      >
        <Plus className="h-3.5 w-3.5" /> Add field
      </button>
    </>
  );

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Breadcrumbs items={[{ label: "Data Room", href: "/brand-data-room" }, { label: "Brand Brain" }]} />

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Brand Brain</h1>
          <p className="text-muted-foreground text-sm">Define your brand identity and visual style. Changes auto-save.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 shrink-0"
          onClick={() => setShowRescrapeConfirm(true)}
          disabled={isRescraping}
        >
          {isRescraping ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          {isRescraping ? "Scraping…" : "Re-scrape website"}
        </Button>
      </div>

      {/* Brand Info Card */}
      <Card>
        <CardContent className="pt-6 space-y-5">
          <div className="flex gap-5">
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab("visual")}
                  className="h-24 w-24 rounded-xl border bg-muted/30 overflow-hidden shrink-0 cursor-pointer hover:border-primary/50 transition-colors flex items-center justify-center"
                >
                  {(() => {
                    const defaultLogo = logos.find(l => l.isDefault);
                    return defaultLogo ? (
                      <img src={defaultLogo.url} alt={defaultLogo.name} className="max-w-[70%] max-h-[70%] object-contain" />
                    ) : (
                      <Star className="h-6 w-6 text-muted-foreground/40" />
                    );
                  })()}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs text-xs leading-relaxed">
                <p>The brand logo can be changed by starring a different logo in the Visual Style tab.</p>
              </TooltipContent>
            </Tooltip>

            <div className="flex-1 space-y-5 min-w-0">
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
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Label>Ad Languages</Label>
              <InfoTooltip text="Choose the languages your brand uses for ad creation. The starred language is the default used unless another language is selected." />
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedLanguages.map((lang) => (
                <Badge key={lang} variant="secondary" className="gap-1.5 py-1 px-2.5 text-xs font-medium">
                  <Tooltip delayDuration={600}>
                    <TooltipTrigger asChild>
                      <button onClick={() => setAsDefault(lang)} className="shrink-0">
                        <Star className={`h-3 w-3 transition-colors ${defaultLanguage === lang ? "fill-primary text-primary" : "text-muted-foreground/40 hover:text-muted-foreground"}`} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {defaultLanguage === lang ? "Default language" : "Set as default language"}
                    </TooltipContent>
                  </Tooltip>
                  {lang}
                  <button onClick={() => removeLanguage(lang)} className="shrink-0 hover:text-destructive transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Popover open={langPopoverOpen} onOpenChange={setLangPopoverOpen}>
                <PopoverTrigger asChild>
                  <button className="h-7 px-2.5 rounded-md border border-dashed border-muted-foreground/30 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center gap-1">
                    <Plus className="h-3 w-3" /> Add language
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2" align="start">
                  <div className="flex items-center gap-2 border-b pb-2 mb-1">
                    <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <input value={langSearch} onChange={(e) => setLangSearch(e.target.value)} placeholder="Search languages..." className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground" autoFocus />
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-0.5">
                    {filteredLanguages.length === 0 ? (
                      <p className="text-xs text-muted-foreground p-2 text-center">No languages found</p>
                    ) : (
                      filteredLanguages.map((lang) => (
                        <button key={lang} onClick={() => addLanguage(lang)} className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-accent transition-colors">
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

      {/* Pill Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-full bg-muted p-1 gap-1">
          <button onClick={() => setActiveTab("knowledge")} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "knowledge" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Knowledge</span>
          </button>
          <button onClick={() => setActiveTab("visual")} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "visual" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            <span className="flex items-center gap-1.5"><Palette className="h-3.5 w-3.5" /> Visual Style</span>
          </button>
        </div>
      </div>

      {activeTab === "knowledge" && (
        <div className="space-y-3">
          <CollapsibleSection title="Brand basics" summary={getSectionSummary(basicsFields)}>
            {renderFieldGroup(basicsFields)}
          </CollapsibleSection>

          <CollapsibleSection title="Tone & voice" summary={getSectionSummary(toneFields)}>
            {renderFieldGroup(toneFields)}
          </CollapsibleSection>

          <CollapsibleSection title="Links & socials" summary={socialSummary} defaultOpen={false}>
            <div className="space-y-2">
              {socialLinks.map((link) => (
                <div key={link.id} className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                    <PlatformIcon platform={link.platform} className="h-4 w-4" />
                  </div>
                  <Input
                    value={link.url}
                    onChange={(e) => updateSocialLink(link.id, e.target.value)}
                    placeholder="https://..."
                    className="h-8 text-sm flex-1"
                  />
                  <button
                    onClick={() => removeSocialLink(link.id)}
                    className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={addSocialLink}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors py-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add link
              </button>
            </div>
          </CollapsibleSection>
        </div>
      )}

      {activeTab === "visual" && (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Label>Brand Logos</Label>
                  <InfoTooltip text="Upload up to 6 brand logos for use in generated ad creative. The yellow star indicates the default logo used in campaigns." />
                </div>
                {logos.length === 0 ? (
                  <label className="border-2 border-dashed border-border rounded-xl p-10 text-center space-y-2 hover:border-primary/50 transition-colors cursor-pointer block">
                    <input type="file" accept=".png,.jpg,.jpeg,.svg,.webp" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && file.size <= 25 * 1024 * 1024) {
                        const url = URL.createObjectURL(file);
                        setLogos([{ id: `logo-${Date.now()}`, url, name: file.name, isDefault: true }]);
                        triggerAutoSave();
                      }
                    }} />
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">Upload logo(s)</p>
                    <p className="text-xs text-muted-foreground">Max 25MB per logo · Up to 6 logos</p>
                  </label>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {logos.map((logo) => (
                      <div key={logo.id} className="relative group/logo aspect-square rounded-xl border bg-muted/30 flex items-center justify-center overflow-hidden">
                        <img src={logo.url} alt={logo.name} className="max-w-[70%] max-h-[70%] object-contain" />
                        <Tooltip delayDuration={200}>
                          <TooltipTrigger asChild>
                            <button onClick={() => { if (!logo.isDefault) { setLogos(logos.map(l => ({ ...l, isDefault: l.id === logo.id }))); triggerAutoSave(); } }}
                              className={`absolute top-2 left-2 p-1.5 rounded-md transition-all ${logo.isDefault ? "opacity-100" : "opacity-0 group-hover/logo:opacity-100 bg-white shadow-sm"}`}>
                              <Star className={`h-5 w-5 transition-colors ${logo.isDefault ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30 hover:fill-yellow-400 hover:text-yellow-400"}`} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">{logo.isDefault ? "This is the default logo" : "Click to set as default logo"}</TooltipContent>
                        </Tooltip>
                        <Tooltip delayDuration={200}>
                          <TooltipTrigger asChild>
                            <button onClick={() => { if (logos.length > 1) setDeletingLogoId(logo.id); }} disabled={logos.length <= 1}
                              className={`absolute top-2 right-2 opacity-0 group-hover/logo:opacity-100 transition-all p-1.5 rounded-md ${logos.length <= 1 ? "cursor-not-allowed text-muted-foreground/40" : "bg-white text-muted-foreground shadow-sm hover:bg-red-100 hover:text-destructive"}`}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">{logos.length <= 1 ? "At least one logo is required" : "Delete this logo"}</TooltipContent>
                        </Tooltip>
                      </div>
                    ))}
                    {logos.length < 6 && (
                      <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1.5 hover:border-primary/50 transition-colors cursor-pointer">
                        <input type="file" accept=".png,.jpg,.jpeg,.svg,.webp" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && file.size <= 25 * 1024 * 1024 && logos.length < 6) {
                            const url = URL.createObjectURL(file);
                            setLogos([...logos, { id: `logo-${Date.now()}`, url, name: file.name, isDefault: false }]);
                            triggerAutoSave();
                          }
                        }} />
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground text-center px-2">Upload logo(s)</p>
                      </label>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Label>Brand Colors</Label>
                  <InfoTooltip text="Your brand's primary color palette. These hex colors are used in generated ad creative to ensure brand consistency." />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {colors.map((c, idx) => (
                    <Popover key={c.hex + idx}>
                      <PopoverTrigger asChild>
                        <div className="group relative flex items-center gap-2.5 rounded-xl border p-2.5 pr-3 cursor-pointer hover:border-primary/50 transition-colors">
                          <div className="h-10 w-10 rounded-lg shadow-inner shrink-0" style={{ background: c.hex }} />
                          <div className="text-left min-w-0">
                            <p className="text-xs font-medium truncate">{c.name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{c.hex.toUpperCase()}</p>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); removeColor(c.hex); }} className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent side="top" className="w-auto p-3 space-y-3">
                        <input type="color" value={c.hex} onChange={(e) => { const updated = [...colors]; updated[idx] = { ...updated[idx], hex: e.target.value }; setColors(updated); triggerAutoSave(); }} className="w-52 h-36 rounded cursor-pointer border-0 p-0 block" />
                        <div className="space-y-1.5">
                          <p className="text-xs text-muted-foreground font-medium">HEX Color Code</p>
                          <Input value={c.hex.toUpperCase()} onChange={(e) => { let val = e.target.value; if (!val.startsWith("#")) val = "#" + val; if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) { const updated = [...colors]; updated[idx] = { ...updated[idx], hex: val }; setColors(updated); triggerAutoSave(); } }} className="font-mono text-sm" />
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-xs text-muted-foreground font-medium">Color Name</p>
                          <Input value={c.name} onChange={(e) => { const updated = [...colors]; updated[idx] = { ...updated[idx], name: e.target.value }; setColors(updated); triggerAutoSave(); }} className="text-sm" placeholder="e.g. Brand Blue" />
                        </div>
                      </PopoverContent>
                    </Popover>
                  ))}
                  {colors.length < 8 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="flex items-center gap-2.5 rounded-xl border-2 border-dashed border-border p-2.5 pr-3 hover:border-primary/50 transition-colors cursor-pointer">
                          <div className="h-10 w-10 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center shrink-0">
                            <Plus className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-xs text-muted-foreground">Add color</p>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent side="top" className="w-auto p-3 space-y-3">
                        <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} className="w-52 h-36 rounded cursor-pointer border-0 p-0 block" />
                        <div className="space-y-1.5">
                          <p className="text-xs text-muted-foreground font-medium">HEX Color Code</p>
                          <Input value={newColor.toUpperCase()} onChange={(e) => { let val = e.target.value; if (!val.startsWith("#")) val = "#" + val; if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) setNewColor(val); }} className="font-mono text-sm" />
                        </div>
                        <Button size="sm" className="w-full" onClick={() => addColor()}>Add Color</Button>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Label>Brand Visuals</Label>
                  <InfoTooltip text="Upload brand imagery such as lifestyle photos, product shots, or campaign visuals." />
                </div>
                {brandVisuals.length === 0 ? (
                  <label className="border-2 border-dashed border-border rounded-xl p-10 text-center space-y-2 hover:border-primary/50 transition-colors cursor-pointer block">
                    <input type="file" accept=".png,.jpg,.jpeg,.svg,.webp" multiple className="hidden" onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const valid = files.filter(f => f.size <= 25 * 1024 * 1024);
                      const newVisuals = valid.map(f => ({ id: `visual-${Date.now()}-${Math.random()}`, url: URL.createObjectURL(f), name: f.name }));
                      setBrandVisuals([...brandVisuals, ...newVisuals]);
                      triggerAutoSave();
                    }} />
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">Upload image(s)</p>
                    <p className="text-xs text-muted-foreground">(PNG, JPEG, WEBP) · Max 25MB per file</p>
                  </label>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    {brandVisuals.map((visual) => (
                      <div key={visual.id} className="relative group/visual aspect-square rounded-xl border bg-muted/30 flex items-center justify-center overflow-hidden">
                        <img src={visual.url} alt={visual.name} className="max-w-full max-h-full object-contain p-1" />
                        <button onClick={() => setDeletingVisualId(visual.id)} className="absolute top-2 right-2 opacity-0 group-hover/visual:opacity-100 transition-all p-1.5 rounded-md bg-white text-muted-foreground shadow-sm hover:bg-red-100 hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-colors cursor-pointer">
                      <input type="file" accept=".png,.jpg,.jpeg,.svg,.webp" multiple className="hidden" onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const valid = files.filter(f => f.size <= 25 * 1024 * 1024);
                        const newVisuals = valid.map(f => ({ id: `visual-${Date.now()}-${Math.random()}`, url: URL.createObjectURL(f), name: f.name }));
                        setBrandVisuals([...brandVisuals, ...newVisuals]);
                        triggerAutoSave();
                      }} />
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <p className="text-[10px] text-muted-foreground text-center px-2">Upload image(s)</p>
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={showRescrapeConfirm} onOpenChange={setShowRescrapeConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Re-scrape website?</DialogTitle>
            <DialogDescription>
              This will fetch the latest information from your website and may overwrite fields you've manually edited. Social links and custom fields will be preserved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRescrapeConfirm(false)}>Cancel</Button>
            <Button onClick={handleRescrape}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Re-scrape
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingField} onOpenChange={(open) => !open && setEditingField(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Field Title</DialogTitle></DialogHeader>
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

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add Knowledge Field</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={newFieldTitle} onChange={(e) => setNewFieldTitle(e.target.value)} placeholder="e.g. Target Audience" autoFocus />
            </div>
            <div className="space-y-2">
              <Label>Section</Label>
              <div className="flex gap-2">
                {[{ key: "basics", label: "Brand basics" }, { key: "tone", label: "Tone & voice" }].map(s => (
                  <button
                    key={s.key}
                    onClick={() => setNewFieldSection(s.key)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${newFieldSection === s.key ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-transparent hover:border-border"}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
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
            <Button variant="destructive" onClick={() => {
              if (deletingField) { setFields(fields.filter(f => f.id !== deletingField)); setDeletingField(null); triggerAutoSave(); }
            }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingLogoId} onOpenChange={(open) => !open && setDeletingLogoId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Delete Logo</DialogTitle><DialogDescription>Are you sure? This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingLogoId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              if (deletingLogoId) {
                const logo = logos.find(l => l.id === deletingLogoId);
                const remaining = logos.filter(l => l.id !== deletingLogoId);
                if (logo?.isDefault && remaining.length > 0) remaining[0].isDefault = true;
                setLogos(remaining);
                setDeletingLogoId(null);
                triggerAutoSave();
              }
            }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingVisualId} onOpenChange={(open) => !open && setDeletingVisualId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Delete Visual</DialogTitle><DialogDescription>Are you sure? This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingVisualId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              if (deletingVisualId) { setBrandVisuals(brandVisuals.filter(v => v.id !== deletingVisualId)); setDeletingVisualId(null); triggerAutoSave(); }
            }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
