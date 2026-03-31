import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  LayoutTemplate, Pencil, ArrowLeft, Sparkles,
  BarChart3, Tags, FileSearch, Star, Brain,
  Database, Globe,
} from "lucide-react";
import { TEMPLATE_COLUMNS } from "./mockData";
import type { DatasetColumn } from "./types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddColumn: (col: DatasetColumn) => void;
}

type Path = "choose" | "templates" | "custom-step1" | "custom-step2" | "custom-step3";

const COLUMN_KINDS = [
  { kind: "metric" as const, label: "Metric", description: "Numerical measurement", icon: BarChart3 },
  { kind: "classification" as const, label: "Classification", description: "Categorize into groups", icon: Tags },
  { kind: "extraction" as const, label: "Extraction", description: "Pull specific data points", icon: FileSearch },
  { kind: "scoring" as const, label: "Scoring", description: "Rate on a scale", icon: Star },
  { kind: "ai-summary" as const, label: "AI Summary", description: "Natural language summary", icon: Brain },
];

const DATA_SOURCES = [
  { id: "ad-creative", label: "Ad Creative (Image/Video)", icon: Database },
  { id: "ad-copy", label: "Ad Copy (Headline + Body)", icon: FileSearch },
  { id: "landing-page", label: "Landing Page", icon: Globe },
  { id: "ad-metadata", label: "Ad Metadata (dates, status)", icon: BarChart3 },
];

export default function AddColumnModal({ open, onOpenChange, onAddColumn }: Props) {
  const [path, setPath] = useState<Path>("choose");
  const [selectedKind, setSelectedKind] = useState<DatasetColumn["columnKind"]>();
  const [selectedSource, setSelectedSource] = useState("ad-creative");
  const [logicType, setLogicType] = useState<"rule" | "ai">("ai");
  const [aiPrompt, setAiPrompt] = useState("");
  const [columnName, setColumnName] = useState("");
  const [columnDesc, setColumnDesc] = useState("");

  const reset = () => {
    setPath("choose");
    setSelectedKind(undefined);
    setSelectedSource("ad-creative");
    setLogicType("ai");
    setAiPrompt("");
    setColumnName("");
    setColumnDesc("");
  };

  const handleClose = (o: boolean) => {
    if (!o) reset();
    onOpenChange(o);
  };

  const handleTemplateAdd = (tpl: typeof TEMPLATE_COLUMNS[0]) => {
    onAddColumn({
      id: `col-${Date.now()}`,
      name: tpl.name,
      type: "ai",
      columnKind: tpl.columnKind,
      aiPrompt: tpl.aiPrompt,
      description: tpl.description,
      templateId: tpl.id,
    });
    handleClose(false);
  };

  const handleCustomSave = () => {
    onAddColumn({
      id: `col-${Date.now()}`,
      name: columnName || "Custom Column",
      type: "ai",
      columnKind: selectedKind,
      aiPrompt: logicType === "ai" ? aiPrompt : undefined,
      description: columnDesc,
    });
    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            {path !== "choose" && (
              <Button variant="ghost" size="icon" className="h-7 w-7 -ml-1" onClick={() => {
                if (path === "templates" || path === "custom-step1") setPath("choose");
                else if (path === "custom-step2") setPath("custom-step1");
                else if (path === "custom-step3") setPath("custom-step2");
              }}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            {path === "choose" && "Add Column"}
            {path === "templates" && "Pick from Templates"}
            {path === "custom-step1" && "Column Type"}
            {path === "custom-step2" && "Data Source & Logic"}
            {path === "custom-step3" && "Name & Save"}
          </DialogTitle>
        </DialogHeader>

        {/* Step 0: Choose path */}
        {path === "choose" && (
          <div className="grid grid-cols-2 gap-3 py-2">
            <button
              className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-accent/30 transition-all text-center group"
              onClick={() => setPath("templates")}
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <LayoutTemplate className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Pick from Templates</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Pre-built enrichment columns</p>
              </div>
            </button>
            <button
              className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-accent/30 transition-all text-center group"
              onClick={() => setPath("custom-step1")}
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Pencil className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Define Custom Column</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Create your own with AI or rules</p>
              </div>
            </button>
          </div>
        )}

        {/* Templates */}
        {path === "templates" && (
          <div className="space-y-2 py-1">
            {TEMPLATE_COLUMNS.map(tpl => (
              <button
                key={tpl.id}
                className="w-full flex items-start gap-3 p-3.5 rounded-lg border border-border hover:border-purple-300 hover:bg-purple-50/30 transition-all text-left"
                onClick={() => handleTemplateAdd(tpl)}
              >
                 <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                   <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{tpl.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{tpl.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Custom Step 1: Column Kind */}
        {path === "custom-step1" && (
          <div className="space-y-2 py-1">
            {COLUMN_KINDS.map(ck => {
              const Icon = ck.icon;
              return (
                <button
                  key={ck.kind}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                    selectedKind === ck.kind ? "border-primary bg-accent/30" : "border-border hover:border-primary/30 hover:bg-accent/20"
                  )}
                  onClick={() => { setSelectedKind(ck.kind); setPath("custom-step2"); }}
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{ck.label}</p>
                    <p className="text-[10px] text-muted-foreground">{ck.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Custom Step 2: Source + Logic */}
        {path === "custom-step2" && (
          <div className="space-y-4 py-1">
            <div>
              <p className="text-xs font-semibold mb-2">Data Source</p>
              <div className="grid grid-cols-2 gap-2">
                {DATA_SOURCES.map(ds => {
                  const Icon = ds.icon;
                  return (
                    <button
                      key={ds.id}
                      className={cn(
                        "flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs transition-all",
                        selectedSource === ds.id ? "border-primary bg-accent/30" : "border-border hover:border-primary/30"
                      )}
                      onClick={() => setSelectedSource(ds.id)}
                    >
                      <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="leading-tight">{ds.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-xs font-semibold mb-2">Logic</p>
              <div className="flex gap-2 mb-3">
                <button
                  className={cn("flex-1 py-2 rounded-lg border text-xs font-medium transition-all", logicType === "ai" ? "border-purple-300 bg-purple-50 text-purple-700" : "border-border hover:border-primary/30")}
                  onClick={() => setLogicType("ai")}
                >
                  <Sparkles className="h-3.5 w-3.5 inline mr-1" /> AI Prompt
                </button>
                <button
                  className={cn("flex-1 py-2 rounded-lg border text-xs font-medium transition-all", logicType === "rule" ? "border-blue-300 bg-blue-50 text-blue-700" : "border-border hover:border-primary/30")}
                  onClick={() => setLogicType("rule")}
                >
                  Rule-based
                </button>
              </div>
              {logicType === "ai" ? (
                <Textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe what this column should compute. E.g., 'Analyze the ad creative and classify the emotional tone as Positive, Neutral, or Negative.'"
                  className="text-xs min-h-[100px] resize-none"
                />
              ) : (
                <Textarea
                  placeholder="Define rule logic. E.g., 'IF days_online > 90 THEN High ELSE IF days_online > 30 THEN Medium ELSE Low'"
                  className="text-xs min-h-[100px] resize-none"
                />
              )}
            </div>

            <Button className="w-full" size="sm" onClick={() => setPath("custom-step3")}>
              Next
            </Button>
          </div>
        )}

        {/* Custom Step 3: Name & Save */}
        {path === "custom-step3" && (
          <div className="space-y-4 py-1">
            <div>
              <p className="text-xs font-semibold mb-1.5">Column Name</p>
              <Input value={columnName} onChange={(e) => setColumnName(e.target.value)} placeholder="e.g., Emotional Tone Score" className="h-9 text-sm" />
            </div>
            <div>
              <p className="text-xs font-semibold mb-1.5">Description (optional)</p>
              <Textarea value={columnDesc} onChange={(e) => setColumnDesc(e.target.value)} placeholder="What does this column capture?" className="text-xs min-h-[60px] resize-none" />
            </div>
            <Button className="w-full" onClick={handleCustomSave}>
              <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Add Column
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
