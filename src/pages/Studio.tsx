import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Send, User, Download, RefreshCw, CheckCircle2, Smartphone, Monitor } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { HoverExplainer } from "@/components/HoverExplainer";

const queue = [
  { name: "Beach Vibes UGC", format: "1080x1080", status: "Ready", imgSeed: "beach-studio" },
  { name: "Gift Guide Carousel", format: "1080x1920", status: "Ready", imgSeed: "gift-studio" },
  { name: "Feature Highlight", format: "1080x1080", status: "In Progress", imgSeed: "feature-studio" },
  { name: "Bold CTA Banner", format: "1200x628", status: "Approved", imgSeed: "cta-studio" },
];

const statusBorder = {
  Ready: "border-l-emerald-400",
  "In Progress": "border-l-amber-400",
  Approved: "border-l-blue-400",
};

const qaChecklist = [
  "Spacing is within guidelines",
  "Text length ≤ 125 characters",
  "No restricted health claims",
  "Logo placement correct",
  "CTA is clear and actionable",
];

export default function Studio() {
  const nav = useNavigate();
  const [activeItem, setActiveItem] = useState(0);
  const [placement, setPlacement] = useState("feed");
  const [checks, setChecks] = useState([true, true, false, false, false]);

  const checkedCount = checks.filter(Boolean).length;

  const toggleCheck = (i: number) => {
    const next = [...checks];
    next[i] = !next[i];
    setChecks(next);
  };

  const isVertical = placement === "story" || placement === "reels";

  return (
    <div className="flex gap-5 h-[calc(100vh-8rem)]">
      {/* Left — Concept Queue */}
      <div className="w-56 shrink-0 overflow-y-auto space-y-1">
        <HoverExplainer text="Concept Queue: Lists all accepted concepts grouped by status (Ready, In Progress, Approved). Clicking a concept loads it in the preview canvas. Backend: studio_queue table (id, concept_id, status, format, created_at). Status transitions: Ready → In Progress (when AI starts generating) → Approved (after QA passes and user approves).">
          <h2 className="text-sm font-semibold mb-3 section-header">
            Concept Queue - (THIS WHOLE PAGE IS JUST A PLACEHOLDER - FOR THE MVP VERSION, JUST TAKE THE STUDIO THAT IS
            IN THE LEGACY APP AND USE THAT SCREEN ITSELF DIRECTLY)
          </h2>
        </HoverExplainer>
        {["Ready", "In Progress", "Approved"].map((status) => {
          const items = queue.filter((q) => q.status === status);
          if (!items.length) return null;
          return (
            <div key={status} className="space-y-1.5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mt-3">{status}</p>
              {items.map((item) => {
                const globalIdx = queue.indexOf(item);
                return (
                  <Card
                    key={globalIdx}
                    className={`cursor-pointer transition-all border-l-[3px] overflow-hidden ${statusBorder[item.status as keyof typeof statusBorder]} ${activeItem === globalIdx ? "ring-2 ring-primary shadow-md" : "card-hover"}`}
                    onClick={() => setActiveItem(globalIdx)}
                  >
                    <CardContent className="p-2.5">
                      <div className="h-14 rounded-lg overflow-hidden bg-muted mb-1.5 relative">
                        <img
                          src={`https://picsum.photos/seed/${item.imgSeed}/200/112`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs font-medium truncate">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">{item.format}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Center — Preview Canvas */}
      <div className="flex-1 flex flex-col items-center gap-4 overflow-y-auto">
        <Tabs value={placement} onValueChange={setPlacement}>
          <TabsList>
            <TabsTrigger value="feed" className="gap-1.5">
              <Monitor className="h-3.5 w-3.5" /> Feed
            </TabsTrigger>
            <TabsTrigger value="story" className="gap-1.5">
              <Smartphone className="h-3.5 w-3.5" /> Story
            </TabsTrigger>
            <TabsTrigger value="reels" className="gap-1.5">
              <Smartphone className="h-3.5 w-3.5" /> Reels
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Device frame mockup */}
        <div className="relative">
          {isVertical ? (
            <div className="relative bg-foreground/90 rounded-[2.5rem] p-3 shadow-2xl ring-1 ring-white/10">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 h-5 w-20 rounded-full bg-foreground/80 z-10" />
              <div className="rounded-[2rem] w-[260px] h-[480px] overflow-hidden bg-muted">
                <img
                  src={`https://picsum.photos/seed/${queue[activeItem].imgSeed}-v/520/960`}
                  alt={queue[activeItem].name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-foreground/90 rounded-xl p-2 shadow-2xl ring-1 ring-white/10">
                <div className="rounded-lg w-[380px] h-[380px] overflow-hidden bg-muted">
                  <img
                    src={`https://picsum.photos/seed/${queue[activeItem].imgSeed}/760/760`}
                    alt={queue[activeItem].name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="h-4 w-20 bg-foreground/80 rounded-b-lg" />
              <div className="h-1 w-32 bg-foreground/60 rounded-b-lg" />
            </div>
          )}
        </div>

        <p className="text-sm font-semibold">{queue[activeItem].name}</p>

        {/* Floating toolbar */}
        <div className="flex gap-2 bg-card border rounded-xl p-2 shadow-lg">
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => { nav("/calendar"); toast.success("Added to calendar"); }}
          >
            <CalendarDays className="h-3.5 w-3.5" /> Calendar
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => toast.success(`"${queue[activeItem].name}" sent for approval`)}
          >
            <Send className="h-3.5 w-3.5" /> Approve
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5">
            <User className="h-3.5 w-3.5" /> Designer
          </Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* Right — Controls */}
      <div className="w-60 shrink-0 space-y-4 overflow-y-auto">
        <HoverExplainer text="Controls: Regenerate Image calls the AI image generation pipeline with updated parameters. Regenerate Copy calls the LLM to produce new ad copy while keeping the same concept brief. Backend: POST /api/studio/regenerate { asset_id, type: 'image'|'copy' }. Triggers async generation, updates studio_queue.status to 'generating'.">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm section-header">Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" variant="outline" className="w-full gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Regenerate Image
              </Button>
              <Button size="sm" variant="outline" className="w-full gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Regenerate Copy
              </Button>
            </CardContent>
          </Card>
        </HoverExplainer>
        <HoverExplainer text="QA Checklist: Automated checks run against the creative asset. Backend: POST /api/studio/qa { asset_id } returns array of { check_name, passed, details }. All checks must pass before 'Send to Approval' is enabled.">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm section-header">QA Checklist</CardTitle>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${checkedCount === qaChecklist.length ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
                >
                  {checkedCount}/{qaChecklist.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {qaChecklist.map((item, i) => (
                <label key={i} className="flex items-start gap-2.5 text-sm cursor-pointer group">
                  <Checkbox checked={checks[i]} onCheckedChange={() => toggleCheck(i)} className="mt-0.5" />
                  <span className={`transition-colors ${checks[i] ? "text-emerald-700" : ""}`}>
                    {checks[i] && <CheckCircle2 className="h-3 w-3 inline mr-1 text-emerald-500" />}
                    {item}
                  </span>
                </label>
              ))}
            </CardContent>
          </Card>
        </HoverExplainer>
      </div>
    </div>
  );
}
