import { Switch } from "@/components/ui/switch";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, ChevronLeft, ChevronRight, History, Pencil, Check, ArrowRight, Play, Clock, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { WorkflowTemplateThumbnail, type WorkflowTemplateVariant } from "@/components/workflow-diagrams/WorkflowTemplateThumbnail";
import trackBrandAdsThumbnail from "@/assets/competitor-template-thumbnail.png";
import uploadYourOwnThumbnail from "@/assets/manual-template-thumbnail.png";
import voiceOfCustomerThumbnail from "@/assets/voice-of-customer-thumbnail.png";
import { UnfinishedWorkflowBanner, type DraftWorkflow } from "@/components/UnfinishedWorkflowBanner";

const mockDrafts: DraftWorkflow[] = [
  { id: "draft-hm", name: "H&M Competitor Tracker", currentStep: 2, totalSteps: 4, stepLabel: "Select ad formats", lastEditedLabel: "2 days ago" },
];

type AgentType = "holiday" | "competitor" | "manual" | "ad-account" | "reddit" | "reviews";

interface Agent {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  concepts: number;
  enabled: boolean;
  nextRun: string;
}

const sourceTemplates: {
  id: string;
  title: string;
  subtitle: string;
  variant: WorkflowTemplateVariant;
  type: AgentType;
  badge: string;
  badgeBg: string;
  badgeText: string;
  thumbnailImg?: string;
  comingSoon?: boolean;
}[] = [
  { id: "src-competitor", title: "Ad library tracker", subtitle: "Track brands and generate ad variations", variant: "competitor", type: "competitor", badge: "", badgeBg: "transparent", badgeText: "transparent", thumbnailImg: trackBrandAdsThumbnail },
  { id: "src-manual", title: "Upload your own images", subtitle: "Generate ad variations from your images", variant: "manual", type: "manual", badge: "", badgeBg: "transparent", badgeText: "transparent", thumbnailImg: uploadYourOwnThumbnail },
  { id: "src-reviews", title: "Voice of customer", subtitle: "Turn real customer reviews into high-converting ads", variant: "reviews", type: "reviews", badge: "", badgeBg: "transparent", badgeText: "transparent", thumbnailImg: voiceOfCustomerThumbnail },
  { id: "src-reddit", title: "Listen on Reddit", subtitle: "Mine subreddit conversations for ad angles that hit", variant: "reddit", type: "reddit", badge: "", badgeBg: "transparent", badgeText: "transparent", comingSoon: true },
];

const defaultAgents: Agent[] = [
  { id: "competitor-1", name: "Nike Ad Monitor", type: "competitor", description: "Weekly scan of Nike ads → generate on-brand variations.", concepts: 9, enabled: true, nextRun: "14 Mar 2026" },
  { id: "competitor-2", name: "Adidas Creative Tracker", type: "competitor", description: "Monitor Adidas campaigns and produce counter-creatives.", concepts: 5, enabled: true, nextRun: "21 Mar 2026" },
  { id: "manual-1", name: "Manual Image Pipeline", type: "manual", description: "Upload your own images and generate ad variations on demand.", concepts: 0, enabled: false, nextRun: "Manual only" },
];

const BORDER = "0.5px solid rgba(0,0,0,0.12)";
const CARD_RADIUS = "12px";

type FirstRunMode = "scheduled" | "manual" | "blocked";

interface FirstRunSpec {
  mode: FirstRunMode;
  nextRunLabel?: string;
  scheduleSummary?: string;
  productCount?: number;
  variationsPerProduct?: number;
  missing?: string[];
}

const activeWorkflows: {
  id: string;
  name: string;
  type: AgentType;
  badge: string;
  badgeBg: string;
  badgeText: string;
  enabled: boolean;
  schedule: "daily" | "weekly" | "monthly" | "manual";
  lastRun: string;
  cadence: string;
  link: { text: string; color: string; href: string };
  thumbnails: string[];
  firstRun?: FirstRunSpec;
}[] = [
  {
    id: "competitor-1",
    name: "Nike Ad Monitor",
    type: "competitor",
    badge: "Competitor", badgeBg: "#FFF3E0", badgeText: "#E65100",
    enabled: true, schedule: "weekly",
    lastRun: "Last run: 12 Mar · 3m 12s", cadence: "Cadence: Weekly",
    link: { text: "→ View 9 new concepts", color: "#D4537E", href: "/concepts/ai-image-studio-1" },
    thumbnails: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=200",
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=200",
    ],
  },
  {
    id: "competitor-2",
    name: "Adidas Creative Tracker",
    type: "competitor",
    badge: "Competitor", badgeBg: "#FFF3E0", badgeText: "#E65100",
    enabled: true, schedule: "weekly",
    lastRun: "Last run: 8 Mar · 1m 03s", cadence: "Cadence: Weekly",
    link: { text: "⚠ Last run failed — check settings", color: "#E24B4A", href: `/workflows/competitor-2` },
    thumbnails: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=200",
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=200",
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200",
    ],
  },
  // ── First-run prototype demo cards ──
  {
    id: "demo-firstrun-scheduled",
    name: "Lululemon Ad Monitor",
    type: "competitor",
    badge: "Competitor", badgeBg: "#FFF3E0", badgeText: "#E65100",
    enabled: true, schedule: "weekly",
    lastRun: "", cadence: "Cadence: Weekly",
    link: { text: "", color: "#D4537E", href: "/workflows/demo-firstrun-scheduled" },
    thumbnails: [],
    firstRun: {
      mode: "scheduled",
      nextRunLabel: "Mon, 16 Mar · 9:00",
      scheduleSummary: "Weekly · Mondays 9:00",
      productCount: 4,
      variationsPerProduct: 8,
    },
  },
  {
    id: "demo-firstrun-manual",
    name: "Spring Drop Concepts",
    type: "manual",
    badge: "Manual", badgeBg: "#FCE4EC", badgeText: "#AD1457",
    enabled: false, schedule: "manual",
    lastRun: "", cadence: "Manual only",
    link: { text: "", color: "#D4537E", href: "/workflows/demo-firstrun-manual" },
    thumbnails: [],
    firstRun: {
      mode: "manual",
      productCount: 3,
      variationsPerProduct: 8,
    },
  },
  {
    id: "demo-firstrun-blocked",
    name: "Glossier Tracker (incomplete)",
    type: "competitor",
    badge: "Competitor", badgeBg: "#FFF3E0", badgeText: "#E65100",
    enabled: false, schedule: "manual",
    lastRun: "", cadence: "",
    link: { text: "", color: "#E24B4A", href: "/workflows/demo-firstrun-blocked" },
    thumbnails: [],
    firstRun: {
      mode: "blocked",
      missing: ["Schedule", "Products"],
    },
  },
];

const runHistory: {
  id: string;
  workflowId: string;
  name: string;
  date: string;
  duration: string;
  status: "success" | "failed";
  concepts: number;
  conceptsRunId?: string;
  thumbnails: string[];
  setup: string[];
}[] = [
  { id: "r1", workflowId: "competitor-1", name: "Nike Ad Monitor", date: "12 Mar 2026 · 14:32", duration: "3m 12s", status: "success", concepts: 9, conceptsRunId: "ai-image-studio-1", thumbnails: [], setup: ["Nike Meta ads · Top 20 by days online", "4 products", "9 concepts generated"] },
  { id: "r2", workflowId: "competitor-1", name: "Nike Ad Monitor", date: "5 Mar 2026 · 14:30", duration: "2m 48s", status: "success", concepts: 7, conceptsRunId: "ai-image-studio-1", thumbnails: [], setup: ["Nike Meta ads · Top 20 by days online", "4 products", "7 concepts generated"] },
  { id: "r3", workflowId: "competitor-2", name: "Adidas Creative Tracker", date: "8 Mar 2026 · 11:05", duration: "1m 03s", status: "failed", concepts: 0, thumbnails: [], setup: ["Adidas Meta ads · All new since last run", "2 products", "Failed at Generate concepts"] },
  { id: "r4", workflowId: "competitor-2", name: "Adidas Creative Tracker", date: "1 Mar 2026 · 11:00", duration: "2m 41s", status: "success", concepts: 5, conceptsRunId: "ai-image-studio-1", thumbnails: [], setup: ["Adidas Meta ads · All new since last run", "2 products", "5 concepts generated"] },
];

export default function Workflows() {
  const [agents, setAgents] = useState<Agent[]>(defaultAgents);
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<Agent | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [workflowToggles, setWorkflowToggles] = useState<Record<string, boolean>>({
    "competitor-1": true,
    "competitor-2": true,
  });

  const [activeSearch, setActiveSearch] = useState("");

  const [drafts] = useState<DraftWorkflow[]>(mockDrafts);
  const [dismissedDraftIds, setDismissedDraftIds] = useState<string[]>([]);
  const visibleDrafts = drafts.filter((d) => !dismissedDraftIds.includes(d.id));

  const handleDismissDraft = (draftId: string) => {
    setDismissedDraftIds((prev) => [...prev, draftId]);
  };

  const handleContinueDraft = (draftId: string) => {
    navigate(`/workflows/${draftId}`, { state: { isNew: false, isDraft: true } });
  };

  const [nameOverrides, setNameOverrides] = useState<Record<string, string>>({});
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  const commitName = (id: string) => {
    const trimmed = draftName.trim();
    if (trimmed) {
      setNameOverrides((prev) => ({ ...prev, [id]: trimmed }));
    }
    setEditingNameId(null);
  };

  const [historyWorkflowId, setHistoryWorkflowId] = useState<string | null>(null);
  const [historyQuery, setHistoryQuery] = useState("");
  const [historyVisibleCount, setHistoryVisibleCount] = useState(30);

  // First-run overrides — workflows in their post-setup, pre-first-run state.
  // Cleared once the first run completes.
  const location = useLocation();
  const [firstRunOverrides, setFirstRunOverrides] = useState<Record<string, FirstRunSpec>>(() => {
    const seed: Record<string, FirstRunSpec> = {};
    for (const wf of activeWorkflows) {
      if (wf.firstRun) seed[wf.id] = wf.firstRun;
    }
    return seed;
  });
  // Synthetic local runs (only the in-progress / just-finished first run) per workflow id.
  type LocalRun = {
    id: string;
    status: "running" | "success";
    startedAt: Date;
    concepts?: number;
  };
  const [localRunsByWf, setLocalRunsByWf] = useState<Record<string, LocalRun[]>>({});
  const [runningFirstWfId, setRunningFirstWfId] = useState<string | null>(null);

  // Inject just-set-up workflow from canvas navigation
  useEffect(() => {
    const justSetup = (location.state as any)?.justSetup;
    if (!justSetup) return;
    const id = justSetup.id;
    setNameOverrides((prev) => ({ ...prev, [id]: justSetup.name }));
    setFirstRunOverrides((prev) => ({
      ...prev,
      [id]: {
        mode: justSetup.mode,
        nextRunLabel: justSetup.nextRunLabel,
        scheduleSummary: justSetup.scheduleSummary,
        productCount: justSetup.productCount,
        variationsPerProduct: justSetup.variationsPerProduct,
      },
    }));
    if (justSetup.runNow) {
      setTimeout(() => handleRunFirstBatch(id), 400);
    }
    // Clear the state so it doesn't re-fire
    window.history.replaceState({}, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRunFirstBatch = (wfId: string) => {
    const spec = firstRunOverrides[wfId];
    if (!spec || spec.mode === "blocked") return;
    const localRun: LocalRun = {
      id: `local-${Date.now()}`,
      status: "running",
      startedAt: new Date(),
    };
    setLocalRunsByWf((prev) => ({ ...prev, [wfId]: [localRun, ...(prev[wfId] || [])] }));
    setRunningFirstWfId(wfId);
    setHistoryWorkflowId(wfId);
    toast.loading("First run kicked off — generating concepts…", { id: `firstrun-${wfId}` });
    setTimeout(() => {
      const concepts = (spec.productCount ?? 4) * (spec.variationsPerProduct ?? 8);
      setLocalRunsByWf((prev) => ({
        ...prev,
        [wfId]: (prev[wfId] || []).map((r) =>
          r.id === localRun.id ? { ...r, status: "success", concepts } : r
        ),
      }));
      setFirstRunOverrides((prev) => {
        const { [wfId]: _, ...rest } = prev;
        return rest;
      });
      setRunningFirstWfId(null);
      toast.success(`First run complete — ${concepts} concepts ready`, {
        id: `firstrun-${wfId}`,
        action: { label: "View concepts →", onClick: () => navigate("/concepts/ai-image-studio-1") },
      });
    }, 3200);
  };

  const railRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setHistoryVisibleCount(30);
    setHistoryQuery("");
  }, [historyWorkflowId]);

  useEffect(() => {
    setHistoryVisibleCount(30);
  }, [historyQuery]);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setAgents((prev) => prev.filter((a) => a.id !== deleteTarget));
    toast.success("Workflow deleted");
    setDeleteTarget(null);
  };

  const activeWorkflow = activeWorkflows.find((w) => w.id === historyWorkflowId) ?? null;

  const workflowRuns = useMemo(() => {
    if (!historyWorkflowId) return [] as (typeof runHistory[number] & { isLocal?: boolean })[];
    const locals = (localRunsByWf[historyWorkflowId] || []).map((lr, i) => ({
      id: lr.id,
      workflowId: historyWorkflowId,
      name: nameOverrides[historyWorkflowId] || activeWorkflows.find((w) => w.id === historyWorkflowId)?.name || "Workflow",
      date: lr.status === "running"
        ? `Just now · ${lr.startedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
        : `Today · ${lr.startedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      duration: lr.status === "running" ? "Running…" : "0m 12s",
      status: (lr.status === "running" ? "success" : "success") as "success" | "failed",
      concepts: lr.concepts ?? 0,
      conceptsRunId: lr.status === "success" ? "ai-image-studio-1" : undefined,
      thumbnails: [] as string[],
      setup: ["First run after setup"],
      isLocal: true,
      _runStatus: lr.status,
    }));
    return [
      ...locals,
      ...runHistory
        .filter((r) => r.workflowId === historyWorkflowId)
        .filter((r) => {
          const q = historyQuery.trim().toLowerCase();
          if (!q) return true;
          return (
            r.date.toLowerCase().includes(q) ||
            r.status.toLowerCase().includes(q) ||
            r.duration.toLowerCase().includes(q)
          );
        }),
    ] as any;
  }, [historyWorkflowId, historyQuery, localRunsByWf, nameOverrides]);

  const visibleHistoryRuns = workflowRuns.slice(0, historyVisibleCount);

  const scrollRail = (dir: "left" | "right") => {
    const el = railRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const templatesRail = (
    <div className="relative group">
      <div
        ref={railRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 scroll-smooth"
        style={{ scrollbarWidth: "thin" }}
      >
        {sourceTemplates.map((t) => (
          <div
            key={t.id}
            onClick={() => {
              if (t.comingSoon) return;
              navigate(`/workflows/${t.id}`, { state: { type: t.type, isNew: true } });
            }}
            style={{ border: BORDER, borderRadius: CARD_RADIUS, background: "#fff" }}
            className={`snap-start shrink-0 w-[280px] md:w-[360px] overflow-hidden group/card transition-shadow ${
              t.comingSoon ? "cursor-not-allowed" : "cursor-pointer hover:shadow-md"
            }`}
          >
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              {t.thumbnailImg ? (
                <img
                  src={t.thumbnailImg}
                  alt={t.title}
                  className={`w-full h-full object-cover ${t.comingSoon ? "blur-md scale-110" : ""}`}
                />
              ) : (
                <div className={`w-full h-full ${t.comingSoon ? "blur-md scale-110" : ""}`}>
                  <WorkflowTemplateThumbnail variant={t.variant} />
                </div>
              )}
              {t.comingSoon && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/30">
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-background/90 text-foreground shadow-sm border border-border">
                    Coming soon
                  </span>
                </div>
              )}
              {!t.comingSoon && (
                <>
                  <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-200 scale-95 group-hover/card:scale-100">
                    <span
                      style={{ fontSize: 13, fontWeight: 600 }}
                      className="px-4 py-2 rounded-full bg-primary text-primary-foreground shadow-lg inline-flex items-center gap-1.5"
                    >
                      Use template
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </>
              )}
            </div>
            <div style={{ padding: "12px 14px 14px" }}>
              <div className="flex items-center justify-between gap-2">
                <p style={{ fontSize: 13, fontWeight: 600 }} className="truncate">{t.title}</p>
              </div>
              <p style={{ fontSize: 11, lineHeight: 1.35 }} className="text-muted-foreground mt-0.5 line-clamp-1">{t.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      <div
        className="pointer-events-none absolute top-0 right-0 h-full w-12"
        style={{ background: "linear-gradient(to left, #fff, transparent)" }}
      />
      <Button
        variant="outline"
        size="icon"
        onClick={() => scrollRail("left")}
        className="hidden md:inline-flex absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Scroll templates left"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => scrollRail("right")}
        className="hidden md:inline-flex absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Scroll templates right"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderActiveCard = (wf: typeof activeWorkflows[number]) => {
    const firstRun = firstRunOverrides[wf.id];
    const isRunning = runningFirstWfId === wf.id;
    const isFirstRun = !!firstRun || isRunning;
    const blocked = firstRun?.mode === "blocked";

    return (
    <div
      key={wf.id}
      onClick={() => navigate(`/workflows/${wf.id}`, { state: { type: wf.type } })}
      style={{
        border: blocked ? "1px solid hsl(var(--destructive) / 0.35)" : isFirstRun ? "1px solid hsl(var(--primary) / 0.4)" : BORDER,
        borderRadius: CARD_RADIUS,
        overflow: "hidden",
        background: "#fff",
        cursor: "pointer",
        boxShadow: isFirstRun ? "0 0 0 3px hsl(var(--primary) / 0.06)" : undefined,
      }}
      className="hover:shadow-md transition-shadow"
    >
      {/* Thumbnail row */}
      {isFirstRun ? (
        <div
          className="relative aspect-[4/1] flex items-center justify-center bg-gradient-to-br from-primary/5 via-muted/40 to-background border-b border-border/40"
        >
          {isRunning ? (
            <div className="flex items-center gap-2 text-primary">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span style={{ fontSize: 12, fontWeight: 500 }}>Generating first batch…</span>
            </div>
          ) : blocked ? (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span style={{ fontSize: 12, fontWeight: 500 }}>Setup incomplete</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span style={{ fontSize: 12, fontWeight: 500 }}>Awaiting first run</span>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-[2px] bg-muted">
          {wf.thumbnails.slice(0, 4).map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden bg-muted">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: "12px 14px" }}>
        <div className="flex items-center justify-between gap-2">
          {editingNameId === wf.id ? (
            <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 min-w-0 flex-1">
              <Input
                autoFocus
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onBlur={() => commitName(wf.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitName(wf.id);
                  if (e.key === "Escape") setEditingNameId(null);
                }}
                className="h-7 text-[13px] font-medium px-2"
              />
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); commitName(wf.id); }}
                className="text-muted-foreground hover:text-foreground shrink-0"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setEditingNameId(wf.id);
                setDraftName(nameOverrides[wf.id] ?? wf.name);
              }}
              className="group flex items-center gap-1.5 min-w-0 flex-1 text-left"
            >
              <span style={{ fontSize: 13, fontWeight: 500 }} className="truncate min-w-0">
                {nameOverrides[wf.id] ?? wf.name}
              </span>
              {isFirstRun && !isRunning && (
                <span
                  className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary"
                >
                  Just set up
                </span>
              )}
              <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          )}
          <div onClick={(e) => e.stopPropagation()} className="shrink-0">
            <Switch
              checked={blocked ? false : (workflowToggles[wf.id] ?? wf.enabled ?? false)}
              disabled={blocked}
              onCheckedChange={(checked) => setWorkflowToggles((prev) => ({ ...prev, [wf.id]: checked }))}
              className="data-[state=checked]:bg-[#D4537E]"
            />
          </div>
        </div>

        {/* Status row */}
        {isFirstRun ? (
          <div className="mt-2 flex items-center gap-2">
            {firstRun?.mode === "scheduled" && (
              <>
                <Clock className="h-3 w-3 text-emerald-600 shrink-0" />
                <span style={{ fontSize: 11 }} className="text-muted-foreground truncate">
                  Scheduled · {firstRun.scheduleSummary || "Weekly"} · First run {firstRun.nextRunLabel || "soon"}
                </span>
              </>
            )}
            {firstRun?.mode === "manual" && (
              <>
                <Play className="h-3 w-3 text-amber-600 shrink-0" />
                <span style={{ fontSize: 11 }} className="text-muted-foreground truncate">
                  Manual · No runs yet · {firstRun.productCount ?? "—"} products × {firstRun.variationsPerProduct ?? 8} variations
                </span>
              </>
            )}
            {blocked && (
              <span style={{ fontSize: 11 }} className="text-destructive truncate">
                Missing: {(firstRun?.missing || []).join(", ")} — finish setup to activate.
              </span>
            )}
            {isRunning && (
              <span style={{ fontSize: 11 }} className="text-primary truncate">
                First run in progress — results will land in run history.
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 mt-2">
            <span style={{ fontSize: 11 }} className="text-muted-foreground">{wf.lastRun}</span>
            <span style={{ fontSize: 11 }} className="text-muted-foreground">{wf.cadence}</span>
          </div>
        )}

        {/* CTA row */}
        <div className="mt-2 flex items-center justify-between gap-2">
          {isFirstRun ? (
            blocked ? (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); navigate(`/workflows/${wf.id}`, { state: { type: wf.type } }); }}
                style={{ fontSize: 12, fontWeight: 600 }}
                className="inline-flex items-center gap-1 text-destructive hover:underline"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                Finish setup →
              </button>
            ) : isRunning ? (
              <span style={{ fontSize: 12, fontWeight: 500 }} className="text-muted-foreground">
                Watch progress in run history →
              </span>
            ) : (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRunFirstBatch(wf.id); }}
                style={{ fontSize: 12, fontWeight: 600 }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 -ml-1 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Play className="h-3 w-3" fill="currentColor" />
                Run first batch
              </button>
            )
          ) : (
            <span
              onClick={(e) => { e.stopPropagation(); navigate(wf.link.href); }}
              style={{ fontSize: 12, fontWeight: 500, color: "#D4537E", cursor: "pointer" }}
              className="truncate hover:underline"
            >
              View latest concepts →
            </span>
          )}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setHistoryWorkflowId(wf.id); }}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            style={{ fontSize: 11, fontWeight: 500 }}
          >
            <History className="h-3 w-3" />
            Run history
          </button>
        </div>
      </div>
    </div>
    );
  };

  const filteredActiveWorkflows = activeWorkflows.filter((wf) => {
    const q = activeSearch.trim().toLowerCase();
    if (!q) return true;
    const name = (nameOverrides[wf.id] ?? wf.name).toLowerCase();
    return name.includes(q);
  });

  const activeSection = (
    <section>
      <div className="flex items-center justify-between gap-3 mb-3">
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em" }} className="text-primary uppercase">
          {filteredActiveWorkflows.length} Active workflows
        </p>
        <div className="relative w-full max-w-[260px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={activeSearch}
            onChange={(e) => setActiveSearch(e.target.value)}
            placeholder="Search workflows"
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>

      {filteredActiveWorkflows.length === 0 ? (
        <div
          style={{ border: BORDER, borderRadius: CARD_RADIUS, background: "#fff", padding: "2.5rem 1rem" }}
          className="text-center"
        >
          <p style={{ fontSize: 13, fontWeight: 500 }}>
            {activeSearch ? "No workflows match your search" : "No active workflows yet"}
          </p>
          <p style={{ fontSize: 12 }} className="text-muted-foreground mt-1 mb-4">
            {activeSearch ? "Try a different keyword." : "Start from a template to create your first workflow."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredActiveWorkflows.map(renderActiveCard)}
        </div>
      )}
    </section>
  );

  return (
    <div style={{ padding: "2.5rem", maxWidth: 1240, margin: "0 auto" }}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500 }} className="tracking-tight">Workflows</h1>
          <p style={{ fontSize: 14 }} className="text-muted-foreground mt-1">
            Always-on pipelines that surface ad concepts while you sleep.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {visibleDrafts.length > 0 && (
          <section>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em" }} className="uppercase text-primary mb-3">
              Pick up where you left off
            </p>
            <UnfinishedWorkflowBanner
              variant="primary"
              drafts={visibleDrafts}
              onContinue={handleContinueDraft}
              onDismiss={handleDismissDraft}
            />
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em" }} className="text-primary uppercase">
              Start with a template
            </p>
          </div>
          {templatesRail}
        </section>

        {activeSection}
      </div>

      <Sheet open={!!historyWorkflowId} onOpenChange={(o) => { if (!o) setHistoryWorkflowId(null); }}>
        <SheetContent side="right" className="w-[480px] sm:max-w-[480px] p-0 flex flex-col">
          <SheetHeader className="px-5 py-4 border-b space-y-2">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-base font-semibold">
                {activeWorkflow?.name ?? "Run history"}
              </SheetTitle>
            </div>
            <p style={{ fontSize: 11 }} className="text-muted-foreground uppercase tracking-wider">
              Run history · {workflowRuns.length}
            </p>
          </SheetHeader>

          <div className="flex-1 overflow-hidden">
            {workflowRuns.length === 0 ? (
              <p style={{ fontSize: 12, padding: "32px 20px" }} className="text-muted-foreground text-center">
                No runs yet for this workflow.
              </p>
            ) : (
              <ScrollArea className="h-[calc(100vh-220px)]">
                <div>
                  {visibleHistoryRuns.map((run: any, idx) => {
                    const isRunning = run._runStatus === "running";
                    const isLocalSuccess = run._runStatus === "success";
                    const totalRuns = workflowRuns.length;
                    const runNumber = totalRuns - idx;
                    return (
                    <div
                      key={run.id}
                      style={{
                        padding: "12px 20px",
                        borderBottom: idx < visibleHistoryRuns.length - 1 ? BORDER : "none",
                      }}
                      className={`transition-colors ${isRunning ? "bg-primary/5" : "hover:bg-muted/40 cursor-pointer"}`}
                      onClick={() => {
                        if (!isRunning && run.status === "success" && run.conceptsRunId) {
                          navigate(`/concepts/${run.conceptsRunId}`);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {isRunning ? (
                          <Loader2 className="h-3 w-3 text-primary animate-spin shrink-0" />
                        ) : (
                          <span
                            style={{
                              width: 6, height: 6, borderRadius: "50%",
                              background: run.status === "success" ? "#639922" : "#E24B4A",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <span style={{ fontSize: 12, fontWeight: 500 }} className="flex-1">
                          Run #{runNumber}{isLocalSuccess && " (first run)"}
                        </span>
                        {isRunning ? (
                          <span style={{ fontSize: 11, fontWeight: 500 }} className="text-primary">Running…</span>
                        ) : run.status === "success" && run.conceptsRunId ? (
                          <span style={{ fontSize: 11, fontWeight: 500, color: "#D4537E" }}>
                            View {run.concepts} concepts →
                          </span>
                        ) : (
                          <span style={{ fontSize: 11, fontWeight: 500, color: "#E24B4A" }}>Failed</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 ml-4">
                        <span style={{ fontSize: 11 }} className="text-muted-foreground">{run.date}</span>
                      </div>
                    </div>
                    );
                  })}
                  {historyVisibleCount < workflowRuns.length && (
                    <div className="p-3 flex justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[11px]"
                        onClick={() => setHistoryVisibleCount((c) => c + 30)}
                      >
                        Show more
                      </Button>
                    </div>
                  )}
                  {workflowRuns.length > 0 && historyVisibleCount >= workflowRuns.length && workflowRuns.length > 5 && (
                    <p style={{ fontSize: 11, padding: "12px 20px" }} className="text-muted-foreground text-center">
                      Showing all {workflowRuns.length}
                    </p>
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete workflow</DialogTitle>
            <DialogDescription>This will permanently remove this workflow and its history. This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit workflow</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs">Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="mt-1" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button onClick={() => {
              if (editTarget) {
                setAgents((prev) => prev.map((a) => a.id === editTarget.id ? { ...a, name: editName, description: editDescription } : a));
                toast.success("Workflow updated");
                setEditTarget(null);
              }
            }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
