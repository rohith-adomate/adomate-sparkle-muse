import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";

const products = [
  { name: "SmartWidget Pro", hypothesis: "SMBs need a plug-and-play ad tool", problem: "Ad creation is too complex for small teams", solution: "One-click AI ad generation", competitor: "Canva Ads, AdCreative.ai" },
  { name: "QuickLaunch", hypothesis: "Speed-to-market wins in seasonal campaigns", problem: "Campaign setup takes 2+ weeks", solution: "Template-based 1-day launch", competitor: "Smartly.io" },
  { name: "InsightEngine", hypothesis: "Data-driven brands outperform gut-feel brands", problem: "No unified view of ad performance + brand data", solution: "Unified analytics dashboard", competitor: "Triple Whale, Northbeam" },
  { name: "CreativeOS", hypothesis: "Creative teams waste time on repetitive variations", problem: "Manual asset resizing and copy tweaking", solution: "AI-powered creative variations at scale", competitor: "Pencil, Omneky" },
];

export default function Products() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm">Manage your product catalog and competitive positioning.</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Product</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {products.map((p) => (
          <Card key={p.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">{p.name}</CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><span className="font-medium">Hypothesis:</span> <span className="text-muted-foreground">{p.hypothesis}</span></div>
              <div><span className="font-medium">Problem:</span> <span className="text-muted-foreground">{p.problem}</span></div>
              <div><span className="font-medium">Solution:</span> <span className="text-muted-foreground">{p.solution}</span></div>
              <div className="flex items-center gap-2 pt-1">
                <span className="font-medium text-xs">Competitors:</span>
                {p.competitor.split(", ").map((c) => (
                  <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
