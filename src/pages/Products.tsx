import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ImageIcon, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const products = [
  { id: "1", name: "Hydra Glow Serum", images: 6, imgSeed: "serum" },
  { id: "2", name: "Gentle Foam Cleanser", images: 4, imgSeed: "cleanser" },
  { id: "3", name: "Vitamin C Brightening Cream", images: 8, imgSeed: "vitaminc" },
  { id: "4", name: "Retinol Night Repair", images: 3, imgSeed: "retinol" },
  { id: "5", name: "SPF 50 Daily Shield", images: 5, imgSeed: "sunscreen" },
  { id: "6", name: "Rose Petal Toner", images: 2, imgSeed: "toner" },
  { id: "7", name: "Collagen Boost Mask", images: 7, imgSeed: "mask" },
  { id: "8", name: "Tea Tree Oil Spot Treatment", images: 1, imgSeed: "teatree" },
];

function getImageUrl(seed: string, idx: number, w = 300, h = 300) {
  return `https://picsum.photos/seed/${seed}${idx}/${w}/${h}`;
}

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

function ProductCard({ product }: { product: typeof products[0] }) {
  const navigate = useNavigate();
  const max = 3;
  const remaining = Math.max(0, product.images - 1 - max);
  return (
    <Card
      className="flex overflow-hidden h-32 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/brand-data-room/products/${product.id}`)}
    >
      <div className="w-32 flex-shrink-0 bg-muted relative">
        <img src={getImageUrl(product.imgSeed, 0, 300, 300)} alt={product.name} className="w-full h-full object-cover" />
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
          <ActionMenu />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: Math.min(max, product.images - 1) }).map((_, i) => (
            <div key={i} className="w-10 h-10 rounded-lg overflow-hidden bg-muted shadow-sm">
              <img src={getImageUrl(product.imgSeed, i + 1)} alt="" className="w-full h-full object-cover" />
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
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumbs items={[{ label: "Brand Brain", href: "/brand-data-room" }, { label: "Products" }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground text-sm">Manage your product catalog and images.</p>
        </div>
        <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Product</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {products.map((p) => (
          <ProductCard key={p.name} product={p} />
        ))}
      </div>
    </div>
  );
}
