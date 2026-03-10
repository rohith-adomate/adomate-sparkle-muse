import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Package, Image, ChevronDown, ChevronRight } from "lucide-react";

const PRODUCTS = [
  {
    id: "prod-1",
    name: "Hydra Glow Serum",
    imgSeed: "smartwidget",
    images: [
      { id: "img-1-1", name: "Hero Shot", seed: "sw-hero" },
      { id: "img-1-2", name: "Texture Close-up", seed: "sw-dash" },
      { id: "img-1-3", name: "Before & After", seed: "sw-mobile" },
    ],
  },
  {
    id: "prod-2",
    name: "Gentle Foam Cleanser",
    imgSeed: "quicklaunch",
    images: [
      { id: "img-2-1", name: "Product Front", seed: "ql-landing" },
    ],
  },
  {
    id: "prod-3",
    name: "Vitamin C Brightening Cream",
    imgSeed: "insight",
    images: [
      { id: "img-3-1", name: "Jar Flat Lay", seed: "ie-overview" },
      { id: "img-3-2", name: "Lifestyle Application", seed: "ie-report" },
    ],
  },
  {
    id: "prod-4",
    name: "Retinol Night Recovery Mask",
    imgSeed: "creativeos",
    images: [
      { id: "img-4-1", name: "Packaging Detail", seed: "cos-editor" },
      { id: "img-4-2", name: "Ingredient Spread", seed: "cos-library" },
      { id: "img-4-3", name: "Model Application", seed: "cos-grid" },
      { id: "img-4-4", name: "Routine Bundle", seed: "cos-export" },
    ],
  },
];

interface ProductDataDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductDataDrawer({ open, onOpenChange }: ProductDataDrawerProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>(["prod-1"]);
  const [selectedImages, setSelectedImages] = useState<Record<string, string[]>>({
    "prod-1": ["img-1-1"],
  });
  const [expandedProducts, setExpandedProducts] = useState<string[]>(["prod-1"]);

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((p) => p !== id);
        setSelectedImages((imgs) => {
          const copy = { ...imgs };
          delete copy[id];
          return copy;
        });
        return next;
      }
      setExpandedProducts((exp) => exp.includes(id) ? exp : [...exp, id]);
      return [...prev, id];
    });
  };

  const toggleExpanded = (id: string) => {
    setExpandedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleImage = (productId: string, imageId: string) => {
    setSelectedImages((prev) => {
      const current = prev[productId] || [];
      const next = current.includes(imageId)
        ? current.filter((i) => i !== imageId)
        : [...current, imageId];
      return { ...prev, [productId]: next };
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[380px] sm:max-w-[380px] flex flex-col gap-0 p-0">
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="rounded-md p-1.5" style={{ background: "hsl(210 80% 55% / 0.12)" }}>
              <Package className="h-4 w-4" style={{ color: "hsl(210 80% 55%)" }} />
            </div>
            <div>
              <SheetTitle className="text-sm">Product Data</SheetTitle>
              <SheetDescription className="text-xs">
                Select products for this workflow.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-2">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Products
            </Label>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {selectedProducts.length} product{selectedProducts.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {PRODUCTS.map((product) => {
            const isSelected = selectedProducts.includes(product.id);
            const isExpanded = expandedProducts.includes(product.id);
            const productImages = selectedImages[product.id] || [];

            return (
              <div
                key={product.id}
                className={`rounded-lg border transition-all ${
                  isSelected ? "border-primary bg-primary/[0.03]" : "border-border bg-card"
                }`}
              >
                {/* Product header */}
                <div className="flex items-center gap-3 px-3 py-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleProduct(product.id)}
                  />
                  <div className="h-9 w-9 rounded-md overflow-hidden bg-muted shrink-0">
                    <img
                      src={`https://picsum.photos/seed/${product.imgSeed}/80/80`}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{product.name}</p>
                  </div>
                  {isSelected && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!isExpanded && productImages.length > 0 && (
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 gap-0.5">
                          <Image className="h-2.5 w-2.5" />
                          {productImages.length}
                        </Badge>
                      )}
                      <button
                        onClick={() => toggleExpanded(product.id)}
                        className="p-1 rounded hover:bg-muted/60 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Image selection - collapsible */}
                {isSelected && isExpanded && (
                  <div className="px-3 pb-3 pt-0 border-t border-border/50">
                    <div className="flex items-center justify-between mt-2.5 mb-2">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Images
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {productImages.length} / {product.images.length} selected
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {product.images.map((img) => {
                        const imgSelected = productImages.includes(img.id);
                        return (
                          <button
                            key={img.id}
                            onClick={() => toggleImage(product.id, img.id)}
                            className={`relative rounded-md overflow-hidden aspect-square border-2 transition-all ${
                              imgSelected
                                ? "border-primary ring-1 ring-primary/30"
                                : "border-transparent hover:border-muted-foreground/20"
                            }`}
                          >
                            <img
                              src={`https://picsum.photos/seed/${img.seed}/120/120`}
                              alt={img.name}
                              className="h-full w-full object-cover"
                            />
                            {imgSelected && (
                              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                <div className="rounded-full bg-primary p-0.5">
                                  <svg className="h-2.5 w-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                            )}
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-1 py-0.5">
                              <span className="text-[8px] text-white font-medium leading-tight line-clamp-1">
                                {img.name}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
