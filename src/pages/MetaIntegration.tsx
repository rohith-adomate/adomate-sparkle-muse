import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink } from "lucide-react";

export default function MetaIntegration() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Meta Integration</h1>
        <p className="text-muted-foreground text-sm">Connect and manage your Meta ad accounts.</p>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" /> Connected
          </CardTitle>
          <Badge variant="outline">Active</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Ad Accounts</p>
              <p className="font-semibold">2 accounts linked</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pages</p>
              <p className="font-semibold">Acme Co Official</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Sync</p>
              <p className="font-semibold">1 hour ago</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Spend (MTD)</p>
              <p className="font-semibold">$4,320</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-3.5 w-3.5 mr-1" /> Manage in Meta Business Suite
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
