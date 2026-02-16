import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Link2, User } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Progress } from "@/components/ui/progress";
import { HoverExplainer } from "@/components/HoverExplainer";

const personas = [
  { name: "Busy Entrepreneur", age: "28-40", income: "$80K-$150K", lifestyle: "Fast-paced, mobile-first, values efficiency", painPoints: "No time for creative work, needs quick results", products: ["SmartWidget Pro", "QuickLaunch"], color: "from-indigo-500/15 to-violet-500/10", initial: "BE" },
  { name: "Budget Shopper", age: "22-35", income: "$35K-$60K", lifestyle: "Deal-seeking, social-media savvy, trend-conscious", painPoints: "Price sensitivity, overwhelmed by choices", products: ["CreativeOS"], color: "from-emerald-500/15 to-teal-500/10", initial: "BS" },
  { name: "Data-Driven Marketer", age: "30-45", income: "$90K-$180K", lifestyle: "Analytics-obsessed, ROI-focused, multi-channel", painPoints: "Fragmented data, manual reporting", products: ["InsightEngine", "SmartWidget Pro"], color: "from-amber-500/15 to-orange-500/10", initial: "DM" },
];

function incomeScale(income: string) {
  if (income.includes("150K")) return 70;
  if (income.includes("60K")) return 35;
  return 85;
}

export default function Personas() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Brand Data Room", href: "/brand-data-room" }, { label: "Customer Personas" }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Personas</h1>
          <p className="text-muted-foreground text-sm">Define your target audiences and link them to products.</p>
        </div>
        <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Persona</Button>
      </div>
      <HoverExplainer text="Persona Cards: Each persona represents a target audience segment. Linked to products via many-to-many. Demographics (age, income) shown as visual scales. Backend: personas table with columns: id, brand_id, name, age_range, income_range, lifestyle, pain_points. Junction table: product_personas(product_id, persona_id). Fed into AI prompts to generate audience-targeted ad copy and creative.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {personas.map((p) => (
            <Card key={p.name} className="card-hover">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                      <span className="text-sm font-bold text-foreground/80">{p.initial}</span>
                    </div>
                    <CardTitle className="text-base">{p.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Link2 className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Age Range</span>
                    <span className="font-medium">{p.age}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary/40" style={{ marginLeft: '20%', width: '30%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Income</span>
                    <span className="font-medium">{p.income}</span>
                  </div>
                  <Progress value={incomeScale(p.income)} className="h-1.5" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Lifestyle</span>
                  <p className="text-sm mt-0.5">{p.lifestyle}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Pain Points</span>
                  <p className="text-sm mt-0.5">{p.painPoints}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1 pt-2 border-t">
                  <span className="text-[10px] text-muted-foreground mr-1">Products:</span>
                  {p.products.map((pr) => <Badge key={pr} variant="outline" className="text-[10px]">{pr}</Badge>)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </HoverExplainer>
    </div>
  );
}
