import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Info, Plus, X, Search, ChevronDown, ArrowUp, MessageSquare, Clock,
} from "lucide-react";

interface RedditSubredditDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ALL_SUBREDDITS = [
  { name: "r/SkincareAddiction", subscribers: "2.1M", selected: true },
  { name: "r/AsianBeauty", subscribers: "1.8M", selected: true },
  { name: "r/30PlusSkinCare", subscribers: "542K", selected: false },
  { name: "r/tretinoin", subscribers: "389K", selected: true },
  { name: "r/Retinoids", subscribers: "124K", selected: false },
  { name: "r/beauty", subscribers: "1.2M", selected: true },
  { name: "r/MakeupAddiction", subscribers: "3.4M", selected: false },
  { name: "r/acne", subscribers: "287K", selected: false },
  { name: "r/Rosacea", subscribers: "98K", selected: false },
  { name: "r/EuroSkincare", subscribers: "76K", selected: false },
];

const MOCK_POSTS = [
  { id: 1, subreddit: "r/SkincareAddiction", title: "Finally found a retinol that doesn't destroy my skin barrier", upvotes: 2847, comments: 312, posted: "2 hours ago", status: "Scraped" },
  { id: 2, subreddit: "r/AsianBeauty", title: "Best affordable ceramide moisturizers — 2026 roundup", upvotes: 1923, comments: 187, posted: "5 hours ago", status: "Scraped" },
  { id: 3, subreddit: "r/tretinoin", title: "Month 3 progress — before and after pics", upvotes: 4102, comments: 456, posted: "8 hours ago", status: "Scraped" },
  { id: 4, subreddit: "r/SkincareAddiction", title: "PSA: Your SPF is probably not giving you the protection you think", upvotes: 6721, comments: 891, posted: "12 hours ago", status: "Scraped" },
  { id: 5, subreddit: "r/beauty", title: "What's the one product you'd recommend to a skincare newbie?", upvotes: 1245, comments: 634, posted: "1 day ago", status: "Scraped" },
  { id: 6, subreddit: "r/30PlusSkinCare", title: "Niacinamide ruined my skin — here's what happened", upvotes: 3456, comments: 278, posted: "1 day ago", status: "Filtered" },
  { id: 7, subreddit: "r/AsianBeauty", title: "Holy grail sunscreen that doesn't leave a white cast?", upvotes: 987, comments: 145, posted: "2 days ago", status: "Scraped" },
  { id: 8, subreddit: "r/Retinoids", title: "Switching from tretinoin to adapalene — worth it?", upvotes: 567, comments: 89, posted: "2 days ago", status: "Scraped" },
  { id: 9, subreddit: "r/SkincareAddiction", title: "Why is everyone sleeping on azelaic acid?", upvotes: 2134, comments: 201, posted: "3 days ago", status: "Scraped" },
  { id: 10, subreddit: "r/beauty", title: "The $8 moisturizer that replaced my $60 one", upvotes: 8923, comments: 1204, posted: "3 days ago", status: "Scraped" },
];

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export default function RedditSubredditDrawer({ open, onOpenChange }: RedditSubredditDrawerProps) {
  const [subreddits, setSubreddits] = useState(ALL_SUBREDDITS);
  const [subredditPopoverOpen, setSubredditPopoverOpen] = useState(false);
  const [subredditSearch, setSubredditSearch] = useState("");
  const [language, setLanguage] = useState("en");
  const [sortMode, setSortMode] = useState("hot");
  const [timeWindow, setTimeWindow] = useState("7d");
  const [maxPosts, setMaxPosts] = useState("25");
  const [includeComments, setIncludeComments] = useState(true);
  const [topNComments, setTopNComments] = useState("20");
  const [deduplicate, setDeduplicate] = useState(true);
  const [blockNSFW, setBlockNSFW] = useState(true);

  const toggleSubreddit = (name: string) => {
    setSubreddits(prev => prev.map(s => s.name === name ? { ...s, selected: !s.selected } : s));
  };

  const removeSubreddit = (name: string) => {
    setSubreddits(prev => prev.map(s => s.name === name ? { ...s, selected: false } : s));
  };

  const selectedSubreddits = subreddits.filter(s => s.selected);
  const unselectedSubreddits = useMemo(() => {
    return subreddits.filter(
      s => !s.selected && s.name.toLowerCase().includes(subredditSearch.toLowerCase())
    );
  }, [subreddits, subredditSearch]);

  if (!open) return null;

  return (
    <TooltipProvider>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm" onClick={() => onOpenChange(false)} />

      {/* Bottom drawer */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-2xl",
          "transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full"
        )}
        style={{ height: "70vh", minHeight: 400 }}
      >
        {/* Handle bar */}
        <div className="flex items-center justify-center py-2 cursor-grab">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-3">
          <div>
            <h2 className="text-sm font-bold">Subreddit Dataset</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">Configure subreddit sources, post filters, and scraping rules.</p>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0" onClick={() => onOpenChange(false)}>
            <ChevronDown className="h-3.5 w-3.5 mr-1" /> Close
          </Button>
        </div>

        <Separator />

        {/* Content: two columns */}
        <div className="flex h-[calc(100%-56px)] overflow-hidden">
          {/* Left: Settings panel */}
          <div className="w-80 shrink-0 border-r border-border overflow-y-auto p-5 space-y-2">

            {/* ── SECTION: Subreddits ── */}
            <p className="text-[9px] font-bold uppercase tracking-widest text-primary/70 mb-1">Subreddits</p>

            {/* Source Strategy */}
            <div className="space-y-2 pb-3">
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1 cursor-help">
                    Source Strategy
                    <Info className="h-2.5 w-2.5" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[200px] text-[10px]">
                  Auto: AI recommends subreddits based on your product category. Manual: You choose specific subreddits.
                </TooltipContent>
              </Tooltip>
              <div className="flex items-center gap-1">
                {(["auto", "manual"] as const).map((mode) => (
                  <div
                    key={mode}
                    className={cn(
                      "flex-1 rounded-md border px-2 py-1.5 text-center cursor-pointer transition-colors text-[10px] font-medium capitalize",
                      sourceStrategy === mode
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:bg-muted/40"
                    )}
                    onClick={() => setSourceStrategy(mode)}
                  >
                    {mode}
                  </div>
                ))}
              </div>
            </div>

            {/* Auto mode: recommended subreddits */}
            {sourceStrategy === "auto" && (
              <div className="space-y-2 pb-3">
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1 cursor-help">
                      Recommended Subreddits
                      <Info className="h-2.5 w-2.5" />
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[200px] text-[10px]">
                    AI-suggested subreddits based on your product category, keywords, and target audience. Toggle to include or exclude.
                  </TooltipContent>
                </Tooltip>
                <div className="space-y-1.5">
                  {subreddits.map((sub) => (
                    <div key={sub.name} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-6 w-6 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center shrink-0">
                          <span className="text-[8px] font-bold text-orange-600">r/</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium truncate">{sub.name}</p>
                          <p className="text-[9px] text-muted-foreground">{sub.subscribers} subscribers</p>
                        </div>
                      </div>
                      <Switch
                        checked={sub.enabled}
                        onCheckedChange={() => toggleSubreddit(sub.name)}
                        className="shrink-0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Manual mode: add subreddits */}
            {sourceStrategy === "manual" && (
              <div className="space-y-2 pb-3">
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1 cursor-help">
                      Add Subreddits
                      <Info className="h-2.5 w-2.5" />
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[200px] text-[10px]">
                    Manually enter subreddit names. Suggestions will appear as you type based on relevance.
                  </TooltipContent>
                </Tooltip>
                <div className="flex gap-1.5">
                  <Input
                    placeholder="e.g. SkincareAddiction"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addManualSubreddit()}
                    className="h-8 text-xs flex-1"
                  />
                  <Button variant="outline" size="sm" className="h-8 px-2" onClick={addManualSubreddit}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Suggestions */}
                {filteredSuggestions.length > 0 && (
                  <div className="rounded-md border border-border bg-muted/20 p-1.5 space-y-0.5">
                    <p className="text-[9px] text-muted-foreground font-medium px-1.5 pb-1">Suggestions</p>
                    {filteredSuggestions.map((s) => (
                      <button
                        key={s.name}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-accent transition-colors text-left"
                        onClick={() => {
                          setManualSubreddits(prev => [...prev, s]);
                          setManualInput("");
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center shrink-0">
                            <span className="text-[7px] font-bold text-orange-600">r/</span>
                          </div>
                          <span className="text-[11px] font-medium">{s.name}</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground">{s.subscribers}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Added subreddits */}
                {manualSubreddits.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {manualSubreddits.map((sub) => (
                      <div key={sub.name} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="h-6 w-6 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center shrink-0">
                            <span className="text-[8px] font-bold text-orange-600">r/</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium truncate">{sub.name}</p>
                            <p className="text-[9px] text-muted-foreground">{sub.subscribers} subscribers</p>
                          </div>
                        </div>
                        <button onClick={() => removeManualSubreddit(sub.name)} className="shrink-0 hover:text-destructive transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}


            <Separator />

            {/* ── SECTION: Posts ── */}
            <p className="text-[9px] font-bold uppercase tracking-widest text-primary/70 pt-3 mb-1">Posts</p>

            {/* Language */}
            <div className="space-y-2 pb-3">
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1 cursor-help">
                    Language
                    <Info className="h-2.5 w-2.5" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[200px] text-[10px]">
                  Filter posts by language. Only posts in the selected language will be included.
                </TooltipContent>
              </Tooltip>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="all">All Languages</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort mode */}
            <div className="space-y-2 pb-3">
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1 cursor-help">
                    Sort Mode
                    <Info className="h-2.5 w-2.5" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[200px] text-[10px]">
                  How posts are ranked within each subreddit. Hot = trending now, Top = highest score, New = most recent.
                </TooltipContent>
              </Tooltip>
              <div className="flex items-center gap-1">
                {(["hot", "top", "new"] as const).map((mode) => (
                  <div
                    key={mode}
                    className={cn(
                      "flex-1 rounded-md border px-2 py-1.5 text-center cursor-pointer transition-colors text-[10px] font-medium capitalize",
                      sortMode === mode
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:bg-muted/40"
                    )}
                    onClick={() => setSortMode(mode)}
                  >
                    {mode}
                  </div>
                ))}
              </div>
            </div>

            {/* Time window */}
            <div className="space-y-2 pb-3">
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1 cursor-help">
                    Time Window
                    <Info className="h-2.5 w-2.5" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[200px] text-[10px]">
                  Only scrape posts published within this time range from the current date.
                </TooltipContent>
              </Tooltip>
              <Select value={timeWindow} onValueChange={setTimeWindow}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Max posts per subreddit */}
            <div className="space-y-2 pb-3">
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1 cursor-help">
                    Max Posts per Subreddit
                    <Info className="h-2.5 w-2.5" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[200px] text-[10px]">
                  Maximum number of posts to scrape from each selected subreddit per run.
                </TooltipContent>
              </Tooltip>
              <Input type="number" min="1" max="100" value={maxPosts} onChange={(e) => setMaxPosts(e.target.value)} className="h-8 text-xs" />
            </div>

            {/* Include comments */}
            <div className="space-y-2 pb-3">
              <div className="flex items-center justify-between">
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1 cursor-help">
                      Include Comments
                      <Info className="h-2.5 w-2.5" />
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[200px] text-[10px]">
                    When enabled, top comments are scraped alongside post content for richer insight extraction.
                  </TooltipContent>
                </Tooltip>
                <Switch checked={includeComments} onCheckedChange={setIncludeComments} />
              </div>
              {includeComments && (
                <div className="space-y-1.5 pl-1">
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1 cursor-help">
                        Top N Comments per Post
                        <Info className="h-2.5 w-2.5" />
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[200px] text-[10px]">
                      Number of top-ranked comments to include per post. Higher values capture more opinions but increase processing time.
                    </TooltipContent>
                  </Tooltip>
                  <Input type="number" min="1" max="100" value={topNComments} onChange={(e) => setTopNComments(e.target.value)} className="h-8 text-xs" />
                </div>
              )}
            </div>

            {/* Region */}
            <div className="space-y-2 pb-3">
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1 cursor-help">
                    Region
                    <Info className="h-2.5 w-2.5" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[200px] text-[10px]">
                  Optional geographic filter. Posts are filtered by subreddit region relevance when available.
                </TooltipContent>
              </Tooltip>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="eu">Europe</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="apac">Asia Pacific</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* ── SECTION: Filters ── */}
            <p className="text-[9px] font-bold uppercase tracking-widest text-primary/70 pt-3 mb-1">Filters</p>

            {/* Deduplicate */}
            <div className="flex items-center justify-between pb-2">
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1 cursor-help">
                    Deduplicate Similar Posts
                    <Info className="h-2.5 w-2.5" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[200px] text-[10px]">
                  Uses semantic similarity to remove near-duplicate posts across subreddits, keeping only the highest-engagement version.
                </TooltipContent>
              </Tooltip>
              <Switch checked={deduplicate} onCheckedChange={setDeduplicate} />
            </div>

            {/* Block NSFW */}
            <div className="flex items-center justify-between pb-2">
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1 cursor-help">
                    Block NSFW Content
                    <Info className="h-2.5 w-2.5" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[200px] text-[10px]">
                  Automatically filters out posts and comments flagged as NSFW by Reddit or detected by our content safety model.
                </TooltipContent>
              </Tooltip>
              <Switch checked={blockNSFW} onCheckedChange={setBlockNSFW} />
            </div>
          </div>

          {/* Right: Data Table */}
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-8">#</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-32">Subreddit</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider">Title</TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-20 text-right">
                    <div className="flex items-center justify-end gap-1"><ArrowUp className="h-3 w-3" /> Upvotes</div>
                  </TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-20 text-right">
                    <div className="flex items-center justify-end gap-1"><MessageSquare className="h-3 w-3" /> Comments</div>
                  </TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-24">
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> Posted</div>
                  </TableHead>
                  <TableHead className="h-9 text-[10px] font-bold uppercase tracking-wider w-20">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_POSTS.map((post, idx) => (
                  <TableRow key={post.id} className="hover:bg-muted/20">
                    <TableCell className="py-2 text-[10px] text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-1.5">
                        <div className="h-4 w-4 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center shrink-0">
                          <span className="text-[6px] font-bold text-orange-600">r/</span>
                        </div>
                        <span className="text-[10px] font-medium truncate">{post.subreddit.replace("r/", "")}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <p className="text-[11px] font-medium line-clamp-1">{post.title}</p>
                    </TableCell>
                    <TableCell className="py-2 text-right">
                      <span className="text-[10px] font-medium">{formatNumber(post.upvotes)}</span>
                    </TableCell>
                    <TableCell className="py-2 text-right">
                      <span className="text-[10px] text-muted-foreground">{formatNumber(post.comments)}</span>
                    </TableCell>
                    <TableCell className="py-2">
                      <span className="text-[10px] text-muted-foreground">{post.posted}</span>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge variant="secondary" className={cn("text-[9px] py-0 h-5", post.status === "Scraped" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20")}>
                        {post.status}
                      </Badge>
                    </TableCell>
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
