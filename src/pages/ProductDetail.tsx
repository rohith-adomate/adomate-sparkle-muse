import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Upload, Star, Info, ArrowLeft } from "lucide-react";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { useSaveIndicator } from "@/contexts/SaveIndicatorContext";

// Mock product data
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

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { triggerSave } = useSaveIndicator();
  const product = id ? productData[id] : null;

  const [productName, setProductName] = useState(product?.name ?? "");
  const [productUrl, setProductUrl] = useState(product?.url ?? "");
  const [fields, setFields] = useState<KnowledgeField[]>(defaultFields);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFieldTitle, setNewFieldTitle] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");
  const [deletingField, setDeletingField] = useState<string | null>(null);

  // Generate mock images from seed
  const [images, setImages] = useState<ProductImage[]>(() => {
    if (!product) return [];
    return Array.from({ length: product.imageCount }).map((_, i) => ({
      id: `img-${i}`,
      url: getImageUrl(product.imgSeed, i),
      name: `${product.name} image ${i + 1}`,
      isHero: i === 0,
    }));
  });

  const triggerAutoSave = useCallback(() => {
    triggerSave();
  }, [triggerSave]);

  const handleFieldChange = useCallback(() => {
    const debounce = setTimeout(() => triggerAutoSave(), 300);
    return () => clearTimeout(debounce);
  }, [triggerAutoSave]);

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
      const newId = `custom-${Date.now()}`;
      setFields([...fields, { id: newId, title: newFieldTitle.trim(), value: newFieldValue }]);
      setNewFieldTitle("");
      setNewFieldValue("");
      setShowAddModal(false);
      triggerAutoSave();
    }
  };

  const deleteField = (fieldId: string) => {
    setFields(fields.filter(f => f.id !== fieldId));
    setDeletingField(null);
    triggerAutoSave();
  };

  const updateFieldValue = (fieldId: string, value: string) => {
    setFields(fields.map(f => f.id === fieldId ? { ...f, value } : f));
  };

  const setHeroImage = (imageId: string) => {
    setImages(images.map(img => ({ ...img, isHero: img.id === imageId })));
    triggerAutoSave();
  };

  const deleteImage = (imageId: string) => {
    const updated = images.filter(img => img.id !== imageId);
    if (updated.length > 0 && !updated.some(img => img.isHero)) {
      updated[0].isHero = true;
    }
    setImages(updated);
    triggerAutoSave();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      if (file.size <= 25 * 1024 * 1024) {
        const url = URL.createObjectURL(file);
        setImages(prev => [...prev, {
          id: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          url,
          name: file.name,
          isHero: prev.length === 0,
        }]);
      }
    });
    triggerAutoSave();
  };

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

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/brand-data-room/products")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{productName}</h1>
          <p className="text-muted-foreground text-sm">Edit product details. Changes auto-save.</p>
        </div>
      </div>

      {/* Product Info */}
      <Card>
        <CardContent className="pt-6 space-y-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Label>Product Name</Label>
              <InfoTooltip text="The display name of your product. Used in ad copy generation and campaign briefs." />
            </div>
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              onBlur={handleFieldChange}
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Label>Product URL</Label>
              <InfoTooltip text="The product's landing page URL. Helps the AI understand product positioning and features." />
            </div>
            <Input
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              onBlur={handleFieldChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Fields */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center gap-1.5 mb-2">
            <Label className="text-base font-semibold">Product Knowledge</Label>
            <InfoTooltip text="Add and manage knowledge fields for this product. These fields provide context for AI-generated ad concepts and copy." />
          </div>
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

      {/* Product Images */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Label className="text-base font-semibold">Product Images</Label>
              <InfoTooltip text="Upload images for this product. The starred image is the hero image used as the main product visual in cards and campaigns. Supports PNG, JPEG, SVG, and WebP up to 25MB each." />
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.svg,.webp"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button variant="outline" size="sm" className="gap-1.5 pointer-events-none">
                <Upload className="h-3.5 w-3.5" /> Upload
              </Button>
            </label>
          </div>

          {images.length === 0 ? (
            <label className="border-2 border-dashed border-border rounded-xl p-10 text-center space-y-2 hover:border-primary/50 transition-colors cursor-pointer block">
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.svg,.webp"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">Upload product images</p>
              <p className="text-xs text-muted-foreground">PNG, JPEG, SVG, WEBP · Max 25MB per image</p>
            </label>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {images.map((img) => (
                <div key={img.id} className="relative group/img aspect-square rounded-xl border bg-muted/30 overflow-hidden">
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                  {/* Hero star */}
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setHeroImage(img.id)}
                        className="absolute top-2 left-2 p-1 rounded-full bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background transition-colors"
                        aria-label={img.isHero ? "Hero image" : "Set as hero image"}
                      >
                        <Star className={`h-3.5 w-3.5 transition-colors ${img.isHero ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/50 hover:text-muted-foreground"}`} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      {img.isHero ? "Hero product image" : "Set as hero image"}
                    </TooltipContent>
                  </Tooltip>
                  {/* Delete */}
                  <button
                    onClick={() => deleteImage(img.id)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-background/80 backdrop-blur-sm shadow-sm opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-destructive/10"
                    aria-label="Delete image"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive transition-colors" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Title Dialog */}
      <Dialog open={!!editingField} onOpenChange={(open) => !open && setEditingField(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Field Title</DialogTitle>
            <DialogDescription>Change the title of this knowledge field.</DialogDescription>
          </DialogHeader>
          <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveEditTitle()} autoFocus />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingField(null)}>Cancel</Button>
            <Button onClick={saveEditTitle} disabled={!editTitle.trim()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Field Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Knowledge Field</DialogTitle>
            <DialogDescription>Create a new knowledge field for this product.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Field Title</Label>
              <Input value={newFieldTitle} onChange={(e) => setNewFieldTitle(e.target.value)} placeholder="e.g. Target Audience, USP" autoFocus />
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
            <DialogTitle>Delete Field</DialogTitle>
            <DialogDescription>Are you sure you want to delete "{fields.find(f => f.id === deletingField)?.title}"? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingField(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deletingField && deleteField(deletingField)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}