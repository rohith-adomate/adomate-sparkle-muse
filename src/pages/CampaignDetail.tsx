import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle2, Clock, Lightbulb, ArrowRight } from "lucide-react";
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
  const isCompleted = campaign.status === "Completed";

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className={`rounded-2xl p-6 ${isCompleted ? "gradient-perf" : "gradient-data"} border`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{campaign.name}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{campaign.workflow} · Started {campaign.startedAt}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Badge variant="outline" className={`text-xs border ${isCompleted ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>{campaign.status}</Badge>
            {isCompleted && <Button size="sm" className="gap-1.5"><Play className="h-4 w-4" /> Re-run</Button>}
          </div>
        </div>
      </div>

      {/* Vertical stepper timeline */}
      <Card>
        <CardHeader><CardTitle className="text-base section-header">Run Timeline</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-0">
            {timeline.map((t, i) => (
              <div key={i} className="flex gap-4">
                {/* Vertical line + circle */}
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center z-10">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-emerald-200 my-1" />}
                </div>
                <div className="pb-6 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{t.step}</p>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{t.duration}</span>
                  </div>
                  {/* Duration bar */}
                  <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-400" style={{ width: `${(parseInt(t.duration) / 48) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="cursor-pointer card-hover group" onClick={() => nav("/concepts")}>
        <CardContent className="flex items-center gap-4 py-5">
          <div className="icon-badge rounded-xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10">
            <Lightbulb className="h-5 w-5 text-violet-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">{campaign.concepts} Concepts Generated</p>
            <p className="text-xs text-muted-foreground">Click to view and review concepts</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </CardContent>
      </Card>
    </div>
  );
}
