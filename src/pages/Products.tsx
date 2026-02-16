import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Package, ImageIcon, Upload } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { HoverExplainer } from "@/components/HoverExplainer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

const competitorColors: Record<string, string> = {
  "Canva Ads": "bg-violet-100 text-violet-700 border-violet-200",
  "AdCreative.ai": "bg-sky-100 text-sky-700 border-sky-200",
  "Smartly.io": "bg-amber-100 text-amber-700 border-amber-200",
  "Triple Whale": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Northbeam": "bg-rose-100 text-rose-700 border-rose-200",
  "Pencil": "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
  "Omneky": "bg-indigo-100 text-indigo-700 border-indigo-200",
};

const productGradients = [
  "from-indigo-400/20 to-violet-500/15",
  "from-sky-400/20 to-blue-500/15",
  "from-amber-400/20 to-orange-500/15",
  "from-emerald-400/20 to-teal-500/15",
];

const products = [
  { name: "SmartWidget Pro", hypothesis: "SMBs need a plug-and-play ad tool", problem: "Ad creation is too complex for small teams", solution: "One-click AI ad generation", competitor: "Canva Ads, AdCreative.ai", personas: ["Busy Entrepreneur", "Data-Driven Marketer"], images: 3 },
  { name: "QuickLaunch", hypothesis: "Speed-to-market wins in seasonal campaigns", problem: "Campaign setup takes 2+ weeks", solution: "Template-based 1-day launch", competitor: "Smartly.io", personas: ["Busy Entrepreneur"], images: 1 },
  { name: "InsightEngine", hypothesis: "Data-driven brands outperform gut-feel brands", problem: "No unified view of ad performance + brand data", solution: "Unified analytics dashboard", competitor: "Triple Whale, Northbeam", personas: ["Data-Driven Marketer"], images: 2 },
  { name: "CreativeOS", hypothesis: "Creative teams waste time on repetitive variations", problem: "Manual asset resizing and copy tweaking", solution: "AI-powered creative variations at scale", competitor: "Pencil, Omneky", personas: ["Budget Shopper"], images: 0 },
];

export default function Products() {
  const [showImages, setShowImages] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Brand Data Room", href: "/brand-data-room" }, { label: "Products" }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground text-sm">Manage your product catalog and competitive positioning.</p>
        </div>
        <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Product</Button>
      </div>

      <HoverExplainer text="Product Cards: Each product represents a unit in the brand's catalog. Products are linked to Personas and used as context in campaign concept generation. Backend: products table with columns: id, brand_id, name, hypothesis, problem, solution, competitors (text[]), created_at. Product-Persona linking is a many-to-many via product_personas junction table.">
        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((p, i) => (
            <Card key={p.name} className="card-hover overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary/60 to-primary/20" />
              {/* Product thumbnail */}
              <div className={`h-36 bg-gradient-to-br ${productGradients[i % productGradients.length]} flex items-center justify-center relative`}>
                <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-white/50" />
                </div>
                <div className="absolute bottom-2 right-2">
                  <Button variant="secondary" size="sm" className="text-[10px] gap-1 h-6 bg-white/80 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setShowImages(p.name); }}>
                    <ImageIcon className="h-3 w-3" /> {p.images} images
                  </Button>
                </div>
              </div>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="icon-badge rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base">{p.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid gap-2">
                  {[
                    { label: "Hypothesis", val: p.hypothesis },
                    { label: "Problem", val: p.problem },
                    { label: "Solution", val: p.solution },
                  ].map((f) => (
                    <div key={f.label}>
                      <span className="font-medium text-xs text-muted-foreground uppercase tracking-wider">{f.label}</span>
                      <p className="text-sm mt-0.5">{f.val}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.competitor.split(", ").map((c) => (
                    <Badge key={c} variant="outline" className={`text-[10px] border ${competitorColors[c] || "bg-muted text-muted-foreground"}`}>{c}</Badge>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-1 pt-1 border-t">
                  <span className="text-[10px] text-muted-foreground mr-1">Personas:</span>
                  {p.personas.map((pr) => (
                    <Badge key={pr} variant="secondary" className="text-[10px]">{pr}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </HoverExplainer>

      {/* Product Images Dialog */}
      <Dialog open={!!showImages} onOpenChange={(o) => !o && setShowImages(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Product Images — {showImages}</DialogTitle></DialogHeader>
          <HoverExplainer text="Product Images: Upload product photos used in AI-generated ad creative. Multiple images per product supported. Backend: stored in Supabase Storage bucket 'product-images/{product_id}/'. Image metadata stored in product_images table. Max 10 images per product, max 10MB per file. Supported formats: JPG, PNG, WebP.">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: products.find(p => p.name === showImages)?.images || 0 }).map((_, i) => (
                  <div key={i} className={`aspect-square rounded-xl bg-gradient-to-br ${productGradients[i % productGradients.length]} flex items-center justify-center`}>
                    <ImageIcon className="h-8 w-8 text-white/40" />
                  </div>
                ))}
              </div>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center space-y-2 hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                <p className="text-sm font-medium">Upload product images</p>
                <p className="text-xs text-muted-foreground">JPG, PNG, or WebP · Max 10MB per file</p>
              </div>
            </div>
          </HoverExplainer>
        </DialogContent>
      </Dialog>
    </div>
  );
}
