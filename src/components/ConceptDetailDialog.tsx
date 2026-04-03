import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, ChevronDown, Info, X, Download, Loader2, CheckCircle2, Copy, Check, Workflow, Play } from "lucide-react";
import type { AgentRun, Concept } from "@/data/conceptsData";
import { toast } from "sonner";

interface ContextImage {
  src: string;
  label: string;
}

interface ConceptDetailDialogProps {
  concept: Concept | null;
  run: AgentRun | null;
  runLabel: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onStatusChange: (id: string, status: "accepted" | "rejected" | "pending") => void;
  onNavigate: (dir: "prev" | "next") => void;
  getStatus: (id: string) => "pending" | "accepted" | "rejected";
  contextImages?: ContextImage[];
  prompt?: string;
  conceptIndex: number;
  totalConcepts: number;
}

export function ConceptDetailDialog({
  concept,
  run,
  runLabel,
  open,
  onOpenChange,
  onStatusChange,
  onNavigate,
  getStatus,
  contextImages,
  prompt,
  conceptIndex,
  totalConcepts,
}: ConceptDetailDialogProps) {
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleNavigate = useCallback((dir: "prev" | "next") => {
    onNavigate(dir);
  }, [onNavigate]);

  const isFirst = conceptIndex <= 0;
  const isLast = conceptIndex >= totalConcepts - 1;

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && !isFirst) handleNavigate("prev");
      if (e.key === "ArrowRight" && !isLast) handleNavigate("next");
      if (e.key === "Escape" && showInfoPanel) {
        e.stopPropagation();
        setShowInfoPanel(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, handleNavigate, showInfoPanel, isFirst, isLast]);

  if (!concept || !run) return null;

  const status = concept ? getStatus(concept.id) : "pending";

  return (
      {/* Nav arrows — rendered outside DialogContent via portal-level fixed positioning */}
      {!isFirst && (
        <div className="fixed left-4 top-1/2 -translate-y-1/2 z-[60]">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => { e.stopPropagation(); handleNavigate("prev"); }}
                className="h-10 w-10 rounded-full bg-white/90 shadow-lg hover:bg-white flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Previous concept (←)</TooltipContent>
          </Tooltip>
        </div>
      )}
      {!isLast && (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[60]">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => { e.stopPropagation(); handleNavigate("next"); }}
                className="h-10 w-10 rounded-full bg-white/90 shadow-lg hover:bg-white flex items-center justify-center transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Next concept (→)</TooltipContent>
          </Tooltip>
        </div>
      )}
      <DialogContent className="max-w-5xl w-[calc(100vw-8rem)] h-[90vh] max-h-[90vh] p-0 overflow-hidden rounded-xl border-0 gap-0 [&>button]:hidden" aria-label={concept.title} aria-describedby={undefined}>
        <div className="flex h-full relative">
          {/* FULL-WIDTH Image */}
          <div className={`relative bg-neutral-900 flex items-center justify-center overflow-hidden transition-all duration-300 ${showInfoPanel ? "w-[60%]" : "w-full"}`}>
            {/* Top overlay CTAs */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`h-9 w-9 rounded-full flex items-center justify-center transition-all ${
                      status === "accepted"
                        ? "bg-primary text-primary-foreground"
                        : "bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50 hover:text-white"
                    }`}
                    onClick={() => onStatusChange(concept.id, status === "accepted" ? "pending" : "accepted")}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Accept concept</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`h-9 w-9 rounded-full flex items-center justify-center transition-all ${
                      status === "rejected"
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50 hover:text-white"
                    }`}
                    onClick={() => onStatusChange(concept.id, status === "rejected" ? "pending" : "rejected")}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Reject concept</TooltipContent>
              </Tooltip>
              <div className="w-px h-5 bg-white/20" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const toastId = toast("Downloading full quality image…", {
                        icon: <Loader2 className="h-4 w-4 animate-spin" />,
                        duration: Infinity,
                      });
                      setTimeout(() => {
                        toast.success("Download successful", {
                          id: toastId,
                          icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
                          duration: 3000,
                        });
                      }, 3000);
                    }}
                    className="h-9 w-9 rounded-full flex items-center justify-center transition-all bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50 hover:text-white"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Download in full quality</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`h-9 w-9 rounded-full flex items-center justify-center transition-all ${
                      showInfoPanel
                        ? "bg-white text-neutral-900"
                        : "bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50 hover:text-white"
                    }`}
                    onClick={() => setShowInfoPanel(!showInfoPanel)}
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Concept details</TooltipContent>
              </Tooltip>
            </div>




            <img
              src={concept.img || `https://picsum.photos/seed/${concept.imgSeed}/800/800`}
              alt={concept.title}
              className="w-full h-full object-contain"
            />
          </div>

          {/* RIGHT — Info Panel (slides in) */}
          <div className={`flex flex-col bg-background overflow-y-auto transition-all duration-300 ${showInfoPanel ? "w-[40%]" : "w-0 overflow-hidden"}`}>
            <div className="min-w-[280px]">
              {/* Header with close */}
              <div className="px-5 py-4 flex items-center justify-between border-b border-border/50">
                <h3 className="text-sm font-medium text-foreground">Details</h3>
                <button
                  onClick={() => setShowInfoPanel(false)}
                  className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Details */}
              <div className="px-5 py-4 space-y-3">
                {run.workflowName && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Workflow</span>
                    <div
                      className="flex items-center gap-1.5 w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                      onClick={() => {
                        if (run.workflowId) {
                          window.location.href = `/workflows/${run.workflowId}`;
                        }
                      }}
                    >
                      <Workflow className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-medium text-foreground">{run.workflowName}</span>
                    </div>
                  </div>
                )}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Run</span>
                  <div
                    className="flex items-center gap-1.5 w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                    onClick={() => {
                      if (run.workflowId) {
                        window.location.href = `/workflows/${run.workflowId}?tab=runs&run=${run.id}`;
                      }
                    }}
                  >
                    <Play className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-medium text-foreground">{runLabel}</span>
                    <span className="text-muted-foreground/60 ml-auto">{run.time}</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border/50" />

              {/* How this was made */}
              <div className="px-5 py-4">
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center gap-1.5 w-full group/collapse">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">How this was made</span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform group-data-[state=open]/collapse:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-3 space-y-4">
                    {/* Context images */}
                    {contextImages && contextImages.length > 0 && (
                      <div>
                        <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Context images</span>
                        <div className="flex gap-2 mt-2">
                          {contextImages.map((img, i) => (
                            <div key={i} className="space-y-1">
                              <div className="h-16 w-16 rounded-lg border border-border overflow-hidden bg-muted">
                                <img src={img.src} alt={img.label} className="h-full w-full object-cover" />
                              </div>
                              <p className="text-[10px] text-muted-foreground text-center truncate w-16">{img.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Prompt */}
                    {prompt && (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Prompt</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(prompt);
                                  setCopied(true);
                                  setTimeout(() => setCopied(false), 2000);
                                }}
                                className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              >
                                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="left">{copied ? "Copied!" : "Copy prompt"}</TooltipContent>
                          </Tooltip>
                        </div>
                        <p className="text-[12px] text-muted-foreground leading-relaxed bg-muted/50 rounded-lg p-3 border border-border/50">
                          {prompt}
                        </p>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </div>



            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
