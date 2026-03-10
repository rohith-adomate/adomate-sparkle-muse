import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "lucide-react";

interface CompetitorScrapeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MOCK_COMPETITORS = [
  { id: "1", name: "Nike", avatar: "🟢", selected: true },
  { id: "2", name: "Adidas", avatar: "🔵", selected: true },
  { id: "3", name: "Puma", avatar: "🟡", selected: false },
];

export default function CompetitorScrapeDrawer({ open, onOpenChange }: CompetitorScrapeDrawerProps) {
  const [competitors, setCompetitors] = useState(MOCK_COMPETITORS);
  const [maxAds, setMaxAds] = useState("10");
  const [minReach, setMinReach] = useState("1000");
  const [minDaysActive, setMinDaysActive] = useState("7");
  const [periodType, setPeriodType] = useState<"all-time" | "custom">("all-time");
  const [customFrom, setCustomFrom] = useState("2026-01-01");
  const [customTo, setCustomTo] = useState("2026-03-10");

  const toggleCompetitor = (id: string) => {
    setCompetitors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  const selectedCount = competitors.filter((c) => c.selected).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[380px] sm:w-[420px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-base">Competitor Scrape — Settings</SheetTitle>
        </SheetHeader>

        {/* Competitor Selection */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Competitors
            </Label>
            <Badge variant="secondary" className="text-[10px]">
              {selectedCount} selected
            </Badge>
          </div>
          <div className="space-y-2">
            {competitors.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 cursor-pointer hover:bg-muted/40 transition-colors"
              >
                <Checkbox
                  checked={c.selected}
                  onCheckedChange={() => toggleCompetitor(c.id)}
                />
                <span className="text-sm">{c.avatar}</span>
                <span className="text-xs font-medium">{c.name}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Max Ads */}
        <div className="space-y-2 mb-6">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Max ads per competitor
          </Label>
          <Input
            type="number"
            min="1"
            max="100"
            value={maxAds}
            onChange={(e) => setMaxAds(e.target.value)}
            className="h-9 text-sm"
          />
          <p className="text-[10px] text-muted-foreground">
            Limit how many ads are fetched per competitor.
          </p>
        </div>

        <Separator className="mb-6" />

        {/* Thresholds */}
        <div className="space-y-4 mb-6">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Thresholds
          </Label>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Min. days active</Label>
            <Input
              type="number"
              min="0"
              value={minDaysActive}
              onChange={(e) => setMinDaysActive(e.target.value)}
              className="h-9 text-sm"
            />
            <p className="text-[10px] text-muted-foreground">
              Only include ads that have been active for at least this many days.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Min. estimated reach</Label>
            <Input
              type="number"
              min="0"
              value={minReach}
              onChange={(e) => setMinReach(e.target.value)}
              className="h-9 text-sm"
            />
            <p className="text-[10px] text-muted-foreground">
              Only include ads with at least this estimated reach.
            </p>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Time Period */}
        <div className="space-y-4">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Time period
          </Label>

          <div className="flex items-center gap-3">
            <div
              className={`flex-1 rounded-lg border px-3 py-2.5 text-center cursor-pointer transition-colors text-xs font-medium ${
                periodType === "all-time"
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:bg-muted/40"
              }`}
              onClick={() => setPeriodType("all-time")}
            >
              All time
            </div>
            <div
              className={`flex-1 rounded-lg border px-3 py-2.5 text-center cursor-pointer transition-colors text-xs font-medium ${
                periodType === "custom"
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:bg-muted/40"
              }`}
              onClick={() => setPeriodType("custom")}
            >
              Custom period
            </div>
          </div>

          {periodType === "custom" && (
            <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" /> From
                </Label>
                <Input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" /> To
                </Label>
                <Input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
