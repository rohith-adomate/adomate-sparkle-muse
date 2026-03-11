import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "@/components/ui/sidebar";
import {
  ArrowLeft, Play, Plus, Minus, Maximize2, Grid3X3,
  Package, Database,
  PanelLeftClose, PanelLeft, Trash2, Sparkles,
} from "lucide-react";
import ProductDataDrawer from "@/components/ProductDataDrawer";
import GenerateConceptsDrawer from "@/components/GenerateConceptsDrawer";
import NodeOutputDrawer from "@/components/NodeOutputDrawer";
import DatasetDrawer from "@/components/DatasetDrawer";

/* ── Types ── */

interface CanvasNode {
  id: string;
  type: string;
  category: "trigger" | "static-data" | "dynamic-data" | "ai" | "action";
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
    category: "static-data" as const,
    label: "DATA",
    items: [
      { type: "dataset", label: "Dataset", description: "Competitor ads dataset with filters.", icon: Database, inputs: [], outputs: ["Ads Data"] },
      { type: "product-data", label: "Product Data", description: "Fetch product catalog.", icon: Package, inputs: [], outputs: ["Products"] },
    ],
  },
  {
    category: "ai" as const,
    label: "AI",
    items: [
      { type: "generate-concepts", label: "Generate Ad Variations", description: "Generate ad variations with AI.", icon: Sparkles, inputs: ["Products", "Ads Data"], outputs: ["Variations"] },
    ],
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "static-data": "210 80% 55%",
  ai: "270 70% 60%",
  action: "25 95% 55%",
};

const NODE_W = 200;
const NODE_H = 72;
const PORT_R = 6;

/* ── Default nodes for demo ── */

function getDefaultNodes(agentName: string): CanvasNode[] {
  return [
    { id: "n1", type: "dataset", category: "static-data", label: "Dataset", description: "Competitor ads dataset with filters.", x: 100, y: 200, inputs: [], outputs: ["Ads Data"], status: "success" },
    { id: "n2b", type: "product-data", category: "static-data", label: "Product Data", description: "Fetch product catalog.", x: 100, y: 340, inputs: [], outputs: ["Products"], status: "success" },
    { id: "n5", type: "generate-concepts", category: "ai", label: "Generate Ad Variations", description: "Generate ad variations with AI.", x: 450, y: 260, inputs: ["Products", "Ads Data"], outputs: ["Variations"] },
  ];
}

const DEFAULT_EDGES: Edge[] = [
  { id: "e1", from: "n1", fromPort: 0, to: "n5", toPort: 1 },
  { id: "e6", from: "n2b", fromPort: 0, to: "n5", toPort: 0 },
];

/* ── Helpers ── */

function getPortPos(node: CanvasNode, side: "input" | "output", index: number, total: number) {
  const x = side === "input" ? node.x : node.x + NODE_W;
  const spacing = NODE_H / (total + 1);
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

  // Derive agent name from id
  const agentName = useMemo(() => {
    const names: Record<string, string> = {
      "holiday-1": "Christmas Campaign",
      "holiday-2": "Black Friday Blitz",
      "holiday-3": "Valentine's Day Specials",
      "competitor-1": "Nike Ad Monitor",
      "competitor-2": "Adidas Creative Tracker",
    };
    return names[id || ""] || "Workflow";
  }, [id]);

  const [nodes, setNodes] = useState<CanvasNode[]>(() => getDefaultNodes(agentName));
  const [edges, setEdges] = useState<Edge[]>(DEFAULT_EDGES);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [agentEnabled, setAgentEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<"editor" | "executions">("editor");

  // Canvas state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [showPicker, setShowPicker] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [datasetDrawerOpen, setDatasetDrawerOpen] = useState(false);
  const [productDataDrawerOpen, setProductDataDrawerOpen] = useState(false);
  const [generateConceptsDrawerOpen, setGenerateConceptsDrawerOpen] = useState(false);
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

  /* ── Can activate? Dataset node must exist ── */
  const canActivate = useMemo(() => {
    return nodes.some((n) => n.type === "dataset");
  }, [nodes]);
  

  /* ── Filtered catalog ── */
  const filteredCatalog = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return NODE_CATALOG;
    return NODE_CATALOG.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => item.label.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
      ),
    })).filter((g) => g.items.length > 0);
  }, [searchQuery]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] -m-6 bg-background">
      {/* ── Left Panel: Node Picker ── */}
      {showPicker && (
        <div className="w-60 border-r border-border bg-card flex flex-col shrink-0">
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
                    return (
                      <button
                        key={item.type}
                        className="w-full flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-muted/60 transition-colors"
                        onClick={() => addNode(item, group.category)}
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
                  })}
                </div>
              </div>
            ))}
          </div>
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
                onClick={() => setActiveTab("editor")}
              >
                Editor
              </button>
              <button
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                  activeTab === "executions"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setActiveTab("executions")}
              >
                Executions
              </button>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={agentEnabled}
                    onCheckedChange={(v) => { if (canActivate) setAgentEnabled(v); }}
                    disabled={!canActivate}
                    className={!canActivate ? "opacity-50 cursor-not-allowed" : ""}
                  />
                  <span className="text-xs text-muted-foreground">{agentEnabled ? "Active" : "Inactive"}</span>
                </div>
              </TooltipTrigger>
              {!canActivate && (
                <TooltipContent side="bottom" className="text-xs max-w-[200px]">
                  Add a Dataset node to activate this workflow.
                </TooltipContent>
              )}
            </Tooltip>
            <Button size="sm" className="h-8 gap-1.5 bg-success hover:bg-success/90 text-success-foreground">
              <Play className="h-3.5 w-3.5" /> Run
            </Button>
          </div>
        </div>

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
              {edges.map((edge) => {
                const fromNode = nodes.find((n) => n.id === edge.from);
                const toNode = nodes.find((n) => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                const fromPos = getPortPos(fromNode, "output", edge.fromPort, fromNode.outputs.length);
                const toPos = getPortPos(toNode, "input", edge.toPort, toNode.inputs.length);
                const path = cubicPath(fromPos.x, fromPos.y, toPos.x, toPos.y);
                const pathId = `path-${edge.id}`;
                return (
                  <g key={edge.id}>
                    {/* Invisible wide hitbox for clicking */}
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
                      strokeDasharray="6 4"
                      style={{ pointerEvents: "none" }}
                    />
                    <path id={pathId} d={path} fill="none" stroke="none" />
                    <circle r="3" fill="hsl(var(--primary))" opacity="0.6">
                      <animateMotion dur="2s" repeatCount="indefinite">
                        <mpath href={`#${pathId}`} />
                      </animateMotion>
                    </circle>
                  </g>
                );
              })}
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
            {nodes.map((node) => {
              const color = CATEGORY_COLORS[node.category];
              const isSelected = selectedNode === node.id;
              const catalogItem = NODE_CATALOG.flatMap((g) => g.items).find((i) => i.type === node.type);
              const Icon = catalogItem?.icon || Database;

              return (
                <div
                  key={node.id}
                  className={`absolute rounded-xl border bg-card shadow-sm transition-shadow ${
                    isSelected ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
                  }`}
                  style={{
                    left: node.x,
                    top: node.y,
                    width: NODE_W,
                  }}
                  onMouseDown={(e) => startNodeDrag(e, node.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node.id);
                    if (activeTab === "executions") {
                      setOutputDrawerNode({ label: node.label, type: node.type, status: node.status });
                      setOutputDrawerOpen(true);
                    } else {
                      if (node.type === "dataset") {
                        setDatasetDrawerOpen(true);
                      } else if (node.type === "product-data") {
                        setProductDataDrawerOpen(true);
                      } else if (node.type === "generate-concepts") {
                        setGenerateConceptsDrawerOpen(true);
                      }
                    }
                  }}
                >
                  {/* Left accent border */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
                    style={{ background: `hsl(${color})` }}
                  />

                  <div className="pl-3.5 pr-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="shrink-0 rounded-md p-1"
                        style={{ background: `hsl(${color} / 0.12)` }}
                      >
                        <Icon className="h-3.5 w-3.5" style={{ color: `hsl(${color})` }} />
                      </div>
                      <span className="text-xs font-bold truncate">{node.label}</span>
                      {node.status && (
                        <div className="ml-auto shrink-0">
                          <div
                            className={`h-2.5 w-2.5 rounded-full ${
                              node.status === "success"
                                ? "bg-success"
                                : node.status === "running"
                                ? "bg-primary animate-pulse"
                                : "bg-destructive"
                            }`}
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-tight line-clamp-1">
                      {node.description}
                    </p>
                  </div>

                  {/* Input ports */}
                  {node.inputs.map((_, i) => {
                    const pos = getPortPos(node, "input", i, node.inputs.length);
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
                    const pos = getPortPos(node, "output", i, node.outputs.length);
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
            })}
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

        {/* Delete hint */}
        {selectedNode && (
          <div className="absolute top-14 right-3 z-20">
            <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs text-destructive border-destructive/30 hover:bg-destructive/10" onClick={deleteSelected}>
              <Trash2 className="h-3 w-3" /> Delete
            </Button>
          </div>
        )}
      </div>
      <DatasetDrawer
        open={datasetDrawerOpen}
        onOpenChange={setDatasetDrawerOpen}
      />
      <ProductDataDrawer
        open={productDataDrawerOpen}
        onOpenChange={setProductDataDrawerOpen}
      />
      <GenerateConceptsDrawer
        open={generateConceptsDrawerOpen}
        onOpenChange={setGenerateConceptsDrawerOpen}
      />
      <NodeOutputDrawer
        open={outputDrawerOpen}
        onOpenChange={setOutputDrawerOpen}
        node={outputDrawerNode}
      />
    </div>
  );
}
