import { Pencil, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DraftWorkflow {
  id: string;
  name: string;
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
  lastEditedLabel: string;
}

export type UnfinishedBannerVariant = "neutral" | "primary" | "minimal";

interface UnfinishedWorkflowBannerProps {
  drafts: DraftWorkflow[];
  onContinue: (draftId: string) => void;
  onDismiss: (draftId: string) => void;
  onViewAllDrafts?: () => void;
  variant?: UnfinishedBannerVariant;
}

export function UnfinishedWorkflowBanner({
  drafts,
  onContinue,
  onDismiss,
  onViewAllDrafts,
  variant = "neutral",
}: UnfinishedWorkflowBannerProps) {
  if (!drafts || drafts.length === 0) return null;

  const draft = drafts[0];
  const hasMultiple = drafts.length > 1;

  if (variant === "neutral") {
    return (
      <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg px-4 py-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex items-center justify-center h-8 w-8 rounded-md shrink-0 bg-muted">
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }} className="uppercase text-muted-foreground">
              Pick up where you left off
            </p>
            <p style={{ fontSize: 14, fontWeight: 500 }} className="text-foreground truncate mt-0.5">{draft.name}</p>
            <p style={{ fontSize: 12 }} className="text-muted-foreground mt-0.5 truncate">
              Step {draft.currentStep} of {draft.totalSteps} — {draft.stepLabel} · Edited {draft.lastEditedLabel}
            </p>
            {hasMultiple && onViewAllDrafts && (
              <button type="button" onClick={onViewAllDrafts} style={{ fontSize: 12, fontWeight: 500 }} className="text-primary hover:underline mt-1">
                {drafts.length} drafts
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => onDismiss(draft.id)}>Dismiss</Button>
          <Button size="sm" onClick={() => onContinue(draft.id)}>Continue setup<ArrowRight className="h-3.5 w-3.5" /></Button>
        </div>
      </div>
    );
  }

  if (variant === "primary") {
    return (
      <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg px-4 py-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="min-w-0">
            <p style={{ fontSize: 14, fontWeight: 500 }} className="text-foreground truncate">{draft.name}</p>
            <p style={{ fontSize: 12 }} className="text-muted-foreground mt-0.5 truncate">
              Step {draft.currentStep} of {draft.totalSteps} — {draft.stepLabel} · Edited {draft.lastEditedLabel}
            </p>
            {hasMultiple && onViewAllDrafts && (
              <button type="button" onClick={onViewAllDrafts} style={{ fontSize: 12, fontWeight: 500 }} className="text-primary hover:underline mt-1">
                {drafts.length} drafts
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => onDismiss(draft.id)}>Dismiss</Button>
          <Button size="sm" onClick={() => onContinue(draft.id)}>Continue setup<ArrowRight className="h-3.5 w-3.5" /></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 bg-muted/40 border border-border rounded-lg px-4 py-2.5">
      <div className="flex items-center gap-2.5 min-w-0">
        <Sparkles className="h-4 w-4 text-muted-foreground shrink-0" />
        <p style={{ fontSize: 13 }} className="text-foreground truncate">
          <span className="text-muted-foreground">Pick up where you left off — </span>
          <span className="font-medium">{draft.name}</span>
          <span className="text-muted-foreground">{" · Step "}{draft.currentStep}/{draft.totalSteps} · {draft.lastEditedLabel}</span>
        </p>
        {hasMultiple && onViewAllDrafts && (
          <button type="button" onClick={onViewAllDrafts} style={{ fontSize: 12, fontWeight: 500 }} className="text-primary hover:underline shrink-0">
            {drafts.length} drafts
          </button>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => onDismiss(draft.id)}>Dismiss</Button>
        <Button size="sm" variant="outline" onClick={() => onContinue(draft.id)}>Continue<ArrowRight className="h-3.5 w-3.5" /></Button>
      </div>
    </div>
  );
}
