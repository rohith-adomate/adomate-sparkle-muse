import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Send, User, Download, RefreshCw } from "lucide-react";
import { useState } from "react";

const queue = [
  { name: "Beach Vibes UGC", format: "1080×1080", status: "Ready" },
  { name: "Gift Guide Carousel", format: "1080×1920", status: "Ready" },
  { name: "Feature Highlight", format: "1080×1080", status: "In Progress" },
  { name: "Bold CTA Banner", format: "1200×628", status: "Approved" },
];

const qaChecklist = [
  "Spacing is within guidelines",
  "Text length ≤ 125 characters",
  "No restricted health claims",
  "Logo placement correct",
  "CTA is clear and actionable",
];

export default function Studio() {
  const [activeItem, setActiveItem] = useState(0);
  const [placement, setPlacement] = useState("feed");

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* Left — Concept Queue */}
      <div className="w-56 shrink-0 overflow-y-auto space-y-1">
        <h2 className="text-sm font-semibold mb-2">Concept Queue</h2>
        {["Ready", "In Progress", "Approved"].map((status) => {
          const items = queue.filter((q) => q.status === status);
          if (!items.length) return null;
          return (
            <div key={status} className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mt-2">{status}</p>
              {items.map((item, idx) => {
                const globalIdx = queue.indexOf(item);
                return (
                  <Card key={idx} className={`cursor-pointer transition-all ${activeItem === globalIdx ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/30"}`} onClick={() => setActiveItem(globalIdx)}>
                    <CardContent className="p-2.5">
                      <div className="h-12 rounded bg-muted flex items-center justify-center text-lg mb-1.5">🎨</div>
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
      <div className="flex-1 flex flex-col items-center gap-4">
        <Tabs value={placement} onValueChange={setPlacement}>
          <TabsList>
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="story">Story</TabsTrigger>
            <TabsTrigger value="reels">Reels</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className={`bg-muted rounded-xl flex items-center justify-center text-5xl border-2 border-dashed border-border ${placement === "story" || placement === "reels" ? "w-[280px] h-[500px]" : "w-[400px] h-[400px]"} transition-all`}>
          🎨
        </div>
        <p className="text-sm font-semibold">{queue[activeItem].name}</p>
        <div className="flex gap-2">
          <Button size="sm"><CalendarDays className="h-4 w-4 mr-1" /> Add to Calendar</Button>
          <Button size="sm" variant="outline"><Send className="h-4 w-4 mr-1" /> Send to Approval</Button>
          <Button size="sm" variant="outline"><User className="h-4 w-4 mr-1" /> Send to Designer</Button>
        </div>
        <Button variant="ghost" size="sm" className="gap-1"><Download className="h-3.5 w-3.5" /> Export</Button>
      </div>

      {/* Right — Controls */}
      <div className="w-60 shrink-0 space-y-4 overflow-y-auto">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Controls</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Button size="sm" variant="outline" className="w-full gap-1"><RefreshCw className="h-3.5 w-3.5" /> Regenerate Image</Button>
            <Button size="sm" variant="outline" className="w-full gap-1"><RefreshCw className="h-3.5 w-3.5" /> Regenerate Copy</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">QA Checklist</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {qaChecklist.map((item, i) => (
              <label key={i} className="flex items-start gap-2 text-sm cursor-pointer">
                <Checkbox defaultChecked={i < 2} className="mt-0.5" />
                <span>{item}</span>
              </label>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
