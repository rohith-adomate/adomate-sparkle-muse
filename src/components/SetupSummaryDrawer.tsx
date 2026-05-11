import { useState, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, Clock, Database, Package, Wand2, ImageIcon,
  Pencil, Check, X, ArrowRight, AlertCircle, FolderOpen,
} from "lucide-react";

export interface SummaryRow {
  key: string;
  icon: "schedule" | "source" | "selection" | "products" | "generate";
  label: string;
  value: string;
  isMissing?: boolean;
  onEdit?: () => void;
}

interface SetupSummaryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowName: string;
  onWorkflowNameChange: (name: string) => void;
  rows: SummaryRow[];
  variationsPerProduct: number;
  productCount: number;
  outputDestination: string;
  mode: "scheduled" | "manual";
  scheduleSummary?: string;
  nextRunLabel?: string;
  estimatedCredits?: number;
  onActivate: () => void;
  onSaveDraft: () => void;
  onRunNow?: () => void;
}

const iconMap = {
  schedule: Clock,
  source: Database,
  selection: Sparkles,
  products: Package,
  generate: Wand2,
};

export default function SetupSummaryDrawer({
  open,
  onOpenChange,
  workflowName,
  onWorkflowNameChange,
  rows,
  variationsPerProduct,
  productCount,
  outputDestination,
  mode,
  scheduleSummary,
  nextRunLabel,
  estimatedCredits,
  onActivate,
  onSaveDraft,
  onRunNow,
}: SetupSummaryDrawerProps) {
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(workflowName);

  useEffect(() => {
    setDraftName(workflowName);
  }, [workflowName]);

  const missing = rows.filter((r) => r.isMissing);
  const blocked = missing.length > 0;
  const totalVariations = variationsPerProduct * Math.max(productCount, 1);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[540px] sm:max-w-[540px] p-0 flex flex-col gap-0"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-border/60 bg-gradient-to-br from-primary/5 via-background to-background relative">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="h-3 w-3" /> Final step
          </div>
          <h2 className="text-[20px] font-semibold tracking-tight">
            You're almost there
          </h2>
          <p className="text-[13px] text-muted-foreground mt-1">
            Review your workflow setup and activate it.
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Workflow name */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Workflow name
            </p>
            {editingName ? (
              <div className="flex items-center gap-1.5">
                <Input
                  autoFocus
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  onBlur={() => {
                    onWorkflowNameChange(draftName.trim() || workflowName);
                    setEditingName(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onWorkflowNameChange(draftName.trim() || workflowName);
                      setEditingName(false);
                    }
                    if (e.key === "Escape") {
                      setDraftName(workflowName);
                      setEditingName(false);
                    }
                  }}
                  className="h-9 text-[14px] font-medium"
                />
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onWorkflowNameChange(draftName.trim() || workflowName);
                    setEditingName(false);
                  }}
                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditingName(true)}
                className="group flex items-center gap-2 text-left w-full"
              >
                <span className="text-[15px] font-medium">{workflowName}</span>
                <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>

          {/* What will happen */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              What will happen
            </p>
            <div className="border border-border/70 rounded-lg overflow-hidden bg-card">
              {rows.map((row, idx) => {
                const Icon = iconMap[row.icon];
                return (
                  <div
                    key={row.key}
                    className={`flex items-start gap-3 px-3.5 py-3 ${
                      idx < rows.length - 1 ? "border-b border-border/60" : ""
                    } ${row.isMissing ? "bg-destructive/5" : ""}`}
                  >
                    <div
                      className={`mt-0.5 h-7 w-7 rounded-md flex items-center justify-center shrink-0 ${
                        row.isMissing
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted text-foreground/70"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {row.label}
                      </p>
                      <p
                        className={`text-[13px] mt-0.5 truncate ${
                          row.isMissing
                            ? "text-destructive font-medium"
                            : "text-foreground"
                        }`}
                      >
                        {row.value}
                      </p>
                    </div>
                    {row.onEdit && (
                      <button
                        type="button"
                        onClick={row.onEdit}
                        className="text-[12px] font-medium text-primary hover:underline shrink-0 mt-1"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Output */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Where results land
            </p>
            <div className="flex items-center gap-3 px-3.5 py-3 border border-border/70 rounded-lg bg-card">
              <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FolderOpen className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium truncate">{outputDestination}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Each run drops a new batch you can review, edit, and ship.
                </p>
              </div>
            </div>
          </div>

          {/* Estimate */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
                  Estimate per run
                </p>
                <p className="text-[14px] font-semibold mt-0.5">
                  ~{totalVariations} variations
                  <span className="text-muted-foreground font-normal text-[12px]">
                    {" "}({variationsPerProduct} per product × {productCount} products)
                  </span>
                </p>
              </div>
              {estimatedCredits != null && (
                <Badge variant="outline" className="bg-background shrink-0">
                  ~{estimatedCredits} credits
                </Badge>
              )}
            </div>
          </div>

          {/* Mode panel */}
          <div
            className={`rounded-lg border px-4 py-3 ${
              mode === "scheduled"
                ? "border-emerald-200 bg-emerald-50/50"
                : "border-amber-200 bg-amber-50/40"
            }`}
          >
            <div className="flex items-start gap-3">
              {mode === "scheduled" ? (
                <Clock className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              ) : (
                <ImageIcon className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-[12px] font-semibold">
                  {mode === "scheduled" ? "Scheduled run mode" : "Manual run mode"}
                </p>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  {mode === "scheduled"
                    ? `Adomate will run this on its own — ${scheduleSummary || "weekly"}. First run ${nextRunLabel || "scheduled."}`
                    : "You'll trigger each run yourself from the workflow card. Nothing happens automatically."}
                </p>
              </div>
            </div>
          </div>

          {/* Blocked notice */}
          {blocked && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-destructive">
                  {missing.length} step{missing.length > 1 ? "s" : ""} still need attention
                </p>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  Finish {missing.map((m) => m.label.toLowerCase()).join(", ")} before activating.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/60 bg-muted/20 flex items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={onSaveDraft}>
            Save as draft
          </Button>
          <div className="flex items-center gap-2">
            {mode === "manual" && onRunNow && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRunNow}
                disabled={blocked}
              >
                Run now
              </Button>
            )}
            <Button
              size="sm"
              onClick={onActivate}
              disabled={blocked}
              className="gap-1.5"
            >
              {mode === "scheduled" ? "Activate workflow" : "Save & finish"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
