import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ImageIcon, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const products = [
  { name: "Hydra Glow Serum", images: 6, imgSeed: "serum" },
  { name: "Gentle Foam Cleanser", images: 4, imgSeed: "cleanser" },
  { name: "Vitamin C Brightening Cream", images: 8, imgSeed: "vitaminc" },
];

function getImageUrl(seed: string, idx: number, w = 300, h = 300) {
  return `https://picsum.photos/seed/${seed}${idx}/${w}/${h}`;
}

const ActionMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => (
    <div ref={ref} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem className="gap-2 text-sm"><Pencil className="h-3.5 w-3.5" /> Edit</DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-sm text-destructive focus:text-destructive"><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem>
      </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
);
ActionMenu.displayName = "ActionMenu";

// ─── Variant 1: Clean Rounded ───
function V1({ product }: { product: typeof products[0] }) {
  const max = 3, remaining = Math.max(0, product.images - 1 - max);
  return (
    <Card className="flex items-center gap-4 p-3 h-28">
      <div className="w-22 h-22 rounded-xl overflow-hidden bg-muted flex-shrink-0">
        <img src={getImageUrl(product.imgSeed, 0)} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col justify-between flex-1 min-w-0 h-full py-0.5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate">{product.name}</h3>
            <span className="text-xs text-muted-foreground">{product.images} images</span>
          </div>
          <ActionMenu />
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: Math.min(max, product.images - 1) }).map((_, i) => (
            <div key={i} className="w-9 h-9 rounded-lg overflow-hidden bg-muted"><img src={getImageUrl(product.imgSeed, i + 1)} alt="" className="w-full h-full object-cover" /></div>
          ))}
          {remaining > 0 && <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-[10px] font-medium text-muted-foreground">+{remaining}</div>}
        </div>
      </div>
    </Card>
  );
}

// ─── Variant 2: Tight with Divider ───
function V2({ product }: { product: typeof products[0] }) {
  const max = 3, remaining = Math.max(0, product.images - 1 - max);
  return (
    <Card className="flex overflow-hidden h-28">
      <div className="w-28 flex-shrink-0 bg-muted">
        <img src={getImageUrl(product.imgSeed, 0, 300, 300)} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="border-l" />
      <div className="flex flex-col justify-between flex-1 min-w-0 p-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-sm truncate">{product.name}</h3>
          <ActionMenu />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: Math.min(max, product.images - 1) }).map((_, i) => (
              <div key={i} className="w-8 h-8 rounded overflow-hidden bg-muted"><img src={getImageUrl(product.imgSeed, i + 1, 100, 100)} alt="" className="w-full h-full object-cover" /></div>
            ))}
            {remaining > 0 && <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">+{remaining}</div>}
          </div>
          <span className="text-[10px] text-muted-foreground ml-auto">{product.images} total</span>
        </div>
      </div>
    </Card>
  );
}

// ─── Variant 3: Circular Hero ───
function V3({ product }: { product: typeof products[0] }) {
  const max = 3, remaining = Math.max(0, product.images - 1 - max);
  return (
    <Card className="flex items-center gap-4 p-4 h-24">
      <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0 ring-2 ring-primary/20">
        <img src={getImageUrl(product.imgSeed, 0)} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm truncate">{product.name}</h3>
        <div className="flex items-center gap-1.5 mt-1.5">
          {Array.from({ length: Math.min(max, product.images - 1) }).map((_, i) => (
            <div key={i} className="w-7 h-7 rounded-full overflow-hidden bg-muted border border-background"><img src={getImageUrl(product.imgSeed, i + 1, 80, 80)} alt="" className="w-full h-full object-cover" /></div>
          ))}
          {remaining > 0 && <div className="w-7 h-7 rounded-full bg-accent border border-border flex items-center justify-center text-[9px] font-medium text-muted-foreground">+{remaining}</div>}
          <span className="text-[10px] text-muted-foreground ml-1">{product.images} imgs</span>
        </div>
      </div>
      <ActionMenu />
    </Card>
  );
}

// ─── Variant 4: Gradient Accent Bar ───
function V4({ product }: { product: typeof products[0] }) {
  const max = 3, remaining = Math.max(0, product.images - 1 - max);
  return (
    <Card className="flex overflow-hidden h-28">
      <div className="w-1 bg-gradient-to-b from-primary to-primary/30 flex-shrink-0" />
      <div className="w-24 flex-shrink-0 bg-muted">
        <img src={getImageUrl(product.imgSeed, 0, 250, 300)} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col justify-between flex-1 min-w-0 p-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate">{product.name}</h3>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{product.images} images</span>
          </div>
          <ActionMenu />
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: Math.min(max, product.images - 1) }).map((_, i) => (
            <div key={i} className="w-9 h-9 rounded-md overflow-hidden bg-muted"><img src={getImageUrl(product.imgSeed, i + 1)} alt="" className="w-full h-full object-cover" /></div>
          ))}
          {remaining > 0 && <div className="w-9 h-9 rounded-md bg-accent flex items-center justify-center text-[10px] font-semibold text-muted-foreground">+{remaining}</div>}
        </div>
      </div>
    </Card>
  );
}

// ─── Variant 5: Stacked Thumbnails Right ───
function V5({ product }: { product: typeof products[0] }) {
  const max = 3, remaining = Math.max(0, product.images - 1 - max);
  return (
    <Card className="flex items-center p-3 gap-3 h-24">
      <div className="w-18 h-18 rounded-lg overflow-hidden bg-muted flex-shrink-0 shadow-sm">
        <img src={getImageUrl(product.imgSeed, 0, 200, 200)} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm truncate">{product.name}</h3>
        <span className="text-xs text-muted-foreground">{product.images} images</span>
      </div>
      <div className="flex -space-x-1.5 flex-shrink-0">
        {Array.from({ length: Math.min(max, product.images - 1) }).map((_, i) => (
          <div key={i} className="w-10 h-10 rounded-md overflow-hidden bg-muted border-2 border-background shadow-sm"><img src={getImageUrl(product.imgSeed, i + 1)} alt="" className="w-full h-full object-cover" /></div>
        ))}
        {remaining > 0 && <div className="w-10 h-10 rounded-md bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium text-muted-foreground shadow-sm">+{remaining}</div>}
      </div>
      <ActionMenu />
    </Card>
  );
}

// ─── Variant 6: Subtle Shadow Elevated ───
function V6({ product }: { product: typeof products[0] }) {
  const max = 3, remaining = Math.max(0, product.images - 1 - max);
  return (
    <Card className="flex overflow-hidden h-32 shadow-md hover:shadow-lg transition-shadow">
      <div className="w-32 flex-shrink-0 bg-muted relative">
        <img src={getImageUrl(product.imgSeed, 0, 300, 300)} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
      </div>
      <div className="flex flex-col justify-between flex-1 min-w-0 p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="font-bold text-sm truncate">{product.name}</h3>
            <div className="flex items-center gap-1 mt-0.5"><ImageIcon className="h-3 w-3 text-muted-foreground" /><span className="text-xs text-muted-foreground">{product.images}</span></div>
          </div>
          <ActionMenu />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: Math.min(max, product.images - 1) }).map((_, i) => (
            <div key={i} className="w-10 h-10 rounded-lg overflow-hidden bg-muted shadow-sm"><img src={getImageUrl(product.imgSeed, i + 1)} alt="" className="w-full h-full object-cover" /></div>
          ))}
          {remaining > 0 && <div className="w-10 h-10 rounded-lg bg-accent/80 flex items-center justify-center text-[10px] font-semibold text-muted-foreground">+{remaining}</div>}
        </div>
      </div>
    </Card>
  );
}

// ─── Variant 7: Bottom Thumbnails Row ───
function V7({ product }: { product: typeof products[0] }) {
  const max = 3, remaining = Math.max(0, product.images - 1 - max);
  return (
    <Card className="overflow-hidden">
      <div className="flex h-24">
        <div className="w-24 flex-shrink-0 bg-muted">
          <img src={getImageUrl(product.imgSeed, 0, 250, 250)} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center justify-between flex-1 min-w-0 px-4">
          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate">{product.name}</h3>
            <span className="text-xs text-muted-foreground">{product.images} images</span>
          </div>
          <ActionMenu />
        </div>
      </div>
      <div className="flex gap-px bg-border border-t">
        {Array.from({ length: Math.min(max, product.images - 1) }).map((_, i) => (
          <div key={i} className="flex-1 h-12 bg-muted"><img src={getImageUrl(product.imgSeed, i + 1, 200, 100)} alt="" className="w-full h-full object-cover" /></div>
        ))}
        {remaining > 0 && <div className="flex-1 h-12 bg-accent flex items-center justify-center text-xs font-medium text-muted-foreground">+{remaining}</div>}
      </div>
    </Card>
  );
}

// ─── Variant 8: Dark Overlay Info ───
function V8({ product }: { product: typeof products[0] }) {
  const max = 3, remaining = Math.max(0, product.images - 1 - max);
  return (
    <Card className="flex overflow-hidden h-28 group">
      <div className="w-28 flex-shrink-0 bg-muted relative">
        <img src={getImageUrl(product.imgSeed, 0, 300, 300)} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium backdrop-blur-sm">{product.images}</div>
      </div>
      <CardContent className="flex flex-col justify-between flex-1 min-w-0 p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm truncate leading-tight">{product.name}</h3>
          <ActionMenu />
        </div>
        <div className="flex gap-1.5 items-end">
          {Array.from({ length: Math.min(max, product.images - 1) }).map((_, i) => (
            <div key={i} className="w-9 h-9 rounded overflow-hidden bg-muted opacity-80 group-hover:opacity-100 transition-opacity"><img src={getImageUrl(product.imgSeed, i + 1, 100, 100)} alt="" className="w-full h-full object-cover" /></div>
          ))}
          {remaining > 0 && <div className="w-9 h-9 rounded bg-foreground/5 flex items-center justify-center text-[10px] font-medium text-muted-foreground">+{remaining}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Variant 9: Bordered Minimal ───
function V9({ product }: { product: typeof products[0] }) {
  const max = 3, remaining = Math.max(0, product.images - 1 - max);
  return (
    <Card className="flex items-stretch overflow-hidden h-24 border-2 hover:border-primary/30 transition-colors">
      <div className="w-24 flex-shrink-0 bg-muted">
        <img src={getImageUrl(product.imgSeed, 0, 250, 250)} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex items-center flex-1 min-w-0 px-4 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{product.name}</h3>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{product.images} images</span>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          {Array.from({ length: Math.min(max, product.images - 1) }).map((_, i) => (
            <div key={i} className="w-8 h-8 rounded-sm overflow-hidden bg-muted border border-border"><img src={getImageUrl(product.imgSeed, i + 1, 80, 80)} alt="" className="w-full h-full object-cover" /></div>
          ))}
          {remaining > 0 && <div className="w-8 h-8 rounded-sm border border-border bg-accent flex items-center justify-center text-[9px] font-semibold text-muted-foreground">+{remaining}</div>}
        </div>
        <ActionMenu />
      </div>
    </Card>
  );
}

// ─── Variant 10: Pill-Shaped Compact ───
function V10({ product }: { product: typeof products[0] }) {
  const max = 3, remaining = Math.max(0, product.images - 1 - max);
  return (
    <Card className="flex items-center gap-3 p-2 pr-3 rounded-full h-16">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
        <img src={getImageUrl(product.imgSeed, 0, 120, 120)} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm truncate">{product.name}</h3>
      </div>
      <div className="flex items-center -space-x-1 flex-shrink-0">
        {Array.from({ length: Math.min(max, product.images - 1) }).map((_, i) => (
          <div key={i} className="w-7 h-7 rounded-full overflow-hidden bg-muted border-2 border-background"><img src={getImageUrl(product.imgSeed, i + 1, 70, 70)} alt="" className="w-full h-full object-cover" /></div>
        ))}
        {remaining > 0 && <div className="w-7 h-7 rounded-full bg-accent border-2 border-background flex items-center justify-center text-[9px] font-bold text-muted-foreground">+{remaining}</div>}
      </div>
      <span className="text-[10px] text-muted-foreground flex-shrink-0">{product.images}</span>
      <ActionMenu />
    </Card>
  );
}

const variants = [
  { label: "1 · Clean Rounded", Component: V1 },
  { label: "2 · Tight with Divider", Component: V2 },
  { label: "3 · Circular Hero", Component: V3 },
  { label: "4 · Gradient Accent Bar", Component: V4 },
  { label: "5 · Stacked Thumbnails Right", Component: V5 },
  { label: "6 · Subtle Shadow Elevated", Component: V6 },
  { label: "7 · Bottom Thumbnails Row", Component: V7 },
  { label: "8 · Dark Overlay Badge", Component: V8 },
  { label: "9 · Bordered Minimal", Component: V9 },
  { label: "10 · Pill-Shaped Compact", Component: V10 },
];

export default function Products() {
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <Breadcrumbs items={[{ label: "Brand Data Room", href: "/brand-data-room" }, { label: "Products" }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground text-sm">10 horizontal strip variants — pick your favorite.</p>
        </div>
        <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Product</Button>
      </div>

      {variants.map(({ label, Component }) => (
        <section key={label} className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground border-b pb-2">{label}</h2>
          <div className="space-y-3">
            {products.map((p) => (
              <Component key={p.name} product={p} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
