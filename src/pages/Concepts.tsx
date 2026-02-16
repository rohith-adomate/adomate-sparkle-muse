import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, MessageSquare, ChevronRight, Heart, ThumbsDown } from "lucide-react";
import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { HoverExplainer } from "@/components/HoverExplainer";

type Concept = { id: string; title: string; source: string; status: "pending" | "accepted" | "rejected"; campaign: string; gradient: string };

const gradients = [
  "from-indigo-400/30 to-violet-500/20",
  "from-fuchsia-400/30 to-pink-500/20",
  "from-amber-400/30 to-orange-500/20",
  "from-emerald-400/30 to-teal-500/20",
  "from-sky-400/30 to-blue-500/20",
  "from-rose-400/30 to-red-500/20",
];

const conceptsByCampaign: Record<string, Concept[]> = {
  "Summer Kickoff": [
    { id: "c1", title: "Beach Vibes UGC", source: "Competitor Ad A", status: "accepted", campaign: "Summer Kickoff", gradient: gradients[0] },
    { id: "c2", title: "Sunset Product Shot", source: "Competitor Ad A", status: "pending", campaign: "Summer Kickoff", gradient: gradients[1] },
    { id: "c3", title: "Bold CTA Banner", source: "Competitor Ad B", status: "pending", campaign: "Summer Kickoff", gradient: gradients[2] },
    { id: "c4", title: "Lifestyle Carousel", source: "Competitor Ad B", status: "rejected", campaign: "Summer Kickoff", gradient: gradients[3] },
    { id: "c5", title: "Testimonial Overlay", source: "Trending Topic", status: "pending", campaign: "Summer Kickoff", gradient: gradients[4] },
  ],
  "Valentine's Push": [
    { id: "c6", title: "Heart Confetti Ad", source: "Seasonal Trend", status: "pending", campaign: "Valentine's Push", gradient: gradients[5] },
    { id: "c7", title: "Gift Guide Carousel", source: "Product Catalog", status: "accepted", campaign: "Valentine's Push", gradient: gradients[0] },
    { id: "c8", title: "Couple Lifestyle", source: "Competitor Ad C", status: "pending", campaign: "Valentine's Push", gradient: gradients[1] },
  ],
  "Q1 Evergreen": [
    { id: "c9", title: "Feature Highlight", source: "Brand Knowledge", status: "accepted", campaign: "Q1 Evergreen", gradient: gradients[2] },
    { id: "c10", title: "Problem/Solution", source: "Persona: Busy Entrepreneur", status: "pending", campaign: "Q1 Evergreen", gradient: gradients[3] },
    { id: "c11", title: "Social Proof Strip", source: "Meta Performance", status: "pending", campaign: "Q1 Evergreen", gradient: gradients[4] },
    { id: "c12", title: "How It Works", source: "Brand Knowledge", status: "pending", campaign: "Q1 Evergreen", gradient: gradients[5] },
  ],
};

const statusDot = { pending: "bg-amber-400", accepted: "bg-emerald-400", rejected: "bg-red-400" };
const statusBadge = { pending: "bg-amber-50 text-amber-700 border-amber-200", accepted: "bg-emerald-50 text-emerald-700 border-emerald-200", rejected: "bg-red-50 text-red-700 border-red-200" };

export default function Concepts() {
  const [concepts, setConcepts] = useState(conceptsByCampaign);
  const [selected, setSelected] = useState<Concept | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [swipeAnim, setSwipeAnim] = useState<"left" | "right" | null>(null);
  const [showIterate, setShowIterate] = useState(false);

  const updateStatus = (id: string, status: "accepted" | "rejected") => {
    // Animate
    setSwipeAnim(status === "accepted" ? "right" : "left");
    setTimeout(() => {
      const updated = { ...concepts };
      for (const campaign of Object.keys(updated)) {
        updated[campaign] = updated[campaign].map((c) => c.id === id ? { ...c, status } : c);
      }
      setConcepts(updated);
      setSelected(null);
      setSwipeAnim(null);
      setShowIterate(false);
      toast.success(status === "accepted" ? "💚 Concept accepted!" : "❌ Concept rejected");
    }, 400);
  };

  return (
    <div className="space-y-6">
      <HoverExplainer text="Concepts Gallery: Pinterest-style masonry gallery with horizontal carousels grouped by campaign. Each concept is an AI-generated ad idea. Backend: query concepts table JOIN campaigns. Concepts have status: pending, accepted, rejected. Filtering by campaign and status supported.">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Concepts</h1>
            <p className="text-muted-foreground text-sm">Review, accept, or iterate on generated concepts.</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all"><SelectTrigger className="w-36 h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Campaigns</SelectItem><SelectItem value="summer">Summer Kickoff</SelectItem></SelectContent></Select>
            <Select defaultValue="all"><SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="accepted">Accepted</SelectItem></SelectContent></Select>
          </div>
        </div>
      </HoverExplainer>

      {Object.entries(concepts).map(([campaign, conceptList]) => (
        <div key={campaign} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold section-header">{campaign}</h2>
            <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => setExpanded(expanded === campaign ? null : campaign)}>
              View all <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
          <ScrollArea className="w-full">
            <div className="flex gap-3 pb-2">
              {conceptList.map((c) => (
                <HoverExplainer key={c.id} text={`Concept Card: "${c.title}" — Generated from source "${c.source}". Status: ${c.status}. Click to open Tinder-style review dialog where you can Accept (right swipe), Reject (left swipe), or Iterate (provide feedback). Backend: concepts.id=${c.id}, concepts.status, concepts.source_type.`}>
                  <Card className="shrink-0 w-52 cursor-pointer card-hover group overflow-hidden" onClick={() => setSelected(c)}>
                    <CardContent className="p-0">
                      <div className={`h-32 bg-gradient-to-br ${c.gradient} flex items-center justify-center relative`}>
                        <div className="h-16 w-16 rounded-xl bg-white/20 backdrop-blur-sm" />
                        <div className="absolute top-2 right-2">
                          <span className={`h-2.5 w-2.5 rounded-full inline-block ${statusDot[c.status]} ring-2 ring-white`} />
                        </div>
                      </div>
                      <div className="p-3 space-y-1">
                        <p className="text-sm font-medium truncate">{c.title}</p>
                        <p className="text-[10px] text-muted-foreground">{c.source}</p>
                      </div>
                    </CardContent>
                  </Card>
                </HoverExplainer>
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
            const campaignConcepts = concepts[expanded] || [];
            const grouped = campaignConcepts.reduce<Record<string, Concept[]>>((acc, c) => { (acc[c.source] = acc[c.source] || []).push(c); return acc; }, {});
            return Object.entries(grouped).map(([source, cs]) => (
              <div key={source} className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">Based on: {source}</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {cs.map((c) => (
                    <Card key={c.id} className="cursor-pointer card-hover overflow-hidden" onClick={() => { setExpanded(null); setSelected(c); }}>
                      <CardContent className="p-0">
                        <div className={`h-28 bg-gradient-to-br ${c.gradient} flex items-center justify-center`}>
                          <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm" />
                        </div>
                        <div className="p-3 flex items-center justify-between">
                          <p className="text-sm font-medium">{c.title}</p>
                          <Badge variant="outline" className={`text-[10px] border ${statusBadge[c.status]}`}>{c.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ));
          })()}
        </DialogContent>
      </Dialog>

      {/* Tinder-style concept detail */}
      <Dialog open={!!selected} onOpenChange={(o) => { if (!o) { setSelected(null); setSwipeAnim(null); setShowIterate(false); } }}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          {selected && (
            <div className="flex flex-col">
              {/* Swipeable card area */}
              <div
                className={`relative transition-all duration-300 ease-out ${
                  swipeAnim === "left" ? "-translate-x-full opacity-0 rotate-[-12deg]" :
                  swipeAnim === "right" ? "translate-x-full opacity-0 rotate-[12deg]" : ""
                }`}
              >
                {/* Color flash overlay */}
                {swipeAnim && (
                  <div className={`absolute inset-0 z-10 rounded-t-lg transition-opacity duration-200 ${
                    swipeAnim === "right" ? "bg-emerald-500/20" : "bg-red-500/20"
                  }`} />
                )}
                <div className={`h-72 bg-gradient-to-br ${selected.gradient} flex items-center justify-center relative`}>
                  <div className="h-28 w-28 rounded-2xl bg-white/20 backdrop-blur-sm" />
                  <div className="absolute top-4 left-4">
                    <Badge variant="outline" className={`text-xs border ${statusBadge[selected.status]} bg-white/80 backdrop-blur-sm`}>{selected.status}</Badge>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="px-6 pt-4 pb-2 space-y-2">
                <h2 className="text-xl font-bold tracking-tight">{selected.title}</h2>
                <div className="flex gap-4 text-sm">
                  <div><span className="text-xs text-muted-foreground uppercase tracking-wider">Source</span><p className="font-medium mt-0.5">{selected.source}</p></div>
                  <div><span className="text-xs text-muted-foreground uppercase tracking-wider">Campaign</span><p className="font-medium mt-0.5">{selected.campaign}</p></div>
                </div>
                <p className="text-xs text-muted-foreground">Swipe right to accept, left to reject</p>
              </div>

              {/* Iterate feedback area */}
              {showIterate && (
                <div className="px-6 py-2 space-y-2">
                  <Textarea placeholder="Provide feedback for iteration... e.g. 'Make the CTA more urgent' or 'Try a different color scheme'" rows={3} />
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => { setSelected(null); setShowIterate(false); toast.info("Feedback sent for iteration"); }}>Send Feedback</Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowIterate(false)}>Cancel</Button>
                  </div>
                </div>
              )}

              {/* Tinder-style action buttons */}
              <div className="flex items-center justify-center gap-6 p-6 pt-3">
                <button
                  onClick={() => updateStatus(selected.id, "rejected")}
                  className="h-16 w-16 rounded-full border-2 border-red-300 bg-red-50 flex items-center justify-center hover:bg-red-100 hover:border-red-400 hover:scale-110 transition-all shadow-lg"
                >
                  <X className="h-7 w-7 text-red-500" />
                </button>
                <button
                  onClick={() => setShowIterate(!showIterate)}
                  className="h-12 w-12 rounded-full border-2 border-blue-300 bg-blue-50 flex items-center justify-center hover:bg-blue-100 hover:border-blue-400 hover:scale-110 transition-all shadow-md"
                >
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                </button>
                <button
                  onClick={() => updateStatus(selected.id, "accepted")}
                  className="h-16 w-16 rounded-full border-2 border-emerald-300 bg-emerald-50 flex items-center justify-center hover:bg-emerald-100 hover:border-emerald-400 hover:scale-110 transition-all shadow-lg"
                >
                  <Heart className="h-7 w-7 text-emerald-500" />
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
