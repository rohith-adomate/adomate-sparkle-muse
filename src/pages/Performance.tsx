import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Sparkles, ThumbsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const kpis = [
  { label: "Impressions", value: "128.4K", change: "+12%", up: true, topColor: "border-t-emerald-400" },
  { label: "CTR", value: "3.2%", change: "+0.4%", up: true, topColor: "border-t-emerald-400" },
  { label: "ROAS", value: "4.1x", change: "+0.6x", up: true, topColor: "border-t-emerald-400" },
  { label: "Spend", value: "$4,320", change: "+$820", up: false, topColor: "border-t-amber-400" },
  { label: "Conversions", value: "342", change: "+28", up: true, topColor: "border-t-emerald-400" },
];

const gradients = [
  "from-indigo-400/25 to-violet-500/15",
  "from-sky-400/25 to-blue-500/15",
  "from-amber-400/25 to-orange-500/15",
  "from-emerald-400/25 to-teal-500/15",
  "from-fuchsia-400/25 to-pink-500/15",
];

const creativePerf = [
  { name: "Beach Vibes UGC", ctr: "4.8%", roas: "5.2x", impressions: "32K", rank: 1 },
  { name: "Feature Highlight", ctr: "3.4%", roas: "4.0x", impressions: "28K", rank: 2 },
  { name: "Gift Guide Carousel", ctr: "3.1%", roas: "3.8x", impressions: "24K", rank: 3 },
  { name: "Bold CTA Banner", ctr: "2.9%", roas: "3.5x", impressions: "22K", rank: 4 },
  { name: "Social Proof Strip", ctr: "2.6%", roas: "3.2x", impressions: "18K", rank: 5 },
];

const learnings = [
  { type: "success", text: "UGC-style creatives outperform studio shots by 2.4x on ROAS", icon: ThumbsUp },
  { type: "success", text: "Short copy (< 80 chars) drives 18% higher CTR", icon: TrendingUp },
  { type: "warning", text: "\"Free trial\" claim triggers 15% higher drop-off — consider alternatives", icon: AlertTriangle },
  { type: "warning", text: "Story format underperforming vs Feed by 35% for this brand", icon: TrendingDown },
  { type: "success", text: "Lifestyle imagery with diverse models increases engagement by 22%", icon: Sparkles },
];

export default function Performance() {
  const nav = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Performance & Learnings</h1>
        <p className="text-muted-foreground text-sm">Track ad performance and discover actionable insights.</p>
      </div>

      {/* KPI strip */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map((k) => (
          <Card key={k.label} className={`card-hover overflow-hidden border-t-[3px] ${k.topColor}`}>
            <CardContent className="p-4">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{k.label}</p>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-2xl font-bold tracking-tight">{k.value}</p>
                {/* Mini decorative chart */}
                <div className="flex items-end gap-0.5 h-5 mb-1">
                  {[30, 50, 40, 60, 80, 55, 90].map((h, i) => (
                    <div key={i} className={`w-1 rounded-full ${k.up ? "bg-emerald-300" : "bg-amber-300"}`} style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
              <p className={`text-xs mt-0.5 flex items-center gap-1 font-medium ${k.up ? "text-emerald-600" : "text-amber-600"}`}>
                {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {k.change} vs last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Creative performance leaderboard */}
      <Card>
        <CardHeader><CardTitle className="text-base section-header">Creative Performance</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {creativePerf.map((c, i) => (
              <div key={c.name} className="border rounded-xl p-3 space-y-3 card-hover relative overflow-hidden">
                {/* Rank number */}
                <div className="absolute top-2 left-2 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-primary">#{c.rank}</span>
                </div>
                <div className={`h-28 rounded-lg bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center`}>
                  <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm" />
                </div>
                <p className="text-sm font-semibold flex items-center gap-1.5">
                  {c.name}
                  {c.rank === 1 && <Badge className="text-[9px] bg-amber-100 text-amber-700 border-amber-200">Top</Badge>}
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div><span className="text-muted-foreground block text-[10px] uppercase tracking-wider">CTR</span><span className="font-semibold">{c.ctr}</span></div>
                  <div><span className="text-muted-foreground block text-[10px] uppercase tracking-wider">ROAS</span><span className="font-semibold">{c.roas}</span></div>
                  <div><span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Impr.</span><span className="font-semibold">{c.impressions}</span></div>
                </div>
                <Button size="sm" className="w-full text-xs gap-1.5 gradient-primary text-white border-0" onClick={() => { nav("/concepts"); toast.success("Queued for next campaign run"); }}>
                  <Sparkles className="h-3 w-3" /> Generate More Like This
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learnings */}
      <Card>
        <CardHeader><CardTitle className="text-base section-header">Learnings</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {learnings.map((l, i) => (
            <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border-l-[3px] ${l.type === "success" ? "border-l-emerald-400 bg-emerald-50/50" : "border-l-amber-400 bg-amber-50/50"}`}>
              <div className={`icon-badge rounded-lg ${l.type === "success" ? "bg-emerald-100" : "bg-amber-100"}`}>
                <l.icon className={`h-4 w-4 ${l.type === "success" ? "text-emerald-600" : "text-amber-600"}`} />
              </div>
              <p className="text-sm leading-relaxed">{l.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
