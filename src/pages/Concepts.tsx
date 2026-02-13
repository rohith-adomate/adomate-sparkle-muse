import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, MessageSquare, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Concept = { id: string; title: string; source: string; status: "pending" | "accepted" | "rejected"; campaign: string };

const conceptsByCampaign: Record<string, Concept[]> = {
  "Summer Kickoff": [
    { id: "c1", title: "Beach Vibes UGC", source: "Competitor Ad A", status: "accepted", campaign: "Summer Kickoff" },
    { id: "c2", title: "Sunset Product Shot", source: "Competitor Ad A", status: "pending", campaign: "Summer Kickoff" },
    { id: "c3", title: "Bold CTA Banner", source: "Competitor Ad B", status: "pending", campaign: "Summer Kickoff" },
    { id: "c4", title: "Lifestyle Carousel", source: "Competitor Ad B", status: "rejected", campaign: "Summer Kickoff" },
    { id: "c5", title: "Testimonial Overlay", source: "Trending Topic", status: "pending", campaign: "Summer Kickoff" },
  ],
  "Valentine's Push": [
    { id: "c6", title: "Heart Confetti Ad", source: "Seasonal Trend", status: "pending", campaign: "Valentine's Push" },
    { id: "c7", title: "Gift Guide Carousel", source: "Product Catalog", status: "accepted", campaign: "Valentine's Push" },
    { id: "c8", title: "Couple Lifestyle", source: "Competitor Ad C", status: "pending", campaign: "Valentine's Push" },
  ],
  "Q1 Evergreen": [
    { id: "c9", title: "Feature Highlight", source: "Brand Knowledge", status: "accepted", campaign: "Q1 Evergreen" },
    { id: "c10", title: "Problem/Solution", source: "Persona: Busy Entrepreneur", status: "pending", campaign: "Q1 Evergreen" },
    { id: "c11", title: "Social Proof Strip", source: "Meta Performance", status: "pending", campaign: "Q1 Evergreen" },
    { id: "c12", title: "How It Works", source: "Brand Knowledge", status: "pending", campaign: "Q1 Evergreen" },
  ],
};

const statusColor = { pending: "secondary", accepted: "default", rejected: "destructive" } as const;

export default function Concepts() {
  const [selected, setSelected] = useState<Concept | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Concepts</h1>
          <p className="text-muted-foreground text-sm">Review, accept, or iterate on generated concepts.</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all"><SelectTrigger className="w-36 h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Campaigns</SelectItem><SelectItem value="summer">Summer Kickoff</SelectItem></SelectContent></Select>
          <Select defaultValue="all"><SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="accepted">Accepted</SelectItem></SelectContent></Select>
        </div>
      </div>

      {Object.entries(conceptsByCampaign).map(([campaign, concepts]) => (
        <div key={campaign} className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">{campaign}</h2>
            <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => setExpanded(expanded === campaign ? null : campaign)}>
              View all <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
          <ScrollArea className="w-full">
            <div className="flex gap-3 pb-2">
              {concepts.map((c) => (
                <Card key={c.id} className="shrink-0 w-48 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" onClick={() => setSelected(c)}>
                  <CardContent className="p-3 space-y-2">
                    <div className="h-28 rounded-md bg-muted flex items-center justify-center text-2xl">🎨</div>
                    <p className="text-sm font-medium truncate">{c.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">{c.source}</span>
                      <Badge variant={statusColor[c.status]} className="text-[10px]">{c.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      ))}

      {/* Expanded campaign view */}
      <Dialog open={!!expanded} onOpenChange={(o) => !o && setExpanded(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{expanded}</DialogTitle></DialogHeader>
          {expanded && (() => {
            const concepts = conceptsByCampaign[expanded] || [];
            const grouped = concepts.reduce<Record<string, Concept[]>>((acc, c) => { (acc[c.source] = acc[c.source] || []).push(c); return acc; }, {});
            return Object.entries(grouped).map(([source, cs]) => (
              <div key={source} className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">Based on: {source}</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {cs.map((c) => (
                    <Card key={c.id} className="cursor-pointer hover:ring-2 hover:ring-primary/20" onClick={() => { setExpanded(null); setSelected(c); }}>
                      <CardContent className="p-3 space-y-2">
                        <div className="h-24 rounded-md bg-muted flex items-center justify-center text-xl">🎨</div>
                        <p className="text-sm font-medium">{c.title}</p>
                        <Badge variant={statusColor[c.status]} className="text-[10px]">{c.status}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ));
          })()}
        </DialogContent>
      </Dialog>

      {/* Concept detail */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader><DialogTitle>{selected.title}</DialogTitle></DialogHeader>
              <div className="h-56 rounded-lg bg-muted flex items-center justify-center text-4xl">🎨</div>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Source:</span> <span className="text-muted-foreground">{selected.source}</span></p>
                <p><span className="font-medium">Campaign:</span> <span className="text-muted-foreground">{selected.campaign}</span></p>
                <p><span className="font-medium">Status:</span> <Badge variant={statusColor[selected.status]} className="text-xs ml-1">{selected.status}</Badge></p>
              </div>
              <div className="space-y-2">
                <Textarea placeholder="Provide feedback for iteration…" rows={2} />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 gap-1" variant="default"><Check className="h-4 w-4" /> Accept</Button>
                <Button className="flex-1 gap-1" variant="destructive"><X className="h-4 w-4" /> Reject</Button>
                <Button className="flex-1 gap-1" variant="outline"><MessageSquare className="h-4 w-4" /> Iterate</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
