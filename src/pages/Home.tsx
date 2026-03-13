import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Users, Sparkles, ArrowRight } from "lucide-react";

const campaignRows = [
  {
    name: "Competitor Refresh (Demo)",
    type: "COMPETITOR",
    status: "ACTIVE",
    hasPreviews: false,
  },
];

export default function Home() {
  const nav = useNavigate();

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Welcome banner */}
      <Card className="border border-border/60">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Ankit 👋</h1>
          <p className="text-muted-foreground mt-1 text-sm">Here's your execution snapshot for this brand.</p>
        </CardContent>
      </Card>

      {/* Two stat cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border border-border/60">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Ads Generated</p>
              <p className="text-sm text-muted-foreground mt-0.5">Concepts available for review and launch.</p>
            </div>
            <span className="text-5xl font-bold tracking-tight">32</span>
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Next Scheduled Run</p>
              <p className="text-sm text-muted-foreground mt-0.5">No active schedule yet.</p>
            </div>
            <span className="text-2xl font-bold tracking-tight whitespace-nowrap">Not scheduled</span>
          </CardContent>
        </Card>
      </div>

      {/* Concepts Feed */}
      <Card className="border border-border/60">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Concepts Feed</h2>
              <p className="text-sm text-muted-foreground">Explore campaign rows with recent generated concepts.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => nav("/concepts")}>
              Open concepts
            </Button>
          </div>

          <div className="space-y-3">
            {campaignRows.map((row) => (
              <Card key={row.name} className="border border-border/60">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{row.name}</p>
                    {!row.hasPreviews && (
                      <p className="text-xs text-muted-foreground mt-0.5">No concept previews for this campaign yet.</p>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs font-medium tracking-wide">
                    {row.type} · {row.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
