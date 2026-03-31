import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";

interface Props {
  open: boolean;
  onClose: () => void;
}

const RESULTS_DATA = [
  { id: "1", brand: "CeraVe", headline: "Hydrating Facial Cleanser", format: "Image", platform: "Meta", daysOnline: 232, status: "Active", adType: "Static", visualFormat: "Product Demo" },
  { id: "2", brand: "CeraVe", headline: "Moisturizing Cream for Dry Skin Relief", format: "Image", platform: "Meta", daysOnline: 149, status: "Inactive", adType: "Static", visualFormat: "Lifestyle" },
  { id: "3", brand: "The Ordinary", headline: "Niacinamide 10% + Zinc 1%", format: "Video", platform: "Meta", daysOnline: 285, status: "Active", adType: "UGC", visualFormat: "Testimonial" },
  { id: "4", brand: "The Ordinary", headline: "AHA 30% + BHA 2% Peeling Solution", format: "Carousel", platform: "Meta", daysOnline: 120, status: "Active", adType: "Carousel", visualFormat: "Before/After" },
  { id: "5", brand: "CeraVe", headline: "AM Facial Moisturizing Lotion SPF 30", format: "Image", platform: "Meta", daysOnline: 185, status: "Inactive", adType: "Static", visualFormat: "Product Demo" },
  { id: "6", brand: "The Ordinary", headline: "Hyaluronic Acid 2% + B5", format: "Video", platform: "Meta", daysOnline: 75, status: "Active", adType: "UGC", visualFormat: "Testimonial" },
];

export default function DatasetRunResultsDrawer({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <TooltipProvider>
      <div className="fixed inset-0 z-50 flex">
        <div className="w-[30%] bg-black/20" onClick={onClose} />
        <div className="w-[70%] bg-card flex flex-col animate-slide-in-right shadow-2xl border-l border-border">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div>
              <h2 className="text-sm font-bold">Dataset Results</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Scraped and enriched competitor ads from the last run.</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Results table */}
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-8">#</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-10">Preview</TableHead>
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
                    <TableCell className="py-1.5">
                      <div className="w-7 rounded overflow-hidden bg-muted" style={{ aspectRatio: "4/5" }}>
                        <img src="/placeholder.svg" alt="Ad" className="w-full h-full object-cover" />
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-[11px] font-medium">{row.brand}</TableCell>
                    <TableCell className="py-2 text-[11px] text-muted-foreground line-clamp-1">{row.headline}</TableCell>
                    <TableCell className="py-2">
                      <Badge variant="outline" className="text-[9px] py-0 px-1.5 font-normal">{row.format}</Badge>
                    </TableCell>
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
