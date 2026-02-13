import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, RotateCcw, ArrowRightLeft, X } from "lucide-react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const drafts = [
  { name: "Beach Vibes UGC", format: "1080×1080" },
  { name: "Social Proof Strip", format: "1080×1080" },
  { name: "Bold CTA Banner", format: "1200×628" },
];

type CalItem = { name: string; status: "Scheduled" | "Published" };
const calendarData: Record<string, Record<number, CalItem>> = {
  "Summer Kickoff": { 1: { name: "Beach Vibes UGC", status: "Scheduled" }, 3: { name: "Sunset Product Shot", status: "Published" }, 5: { name: "Lifestyle Carousel", status: "Scheduled" } },
  "Valentine's Push": { 0: { name: "Heart Confetti Ad", status: "Scheduled" }, 4: { name: "Gift Guide Carousel", status: "Published" } },
  "Q1 Evergreen": { 2: { name: "Feature Highlight", status: "Published" }, 6: { name: "Problem/Solution", status: "Scheduled" } },
};

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><CalendarDays className="h-6 w-6 text-primary" /> Content Calendar</h1>
        <p className="text-muted-foreground text-sm">Schedule and manage your ad placements.</p>
      </div>

      {/* Drafts to schedule */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Draft to Schedule</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {drafts.map((d) => (
              <div key={d.name} className="shrink-0 w-36 p-2 border rounded-lg bg-muted/50 cursor-grab space-y-1">
                <div className="h-16 rounded bg-muted flex items-center justify-center text-lg">🎨</div>
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
          <div className="grid grid-cols-8 gap-px bg-border rounded-t-lg overflow-hidden">
            <div className="bg-card p-2 text-xs font-semibold text-muted-foreground">Campaign</div>
            {days.map((d) => <div key={d} className="bg-card p-2 text-xs font-semibold text-center">{d}</div>)}
          </div>
          {/* Rows */}
          {Object.entries(calendarData).map(([campaign, slots]) => (
            <div key={campaign} className="grid grid-cols-8 gap-px bg-border">
              <div className="bg-card p-2 text-xs font-medium flex items-center">{campaign}</div>
              {days.map((_, i) => {
                const item = slots[i];
                return (
                  <div key={i} className="bg-card p-1.5 min-h-[80px]">
                    {item && (
                      <div className="rounded bg-accent p-1.5 space-y-1">
                        <div className="h-8 rounded bg-muted flex items-center justify-center text-xs">🎨</div>
                        <p className="text-[10px] font-medium truncate">{item.name}</p>
                        <Badge variant={item.status === "Published" ? "default" : "secondary"} className="text-[9px]">{item.status}</Badge>
                        <div className="flex gap-0.5">
                          <Button variant="ghost" size="icon" className="h-5 w-5"><RotateCcw className="h-2.5 w-2.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-5 w-5"><ArrowRightLeft className="h-2.5 w-2.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-5 w-5"><X className="h-2.5 w-2.5" /></Button>
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
