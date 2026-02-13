import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings2, Play, Plus, Trash2, Zap, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const templates = [
  { name: "Weekly Ad Sprint", desc: "Fast iteration cycle for weekly creatives", outputs: "8-12 concepts", inputs: "Brand knowledge, recent performance", runtime: "~1 hour" },
  { name: "Ads from Twitter Data", desc: "Mine trending topics for ad hooks", outputs: "5-8 concepts", inputs: "Twitter keywords, brand knowledge", runtime: "~90 min" },
  { name: "Retail Ads", desc: "Product-focused creatives", outputs: "12-20 concepts", inputs: "Product catalog, personas", runtime: "~2.5 hours" },
  { name: "Christmas Special", desc: "Seasonal holiday campaign", outputs: "10-15 concepts", inputs: "Brand knowledge, seasonal assets", runtime: "~2 hours" },
  { name: "Unspecified Ads", desc: "Open-ended creative exploration", outputs: "6-10 concepts", inputs: "Brand knowledge only", runtime: "~1 hour" },
];

const runHistory = [
  { date: "Feb 10, 2026", workflow: "Weekly Ad Sprint", status: "Completed", duration: "58 min" },
  { date: "Feb 8, 2026", workflow: "Retail Ads", status: "Completed", duration: "2h 12min" },
  { date: "Feb 3, 2026", workflow: "Weekly Ad Sprint", status: "Completed", duration: "1h 05min" },
  { date: "Jan 27, 2026", workflow: "Weekly Ad Sprint", status: "Failed", duration: "32 min" },
];

const allSteps = ["Knowledge", "Insights / Agent", "Concepts", "Studio", "Calendar", "Learnings"];

export default function Workflows() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Workflows</h1>
        <p className="text-muted-foreground text-sm">Manage and customize your creative workflows.</p>
      </div>

      {/* Current workflow hero */}
      <Card className="overflow-hidden">
        <div className="gradient-primary p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wider">Current Workflow</p>
              <p className="text-2xl font-bold tracking-tight mt-1">Weekly Ad Sprint</p>
              <p className="text-sm text-white/80 mt-1">Fast iteration cycle · ~1 hour runtime</p>
            </div>
            <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => setShowCustomize(true)}>
              <Settings2 className="h-4 w-4" /> Customize
            </Button>
          </div>
        </div>
      </Card>

      {/* Templates */}
      <div>
        <h2 className="text-sm font-semibold mb-3 section-header">Or pick from templates</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Card key={t.name} className="cursor-pointer card-hover group" onClick={() => setSelectedTemplate(t.name)}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="icon-badge rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <p className="font-semibold text-sm">{t.name}</p>
                </div>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-1">
                  <span>{t.outputs}</span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{t.runtime}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Run history */}
      <Card>
        <CardHeader><CardTitle className="text-base section-header">Run History</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-0">
            {runHistory.map((r, i) => (
              <div key={i} className={`flex items-center justify-between py-3 border-b last:border-0 ${i % 2 === 0 ? "bg-muted/20" : ""} px-3 -mx-3 first:rounded-t-lg last:rounded-b-lg`}>
                <div className="flex items-center gap-3">
                  {r.status === "Completed" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{r.workflow}</p>
                    <p className="text-xs text-muted-foreground">{r.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{r.duration}</span>
                  <Badge variant="outline" className={`text-[10px] border ${r.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>{r.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Template detail popup */}
      <Dialog open={!!selectedTemplate} onOpenChange={(o) => !o && setSelectedTemplate(null)}>
        <DialogContent className="max-w-md">
          {selectedTemplate && (() => {
            const t = templates.find((t) => t.name === selectedTemplate)!;
            return (
              <>
                <DialogHeader><DialogTitle>{t.name}</DialogTitle></DialogHeader>
                <p className="text-sm text-muted-foreground">{t.desc}</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Outputs", value: t.outputs },
                    { label: "Inputs", value: t.inputs },
                    { label: "Runtime", value: t.runtime },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-medium mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 gap-1.5" onClick={() => { setSelectedTemplate(null); toast.success(`Switched to "${t.name}"`); }}>
                    <Play className="h-4 w-4" /> Use Template
                  </Button>
                  <Button variant="outline" className="flex-1 gap-1.5" onClick={() => { setSelectedTemplate(null); setShowCustomize(true); }}>
                    <Settings2 className="h-4 w-4" /> Customize
                  </Button>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* 6-step customize modal */}
      <Dialog open={showCustomize} onOpenChange={setShowCustomize}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Customize Workflow</DialogTitle></DialogHeader>
          <div className="flex gap-6">
            {/* Vertical stepper */}
            <div className="w-48 shrink-0 space-y-0">
              {allSteps.map((s, i) => (
                <div key={s} className="flex items-start gap-2">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setActiveStep(i)}
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${activeStep === i ? "gradient-primary text-white shadow-lg shadow-primary/25" : "bg-muted text-muted-foreground hover:bg-muted-foreground/10"}`}
                    >
                      {i + 1}
                    </button>
                    {i < allSteps.length - 1 && <div className={`w-0.5 h-6 ${i < activeStep ? "bg-primary/40" : "bg-border"}`} />}
                  </div>
                  <button onClick={() => setActiveStep(i)} className={`text-sm pt-1 text-left transition-colors ${activeStep === i ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {s}
                  </button>
                </div>
              ))}
              <div className="pt-3 space-y-1.5 ml-9">
                <Button variant="outline" size="sm" className="w-full gap-1"><Plus className="h-3 w-3" /> Add Step</Button>
                <Button variant="ghost" size="sm" className="w-full text-destructive gap-1"><Trash2 className="h-3 w-3" /> Remove</Button>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="font-semibold">{allSteps[activeStep]} Settings</h3>
              {activeStep === 0 && (
                <>
                  <p className="text-sm text-muted-foreground">Configure which knowledge sources to use.</p>
                  {["Brand Knowledge", "Products", "Personas", "Meta Data", "Keywords"].map((s) => (
                    <div key={s} className="flex items-center justify-between py-1"><span className="text-sm">{s}</span><Switch defaultChecked /></div>
                  ))}
                </>
              )}
              {activeStep === 1 && (
                <>
                  <div className="space-y-1.5"><Label>Custom Prompt</Label><Input placeholder="Focus on..." /></div>
                  <div className="space-y-1.5"><Label>Requirements</Label><Input placeholder="Must include..." /></div>
                </>
              )}
              {activeStep === 2 && (
                <>
                  <div className="space-y-1.5"><Label>Concepts per source</Label><Input type="number" defaultValue={3} /></div>
                  <div className="flex items-center justify-between"><span className="text-sm">Auto-iterate</span><Switch /></div>
                </>
              )}
              {activeStep === 3 && (
                <>
                  <p className="text-sm text-muted-foreground">Configure studio output formats.</p>
                  {["Feed (1080x1080)", "Story (1080x1920)", "Reels (1080x1920)"].map((f) => (
                    <div key={f} className="flex items-center justify-between"><span className="text-sm">{f}</span><Switch defaultChecked /></div>
                  ))}
                </>
              )}
              {activeStep === 4 && (
                <>
                  <p className="text-sm text-muted-foreground">Configure auto-scheduling rules.</p>
                  <div className="flex items-center justify-between"><span className="text-sm">Auto-schedule approved ads</span><Switch /></div>
                  <div className="space-y-1.5"><Label>Preferred posting days</Label><Input defaultValue="Mon, Wed, Fri" /></div>
                </>
              )}
              {activeStep === 5 && (
                <>
                  <p className="text-sm text-muted-foreground">Configure how learnings are captured.</p>
                  <div className="flex items-center justify-between"><span className="text-sm">Auto-generate learnings after 48h</span><Switch defaultChecked /></div>
                  <div className="flex items-center justify-between"><span className="text-sm">Feed learnings back to Knowledge</span><Switch defaultChecked /></div>
                </>
              )}
              <div className="pt-4 border-t">
                <Button className="gradient-primary text-white border-0" onClick={() => { setShowCustomize(false); toast.success("Workflow saved"); }}>Save Workflow</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
