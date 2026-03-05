import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Package, Users, Link2, Swords, CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HoverExplainer } from "@/components/HoverExplainer";

const cards = [
  { title: "Brand Knowledge", icon: BookOpen, url: "/brand-data-room/knowledge", summary: "Mission, tone of voice, visual style defined.", updated: "3 days ago", complete: true, gradient: "from-indigo-500/15 to-violet-500/10", explainer: "Brand Knowledge: Stores brand identity (name, description, tone, positioning) and visual style (fonts, logos, colors, guidelines). Auto-saves on field blur. Backend: brand_knowledge table. Used as primary context in all AI concept generation prompts." },
  { title: "Products", icon: Package, url: "/brand-data-room/products", summary: "4 products cataloged with hypotheses and competitors.", updated: "1 day ago", complete: true, gradient: "from-blue-500/15 to-cyan-500/10", explainer: "Products: Product catalog with hypothesis, problem, solution, competitors, and linked personas. Each product can have multiple images. Backend: products table + product_personas junction + product_images in Supabase Storage." },
  { title: "Customer Personas", icon: Users, url: "/brand-data-room/personas", summary: "3 personas defined, linked to 4 products.", updated: "2 days ago", complete: true, gradient: "from-emerald-500/15 to-teal-500/10", explainer: "Customer Personas: Target audience definitions with demographics (age, income), lifestyle, pain points. Linked to products via many-to-many. Backend: personas table + product_personas junction. Fed into AI prompts for audience-targeted copy." },
  { title: "Competitors", icon: Swords, url: "/brand-data-room/competitors", summary: "3 competitors tracked with ad scraping.", updated: "1 day ago", complete: true, gradient: "from-amber-500/15 to-orange-500/10", explainer: "Competitors: Tracks competitor brands and their Meta ad activity. Scrapes ad creatives and copy for competitive intelligence. Backend: competitors table with Meta page linking." },
  { title: "Meta Integration", icon: Link2, url: "/brand-data-room/meta", summary: "Connected — 2 ad accounts, last sync 1 hour ago.", updated: "1 hour ago", complete: true, gradient: "from-sky-500/15 to-blue-500/10", explainer: "Meta Integration: OAuth connection to Meta Business Suite. Syncs ad accounts, pages, spend data, and performance metrics. Backend: meta_connections table + hourly cron sync via Edge Function. Data feeds into Performance page and campaign learnings." },
];

const stats = [
  { label: "Products", value: "4" },
  { label: "Personas", value: "3" },
  { label: "Keywords", value: "18" },
  { label: "Data Sources", value: "5" },
];

export default function BrandDataRoom() {
  const nav = useNavigate();
  return (
    <div className="space-y-6">
      <HoverExplainer text="Brand Data Room Overview: Central hub for all brand intelligence. Shows completion status of each data source. Each card navigates to its detail page. Backend: aggregates counts from brand_knowledge, products, personas, meta_connections, and keywords tables.">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Brand Data Room</h1>
          <p className="text-muted-foreground text-sm">All your brand intelligence in one place.</p>
        </div>
      </HoverExplainer>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-3 text-center">
            <p className="text-2xl font-bold tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <HoverExplainer key={c.title} text={c.explainer}>
            <Card className="card-hover cursor-pointer group" onClick={() => nav(c.url)}>
              <CardHeader className="flex flex-row items-start gap-3 pb-2">
                <div className={`icon-badge rounded-xl bg-gradient-to-br ${c.gradient}`}>
                  <c.icon className="h-5 w-5 text-foreground/80" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{c.title}</CardTitle>
                    {c.complete ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : null}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{c.summary}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground/60">Updated {c.updated}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </CardContent>
            </Card>
          </HoverExplainer>
        ))}
      </div>
    </div>
  );
}
