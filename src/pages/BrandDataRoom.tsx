import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Package, Link2, Swords, Star, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";

const cards = [
  { title: "Brand Brain", icon: BookOpen, url: "/brand-data-room/knowledge", summary: "5/5 core knowledge fields configured." },
  { title: "Products", icon: Package, url: "/brand-data-room/products", summary: "5 products cataloged." },
  { title: "Competitors", icon: Swords, url: "/brand-data-room/competitors", summary: "3 competitors tracked via Meta." },
  { title: "Reviews", icon: Star, url: "/brand-data-room/reviews", summary: "Trustpilot + Amazon reviews synced." },
  { title: "Ad Library", icon: LayoutGrid, url: "/brand-data-room/ad-library", summary: "48 image & video ads across 4 brands." },
  { title: "Meta Integration", icon: Link2, url: "/brand-data-room/meta", summary: "Connected - Oy Care (Demo Ad Account) ready." },
];

export default function BrandDataRoom() {
  const nav = useNavigate();
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Data Room</h1>
        <p className="text-muted-foreground text-sm mt-1">All your brand intelligence in one place.</p>
      </div>

      <div className="grid gap-4 grid-cols-2">
        {cards.map((c) => (
          <Card
            key={c.title}
            className="border border-border/60 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => nav(c.url)}
          >
            <CardContent className="p-5 flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <c.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{c.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{c.summary}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
