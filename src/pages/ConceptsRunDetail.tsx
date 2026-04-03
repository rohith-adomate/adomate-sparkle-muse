import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, X, MessageSquare, Heart, Pencil, Workflow, Check, Package, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { agentRunsById, statusDot, statusBadge } from "@/data/conceptsData";
import type { Concept } from "@/data/conceptsData";
import oyProductDeoWashHavana from "@/assets/oy/oy-product-deo-wash-havana.png";

export default function ConceptsRunDetail() {
  const { runId } = useParams();
  const navigate = useNavigate();
  const run = runId ? agentRunsById[runId] : null;

  const [selected, setSelected] = useState<Concept | null>(null);
  const [swipeAnim, setSwipeAnim] = useState<"left" | "right" | null>(null);
  const [showIterate, setShowIterate] = useState(false);

  // Editable title state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(run?.label ?? "");
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const saveTitle = () => {
    if (editedTitle.trim()) {
      toast.success("Title updated");
    }
    setIsEditingTitle(false);
  };

  const updateStatus = (id: string, status: "accepted" | "rejected") => {
    setSwipeAnim(status === "accepted" ? "right" : "left");
    setTimeout(() => {
      setSelected(null);
      setSwipeAnim(null);
      setShowIterate(false);
      toast.success(status === "accepted" ? "💚 Concept accepted!" : "❌ Concept rejected");
    }, 400);
  };

  if (!run) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <p className="text-muted-foreground">Agent run not found.</p>
        <Button variant="outline" onClick={() => navigate("/concepts")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Concepts
        </Button>
      </div>
    );
  }

  // Group concepts into pairs of 2
  const conceptPairs: Concept[][] = [];
  for (let i = 0; i < run.concepts.length; i += 2) {
    conceptPairs.push(run.concepts.slice(i, i + 2));
  }

  // Show product card only for the first project
  const isFirstProject = runId === "ai-image-studio-1";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/concepts")} className="shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="space-y-1">
          {/* Editable title row */}
          <div className="flex items-center gap-2 group/title">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <Input
                  ref={titleInputRef}
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveTitle();
                    if (e.key === "Escape") { setEditedTitle(run.label); setIsEditingTitle(false); }
                  }}
                  className="text-2xl font-bold tracking-tight h-auto py-1 px-2.5 w-auto max-w-md rounded-full border"
                />
                <button
                  onClick={() => saveTitle()}
                  className="p-0.5 rounded hover:bg-accent text-primary"
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  onClick={() => { setEditedTitle(run.label); setIsEditingTitle(false); }}
                  className="p-0.5 rounded hover:bg-accent text-muted-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold tracking-tight">{editedTitle || run.label}</h1>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => { setEditedTitle(editedTitle || run.label); setIsEditingTitle(true); }}
                      className="opacity-0 group-hover/title:opacity-100 transition-opacity p-1 rounded-md hover:bg-accent"
                    >
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Edit title</TooltipContent>
                </Tooltip>
              </>
            )}
          </div>

          {/* Time + workflow badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{run.time} · {run.concepts.length} concepts generated</span>
            {run.workflowName && (
              <Badge
                variant="outline"
                className="text-xs bg-muted/50 text-muted-foreground border-border cursor-pointer hover:bg-muted transition-colors gap-1"
                onClick={(e) => { e.stopPropagation(); navigate(`/workflows/${run.workflowId}`); }}
              >
                <Workflow className="h-3 w-3" />
                {run.workflowName}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left: Product context card */}
        {isFirstProject && (
          <div className="w-[260px] shrink-0">
            <div className="rounded-xl border bg-card p-4 space-y-4 sticky top-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Product</span>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="h-32 w-32 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-center overflow-hidden p-2">
                  <img
                    src={oyProductDeoWashHavana}
                    alt="Deo Wash Havana"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="text-center space-y-0.5">
                  <p className="text-sm font-semibold text-foreground">Deo Wash Havana</p>
                  <p className="text-[11px] text-muted-foreground">Oy Care</p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Concepts</span>
                  <span className="font-medium">{run.concepts.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Accepted</span>
                  <span className="font-medium text-emerald-600">{run.concepts.filter(c => c.status === "accepted").length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-medium text-amber-600">{run.concepts.filter(c => c.status === "pending").length}</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs gap-1.5"
                onClick={() => navigate("/brand-data-room/products/prod-6")}
              >
                <ExternalLink className="h-3 w-3" />
                View in Data Room
              </Button>
            </div>
          </div>
        )}

        {/* Right: Concepts in rows of 2 */}
        <div className="flex-1 min-w-0 space-y-4">
          {conceptPairs.map((pair, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-2 gap-4">
              {pair.map((c) => (
                <Card
                  key={c.id}
                  className={`cursor-pointer overflow-hidden group hover:shadow-md transition-shadow ${c.status === "accepted" ? "ring-[3px] ring-emerald-400/70" : ""}`}
                  onClick={() => setSelected(c)}
                >
                  <CardContent className="p-0">
                    <div className="aspect-square relative overflow-hidden bg-muted">
                      <img
                        src={c.img || `https://picsum.photos/seed/${c.imgSeed}/400/400`}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>
