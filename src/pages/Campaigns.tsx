import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Eye, Megaphone, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { HoverExplainer } from "@/components/HoverExplainer";

const campaigns = [
  { id: "1", name: "Summer Kickoff", workflow: "Weekly Ad Sprint", lastRun: "10 Feb 2026", status: "Completed", concepts: 12, statusColor: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { id: "2", name: "Valentine's Push", workflow: "Retail Ads", lastRun: "8 Feb 2026", status: "Running", concepts: 6, statusColor: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: "3", name: "Q1 Evergreen", workflow: "Standard Weekly Sprint", lastRun: "5 Feb 2026", status: "Completed", concepts: 18, statusColor: "bg-emerald-100 text-emerald-700 border-emerald-200" },
];

const templates = [
  { name: "Standard Weekly Sprint", desc: "Recommended — balanced approach", outputs: "10-15 concepts", inputs: "Brand knowledge, products, personas", runtime: "~2 hours", recommended: true, badge: "Recommended" },
  { name: "Weekly Ad Sprint", desc: "Fast iteration cycle", outputs: "8-12 concepts", inputs: "Brand knowledge, recent performance", runtime: "~1 hour", badge: "Popular" },
  { name: "Ads from Twitter Data", desc: "Mine trending topics for ad hooks", outputs: "5-8 concepts", inputs: "Twitter keywords, brand knowledge", runtime: "~90 min", badge: "New" },
  { name: "Retail Ads", desc: "Product-focused creatives", outputs: "12-20 concepts", inputs: "Product catalog, personas", runtime: "~2.5 hours" },
  { name: "Christmas Special", desc: "Seasonal holiday campaign", outputs: "10-15 concepts", inputs: "Brand knowledge, seasonal assets", runtime: "~2 hours" },
  { name: "Unspecified Ads", desc: "Open-ended exploration", outputs: "6-10 concepts", inputs: "Brand knowledge only", runtime: "~1 hour" },
];

const steps = ["Knowledge", "Insights / Agent", "Concepts"];

export default function Campaigns() {
  const nav = useNavigate();
  const [showNew, setShowNew] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [campaignName, setCampaignName] = useState("");
  const [activeSettingsStep, setActiveSettingsStep] = useState(0);

  const reset = () => { setShowNew(false); setStep(0); setSelectedTemplate(null); setCampaignName(""); setActiveSettingsStep(0); };

  return (
    <div className="space-y-6">
      <HoverExplainer text="Campaigns List: Shows all campaigns with status, workflow type, last run date, and concept count. Each campaign card navigates to its detail page. 'Start New Campaign' opens a 3-step modal: Choose Workflow → Name → Configure Settings. Backend: campaigns table (id, brand_id, name, workflow_id, status, created_at, last_run_at). Status: draft, running, completed, failed.">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground text-sm">Manage and launch creative campaigns.</p>
        </div>
        <Button size="sm" className="gap-1.5 gradient-primary text-white border-0 shadow-lg shadow-primary/25" onClick={() => setShowNew(true)}>
          <Plus className="h-4 w-4" /> Start New Campaign
        </Button>
      </div>

      </HoverExplainer>
      <div className="grid gap-3">
        {campaigns.map((c) => (
          <Card key={c.id} className="card-hover cursor-pointer group overflow-hidden" onClick={() => nav(`/campaigns/${c.id}`)}>
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${c.status === "Running" ? "bg-blue-500" : "bg-emerald-500"}`} />
            <CardContent className="flex items-center justify-between py-4 pl-5">
              <div className="flex items-center gap-4">
                <div className="icon-badge rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/5">
                  <Megaphone className="h-4 w-4 text-amber-600" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.workflow} · {c.lastRun} · {c.concepts} concepts
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {c.status === "Running" && <Zap className="h-4 w-4 text-blue-500 animate-pulse" />}
                <Badge variant="outline" className={`text-xs border ${c.statusColor}`}>{c.status}</Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"><Eye className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New campaign modal */}
      <Dialog open={showNew} onOpenChange={(o) => { if (!o) reset(); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{step === 0 ? "Choose a Workflow" : step === 1 ? "Name Your Campaign" : "Workflow Settings"}</DialogTitle>
          </DialogHeader>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-2">
            {["Choose Workflow", "Name", "Settings"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                {i > 0 && <div className={`h-px w-6 ${i <= step ? "bg-primary" : "bg-border"}`} />}
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${i <= step ? "gradient-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </div>
                <span className={`text-xs hidden sm:inline ${i === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {templates.map((t) => (
                <Card key={t.name} className={`cursor-pointer card-hover ${t.recommended ? "ring-2 ring-primary shadow-lg shadow-primary/10" : ""}`} onClick={() => { setSelectedTemplate(t.name); setStep(1); }}>
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">{t.name}</p>
                      {t.badge && <Badge className={`text-[10px] ${t.recommended ? "gradient-primary text-white border-0" : ""}`}>{t.badge}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                    <div className="text-xs space-y-1 text-muted-foreground pt-1 border-t">
                      <p><span className="font-medium text-foreground">Outputs:</span> {t.outputs}</p>
                      <p><span className="font-medium text-foreground">Inputs:</span> {t.inputs}</p>
                      <p><span className="font-medium text-foreground">Runtime:</span> {t.runtime}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Card className="cursor-pointer card-hover border-dashed flex items-center justify-center min-h-[120px]" onClick={() => { setSelectedTemplate("Custom"); setStep(1); }}>
                <CardContent className="text-center py-4">
                  <Plus className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                  <p className="font-semibold text-sm">Create Your Own</p>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Using: <span className="font-medium text-foreground">{selectedTemplate}</span></p>
              <div className="space-y-1.5">
                <Label>Campaign Name</Label>
                <Input value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="e.g. Spring Collection Launch" className="text-base" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                <Button onClick={() => setStep(2)} disabled={!campaignName.trim()}>Next</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex gap-6">
              <div className="w-48 space-y-1 shrink-0">
                {steps.map((s, i) => (
                  <button key={s} onClick={() => setActiveSettingsStep(i)} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${activeSettingsStep === i ? "bg-accent text-accent-foreground font-medium shadow-sm" : "text-muted-foreground hover:bg-muted"}`}>
                    <span className={`inline-flex h-5 w-5 rounded-full items-center justify-center text-[10px] mr-2 ${activeSettingsStep === i ? "gradient-primary text-white" : "bg-muted-foreground/10 text-muted-foreground"}`}>{i + 1}</span>
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex-1 space-y-4">
                {activeSettingsStep === 0 && (
                  <>
                    <h3 className="font-semibold">Knowledge Sources</h3>
                    <p className="text-sm text-muted-foreground">Toggle which data sources to include.</p>
                    {["Brand Knowledge", "Products", "Customer Personas", "Meta Performance Data", "Custom Keywords"].map((s) => (
                      <div key={s} className="flex items-center justify-between py-1"><span className="text-sm">{s}</span><Switch defaultChecked /></div>
                    ))}
                  </>
                )}
                {activeSettingsStep === 1 && (
                  <>
                    <h3 className="font-semibold">Insights / Agent Settings</h3>
                    <div className="space-y-1.5"><Label>Custom Prompt</Label><Input placeholder="Focus on competitor weaknesses..." /></div>
                    <div className="space-y-1.5"><Label>Requirements</Label><Input placeholder="Must include UGC-style concepts..." /></div>
                  </>
                )}
                {activeSettingsStep === 2 && (
                  <>
                    <h3 className="font-semibold">Concept Settings</h3>
                    <div className="space-y-1.5"><Label>Number of concepts per source</Label><Input type="number" defaultValue={3} /></div>
                    <div className="flex items-center justify-between"><span className="text-sm">Auto-iterate on rejected concepts</span><Switch /></div>
                  </>
                )}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button className="gradient-primary text-white border-0" onClick={() => { reset(); toast.success(`Campaign "${campaignName}" created!`); }}>
                    Save & Create Campaign
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
