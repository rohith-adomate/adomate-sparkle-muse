import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, RefreshCw, Activity } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { HoverExplainer } from "@/components/HoverExplainer";

const syncHistory = [
  { time: "1 hour ago", status: "Success", records: "1,234" },
  { time: "Yesterday, 3:00 PM", status: "Success", records: "1,198" },
  { time: "Feb 11, 10:00 AM", status: "Success", records: "1,150" },
];

export default function MetaIntegration() {
  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumbs items={[{ label: "Brand Data Room", href: "/brand-data-room" }, { label: "Meta Integration" }]} />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Meta Integration</h1>
        <p className="text-muted-foreground text-sm">Connect and manage your Meta ad accounts.</p>
      </div>

      <HoverExplainer text="Connection Status: Shows OAuth connection state with Meta Business Suite. Backend: meta_connections table storing access_token (encrypted), refresh_token, token_expiry, connected_at. OAuth flow: redirect to Meta Login Dialog → callback with auth code → exchange for access token → store encrypted. Token refresh handled by Edge Function cron every 50 days.">
        <Card className="overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-sky-500 to-blue-600" />
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="relative">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              Connected
            </CardTitle>
            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">Active</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-sky-500/5 to-blue-500/5 border">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg">M</div>
              <div>
                <p className="font-semibold text-sm">Meta Business Suite</p>
                <p className="text-xs text-muted-foreground">Connected via OAuth</p>
              </div>
            </div>
            <HoverExplainer text="Account Details: Shows linked ad accounts, pages, last sync timestamp, and month-to-date spend. Backend: meta_ad_accounts table (id, meta_connection_id, account_id, account_name, currency). Spend pulled from Meta Marketing API /act_{id}/insights endpoint with date_preset=this_month.">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Ad Accounts", value: "2 accounts linked" },
                  { label: "Pages", value: "Acme Co Official" },
                  { label: "Last Sync", value: "1 hour ago" },
                  { label: "Total Spend (MTD)", value: "$4,320" },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-lg bg-muted/50">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                    <p className="font-semibold mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            </HoverExplainer>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Sync Now
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" /> Manage in Meta
              </Button>
            </div>
          </CardContent>
        </Card>
      </HoverExplainer>

      <HoverExplainer text="Sync History: Log of all data synchronization events with Meta. Backend: meta_sync_logs table (id, meta_connection_id, status, records_synced, error_message, started_at, completed_at). Sync runs hourly via Edge Function cron. Pulls: campaigns, adsets, ads, insights (spend, impressions, clicks, conversions).">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Sync History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {syncHistory.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm">{s.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{s.records} records</span>
                    <Badge variant="secondary" className="text-[10px]">{s.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </HoverExplainer>
    </div>
  );
}
