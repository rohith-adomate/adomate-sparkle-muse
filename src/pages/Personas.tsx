import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Link2 } from "lucide-react";

const personas = [
  { name: "Busy Entrepreneur", age: "28-40", income: "$80K-$150K", lifestyle: "Fast-paced, mobile-first, values efficiency", painPoints: "No time for creative work, needs quick results", products: ["SmartWidget Pro", "QuickLaunch"] },
  { name: "Budget Shopper", age: "22-35", income: "$35K-$60K", lifestyle: "Deal-seeking, social-media savvy, trend-conscious", painPoints: "Price sensitivity, overwhelmed by choices", products: ["CreativeOS"] },
  { name: "Data-Driven Marketer", age: "30-45", income: "$90K-$180K", lifestyle: "Analytics-obsessed, ROI-focused, multi-channel", painPoints: "Fragmented data, manual reporting", products: ["InsightEngine", "SmartWidget Pro"] },
];

export default function Personas() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer Personas</h1>
          <p className="text-muted-foreground text-sm">Define your target audiences and link them to products.</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Persona</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {personas.map((p) => (
          <Card key={p.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">{p.name}</CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7"><Link2 className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><span className="font-medium">Age:</span> <span className="text-muted-foreground">{p.age}</span></div>
              <div><span className="font-medium">Income:</span> <span className="text-muted-foreground">{p.income}</span></div>
              <div><span className="font-medium">Lifestyle:</span> <span className="text-muted-foreground">{p.lifestyle}</span></div>
              <div><span className="font-medium">Pain Points:</span> <span className="text-muted-foreground">{p.painPoints}</span></div>
              <div className="flex flex-wrap items-center gap-1 pt-1">
                <span className="font-medium text-xs">Products:</span>
                {p.products.map((pr) => <Badge key={pr} variant="outline" className="text-xs">{pr}</Badge>)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
