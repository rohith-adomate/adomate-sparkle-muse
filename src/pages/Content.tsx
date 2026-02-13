import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, CalendarDays, Heart } from "lucide-react";

const tabs = ["Ads", "Hooks", "Primary Text", "CTAs", "Headlines"];

const adContent = [
  { title: "Beach Vibes UGC", tags: ["UGC", "Summer"], preview: "Experience the freedom of effortless advertising…" },
  { title: "Gift Guide Carousel", tags: ["Seasonal", "Retail"], preview: "Find the perfect gift for everyone on your list…" },
  { title: "Feature Highlight", tags: ["Product", "Evergreen"], preview: "Discover how SmartWidget Pro saves you 10 hours a week…" },
  { title: "Problem/Solution", tags: ["Pain Point", "Conversion"], preview: "Tired of spending hours on ad creative? There's a better way…" },
  { title: "Social Proof Strip", tags: ["Testimonial", "Trust"], preview: "Join 2,000+ brands already using Adomate to scale creative…" },
  { title: "Bold CTA Banner", tags: ["Direct Response", "CTA"], preview: "Start your free trial today. No credit card required." },
];

const hookContent = [
  { title: "Stop scrolling if…", tags: ["Pattern Interrupt"] },
  { title: "POV: Your ads write themselves", tags: ["Trend"] },
  { title: "The #1 mistake brands make", tags: ["Educational"] },
];

const textContent = [
  { title: "Long-form: Brand story", tags: ["Narrative"] },
  { title: "Short-form: Quick pitch", tags: ["Concise"] },
];

export default function Content() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Content Library</h1>
        <p className="text-muted-foreground text-sm">Browse and manage your creative content assets.</p>
      </div>

      <Tabs defaultValue="Ads">
        <TabsList>
          {tabs.map((t) => <TabsTrigger key={t} value={t}>{t}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="Ads" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {adContent.map((c) => (
              <Card key={c.title}>
                <CardContent className="p-4 space-y-3">
                  <div className="h-32 rounded-md bg-muted flex items-center justify-center text-3xl">🎨</div>
                  <p className="font-semibold text-sm">{c.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{c.preview}</p>
                  <div className="flex flex-wrap gap-1">
                    {c.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Copy className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><CalendarDays className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Heart className="h-3.5 w-3.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {["Hooks", "Primary Text", "CTAs", "Headlines"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(tab === "Hooks" ? hookContent : textContent).map((c) => (
                <Card key={c.title}>
                  <CardContent className="p-4 space-y-2">
                    <p className="font-semibold text-sm">{c.title}</p>
                    <div className="flex flex-wrap gap-1">{c.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}</div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Copy className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><CalendarDays className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Heart className="h-3.5 w-3.5" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
