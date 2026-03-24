import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Package, Image, ChevronDown, ChevronRight } from "lucide-react";
import { getOyImage } from "@/data/oyImages";

import oyProductScalpHairWash from "@/assets/oy/oy-product-scalp-hair-wash.png";
import oyProductScalpHairWashDandruff from "@/assets/oy/oy-product-scalp-hair-wash-dandruff.png";
import oyProductFacewashAcne from "@/assets/oy/oy-product-facewash-acne.png";
import oyProductFacewashDailyBoost from "@/assets/oy/oy-product-facewash-daily-boost.png";
import oyProductFacewashSensitive from "@/assets/oy/oy-product-facewash-sensitive.png";
import oyProductDeoWashHavana from "@/assets/oy/oy-product-deo-wash-havana.png";
import oyProductDeoScrub from "@/assets/oy/oy-product-deo-scrub.png";

const PRODUCTS = [
  {
    id: "prod-1",
    name: "Scalp & Hair Wash",
    heroImg: oyProductScalpHairWash,
    imgIdx: 0,
    imageCount: 6,
  },
  {
    id: "prod-2",
    name: "Scalp & Hair Wash Anti-Dandruff",
    heroImg: oyProductScalpHairWashDandruff,
    imgIdx: 1,
    imageCount: 4,
  },
  {
    id: "prod-3",
    name: "Face Wash Acne Prone Skin",
    heroImg: oyProductFacewashAcne,
    imgIdx: 2,
    imageCount: 8,
  },
  {
    id: "prod-4",
    name: "Face Wash Daily Boost",
    heroImg: oyProductFacewashDailyBoost,
    imgIdx: 3,
    imageCount: 3,
  },
  {
    id: "prod-5",
    name: "Face Wash Sensitive",
    heroImg: oyProductFacewashSensitive,
    imgIdx: 4,
    imageCount: 5,
  },
  {
    id: "prod-6",
    name: "Deo Wash Havana",
    heroImg: oyProductDeoWashHavana,
    imgIdx: 5,
    imageCount: 2,
  },
  {
    id: "prod-7",
    name: "Deo Scrub Marrakech",
    heroImg: oyProductDeoScrub,
    imgIdx: 6,
    imageCount: 7,
  },
];

function getProductImages(product: typeof PRODUCTS[0]) {
  const max = Math.min(product.imageCount, 6);
  return Array.from({ length: max }).map((_, i) => ({
    id: `img-${product.id}-${i}`,
    name: i === 0 ? "Hero Shot" : `Image ${i + 1}`,
    src: i === 0 ? product.heroImg : getOyImage(product.imgIdx + i),
  }));
}

interface ProductDataDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectionChange?: (count: number) => void;
}

export default function ProductDataDrawer({ open, onOpenChange, onSelectionChange }: ProductDataDrawerProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>(["prod-1"]);
  const [selectedImages, setSelectedImages] = useState<Record<string, string[]>>({
    "prod-1": ["img-1-1"],
  });
  const [expandedProducts, setExpandedProducts] = useState<string[]>(["prod-1"]);

  useEffect(() => {
    onSelectionChange?.(selectedProducts.length);
  }, [selectedProducts, onSelectionChange]);

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((p) => p !== id);
        setSelectedImages((imgs) => {
          const copy = { ...imgs };
          delete copy[id];
          return copy;
        });
        setExpandedProducts((exp) => exp.filter((p) => p !== id));
        return next;
      }
      setExpandedProducts((exp) => exp.includes(id) ? exp : [...exp, id]);
      return [...prev, id];
    });
  };

  const toggleExpanded = (id: string) => {
    const willExpand = !expandedProducts.includes(id);
    setExpandedProducts((prev) =>
      willExpand ? [...prev, id] : prev.filter((p) => p !== id)
    );
    // Auto-select when expanding
    if (willExpand && !selectedProducts.includes(id)) {
      setSelectedProducts((prev) => [...prev, id]);
    }
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
                <div
                  className="flex items-center gap-3 px-3 py-3 w-full cursor-pointer hover:bg-muted/40 transition-colors rounded-t-lg"
                  onClick={() => toggleExpanded(product.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleProduct(product.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="h-9 w-9 rounded-md overflow-hidden bg-muted shrink-0">
                    <img
                      src={product.heroImg}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{product.name}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!isExpanded && productImages.length > 0 && (
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 gap-0.5">
                        <Image className="h-2.5 w-2.5" />
                        {productImages.length}
                      </Badge>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Image selection - collapsible */}
                {isSelected && isExpanded && (() => {
                  const images = getProductImages(product);
                  return (
                  <div className="px-3 pb-3 pt-0 border-t border-border/50">
                    <div className="flex items-center justify-between mt-2.5 mb-2">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Images
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {productImages.length} / {images.length} selected
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {images.map((img) => {
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
                              src={img.src}
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
                  );
                })()}
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
