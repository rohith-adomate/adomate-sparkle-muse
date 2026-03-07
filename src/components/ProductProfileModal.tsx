import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import {
  Upload, Trash2, Star, Plus, Package, Globe, Pencil, Link2
} from "lucide-react";

const MAX_IMAGE_SIZE_MB = 25;
const ACCEPTED_IMAGE_TYPES = ".png,.jpg,.jpeg,.svg,.webp";

interface ProductImage {
  id: string;
  name: string;
  url: string;
  isHero: boolean;
}

interface KnowledgeField {
  id: string;
  title: string;
  value: string;
}

export interface ProductProfileData {
  name: string;
  description: string;
  websiteUrl: string;
  images: ProductImage[];
  knowledgeFields: KnowledgeField[];
}

interface ProductProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ProductProfileData;
  onDataChange: (data: ProductProfileData) => void;
}

export function ProductProfileModal({ open, onOpenChange, data, onDataChange }: ProductProfileModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const update = useCallback((partial: Partial<ProductProfileData>) => {
    onDataChange({ ...data, ...partial });
  }, [data, onDataChange]);

  // ─── Images ───────────────────────────────────────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const toAdd = Array.from(files).filter(f => f.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024);

    const newImages: ProductImage[] = toAdd.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      url: URL.createObjectURL(file),
      isHero: data.images.length === 0,
    }));

    update({ images: [...data.images, ...newImages] });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const setHeroImage = (id: string) => {
    update({
      images: data.images.map(img => ({ ...img, isHero: img.id === id })),
    });
  };

  const deleteImage = (id: string) => {
    if (data.images.length <= 1) return;
    const remaining = data.images.filter(img => img.id !== id);
    if (!remaining.some(img => img.isHero) && remaining.length > 0) {
      remaining[0].isHero = true;
    }
    update({ images: remaining });
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
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
            {data.name || "Product"} — Full Profile
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-80px)]">
          <div className="flex flex-col lg:flex-row gap-0 lg:gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
            {/* ═══ LEFT COLUMN: Product Images ═══ */}
            <div className="lg:w-[380px] shrink-0 p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Product Images</Label>
                  <span className="text-[10px] text-muted-foreground">
                    At least one image required · ★ = Hero
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {data.images.map((img) => (
                    <div
                      key={img.id}
                      className="group relative aspect-square rounded-xl border-2 border-border bg-muted/50 flex items-center justify-center overflow-hidden"
                    >
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Star (hero) badge */}
                      {img.isHero && (
                        <div className="absolute top-2 left-2">
                          <Star className="h-5 w-5 fill-warning text-warning" />
                        </div>
                      )}
                      {!img.isHero && (
                        <button
                          type="button"
                          onClick={() => setHeroImage(img.id)}
                          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Set as hero image"
                        >
                          <Star className="h-5 w-5 text-muted-foreground hover:text-warning transition-colors" />
                        </button>
                      )}
                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => deleteImage(img.id)}
                        className={`absolute top-2 right-2 p-1 rounded bg-background/80 border border-border opacity-0 group-hover:opacity-100 transition-opacity ${
                          data.images.length <= 1 ? "cursor-not-allowed text-muted-foreground/40" : "text-muted-foreground hover:text-destructive"
                        }`}
                        disabled={data.images.length <= 1}
                        title={data.images.length <= 1 ? "At least one image is required" : "Delete image"}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Upload placeholder — always visible (unlimited uploads) */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-[11px] font-medium text-muted-foreground">Upload image</p>
                      <p className="text-[9px] text-muted-foreground/70">(PNG, JPEG, SVG, WEBP)</p>
                      <p className="text-[9px] text-muted-foreground/70">Max {MAX_IMAGE_SIZE_MB}MB per file</p>
                    </div>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES}
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* ═══ RIGHT COLUMN: Knowledge ═══ */}
            <div className="flex-1 p-6 space-y-5">
              {/* Product URL */}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" /> Product URL
                </Label>
                <Input
                  value={data.websiteUrl}
                  onChange={(e) => update({ websiteUrl: e.target.value })}
                  placeholder="https://example.com/product"
                />
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
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Pencil className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                          </button>
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        onClick={() => deleteField(field.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
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
                  className="gap-1.5 w-full"
                  onClick={addField}
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
