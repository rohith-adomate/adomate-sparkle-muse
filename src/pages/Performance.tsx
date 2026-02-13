import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Sparkles, ThumbsUp } from "lucide-react";

const kpis = [
  { label: "Impressions", value: "128.4K", change: "+12%", up: true },
  { label: "CTR", value: "3.2%", change: "+0.4%", up: true },
  { label: "ROAS", value: "4.1×", change: "+0.6×", up: true },
  { label: "Spend", value: "$4,320", change: "+$820", up: false },
  { label: "Conversions", value: "342", change: "+28", up: true },
];

const creativePerf = [
  { name: "Beach Vibes UGC", ctr: "4.8%", roas: "5.2×", impressions: "32K", top: true },
  { name: "Feature Highlight", ctr: "3.4%", roas: "4.0×", impressions: "28K", top: false },
  { name: "Gift Guide Carousel", ctr: "3.1%", roas: "3.8×", impressions: "24K", top: false },
  { name: "Bold CTA Banner", ctr: "2.9%", roas: "3.5×", impressions: "22K", top: false },
  { name: "Social Proof Strip", ctr: "2.6%", roas: "3.2×", impressions: "18K", top: false },
];

const learnings = [
  { type: "success", text: "UGC-style creatives outperform studio shots by 2.4× on ROAS", icon: ThumbsUp },
  { type: "success", text: "Short copy (< 80 chars) drives 18% higher CTR", icon: TrendingUp },
  { type: "warning", text: "\"Free trial\" claim triggers 15% higher drop-off — consider alternatives", icon: AlertTriangle },
  { type: "warning", text: "Story format underperforming vs Feed by 35% for this brand", icon: TrendingDown },
  { type: "success", text: "Lifestyle imagery with diverse models increases engagement by 22%", icon: Sparkles },
];

export default function Performance() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Performance & Learnings</h1>
        <p className="text-muted-foreground text-sm">Track ad performance and discover actionable insights.</p>
      </div>

      {/* KPI strip */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className="text-xl font-bold mt-1">{k.value}</p>
              <p className={`text-xs mt-0.5 flex items-center gap-1 ${k.up ? "text-success" : "text-warning"}`}>
                {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {k.change} vs last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Creative performance */}
      <Card>
        <CardHeader><CardTitle className="text-base">Creative Performance</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {creativePerf.map((c) => (
              <div key={c.name} className="border rounded-lg p-3 space-y-2">
                <div className="h-24 rounded bg-muted flex items-center justify-center text-2xl">🎨</div>
                <p className="text-sm font-semibold flex items-center gap-1">{c.name} {c.top && <Badge className="text-[9px]">Top</Badge>}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div><span className="text-muted-foreground block">CTR</span>{c.ctr}</div>
                  <div><span className="text-muted-foreground block">ROAS</span>{c.roas}</div>
                  <div><span className="text-muted-foreground block">Impr.</span>{c.impressions}</div>
                </div>
                <Button size="sm" variant="outline" className="w-full text-xs gap-1"><Sparkles className="h-3 w-3" /> Generate More Like This</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learnings */}
      <Card>
        <CardHeader><CardTitle className="text-base">Learnings</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {learnings.map((l, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${l.type === "success" ? "bg-accent" : "bg-destructive/5"}`}>
              <l.icon className={`h-5 w-5 shrink-0 mt-0.5 ${l.type === "success" ? "text-success" : "text-warning"}`} />
              <p className="text-sm">{l.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
