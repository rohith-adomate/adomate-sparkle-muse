import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Upload, Star, Info, ArrowLeft, BookOpen, ImageIcon, ChevronDown, FileText, Images, Layers, GalleryHorizontal, Brain, Camera } from "lucide-react";
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

// ─── Shared Knowledge Section ───
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

// ─── Shared Images Section ───
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Label className="text-sm font-medium">Product Images</Label>
          <InfoTooltip text="The starred image is the hero image. Supports PNG, JPEG, SVG, and WebP up to 25MB each." />
        </div>
        <label className="cursor-pointer">
          <input type="file" accept=".png,.jpg,.jpeg,.svg,.webp" multiple className="hidden" onChange={handleImageUpload} />
          <Button variant="outline" size="sm" className="gap-1.5 pointer-events-none"><Upload className="h-3.5 w-3.5" /> Upload</Button>
        </label>
      </div>
      {images.length === 0 ? (
        <label className="border-2 border-dashed border-border rounded-xl p-10 text-center space-y-2 hover:border-primary/50 transition-colors cursor-pointer block">
          <input type="file" accept=".png,.jpg,.jpeg,.svg,.webp" multiple className="hidden" onChange={handleImageUpload} />
          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-sm font-medium">Upload product images</p>
          <p className="text-xs text-muted-foreground">PNG, JPEG, SVG, WEBP · Max 25MB per image</p>
        </label>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative group/img aspect-square rounded-xl border bg-muted/30 overflow-hidden">
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <button onClick={() => setHeroImage(img.id)} className="absolute top-2 left-2 p-1 rounded-full bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background transition-colors">
                    <Star className={`h-3.5 w-3.5 transition-colors ${img.isHero ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/50 hover:text-muted-foreground"}`} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">{img.isHero ? "Hero product image" : "Set as hero image"}</TooltipContent>
              </Tooltip>
              <button onClick={() => deleteImage(img.id)} className="absolute top-2 right-2 p-1 rounded-full bg-background/80 backdrop-blur-sm shadow-sm opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-destructive/10">
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive transition-colors" />
              </button>
            </div>
          ))}
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

  const [variant, setVariant] = useState(1);
  const [productName, setProductName] = useState(product?.name ?? "");
  const [productUrl, setProductUrl] = useState(product?.url ?? "");
  const [fields, setFields] = useState<KnowledgeField[]>(defaultFields);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFieldTitle, setNewFieldTitle] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");
  const [deletingField, setDeletingField] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"knowledge" | "images">("knowledge");
  const [accordionOpen, setAccordionOpen] = useState<"knowledge" | "images" | null>("knowledge");

  const [images, setImages] = useState<ProductImage[]>(() => {
    if (!product) return [];
    return Array.from({ length: product.imageCount }).map((_, i) => ({
      id: `img-${i}`,
      url: getImageUrl(product.imgSeed, i),
      name: `${product.name} image ${i + 1}`,
      isHero: i === 0,
    }));
  });

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

  const variantLabels = [
    "V1 — Standard Tabs",
    "V2 — Pill Toggle",
    "V3 — Segmented Control",
    "V4 — Underlined Nav",
    "V5 — Icon Button Toggle",
    "V6 — Accordion Sections",
    "V7 — Sidebar Navigation",
    "V8 — Card Selector",
    "V9 — Dropdown Select",
    "V10 — Floating Bottom Bar",
  ];

  const renderVariant = () => {
    switch (variant) {
      // ─── V1: Standard Tabs ───
      case 1:
        return (
          <Tabs defaultValue="knowledge" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="knowledge" className="flex-1 gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Knowledge</TabsTrigger>
              <TabsTrigger value="images" className="flex-1 gap-1.5"><ImageIcon className="h-3.5 w-3.5" /> Images</TabsTrigger>
            </TabsList>
            <TabsContent value="knowledge" className="mt-4">
              <Card><CardContent className="pt-6"><KnowledgeSection {...knowledgeProps} /></CardContent></Card>
            </TabsContent>
            <TabsContent value="images" className="mt-4">
              <Card><CardContent className="pt-6"><ImagesSection {...imageProps} /></CardContent></Card>
            </TabsContent>
          </Tabs>
        );

      // ─── V2: Pill Toggle ───
      case 2:
        return (
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
        );

      // ─── V3: Segmented Control ───
      case 3:
        return (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="inline-flex border border-border rounded-lg overflow-hidden">
                <button onClick={() => setActiveSection("knowledge")} className={`px-6 py-2.5 text-sm font-medium transition-all flex items-center gap-1.5 ${activeSection === "knowledge" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}>
                  <FileText className="h-3.5 w-3.5" /> Knowledge
                </button>
                <button onClick={() => setActiveSection("images")} className={`px-6 py-2.5 text-sm font-medium transition-all flex items-center gap-1.5 border-l border-border ${activeSection === "images" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}>
                  <Images className="h-3.5 w-3.5" /> Images
                </button>
              </div>
            </div>
            <Card><CardContent className="pt-6">
              {activeSection === "knowledge" ? <KnowledgeSection {...knowledgeProps} /> : <ImagesSection {...imageProps} />}
            </CardContent></Card>
          </div>
        );

      // ─── V4: Underlined Nav ───
      case 4:
        return (
          <div className="space-y-4">
            <div className="flex gap-6 border-b border-border">
              <button onClick={() => setActiveSection("knowledge")} className={`pb-3 text-sm font-medium transition-all flex items-center gap-1.5 border-b-2 ${activeSection === "knowledge" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                <BookOpen className="h-3.5 w-3.5" /> Knowledge
              </button>
              <button onClick={() => setActiveSection("images")} className={`pb-3 text-sm font-medium transition-all flex items-center gap-1.5 border-b-2 ${activeSection === "images" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                <ImageIcon className="h-3.5 w-3.5" /> Images
              </button>
            </div>
            <Card><CardContent className="pt-6">
              {activeSection === "knowledge" ? <KnowledgeSection {...knowledgeProps} /> : <ImagesSection {...imageProps} />}
            </CardContent></Card>
          </div>
        );

      // ─── V5: Icon Button Toggle ───
      case 5:
        return (
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => setActiveSection("knowledge")} className={`p-3 rounded-xl transition-all ${activeSection === "knowledge" ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                    <Brain className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Product Knowledge</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => setActiveSection("images")} className={`p-3 rounded-xl transition-all ${activeSection === "images" ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                    <Camera className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Product Images</TooltipContent>
              </Tooltip>
            </div>
            <Card><CardContent className="pt-6">
              {activeSection === "knowledge" ? <KnowledgeSection {...knowledgeProps} /> : <ImagesSection {...imageProps} />}
            </CardContent></Card>
          </div>
        );

      // ─── V6: Accordion Sections ───
      case 6:
        return (
          <div className="space-y-3">
            <Card className="overflow-hidden">
              <button onClick={() => setAccordionOpen(accordionOpen === "knowledge" ? null : "knowledge")} className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <span className="flex items-center gap-2 font-medium text-sm"><BookOpen className="h-4 w-4 text-primary" /> Product Knowledge</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${accordionOpen === "knowledge" ? "rotate-180" : ""}`} />
              </button>
              {accordionOpen === "knowledge" && (
                <CardContent className="pt-0 pb-6 border-t"><div className="pt-4"><KnowledgeSection {...knowledgeProps} /></div></CardContent>
              )}
            </Card>
            <Card className="overflow-hidden">
              <button onClick={() => setAccordionOpen(accordionOpen === "images" ? null : "images")} className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <span className="flex items-center gap-2 font-medium text-sm"><ImageIcon className="h-4 w-4 text-primary" /> Product Images</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${accordionOpen === "images" ? "rotate-180" : ""}`} />
              </button>
              {accordionOpen === "images" && (
                <CardContent className="pt-0 pb-6 border-t"><div className="pt-4"><ImagesSection {...imageProps} /></div></CardContent>
              )}
            </Card>
          </div>
        );

      // ─── V7: Sidebar Navigation ───
      case 7:
        return (
          <Card className="overflow-hidden">
            <div className="flex min-h-[400px]">
              <div className="w-44 border-r border-border bg-muted/20 p-3 space-y-1 shrink-0">
                <button onClick={() => setActiveSection("knowledge")} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeSection === "knowledge" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                  <BookOpen className="h-3.5 w-3.5" /> Knowledge
                </button>
                <button onClick={() => setActiveSection("images")} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeSection === "images" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                  <ImageIcon className="h-3.5 w-3.5" /> Images
                </button>
              </div>
              <div className="flex-1 p-6">
                {activeSection === "knowledge" ? <KnowledgeSection {...knowledgeProps} /> : <ImagesSection {...imageProps} />}
              </div>
            </div>
          </Card>
        );

      // ─── V8: Card Selector ───
      case 8:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setActiveSection("knowledge")} className={`p-4 rounded-xl border-2 text-left transition-all ${activeSection === "knowledge" ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-muted-foreground/30"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`p-1.5 rounded-lg ${activeSection === "knowledge" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    <Layers className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">Knowledge</span>
                </div>
                <p className="text-xs text-muted-foreground">{fields.length} fields defined</p>
              </button>
              <button onClick={() => setActiveSection("images")} className={`p-4 rounded-xl border-2 text-left transition-all ${activeSection === "images" ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-muted-foreground/30"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`p-1.5 rounded-lg ${activeSection === "images" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    <GalleryHorizontal className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">Images</span>
                </div>
                <p className="text-xs text-muted-foreground">{images.length} images uploaded</p>
              </button>
            </div>
            <Card><CardContent className="pt-6">
              {activeSection === "knowledge" ? <KnowledgeSection {...knowledgeProps} /> : <ImagesSection {...imageProps} />}
            </CardContent></Card>
          </div>
        );

      // ─── V9: Dropdown Select ───
      case 9:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground whitespace-nowrap">Showing:</Label>
              <select
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value as "knowledge" | "images")}
                className="flex h-9 w-full max-w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="knowledge">📝 Product Knowledge</option>
                <option value="images">🖼️ Product Images</option>
              </select>
            </div>
            <Card><CardContent className="pt-6">
              {activeSection === "knowledge" ? <KnowledgeSection {...knowledgeProps} /> : <ImagesSection {...imageProps} />}
            </CardContent></Card>
          </div>
        );

      // ─── V10: Floating Bottom Bar ───
      case 10:
        return (
          <div className="space-y-4 relative pb-16">
            <Card><CardContent className="pt-6">
              {activeSection === "knowledge" ? <KnowledgeSection {...knowledgeProps} /> : <ImagesSection {...imageProps} />}
            </CardContent></Card>
            <div className="sticky bottom-4 flex justify-center z-10">
              <div className="inline-flex bg-background border border-border rounded-full shadow-lg p-1.5 gap-1">
                <button onClick={() => setActiveSection("knowledge")} className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${activeSection === "knowledge" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  <BookOpen className="h-3.5 w-3.5" /> Knowledge
                </button>
                <button onClick={() => setActiveSection("images")} className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${activeSection === "images" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  <ImageIcon className="h-3.5 w-3.5" /> Images
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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

      {/* ─── Variant Selector ─── */}
      <div className="flex flex-wrap gap-1.5">
        {variantLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => setVariant(i + 1)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${variant === i + 1 ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Product Info Card */}
      <Card>
        <CardContent className="pt-6 space-y-5">
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
        </CardContent>
      </Card>

      {/* ─── Active Variant ─── */}
      {renderVariant()}

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
