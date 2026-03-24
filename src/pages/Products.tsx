import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, ImageIcon, Upload } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { HoverExplainer } from "@/components/HoverExplainer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

const products = [
  { name: "Hydra Glow Serum", images: 6, imgSeed: "serum" },
  { name: "Gentle Foam Cleanser", images: 4, imgSeed: "cleanser" },
  { name: "Vitamin C Brightening Cream", images: 8, imgSeed: "vitaminc" },
  { name: "Retinol Night Repair", images: 3, imgSeed: "retinol" },
  { name: "SPF 50 Daily Shield", images: 5, imgSeed: "sunscreen" },
  { name: "Rose Petal Toner", images: 2, imgSeed: "toner" },
  { name: "Collagen Boost Mask", images: 7, imgSeed: "mask" },
  { name: "Tea Tree Oil Spot Treatment", images: 1, imgSeed: "teatree" },
];

function getImageUrl(seed: string, idx: number, w = 300, h = 300) {
  return `https://picsum.photos/seed/${seed}${idx}/${w}/${h}`;
}

// ─── Card Variant 1: Classic Grid ───
function CardVariant1({ product }: { product: typeof products[0] }) {
  const maxPreview = 3;
  const remaining = Math.max(0, product.images - 1 - maxPreview);
  return (
    <Card className="overflow-hidden group">
      {/* Hero */}
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img src={getImageUrl(product.imgSeed, 0, 600, 450)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm truncate">{product.name}</h3>
          <span className="text-xs text-muted-foreground flex items-center gap-1"><ImageIcon className="h-3 w-3" />{product.images}</span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: Math.min(maxPreview, product.images - 1) }).map((_, i) => (
            <div key={i} className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
              <img src={getImageUrl(product.imgSeed, i + 1)} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          {remaining > 0 && (
            <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">+{remaining}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Card Variant 2: Horizontal Strip ───
function CardVariant2({ product }: { product: typeof products[0] }) {
  const maxPreview = 3;
  const remaining = Math.max(0, product.images - 1 - maxPreview);
  return (
    <Card className="overflow-hidden flex flex-row h-32">
      <div className="w-32 flex-shrink-0 bg-muted">
        <img src={getImageUrl(product.imgSeed, 0, 300, 300)} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <CardContent className="p-3 flex flex-col justify-between flex-1 min-w-0">
        <div>
          <h3 className="font-semibold text-sm truncate">{product.name}</h3>
          <span className="text-xs text-muted-foreground">{product.images} images</span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: Math.min(maxPreview, product.images - 1) }).map((_, i) => (
            <div key={i} className="w-9 h-9 rounded overflow-hidden bg-muted">
              <img src={getImageUrl(product.imgSeed, i + 1)} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          {remaining > 0 && (
            <div className="w-9 h-9 rounded bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">+{remaining}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Card Variant 3: Overlapping Thumbnails ───
function CardVariant3({ product }: { product: typeof products[0] }) {
  const maxPreview = 3;
  const remaining = Math.max(0, product.images - 1 - maxPreview);
  const thumbs = Math.min(maxPreview, product.images - 1);
  return (
    <Card className="overflow-hidden group">
      <div className="aspect-video overflow-hidden bg-muted relative">
        <img src={getImageUrl(product.imgSeed, 0, 600, 340)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-semibold text-sm text-white truncate">{product.name}</h3>
          <span className="text-[11px] text-white/70">{product.images} images</span>
        </div>
      </div>
      <CardContent className="p-3">
        <div className="flex items-center -space-x-2">
          {Array.from({ length: thumbs }).map((_, i) => (
            <div key={i} className="w-10 h-10 rounded-full overflow-hidden border-2 border-background bg-muted">
              <img src={getImageUrl(product.imgSeed, i + 1)} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          {remaining > 0 && (
            <div className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">+{remaining}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Card Variant 4: Mosaic Grid ───
function CardVariant4({ product }: { product: typeof products[0] }) {
  const remaining = Math.max(0, product.images - 4);
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-2 gap-0.5 bg-border">
        <div className="row-span-2 bg-muted aspect-square">
          <img src={getImageUrl(product.imgSeed, 0, 400, 400)} alt={product.name} className="w-full h-full object-cover" />
        </div>
        {Array.from({ length: Math.min(2, product.images - 1) }).map((_, i) => (
          <div key={i} className="bg-muted aspect-square">
            <img src={getImageUrl(product.imgSeed, i + 1, 200, 200)} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        {product.images > 3 ? (
          <div className="bg-muted aspect-square relative">
            <img src={getImageUrl(product.imgSeed, 3, 200, 200)} alt="" className="w-full h-full object-cover" />
            {remaining > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-lg">+{remaining}</div>
            )}
          </div>
        ) : product.images <= 1 ? (
          <div className="bg-muted aspect-square" />
        ) : null}
      </div>
      <CardContent className="p-3 flex items-center justify-between">
        <h3 className="font-semibold text-sm truncate">{product.name}</h3>
        <span className="text-xs text-muted-foreground">{product.images} imgs</span>
      </CardContent>
    </Card>
  );
}

// ─── Card Variant 5: Minimal with Badge ───
function CardVariant5({ product }: { product: typeof products[0] }) {
  const maxPreview = 3;
  const remaining = Math.max(0, product.images - 1 - maxPreview);
  return (
    <Card className="p-4 space-y-3 group hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0 ring-2 ring-primary/10">
          <img src={getImageUrl(product.imgSeed, 0, 200, 200)} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm truncate">{product.name}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <ImageIcon className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{product.images} images</span>
          </div>
        </div>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: Math.min(maxPreview, product.images - 1) }).map((_, i) => (
          <div key={i} className="flex-1 aspect-square rounded-lg overflow-hidden bg-muted">
            <img src={getImageUrl(product.imgSeed, i + 1)} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        {remaining > 0 && (
          <div className="flex-1 aspect-square rounded-lg bg-accent flex items-center justify-center text-xs font-semibold text-muted-foreground">+{remaining}</div>
        )}
      </div>
    </Card>
  );
}

// ─── Card Variant 6: Full-Bleed Hero with Floating Info ───
function CardVariant6({ product }: { product: typeof products[0] }) {
  const maxPreview = 3;
  const remaining = Math.max(0, product.images - 1 - maxPreview);
  return (
    <Card className="overflow-hidden relative group rounded-2xl">
      <div className="aspect-[3/4] bg-muted">
        <img src={getImageUrl(product.imgSeed, 0, 500, 667)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <h3 className="font-bold text-white text-sm">{product.name}</h3>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: Math.min(maxPreview, product.images - 1) }).map((_, i) => (
            <div key={i} className="w-8 h-8 rounded-md overflow-hidden border border-white/30 bg-muted">
              <img src={getImageUrl(product.imgSeed, i + 1)} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          {remaining > 0 && (
            <div className="w-8 h-8 rounded-md border border-white/30 bg-white/20 backdrop-blur-sm flex items-center justify-center text-[10px] font-medium text-white">+{remaining}</div>
          )}
          <span className="text-[10px] text-white/60 ml-auto">{product.images} total</span>
        </div>
      </div>
    </Card>
  );
}

// ─── Card Variant 7: Side-by-Side Split ───
function CardVariant7({ product }: { product: typeof products[0] }) {
  const maxPreview = 3;
  const remaining = Math.max(0, product.images - 1 - maxPreview);
  return (
    <Card className="overflow-hidden">
      <div className="flex">
        <div className="w-1/2 aspect-square bg-muted">
          <img src={getImageUrl(product.imgSeed, 0, 400, 400)} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="w-1/2 grid grid-cols-2 gap-px bg-border">
          {Array.from({ length: Math.min(maxPreview, product.images - 1) }).map((_, i) => (
            <div key={i} className="bg-muted aspect-square">
              <img src={getImageUrl(product.imgSeed, i + 1, 200, 200)} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          {remaining > 0 ? (
            <div className="bg-accent aspect-square flex items-center justify-center text-sm font-semibold text-muted-foreground">+{remaining}</div>
          ) : (
            Array.from({ length: Math.max(0, 4 - product.images) }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-muted/50 aspect-square" />
            ))
          )}
        </div>
      </div>
      <CardContent className="p-3 flex items-center justify-between border-t">
        <h3 className="font-semibold text-sm truncate">{product.name}</h3>
        <span className="text-xs text-muted-foreground">{product.images} images</span>
      </CardContent>
    </Card>
  );
}

// ─── Card Variant 8: Stacked Film Strip ───
function CardVariant8({ product }: { product: typeof products[0] }) {
  const maxPreview = 3;
  const remaining = Math.max(0, product.images - 1 - maxPreview);
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{product.name}</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{product.images} imgs</span>
        </div>
        <div className="flex gap-2 overflow-hidden">
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0 shadow-sm">
            <img src={getImageUrl(product.imgSeed, 0, 300, 300)} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            {Array.from({ length: Math.min(maxPreview, product.images - 1) }).map((_, i) => (
              <div key={i} className="h-7 rounded overflow-hidden bg-muted flex-shrink-0">
                <img src={getImageUrl(product.imgSeed, i + 1, 300, 80)} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            {remaining > 0 && (
              <div className="h-7 rounded bg-accent flex items-center justify-center text-[10px] text-muted-foreground font-medium">+{remaining} more</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Card Variant 9: Polaroid Stack ───
function CardVariant9({ product }: { product: typeof products[0] }) {
  const maxPreview = 3;
  const remaining = Math.max(0, product.images - 1 - maxPreview);
  return (
    <Card className="p-5 space-y-3">
      <div className="relative h-48">
        {/* Stacked polaroid effect */}
        <div className="absolute inset-x-4 top-2 h-40 rounded-lg bg-muted/60 rotate-3" />
        <div className="absolute inset-x-2 top-1 h-40 rounded-lg bg-muted/80 -rotate-2" />
        <div className="relative h-44 rounded-lg overflow-hidden bg-muted shadow-md">
          <img src={getImageUrl(product.imgSeed, 0, 600, 400)} alt={product.name} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm truncate">{product.name}</h3>
        <span className="text-xs text-muted-foreground">{product.images} images</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: Math.min(maxPreview, product.images - 1) }).map((_, i) => (
          <div key={i} className="w-10 h-10 rounded-md overflow-hidden bg-muted shadow-sm border border-border">
            <img src={getImageUrl(product.imgSeed, i + 1)} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        {remaining > 0 && (
          <div className="w-10 h-10 rounded-md bg-accent border border-border flex items-center justify-center text-[10px] font-semibold text-muted-foreground">+{remaining}</div>
        )}
      </div>
    </Card>
  );
}

// ─── Card Variant 10: Compact List Row ───
function CardVariant10({ product }: { product: typeof products[0] }) {
  const maxPreview = 3;
  const remaining = Math.max(0, product.images - 1 - maxPreview);
  return (
    <Card className="flex items-center gap-4 p-3 hover:bg-accent/30 transition-colors">
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
        <img src={getImageUrl(product.imgSeed, 0, 200, 200)} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm truncate">{product.name}</h3>
        <span className="text-xs text-muted-foreground">{product.images} images</span>
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(maxPreview, product.images - 1) }).map((_, i) => (
          <div key={i} className="w-8 h-8 rounded overflow-hidden bg-muted">
            <img src={getImageUrl(product.imgSeed, i + 1, 100, 100)} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        {remaining > 0 && (
          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">+{remaining}</div>
        )}
      </div>
    </Card>
  );
}

const variants = [
  { label: "1 · Classic Grid", Component: CardVariant1 },
  { label: "2 · Horizontal Strip", Component: CardVariant2 },
  { label: "3 · Overlapping Thumbnails", Component: CardVariant3 },
  { label: "4 · Mosaic Grid", Component: CardVariant4 },
  { label: "5 · Minimal with Badge", Component: CardVariant5 },
  { label: "6 · Full-Bleed Hero", Component: CardVariant6 },
  { label: "7 · Side-by-Side Split", Component: CardVariant7 },
  { label: "8 · Stacked Film Strip", Component: CardVariant8 },
  { label: "9 · Polaroid Stack", Component: CardVariant9 },
  { label: "10 · Compact List Row", Component: CardVariant10 },
];

export default function Products() {
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <Breadcrumbs items={[{ label: "Brand Data Room", href: "/brand-data-room" }, { label: "Products" }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground text-sm">Pick your favorite card style — 10 variants shown below.</p>
        </div>
        <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Product</Button>
      </div>

      {variants.map(({ label, Component }) => (
        <section key={label} className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground border-b pb-2">{label}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((p) => (
              <Component key={p.name} product={p} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
