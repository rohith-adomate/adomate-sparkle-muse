import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Separator } from "@/components/ui/separator";

const syncHistory = [
  { time: "1 hour ago", status: "Success", records: "1,234" },
  { time: "Yesterday, 3:00 PM", status: "Success", records: "1,198" },
  { time: "Feb 11, 10:00 AM", status: "Success", records: "1,150" },
];

export default function MetaIntegration() {
  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumbs items={[{ label: "Data Room", href: "/brand-data-room" }, { label: "Meta Integration" }]} />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Meta Integration</h1>
        <p className="text-muted-foreground text-sm">Connect and manage your Meta ad accounts.</p>
      </div>

      <Card className="border border-border/60">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-600 font-semibold">
              <CheckCircle2 className="h-5 w-5" />
              Connected
            </div>
            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-xs">Active</Badge>
          </div>

          <div className="rounded-lg bg-purple-50 p-4">
            <p className="font-semibold text-sm">Oy Care (Demo Ad Account)</p>
            <p className="text-xs text-muted-foreground">Connection ready for campaign workflows.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "AD ACCOUNTS", value: "1 account linked" },
              { label: "PAGES", value: "Oy Care (Demo Business)" },
              { label: "LAST SYNC", value: "05/03/2026, 13:08:15" },
              { label: "META ACCOUNT ID", value: "123456789012345" },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-lg border border-border/60">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{item.label}</p>
                <p className="font-semibold mt-0.5 text-sm">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button size="sm" className="gap-1.5">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/></svg>
              Connect Meta Ad Account
            </Button>
            <Button variant="outline" size="sm">Manage in Meta</Button>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">Disconnect</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/60">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-primary" />
            <p className="font-semibold">Sync History</p>
          </div>
          <div className="space-y-0">
            {syncHistory.map((s, i) => (
              <div key={i}>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm">{s.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{s.records} records</span>
                    <Badge variant="secondary" className="text-xs font-normal">{s.status}</Badge>
                  </div>
                </div>
                {i < syncHistory.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
