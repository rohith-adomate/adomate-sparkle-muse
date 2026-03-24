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
import { KnowledgeFieldsSection, type KnowledgeField } from "@/components/KnowledgeFieldsSection";
import { getOyImage } from "@/data/oyImages";

const productData: Record<string, { name: string; url: string; imgIdx: number; imageCount: number }> = {
  "1": { name: "Scalp & Hair Wash", url: "https://oycare.com/scalp-hair-wash", imgIdx: 0, imageCount: 6 },
  "2": { name: "Deo Wash", url: "https://oycare.com/deo-wash", imgIdx: 1, imageCount: 4 },
  "3": { name: "Face Wash Sensitive", url: "https://oycare.com/face-wash-sensitive", imgIdx: 2, imageCount: 8 },
  "4": { name: "Body Lotion", url: "https://oycare.com/body-lotion", imgIdx: 3, imageCount: 3 },
  "5": { name: "Hand Cream", url: "https://oycare.com/hand-cream", imgIdx: 4, imageCount: 5 },
  "6": { name: "Shower Oil", url: "https://oycare.com/shower-oil", imgIdx: 5, imageCount: 2 },
  "7": { name: "Lip Balm", url: "https://oycare.com/lip-balm", imgIdx: 6, imageCount: 7 },
  "8": { name: "Deodorant Stick", url: "https://oycare.com/deodorant-stick", imgIdx: 7, imageCount: 1 },
};

// Using getOyImage instead of picsum

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

// KnowledgeField type imported from shared component

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

// KnowledgeSection now uses the shared KnowledgeFieldsSection component

// ─── Images Section (Brand Logos style, 4 columns) ───
function ImagesSection({
  images, setHeroImage, onDeleteClick, handleImageUpload,
}: {
  images: ProductImage[];
  setHeroImage: (id: string) => void;
  onDeleteClick: (id: string) => void;
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
                    onClick={() => onDeleteClick(img.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover/img:opacity-100 transition-all p-1.5 rounded-md bg-white text-muted-foreground shadow-sm hover:bg-red-100 hover:text-destructive"
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
            <input type="file" accept=".png,.jpg,.jpeg,.webp" multiple className="hidden" onChange={handleImageUpload} />
            <Upload className="h-6 w-6 text-muted-foreground" />
            <p className="text-xs text-muted-foreground text-center px-2">Upload image(s)</p>
            <p className="text-[10px] text-muted-foreground text-center px-2">(PNG, JPEG, WEBP)</p>
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
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"knowledge" | "images">("knowledge");

  const [images, setImages] = useState<ProductImage[]>(() => {
    if (!product) return [];
    return Array.from({ length: product.imageCount }).map((_, i) => ({
      id: `img-${i}`,
      url: getOyImage(product.imgIdx + i),
      name: `${product.name} image ${i + 1}`,
      isHero: i === 0,
    }));
  });

  const heroImage = images.find(img => img.isHero);

  const triggerAutoSave = useCallback(() => { triggerSave(); }, [triggerSave]);
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

  const imageProps = { images, setHeroImage, onDeleteClick: (id: string) => setDeletingImageId(id), handleImageUpload };

  if (!product) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Breadcrumbs items={[{ label: "Data Room", href: "/brand-data-room" }, { label: "Products", href: "/brand-data-room/products" }, { label: "Not Found" }]} />
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Breadcrumbs items={[
        { label: "Data Room", href: "/brand-data-room" },
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
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight truncate">Product</h1>
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
                <Input value={productName} onChange={(e) => setProductName(e.target.value)} onBlur={triggerAutoSave} />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Label>Product URL</Label>
                  <InfoTooltip text="The product's landing page URL. Helps the AI understand product positioning and features." />
                </div>
                <Input value={productUrl} onChange={(e) => setProductUrl(e.target.value)} onBlur={triggerAutoSave} />
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
          {activeSection === "knowledge" ? (
            <KnowledgeFieldsSection
              fields={fields}
              onFieldsChange={(newFields) => { setFields(newFields); triggerAutoSave(); }}
              onFieldChange={triggerAutoSave}
            />
          ) : <ImagesSection {...imageProps} />}
        </CardContent></Card>
      </div>

      <Dialog open={!!deletingImageId} onOpenChange={(open) => !open && setDeletingImageId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Delete Image</DialogTitle><DialogDescription>Are you sure you want to delete this image? This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setDeletingImageId(null)}>Cancel</Button><Button variant="destructive" onClick={() => { if (deletingImageId) { deleteImage(deletingImageId); setDeletingImageId(null); } }}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
