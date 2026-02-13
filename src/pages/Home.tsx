import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Lightbulb, Palette, CalendarDays, BarChart3, Clock, Activity,
  CheckCircle2, AlertCircle, Megaphone, Sparkles, ArrowRight, Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const widgets = [
  { title: "This Week's Insights", value: "3 new trends", desc: "Short-form UGC outperforming studio shots by 2.4x", icon: Sparkles, gradient: "from-primary/10 to-purple-500/5" },
  { title: "Concepts Ready", value: "7", desc: "Awaiting review", icon: Lightbulb, gradient: "from-violet-500/10 to-fuchsia-500/5" },
  { title: "Studio Assets", value: "21", desc: "Generated this week", icon: Palette, gradient: "from-fuchsia-500/10 to-pink-500/5" },
  { title: "Calendar", value: "3", desc: "Scheduled this week", icon: CalendarDays, gradient: "from-cyan-500/10 to-teal-500/5" },
];

const kpis = [
  { label: "CTR", value: "3.2%", change: "+0.4%" },
  { label: "Spend", value: "$1,240", change: "+$320" },
  { label: "ROAS", value: "4.1x", change: "+0.6x" },
  { label: "Impressions", value: "54.3K", change: "+12%" },
];

const recentActivity = [
  { text: "Campaign 'Summer Kickoff' completed — 12 concepts generated", time: "2h ago" },
  { text: "3 ads approved and sent to calendar", time: "4h ago" },
  { text: "Meta integration synced successfully", time: "6h ago" },
  { text: "New persona 'Budget Shopper' created", time: "1d ago" },
];

const setupHealth = [
  { label: "Brand Knowledge", done: true },
  { label: "Products", done: true },
  { label: "Customer Personas", done: true },
  { label: "Meta Integration", done: false },
  { label: "Custom Keywords", done: false },
];

const quickActions = [
  { label: "New Campaign", icon: Megaphone, url: "/campaigns" },
  { label: "Review Concepts", icon: Lightbulb, url: "/concepts" },
  { label: "Open Studio", icon: Palette, url: "/studio" },
  { label: "View Performance", icon: BarChart3, url: "/performance" },
];

export default function Home() {
  const nav = useNavigate();
  const doneCount = setupHealth.filter((s) => s.done).length;

  return (
    <div className="space-y-8">
      {/* Hero greeting */}
      <div className="rounded-2xl gradient-home border p-6">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, John 👋</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your brand this week.</p>
        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          {quickActions.map((a) => (
            <Button key={a.label} variant="outline" size="sm" className="gap-1.5 bg-card/60 backdrop-blur-sm" onClick={() => nav(a.url)}>
              <a.icon className="h-3.5 w-3.5" />
              {a.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary widgets */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {widgets.map((w) => (
          <Card key={w.title} className="card-hover overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{w.title}</CardTitle>
              <div className={`icon-badge rounded-xl bg-gradient-to-br ${w.gradient}`}>
                <w.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{w.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{w.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance snapshot */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <div className="icon-badge bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            Performance Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8 flex-wrap">
            {kpis.map((k) => (
              <div key={k.label} className="space-y-0.5">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{k.label}</p>
                <p className="text-2xl font-bold tracking-tight">{k.value}</p>
                <p className="text-xs text-success font-medium">{k.change}</p>
              </div>
            ))}
          </div>
          {/* Mini decorative chart bar */}
          <div className="flex items-end gap-1 mt-4 h-8">
            {[40, 55, 35, 60, 75, 50, 80, 65, 90, 70, 85, 95].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm bg-primary/15" style={{ height: `${h}%` }} />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Next run */}
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="icon-badge bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-lg">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              Next Scheduled Run
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold tracking-tight">Feb 17, 2026</p>
            <p className="text-sm text-muted-foreground">9:00 AM — Weekly Ad Sprint</p>
            <div className="mt-3 flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs text-muted-foreground">Auto-run enabled</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="icon-badge bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-lg">
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentActivity.map((a, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <div className="flex-1">
                    <p className="text-muted-foreground leading-relaxed">{a.text}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Setup health */}
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="icon-badge bg-gradient-to-br from-emerald-500/10 to-green-500/5 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              Setup Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">{doneCount} of {setupHealth.length} complete</span>
                <span className="font-medium">{Math.round((doneCount / setupHealth.length) * 100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all" style={{ width: `${(doneCount / setupHealth.length) * 100}%` }} />
              </div>
            </div>
            <ul className="space-y-2">
              {setupHealth.map((s) => (
                <li key={s.label} className="flex items-center gap-2 text-sm">
                  {s.done ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  )}
                  <span className={s.done ? "" : "text-muted-foreground"}>{s.label}</span>
                  {!s.done && (
                    <Button variant="ghost" size="sm" className="ml-auto h-6 text-[10px] gap-1 text-primary">
                      Set up <ArrowRight className="h-3 w-3" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
