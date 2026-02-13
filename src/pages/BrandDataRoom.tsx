import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Package, Users, Link2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const cards = [
  { title: "Brand Knowledge", icon: BookOpen, url: "/brand-data-room/knowledge", summary: "Mission, tone of voice, visual style defined. Last updated 3 days ago." },
  { title: "Products", icon: Package, url: "/brand-data-room/products", summary: "4 products cataloged with hypotheses and competitors." },
  { title: "Customer Personas", icon: Users, url: "/brand-data-room/personas", summary: "3 personas defined, linked to 4 products." },
  { title: "Meta Integration", icon: Link2, url: "/brand-data-room/meta", summary: "Connected — 2 ad accounts, last sync 1 hour ago." },
  { title: "Custom Keywords", icon: Search, url: "/brand-data-room/keywords", summary: "18 keywords tracked across 3 categories." },
];

export default function BrandDataRoom() {
  const nav = useNavigate();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Brand Data Room</h1>
        <p className="text-muted-foreground text-sm">All your brand intelligence in one place.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.title} className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" onClick={() => nav(c.url)}>
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="rounded-lg bg-accent p-2"><c.icon className="h-5 w-5 text-accent-foreground" /></div>
              <CardTitle className="text-base">{c.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{c.summary}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
