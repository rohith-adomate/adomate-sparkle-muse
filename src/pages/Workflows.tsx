import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Settings2, Play, Plus, Trash2, Zap, Clock, CheckCircle2, XCircle,
  ArrowRight, Eye, Megaphone, ChevronLeft, Lightbulb, BarChart3, Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/* ── Data ── */

type WorkflowStatus = "Running" | "Completed" | "Failed" | "Draft";

interface ActiveWorkflow {
  id: string;
  name: string;
  template: string;
  status: WorkflowStatus;
  lastRun: string;
  concepts: number;
  impressions: string;
  roas: string;
}

const activeWorkflows: ActiveWorkflow[] = [
  { id: "1", name: "Summer Kickoff", template: "Weekly Ad Sprint", status: "Running", lastRun: "Feb 10, 2026", concepts: 12, impressions: "32K", roas: "5.2x" },
  { id: "2", name: "Valentine's Push", template: "Retail Ads", status: "Completed", lastRun: "Feb 8, 2026", concepts: 18, impressions: "28K", roas: "4.0x" },
  { id: "3", name: "Q1 Evergreen", template: "Standard Weekly Sprint", status: "Completed", lastRun: "Feb 5, 2026", concepts: 24, impressions: "45K", roas: "4.8x" },
];

const templates = [
  { name: "Standard Weekly Sprint", desc: "Balanced approach with full pipeline coverage", outputs: "10-15 concepts", inputs: "Brand knowledge, products, personas", runtime: "~2 hours", recommended: true, badge: "Recommended", gradient: "from-violet-500/20 to-indigo-500/10", icon: "🚀" },
  { name: "Weekly Ad Sprint", desc: "Fast iteration cycle for weekly creatives", outputs: "8-12 concepts", inputs: "Brand knowledge, recent performance", runtime: "~1 hour", badge: "Popular", gradient: "from-sky-500/20 to-blue-500/10", icon: "⚡" },
  { name: "Ads from Twitter Data", desc: "Mine trending topics for ad hooks", outputs: "5-8 concepts", inputs: "Twitter keywords, brand knowledge", runtime: "~90 min", badge: "New", gradient: "from-emerald-500/20 to-teal-500/10", icon: "🐦" },
  { name: "Retail Ads", desc: "Product-focused creatives for e-commerce", outputs: "12-20 concepts", inputs: "Product catalog, personas", runtime: "~2.5 hours", gradient: "from-amber-500/20 to-orange-500/10", icon: "🛍️" },
  { name: "Christmas Special", desc: "Seasonal holiday campaign creatives", outputs: "10-15 concepts", inputs: "Brand knowledge, seasonal assets", runtime: "~2 hours", gradient: "from-rose-500/20 to-pink-500/10", icon: "🎄" },
  { name: "Unspecified Ads", desc: "Open-ended creative exploration", outputs: "6-10 concepts", inputs: "Brand knowledge only", runtime: "~1 hour", gradient: "from-slate-500/20 to-gray-500/10", icon: "🎯" },
];

const allSteps = ["Knowledge", "Insights / Agent", "Concepts", "Studio", "Calendar", "Learnings"];

const runTimeline = [
  { step: "Knowledge Gathering", status: "done", duration: "12 min" },
  { step: "Insights Generation", status: "done", duration: "34 min" },
  { step: "Concept Creation", status: "done", duration: "48 min" },
];

const statusColors: Record<WorkflowStatus, string> = {
  Running: "bg-blue-100 text-blue-700 border-blue-200",
  Completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Failed: "bg-red-100 text-red-700 border-red-200",
  Draft: "bg-muted text-muted-foreground border-border",
};
const statusAccent: Record<WorkflowStatus, string> = {
  Running: "bg-blue-500",
  Completed: "bg-emerald-500",
  Failed: "bg-red-500",
  Draft: "bg-muted-foreground",
};

/* ── Component ── */

export default function Workflows() {
  // views: "list" | "detail" | "create-pick" | "create-customize"
  const [view, setView] = useState<"list" | "detail" | "create-pick" | "create-customize">("list");
  const [selectedWorkflow, setSelectedWorkflow] = useState<ActiveWorkflow | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [workflowName, setWorkflowName] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [showNameDialog, setShowNameDialog] = useState(false);

  const openDetail = (w: ActiveWorkflow) => { setSelectedWorkflow(w); setView("detail"); };
  const startCreate = () => { setView("create-pick"); setSelectedTemplate(null); setWorkflowName(""); setActiveStep(0); };
  const pickTemplate = (t: typeof templates[0]) => { setSelectedTemplate(t); setShowNameDialog(true); };
  const confirmName = () => { setShowNameDialog(false); setView("create-customize"); };
  const goBack = () => { setView("list"); setSelectedWorkflow(null); setSelectedTemplate(null); };

  /* ── LIST VIEW ── */
  if (view === "list") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Workflows</h1>
            <p className="text-muted-foreground text-sm">Manage, launch, and customize your creative workflows.</p>
          </div>
          <Button size="sm" className="gap-1.5 gradient-primary text-white border-0 shadow-lg shadow-primary/25" onClick={startCreate}>
            <Plus className="h-4 w-4" /> New Workflow
          </Button>
        </div>

        {/* Active workflows grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeWorkflows.map((w) => (
            <Card key={w.id} className="card-hover cursor-pointer group overflow-hidden relative" onClick={() => openDetail(w)}>
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusAccent[w.status]}`} />
              {/* Thumbnail */}
              <div className="h-32 overflow-hidden">
                <img src={`https://picsum.photos/seed/wf${w.id}/400/200`} alt={w.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{w.name}</p>
                  <Badge variant="outline" className={`text-[10px] border ${statusColors[w.status]}`}>{w.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{w.template} · {w.lastRun}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div><span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Concepts</span><span className="font-semibold">{w.concepts}</span></div>
                  <div><span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Impr.</span><span className="font-semibold">{w.impressions}</span></div>
                  <div><span className="text-muted-foreground block text-[10px] uppercase tracking-wider">ROAS</span><span className="font-semibold">{w.roas}</span></div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs h-7 px-2" onClick={(e) => { e.stopPropagation(); openDetail(w); }}>
                    <Eye className="h-3 w-3" /> View Details
                  </Button>
                  {w.status === "Running" && <Zap className="h-4 w-4 text-blue-500 animate-pulse" />}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* New workflow card */}
          <Card className="card-hover cursor-pointer border-dashed flex items-center justify-center min-h-[280px]" onClick={startCreate}>
            <CardContent className="text-center py-8">
              <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary/25">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <p className="font-semibold">Create New Workflow</p>
              <p className="text-xs text-muted-foreground mt-1">Pick a template and customize</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  /* ── DETAIL VIEW ── */
  if (view === "detail" && selectedWorkflow) {
    const w = selectedWorkflow;
    const isCompleted = w.status === "Completed";
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" className="gap-1.5 -ml-2" onClick={goBack}>
          <ChevronLeft className="h-4 w-4" /> Back to Workflows
        </Button>

        {/* Hero banner */}
        <div className="rounded-2xl overflow-hidden relative">
          <img src={`https://picsum.photos/seed/wfdetail${w.id}/1200/300`} alt={w.name} className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{w.name}</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{w.template} · Last run {w.lastRun}</p>
            </div>
            <div className="flex gap-2 items-center">
              <Badge variant="outline" className={`text-xs border ${statusColors[w.status]}`}>{w.status}</Badge>
              {isCompleted && <Button size="sm" className="gap-1.5"><Play className="h-4 w-4" /> Re-run</Button>}
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { setSelectedTemplate(templates.find(t => t.name === w.template) || templates[0]); setWorkflowName(w.name); setView("create-customize"); }}>
                <Settings2 className="h-4 w-4" /> Customize
              </Button>
            </div>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid gap-4 grid-cols-3">
          {[
            { label: "Concepts", value: String(w.concepts), icon: Lightbulb, color: "text-violet-600 bg-violet-100" },
            { label: "Impressions", value: w.impressions, icon: BarChart3, color: "text-sky-600 bg-sky-100" },
            { label: "ROAS", value: w.roas, icon: Sparkles, color: "text-emerald-600 bg-emerald-100" },
          ].map((k) => (
            <Card key={k.label} className="card-hover">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${k.color}`}>
                  <k.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{k.label}</p>
                  <p className="text-xl font-bold">{k.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Run Timeline */}
        <Card>
          <CardHeader><CardTitle className="text-base section-header">Run Timeline</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-0">
              {runTimeline.map((t, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center z-10">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    {i < runTimeline.length - 1 && <div className="w-0.5 flex-1 bg-emerald-200 my-1" />}
                  </div>
                  <div className="pb-6 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{t.step}</p>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{t.duration}</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-400" style={{ width: `${(parseInt(t.duration) / 48) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Template info */}
        <Card>
          <CardHeader><CardTitle className="text-base section-header">Template Settings</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Template", value: w.template },
                { label: "Outputs", value: templates.find(t => t.name === w.template)?.outputs || "—" },
                { label: "Runtime", value: templates.find(t => t.name === w.template)?.runtime || "—" },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-xl bg-muted/50">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-medium mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ── CREATE: PICK TEMPLATE ── */
  if (view === "create-pick") {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" className="gap-1.5 -ml-2" onClick={goBack}>
          <ChevronLeft className="h-4 w-4" /> Back to Workflows
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New Workflow</h1>
          <p className="text-muted-foreground text-sm">Pick a template to get started, then customize it to your needs.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Card
              key={t.name}
              className={`card-hover cursor-pointer group overflow-hidden relative ${t.recommended ? "ring-2 ring-primary shadow-lg shadow-primary/10" : ""}`}
              onClick={() => pickTemplate(t)}
            >
              {/* Gradient header */}
              <div className={`h-24 bg-gradient-to-br ${t.gradient} flex items-center justify-center relative`}>
                <span className="text-4xl">{t.icon}</span>
                {t.badge && (
                  <Badge className={`absolute top-2 right-2 text-[10px] ${t.recommended ? "gradient-primary text-white border-0" : ""}`}>{t.badge}</Badge>
                )}
              </div>
              <CardContent className="p-4 space-y-2">
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
                <div className="text-xs space-y-1 text-muted-foreground pt-2 border-t">
                  <p><span className="font-medium text-foreground">Outputs:</span> {t.outputs}</p>
                  <p><span className="font-medium text-foreground">Inputs:</span> {t.inputs}</p>
                  <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> {t.runtime}</p>
                </div>
                <div className="flex items-center justify-end pt-1">
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Custom */}
          <Card className="card-hover cursor-pointer border-dashed flex items-center justify-center min-h-[260px]" onClick={() => { setSelectedTemplate({ name: "Custom", desc: "Build from scratch", outputs: "Custom", inputs: "Custom", runtime: "Custom", gradient: "from-slate-500/20 to-gray-500/10", icon: "🔧" }); setShowNameDialog(true); }}>
            <CardContent className="text-center py-8">
              <Plus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="font-semibold text-sm">Build Your Own</p>
              <p className="text-xs text-muted-foreground mt-1">Start from scratch</p>
            </CardContent>
          </Card>
        </div>

        {/* Name dialog */}
        <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Name Your Workflow</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground">Using template: <span className="font-medium text-foreground">{selectedTemplate?.name}</span></p>
            <div className="space-y-1.5">
              <Label>Workflow Name</Label>
              <Input value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} placeholder="e.g. Spring Collection Launch" className="text-base" autoFocus />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowNameDialog(false)}>Cancel</Button>
              <Button onClick={confirmName} disabled={!workflowName.trim()} className="gradient-primary text-white border-0">Continue to Customize</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  /* ── CREATE: CUSTOMIZE ── */
  if (view === "create-customize" && selectedTemplate) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" className="gap-1.5 -ml-2" onClick={() => setView("create-pick")}>
          <ChevronLeft className="h-4 w-4" /> Back to Templates
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{workflowName || "New Workflow"}</h1>
            <p className="text-muted-foreground text-sm">Template: {selectedTemplate.name} · Customize each step below</p>
          </div>
          <Button className="gradient-primary text-white border-0 gap-1.5 shadow-lg shadow-primary/25" onClick={() => { goBack(); toast.success(`Workflow "${workflowName}" created!`); }}>
            <Play className="h-4 w-4" /> Save & Launch
          </Button>
        </div>

        <div className="flex gap-6">
          {/* Vertical stepper */}
          <div className="w-52 shrink-0 space-y-0">
            {allSteps.map((s, i) => (
              <div key={s} className="flex items-start gap-2.5">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setActiveStep(i)}
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${activeStep === i ? "gradient-primary text-white shadow-lg shadow-primary/25" : i < activeStep ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground hover:bg-muted-foreground/10"}`}
                  >
                    {i < activeStep ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </button>
                  {i < allSteps.length - 1 && <div className={`w-0.5 h-8 ${i < activeStep ? "bg-emerald-300" : "bg-border"}`} />}
                </div>
                <button onClick={() => setActiveStep(i)} className={`text-sm pt-1.5 text-left transition-colors ${activeStep === i ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {s}
                </button>
              </div>
            ))}
            <div className="pt-4 space-y-1.5 ml-10">
              <Button variant="outline" size="sm" className="w-full gap-1 text-xs"><Plus className="h-3 w-3" /> Add Step</Button>
              <Button variant="ghost" size="sm" className="w-full text-destructive gap-1 text-xs"><Trash2 className="h-3 w-3" /> Remove</Button>
            </div>
          </div>

          {/* Settings panel */}
          <Card className="flex-1">
            <CardContent className="p-6 space-y-5">
              <h3 className="font-semibold text-lg">{allSteps[activeStep]} Settings</h3>

              {activeStep === 0 && (
                <>
                  <p className="text-sm text-muted-foreground">Configure which knowledge sources to use.</p>
                  {["Brand Knowledge", "Products", "Customer Personas", "Meta Performance Data", "Custom Keywords"].map((s) => (
                    <div key={s} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="text-sm">{s}</span><Switch defaultChecked />
                    </div>
                  ))}
                </>
              )}
              {activeStep === 1 && (
                <>
                  <p className="text-sm text-muted-foreground">Configure agent behavior and prompts.</p>
                  <div className="space-y-1.5"><Label>Custom Prompt</Label><Input placeholder="Focus on competitor weaknesses..." /></div>
                  <div className="space-y-1.5"><Label>Requirements</Label><Input placeholder="Must include UGC-style concepts..." /></div>
                </>
              )}
              {activeStep === 2 && (
                <>
                  <p className="text-sm text-muted-foreground">Control concept generation settings.</p>
                  <div className="space-y-1.5"><Label>Concepts per source</Label><Input type="number" defaultValue={3} /></div>
                  <div className="flex items-center justify-between py-2"><span className="text-sm">Auto-iterate on rejected concepts</span><Switch /></div>
                </>
              )}
              {activeStep === 3 && (
                <>
                  <p className="text-sm text-muted-foreground">Configure studio output formats.</p>
                  {["Feed (1080×1080)", "Story (1080×1920)", "Reels (1080×1920)", "Landscape (1200×628)"].map((f) => (
                    <div key={f} className="flex items-center justify-between py-2 border-b last:border-0"><span className="text-sm">{f}</span><Switch defaultChecked /></div>
                  ))}
                </>
              )}
              {activeStep === 4 && (
                <>
                  <p className="text-sm text-muted-foreground">Configure auto-scheduling rules.</p>
                  <div className="flex items-center justify-between py-2"><span className="text-sm">Auto-schedule approved ads</span><Switch /></div>
                  <div className="space-y-1.5"><Label>Preferred posting days</Label><Input defaultValue="Mon, Wed, Fri" /></div>
                </>
              )}
              {activeStep === 5 && (
                <>
                  <p className="text-sm text-muted-foreground">Configure how learnings are captured.</p>
                  <div className="flex items-center justify-between py-2"><span className="text-sm">Auto-generate learnings after 48h</span><Switch defaultChecked /></div>
                  <div className="flex items-center justify-between py-2"><span className="text-sm">Feed learnings back to Knowledge</span><Switch defaultChecked /></div>
                </>
              )}

              {/* Step navigation */}
              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" size="sm" disabled={activeStep === 0} onClick={() => setActiveStep(activeStep - 1)}>Previous</Button>
                {activeStep < allSteps.length - 1 ? (
                  <Button size="sm" onClick={() => setActiveStep(activeStep + 1)}>Next Step <ArrowRight className="h-3 w-3 ml-1" /></Button>
                ) : (
                  <Button size="sm" className="gradient-primary text-white border-0" onClick={() => { goBack(); toast.success(`Workflow "${workflowName}" created!`); }}>
                    Save & Launch
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
