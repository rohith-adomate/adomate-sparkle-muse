import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical, Rocket, Facebook, Linkedin, Check, X,
  Image, Sparkles, Palette, Calendar, ExternalLink, Eye,
  ChevronLeft, ChevronRight, Settings2, RectangleHorizontal,
  Square, Smartphone, Monitor,
} from "lucide-react";
import { contentAds, type ContentAd, type AspectRatio, type Platform } from "@/data/contentData";

/* ── Status config ── */
const statusConfig = {
  ready: { label: "Ready to launch", borderClass: "ring-2 ring-emerald-400/70", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200", dotClass: "bg-emerald-400" },
  incomplete: { label: "Incomplete", borderClass: "ring-2 ring-amber-400/70", badgeClass: "bg-amber-50 text-amber-700 border-amber-200", dotClass: "bg-amber-400" },
  draft: { label: "Draft", borderClass: "ring-1 ring-border", badgeClass: "bg-muted text-muted-foreground border-border", dotClass: "bg-muted-foreground" },
};

const ratioIcons: Record<AspectRatio, React.ReactNode> = {
  "1:1": <Square className="h-3 w-3" />,
  "4:5": <RectangleHorizontal className="h-3 w-3 rotate-90" />,
  "9:16": <Smartphone className="h-3 w-3" />,
  "16:9": <Monitor className="h-3 w-3" />,
};

const platformIcon = (p: Platform) =>
  p === "facebook" ? <Facebook className="h-3.5 w-3.5" /> : <Linkedin className="h-3.5 w-3.5" />;

/* ── Ad Card ── */
function AdCard({ ad, onOpen }: { ad: ContentAd; onOpen: () => void }) {
  const cfg = statusConfig[ad.status];
  const missingRatios = ad.requiredRatios.filter((r) => !ad.completedRatios.includes(r));
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
              <DropdownMenuItem className="gap-2 text-xs">
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

/* ── Ad Detail Modal ── */
function AdDetailModal({ ad, open, onClose }: { ad: ContentAd | null; open: boolean; onClose: () => void }) {
  const [currentVersion, setCurrentVersion] = useState(0);

  if (!ad) return null;

  const cfg = statusConfig[ad.status];
  const missingRatios = ad.requiredRatios.filter((r) => !ad.completedRatios.includes(r));
  const hasVersions = ad.versions.length > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left: image preview */}
          <div className="md:w-1/2 bg-muted relative">
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
                    <span className="text-xs bg-card/90 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm font-medium">
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
                {/* Version aspect ratio label */}
                <div className="absolute top-3 left-3">
                  <Badge variant="outline" className="bg-card/90 backdrop-blur-sm text-[10px]">
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
          <div className="md:w-1/2 p-5 space-y-4 overflow-y-auto max-h-[80vh]">
            <DialogHeader className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge className={`text-[10px] border ${cfg.badgeClass}`}>
                  <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${cfg.dotClass}`} />
                  {cfg.label}
                </Badge>
              </div>
              <DialogTitle className="text-lg">{ad.title}</DialogTitle>
              <p className="text-xs text-muted-foreground">From {ad.sourceWorkflow} · Liked {ad.likedAt}</p>
            </DialogHeader>

            <Separator />

            {/* Ad copy section */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ad Copy</h4>
              <div className="space-y-2">
                <div className="rounded-lg border border-border p-3 bg-muted/30">
                  <p className="text-[10px] font-medium text-muted-foreground mb-1">HEADLINE</p>
                  <p className="text-sm font-semibold">{ad.headline}</p>
                </div>
                <div className="rounded-lg border border-border p-3 bg-muted/30">
                  <p className="text-[10px] font-medium text-muted-foreground mb-1">PRIMARY TEXT</p>
                  <p className="text-sm">{ad.adCopy}</p>
                </div>
                <div className="rounded-lg border border-border p-3 bg-muted/30 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground mb-1">CALL TO ACTION</p>
                    <p className="text-sm font-medium">{ad.cta}</p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Platforms */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Platforms</h4>
              <div className="flex gap-2">
                {ad.platforms.map((p) => (
                  <div key={p} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-muted/30">
                    {platformIcon(p)}
                    <span className="text-xs font-medium capitalize">{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Aspect ratios */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aspect Ratios</h4>
              <div className="grid grid-cols-2 gap-2">
                {ad.requiredRatios.map((r) => {
                  const done = ad.completedRatios.includes(r);
                  return (
                    <div
                      key={r}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium ${
                        done
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-600 border-amber-200"
                      }`}
                    >
                      {ratioIcons[r]}
                      <span>{r}</span>
                      <span className="ml-auto">
                        {done ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5 opacity-50" />}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              {missingRatios.length > 0 && (
                <Button size="sm" className="flex-1 gap-1.5 h-9">
                  <Sparkles className="h-3.5 w-3.5" />
                  Prepare for launch
                </Button>
              )}
              {ad.status === "ready" && (
                <Button size="sm" className="flex-1 gap-1.5 h-9 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Rocket className="h-3.5 w-3.5" />
                  Launch
                </Button>
              )}
              <Button variant="outline" size="sm" className="h-9 gap-1.5">
                <Eye className="h-3.5 w-3.5" /> Preview
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Main Content Page ── */
export default function Content() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [selectedAd, setSelectedAd] = useState<ContentAd | null>(null);

  const filtered = contentAds.filter((ad) => {
    if (statusFilter !== "all" && ad.status !== statusFilter) return false;
    if (platformFilter !== "all" && !ad.platforms.includes(platformFilter as Platform)) return false;
    return true;
  });

  const readyCount = contentAds.filter((a) => a.status === "ready").length;
  const incompleteCount = contentAds.filter((a) => a.status === "incomplete").length;
  const draftCount = contentAds.filter((a) => a.status === "draft").length;

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

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card p-3.5 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Check className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-bold">{readyCount}</p>
            <p className="text-[11px] text-muted-foreground">Ready to launch</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-3.5 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center">
            <Image className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <p className="text-lg font-bold">{incompleteCount}</p>
            <p className="text-[11px] text-muted-foreground">Incomplete</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-3.5 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-lg font-bold">{draftCount}</p>
            <p className="text-[11px] text-muted-foreground">Drafts</p>
          </div>
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
            <AdCard key={ad.id} ad={ad} onOpen={() => setSelectedAd(ad)} />
          ))}
        </div>
      )}

      {/* Detail modal */}
      <AdDetailModal
        ad={selectedAd}
        open={!!selectedAd}
        onClose={() => setSelectedAd(null)}
      />
    </div>
  );
}
