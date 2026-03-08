import { Card, CardContent } from "@/components/ui/card";

const metrics = [
  { label: "Users", value: "--", sub: "Placeholder metrics" },
  { label: "Organizations", value: "--", sub: "Placeholder metrics" },
  { label: "Providers", value: "--", sub: "Placeholder metrics" },
];

export default function AdminHome() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Card className="border border-border/60">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mt-1">This is the scaffolded admin dashboard for system-level management.</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="border border-border/60">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{m.label}</p>
              <p className="text-2xl font-bold mt-1">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
