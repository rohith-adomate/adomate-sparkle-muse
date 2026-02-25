import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, RotateCcw, ArrowRightLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const drafts = [
  { name: "Beach Vibes UGC", format: "1080x1080", gradient: "from-indigo-400/30 to-violet-500/20" },
  { name: "Social Proof Strip", format: "1080x1080", gradient: "from-amber-400/30 to-orange-500/20" },
  { name: "Bold CTA Banner", format: "1200x628", gradient: "from-emerald-400/30 to-teal-500/20" },
];

type CalItem = { name: string; status: "Scheduled" | "Published" };
const calendarData: Record<string, Record<number, CalItem>> = {
  "Summer Kickoff": { 1: { name: "Beach Vibes UGC", status: "Scheduled" }, 3: { name: "Sunset Product Shot", status: "Published" }, 5: { name: "Lifestyle Carousel", status: "Scheduled" } },
  "Valentine's Push": { 0: { name: "Heart Confetti Ad", status: "Scheduled" }, 4: { name: "Gift Guide Carousel", status: "Published" } },
  "Q1 Evergreen": { 2: { name: "Feature Highlight", status: "Published" }, 6: { name: "Problem/Solution", status: "Scheduled" } },
};

const statusStyles = {
  Scheduled: "border-l-blue-400 bg-blue-50/50",
  Published: "border-l-emerald-400 bg-emerald-50/50",
};

const campaignDots: Record<string, string> = {
  "Summer Kickoff": "bg-indigo-500",
  "Valentine's Push": "bg-rose-500",
  "Q1 Evergreen": "bg-emerald-500",
};

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" /> Content Calendar
          </h1>
          <p className="text-muted-foreground text-sm">Schedule and manage your ad placements.</p>
        </div>
        {/* Week navigation */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm">Today</Button>
          <Button variant="outline" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
          <span className="text-sm font-medium ml-2">Feb 10 - 16, 2026</span>
        </div>
      </div>

      {/* Drafts to schedule */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm section-header">Draft to Schedule</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {drafts.map((d) => (
              <div key={d.name} className="shrink-0 w-40 p-2.5 border rounded-xl bg-card cursor-grab space-y-1.5 card-hover shadow-sm">
                <div className="h-20 rounded-lg overflow-hidden">
                  <img src={`https://picsum.photos/seed/draft${drafts.indexOf(d)}/200/150`} alt={d.name} className="h-full w-full object-cover" />
                </div>
                <p className="text-xs font-medium truncate">{d.name}</p>
                <p className="text-[10px] text-muted-foreground">{d.format}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Drag and drop to calendar slots below</p>
        </CardContent>
      </Card>

      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-8 gap-px bg-border rounded-t-xl overflow-hidden">
            <div className="bg-card p-2.5 text-xs font-semibold text-muted-foreground">Campaign</div>
            {days.map((d) => (
              <div key={d} className="bg-card p-2.5 text-xs font-semibold text-center">{d}</div>
            ))}
          </div>
          {/* Rows */}
          {Object.entries(calendarData).map(([campaign, slots]) => (
            <div key={campaign} className="grid grid-cols-8 gap-px bg-border">
              <div className="bg-card p-2.5 text-xs font-medium flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${campaignDots[campaign]}`} />
                {campaign}
              </div>
              {days.map((_, i) => {
                const item = slots[i];
                return (
                  <div key={i} className={`bg-card p-1.5 min-h-[90px] transition-colors ${!item ? "hover:bg-muted/30" : ""}`}>
                    {item && (
                      <div className={`rounded-lg p-2 space-y-1.5 border-l-[3px] ${statusStyles[item.status]}`}>
                        <div className="h-10 rounded overflow-hidden">
                          <img src={`https://picsum.photos/seed/cal${i}${campaign}/120/80`} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <p className="text-[10px] font-medium truncate">{item.name}</p>
                        <Badge variant="outline" className={`text-[9px] border ${item.status === "Published" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>{item.status}</Badge>
                        <div className="flex gap-0.5">
                          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={(e) => { e.stopPropagation(); toast.success("Republished"); }}>
                            <RotateCcw className="h-2.5 w-2.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={(e) => { e.stopPropagation(); toast.info("Swap initiated"); }}>
                            <ArrowRightLeft className="h-2.5 w-2.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={(e) => { e.stopPropagation(); toast.success("Removed from calendar"); }}>
                            <X className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
