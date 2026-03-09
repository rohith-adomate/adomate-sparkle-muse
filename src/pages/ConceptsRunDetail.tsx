import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, X, MessageSquare, Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Concept = {
  id: string;
  title: string;
  source: string;
  status: "pending" | "accepted" | "rejected";
  campaign: string;
  imgSeed: string;
};

const agentRuns: Record<string, { label: string; time: string; concepts: Concept[] }> = {
  "competitor-ad-variation-1": {
    label: "Competitor Ad Variation",
    time: "Mar 8, 2026 · 14:32",
    concepts: [
      { id: "c1", title: "Beach Vibes UGC", source: "Competitor Ad A", status: "accepted", campaign: "Summer Kickoff", imgSeed: "beach-ugc" },
      { id: "c2", title: "Sunset Product Shot", source: "Competitor Ad A", status: "pending", campaign: "Summer Kickoff", imgSeed: "sunset-shot" },
      { id: "c3", title: "Bold CTA Banner", source: "Competitor Ad B", status: "pending", campaign: "Summer Kickoff", imgSeed: "cta-banner" },
      { id: "c4", title: "Lifestyle Carousel", source: "Competitor Ad B", status: "rejected", campaign: "Summer Kickoff", imgSeed: "lifestyle" },
      { id: "c5", title: "Testimonial Overlay", source: "Trending Topic", status: "pending", campaign: "Summer Kickoff", imgSeed: "testimonial" },
      { id: "c13", title: "Dynamic Retargeting", source: "Competitor Ad A", status: "pending", campaign: "Summer Kickoff", imgSeed: "retargeting" },
      { id: "c14", title: "Story Takeover", source: "Competitor Ad B", status: "accepted", campaign: "Summer Kickoff", imgSeed: "story-takeover" },
      { id: "c15", title: "Influencer Collab", source: "Trending Topic", status: "pending", campaign: "Summer Kickoff", imgSeed: "influencer" },
      { id: "c16", title: "Brand Mashup", source: "Competitor Ad A", status: "rejected", campaign: "Summer Kickoff", imgSeed: "brand-mashup" },
    ],
  },
  "seasonal-trend-2": {
    label: "Seasonal Trend Discovery",
    time: "Mar 7, 2026 · 09:15",
    concepts: [
      { id: "c6", title: "Heart Confetti Ad", source: "Seasonal Trend", status: "pending", campaign: "Valentine's Push", imgSeed: "valentine" },
      { id: "c7", title: "Gift Guide Carousel", source: "Product Catalog", status: "accepted", campaign: "Valentine's Push", imgSeed: "gift-guide" },
      { id: "c8", title: "Couple Lifestyle", source: "Competitor Ad C", status: "pending", campaign: "Valentine's Push", imgSeed: "couple" },
    ],
  },
  "evergreen-content-3": {
    label: "Evergreen Content Generation",
    time: "Mar 6, 2026 · 16:48",
    concepts: [
      { id: "c9", title: "Feature Highlight", source: "Brand Knowledge", status: "accepted", campaign: "Q1 Evergreen", imgSeed: "feature" },
      { id: "c10", title: "Problem/Solution", source: "Persona: Busy Entrepreneur", status: "pending", campaign: "Q1 Evergreen", imgSeed: "problem-solution" },
      { id: "c11", title: "Social Proof Strip", source: "Meta Performance", status: "pending", campaign: "Q1 Evergreen", imgSeed: "social-proof" },
      { id: "c12", title: "How It Works", source: "Brand Knowledge", status: "pending", campaign: "Q1 Evergreen", imgSeed: "how-it-works" },
    ],
  },
};

const statusDot = { pending: "bg-amber-400", accepted: "bg-emerald-400", rejected: "bg-red-400" };
const statusBadge = { pending: "bg-amber-50 text-amber-700 border-amber-200", accepted: "bg-emerald-50 text-emerald-700 border-emerald-200", rejected: "bg-red-50 text-red-700 border-red-200" };

export default function ConceptsRunDetail() {
  const { runId } = useParams();
  const navigate = useNavigate();
  const run = runId ? agentRuns[runId] : null;

  const [selected, setSelected] = useState<Concept | null>(null);
  const [swipeAnim, setSwipeAnim] = useState<"left" | "right" | null>(null);
  const [showIterate, setShowIterate] = useState(false);

  const updateStatus = (id: string, status: "accepted" | "rejected") => {
    setSwipeAnim(status === "accepted" ? "right" : "left");
    setTimeout(() => {
      setSelected(null);
      setSwipeAnim(null);
      setShowIterate(false);
      toast.success(status === "accepted" ? "💚 Concept accepted!" : "❌ Concept rejected");
    }, 400);
  };

  if (!run) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <p className="text-muted-foreground">Agent run not found.</p>
        <Button variant="outline" onClick={() => navigate("/concepts")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Concepts
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/concepts")} className="shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{run.label}</h1>
          <p className="text-sm text-muted-foreground">{run.time} · {run.concepts.length} concepts generated</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {run.concepts.map((c) => (
          <Card
            key={c.id}
            className="cursor-pointer overflow-hidden group hover:shadow-md transition-shadow"
            onClick={() => setSelected(c)}
          >
            <CardContent className="p-0">
              <div className="aspect-square relative overflow-hidden bg-muted">
                <img
                  src={`https://picsum.photos/seed/${c.imgSeed}/400/400`}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute top-2 right-2">
                  <span className={`h-2.5 w-2.5 rounded-full inline-block ${statusDot[c.status]} ring-2 ring-white shadow-sm`} />
                </div>
              </div>
              <div className="p-3 space-y-1">
                <p className="text-sm font-medium truncate">{c.title}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground truncate">{c.source}</p>
                  <Badge variant="outline" className={`text-[9px] border ${statusBadge[c.status]} ml-1 shrink-0`}>{c.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tinder-style concept detail */}
      <Dialog open={!!selected} onOpenChange={(o) => { if (!o) { setSelected(null); setSwipeAnim(null); setShowIterate(false); } }}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          {selected && (
            <div className="flex flex-col">
              <div className={`relative transition-all duration-300 ease-out ${
                swipeAnim === "left" ? "-translate-x-full opacity-0 rotate-[-12deg]" :
                swipeAnim === "right" ? "translate-x-full opacity-0 rotate-[12deg]" : ""
              }`}>
                {swipeAnim && (
                  <div className={`absolute inset-0 z-10 rounded-t-lg transition-opacity duration-200 ${
                    swipeAnim === "right" ? "bg-emerald-500/20" : "bg-red-500/20"
                  }`} />
                )}
                <div className="h-72 relative overflow-hidden bg-muted">
                  <img src={`https://picsum.photos/seed/${selected.imgSeed}/500/400`} alt={selected.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge variant="outline" className={`text-xs border ${statusBadge[selected.status]} bg-white/90 backdrop-blur-sm`}>{selected.status}</Badge>
                  </div>
                </div>
              </div>
              <div className="px-6 pt-4 pb-2 space-y-2">
                <h2 className="text-xl font-bold tracking-tight">{selected.title}</h2>
                <div className="flex gap-4 text-sm">
                  <div><span className="text-xs text-muted-foreground uppercase tracking-wider">Source</span><p className="font-medium mt-0.5">{selected.source}</p></div>
                  <div><span className="text-xs text-muted-foreground uppercase tracking-wider">Campaign</span><p className="font-medium mt-0.5">{selected.campaign}</p></div>
                </div>
              </div>
              {showIterate && (
                <div className="px-6 py-2 space-y-2">
                  <Textarea placeholder="Provide feedback for iteration..." rows={3} />
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => { setSelected(null); setShowIterate(false); toast.info("Feedback sent for iteration"); }}>Send Feedback</Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowIterate(false)}>Cancel</Button>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-center gap-6 p-6 pt-3">
                <button onClick={() => updateStatus(selected.id, "rejected")} className="h-16 w-16 rounded-full border-2 border-red-300 bg-red-50 flex items-center justify-center hover:bg-red-100 hover:border-red-400 hover:scale-110 transition-all shadow-lg">
                  <X className="h-7 w-7 text-red-500" />
                </button>
                <button onClick={() => setShowIterate(!showIterate)} className="h-12 w-12 rounded-full border-2 border-blue-300 bg-blue-50 flex items-center justify-center hover:bg-blue-100 hover:border-blue-400 hover:scale-110 transition-all shadow-md">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                </button>
                <button onClick={() => updateStatus(selected.id, "accepted")} className="h-16 w-16 rounded-full border-2 border-emerald-300 bg-emerald-50 flex items-center justify-center hover:bg-emerald-100 hover:border-emerald-400 hover:scale-110 transition-all shadow-lg">
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
