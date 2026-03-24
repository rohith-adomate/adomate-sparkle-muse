import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ImageIcon, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddProductModal } from "@/components/AddProductModal";
import { getOyImage } from "@/data/oyImages";

import oyProductScalpHairWash from "@/assets/oy/oy-product-scalp-hair-wash.png";
import oyProductScalpHairWashDandruff from "@/assets/oy/oy-product-scalp-hair-wash-dandruff.png";
import oyProductFacewashAcne from "@/assets/oy/oy-product-facewash-acne.png";
import oyProductFacewashDailyBoost from "@/assets/oy/oy-product-facewash-daily-boost.png";
import oyProductFacewashSensitive from "@/assets/oy/oy-product-facewash-sensitive.png";
import oyProductDeoWashHavana from "@/assets/oy/oy-product-deo-wash-havana.png";
import oyProductDeoScrub from "@/assets/oy/oy-product-deo-scrub.png";

const initialProducts = [
  { id: "1", name: "Scalp & Hair Wash", images: 6, imgIdx: 0, heroImg: oyProductScalpHairWash },
  { id: "2", name: "Scalp & Hair Wash Anti-Dandruff", images: 4, imgIdx: 1, heroImg: oyProductScalpHairWashDandruff },
  { id: "3", name: "Face Wash Acne Prone Skin", images: 8, imgIdx: 2, heroImg: oyProductFacewashAcne },
  { id: "4", name: "Face Wash Daily Boost", images: 3, imgIdx: 3, heroImg: oyProductFacewashDailyBoost },
  { id: "5", name: "Face Wash Sensitive", images: 5, imgIdx: 4, heroImg: oyProductFacewashSensitive },
  { id: "6", name: "Deo Wash Havana", images: 2, imgIdx: 5, heroImg: oyProductDeoWashHavana },
  { id: "7", name: "Deo Scrub Marrakech", images: 7, imgIdx: 6, heroImg: oyProductDeoScrub },
];

// Removed getImageUrl - using getOyImage instead

const ActionMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { onAction?: (action: string) => void }>(
  ({ onAction, ...props }, ref) => (
    <div ref={ref} {...props} onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem className="gap-2 text-sm" onClick={() => onAction?.("edit")}><Pencil className="h-3.5 w-3.5" /> Edit</DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-sm text-destructive focus:text-destructive" onClick={() => onAction?.("delete")}><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
);
ActionMenu.displayName = "ActionMenu";

function ProductCard({ product, onEdit, onDelete }: { product: typeof initialProducts[0]; onEdit: () => void; onDelete: () => void }) {
  const navigate = useNavigate();
  const max = 3;
  const remaining = Math.max(0, product.images - 1 - max);

  const handleAction = (action: string) => {
    if (action === "edit") onEdit();
    if (action === "delete") onDelete();
  };

  return (
    <Card
      className="flex overflow-hidden h-32 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/brand-data-room/products/${product.id}`)}
    >
      <div className="w-32 flex-shrink-0 bg-muted relative">
        <img src={getOyImage(product.imgIdx)} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
      </div>
      <div className="flex flex-col justify-between flex-1 min-w-0 p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm truncate">{product.name}</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-full bg-muted/80 cursor-default">
                  <ImageIcon className="h-3 w-3 text-primary" />
                  <span className="text-[11px] font-medium text-foreground">{product.images}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>This product has {product.images} image{product.images !== 1 ? "s" : ""} in total</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <ActionMenu onAction={handleAction} />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: Math.min(max, product.images - 1) }).map((_, i) => (
            <div key={i} className="w-10 h-10 rounded-lg overflow-hidden bg-muted shadow-sm">
              <img src={getOyImage(product.imgIdx + i + 1)} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          {remaining > 0 && (
            <div className="w-10 h-10 rounded-lg bg-accent/80 flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
              +{remaining}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function Products() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [deletingProduct, setDeletingProduct] = useState<typeof initialProducts[0] | null>(null);
  const navigate = useNavigate();

  const handleDelete = () => {
    if (deletingProduct) {
      setProducts(prev => prev.filter(p => p.id !== deletingProduct.id));
      setDeletingProduct(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumbs items={[{ label: "Data Room", href: "/brand-data-room" }, { label: "Products" }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground text-sm">Manage your product catalog and images.</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setShowAddModal(true)}><Plus className="h-4 w-4" /> Add Product</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onEdit={() => navigate(`/brand-data-room/products/${p.id}`)}
            onDelete={() => setDeletingProduct(p)}
          />
        ))}
      </div>

      <AddProductModal open={showAddModal} onOpenChange={setShowAddModal} />

      <Dialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingProduct?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingProduct(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
