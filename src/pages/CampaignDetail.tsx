import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle2, Clock, Lightbulb } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const campaignData: Record<string, { name: string; workflow: string; status: string; concepts: number; startedAt: string }> = {
  "1": { name: "Summer Kickoff", workflow: "Weekly Ad Sprint", status: "Completed", concepts: 12, startedAt: "Feb 10, 2026 9:00 AM" },
  "2": { name: "Valentine's Push", workflow: "Retail Ads", status: "Running", concepts: 6, startedAt: "Feb 8, 2026 11:30 AM" },
  "3": { name: "Q1 Evergreen", workflow: "Standard Weekly Sprint", status: "Completed", concepts: 18, startedAt: "Feb 5, 2026 8:00 AM" },
};

const timeline = [
  { step: "Knowledge Gathering", status: "done", duration: "12 min" },
  { step: "Insights Generation", status: "done", duration: "34 min" },
  { step: "Concept Creation", status: "done", duration: "48 min" },
];

export default function CampaignDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const campaign = campaignData[id || "1"] || campaignData["1"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{campaign.name}</h1>
          <p className="text-muted-foreground text-sm">Workflow: {campaign.workflow} · Started: {campaign.startedAt}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={campaign.status === "Running" ? "default" : "secondary"}>{campaign.status}</Badge>
          {campaign.status !== "Running" && <Button size="sm"><Play className="h-4 w-4 mr-1" /> Re-run Campaign</Button>}
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Run Timeline</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeline.map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.step}</p>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{t.duration}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:ring-2 hover:ring-primary/20" onClick={() => nav("/concepts")}>
        <CardContent className="flex items-center gap-3 py-4">
          <Lightbulb className="h-5 w-5 text-primary" />
          <div>
            <p className="font-semibold">{campaign.concepts} Concepts Generated</p>
            <p className="text-xs text-muted-foreground">Click to view and review concepts</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
