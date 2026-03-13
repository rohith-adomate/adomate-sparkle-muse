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

      {/* Invite your team */}
      <Card className="border border-primary/15 relative overflow-hidden group hover:shadow-md transition-all duration-300">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" />

        <CardContent className="p-6 relative">
          <div className="flex items-start gap-5">
            {/* Icon */}
            <div className="relative shrink-0">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary/15 border-2 border-card flex items-center justify-center">
                <Sparkles className="h-2.5 w-2.5 text-primary" />
              </div>
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <h2 className="text-base font-semibold tracking-tight">Invite your team</h2>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Bring teammates into your brand to collaborate on campaigns and approvals.
              </p>

              {/* Avatars + CTA */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-1.5">
                    {['A', 'B', 'C'].map((letter, i) => (
                      <div
                        key={letter}
                        className="h-7 w-7 rounded-full border-2 border-card bg-muted flex items-center justify-center"
                        style={{ opacity: 1 - i * 0.2 }}
                      >
                        <span className="text-[10px] text-muted-foreground font-medium">{letter}</span>
                      </div>
                    ))}
                    <div className="h-7 w-7 rounded-full border-2 border-dashed border-primary/30 bg-primary/10 flex items-center justify-center">
                      <span className="text-[10px] text-primary font-bold">+</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Add collaborators</span>
                </div>

                <Button
                  size="sm"
                  className="shrink-0 gap-1.5 rounded-full px-5 group/btn"
                  onClick={() => {/* TODO: open invite modal */}}
                >
                  Invite team members
                  <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
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
