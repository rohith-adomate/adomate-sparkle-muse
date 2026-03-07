import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import {
  Upload, Trash2, Star, Plus, X, Globe, Pencil, Link2, Info, ImageIcon
} from "lucide-react";

const AVAILABLE_LANGUAGES = [
  "American English", "British English", "French", "German", "Spanish",
  "Italian", "Dutch", "Portuguese", "Japanese", "Korean",
  "Mandarin Chinese", "Arabic", "Swedish", "Danish", "Norwegian",
  "Finnish", "Polish", "Czech", "Turkish", "Hindi"
];

const MAX_LOGOS = 6;
const MAX_LOGO_SIZE_MB = 25;
const MAX_ASSET_SIZE_MB = 25;
const ACCEPTED_LOGO_TYPES = ".png,.jpg,.jpeg,.svg,.webp";
const ACCEPTED_ASSET_TYPES = ".png,.jpg,.jpeg,.svg,.webp";

interface LogoFile {
  id: string;
  name: string;
  url: string;
  isDefault: boolean;
}

interface AssetFile {
  id: string;
  name: string;
  url: string;
}

interface KnowledgeField {
  id: string;
  title: string;
  value: string;
}

interface LanguageEntry {
  name: string;
  isDefault: boolean;
}

export interface BrandProfileData {
  name: string;
  description: string;
  websiteUrl: string;
  socialLinks: string;
  colors: string[];
  logos: LogoFile[];
  assets: AssetFile[];
  languages: LanguageEntry[];
  knowledgeFields: KnowledgeField[];
}

interface BrandProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: BrandProfileData;
  onDataChange: (data: BrandProfileData) => void;
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground cursor-help transition-colors" />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[240px] text-xs">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function BrandProfileModal({ open, onOpenChange, data, onDataChange }: BrandProfileModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const assetInputRef = useRef<HTMLInputElement>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const update = useCallback((partial: Partial<BrandProfileData>) => {
    onDataChange({ ...data, ...partial });
  }, [data, onDataChange]);

  // ─── Logos ────────────────────────────────────────────────────────────────
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = MAX_LOGOS - data.logos.length;
    const toAdd = Array.from(files).slice(0, remaining);

    const newLogos: LogoFile[] = toAdd.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      url: URL.createObjectURL(file),
      isDefault: data.logos.length === 0,
    }));

    update({ logos: [...data.logos, ...newLogos] });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const setDefaultLogo = (id: string) => {
    update({
      logos: data.logos.map(l => ({ ...l, isDefault: l.id === id })),
    });
  };

  const deleteLogo = (id: string) => {
    if (data.logos.length <= 1) return;
    const remaining = data.logos.filter(l => l.id !== id);
    if (!remaining.some(l => l.isDefault) && remaining.length > 0) {
      remaining[0].isDefault = true;
    }
    update({ logos: remaining });
  };

  // ─── Assets ───────────────────────────────────────────────────────────────
  const handleAssetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const toAdd = Array.from(files).filter(f => f.size <= MAX_ASSET_SIZE_MB * 1024 * 1024);

    const newAssets: AssetFile[] = toAdd.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    update({ assets: [...(data.assets || []), ...newAssets] });
    if (assetInputRef.current) assetInputRef.current.value = "";
  };

  const deleteAsset = (id: string) => {
    update({ assets: (data.assets || []).filter(a => a.id !== id) });
  };

  // ─── Languages ────────────────────────────────────────────────────────────
  const addLanguage = (lang: string) => {
    if (data.languages.some(l => l.name === lang)) return;
    update({
      languages: [...data.languages, { name: lang, isDefault: data.languages.length === 0 }],
    });
  };

  const removeLanguage = (lang: string) => {
    const remaining = data.languages.filter(l => l.name !== lang);
    if (!remaining.some(l => l.isDefault) && remaining.length > 0) {
      remaining[0].isDefault = true;
    }
    update({ languages: remaining });
  };

  const setDefaultLanguage = (lang: string) => {
    update({
      languages: data.languages.map(l => ({ ...l, isDefault: l.name === lang })),
    });
  };

  // ─── Colors ───────────────────────────────────────────────────────────────
  const updateColor = (index: number, hex: string) => {
    const newColors = [...data.colors];
    newColors[index] = hex;
    update({ colors: newColors });
  };

  const addColor = () => {
    update({ colors: [...data.colors, "#000000"] });
  };

  const removeColor = (index: number) => {
    update({ colors: data.colors.filter((_, i) => i !== index) });
  };

  // ─── Knowledge Fields ────────────────────────────────────────────────────
  const updateFieldValue = (id: string, value: string) => {
    update({
      knowledgeFields: data.knowledgeFields.map(f => f.id === id ? { ...f, value } : f),
    });
  };

  const updateFieldTitle = (id: string, title: string) => {
    update({
      knowledgeFields: data.knowledgeFields.map(f => f.id === id ? { ...f, title } : f),
    });
    setEditingFieldId(null);
  };

  const deleteField = (id: string) => {
    update({
      knowledgeFields: data.knowledgeFields.filter(f => f.id !== id),
    });
  };

  const addField = () => {
    update({
      knowledgeFields: [...data.knowledgeFields, {
        id: crypto.randomUUID(),
        title: "New Field",
        value: "",
      }],
    });
  };

  const startEditTitle = (id: string) => {
    const field = data.knowledgeFields.find(f => f.id === id);
    if (field) {
      setEditingFieldId(id);
      setEditingTitle(field.title);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="h-10 w-10 rounded-xl border-2 border-border bg-muted flex items-center justify-center">
              <Globe className="h-5 w-5 text-muted-foreground" />
            </div>
            {data.name || "Brand"} — Full Profile
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-80px)]">
          <div className="flex flex-col lg:flex-row gap-0 lg:gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
            {/* ═══ LEFT COLUMN: Files & Colors ═══ */}
            <div className="lg:w-[380px] shrink-0 p-6 space-y-6">
              {/* Brand Logos */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Label className="text-sm font-semibold">Brand Logos</Label>
                    <InfoTooltip text="Your brand's logo files used across ads and campaigns. The starred logo is the primary one. Upload up to 6 logos." />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {data.logos.length}/{MAX_LOGOS}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {data.logos.map((logo) => (
                    <div
                      key={logo.id}
                      className="group relative aspect-square rounded-xl border-2 border-border bg-muted/50 flex items-center justify-center overflow-hidden"
                    >
                      <img
                        src={logo.url}
                        alt={logo.name}
                        className="max-w-full max-h-full object-contain p-3"
                      />
                      {logo.isDefault && (
                        <div className="absolute top-2 left-2">
                          <Star className="h-5 w-5 fill-warning text-warning" />
                        </div>
                      )}
                      {!logo.isDefault && (
                        <button
                          type="button"
                          onClick={() => setDefaultLogo(logo.id)}
                          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Set as default logo"
                        >
                          <Star className="h-5 w-5 text-muted-foreground hover:text-warning transition-colors" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteLogo(logo.id)}
                        className={`absolute top-2 right-2 p-1 rounded bg-background/80 border border-border opacity-0 group-hover:opacity-100 transition-opacity ${
                          data.logos.length <= 1 ? "cursor-not-allowed text-muted-foreground/40" : "text-muted-foreground hover:text-destructive"
                        }`}
                        disabled={data.logos.length <= 1}
                        title={data.logos.length <= 1 ? "At least one logo is required" : "Delete logo"}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}

                  {data.logos.length < MAX_LOGOS && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-[11px] font-medium text-muted-foreground">Upload logo</p>
                        <p className="text-[9px] text-muted-foreground/70">(PNG, JPEG, SVG, WEBP)</p>
                        <p className="text-[9px] text-muted-foreground/70">Max {MAX_LOGO_SIZE_MB}MB</p>
                      </div>
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_LOGO_TYPES}
                  multiple
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>

              {/* Brand Colors */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <Label className="text-sm font-semibold">Brand Colors</Label>
                  <InfoTooltip text="Your brand's color palette extracted from your website. These colors are used to generate on-brand ad creatives." />
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.colors.map((color, i) => (
                    <div key={i} className="group relative flex flex-col items-center gap-1">
                      <div className="relative">
                        <label className="block cursor-pointer">
                          <div
                            className="w-10 h-10 rounded-lg border-2 border-border shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => updateColor(i, e.target.value)}
                            className="sr-only"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => removeColor(i)}
                          className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </div>
                      <span className="text-[9px] text-muted-foreground font-mono">{color}</span>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addColor}
                    className="w-10 h-10 rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary/50 transition-colors"
                  >
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Brand Assets */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Label className="text-sm font-semibold">Brand Assets</Label>
                    <InfoTooltip text="Additional brand imagery like banners, icons, patterns, and lifestyle photos used in ad creative generation." />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {(data.assets || []).length} files
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(data.assets || []).map((asset) => (
                    <div
                      key={asset.id}
                      className="group relative aspect-square rounded-lg border border-border bg-muted/50 overflow-hidden"
                    >
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => deleteAsset(asset.id)}
                        className="absolute top-1.5 right-1.5 p-1 rounded bg-background/80 border border-border opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-background/80 backdrop-blur-sm px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[9px] text-muted-foreground truncate">{asset.name}</p>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => assetInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-[10px] font-medium text-muted-foreground">Upload</p>
                      <p className="text-[8px] text-muted-foreground/70">Max {MAX_ASSET_SIZE_MB}MB</p>
                    </div>
                  </button>
                </div>

                <input
                  ref={assetInputRef}
                  type="file"
                  accept={ACCEPTED_ASSET_TYPES}
                  multiple
                  onChange={handleAssetUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* ═══ RIGHT COLUMN: Knowledge ═══ */}
            <div className="flex-1 p-6 space-y-5">
              {/* Website URL */}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" /> Website URL
                  <InfoTooltip text="Your brand's primary website. This URL was used to scrape initial brand data and context." />
                </Label>
                <Input
                  value={data.websiteUrl}
                  onChange={(e) => update({ websiteUrl: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

              {/* Social Links */}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold flex items-center gap-1.5">
                  <Link2 className="h-3.5 w-3.5" /> Social Links
                  <InfoTooltip text="Links to your brand's social media profiles. Used for audience research and ad placement context." />
                </Label>
                <Input
                  value={data.socialLinks}
                  onChange={(e) => update({ socialLinks: e.target.value })}
                  placeholder="https://instagram.com/brand, https://twitter.com/brand"
                />
                <p className="text-[10px] text-muted-foreground">Comma-separated social media URLs</p>
              </div>

              {/* Target Languages */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Label className="text-sm font-semibold">Target Languages</Label>
                  <InfoTooltip text="Languages your ads will be generated in. Star a language to set it as the default for new campaigns." />
                </div>
                {data.languages.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {data.languages.map((lang) => (
                      <div
                        key={lang.name}
                        className="inline-flex items-center gap-1 rounded-full border bg-primary/5 pl-3 pr-1 py-1"
                      >
                        <span className="text-xs font-medium uppercase tracking-wide text-primary">
                          {lang.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setDefaultLanguage(lang.name)}
                          title={lang.isDefault ? "Default language" : "Set as default"}
                          className="p-0.5"
                        >
                          <Star className={`h-3.5 w-3.5 ${
                            lang.isDefault
                              ? "fill-warning text-warning"
                              : "text-muted-foreground/40 hover:text-warning"
                          } transition-colors`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeLanguage(lang.name)}
                          className="p-0.5 text-destructive/60 hover:text-destructive transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <Select onValueChange={addLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Add a language..." />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_LANGUAGES.filter(
                      (l) => !data.languages.some((dl) => dl.name === l)
                    ).map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Separator */}
              <div className="border-t border-border" />

              {/* Knowledge Fields (Markdown Editors) */}
              <div className="space-y-4">
                {data.knowledgeFields.map((field) => (
                  <div key={field.id} className="space-y-1.5">
                    <div className="flex items-center justify-between group">
                      {editingFieldId === field.id ? (
                        <div className="flex items-center gap-1.5">
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={() => updateFieldTitle(field.id, editingTitle)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") updateFieldTitle(field.id, editingTitle);
                              if (e.key === "Escape") setEditingFieldId(null);
                            }}
                            className="h-7 text-sm font-semibold w-48"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Label className="text-sm font-semibold">{field.title}</Label>
                          <button
                            type="button"
                            onClick={() => startEditTitle(field.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-accent"
                          >
                            <Pencil className="h-3 w-3 text-muted-foreground" />
                          </button>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteField(field.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                    <MarkdownEditor
                      value={field.value}
                      onChange={(val) => updateFieldValue(field.id, val)}
                    />
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={addField}
                  className="w-full border-dashed gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Knowledge Field
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
