import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ThumbsUp, ThumbsDown, MessageSquare, ChevronLeft, ChevronRight, ChevronDown, Sparkles, Info, X, Download } from "lucide-react";
import type { AgentRun, Concept } from "@/data/conceptsData";
import { toast } from "sonner";

interface ConceptDetailDialogProps {
  concept: Concept | null;
  run: AgentRun | null;
  runLabel: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onStatusChange: (id: string, status: "accepted" | "rejected" | "pending") => void;
  onNavigate: (dir: "prev" | "next") => void;
  getStatus: (id: string) => "pending" | "accepted" | "rejected";
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
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [iteratePrompt, setIteratePrompt] = useState("");
  const [showIterate, setShowIterate] = useState(false);
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
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) { setShowFeedback(false); setShowIterate(false); setFeedback(""); setIteratePrompt(""); setShowInfoPanel(false); } }}>
      <DialogContent className="max-w-5xl w-[calc(100vw-2rem)] h-[90vh] max-h-[90vh] p-0 overflow-hidden rounded-xl border-0 gap-0 [&>button]:hidden" aria-label={concept.title} aria-describedby={undefined}>
        <div className="flex h-full relative">
          {/* FULL-WIDTH Image */}
          <div className={`relative bg-neutral-900 flex items-center justify-center overflow-hidden transition-all duration-300 ${showInfoPanel ? "w-[60%]" : "w-full"}`}>
            {/* Top overlay CTAs */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
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
              <div className="w-px h-5 bg-white/20" />
              <a
                href={concept.img || `https://picsum.photos/seed/${concept.imgSeed}/800/800`}
                download={`${concept.title}.jpg`}
                onClick={(e) => e.stopPropagation()}
                className="h-9 w-9 rounded-full flex items-center justify-center transition-all bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50 hover:text-white"
              >
                <Download className="h-4 w-4" />
              </a>
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
            </div>

            {/* Nav arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); handleNavigate("prev"); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-white/80" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNavigate("next"); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-white/80" />
            </button>

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

              <div className="h-px bg-border/50" />

              {/* Actions */}
              <div className="px-5 py-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => { setShowFeedback(!showFeedback); setShowIterate(false); }}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Feedback
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => { setShowIterate(!showIterate); setShowFeedback(false); }}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Generate Similar
                  </Button>
                </div>

                {showFeedback && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="What would you change about this concept?"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                    <div className="flex justify-end">
                      <Button size="sm" disabled={!feedback.trim()} onClick={() => {
                        toast.success("Feedback saved");
                        setFeedback("");
                        setShowFeedback(false);
                      }}>
                        Send Feedback
                      </Button>
                    </div>
                  </div>
                )}

                {showIterate && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Describe what to keep or change…"
                      value={iteratePrompt}
                      onChange={(e) => setIteratePrompt(e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                    <div className="flex items-center gap-2">
                      <Select defaultValue="3">
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 variant</SelectItem>
                          <SelectItem value="3">3 variants</SelectItem>
                          <SelectItem value="5">5 variants</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex-1" />
                      <Button size="sm" disabled={!iteratePrompt.trim()} onClick={() => {
                        toast.success("Generating similar concepts…");
                        setIteratePrompt("");
                        setShowIterate(false);
                        onOpenChange(false);
                      }}>
                        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                        Generate
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
