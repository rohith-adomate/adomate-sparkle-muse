import { Card, CardContent } from "@/components/ui/card";
import { Building2, Palette, Users, TrendingUp, Workflow, Sparkles, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const chartData = [
  { week: "W1", concepts: 4 },
  { week: "W2", concepts: 2 },
  { week: "W3", concepts: 6 },
  { week: "W4", concepts: 1 },
  { week: "W5", concepts: 3 },
  { week: "W6", concepts: 0 },
  { week: "W7", concepts: 2 },
  { week: "W8", concepts: 1 },
  { week: "W9", concepts: 0 },
  { week: "W10", concepts: 3 },
  { week: "W11", concepts: 1 },
  { week: "W12", concepts: 1 },
];

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <Card className="border border-border/40 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-1">
          <div className={`rounded-lg p-1.5 ${accent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export default function AdminHome() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Live snapshot of platform usage and activity.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2} label="Companies" value="1" sub="Demo 1" accent />
        <StatCard icon={Palette} label="Brands" value="2" />
        <StatCard icon={Users} label="Users" value="0" sub="0 onboarded (0%)" />
        <StatCard icon={TrendingUp} label="New this week" value="1" sub="+1 company · +0 users" accent />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Workflows card */}
        <Card className="border border-border/40 shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg p-1.5 bg-primary/10 text-primary">
                <Workflow className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold">Workflows</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <span className="text-2xl font-bold">3</span>
                <div>
                  <p className="text-sm font-medium">Configured</p>
                  <p className="text-xs text-muted-foreground">Workflows created by users</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <span className="text-2xl font-bold">3</span>
                <div>
                  <p className="text-sm font-medium">Runs – last 7 days</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    <span className="text-xs text-success font-medium">3 succeeded, 100% success rate</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ad Concepts chart card */}
        <Card className="border border-border/40 shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg p-1.5 bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-sm font-semibold">Ad concepts generated</span>
                  <p className="text-xs text-muted-foreground">Weekly – last 3 months</p>
                </div>
              </div>
              <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-2.5 py-1">24 all time</span>
            </div>

            <div className="h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="concepts" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
