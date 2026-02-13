import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Eye } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const campaigns = [
  { id: "1", name: "Summer Kickoff", workflow: "Weekly Ad Sprint", lastRun: "Feb 10, 2026", status: "Completed", concepts: 12 },
  { id: "2", name: "Valentine's Push", workflow: "Retail Ads", lastRun: "Feb 8, 2026", status: "Running", concepts: 6 },
  { id: "3", name: "Q1 Evergreen", workflow: "Standard Weekly Sprint", lastRun: "Feb 5, 2026", status: "Completed", concepts: 18 },
];

const templates = [
  { name: "Standard Weekly Sprint", desc: "Recommended — balanced approach", outputs: "10-15 concepts", inputs: "Brand knowledge, products, personas", runtime: "~2 hours", recommended: true },
  { name: "Weekly Ad Sprint", desc: "Fast iteration cycle", outputs: "8-12 concepts", inputs: "Brand knowledge, recent performance", runtime: "~1 hour" },
  { name: "Ads from Twitter Data", desc: "Mine trending topics for ad hooks", outputs: "5-8 concepts", inputs: "Twitter keywords, brand knowledge", runtime: "~90 min" },
  { name: "Retail Ads", desc: "Product-focused creatives", outputs: "12-20 concepts", inputs: "Product catalog, personas", runtime: "~2.5 hours" },
  { name: "Christmas Special", desc: "Seasonal holiday campaign", outputs: "10-15 concepts", inputs: "Brand knowledge, seasonal assets", runtime: "~2 hours" },
  { name: "Unspecified Ads", desc: "Open-ended exploration", outputs: "6-10 concepts", inputs: "Brand knowledge only", runtime: "~1 hour" },
];

const steps = ["Knowledge", "Insights / Agent", "Concepts"];

export default function Campaigns() {
  const nav = useNavigate();
  const [showNew, setShowNew] = useState(false);
  const [step, setStep] = useState(0); // 0=choose, 1=name, 2=settings
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [campaignName, setCampaignName] = useState("");
  const [activeSettingsStep, setActiveSettingsStep] = useState(0);

  const reset = () => { setShowNew(false); setStep(0); setSelectedTemplate(null); setCampaignName(""); setActiveSettingsStep(0); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground text-sm">Manage and launch creative campaigns.</p>
        </div>
        <Button size="sm" onClick={() => setShowNew(true)}><Plus className="h-4 w-4 mr-1" /> Start New Campaign</Button>
      </div>

      <div className="grid gap-4">
        {campaigns.map((c) => (
          <Card key={c.id} className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" onClick={() => nav(`/campaigns/${c.id}`)}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="space-y-1">
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">Workflow: {c.workflow} · Last run: {c.lastRun} · {c.concepts} concepts</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={c.status === "Running" ? "default" : "secondary"}>{c.status}</Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
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

          {step === 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {templates.map((t) => (
                <Card key={t.name} className={`cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all ${t.recommended ? "ring-2 ring-primary" : ""}`} onClick={() => { setSelectedTemplate(t.name); setStep(1); }}>
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">{t.name}</p>
                      {t.recommended && <Badge className="text-[10px]">Recommended</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                    <div className="text-xs space-y-0.5 text-muted-foreground">
                      <p>Outputs: {t.outputs}</p>
                      <p>Inputs: {t.inputs}</p>
                      <p>Runtime: {t.runtime}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Card className="cursor-pointer hover:ring-2 hover:ring-primary/20 border-dashed flex items-center justify-center min-h-[120px]" onClick={() => { setSelectedTemplate("Custom"); setStep(1); }}>
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
                <Input value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="e.g. Spring Collection Launch" />
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
                  <button key={s} onClick={() => setActiveSettingsStep(i)} className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeSettingsStep === i ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-muted"}`}>
                    Step {i + 1}: {s}
                  </button>
                ))}
              </div>
              <div className="flex-1 space-y-4">
                {activeSettingsStep === 0 && (
                  <>
                    <h3 className="font-semibold">Knowledge Sources</h3>
                    <p className="text-sm text-muted-foreground">Toggle which data sources to include in this campaign.</p>
                    {["Brand Knowledge", "Products", "Customer Personas", "Meta Performance Data", "Custom Keywords"].map((s) => (
                      <div key={s} className="flex items-center justify-between">
                        <span className="text-sm">{s}</span>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </>
                )}
                {activeSettingsStep === 1 && (
                  <>
                    <h3 className="font-semibold">Insights / Agent Settings</h3>
                    <div className="space-y-1.5">
                      <Label>Custom Prompt</Label>
                      <Input placeholder="Focus on competitor weaknesses…" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Requirements</Label>
                      <Input placeholder="Must include UGC-style concepts…" />
                    </div>
                  </>
                )}
                {activeSettingsStep === 2 && (
                  <>
                    <h3 className="font-semibold">Concept Settings</h3>
                    <div className="space-y-1.5">
                      <Label>Number of concepts per source</Label>
                      <Input type="number" defaultValue={3} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-iterate on rejected concepts</span>
                      <Switch />
                    </div>
                  </>
                )}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={reset}>Save & Create Campaign</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
