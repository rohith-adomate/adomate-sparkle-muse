import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Palette, CalendarDays, BarChart3, Clock, Activity, CheckCircle2, AlertCircle } from "lucide-react";

const widgets = [
  { title: "This Week's Insights", value: "3 new trends detected", desc: "Short-form UGC outperforming studio shots by 2.4x", icon: Lightbulb, color: "text-primary" },
  { title: "Concepts Ready", value: "7", desc: "Awaiting review", icon: Lightbulb, color: "text-primary" },
  { title: "Studio Assets", value: "21", desc: "Generated this week", icon: Palette, color: "text-primary" },
  { title: "Calendar", value: "3", desc: "Scheduled this week", icon: CalendarDays, color: "text-primary" },
];

const kpis = [
  { label: "CTR", value: "3.2%" },
  { label: "Spend", value: "$1,240" },
  { label: "ROAS", value: "4.1×" },
  { label: "Impressions", value: "54.3K" },
];

const recentActivity = [
  "Campaign 'Summer Kickoff' completed - 12 concepts generated",
  "3 ads approved and sent to calendar",
  "Meta integration synced successfully",
  "New persona 'Budget Shopper' created",
];

const setupHealth = [
  { label: "Brand Knowledge", done: true },
  { label: "Products", done: true },
  { label: "Customer Personas", done: true },
  { label: "Meta Integration", done: false },
  { label: "Custom Keywords", done: false },
];

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back 👋</h1>
        <p className="text-muted-foreground text-sm">Here's what's happening with your brand this week.</p>
      </div>

      {/* Summary widgets */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {widgets.map((w) => (
          <Card key={w.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{w.title}</CardTitle>
              <w.icon className={`h-4 w-4 ${w.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{w.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{w.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance snapshot */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" /> Performance Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 flex-wrap">
            {kpis.map((k) => (
              <div key={k.label}>
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="text-lg font-semibold">{k.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Next run */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Next Scheduled Run
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">Feb 17, 2026 — 9:00 AM</p>
            <p className="text-xs text-muted-foreground">Weekly Ad Sprint</p>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recentActivity.map((a, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Setup health */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Setup Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {setupHealth.map((s) => (
                <li key={s.label} className="flex items-center gap-2 text-sm">
                  {s.done ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-warning" />
                  )}
                  <span className={s.done ? "" : "text-muted-foreground"}>{s.label}</span>
                  {!s.done && <Badge variant="outline" className="text-[10px] ml-auto">Pending</Badge>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
