import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Upload, Star, Info, ArrowLeft, BookOpen, ImageIcon, Check, X } from "lucide-react";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { useSaveIndicator } from "@/contexts/SaveIndicatorContext";

const productData: Record<string, { name: string; url: string; imgSeed: string; imageCount: number }> = {
  "1": { name: "Hydra Glow Serum", url: "https://acmeco.com/hydra-glow-serum", imgSeed: "serum", imageCount: 6 },
  "2": { name: "Gentle Foam Cleanser", url: "https://acmeco.com/gentle-foam-cleanser", imgSeed: "cleanser", imageCount: 4 },
  "3": { name: "Vitamin C Brightening Cream", url: "https://acmeco.com/vitamin-c-cream", imgSeed: "vitaminc", imageCount: 8 },
  "4": { name: "Retinol Night Repair", url: "https://acmeco.com/retinol-night-repair", imgSeed: "retinol", imageCount: 3 },
  "5": { name: "SPF 50 Daily Shield", url: "https://acmeco.com/spf-50", imgSeed: "sunscreen", imageCount: 5 },
  "6": { name: "Rose Petal Toner", url: "https://acmeco.com/rose-petal-toner", imgSeed: "toner", imageCount: 2 },
  "7": { name: "Collagen Boost Mask", url: "https://acmeco.com/collagen-mask", imgSeed: "mask", imageCount: 7 },
  "8": { name: "Tea Tree Oil Spot Treatment", url: "https://acmeco.com/tea-tree-oil", imgSeed: "teatree", imageCount: 1 },
};

function getImageUrl(seed: string, idx: number, w = 300, h = 300) {
  return `https://picsum.photos/seed/${seed}${idx}/${w}/${h}`;
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

interface KnowledgeField {
  id: string;
  title: string;
  value: string;
}

const defaultFields: KnowledgeField[] = [
  { id: "description", title: "Description", value: "A lightweight, deeply hydrating serum formulated with hyaluronic acid and vitamin B5 to lock in moisture and leave skin plump and glowing." },
  { id: "ingredients", title: "Key Ingredients", value: "- Hyaluronic Acid (1.5%)\n- Vitamin B5 (Panthenol)\n- Niacinamide\n- Aloe Vera Extract\n- Glycerin" },
];

interface ProductImage {
  id: string;
  url: string;
  name: string;
  isHero: boolean;
}

// ─── Knowledge Section ───
function KnowledgeSection({
  fields, openEditTitle, setDeletingField, updateFieldValue, handleFieldChange, setShowAddModal,
}: {
  fields: KnowledgeField[];
  openEditTitle: (id: string) => void;
  setDeletingField: (id: string) => void;
  updateFieldValue: (id: string, val: string) => void;
  handleFieldChange: () => void;
  setShowAddModal: (v: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <div key={field.id} className="group/field relative flex gap-2">
          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="flex items-center gap-1.5 group">
              <Label>{field.title}</Label>
              <button onClick={() => openEditTitle(field.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-accent">
                <Pencil className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
            <MarkdownEditor value={field.value} onChange={(val) => { updateFieldValue(field.id, val); handleFieldChange(); }} />
          </div>
          <div className="w-8 shrink-0 flex items-center justify-center">
            <button onClick={() => setDeletingField(field.id)} className="opacity-0 group-hover/field:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-destructive/10">
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-center pt-2">
        <button onClick={() => setShowAddModal(true)} className="h-8 w-8 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-primary hover:text-primary transition-colors text-muted-foreground">
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Images Section (Brand Logos style, 4 columns) ───
function ImagesSection({
  images, setHeroImage, deleteImage, handleImageUpload,
}: {
  images: ProductImage[];
  setHeroImage: (id: string) => void;
  deleteImage: (id: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1.5">
        <Label className="text-sm font-medium">Product Images</Label>
        <InfoTooltip text="Upload product images. The starred image is the hero image used on the product card. Supports PNG, JPEG, SVG, and WebP up to 25MB each." />
      </div>
      {images.length === 0 ? (
        <label className="border-2 border-dashed border-border rounded-xl p-10 text-center space-y-2 hover:border-primary/50 transition-colors cursor-pointer block">
          <input type="file" accept=".png,.jpg,.jpeg,.svg,.webp" multiple className="hidden" onChange={handleImageUpload} />
          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-sm font-medium">Upload product images</p>
          <p className="text-xs text-muted-foreground">(PNG, JPEG, SVG, WEBP)</p>
          <p className="text-xs text-muted-foreground">Max 25MB per image</p>
        </label>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group/img aspect-square rounded-xl border bg-muted/30 flex items-center justify-center overflow-hidden">
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              {/* Star icon - always visible, matches brand logos styling */}
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setHeroImage(img.id)}
                    className={`absolute top-2 left-2 p-0.5 transition-opacity ${
                      img.isHero ? "opacity-100" : "opacity-0 group-hover/img:opacity-100"
                    }`}
                    aria-label={img.isHero ? "Hero product image" : "Set as hero image"}
                  >
                    <Star
                      className={`h-5 w-5 transition-colors ${
                        img.isHero
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/30 hover:fill-yellow-400 hover:text-yellow-400"
                      }`}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {img.isHero ? "This is the hero product image" : "Click to set as hero image"}
                </TooltipContent>
              </Tooltip>
              {/* Delete icon - hover reveal, matches brand logos styling */}
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => deleteImage(img.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover/img:opacity-100 transition-all p-1.5 rounded-lg hover:bg-muted text-muted-foreground/60"
                    aria-label="Delete image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">Delete this image</TooltipContent>
              </Tooltip>
            </div>
          ))}
          {/* Upload card in grid - matches brand logos upload card */}
          <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1.5 hover:border-primary/50 transition-colors cursor-pointer">
            <input type="file" accept=".png,.jpg,.jpeg,.svg,.webp" multiple className="hidden" onChange={handleImageUpload} />
            <Upload className="h-6 w-6 text-muted-foreground" />
            <p className="text-xs text-muted-foreground text-center px-2">Upload image</p>
            <p className="text-[10px] text-muted-foreground text-center px-2">(PNG, JPEG, SVG, WEBP)</p>
            <p className="text-[10px] text-muted-foreground text-center px-2">Max 25MB per image</p>
          </label>
        </div>
      )}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { triggerSave } = useSaveIndicator();
  const product = id ? productData[id] : null;

  const [productName, setProductName] = useState(product?.name ?? "");
  const [productUrl, setProductUrl] = useState(product?.url ?? "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(product?.name ?? "");
  const [fields, setFields] = useState<KnowledgeField[]>(defaultFields);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFieldTitle, setNewFieldTitle] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");
  const [deletingField, setDeletingField] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"knowledge" | "images">("knowledge");

  const [images, setImages] = useState<ProductImage[]>(() => {
    if (!product) return [];
    return Array.from({ length: product.imageCount }).map((_, i) => ({
      id: `img-${i}`,
      url: getImageUrl(product.imgSeed, i),
      name: `${product.name} image ${i + 1}`,
      isHero: i === 0,
    }));
  });

  const heroImage = images.find(img => img.isHero);

  const triggerAutoSave = useCallback(() => { triggerSave(); }, [triggerSave]);
  const handleFieldChange = useCallback(() => { const d = setTimeout(() => triggerAutoSave(), 300); return () => clearTimeout(d); }, [triggerAutoSave]);

  const openEditTitle = (fieldId: string) => { const f = fields.find(x => x.id === fieldId); if (f) { setEditTitle(f.title); setEditingField(fieldId); } };
  const saveEditTitle = () => { if (editingField && editTitle.trim()) { setFields(fields.map(f => f.id === editingField ? { ...f, title: editTitle.trim() } : f)); setEditingField(null); triggerAutoSave(); } };
  const addNewField = () => { if (newFieldTitle.trim()) { setFields([...fields, { id: `custom-${Date.now()}`, title: newFieldTitle.trim(), value: newFieldValue }]); setNewFieldTitle(""); setNewFieldValue(""); setShowAddModal(false); triggerAutoSave(); } };
  const deleteField = (fieldId: string) => { setFields(fields.filter(f => f.id !== fieldId)); setDeletingField(null); triggerAutoSave(); };
  const updateFieldValue = (fieldId: string, value: string) => { setFields(fields.map(f => f.id === fieldId ? { ...f, value } : f)); };
  const setHeroImage = (imageId: string) => { setImages(images.map(img => ({ ...img, isHero: img.id === imageId }))); triggerAutoSave(); };
  const deleteImage = (imageId: string) => { const u = images.filter(img => img.id !== imageId); if (u.length > 0 && !u.some(img => img.isHero)) u[0].isHero = true; setImages(u); triggerAutoSave(); };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files; if (!f) return; Array.from(f).forEach(file => { if (file.size <= 25 * 1024 * 1024) { const url = URL.createObjectURL(file); setImages(prev => [...prev, { id: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`, url, name: file.name, isHero: prev.length === 0 }]); } }); triggerAutoSave(); };

  const saveName = () => {
    if (editNameValue.trim()) {
      setProductName(editNameValue.trim());
      setIsEditingName(false);
      triggerAutoSave();
    }
  };

  const cancelEditName = () => {
    setEditNameValue(productName);
    setIsEditingName(false);
  };

  const knowledgeProps = { fields, openEditTitle, setDeletingField: (id: string) => setDeletingField(id), updateFieldValue, handleFieldChange, setShowAddModal };
  const imageProps = { images, setHeroImage, deleteImage, handleImageUpload };

  if (!product) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Breadcrumbs items={[{ label: "Brand Data Room", href: "/brand-data-room" }, { label: "Products", href: "/brand-data-room/products" }, { label: "Not Found" }]} />
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Breadcrumbs items={[
        { label: "Brand Data Room", href: "/brand-data-room" },
        { label: "Products", href: "/brand-data-room/products" },
        { label: productName },
      ]} />

      {/* Header with back button and editable title */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => navigate("/brand-data-room/products")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={editNameValue}
                onChange={(e) => setEditNameValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") cancelEditName(); }}
                className="text-2xl font-bold h-auto py-1 px-2"
                autoFocus
              />
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={saveName}>
                <Check className="h-4 w-4 text-primary" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={cancelEditName}>
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <h1 className="text-2xl font-bold tracking-tight truncate">{productName}</h1>
              <button
                onClick={() => { setEditNameValue(productName); setIsEditingName(true); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-accent shrink-0"
                aria-label="Edit product name"
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          )}
          <p className="text-muted-foreground text-sm">Edit product details. Changes auto-save.</p>
        </div>
      </div>

      {/* Product Info Card with Hero Image */}
      <Card>
        <CardContent className="pt-6 space-y-5">
          <div className="flex gap-5">
            {/* Hero Image Preview - clickable to switch to images tab */}
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveSection("images")}
                  className="h-24 w-24 rounded-xl border bg-muted/30 overflow-hidden shrink-0 cursor-pointer hover:border-primary/50 transition-colors flex items-center justify-center"
                >
                  {heroImage ? (
                    <img src={heroImage.url} alt="Hero" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs text-xs leading-relaxed">
                <p>The hero image can be changed by uploading new product images and setting one as the hero using the star icon.</p>
              </TooltipContent>
            </Tooltip>

            <div className="flex-1 space-y-5 min-w-0">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Label>Product Name</Label>
                  <InfoTooltip text="The display name of your product. Used in ad copy generation and campaign briefs." />
                </div>
                <Input value={productName} onChange={(e) => setProductName(e.target.value)} onBlur={handleFieldChange} />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Label>Product URL</Label>
                  <InfoTooltip text="The product's landing page URL. Helps the AI understand product positioning and features." />
                </div>
                <Input value={productUrl} onChange={(e) => setProductUrl(e.target.value)} onBlur={handleFieldChange} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pill Toggle */}
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="inline-flex rounded-full bg-muted p-1 gap-1">
            <button onClick={() => setActiveSection("knowledge")} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeSection === "knowledge" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Knowledge</span>
            </button>
            <button onClick={() => setActiveSection("images")} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeSection === "images" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              <span className="flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5" /> Images</span>
            </button>
          </div>
        </div>
        <Card><CardContent className="pt-6">
          {activeSection === "knowledge" ? <KnowledgeSection {...knowledgeProps} /> : <ImagesSection {...imageProps} />}
        </CardContent></Card>
      </div>

      {/* Dialogs */}
      <Dialog open={!!editingField} onOpenChange={(open) => !open && setEditingField(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Field Title</DialogTitle><DialogDescription>Change the title of this knowledge field.</DialogDescription></DialogHeader>
          <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveEditTitle()} autoFocus />
          <DialogFooter><Button variant="outline" onClick={() => setEditingField(null)}>Cancel</Button><Button onClick={saveEditTitle} disabled={!editTitle.trim()}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add Knowledge Field</DialogTitle><DialogDescription>Create a new knowledge field for this product.</DialogDescription></DialogHeader>
          <div className="space-y-3"><div className="space-y-1.5"><Label>Field Title</Label><Input value={newFieldTitle} onChange={(e) => setNewFieldTitle(e.target.value)} placeholder="e.g. Target Audience, USP" autoFocus /></div></div>
          <DialogFooter><Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button><Button onClick={addNewField} disabled={!newFieldTitle.trim()}>Add Field</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingField} onOpenChange={(open) => !open && setDeletingField(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Delete Field</DialogTitle><DialogDescription>Are you sure you want to delete "{fields.find(f => f.id === deletingField)?.title}"? This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setDeletingField(null)}>Cancel</Button><Button variant="destructive" onClick={() => deletingField && deleteField(deletingField)}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
