import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, CalendarDays, Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const tabs = ["Ads", "Hooks", "Primary Text", "CTAs", "Headlines"];

const adContent = [
  { title: "Beach Vibes UGC", tags: ["UGC", "Summer"], preview: "Experience the freedom of effortless advertising...", fav: true, imgSeed: "beach-ad" },
  { title: "Gift Guide Carousel", tags: ["Seasonal", "Retail"], preview: "Find the perfect gift for everyone on your list...", imgSeed: "gift-ad" },
  { title: "Feature Highlight", tags: ["Product", "Evergreen"], preview: "Discover how SmartWidget Pro saves you 10 hours a week...", imgSeed: "feature-ad" },
  { title: "Problem/Solution", tags: ["Pain Point", "Conversion"], preview: "Tired of spending hours on ad creative? There's a better way...", imgSeed: "problem-ad" },
  { title: "Social Proof Strip", tags: ["Testimonial", "Trust"], preview: "Join 2,000+ brands already using Adomate to scale creative...", imgSeed: "social-ad" },
  { title: "Bold CTA Banner", tags: ["Direct Response", "CTA"], preview: "Start your free trial today. No credit card required.", imgSeed: "cta-ad" },
];

const hookContent = [
  { title: "Stop scrolling if...", tags: ["Pattern Interrupt"] },
  { title: "POV: Your ads write themselves", tags: ["Trend"] },
  { title: "The #1 mistake brands make", tags: ["Educational"] },
];

const textContent = [
  { title: "Long-form: Brand story", tags: ["Narrative"] },
  { title: "Short-form: Quick pitch", tags: ["Concise"] },
];

function ActionButton({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick?: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClick}><Icon className="h-3.5 w-3.5" /></Button>
      </TooltipTrigger>
      <TooltipContent><p className="text-xs">{label}</p></TooltipContent>
    </Tooltip>
  );
}

export default function Content() {
  const nav = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Content Library</h1>
        <p className="text-muted-foreground text-sm">Browse and manage your creative content assets.</p>
      </div>

      {/* Favorites section */}
      <div>
        <h2 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> Favorites</h2>
        <div className="flex gap-3">
          <Card className="w-52 card-hover overflow-hidden">
            <CardContent className="p-0">
              <div className="h-20 relative overflow-hidden bg-muted">
                <img
                  src="https://picsum.photos/seed/beach-ad/300/160"
                  alt="Beach Vibes UGC"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2.5">
                <p className="text-xs font-medium">Beach Vibes UGC</p>
                <p className="text-[10px] text-muted-foreground">UGC · Summer</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="Ads">
        <TabsList>
          {tabs.map((t) => <TabsTrigger key={t} value={t}>{t}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="Ads" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {adContent.map((c) => (
              <Card key={c.title} className="card-hover overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-36 relative overflow-hidden bg-muted group">
                    <img
                      src={`https://picsum.photos/seed/${c.imgSeed}/400/240`}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    {c.fav && (
                      <Star className="absolute top-2 right-2 h-4 w-4 text-amber-400 fill-amber-400 drop-shadow" />
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="font-semibold text-sm">{c.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{c.preview}</p>
                    <div className="flex flex-wrap gap-1">
                      {c.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                    </div>
                    <div className="flex gap-1 pt-1 border-t">
                      <ActionButton icon={Copy} label="Copy to clipboard" onClick={() => toast.success("Copied!")} />
                      <ActionButton icon={CalendarDays} label="Send to Calendar" onClick={() => { nav("/calendar"); toast.success("Sent to calendar"); }} />
                      <ActionButton icon={Heart} label="Add to favorites" />
                    </div>
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
                <Card key={c.title} className="card-hover">
                  <CardContent className="p-4 space-y-2">
                    <p className="font-semibold text-sm">{c.title}</p>
                    <div className="flex flex-wrap gap-1">{c.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}</div>
                    <div className="flex gap-1 pt-1 border-t">
                      <ActionButton icon={Copy} label="Copy" onClick={() => toast.success("Copied!")} />
                      <ActionButton icon={CalendarDays} label="Send to Calendar" onClick={() => { nav("/calendar"); toast.success("Sent to calendar"); }} />
                      <ActionButton icon={Heart} label="Favorite" />
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
