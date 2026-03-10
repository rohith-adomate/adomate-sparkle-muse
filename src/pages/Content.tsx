import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarWidget } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical, Rocket, Facebook, Linkedin, Check, X,
  Image, Sparkles, Palette, Calendar, ExternalLink, Eye,
  ChevronLeft, ChevronRight, Settings2, RectangleHorizontal,
  Square, Smartphone, Monitor, CalendarIcon, DollarSign,
  Clock, ArrowRight, User, CheckCircle2, XCircle, History,
} from "lucide-react";
import { contentAds, type ContentAd, type AspectRatio, type Platform, type CompletionMethod, type AdHistoryEntry } from "@/data/contentData";

/* ── Status config ── */
const statusConfig = {
  ready: { label: "Ready to launch", borderClass: "ring-2 ring-emerald-400/70", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200", dotClass: "bg-emerald-400" },
  incomplete: { label: "Incomplete", borderClass: "ring-2 ring-amber-400/70", badgeClass: "bg-amber-50 text-amber-700 border-amber-200", dotClass: "bg-amber-400" },
  draft: { label: "Draft", borderClass: "ring-1 ring-border", badgeClass: "bg-muted text-muted-foreground border-border", dotClass: "bg-muted-foreground" },
};

const ALL_RATIOS: AspectRatio[] = ["1:1", "4:5", "9:16", "16:9"];
const ALL_PLATFORMS: Platform[] = ["facebook", "linkedin"];

const ratioIcons: Record<AspectRatio, React.ReactNode> = {
  "1:1": <Square className="h-3 w-3" />,
  "4:5": <RectangleHorizontal className="h-3 w-3 rotate-90" />,
  "9:16": <Smartphone className="h-3 w-3" />,
  "16:9": <Monitor className="h-3 w-3" />,
};

const ratioLabels: Record<AspectRatio, string> = {
  "1:1": "Square",
  "4:5": "Portrait",
  "9:16": "Story / Reel",
  "16:9": "Landscape",
};

const platformIcon = (p: Platform) =>
  p === "facebook" ? <Facebook className="h-3.5 w-3.5" /> : <Linkedin className="h-3.5 w-3.5" />;

/* ── Delivery Settings Modal ── */
function DeliverySettingsModal({
  ad,
  open,
  onClose,
}: {
  ad: ContentAd | null;
  open: boolean;
  onClose: () => void;
}) {
  const [platforms, setPlatforms] = useState<Platform[]>(ad?.platforms || ["facebook"]);
  const [ratios, setRatios] = useState<AspectRatio[]>(ad?.requiredRatios || ["4:5", "9:16"]);
  const [method, setMethod] = useState<CompletionMethod>(ad?.completionMethod || "ai");
  const [budgetType, setBudgetType] = useState<"daily" | "lifetime">("daily");
  const [budget, setBudget] = useState("25");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Reset state when ad changes
  const [prevAdId, setPrevAdId] = useState<string | null>(null);
  if (ad && ad.id !== prevAdId) {
    setPrevAdId(ad.id);
    setPlatforms(ad.platforms);
    setRatios(ad.requiredRatios);
    setMethod(ad.completionMethod);
  }

  if (!ad) return null;

  const togglePlatform = (p: Platform) => {
    setPlatforms((prev) =>
      prev.includes(p) ? (prev.length > 1 ? prev.filter((x) => x !== p) : prev) : [...prev, p]
    );
  };

  const toggleRatio = (r: AspectRatio) => {
    setRatios((prev) =>
      prev.includes(r) ? (prev.length > 1 ? prev.filter((x) => x !== r) : prev) : [...prev, r]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Delivery Settings</DialogTitle>
          <p className="text-xs text-muted-foreground">{ad.title} — override defaults for this ad</p>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* ── Platforms ── */}
          <div className="space-y-2.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Launch Platforms
            </Label>
            <div className="flex gap-2">
              {ALL_PLATFORMS.map((p) => {
                const active = platforms.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 rounded-lg border-2 py-2.5 text-xs font-medium transition-all",
                      active
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"
                    )}
                  >
                    {platformIcon(p)}
                    <span className="capitalize">{p}</span>
                    {active && <Check className="h-3.5 w-3.5 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* ── Aspect Ratios ── */}
          <div className="space-y-2.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Required Aspect Ratios
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_RATIOS.map((r) => {
                const active = ratios.includes(r);
                const completed = ad.completedRatios.includes(r);
                return (
                  <button
                    key={r}
                    onClick={() => toggleRatio(r)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-xs font-medium transition-all text-left",
                      active
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"
                    )}
                  >
                    {ratioIcons[r]}
                    <div className="flex-1">
                      <span className="block">{r}</span>
                      <span className="text-[10px] text-muted-foreground">{ratioLabels[r]}</span>
                    </div>
                    {active && completed && (
                      <Badge className="text-[9px] bg-emerald-50 text-emerald-700 border-emerald-200 px-1.5 py-0">
                        Done
                      </Badge>
                    )}
                    {active && !completed && (
                      <Badge className="text-[9px] bg-amber-50 text-amber-600 border-amber-200 px-1.5 py-0">
                        Pending
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* ── Completion Method ── */}
          <div className="space-y-2.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Completion Method
            </Label>
            <div className="flex gap-2">
              <button
                onClick={() => setMethod("ai")}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1.5 rounded-lg border-2 py-3 text-xs font-medium transition-all",
                  method === "ai"
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"
                )}
              >
                <Sparkles className="h-4 w-4" />
                <span>AI Generation</span>
                <span className="text-[10px] text-muted-foreground font-normal">Automatic & fast</span>
              </button>
              <button
                onClick={() => setMethod("designer")}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1.5 rounded-lg border-2 py-3 text-xs font-medium transition-all",
                  method === "designer"
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"
                )}
              >
                <Palette className="h-4 w-4" />
                <span>Creative Designer</span>
                <span className="text-[10px] text-muted-foreground font-normal">Manual quality</span>
              </button>
            </div>
          </div>

          <Separator />

          {/* ── Schedule & Budget ── */}
          <div className="space-y-2.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Schedule & Budget
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {/* Start date */}
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Start date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left text-xs h-9 font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="h-3 w-3 mr-1.5" />
                      {startDate ? format(startDate, "MMM d, yyyy") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarWidget
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {/* End date */}
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">End date (optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left text-xs h-9 font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="h-3 w-3 mr-1.5" />
                      {endDate ? format(endDate, "MMM d, yyyy") : "No end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarWidget
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Select value={budgetType} onValueChange={(v) => setBudgetType(v as "daily" | "lifetime")}>
                  <SelectTrigger className="w-28 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily budget</SelectItem>
                    <SelectItem value="lifetime">Lifetime budget</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative flex-1">
                  <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="pl-7 h-8 text-xs"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" className="gap-1.5" onClick={onClose}>
            <Check className="h-3.5 w-3.5" /> Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Ad Card ── */
function AdCard({ ad, onOpen, onEditSettings }: { ad: ContentAd; onOpen: () => void; onEditSettings: () => void }) {
  const cfg = statusConfig[ad.status];
  const progress = ad.requiredRatios.length > 0
    ? Math.round((ad.completedRatios.length / ad.requiredRatios.length) * 100)
    : 0;

  return (
    <Card
      className={`group overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${cfg.borderClass}`}
      onClick={onOpen}
    >
      {/* Image */}
      <div className="aspect-[4/5] relative overflow-hidden bg-muted">
        <img
          src={`https://picsum.photos/seed/${ad.imgSeed}/400/500`}
          alt={ad.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
        {/* Status badge overlay */}
        <div className="absolute top-2 left-2">
          <Badge className={`text-[10px] font-medium border ${cfg.badgeClass}`}>
            <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${cfg.dotClass}`} />
            {cfg.label}
          </Badge>
        </div>
        {/* Three-dot menu */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="secondary" size="icon" className="h-7 w-7 bg-card/90 backdrop-blur-sm shadow-sm">
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem className="gap-2 text-xs" onClick={(e) => { e.stopPropagation(); onEditSettings(); }}>
                <Settings2 className="h-3.5 w-3.5" /> Edit delivery settings
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-xs">
                <Image className="h-3.5 w-3.5" /> Generate missing ratios
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-xs">
                <Palette className="h-3.5 w-3.5" /> Assign to designer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-xs text-destructive">
                <X className="h-3.5 w-3.5" /> Remove from content
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Platform icons */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {ad.platforms.map((p) => (
            <div key={p} className="h-6 w-6 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
              {platformIcon(p)}
            </div>
          ))}
        </div>
      </div>

      <CardContent className="p-3 space-y-2">
        {/* Title & CTA */}
        <div>
          <p className="text-xs font-semibold truncate">{ad.title}</p>
          <p className="text-[10px] text-muted-foreground truncate mt-0.5">{ad.headline}</p>
        </div>

        {/* Aspect ratio pills */}
        <div className="flex gap-1 flex-wrap">
          {ad.requiredRatios.map((r) => {
            const done = ad.completedRatios.includes(r);
            return (
              <Tooltip key={r}>
                <TooltipTrigger asChild>
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                      done
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-600 border-amber-200"
                    }`}
                  >
                    {ratioIcons[r]}
                    {r}
                    {done && <Check className="h-2.5 w-2.5" />}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {r} — {done ? "Completed" : "Missing"}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              {ad.completedRatios.length}/{ad.requiredRatios.length} ratios
            </span>
            <span className="text-[10px] font-medium">{progress}%</span>
          </div>
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${progress === 100 ? "bg-emerald-400" : "bg-amber-400"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Method & date */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
          <span className="flex items-center gap-1">
            {ad.completionMethod === "ai" ? <Sparkles className="h-3 w-3" /> : <Palette className="h-3 w-3" />}
            {ad.completionMethod === "ai" ? "AI generated" : "Designer"}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {ad.likedAt}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── History Drawer ── */
function AdHistoryDrawer({
  ad,
  open,
  onClose,
}: {
  ad: ContentAd | null;
  open: boolean;
  onClose: () => void;
}) {
  const [selectedEntry, setSelectedEntry] = useState<AdHistoryEntry | null>(null);

  if (!ad) return null;

  const historyStatusConfig = {
    approved: { label: "Approved", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
    current: { label: "Current", icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10 border-primary/30" },
    rejected: { label: "Rejected", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10 border-destructive/30" },
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl p-0">
        <SheetHeader className="p-6 pb-4 border-b border-border">
          <SheetTitle className="text-lg">Ad History</SheetTitle>
          <p className="text-xs text-muted-foreground">{ad.title} — version timeline</p>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="p-6 space-y-0">
            {ad.history.map((entry, i) => {
              const cfg = historyStatusConfig[entry.status];
              const StatusIcon = cfg.icon;
              const isLast = i === ad.history.length - 1;

              return (
                <div key={entry.id} className="relative flex gap-4">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "h-8 w-8 rounded-full border-2 flex items-center justify-center shrink-0",
                      entry.status === "current"
                        ? "border-primary bg-primary/10"
                        : entry.status === "approved"
                        ? "border-emerald-400 bg-emerald-50"
                        : "border-destructive/50 bg-destructive/10"
                    )}>
                      <StatusIcon className={cn("h-4 w-4", cfg.color)} />
                    </div>
                    {!isLast && (
                      <div className="w-0.5 flex-1 min-h-[40px] bg-border" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={cn("pb-8 flex-1", isLast && "pb-4")}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{entry.label}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{entry.date}</p>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <User className="h-3 w-3" /> {entry.actor}
                        </p>
                      </div>
                      <Badge className={cn("text-[10px] border shrink-0", cfg.bg)}>
                        {cfg.label}
                      </Badge>
                    </div>

                    {/* Preview card */}
                    <div
                      className="mt-3 flex gap-3 p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <img
                        src={`https://picsum.photos/seed/${entry.imgSeed}/120/120`}
                        alt={entry.label}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{ad.headline}</p>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{ad.adCopy}</p>
                        {entry.note && (
                          <p className="text-[10px] text-muted-foreground/70 italic mt-1.5">
                            "{entry.note}"
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 self-center" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Detail overlay for selected entry */}
        {selectedEntry && (
          <div className="absolute inset-0 bg-background z-10 flex flex-col">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedEntry(null)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <p className="text-sm font-semibold">{selectedEntry.label}</p>
                <p className="text-[11px] text-muted-foreground">{selectedEntry.date}</p>
              </div>
              <Badge className={cn("text-[10px] border", historyStatusConfig[selectedEntry.status].bg)}>
                {historyStatusConfig[selectedEntry.status].label}
              </Badge>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-4">
                <img
                  src={`https://picsum.photos/seed/${selectedEntry.imgSeed}/500/625`}
                  alt={selectedEntry.label}
                  className="w-full max-w-sm mx-auto rounded-xl shadow-sm border border-border"
                />
                <div className="space-y-3 max-w-sm mx-auto">
                  <div className="rounded-lg border border-border p-3 bg-muted/30">
                    <p className="text-[10px] font-medium text-muted-foreground mb-1">HEADLINE</p>
                    <p className="text-sm font-semibold">{ad.headline}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3 bg-muted/30">
                    <p className="text-[10px] font-medium text-muted-foreground mb-1">PRIMARY TEXT</p>
                    <p className="text-sm">{ad.adCopy}</p>
                  </div>
                  {selectedEntry.note && (
                    <div className="rounded-lg border border-border p-3 bg-accent/30">
                      <p className="text-[10px] font-medium text-muted-foreground mb-1">NOTE</p>
                      <p className="text-sm italic">{selectedEntry.note}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                    <User className="h-3 w-3" />
                    <span>{selectedEntry.actor}</span>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* ── Ad Detail Modal ── */
function AdDetailModal({ ad, open, onClose }: { ad: ContentAd | null; open: boolean; onClose: () => void }) {
  const [currentVersion, setCurrentVersion] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);

  if (!ad) return null;

  const cfg = statusConfig[ad.status];
  const missingRatios = ad.requiredRatios.filter((r) => !ad.completedRatios.includes(r));
  const hasVersions = ad.versions.length > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="flex flex-col md:flex-row min-h-[520px]">
            {/* Left: image preview */}
            <div className="md:w-[45%] bg-muted/50 relative flex items-center justify-center">
              {hasVersions ? (
                <>
                  <img
                    src={`https://picsum.photos/seed/${ad.versions[currentVersion]?.imgSeed || ad.imgSeed}/500/625`}
                    alt={ad.title}
                    className="w-full aspect-[4/5] object-cover"
                  />
                  {ad.versions.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7 bg-card/90 backdrop-blur-sm shadow-sm"
                        onClick={() => setCurrentVersion((v) => Math.max(0, v - 1))}
                        disabled={currentVersion === 0}
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </Button>
                      <span className="text-xs bg-card/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm font-medium">
                        {currentVersion + 1} / {ad.versions.length}
                      </span>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7 bg-card/90 backdrop-blur-sm shadow-sm"
                        onClick={() => setCurrentVersion((v) => Math.min(ad.versions.length - 1, v + 1))}
                        disabled={currentVersion === ad.versions.length - 1}
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className="bg-card/90 backdrop-blur-sm text-[10px] font-medium">
                      {ad.versions[currentVersion]?.aspectRatio}
                    </Badge>
                  </div>
                </>
              ) : (
                <div className="w-full aspect-[4/5] flex items-center justify-center">
                  <div className="text-center space-y-2 text-muted-foreground">
                    <Image className="h-10 w-10 mx-auto opacity-40" />
                    <p className="text-xs">No versions generated yet</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: details */}
            <div className="md:w-[55%] flex flex-col">
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-5">
                  <DialogHeader className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-[10px] border", cfg.badgeClass)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full mr-1.5", cfg.dotClass)} />
                        {cfg.label}
                      </Badge>
                    </div>
                    <DialogTitle className="text-xl font-bold">{ad.title}</DialogTitle>
                    <p className="text-xs text-muted-foreground">
                      From {ad.sourceWorkflow} · Liked {ad.likedAt}
                    </p>
                  </DialogHeader>

                  <Separator />

                  {/* Ad copy section */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Ad Copy</h4>
                    <div className="space-y-2.5">
                      <div className="rounded-xl border border-amber-200/60 bg-amber-50/30 p-3.5">
                        <p className="text-[10px] font-semibold text-amber-600/80 mb-1 uppercase tracking-wider">Headline</p>
                        <p className="text-sm font-semibold text-foreground">{ad.headline}</p>
                      </div>
                      <div className="rounded-xl border border-amber-200/60 bg-amber-50/30 p-3.5">
                        <p className="text-[10px] font-semibold text-amber-600/80 mb-1 uppercase tracking-wider">Primary Text</p>
                        <p className="text-sm text-foreground leading-relaxed">{ad.adCopy}</p>
                      </div>
                      <div className="rounded-xl border border-amber-200/60 bg-amber-50/30 p-3.5 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-semibold text-amber-600/80 mb-1 uppercase tracking-wider">Call to Action</p>
                          <p className="text-sm font-semibold text-foreground">{ad.cta}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground/50" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Platforms */}
                  <div className="space-y-2.5">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Platforms</h4>
                    <div className="flex gap-2">
                      {ad.platforms.map((p) => (
                        <div key={p} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/30">
                          {platformIcon(p)}
                          <span className="text-xs font-medium capitalize">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Aspect ratios */}
                  <div className="space-y-2.5">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Aspect Ratios</h4>
                    <div className="flex flex-wrap gap-2">
                      {ad.requiredRatios.map((r) => {
                        const done = ad.completedRatios.includes(r);
                        return (
                          <div
                            key={r}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium",
                              done
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-600 border-amber-200"
                            )}
                          >
                            {ratioIcons[r]}
                            <span>{r}</span>
                            {done ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5 opacity-50" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  {/* Timeline / History preview */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Timeline</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                        onClick={() => setHistoryOpen(true)}
                      >
                        <History className="h-3 w-3" /> View full history
                      </Button>
                    </div>
                    <div
                      className="rounded-xl border border-border p-4 bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
                      onClick={() => setHistoryOpen(true)}
                    >
                      <div className="flex items-center gap-3 overflow-x-auto pb-1">
                        {ad.history.map((entry, i) => (
                          <div key={entry.id} className="flex items-center gap-3 shrink-0">
                            <div className="flex flex-col items-center gap-1.5">
                              <img
                                src={`https://picsum.photos/seed/${entry.imgSeed}/80/80`}
                                alt={entry.label}
                                className={cn(
                                  "w-14 h-14 rounded-lg object-cover border-2",
                                  entry.status === "current"
                                    ? "border-primary"
                                    : entry.status === "approved"
                                    ? "border-emerald-400"
                                    : "border-destructive/50"
                                )}
                              />
                              <p className="text-[9px] text-muted-foreground text-center max-w-[60px] truncate">
                                {entry.label}
                              </p>
                            </div>
                            {i < ad.history.length - 1 && (
                              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                            )}
                          </div>
                        ))}
                        <ChevronRight className="h-5 w-5 text-muted-foreground/30 shrink-0 ml-auto" />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Actions pinned at bottom */}
              <div className="border-t border-border p-4 flex gap-2 bg-card">
                {missingRatios.length > 0 && (
                  <Button size="sm" className="flex-1 gap-1.5 h-10 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                    Prepare for launch
                  </Button>
                )}
                {ad.status === "ready" && (
                  <Button size="sm" className="flex-1 gap-1.5 h-10 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                    <Rocket className="h-3.5 w-3.5" />
                    Launch
                  </Button>
                )}
                <Button variant="outline" size="sm" className="h-10 gap-1.5">
                  <Eye className="h-3.5 w-3.5" /> Preview
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* History drawer */}
      <AdHistoryDrawer ad={ad} open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </>
  );
}
/* ── Main Content Page ── */
export default function Content() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [selectedAd, setSelectedAd] = useState<ContentAd | null>(null);
  const [settingsAd, setSettingsAd] = useState<ContentAd | null>(null);

  const filtered = contentAds.filter((ad) => {
    if (statusFilter !== "all" && ad.status !== statusFilter) return false;
    if (platformFilter !== "all" && !ad.platforms.includes(platformFilter as Platform)) return false;
    return true;
  });


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content</h1>
          <p className="text-muted-foreground text-sm">
            Manage liked concepts and prepare ads for launch.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ad grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <Image className="h-10 w-10 mx-auto text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No ads match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((ad) => (
            <AdCard
              key={ad.id}
              ad={ad}
              onOpen={() => setSelectedAd(ad)}
              onEditSettings={() => setSettingsAd(ad)}
            />
          ))}
        </div>
      )}

      {/* Detail modal */}
      <AdDetailModal
        ad={selectedAd}
        open={!!selectedAd}
        onClose={() => setSelectedAd(null)}
      />

      {/* Delivery settings modal */}
      <DeliverySettingsModal
        ad={settingsAd}
        open={!!settingsAd}
        onClose={() => setSettingsAd(null)}
      />
    </div>
  );
}
