import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "@/components/ui/sidebar";
import {
  ArrowLeft, Play, Plus, Minus, Maximize2, Grid3X3,
  Package, Database, Clock, ListFilter,
  PanelLeftClose, PanelLeft, Trash2, Sparkles, ImagePlus, Megaphone,
  Upload, X, Pencil, MousePointerClick, Star,
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import ProductDataDrawer from "@/components/ProductDataDrawer";
import GenerateConceptsDrawer from "@/components/GenerateConceptsDrawer";
import NodeOutputDrawer from "@/components/NodeOutputDrawer";
import DatasetBuilderDrawer from "@/components/dataset-builder/DatasetBuilderDrawer";
import DatasetRunResultsDrawer from "@/components/dataset-builder/DatasetRunResultsDrawer";
import ReviewDatasetDrawer from "@/components/dataset-builder/ReviewDatasetDrawer";
import ScheduleDrawer from "@/components/ScheduleDrawer";
import TopAdsSelectionDrawer from "@/components/TopAdsSelectionDrawer";
import ManualImageInputDrawer from "@/components/ManualImageInputDrawer";
import AdAccountDrawer from "@/components/AdAccountDrawer";
import SetupSummaryDrawer from "@/components/SetupSummaryDrawer";

import RedditSubredditDrawer from "@/components/RedditSubredditDrawer";
import RedditAdGeneratorDrawer from "@/components/RedditAdGeneratorDrawer";
import RunOutputPanel, {
  MOCK_RUNS, MOCK_MANUAL_RUNS, MOCK_REDDIT_RUNS,
  type WorkflowRun, type RunNodeOutput,
} from "@/components/ExecutionOutputPanel";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { getOyImage } from "@/data/oyImages";

/* ── Types ── */

interface CanvasNode {
  id: string;
  type: string;
  category: "trigger" | "static-data" | "dynamic-data" | "select" | "ai" | "action";
  label: string;
  description: string;
  x: number;
  y: number;
  inputs: string[];
  outputs: string[];
  status?: "success" | "running" | "error";
}

interface Edge {
  id: string;
  from: string;
  fromPort: number;
  to: string;
  toPort: number;
}

/* ── Node Catalog ── */

const NODE_CATALOG = [
  {
    category: "trigger" as const,
    label: "TRIGGER",
    items: [
      { type: "schedule", label: "Schedule", description: "Set when this workflow runs.", icon: Clock, inputs: [], outputs: ["Trigger"] },
    ],
  },
  {
    category: "static-data" as const,
    label: "DATA",
    items: [
      { type: "dataset", label: "Dataset", description: "Competitor ads dataset with filters.", icon: Database, inputs: ["Trigger"], outputs: ["Ads Data"] },
      { type: "review-dataset", label: "Review Dataset", description: "Brand & competitor reviews dataset.", icon: Database, inputs: ["Trigger"], outputs: ["Reviews Data"] },
      { type: "ad-account", label: "Ad Account", description: "Pull ads from your own ad account.", icon: Megaphone, inputs: ["Trigger"], outputs: ["Ads Data"] },
      { type: "product-data", label: "Product Data", description: "Fetch product catalog.", icon: Package, inputs: [], outputs: ["Products"] },
      { type: "reddit-subreddit", label: "Subreddit Dataset", description: "Scrape subreddits for insights.", icon: Database, inputs: ["Trigger"], outputs: ["Reddit Data"] },
    ],
  },
  {
    category: "dynamic-data" as const,
    label: "DYNAMIC DATA",
    items: [
      { type: "manual-image-input", label: "Manual Image Input", description: "Upload images at run time.", icon: ImagePlus, inputs: [], outputs: ["Images"] },
    ],
  },
  {
    category: "ai" as const,
    label: "AGENT",
    items: [
      { type: "top-select", label: "Select", description: "Select top ads ranked by a metric.", icon: ListFilter, inputs: ["Ads Data"], outputs: ["Top Ads"] },
      { type: "generate-concepts", label: "Generate Ad Variations", description: "Generate ad variations with AI.", icon: Sparkles, inputs: ["Top Ads", "Products"], outputs: ["Variations"] },
      { type: "reddit-ad-generator", label: "Reddit Ad Generator", description: "Generate ads from Reddit insights.", icon: Sparkles, inputs: ["Reddit Data", "Products"], outputs: ["Variations"] },
    ],
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  trigger: "142 70% 45%",
  "static-data": "210 80% 55%",
  "dynamic-data": "35 90% 55%",
  select: "28 85% 56%",
  ai: "270 70% 60%",
  action: "25 95% 55%",
};

const NODE_W = 200;
const NODE_H = 72;
const MANUAL_NODE_BASE_H = 120;
const MANUAL_NODE_IMG_ROW_H = 52;
const PORT_R = 6;

/* ── Default nodes for demo ── */

function getDefaultNodes(agentName: string, isNew?: boolean): CanvasNode[] {
  return [
    { id: "n1", type: "dataset", category: "static-data", label: "Dataset", description: isNew ? "No sources selected." : "Collect, enrich & filter competitor ads.", x: 100, y: 200, inputs: [], outputs: ["Ads Data"], status: isNew ? undefined : "success" },
    { id: "n3", type: "top-select", category: "ai", label: "Select", description: "Top 10 ads by new reach", x: 400, y: 200, inputs: ["Ads Data"], outputs: ["Top Ads"], status: isNew ? undefined : "success" },
    { id: "n2b", type: "product-data", category: "static-data", label: "Product Data", description: isNew ? "No products selected." : "Fetch product catalog.", x: 400, y: 340, inputs: [], outputs: ["Products"], status: isNew ? undefined : "success" },
    { id: "n5", type: "generate-concepts", category: "ai", label: "Ad Variations", description: "Generate ad variations with AI.", x: 700, y: 260, inputs: ["Top Ads", "Products"], outputs: ["Variations"] },
    { id: "n0", type: "schedule", category: "trigger", label: "Schedule", description: isNew ? "Optional — runs once manually if unset." : "Weekly on Mon", x: 1000, y: 260, inputs: ["Run"], outputs: [], status: isNew ? undefined : "success" },
  ];
}

function getManualNodes(isNew?: boolean): CanvasNode[] {
  return [
    { id: "n0", type: "manual-image-input", category: "dynamic-data", label: "Manual Image Input", description: isNew ? "No images uploaded yet." : "Upload images at run time.", x: 100, y: 200, inputs: [], outputs: ["Images"] },
    { id: "n1", type: "product-data", category: "static-data", label: "Product Data", description: isNew ? "No products selected." : "Fetch product catalog.", x: 100, y: 340, inputs: [], outputs: ["Products"] },
    { id: "n2", type: "generate-concepts", category: "ai", label: "Ad Variations", description: "Generate ad variations with AI.", x: 450, y: 260, inputs: ["Images", "Products"], outputs: ["Variations"] },
  ];
}

function getAdAccountNodes(isNew?: boolean): CanvasNode[] {
  return [
    { id: "n1", type: "ad-account", category: "static-data", label: "Ad Account", description: isNew ? "No campaigns selected." : "All campaigns · All ad sets", x: 100, y: 200, inputs: [], outputs: ["Ads Data"], status: isNew ? undefined : "success" },
    { id: "n3", type: "top-select", category: "ai", label: "Select", description: isNew ? "No selection rule set." : "Top 10 ads by new reach", x: 400, y: 200, inputs: ["Ads Data"], outputs: ["Top Ads"], status: isNew ? undefined : "success" },
    { id: "n2b", type: "product-data", category: "static-data", label: "Product Data", description: isNew ? "No products selected." : "Fetch product catalog.", x: 400, y: 340, inputs: [], outputs: ["Products"], status: isNew ? undefined : "success" },
    { id: "n5", type: "generate-concepts", category: "ai", label: "Ad Variations", description: "Generate ad variations with AI.", x: 700, y: 260, inputs: ["Top Ads", "Products"], outputs: ["Variations"] },
    { id: "n0", type: "schedule", category: "trigger", label: "Schedule", description: isNew ? "Optional — runs once manually if unset." : "Weekly on Mon", x: 1000, y: 260, inputs: ["Run"], outputs: [], status: isNew ? undefined : "success" },
  ];
}

function getRedditNodes(isNew?: boolean): CanvasNode[] {
  return [
    { id: "n1", type: "reddit-subreddit", category: "static-data", label: "Subreddit Dataset", description: isNew ? "No subreddits selected." : "Scrape subreddits for insights.", x: 100, y: 200, inputs: [], outputs: ["Reddit Data"], status: isNew ? undefined : "success" },
    { id: "n2", type: "product-data", category: "static-data", label: "Product Data", description: isNew ? "No products selected." : "Fetch product catalog.", x: 100, y: 340, inputs: [], outputs: ["Products"], status: isNew ? undefined : "success" },
    { id: "n3", type: "reddit-ad-generator", category: "ai", label: "Reddit Ad Generator", description: "Generate ads from Reddit insights.", x: 450, y: 270, inputs: ["Reddit Data", "Products"], outputs: ["Variations"] },
    { id: "n0", type: "schedule", category: "trigger", label: "Schedule", description: isNew ? "Optional — runs once manually if unset." : "Weekly on Mon", x: 750, y: 270, inputs: ["Run"], outputs: [], status: isNew ? undefined : "success" },
  ];
}

function getReviewsNodes(isNew?: boolean): CanvasNode[] {
  return [
    { id: "n1", type: "review-dataset", category: "static-data", label: "Review Dataset", description: isNew ? "No reviews selected." : "Brand & competitor reviews dataset.", x: 100, y: 200, inputs: [], outputs: ["Reviews Data"], status: isNew ? undefined : "success" },
    { id: "n3", type: "top-select", category: "ai", label: "Select", description: isNew ? "No selection rule set." : "Top 10 reviews by relevance", x: 400, y: 200, inputs: ["Reviews Data"], outputs: ["Top Reviews"], status: isNew ? undefined : "success" },
    { id: "n2b", type: "product-data", category: "static-data", label: "Product Data", description: isNew ? "No products selected." : "Fetch product catalog.", x: 400, y: 340, inputs: [], outputs: ["Products"], status: isNew ? undefined : "success" },
    { id: "n5", type: "generate-concepts", category: "ai", label: "Ad Variations", description: "Generate ad variations with AI.", x: 700, y: 260, inputs: ["Top Reviews", "Products"], outputs: ["Variations"] },
    { id: "n0", type: "schedule", category: "trigger", label: "Schedule", description: isNew ? "Optional — runs once manually if unset." : "Weekly on Mon", x: 1000, y: 260, inputs: ["Run"], outputs: [], status: isNew ? undefined : "success" },
  ];
}

const DEFAULT_EDGES: Edge[] = [
  { id: "e1", from: "n1", fromPort: 0, to: "n3", toPort: 0 },
  { id: "e2", from: "n3", fromPort: 0, to: "n5", toPort: 0 },
  { id: "e6", from: "n2b", fromPort: 0, to: "n5", toPort: 1 },
  { id: "e0", from: "n5", fromPort: 0, to: "n0", toPort: 0 },
];

const MANUAL_EDGES: Edge[] = [
  { id: "e0", from: "n0", fromPort: 0, to: "n2", toPort: 0 },
  { id: "e1", from: "n1", fromPort: 0, to: "n2", toPort: 1 },
];

const AD_ACCOUNT_EDGES: Edge[] = [
  { id: "e1", from: "n1", fromPort: 0, to: "n3", toPort: 0 },
  { id: "e2", from: "n3", fromPort: 0, to: "n5", toPort: 0 },
  { id: "e6", from: "n2b", fromPort: 0, to: "n5", toPort: 1 },
  { id: "e0", from: "n5", fromPort: 0, to: "n0", toPort: 0 },
];

const REDDIT_EDGES: Edge[] = [
  { id: "e1", from: "n1", fromPort: 0, to: "n3", toPort: 0 },
  { id: "e2", from: "n2", fromPort: 0, to: "n3", toPort: 1 },
  { id: "e0", from: "n3", fromPort: 0, to: "n0", toPort: 0 },
];

const REVIEWS_EDGES: Edge[] = [
  { id: "e1", from: "n1", fromPort: 0, to: "n3", toPort: 0 },
  { id: "e2", from: "n3", fromPort: 0, to: "n5", toPort: 0 },
  { id: "e6", from: "n2b", fromPort: 0, to: "n5", toPort: 1 },
  { id: "e0", from: "n5", fromPort: 0, to: "n0", toPort: 0 },
];

/* ── Helpers ── */

function getPortPos(node: CanvasNode, side: "input" | "output", index: number, total: number, heightOverride?: number) {
  const h = heightOverride || NODE_H;
  const x = side === "input" ? node.x : node.x + NODE_W;
  const spacing = h / (total + 1);
  const y = node.y + spacing * (index + 1);
  return { x, y };
}

function cubicPath(x1: number, y1: number, x2: number, y2: number) {
  const dx = Math.abs(x2 - x1);
  const cpOff = Math.max(50, dx * 0.4);
  return `M ${x1} ${y1} C ${x1 + cpOff} ${y1}, ${x2 - cpOff} ${y2}, ${x2} ${y2}`;
}

/* ── Component ── */

export default function WorkflowCanvas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isManualWorkflow = (location.state as any)?.type === "manual";
  const isAdAccountWorkflow = (location.state as any)?.type === "ad-account";
  const isRedditWorkflow = (location.state as any)?.type === "reddit";
  const isReviewsWorkflow = (location.state as any)?.type === "reviews";
  const isFromTemplate = (location.state as any)?.isNew === true;
  const isNewCompetitor = isFromTemplate && (location.state as any)?.type === "competitor";
  const isNewAdAccount = isFromTemplate && isAdAccountWorkflow;
  const isNewReddit = isFromTemplate && isRedditWorkflow;
  const isNewManual = isFromTemplate && isManualWorkflow;
  const isNewReviews = isFromTemplate && isReviewsWorkflow;
  const isAnyNew = isFromTemplate;

  // Derive agent name from id
  const agentName = useMemo(() => {
    const names: Record<string, string> = {
      "competitor-1": "Nike Ad Monitor",
      "competitor-2": "Adidas Creative Tracker",
      "manual-1": "Manual Image Pipeline",
    };
    return names[id || ""] || "Workflow";
  }, [id]);

  const [nodes, setNodes] = useState<CanvasNode[]>(() => isManualWorkflow ? getManualNodes(isNewManual) : isAdAccountWorkflow ? getAdAccountNodes(isNewAdAccount) : isRedditWorkflow ? getRedditNodes(isNewReddit) : isReviewsWorkflow ? getReviewsNodes(true) : getDefaultNodes(agentName, isNewCompetitor));
  const [edges, setEdges] = useState<Edge[]>(isManualWorkflow ? MANUAL_EDGES : isAdAccountWorkflow ? AD_ACCOUNT_EDGES : isRedditWorkflow ? REDDIT_EDGES : isReviewsWorkflow ? REVIEWS_EDGES : DEFAULT_EDGES);
  const [nextRunDate, setNextRunDate] = useState<Date | null>(null);
  const [nextRuns, setNextRuns] = useState<Date[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [agentEnabled, setAgentEnabled] = useState(!isManualWorkflow);
  const [scheduleSummary, setScheduleSummary] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"editor" | "runs">("editor");
  
  const [selectedRun, setSelectedRun] = useState<WorkflowRun | null>(null);
  const [runOutputNode, setRunOutputNode] = useState<RunNodeOutput | null>(null);
  const [runPanelOpen, setRunPanelOpen] = useState(false);

  const baseRuns = isManualWorkflow ? MOCK_MANUAL_RUNS : isRedditWorkflow ? MOCK_REDDIT_RUNS : MOCK_RUNS;
  const [localRuns, setLocalRuns] = useState<WorkflowRun[]>([]);
  const runs = [...localRuns, ...baseRuns];

  // Canvas state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [showPicker, setShowPicker] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [datasetDrawerOpen, setDatasetDrawerOpen] = useState(false);
  const [datasetRunResultsOpen, setDatasetRunResultsOpen] = useState(false);
  const [reviewDatasetDrawerOpen, setReviewDatasetDrawerOpen] = useState(false);
  const [reviewDatasetEmpty, setReviewDatasetEmpty] = useState(isReviewsWorkflow);
  const [productDataDrawerOpen, setProductDataDrawerOpen] = useState(false);
  // For non-new (already-active) workflows, assume product-data is configured
  // so the celebration effect doesn't see a false→true transition once the
  // ProductDataDrawer reports its actual selection on mount.
  const [selectedProductCount, setSelectedProductCount] = useState(isAnyNew ? 0 : 1);
  const [datasetEmpty, setDatasetEmpty] = useState(isNewCompetitor);
  const [generateConceptsDrawerOpen, setGenerateConceptsDrawerOpen] = useState(false);
  const [scheduleDrawerOpen, setScheduleDrawerOpen] = useState(false);
  const [topSelectDrawerOpen, setTopSelectDrawerOpen] = useState(false);
  const [manualImageDrawerOpen, setManualImageDrawerOpen] = useState(false);
  const [adAccountDrawerOpen, setAdAccountDrawerOpen] = useState(false);
  const [redditSubredditDrawerOpen, setRedditSubredditDrawerOpen] = useState(false);
  const [redditAdGeneratorDrawerOpen, setRedditAdGeneratorDrawerOpen] = useState(false);
  const [setupSummaryOpen, setSetupSummaryOpen] = useState(false);
  const [editingFromSummary, setEditingFromSummary] = useState<string | null>(null);
  const [workflowNameOverride, setWorkflowNameOverride] = useState<string | null>(null);
  
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const selectStorageKey = `workflow:${id ?? "default"}:topSelectConfig`;
  const manualAdGenStorageKey = `workflow:${id ?? "default"}:manualAdGen`;
  const [topSelectConfig, setTopSelectConfig] = useState<import("@/components/TopAdsSelectionDrawer").SelectConfig>(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(selectStorageKey) : null;
      if (raw) return JSON.parse(raw);
    } catch {}
    return { mode: "top-n", count: 10, maxAgeEnabled: false, maxAgeMonths: 3, manualCount: 0 };
  });
  const [manualAdGen, setManualAdGen] = useState<{ on: boolean; count: number }>(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(manualAdGenStorageKey) : null;
      if (raw) return JSON.parse(raw);
    } catch {}
    return { on: false, count: 0 };
  });
  useEffect(() => {
    try { window.localStorage.setItem(selectStorageKey, JSON.stringify(topSelectConfig)); } catch {}
  }, [topSelectConfig, selectStorageKey]);
  useEffect(() => {
    try { window.localStorage.setItem(manualAdGenStorageKey, JSON.stringify(manualAdGen)); } catch {}
  }, [manualAdGen, manualAdGenStorageKey]);
  // Tracks node types the user has configured (for visual unconfigured state)
  const [configuredTypes, setConfiguredTypes] = useState<Set<string>>(
    () => new Set(isAnyNew || isReviewsWorkflow ? [] : ["schedule", "top-select", "generate-concepts", "ad-account", "reddit-subreddit", "reddit-ad-generator", "manual-image-input"])
  );
  const markConfigured = useCallback((type: string) => {
    setConfiguredTypes((prev) => {
      if (prev.has(type)) return prev;
      const next = new Set(prev);
      next.add(type);
      return next;
    });
  }, []);

  // Pipeline order per workflow type — drives Continue chaining in drawers
  const pipeline = useMemo<string[]>(() => {
    if (isManualWorkflow) return ["manual-image-input", "product-data", "generate-concepts"];
    if (isAdAccountWorkflow) return ["ad-account", "top-select", "product-data", "generate-concepts", "schedule"];
    if (isRedditWorkflow) return ["reddit-subreddit", "product-data", "reddit-ad-generator", "schedule"];
    if (isReviewsWorkflow) return ["review-dataset", "top-select", "product-data", "generate-concepts", "schedule"];
    return ["dataset", "top-select", "product-data", "generate-concepts", "schedule"];
  }, [isManualWorkflow, isAdAccountWorkflow, isRedditWorkflow, isReviewsWorkflow]);

  // Tracks which node-type drawers should currently show the Continue CTA.
  // We snapshot this at the moment a drawer opens so clicking the node
  // (which also calls markConfigured) doesn't immediately hide the CTA.
  const [showContinueFor, setShowContinueFor] = useState<Set<string>>(new Set());

  const openDrawerFor = useCallback((type: string) => {
    setShowContinueFor((prev) => {
      // Don't surface the Continue CTA for nodes that are already configured.
      // For dataset/product-data, "configured" is derived from their own state.
      const alreadyConfigured =
        configuredTypes.has(type) ||
        (type === "dataset" && !datasetEmpty) ||
        (type === "review-dataset" && !reviewDatasetEmpty) ||
        (type === "product-data" && selectedProductCount > 0);
      if (alreadyConfigured) return prev;
      if (prev.has(type)) return prev;
      const next = new Set(prev);
      next.add(type);
      return next;
    });
    if (type === "schedule") setScheduleDrawerOpen(true);
    else if (type === "dataset") setDatasetDrawerOpen(true);
    else if (type === "review-dataset") setReviewDatasetDrawerOpen(true);
    else if (type === "ad-account") setAdAccountDrawerOpen(true);
    else if (type === "reddit-subreddit") setRedditSubredditDrawerOpen(true);
    else if (type === "top-select") setTopSelectDrawerOpen(true);
    else if (type === "product-data") setProductDataDrawerOpen(true);
    else if (type === "generate-concepts") setGenerateConceptsDrawerOpen(true);
    else if (type === "reddit-ad-generator") setRedditAdGeneratorDrawerOpen(true);
    else if (type === "manual-image-input") setManualImageDrawerOpen(true);
  }, [configuredTypes, datasetEmpty, reviewDatasetEmpty, selectedProductCount]);

  const openNextDrawerFor = useCallback((currentType: string) => {
    markConfigured(currentType);
    setShowContinueFor((prev) => {
      if (!prev.has(currentType)) return prev;
      const next = new Set(prev);
      next.delete(currentType);
      return next;
    });
    const idx = pipeline.indexOf(currentType);
    if (idx === -1 || idx === pipeline.length - 1) return;
    const next = pipeline[idx + 1];
    // Defer so the current drawer's onOpenChange(false) can complete first
    setTimeout(() => openDrawerFor(next), 50);
  }, [pipeline, openDrawerFor, markConfigured]);

  const continueLabelFor = useCallback((currentType: string) => {
    if (editingFromSummary === currentType) return "Back to summary";
    const idx = pipeline.indexOf(currentType);
    return idx === pipeline.length - 1 ? "Finish" : "Continue";
  }, [pipeline, editingFromSummary]);

  const returnToSummary = useCallback(() => {
    setEditingFromSummary(null);
    setTimeout(() => setSetupSummaryOpen(true), 150);
  }, []);

  const continueHandlerFor = useCallback(
    (type: string, closeDrawer?: () => void) => {
      if (editingFromSummary === type) {
        return () => { closeDrawer?.(); returnToSummary(); };
      }
      return showContinueFor.has(type)
        ? () => {
            closeDrawer?.();
            openNextDrawerFor(type);
          }
        : undefined;
    },
    [showContinueFor, openNextDrawerFor, editingFromSummary, returnToSummary],
  );

  const editFromSummary = useCallback((type: string, openDrawer: () => void) => {
    setEditingFromSummary(type);
    setSetupSummaryOpen(false);
    setTimeout(openDrawer, 100);
  }, []);

  // Briefly flash unconfigured-node pulsing dots when user tries to Run
  const [flashUnconfigured, setFlashUnconfigured] = useState(false);
  // One-time celebration along edges when workflow becomes fully configured
  const [celebrating, setCelebrating] = useState(false);
  const [celebrationBannerOpen, setCelebrationBannerOpen] = useState(false);
  const wasFullyConfiguredRef = useRef(false);
  const didInitialConfigCheckRef = useRef(false);
  // Editor-mode run simulation: drives moving connector dot + per-node status ring
  const [isRunning, setIsRunning] = useState(false);
  const [runCompleted, setRunCompleted] = useState(false);
  const [nodeImages, setNodeImages] = useState<Record<string, string[]>>({});
  const [nodeDragOver, setNodeDragOver] = useState<string | null>(null);
  const manualFileRef = useRef<HTMLInputElement>(null);

  // Fire confetti from the canvas — pink + green palette
  const fireConfetti = useCallback(() => {
    const colors = ["#DB2777", "#F9A8D4", "#22C55E", "#FFFFFF"];
    const burst = (originX: number) => {
      confetti({
        particleCount: 60,
        spread: 70,
        startVelocity: 45,
        origin: { x: originX, y: 0.35 },
        colors,
        scalar: 0.9,
        ticks: 200,
      });
    };
    burst(0.3);
    setTimeout(() => burst(0.7), 150);
    setTimeout(() => burst(0.5), 300);
  }, []);

  // Execute the workflow run simulation (extracted so the celebration banner can reuse it)
  const runWorkflow = useCallback(() => {
    const UNCONFIGURED_TYPES = ["schedule", "dataset", "review-dataset", "top-select", "product-data", "generate-concepts"];
    const unconfiguredCount = nodes.filter((n) => {
      if (!UNCONFIGURED_TYPES.includes(n.type)) return false;
      if (manualAdGen.on && n.type === "schedule") return false;
      if (n.type === "dataset") return datasetEmpty;
      if (n.type === "review-dataset") return reviewDatasetEmpty;
      if (n.type === "product-data") return selectedProductCount === 0;
      return !configuredTypes.has(n.type);
    }).length;
    if (unconfiguredCount > 0) {
      toast.error("Configure all nodes before running");
      setFlashUnconfigured(true);
      setTimeout(() => setFlashUnconfigured(false), 1500);
      return;
    }
    const hasManualInput = nodes.some((n) => n.type === "manual-image-input");
    if (hasManualInput) {
      const manualNode = nodes.find((n) => n.type === "manual-image-input");
      const imgs = manualNode ? (nodeImages[manualNode.id] || []) : [];
      if (imgs.length === 0) {
        toast.error("Upload at least one image to the Manual Image Input node before running.");
        return;
      }
    }
    // Note: celebrationBannerOpen is left untouched; the persistent ready hint
    // is suppressed during a run via the isRunning flag in the editor.
    const TOTAL_CONCEPTS = 75;
    const STEP_MS = 700;
    const ordered = [...nodes].sort((a, b) => a.x - b.x);
    setRunCompleted(false);
    setIsRunning(true);
    setNodes((prev) => prev.map((n) => ({ ...n, status: undefined })));

    // Create a session run, switch to Runs tab, and select it
    const totalDurationMs = ordered.length * STEP_MS + 200;
    const startedAtLabel = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const nextNumber = (baseRuns[0]?.number ?? 0) + localRuns.length + 1;
    const newRunId = `local-${Date.now()}`;
    const newRun: WorkflowRun = {
      id: newRunId,
      number: nextNumber,
      status: "running",
      startedAt: `Just now · ${startedAtLabel}`,
      duration: "Running…",
      nodeStatuses: Object.fromEntries(ordered.map((n) => [n.id, "running"])) as Record<string, "success" | "error" | "running">,
    };
    setLocalRuns((prev) => [newRun, ...prev]);
    setActiveTab("runs");
    setSelectedRun(newRun);
    setRunPanelOpen(false);
    setRunOutputNode(null);

    const toastAction = {
      label: "View concepts",
      onClick: () => navigate(`/concepts/${id}`),
    };
    const runToastId = toast.loading(`Generating 0 / ${TOTAL_CONCEPTS} concepts…`, { action: toastAction });
    let completed = 0;

    ordered.forEach((node, idx) => {
      window.setTimeout(() => {
        setNodes((prev) => prev.map((n) => (n.id === node.id ? { ...n, status: "running" } : n)));
      }, idx * STEP_MS);
      window.setTimeout(() => {
        setNodes((prev) => prev.map((n) => (n.id === node.id ? { ...n, status: "success" } : n)));
        completed += 1;
        const progress = Math.round((completed / ordered.length) * TOTAL_CONCEPTS);
        if (completed < ordered.length) {
          toast.loading(`Generating ${progress} / ${TOTAL_CONCEPTS} concepts…`, { id: runToastId, action: toastAction });
        }
      }, (idx + 1) * STEP_MS);
    });

    window.setTimeout(() => {
      setIsRunning(false);
      setRunCompleted(true);
      const seconds = Math.max(1, Math.round(totalDurationMs / 1000));
      const finalDuration = `${seconds}s`;
      const finishedNodeStatuses = Object.fromEntries(
        ordered.map((n) => [n.id, "success"])
      ) as Record<string, "success" | "error" | "running">;
      setLocalRuns((prev) =>
        prev.map((r) =>
          r.id === newRunId
            ? { ...r, status: "success", duration: finalDuration, nodeStatuses: finishedNodeStatuses }
            : r
        )
      );
      setSelectedRun((prev) =>
        prev && prev.id === newRunId
          ? { ...prev, status: "success", duration: finalDuration, nodeStatuses: finishedNodeStatuses }
          : prev
      );
      toast.success(`Generated ${TOTAL_CONCEPTS} concepts`, {
        id: runToastId,
        duration: 8000,
        action: {
          label: "View concepts",
          onClick: () => navigate(`/concepts/${id}`),
        },
      });
    }, totalDurationMs);
  }, [nodes, datasetEmpty, reviewDatasetEmpty, selectedProductCount, configuredTypes, nodeImages, navigate, id, baseRuns, localRuns.length]);
  useEffect(() => {
    if (activeTab !== "editor") return;
    const UNCONFIGURED_TYPES = ["schedule", "dataset", "review-dataset", "top-select", "product-data", "generate-concepts"];
    const unconfiguredCount = nodes.filter((n) => {
      if (!UNCONFIGURED_TYPES.includes(n.type)) return false;
      if (manualAdGen.on && n.type === "schedule") return false;
      if (n.type === "dataset") return datasetEmpty;
      if (n.type === "review-dataset") return reviewDatasetEmpty;
      if (n.type === "product-data") return selectedProductCount === 0;
      return !configuredTypes.has(n.type);
    }).length;
    const hasAnyConfigurable = nodes.some((n) => UNCONFIGURED_TYPES.includes(n.type) && !(manualAdGen.on && n.type === "schedule"));
    const fullyConfigured = hasAnyConfigurable && unconfiguredCount === 0;
    // On first evaluation after mount, just sync the ref — don't celebrate
    // an already-configured workflow that the user just opened.
    if (!didInitialConfigCheckRef.current) {
      didInitialConfigCheckRef.current = true;
      wasFullyConfiguredRef.current = fullyConfigured;
      if (fullyConfigured) setCelebrationBannerOpen(true);
      return;
    }
    if (fullyConfigured && !wasFullyConfiguredRef.current) {
      wasFullyConfiguredRef.current = true;
      setCelebrating(true);
      setCelebrationBannerOpen(true);
      fireConfetti();
      // Auto-activate the workflow when everything is configured (manual workflows stay manual)
      const hasManual = nodes.some((n) => n.type === "manual-image-input");
      if (!hasManual) {
        setAgentEnabled(true);
      }
      const t = setTimeout(() => setCelebrating(false), 2000);
      return () => clearTimeout(t);
    }
    if (!fullyConfigured) {
      wasFullyConfiguredRef.current = false;
      setCelebrationBannerOpen(false);
    }
  }, [nodes, datasetEmpty, reviewDatasetEmpty, selectedProductCount, configuredTypes, activeTab, fireConfetti]);

  const getNodeHeight = useCallback((node: CanvasNode) => {
    if (node.type === "manual-image-input") {
      const imgs = nodeImages[node.id] || [];
      const rows = Math.ceil(imgs.length / 4);
      return MANUAL_NODE_BASE_H + (rows > 0 ? rows * MANUAL_NODE_IMG_ROW_H + 8 : 0);
    }
    return NODE_H;
  }, [nodeImages]);

  const addNodeImages = useCallback((nodeId: string, files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;
    const urls = imageFiles.map((f) => URL.createObjectURL(f));
    setNodeImages((prev) => ({
      ...prev,
      [nodeId]: [...(prev[nodeId] || []), ...urls],
    }));
    // Also update the global uploadedImages for the run
    setUploadedImages((prev) => [...prev, ...urls]);
  }, []);

  const removeNodeImage = useCallback((nodeId: string, index: number) => {
    setNodeImages((prev) => ({
      ...prev,
      [nodeId]: (prev[nodeId] || []).filter((_, i) => i !== index),
    }));
  }, []);

  // Update top-select node description when config changes
  const buildSelectDesc = useCallback((config: import("@/components/TopAdsSelectionDrawer").SelectConfig, itemLabel: string) => {
    if (config.mode === "manual-selection") return `${config.manualCount ?? 0} manually selected ${itemLabel}`;
    if (config.mode === "all-new") return `All new ${itemLabel} since last run`;
    return `Top ${config.count} ${itemLabel} by days online${config.maxAgeEnabled ? ` (last ${config.maxAgeMonths}mo)` : ""}`;
  }, []);

  const handleTopSelectChange = useCallback((config: import("@/components/TopAdsSelectionDrawer").SelectConfig) => {
    setTopSelectConfig(config);
    const itemLabel = isReviewsWorkflow ? "reviews" : "ads";
    const desc = buildSelectDesc(config, itemLabel);
    setNodes((prev) =>
      prev.map((n) =>
        n.type === "top-select" ? { ...n, description: desc } : n
      )
    );
  }, [buildSelectDesc, isReviewsWorkflow]);

  // React to manual ad-gen toggle from dataset drawers
  const handleAdGenChange = useCallback((on: boolean, count: number) => {
    setManualAdGen({ on, count });
    if (on) setScheduleDrawerOpen(false);
    setTopSelectConfig((prev) => {
      const next = on
        ? { ...prev, mode: "manual-selection" as const, manualCount: count }
        : { ...prev, mode: prev.mode === "manual-selection" ? ("top-n" as const) : prev.mode, manualCount: 0 };
      const itemLabel = isReviewsWorkflow ? "reviews" : "ads";
      const desc = buildSelectDesc(next, itemLabel);
      setNodes((curr) => curr.map((n) => n.type === "top-select" ? { ...n, description: desc } : n));
      return next;
    });
  }, [buildSelectDesc, isReviewsWorkflow]);

  // Apply persisted Select node description on mount / when nodes load
  useEffect(() => {
    const itemLabel = isReviewsWorkflow ? "reviews" : "ads";
    const desc = buildSelectDesc(topSelectConfig, itemLabel);
    setNodes((curr) => {
      let changed = false;
      const next = curr.map((n) => {
        if (n.type === "top-select" && n.description !== desc) {
          changed = true;
          return { ...n, description: desc };
        }
        return n;
      });
      return changed ? next : curr;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topSelectConfig, isReviewsWorkflow, buildSelectDesc]);
  const [outputDrawerOpen, setOutputDrawerOpen] = useState(false);
  const [outputDrawerNode, setOutputDrawerNode] = useState<{ label: string; type: string; status?: "success" | "running" | "error" } | null>(null);
  // Auto-collapse main sidebar on mount (user can still expand it manually)
  const { setOpen: setSidebarOpen } = useSidebar();
  useEffect(() => {
    setSidebarOpen(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Drag node
  const [dragNode, setDragNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Edge creation state
  const [connecting, setConnecting] = useState<{
    fromNodeId: string;
    fromPort: number;
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  /* ── Zoom ── */
  const clampZoom = (z: number) => Math.max(0.25, Math.min(2, z));

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const factor = e.deltaY > 0 ? 0.92 : 1.08;
    setZoom((prev) => {
      const next = clampZoom(prev * factor);
      const ratio = next / prev;
      setPan((p) => ({
        x: mx - ratio * (mx - p.x),
        y: my - ratio * (my - p.y),
      }));
      return next;
    });
  }, []);

  /* ── Pan ── */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).dataset.canvas) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      setSelectedNode(null);
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
    if (dragNode) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const canvasX = (e.clientX - rect.left - pan.x) / zoom;
      const canvasY = (e.clientY - rect.top - pan.y) / zoom;
      setNodes((prev) =>
        prev.map((n) =>
          n.id === dragNode ? { ...n, x: canvasX - dragOffset.x, y: canvasY - dragOffset.y } : n
        )
      );
    }
    if (connecting) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const TOP_BAR_H = 48; // pt-12 = 3rem = 48px
      const canvasX = (e.clientX - rect.left - pan.x) / zoom;
      const canvasY = (e.clientY - rect.top - TOP_BAR_H - pan.y) / zoom;
      setConnecting((prev) => prev ? { ...prev, mouseX: canvasX, mouseY: canvasY } : null);
    }
  }, [isPanning, panStart, dragNode, dragOffset, pan, zoom, connecting]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setDragNode(null);
    setConnecting(null);
  }, []);

  /* ── Node drag ── */
  const startNodeDrag = (e: React.MouseEvent, nodeId: string) => {
    if (connecting) return; // Don't start node drag while connecting
    e.stopPropagation();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const canvasX = (e.clientX - rect.left - pan.x) / zoom;
    const canvasY = (e.clientY - rect.top - pan.y) / zoom;
    setDragOffset({ x: canvasX - node.x, y: canvasY - node.y });
    setDragNode(nodeId);
    setSelectedNode(nodeId);
  };

  /* ── Port interaction for edge creation ── */
  const startConnection = (e: React.MouseEvent, nodeId: string, portIndex: number) => {
    e.stopPropagation();
    e.preventDefault();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    const pos = getPortPos(node, "output", portIndex, node.outputs.length);
    setConnecting({ fromNodeId: nodeId, fromPort: portIndex, mouseX: pos.x, mouseY: pos.y });
  };

  const finishConnection = (e: React.MouseEvent, nodeId: string, portIndex: number) => {
    e.stopPropagation();
    e.preventDefault();
    if (!connecting) return;
    if (connecting.fromNodeId === nodeId) return; // No self-connections
    // Check if edge already exists
    const exists = edges.some(
      (ed) => ed.from === connecting.fromNodeId && ed.fromPort === connecting.fromPort && ed.to === nodeId && ed.toPort === portIndex
    );
    if (!exists) {
      setEdges((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, from: connecting.fromNodeId, fromPort: connecting.fromPort, to: nodeId, toPort: portIndex },
      ]);
    }
    setConnecting(null);
  };

  /* ── Delete edge ── */
  const deleteEdge = (edgeId: string) => {
    setEdges((prev) => prev.filter((e) => e.id !== edgeId));
  };

  /* ── Add node from picker ── */
  const addNode = (item: typeof NODE_CATALOG[0]["items"][0], category: CanvasNode["category"]) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const cx = rect ? (rect.width / 2 - pan.x) / zoom - NODE_W / 2 : 300;
    const cy = rect ? (rect.height / 2 - pan.y) / zoom - NODE_H / 2 : 200;
    const newNode: CanvasNode = {
      id: `n-${Date.now()}`,
      type: item.type,
      category,
      label: item.label,
      description: item.description,
      x: cx + Math.random() * 40 - 20,
      y: cy + Math.random() * 40 - 20,
      inputs: item.inputs,
      outputs: item.outputs,
    };
    setNodes((prev) => [...prev, newNode]);
  };

  /* ── Delete selected node ── */
  const deleteSelected = () => {
    if (!selectedNode) return;
    // Close all drawers/modals
    setDatasetDrawerOpen(false);
    setDatasetRunResultsOpen(false);
    setProductDataDrawerOpen(false);
    setGenerateConceptsDrawerOpen(false);
    setScheduleDrawerOpen(false);
    setTopSelectDrawerOpen(false);
    setManualImageDrawerOpen(false);
    setAdAccountDrawerOpen(false);
    setRedditSubredditDrawerOpen(false);
    setRedditAdGeneratorDrawerOpen(false);
    setOutputDrawerOpen(false);
    setOutputDrawerNode(null);
    // Remove node and connected edges
    setNodes((prev) => prev.filter((n) => n.id !== selectedNode));
    setEdges((prev) => prev.filter((e) => e.from !== selectedNode && e.to !== selectedNode));
    setSelectedNode(null);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedNode) {
        deleteSelected();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedNode]);

  /* ── Fit to view ── */
  const fitToView = () => {
    if (nodes.length === 0) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const minX = Math.min(...nodes.map((n) => n.x));
    const minY = Math.min(...nodes.map((n) => n.y));
    const maxX = Math.max(...nodes.map((n) => n.x + NODE_W));
    const maxY = Math.max(...nodes.map((n) => n.y + NODE_H));
    const contentW = maxX - minX + 100;
    const contentH = maxY - minY + 100;
    const scaleX = rect.width / contentW;
    const scaleY = rect.height / contentH;
    const newZoom = clampZoom(Math.min(scaleX, scaleY) * 0.85);
    setPan({
      x: (rect.width - contentW * newZoom) / 2 - minX * newZoom + 50 * newZoom,
      y: (rect.height - contentH * newZoom) / 2 - minY * newZoom + 50 * newZoom,
    });
    setZoom(newZoom);
  };

  /* ── Can activate? Dataset node must exist AND no manual-image-input node ── */
  const hasManualImageInput = useMemo(() => nodes.some((n) => n.type === "manual-image-input"), [nodes]);
  const canActivate = useMemo(() => {
    if (hasManualImageInput) return false;
    return nodes.some((n) => n.type === "dataset" || n.type === "review-dataset" || n.type === "reddit-subreddit" || n.type === "ad-account");
  }, [nodes, hasManualImageInput]);

  // Fully-configured = every configurable node in this workflow is configured.
  const fullyConfigured = useMemo(() => {
    const UNCONFIGURED_TYPES = ["schedule", "dataset", "ad-account", "reddit-subreddit", "top-select", "product-data", "generate-concepts", "reddit-ad-generator", "manual-image-input"];
    const configurableNodes = nodes.filter((n) => UNCONFIGURED_TYPES.includes(n.type) && !(manualAdGen.on && n.type === "schedule"));
    if (configurableNodes.length === 0) return false;
    return configurableNodes.every((n) => {
      if (n.type === "dataset") return !datasetEmpty;
      if (n.type === "product-data") return selectedProductCount > 0;
      if (n.type === "manual-image-input") return (nodeImages[n.id] || []).length > 0 || configuredTypes.has("manual-image-input");
      return configuredTypes.has(n.type);
    });
  }, [nodes, datasetEmpty, selectedProductCount, configuredTypes, nodeImages, manualAdGen.on]);

  // Force agent off when manual image input node exists
  useEffect(() => {
    if (hasManualImageInput && agentEnabled) {
      setAgentEnabled(false);
    }
  }, [hasManualImageInput]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Filtered catalog ── */
  const filteredCatalog = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const base = NODE_CATALOG.map((group) => ({
      ...group,
      // Hide Schedule from catalog when user has manually picked rows for ad gen
      items: group.items.filter((item) => !(manualAdGen.on && item.type === "schedule")),
    })).filter((g) => g.items.length > 0);
    if (!q) return base;
    return base.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => item.label.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
      ),
    })).filter((g) => g.items.length > 0);
  }, [searchQuery, manualAdGen.on]);

  // Select first run when switching to runs tab
  const selectRun = useCallback((exec: WorkflowRun) => {
    setSelectedRun(exec);
    setRunPanelOpen(false);
    setRunOutputNode(null);
    // Update node statuses based on run
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        status: exec.nodeStatuses[n.id] || undefined,
      }))
    );
  }, []);

  const handleTabChange = useCallback((tab: "editor" | "runs") => {
    setActiveTab(tab);
    if (tab === "runs" && runs.length > 0) {
      selectRun(runs[0]);
    } else if (tab === "editor") {
      setSelectedRun(null);
      setRunPanelOpen(false);
      setRunOutputNode(null);
      setRunCompleted(false);
      setIsRunning(false);
      // Reset node statuses to editor defaults
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          status: isManualWorkflow ? undefined : (n.type === "generate-concepts" ? undefined : "success"),
        }))
      );
    }
  }, [runs, selectRun, isManualWorkflow]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] -m-6 bg-background">
      {/* ── Left Panel ── */}
      {showPicker && (
        <div className="w-60 border-r border-border bg-card flex flex-col shrink-0">
          {activeTab === "runs" ? (
            /* ── Runs list ── */
            <>
              <div className="p-3 border-b border-border">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Run History</p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {runs.map((exec) => {
                  const isActive = selectedRun?.id === exec.id;
                  return (
                    <button
                      key={exec.id}
                      onClick={() => selectRun(exec)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors border-b border-border/50",
                        isActive ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-muted/40"
                      )}
                    >
                      <div className="shrink-0">
                        {exec.status === "success" ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : exec.status === "failed" ? (
                          <XCircle className="h-4 w-4 text-destructive" />
                        ) : (
                          <Loader2 className="h-4 w-4 text-primary animate-spin" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold">Run #{exec.number}</p>
                        <p className="text-[10px] text-muted-foreground leading-tight">{exec.startedAt}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">{exec.duration}</span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* ── Node Picker (editor mode) ── */
            <>
              <div className="p-3 border-b border-border">
                <Input
                  placeholder="Search nodes…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {filteredCatalog.map((group) => (
                  <div key={group.label}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      {group.label}
                    </p>
                    <div className="space-y-1.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const color = CATEGORY_COLORS[group.category];
                        const isScheduleDisabled = item.type === "schedule" && nodes.some((n) => n.type === "schedule");
                        const btn = (
                          <button
                            key={item.type}
                            disabled={isScheduleDisabled}
                            className={cn(
                              "w-full flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                              isScheduleDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-muted/60"
                            )}
                            onClick={() => !isScheduleDisabled && addNode(item, group.category)}
                          >
                            <div
                              className="shrink-0 rounded-md p-1.5 mt-0.5"
                              style={{ background: `hsl(${color} / 0.12)` }}
                            >
                              <Icon className="h-3.5 w-3.5" style={{ color: `hsl(${color})` }} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate">{item.label}</p>
                              <p className="text-[10px] text-muted-foreground leading-tight">{item.description}</p>
                            </div>
                          </button>
                        );
                        return isScheduleDisabled ? (
                          <Tooltip key={item.type} delayDuration={200}>
                            <TooltipTrigger asChild>{btn}</TooltipTrigger>
                            <TooltipContent side="right" className="text-xs">Only one Schedule node can be present in a workflow</TooltipContent>
                          </Tooltip>
                        ) : (
                          <span key={item.type}>{btn}</span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Canvas Area ── */}
      <div className="flex-1 relative overflow-hidden">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 h-12 z-20 grid grid-cols-3 items-center px-3 bg-card/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center gap-2">
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowPicker(!showPicker)}>
                  {showPicker ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">{showPicker ? "Hide panel" : "Show panel"}</TooltipContent>
            </Tooltip>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/workflows")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold">{agentName}</span>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex items-center bg-muted rounded-lg p-0.5">
              <button
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                  activeTab === "editor"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => handleTabChange("editor")}
              >
                Editor
              </button>
              <button
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                  activeTab === "runs"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => handleTabChange("runs")}
              >
                Runs
              </button>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            {!manualAdGen.on && (
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={agentEnabled}
                      onCheckedChange={(v) => { if (canActivate && fullyConfigured) setAgentEnabled(v); }}
                      disabled={!canActivate || !fullyConfigured}
                      className={(!canActivate || !fullyConfigured) ? "opacity-50 cursor-not-allowed" : ""}
                    />
                    <span className="text-xs text-muted-foreground">{agentEnabled ? "Active" : "Inactive"}</span>
                  </div>
                </TooltipTrigger>
                {(!canActivate || !fullyConfigured) && (
                  <TooltipContent side="bottom" className="text-xs max-w-[220px]">
                    {hasManualImageInput
                      ? "Manual Image Input nodes require manual runs. Scheduling is disabled."
                      : !canActivate
                      ? "Add a Dataset node to activate this workflow."
                      : "Configure all nodes first."}
                  </TooltipContent>
                )}
              </Tooltip>
            )}
            <Button
              size="sm"
              disabled={!fullyConfigured}
              className="h-8 gap-1.5 bg-success hover:bg-success/90 text-success-foreground disabled:opacity-50"
              onClick={() => runWorkflow()}
            >
              <Play className="h-3.5 w-3.5" /> Run
            </Button>
          </div>
        </div>

        {/* Canvas-level hint: inactive workflow OR count of unconfigured nodes */}
        {(() => {
          if (!agentEnabled && !hasManualImageInput) {
            return (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 text-[11px] text-muted-foreground animate-fade-in">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                Workflow inactive — no scheduled runs
              </div>
            );
          }
          if (activeTab !== "editor") return null;
          const UNCONFIGURED_TYPES = ["schedule", "dataset", "review-dataset", "top-select", "product-data", "generate-concepts"];
          const tracked = nodes.filter((n) => UNCONFIGURED_TYPES.includes(n.type) && !(manualAdGen.on && n.type === "schedule"));
          const total = tracked.length;
          const remaining = tracked.filter((n) => {
            if (n.type === "dataset") return datasetEmpty;
            if (n.type === "review-dataset") return reviewDatasetEmpty;
            if (n.type === "product-data") return selectedProductCount === 0;
            return !configuredTypes.has(n.type);
          }).length;
          const done = total - remaining;
          if (total === 0 || remaining === 0) return null;
          const pct = Math.round((done / total) * 100);
          return (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-[11px] text-primary/90">
              <span className="font-medium tabular-nums">{done} of {total} nodes configured</span>
              <div className="h-1 w-24 rounded-full bg-primary/15 overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })()}

        {/* Persistent "Workflow ready" hint — visible whenever active + fully configured */}
        {!isRunning && fullyConfigured && agentEnabled && (() => {
          const isManual = isManualWorkflow || hasManualImageInput;
          if (isManual) {
            return (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 text-[11px] text-success/90 animate-fade-in">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Run manually to generate concepts.
              </div>
            );
          }
          const next = nextRunDate ?? (() => { const d = new Date(); d.setDate(d.getDate() + 7); d.setHours(9, 0, 0, 0); return d; })();
          const dateStr = next.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
          return (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 text-[11px] text-success/90 animate-fade-in">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Next concepts ready {dateStr}
            </div>
          );
        })()}

        {/* Canvas */}
        <div
          ref={canvasRef}
          data-canvas="true"
          className="absolute inset-0 pt-12 cursor-grab active:cursor-grabbing select-none"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Dot grid */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage: `radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)`,
                backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                backgroundPosition: `${pan.x}px ${pan.y}px`,
              }}
            />
          )}

          {/* Transform container */}
          <div
            className="absolute"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "0 0",
            }}
          >
            {/* SVG Edges */}
            <svg className="absolute inset-0" style={{ overflow: "visible", width: 1, height: 1, pointerEvents: "none" }}>
              <defs>
                <marker id="dot" markerWidth="4" markerHeight="4" refX="2" refY="2">
                  <circle cx="2" cy="2" r="1.5" fill="hsl(var(--primary))" opacity="0.6" />
                </marker>
              </defs>
              {(() => {
                const UNCONFIGURED_TYPES = ["schedule", "dataset", "review-dataset", "top-select", "product-data", "generate-concepts"];
                const isNodeUnconfigured = (n: CanvasNode) => {
                  if (!UNCONFIGURED_TYPES.includes(n.type)) return false;
                  if (activeTab !== "editor") return false;
                  if (n.type === "dataset") return datasetEmpty;
                  if (n.type === "review-dataset") return reviewDatasetEmpty;
                  if (n.type === "product-data") return selectedProductCount === 0;
                  return !configuredTypes.has(n.type);
                };
                return edges.map((edge) => {
                  const fromNode = nodes.find((n) => n.id === edge.from);
                  const toNode = nodes.find((n) => n.id === edge.to);
                  if (!fromNode || !toNode) return null;
                  // Hide schedule node & its edges when user has manually picked rows for ad gen
                  if (manualAdGen.on && (fromNode.type === "schedule" || toNode.type === "schedule")) return null;
                  const fromPos = getPortPos(fromNode, "output", edge.fromPort, fromNode.outputs.length, getNodeHeight(fromNode));
                  const toPos = getPortPos(toNode, "input", edge.toPort, toNode.inputs.length, getNodeHeight(toNode));
                  const path = cubicPath(fromPos.x, fromPos.y, toPos.x, toPos.y);
                  const pathId = `path-${edge.id}`;
                  const bothUnconfigured = isNodeUnconfigured(fromNode) && isNodeUnconfigured(toNode);
                  const bothConfigured = !isNodeUnconfigured(fromNode) && !isNodeUnconfigured(toNode);
                  return (
                    <g key={edge.id}>
                      <path
                        d={path}
                        fill="none"
                        stroke="transparent"
                        strokeWidth="14"
                        style={{ pointerEvents: "stroke", cursor: "pointer" }}
                        onClick={(e) => { e.stopPropagation(); deleteEdge(edge.id); }}
                      />
                      <path
                        d={path}
                        fill="none"
                        stroke="hsl(var(--border))"
                        strokeWidth="2"
                        strokeDasharray={bothConfigured ? undefined : "6 4"}
                        opacity={bothUnconfigured ? 0.5 : 1}
                        style={{ pointerEvents: "none", transition: "stroke 0.4s ease, opacity 0.4s ease" }}
                      />
                      <path id={pathId} d={path} fill="none" stroke="none" />
                      {(activeTab === "runs" || isRunning) && (
                        <circle r="3" fill="hsl(var(--primary))" opacity="0.6">
                          <animateMotion dur="2s" repeatCount="indefinite">
                            <mpath href={`#${pathId}`} />
                          </animateMotion>
                        </circle>
                      )}
                    </g>
                  );
                });
              })()}
              {/* Live connecting preview line */}
              {connecting && (() => {
                const fromNode = nodes.find((n) => n.id === connecting.fromNodeId);
                if (!fromNode) return null;
                const fromPos = getPortPos(fromNode, "output", connecting.fromPort, fromNode.outputs.length);
                const path = cubicPath(fromPos.x, fromPos.y, connecting.mouseX, connecting.mouseY);
                return (
                  <path
                    d={path}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.7"
                    style={{ pointerEvents: "none" }}
                  />
                );
              })()}
            </svg>

            {/* Nodes */}
            {(() => {
              const UNCONFIGURED_TYPES_FOR_FIRST = ["schedule", "dataset", "review-dataset", "top-select", "product-data", "generate-concepts"];
              const unconfiguredOrdered = [...nodes]
                .filter((n) => {
                  if (!UNCONFIGURED_TYPES_FOR_FIRST.includes(n.type)) return false;
                  if (activeTab !== "editor") return false;
                  if (n.type === "dataset") return datasetEmpty;
                  if (n.type === "review-dataset") return reviewDatasetEmpty;
                  if (n.type === "product-data") return selectedProductCount === 0;
                  return !configuredTypes.has(n.type);
                })
                .sort((a, b) => a.x - b.x);
              const firstUnconfiguredId = unconfiguredOrdered[0]?.id;
              const trackedTotal = nodes.filter((n) => UNCONFIGURED_TYPES_FOR_FIRST.includes(n.type)).length;
              const noneConfiguredYet = unconfiguredOrdered.length === trackedTotal;
              return nodes.map((node) => {
              // Hide schedule node when user has manually picked rows for ad gen
              if (manualAdGen.on && node.type === "schedule") return null;
              const color = CATEGORY_COLORS[node.category];
              const isSelected = selectedNode === node.id;
              const catalogItem = NODE_CATALOG.flatMap((g) => g.items).find((i) => i.type === node.type);
              const Icon = catalogItem?.icon || Database;
              const isManualInput = node.type === "manual-image-input";
              const manualImages = isManualInput ? (nodeImages[node.id] || []) : [];
              const currentNodeH = getNodeHeight(node);

              // Orange warning border for unconfigured nodes (existing data-driven warnings)
              const needsConfig = (node.type === "dataset" && datasetEmpty) || (node.type === "review-dataset" && reviewDatasetEmpty) || (node.type === "product-data" && selectedProductCount === 0);
              const warningTooltip = node.type === "dataset" && datasetEmpty
                ? "The dataset table is currently empty. Click to add competitor sources."
                : node.type === "review-dataset" && reviewDatasetEmpty
                ? "The reviews dataset is currently empty. Click to add brand reviews."
                : node.type === "product-data" && selectedProductCount === 0
                ? "No products are selected yet. Click to choose products for this workflow."
                : null;

              // Visual "unconfigured" state — applies to a known set of node types until user touches them
              const UNCONFIGURED_HELPER: Record<string, string> = {
                "schedule": "Define when this workflow runs",
                "dataset": "Build a custom ad dataset from any brands",
                "review-dataset": "Add brand reviews from Trustpilot or Amazon",
                "top-select": "Set your ad selection filters",
                "product-data": "Choose your products",
                "generate-concepts": "Configure your variation output",
              };
              const helperText = UNCONFIGURED_HELPER[node.type];
              const isConfigurable = helperText !== undefined;
              const isUnconfigured =
                isConfigurable &&
                activeTab === "editor" &&
                (
                  (node.type === "dataset" && datasetEmpty) ||
                  (node.type === "review-dataset" && reviewDatasetEmpty) ||
                  (node.type === "product-data" && selectedProductCount === 0) ||
                  (node.type !== "dataset" && node.type !== "review-dataset" && node.type !== "product-data" && !configuredTypes.has(node.type))
                );

              const isConfiguredNode = isConfigurable && !isUnconfigured;

              const nodeEl = (
                <div
                  key={node.id}
                  className={cn(
                    "group absolute rounded-xl border bg-card shadow-sm transition-all",
                    isSelected ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md",
                    // Running / completed states use a single border color (no pink+green stacking)
                    (activeTab === "runs" || isRunning || runCompleted) && node.status === "success" && "border-success ring-1 ring-success/40",
                    (activeTab === "runs" || isRunning) && node.status === "error" && "border-destructive ring-1 ring-destructive/40",
                    (activeTab === "runs" || isRunning) && node.status === "running" && "border-primary ring-1 ring-primary/40",
                    // Uniform dashed light grey border for ALL unconfigured nodes (no per-type colors)
                    isUnconfigured && !isSelected && "border-dashed border-muted-foreground/30 bg-muted/40",
                    isUnconfigured && "cursor-pointer hover:bg-muted/70 hover:border-muted-foreground/50",
                    // Configured nodes: neutral border + pointer cursor
                    isConfiguredNode && "cursor-pointer",
                    // Inactive workflow: dim all nodes in the editor
                    activeTab === "editor" && !agentEnabled && !isRunning && !runCompleted && "opacity-50 grayscale",
                  )}
                  style={{
                    left: node.x,
                    top: node.y,
                    width: NODE_W,
                  }}
                  onMouseDown={(e) => activeTab !== "runs" && startNodeDrag(e, node.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node.id);
                    if (activeTab === "runs") {
                      if (node.type === "dataset") {
                        setDatasetRunResultsOpen(true);
                      } else {
                        setRunOutputNode({ label: node.label, type: node.type, status: node.status || "success" });
                        setRunPanelOpen(true);
                      }
                    } else {
                      if (node.type === "dataset") {
                        openDrawerFor("dataset");
                      } else if (node.type === "review-dataset") {
                        openDrawerFor("review-dataset");
                      } else if (node.type === "product-data") {
                        openDrawerFor("product-data");
                      } else if (node.type === "generate-concepts") {
                        openDrawerFor("generate-concepts");
                        markConfigured("generate-concepts");
                      } else if (node.type === "schedule") {
                        openDrawerFor("schedule");
                        markConfigured("schedule");
                      } else if (node.type === "top-select") {
                        openDrawerFor("top-select");
                        markConfigured("top-select");
                      } else if (node.type === "manual-image-input") {
                        // Don't open drawer on click — interaction is inline now
                      } else if (node.type === "ad-account") {
                        openDrawerFor("ad-account");
                      } else if (node.type === "reddit-subreddit") {
                        openDrawerFor("reddit-subreddit");
                      } else if (node.type === "reddit-ad-generator") {
                        openDrawerFor("reddit-ad-generator");
                      }
                    }
                  }}
                >
                  {/* Left accent border — hidden for unconfigured AND configured nodes (uniform borders) */}
                  {!isUnconfigured && !isConfiguredNode && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
                      style={{ background: `hsl(${color})` }}
                    />
                  )}

                  {/* "Start here" badge only on the very first node before any progress; otherwise just a pulsing dot */}
                  {isUnconfigured && node.id === firstUnconfiguredId && noneConfiguredYet && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold uppercase tracking-wide shadow-sm flex items-center gap-1 animate-glow">
                      <span className="h-1 w-1 rounded-full bg-primary-foreground" />
                      Start here
                    </div>
                  )}
                  {isUnconfigured && node.id === firstUnconfiguredId && !noneConfiguredYet && (
                    <span className="absolute -top-1 -right-1 z-20 h-2 w-2 rounded-full bg-primary animate-glow" />
                  )}

                  {/* Hover "+" affordance for other unconfigured nodes */}
                  {isUnconfigured && node.id !== firstUnconfiguredId && (
                    <div className="absolute -top-2 -right-2 z-20 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="h-3 w-3" />
                    </div>
                  )}


                  {node.type === "product-data" && selectedProductCount > 0 && !isConfiguredNode && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
                      <Badge variant="outline" className="text-[9px] gap-0.5 px-1.5 py-0 ">
                        <Package className="h-2.5 w-2.5" />
                        {selectedProductCount}
                      </Badge>
                    </div>
                  )}

                  {/* Standard node body */}
                  {!isManualInput && (
                    <div className="pl-3.5 pr-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="shrink-0 rounded-md p-1"
                          style={{ background: isUnconfigured ? "hsl(var(--muted))" : `hsl(${color} / 0.12)` }}
                        >
                          <Icon
                            className="h-3.5 w-3.5"
                            style={{ color: isUnconfigured ? "hsl(var(--muted-foreground))" : `hsl(${color})` }}
                          />
                        </div>
                        <span className="text-xs font-bold truncate">{node.label}</span>
                        {(activeTab === "runs" || isRunning || runCompleted) && node.status && (
                          <div className="ml-auto shrink-0 flex items-center">
                            {node.status === "running" ? (
                              <Loader2 className="h-3 w-3 text-primary animate-spin" />
                            ) : (
                              <div
                                className={`h-2.5 w-2.5 rounded-full ${
                                  node.status === "success" ? "bg-success" : "bg-destructive"
                                }`}
                              />
                            )}
                          </div>
                        )}
                      </div>
                      {isUnconfigured ? (
                        <div className="mt-2 -mx-3.5 -mb-2.5">
                          <div className="px-3.5 pb-2">
                            {node.type === "schedule" && (
                              <div className="h-12 rounded-md border border-dashed border-muted-foreground/20 flex items-center justify-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground/50" />
                                <span className="text-[11px] font-medium text-muted-foreground/70">Set cadence</span>
                              </div>
                            )}
                            {(node.type === "dataset" || node.type === "review-dataset") && (
                              <div className="h-12 flex items-center justify-start -space-x-2">
                                {Array.from({ length: 3 }).map((_, i) => (
                                  <div key={i} className="h-9 w-9 rounded-full border border-dashed border-muted-foreground/30 bg-muted/30 ring-2 ring-card" />
                                ))}
                              </div>
                            )}
                            {node.type === "top-select" && (
                              <div className="h-12 rounded-md border border-dashed border-muted-foreground/20 flex items-center justify-center gap-1.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <div key={i} className="h-7 w-5 rounded bg-muted-foreground/15" />
                                ))}
                              </div>
                            )}
                            {node.type === "product-data" && (
                              <div className="h-12 flex items-center justify-start -space-x-2">
                                {Array.from({ length: 3 }).map((_, i) => (
                                  <div key={i} className="h-9 w-9 aspect-square rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 ring-2 ring-card flex items-center justify-center">
                                    <ImagePlus className="h-3.5 w-3.5 text-muted-foreground/50" />
                                  </div>
                                ))}
                              </div>
                            )}
                            {node.type === "generate-concepts" && (
                              <div className="h-12 rounded-md border border-dashed border-muted-foreground/20 flex items-center justify-center">
                                <div className="flex items-end gap-2 tabular-nums text-muted-foreground/60">
                                  <div className="flex flex-col items-center leading-none">
                                    <span className="text-[12px] font-semibold">—</span>
                                    <span className="text-[7px] uppercase tracking-wide mt-0.5">prod</span>
                                  </div>
                                  <span className="text-[11px] leading-none pb-2">×</span>
                                  <div className="flex flex-col items-center leading-none">
                                    <span className="text-[12px] font-semibold">—</span>
                                    <span className="text-[7px] uppercase tracking-wide mt-0.5">ads</span>
                                  </div>
                                  <span className="text-[11px] leading-none pb-2">×</span>
                                  <div className="flex flex-col items-center leading-none">
                                    <span className="text-[12px] font-semibold">—</span>
                                    <span className="text-[7px] uppercase tracking-wide mt-0.5">var</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : isConfiguredNode ? ((() => {
                          // Shared output data per node type
                          const brands = [
                            { initials: "CV", bg: "hsl(220 70% 55%)" },
                            { initials: "LO", bg: "hsl(0 70% 55%)" },
                            { initials: "NX", bg: "hsl(280 60% 55%)" },
                          ];
                          const productCount = selectedProductCount > 0 ? selectedProductCount : 3;
                          const productDisplay = Math.min(productCount, 4);

                          const isAllNew = topSelectConfig.mode === "all-new";

                          // ── Variant C · Card stack (full-width hero strip + bottom metric row)
                          return (
                            <div className="mt-2 -mx-3.5 -mb-2.5">
                              <div className="px-3.5 pb-2">
                                {node.type === "schedule" && (() => {
                                  const runs = nextRuns.length > 0
                                    ? nextRuns.slice(0, 3)
                                    : Array.from({ length: 3 }, (_, i) => {
                                        const d = new Date();
                                        d.setDate(d.getDate() + 7 * (i + 1));
                                        return d;
                                      });
                                  const label = scheduleSummary || node.description || "Every Monday";
                                  return (
                                    <div className="rounded-md px-2 py-1 flex flex-col items-center gap-1.5">
                                      <span className="text-[12px] font-medium text-foreground truncate max-w-full">{label}</span>
                                      <div className="flex items-center gap-1">
                                        {runs.map((d, i) => (
                                          <span
                                            key={i}
                                            className="px-1.5 py-0.5 rounded text-[9px] font-medium tabular-nums border bg-background border-border/60 text-muted-foreground"
                                          >
                                            {d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })()}
                                {node.type === "dataset" && (
                                  <div className="h-12 flex items-center justify-start -space-x-2">
                                    {brands.map((b) => (
                                      <div key={b.initials} className="h-9 w-9 rounded-full ring-2 ring-card flex items-center justify-center text-[11px] font-bold text-white" style={{ background: b.bg }}>
                                        {b.initials}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {node.type === "review-dataset" && (
                                  <div className="h-12 flex items-center justify-start -space-x-2">
                                    {brands.map((b, idx) => (
                                      <div key={b.initials} className="relative">
                                        <div className="h-9 w-9 rounded-full ring-2 ring-card flex items-center justify-center text-[11px] font-bold text-white" style={{ background: b.bg }}>
                                          {b.initials}
                                        </div>
                                        {idx === brands.length - 1 && (
                                          <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-card ring-2 ring-card flex items-center justify-center">
                                            <Star className="h-2.5 w-2.5" fill="#00B67A" stroke="#00B67A" />
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {node.type === "top-select" && (
                                  topSelectConfig.mode === "manual-selection" ? (
                                    <div className="h-12 rounded-md border border-dashed border-primary/30 bg-primary/5 flex items-center justify-center gap-1.5">
                                      <MousePointerClick className="h-3.5 w-3.5 text-primary" />
                                      <span className="text-[11px] font-semibold text-primary">
                                        {topSelectConfig.manualCount ?? manualAdGen.count} hand-picked
                                      </span>
                                    </div>
                                  ) : isAllNew ? (
                                    <div className="h-12 rounded-md flex items-center justify-center gap-2">
                                      <span className="px-1.5 py-0.5 rounded bg-primary/15 text-primary text-[9px] font-bold uppercase tracking-wide">New</span>
                                      <span className="text-[12px] font-semibold">Since last run</span>
                                    </div>
                                  ) : (
                                    <div className="h-12 rounded-md flex items-center justify-center gap-1.5">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="h-7 w-5 rounded bg-primary/70" style={{ opacity: 1 - i * 0.15 }} />
                                      ))}
                                    </div>
                                  )
                                )}
                                {node.type === "product-data" && (
                                  selectedProductCount === 0 ? (
                                    <div className="h-12 rounded-lg border border-dashed border-border flex flex-col items-center justify-center gap-0.5">
                                      <Package className="h-3 w-3 text-muted-foreground" />
                                      <p className="text-[9px] text-muted-foreground">No products selected</p>
                                    </div>
                                  ) : (
                                    <div className="h-12 flex items-center justify-start -space-x-2">
                                      {Array.from({ length: productDisplay }).map((_, i) => (
                                        <img key={i} src={getOyImage(i)} alt="" className="h-9 w-9 aspect-square rounded-md object-cover ring-2 ring-card bg-muted" />
                                      ))}
                                    </div>
                                  )
                                )}
                                {node.type === "generate-concepts" && (
                                  <div className="h-12 rounded-md bg-muted/30 flex items-center justify-center">
                                    <div className="flex items-end gap-2 tabular-nums">
                                      <div className="flex flex-col items-center leading-none">
                                        <span className="text-[12px] font-semibold text-foreground">3</span>
                                        <span className="text-[7px] uppercase tracking-wide text-muted-foreground mt-0.5">prod</span>
                                      </div>
                                      <span className="text-muted-foreground text-[11px] leading-none pb-2">×</span>
                                      <div className="flex flex-col items-center leading-none">
                                        <span className="text-[12px] font-semibold text-foreground">5</span>
                                        <span className="text-[7px] uppercase tracking-wide text-muted-foreground mt-0.5">ads</span>
                                      </div>
                                      <span className="text-muted-foreground text-[11px] leading-none pb-2">×</span>
                                      <div className="flex flex-col items-center leading-none">
                                        <span className="text-[12px] font-semibold text-foreground">5</span>
                                        <span className="text-[7px] uppercase tracking-wide text-muted-foreground mt-0.5">var</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="px-3.5 py-1.5 border-t border-border/50 bg-muted/20 rounded-b-xl flex items-center justify-between">
                                <span className="text-[9px] uppercase tracking-wide text-muted-foreground font-medium">
                                  {node.type === "schedule" && "Next run"}
                                  {node.type === "dataset" && (manualAdGen.on ? "Manual" : "Matched")}
                                  {node.type === "top-select" && (topSelectConfig.mode === "manual-selection" ? "Manual" : "Picking")}
                                  {node.type === "product-data" && "Selected"}
                                  {node.type === "generate-concepts" && "Per run"}
                                </span>
                                <span className={cn("text-[11px] font-medium text-muted-foreground", node.type === "generate-concepts" && "font-semibold text-primary")}>
                                  {node.type === "schedule" && (nextRunDate
                                    ? nextRunDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
                                    : "—")}
                                  {node.type === "dataset" && (manualAdGen.on ? `${manualAdGen.count} ${isReviewsWorkflow ? "reviews" : "ads"}` : "641 ads")}
                                  {node.type === "top-select" && (topSelectConfig.mode === "manual-selection"
                                    ? `${topSelectConfig.manualCount ?? manualAdGen.count} ${isReviewsWorkflow ? "reviews" : "ads"}`
                                    : isAllNew ? "All new" : `Top ${topSelectConfig.count ?? 5}`)}
                                  {node.type === "product-data" && (selectedProductCount > 0 ? selectedProductCount : "—")}
                                  {node.type === "generate-concepts" && "~75 concepts"}
                                </span>
                              </div>
                            </div>
                          );
                        })()) : (
                        <p className="text-[10px] text-muted-foreground mt-1 leading-tight line-clamp-1">
                          {node.description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Manual image input node — custom body */}
                  {isManualInput && (
                    <div className="pl-3.5 pr-3 py-2.5">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="shrink-0 rounded-md p-1"
                          style={{ background: `hsl(${color} / 0.12)` }}
                        >
                          <Icon className="h-3.5 w-3.5" style={{ color: `hsl(${color})` }} />
                        </div>
                        <span className="text-xs font-bold truncate">{node.label}</span>
                        {manualImages.length > 0 && (
                          <Badge variant="outline" className="text-[9px] gap-0.5 px-1.5 py-0 ml-auto">
                            {manualImages.length}
                          </Badge>
                        )}
                      </div>
                      {/* Drop zone */}
                      <div
                        className={cn(
                          "rounded-lg border border-dashed flex flex-col items-center justify-center gap-0.5 py-2 cursor-pointer transition-colors",
                          nodeDragOver === node.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/40"
                        )}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setNodeDragOver(node.id); }}
                        onDragLeave={(e) => { e.stopPropagation(); setNodeDragOver(null); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setNodeDragOver(null);
                          addNodeImages(node.id, e.dataTransfer.files);
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          manualFileRef.current?.click();
                        }}
                      >
                        <Upload className="h-3 w-3 text-muted-foreground" />
                        <p className="text-[9px] text-muted-foreground">
                          Drop or <span className="text-primary font-medium">browse</span>
                        </p>
                        <p className="text-[8px] text-muted-foreground/50">PNG, JPG, WEBP</p>
                      </div>
                      {/* Thumbnails */}
                      {manualImages.length > 0 && (
                        <div className="grid grid-cols-4 gap-1 mt-2">
                          {manualImages.map((src, imgIdx) => (
                            <div key={imgIdx} className="relative group aspect-square rounded border border-border overflow-hidden bg-muted">
                              <img src={src} alt="" className="w-full h-full object-cover" />
                              <button
                                onClick={(e) => { e.stopPropagation(); removeNodeImage(node.id, imgIdx); }}
                                className="absolute top-0 right-0 h-3.5 w-3.5 rounded-bl bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-2 w-2" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <input
                        ref={manualFileRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) addNodeImages(node.id, e.target.files);
                          e.target.value = "";
                        }}
                      />
                    </div>
                  )}

                  {/* Input ports */}
                  {node.inputs.map((_, i) => {
                    const pos = getPortPos(node, "input", i, node.inputs.length, currentNodeH);
                    return (
                      <div
                        key={`in-${i}`}
                        className={`absolute w-4 h-4 rounded-full border-2 border-border bg-card hover:bg-primary hover:border-primary hover:scale-150 transition-all cursor-crosshair z-10 ${
                          connecting ? "ring-2 ring-primary/30 animate-pulse" : ""
                        }`}
                        style={{
                          left: -PORT_R - 2,
                          top: pos.y - node.y - PORT_R - 2,
                        }}
                        onMouseUp={(e) => finishConnection(e, node.id, i)}
                        onMouseDown={(e) => e.stopPropagation()}
                      />
                    );
                  })}

                  {/* Output ports */}
                  {node.outputs.map((_, i) => {
                    const pos = getPortPos(node, "output", i, node.outputs.length, currentNodeH);
                    return (
                      <div
                        key={`out-${i}`}
                        className="absolute w-4 h-4 rounded-full border-2 border-border bg-card hover:bg-primary hover:border-primary hover:scale-150 transition-all cursor-crosshair z-10"
                        style={{
                          left: NODE_W - PORT_R - 2,
                          top: pos.y - node.y - PORT_R - 2,
                        }}
                        onMouseDown={(e) => startConnection(e, node.id, i)}
                      />
                    );
                  })}
                </div>
              );

              if (activeTab === "editor" && needsConfig && warningTooltip) {
                return (
                  <Tooltip key={node.id} delayDuration={200}>
                    <TooltipTrigger asChild>
                      {nodeEl}
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[220px] text-xs">
                      {warningTooltip}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return nodeEl;
            });
            })()}
          </div>
        </div>

        {/* Zoom controls - bottom right */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1 bg-card border border-border rounded-lg p-1 shadow-sm">
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom((z) => clampZoom(z + 0.1))}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">Zoom in</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom((z) => clampZoom(z - 0.1))}>
                <Minus className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">Zoom out</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={fitToView}>
                <Maximize2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">Fit to view</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowGrid(!showGrid)}>
                <Grid3X3 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">{showGrid ? "Hide grid" : "Show grid"}</TooltipContent>
          </Tooltip>
        </div>

        {/* Zoom percentage - bottom left */}
        <div className="absolute bottom-4 left-4 z-20">
          <span className="text-[10px] font-mono text-muted-foreground bg-card/80 border border-border rounded px-1.5 py-0.5">
            {Math.round(zoom * 100)}%
          </span>
        </div>

      </div>
      <DatasetBuilderDrawer
        open={datasetDrawerOpen}
        onClose={() => setDatasetDrawerOpen(false)}
        initialEmpty={isNewCompetitor}
        onSourcesChange={(count) => setDatasetEmpty(count === 0)}
        onContinue={showContinueFor.has("dataset") ? () => { setDatasetDrawerOpen(false); openNextDrawerFor("dataset"); } : undefined}
        continueLabel={continueLabelFor("dataset")}
        onAdGenChange={handleAdGenChange}
      />
      <ReviewDatasetDrawer
        open={reviewDatasetDrawerOpen}
        onClose={() => setReviewDatasetDrawerOpen(false)}
        initialEmpty={isReviewsWorkflow}
        onSourcesChange={(count) => setReviewDatasetEmpty(count === 0)}
        onContinue={showContinueFor.has("review-dataset") ? () => { setReviewDatasetDrawerOpen(false); openNextDrawerFor("review-dataset"); } : undefined}
        continueLabel={continueLabelFor("review-dataset")}
        onAdGenChange={handleAdGenChange}
      />
      <DatasetRunResultsDrawer
        open={datasetRunResultsOpen}
        onClose={() => setDatasetRunResultsOpen(false)}
      />
      <ProductDataDrawer
        open={productDataDrawerOpen}
        onOpenChange={setProductDataDrawerOpen}
        onSelectionChange={setSelectedProductCount}
        initialEmpty={isAnyNew}
        onContinue={continueHandlerFor("product-data", () => setProductDataDrawerOpen(false))}
        continueLabel={continueLabelFor("product-data")}
      />
      <GenerateConceptsDrawer
        open={generateConceptsDrawerOpen}
        onOpenChange={setGenerateConceptsDrawerOpen}
        onContinue={
          editingFromSummary === "generate-concepts"
            ? () => { setGenerateConceptsDrawerOpen(false); returnToSummary(); }
            : showContinueFor.has("generate-concepts") && isNewCompetitor
              ? () => {
                  markConfigured("generate-concepts");
                  setGenerateConceptsDrawerOpen(false);
                  setTimeout(() => setSetupSummaryOpen(true), 200);
                }
              : continueHandlerFor("generate-concepts", () => setGenerateConceptsDrawerOpen(false))
        }
        continueLabel={
          editingFromSummary === "generate-concepts"
            ? "Back to summary"
            : showContinueFor.has("generate-concepts") && isNewCompetitor
              ? "Review setup"
              : continueLabelFor("generate-concepts")
        }
      />
      <NodeOutputDrawer
        open={outputDrawerOpen}
        onOpenChange={setOutputDrawerOpen}
        node={outputDrawerNode}
      />
      <ScheduleDrawer
        open={scheduleDrawerOpen}
        onOpenChange={setScheduleDrawerOpen}
        onScheduleChange={(summary, firstNextRun, runs) => {
          setScheduleSummary(summary);
          setNextRunDate(firstNextRun ?? null);
          setNextRuns(runs ?? []);
          setNodes((prev) =>
            prev.map((n) =>
              n.type === "schedule" ? { ...n, description: summary } : n
            )
          );
        }}
        onContinue={continueHandlerFor("schedule", () => setScheduleDrawerOpen(false))}
        continueLabel={continueLabelFor("schedule")}
      />
      <TopAdsSelectionDrawer
        open={topSelectDrawerOpen}
        onOpenChange={setTopSelectDrawerOpen}
        config={{ ...topSelectConfig, manualCount: manualAdGen.count }}
        onConfigChange={handleTopSelectChange}
        onContinue={continueHandlerFor("top-select", () => setTopSelectDrawerOpen(false))}
        continueLabel={continueLabelFor("top-select")}
        itemLabel={isReviewsWorkflow ? "reviews" : "ads"}
        manualSelectionAvailable={manualAdGen.on && manualAdGen.count > 0}
      />
      <ManualImageInputDrawer
        open={manualImageDrawerOpen}
        onOpenChange={setManualImageDrawerOpen}
        uploadedImages={uploadedImages}
        onContinue={continueHandlerFor("manual-image-input", () => setManualImageDrawerOpen(false))}
        continueLabel={continueLabelFor("manual-image-input")}
      />
      <AdAccountDrawer
        open={adAccountDrawerOpen}
        onOpenChange={setAdAccountDrawerOpen}
        onContinue={continueHandlerFor("ad-account", () => setAdAccountDrawerOpen(false))}
        continueLabel={continueLabelFor("ad-account")}
      />
      <RedditSubredditDrawer
        open={redditSubredditDrawerOpen}
        onOpenChange={setRedditSubredditDrawerOpen}
        onContinue={continueHandlerFor("reddit-subreddit", () => setRedditSubredditDrawerOpen(false))}
        continueLabel={continueLabelFor("reddit-subreddit")}
      />
      <RedditAdGeneratorDrawer
        open={redditAdGeneratorDrawerOpen}
        onOpenChange={setRedditAdGeneratorDrawerOpen}
        onContinue={continueHandlerFor("reddit-ad-generator", () => setRedditAdGeneratorDrawerOpen(false))}
        continueLabel={continueLabelFor("reddit-ad-generator")}
      />
      <RunOutputPanel
        open={runPanelOpen}
        onClose={() => setRunPanelOpen(false)}
        node={runOutputNode}
        runNumber={selectedRun?.number}
      />
      <SetupSummaryDrawer
        open={setupSummaryOpen}
        onOpenChange={setSetupSummaryOpen}
        workflowName={workflowNameOverride ?? agentName}
        onWorkflowNameChange={(n) => setWorkflowNameOverride(n)}
        rows={[
          ...(manualAdGen.on ? [] : [{
            key: "schedule",
            icon: "schedule" as const,
            label: "Schedule",
            value: scheduleSummary || "Not set — workflow will be manual",
            isMissing: !configuredTypes.has("schedule"),
            onEdit: () => editFromSummary("schedule", () => setScheduleDrawerOpen(true)),
          }]),
          {
            key: "source",
            icon: "source",
            label: isReviewsWorkflow ? "Source · Reviews" : "Source · Ad library",
            value: isReviewsWorkflow
              ? (reviewDatasetEmpty ? "No review sources selected" : "Trustpilot · 4 brands")
              : (datasetEmpty ? "No competitor brands selected" : "Nike Meta ads · 4 brands"),
            isMissing: isReviewsWorkflow ? reviewDatasetEmpty : datasetEmpty,
            onEdit: () => isReviewsWorkflow
              ? editFromSummary("review-dataset", () => setReviewDatasetDrawerOpen(true))
              : editFromSummary("dataset", () => setDatasetDrawerOpen(true)),
          },
          {
            key: "selection",
            icon: "selection",
            label: "Selection rule",
            value: manualAdGen.on
              ? `${manualAdGen.count} hand-picked ${isReviewsWorkflow ? "review" : "ad"}${manualAdGen.count === 1 ? "" : "s"}`
              : topSelectConfig.mode === "top-n"
                ? `Top ${topSelectConfig.count} ${isReviewsWorkflow ? "reviews by relevance" : "ads by new reach"}`
                : `All new ${isReviewsWorkflow ? "reviews" : "ads"} since last run`,
            isMissing: manualAdGen.on ? false : !configuredTypes.has("top-select"),
            onEdit: manualAdGen.on ? undefined : () => editFromSummary("top-select", () => setTopSelectDrawerOpen(true)),
          },
          {
            key: "products",
            icon: "products",
            label: "Products",
            value: selectedProductCount > 0
              ? `${selectedProductCount} product${selectedProductCount > 1 ? "s" : ""} selected`
              : "No products selected",
            isMissing: selectedProductCount === 0,
            onEdit: () => editFromSummary("product-data", () => setProductDataDrawerOpen(true)),
          },
          {
            key: "generate",
            icon: "generate",
            label: "Variations",
            value: configuredTypes.has("generate-concepts")
              ? "8 variations per product · on-brand"
              : "Not configured",
            isMissing: !configuredTypes.has("generate-concepts"),
            onEdit: () => editFromSummary("generate-concepts", () => setGenerateConceptsDrawerOpen(true)),
          },
        ]}
        variationsPerProduct={8}
        productCount={Math.max(selectedProductCount, 1)}
        selectionCount={manualAdGen.on ? manualAdGen.count : topSelectConfig.mode === "top-n" ? topSelectConfig.count : undefined}
        outputDestination={`Concepts gallery → "${workflowNameOverride ?? agentName}"`}
        mode={manualAdGen.on ? "manual" : configuredTypes.has("schedule") && scheduleSummary ? "scheduled" : "manual"}
        scheduleSummary={scheduleSummary}
        nextRunLabel={nextRunDate ? nextRunDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) : undefined}
        estimatedCredits={120}
        onSaveDraft={() => {
          setSetupSummaryOpen(false);
          toast.success("Saved as draft", { description: "You can finish this workflow later from the Workflows hub." });
          navigate("/workflows");
        }}
        onActivate={() => {
          setSetupSummaryOpen(false);
          fireConfetti();
          const mode = configuredTypes.has("schedule") && scheduleSummary ? "scheduled" : "manual";
          navigate("/workflows", {
            state: {
              justSetup: {
                id: id || "new-workflow",
                name: workflowNameOverride ?? agentName,
                mode,
                scheduleSummary,
                nextRunLabel: nextRunDate
                  ? nextRunDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
                  : null,
                productCount: selectedProductCount,
                variationsPerProduct: 8,
              },
            },
          });
        }}
        onRunNow={() => {
          setSetupSummaryOpen(false);
          runWorkflow();
        }}
      />
    </div>
  );
}
