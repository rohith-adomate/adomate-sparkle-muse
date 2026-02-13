import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings2, Play, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

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
        <h1 className="text-2xl font-bold">Workflows</h1>
        <p className="text-muted-foreground text-sm">Manage and customize your creative workflows.</p>
      </div>

      {/* Current workflow */}
      <Card className="border-primary/30 bg-accent/30">
        <CardContent className="flex items-center justify-between py-4">
          <div>
            <p className="text-xs text-muted-foreground">Current Workflow</p>
            <p className="text-lg font-bold">Weekly Ad Sprint</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setShowCustomize(true)}>
            <Settings2 className="h-4 w-4 mr-1" /> Customize
          </Button>
        </CardContent>
      </Card>

      {/* Templates */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Or pick from templates</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Card key={t.name} className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" onClick={() => setSelectedTemplate(t.name)}>
              <CardContent className="p-4 space-y-2">
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Run history */}
      <Card>
        <CardHeader><CardTitle className="text-base">Run History</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {runHistory.map((r, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{r.workflow}</p>
                  <p className="text-xs text-muted-foreground">{r.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{r.duration}</span>
                  <Badge variant={r.status === "Completed" ? "secondary" : "destructive"} className="text-xs">{r.status}</Badge>
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
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground text-xs block">Outputs</span>{t.outputs}</div>
                  <div><span className="text-muted-foreground text-xs block">Inputs</span>{t.inputs}</div>
                  <div><span className="text-muted-foreground text-xs block">Runtime</span>{t.runtime}</div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1"><Play className="h-4 w-4 mr-1" /> Use Template</Button>
                  <Button variant="outline" className="flex-1" onClick={() => { setSelectedTemplate(null); setShowCustomize(true); }}>
                    <Settings2 className="h-4 w-4 mr-1" /> Customize
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
            <div className="w-48 space-y-1 shrink-0">
              {allSteps.map((s, i) => (
                <button key={s} onClick={() => setActiveStep(i)} className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeStep === i ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-muted"}`}>
                  Step {i + 1}: {s}
                </button>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-3 gap-1"><Plus className="h-3 w-3" /> Add Step</Button>
              <Button variant="ghost" size="sm" className="w-full text-destructive gap-1"><Trash2 className="h-3 w-3" /> Remove Step</Button>
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="font-semibold">{allSteps[activeStep]} Settings</h3>
              {activeStep === 0 && (
                <>
                  <p className="text-sm text-muted-foreground">Configure which knowledge sources to use.</p>
                  {["Brand Knowledge", "Products", "Personas", "Meta Data", "Keywords"].map((s) => (
                    <div key={s} className="flex items-center justify-between"><span className="text-sm">{s}</span><Switch defaultChecked /></div>
                  ))}
                </>
              )}
              {activeStep === 1 && (
                <>
                  <div className="space-y-1.5"><Label>Custom Prompt</Label><Input placeholder="Focus on…" /></div>
                  <div className="space-y-1.5"><Label>Requirements</Label><Input placeholder="Must include…" /></div>
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
                  {["Feed (1080×1080)", "Story (1080×1920)", "Reels (1080×1920)"].map((f) => (
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
                <Button onClick={() => setShowCustomize(false)}>Save Workflow</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
