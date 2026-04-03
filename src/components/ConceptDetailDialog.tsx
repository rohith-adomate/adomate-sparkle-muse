import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, ChevronDown, Info, X, Download, Loader2, CheckCircle2, Copy, Check } from "lucide-react";
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
}: ConceptDetailDialogProps) {
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  const handleNavigate = useCallback((dir: "prev" | "next") => {
    onNavigate(dir);
  }, [onNavigate]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handleNavigate("prev");
      if (e.key === "ArrowRight") handleNavigate("next");
      if (e.key === "Escape" && showInfoPanel) {
        e.stopPropagation();
        setShowInfoPanel(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, handleNavigate, showInfoPanel]);

  if (!concept || !run) return null;

  const status = concept ? getStatus(concept.id) : "pending";

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) { setShowInfoPanel(false); } }}>
      <DialogContent className="max-w-5xl w-[calc(100vw-8rem)] h-[90vh] max-h-[90vh] p-0 overflow-hidden rounded-xl border-0 gap-0 [&>button]:hidden" aria-label={concept.title} aria-describedby={undefined}>
        {/* Nav arrows — outside modal visually */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => { e.stopPropagation(); handleNavigate("prev"); }}
              className="fixed left-4 top-1/2 -translate-y-1/2 z-[60] h-10 w-10 rounded-full bg-white/90 shadow-lg hover:bg-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Previous concept</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => { e.stopPropagation(); handleNavigate("next"); }}
              className="fixed right-4 top-1/2 -translate-y-1/2 z-[60] h-10 w-10 rounded-full bg-white/90 shadow-lg hover:bg-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">Next concept</TooltipContent>
        </Tooltip>
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
              <div className="px-5 py-4 space-y-2.5">
                {[
                  ["Concept", concept.title],
                  ["Campaign", concept.campaign],
                  ["Source", run.workflowName || concept.source],
                  ["Run", `${runLabel} · ${run.time}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="text-[13px] text-muted-foreground w-20 shrink-0">{label}</span>
                    <span className="text-[13px] text-foreground">{value}</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-border/50" />

              {/* How this was made */}
              <div className="px-5 py-4">
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center gap-1.5 w-full group/collapse">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">How this was made</span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform group-data-[state=open]/collapse:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-3 space-y-3">
                    <div>
                      <span className="text-[11px] text-muted-foreground">Angle</span>
                      <p className="text-[13px] text-foreground mt-0.5">
                        {concept.campaign} — {concept.source === "AI Studio" ? "Competitor analysis" : "Manual input"} positioning
                      </p>
                    </div>
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
