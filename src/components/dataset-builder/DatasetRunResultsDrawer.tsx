import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, Database, Users, Activity, Sparkles } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";

interface Props {
  open: boolean;
  onClose: () => void;
}

const RESULTS_DATA = [
  { id: "1", brand: "CeraVe", brandAvatar: "https://logo.clearbit.com/cerave.com", headline: "Hydrating Facial Cleanser", format: "Image", platform: "Meta", daysOnline: 232, status: "Active", adType: "Static", visualFormat: "Product Demo" },
  { id: "2", brand: "CeraVe", brandAvatar: "https://logo.clearbit.com/cerave.com", headline: "Moisturizing Cream for Dry Skin Relief", format: "Image", platform: "Meta", daysOnline: 149, status: "Inactive", adType: "Static", visualFormat: "Lifestyle" },
  { id: "3", brand: "The Ordinary", brandAvatar: "https://logo.clearbit.com/theordinary.com", headline: "Niacinamide 10% + Zinc 1%", format: "Video", platform: "Meta", daysOnline: 285, status: "Active", adType: "UGC", visualFormat: "Testimonial" },
  { id: "4", brand: "The Ordinary", brandAvatar: "https://logo.clearbit.com/theordinary.com", headline: "AHA 30% + BHA 2% Peeling Solution", format: "Carousel", platform: "Meta", daysOnline: 120, status: "Active", adType: "Carousel", visualFormat: "Before/After" },
  { id: "5", brand: "CeraVe", brandAvatar: "https://logo.clearbit.com/cerave.com", headline: "AM Facial Moisturizing Lotion SPF 30", format: "Image", platform: "Meta", daysOnline: 185, status: "Inactive", adType: "Static", visualFormat: "Product Demo" },
  { id: "6", brand: "The Ordinary", brandAvatar: "https://logo.clearbit.com/theordinary.com", headline: "Hyaluronic Acid 2% + B5", format: "Video", platform: "Meta", daysOnline: 75, status: "Active", adType: "UGC", visualFormat: "Testimonial" },
];

const SUMMARY_STATS = [
  { label: "Ads Scraped", value: "6", icon: Database },
  { label: "Brands", value: "2", icon: Users },
  { label: "Active", value: "4", icon: Activity },
  { label: "AI Columns Enriched", value: "2", icon: Sparkles },
];

export default function DatasetRunResultsDrawer({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <TooltipProvider>
      <div className="fixed inset-0 z-50 flex">
        <div className="w-[30%] bg-black/20" onClick={onClose} />
        <div className="w-[70%] bg-card flex flex-col animate-slide-in-right shadow-2xl border-l border-border">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div>
              <h2 className="text-sm font-bold">Dataset Results</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Scraped and enriched competitor ads from the last run.</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}><X className="h-4 w-4" /></Button>
          </div>
          <div className="grid grid-cols-4 gap-3 px-5 py-4 border-b border-border">
            {SUMMARY_STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-background">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0"><Icon className="h-4 w-4 text-primary" /></div>
                  <div>
                    <p className="text-lg font-bold leading-none">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-8">#</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider">Brand</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider">Headline</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-16">Format</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-14 text-right">Days</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-16">Status</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-20 text-purple-700 bg-purple-50/40">Ad Type</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-24 text-purple-700 bg-purple-50/40">Visual Format</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RESULTS_DATA.map((row, idx) => (
                  <TableRow key={row.id} className="hover:bg-muted/20">
                    <TableCell className="py-2 text-[10px] text-muted-foreground font-mono">{idx + 1}</TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-1.5">
                        <img src={row.brandAvatar} alt={row.brand} className="h-4 w-4 rounded-full object-cover bg-muted shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(row.brand)}&size=16&background=random`; }} />
                        <span className="text-[11px] font-medium">{row.brand}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-[11px] text-muted-foreground line-clamp-1">{row.headline}</TableCell>
                    <TableCell className="py-2"><Badge variant="outline" className="text-[9px] py-0 px-1.5 font-normal">{row.format}</Badge></TableCell>
                    <TableCell className="py-2 text-right text-[11px] text-muted-foreground tabular-nums">{row.daysOnline}</TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-1">
                        <div className={cn("h-1.5 w-1.5 rounded-full", row.status === "Active" ? "bg-green-500" : "bg-muted-foreground/40")} />
                        <span className="text-[10px]">{row.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 bg-purple-50/20 text-[11px]">{row.adType}</TableCell>
                    <TableCell className="py-2 bg-purple-50/20 text-[11px]">{row.visualFormat}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
