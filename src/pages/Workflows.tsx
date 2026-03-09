import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Play, Settings2, Trash2, Zap, CheckCircle2, X, Calendar as CalendarIcon, Clock, Timer,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/* ── Types & Data ── */

type AgentType = "holiday" | "competitor";

interface Agent {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  concepts: number;
  enabled: boolean;
  nextRun: string;
}

const defaultAgents: Agent[] = [
  {
    id: "holiday-1",
    name: "Christmas Campaign",
    type: "holiday",
    description: "Generate festive creatives ahead of Christmas.",
    concepts: 12,
    enabled: true,
    nextRun: "Dec 10, 2026 · 9:00 AM",
  },
  {
    id: "holiday-2",
    name: "Black Friday Blitz",
    type: "holiday",
    description: "Automated deal-focused ads for Black Friday.",
    concepts: 8,
    enabled: true,
    nextRun: "Nov 15, 2026 · 8:00 AM",
  },
  {
    id: "holiday-3",
    name: "Valentine's Day Specials",
    type: "holiday",
    description: "Romantic-themed creatives for Valentine's Day.",
    concepts: 6,
    enabled: true,
    nextRun: "Feb 1, 2027 · 7:00 AM",
  },
  {
    id: "competitor-1",
    name: "Nike Ad Monitor",
    type: "competitor",
    description: "Weekly scan of Nike ads → generate on-brand variations.",
    concepts: 9,
    enabled: true,
    nextRun: "Mar 14, 2026 · 10:00 AM",
  },
  {
    id: "competitor-2",
    name: "Adidas Creative Tracker",
    type: "competitor",
    description: "Monitor Adidas campaigns and produce counter-creatives.",
    concepts: 5,
    enabled: true,
    nextRun: "Mar 21, 2026 · 6:00 PM",
  },
];

const stepLabels = ["Type", "Basics", "Settings", "More", "Review"];

/* ── Component ── */

export default function Workflows() {
  const [agents, setAgents] = useState<Agent[]>(defaultAgents);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  // Create agent form state
  const [agentType, setAgentType] = useState<AgentType | null>(null);
  const [enableAutomation, setEnableAutomation] = useState(true);
  const [holidayName, setHolidayName] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  const [leadTime, setLeadTime] = useState(14);
  const [competitorName, setCompetitorName] = useState("");
  const [conceptCount, setConceptCount] = useState(6);
  const [imageGptSets, setImageGptSets] = useState("");
  const [products, setProducts] = useState("");

  const resetForm = () => {
    setStep(0);
    setAgentType(null);
    setEnableAutomation(true);
    setHolidayName("");
    setHolidayDate("");
    setLeadTime(14);
    setCompetitorName("");
    setConceptCount(6);
    setImageGptSets("");
    setProducts("");
  };

  const openCreate = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const canContinue = () => {
    if (step === 0) return !!agentType;
    if (step === 1) {
      if (agentType === "holiday") return !!holidayName.trim();
      return !!competitorName.trim();
    }
    return true;
  };

  const handleCreate = () => {
    const name = agentType === "holiday" ? holidayName : competitorName;
    const desc = agentType === "holiday"
      ? `Fixed-date automation that generates new creatives ahead of ${holidayName}.`
      : `Mine ${competitorName} ads and generate new variations.`;
    const newAgent: Agent = {
      id: crypto.randomUUID(),
      name,
      type: agentType!,
      description: desc,
      concepts: conceptCount,
      enabled: enableAutomation,
      nextRun: enableAutomation ? "Pending" : "Not scheduled",
    };
    setAgents((prev) => [newAgent, ...prev]);
    setShowCreateModal(false);
    toast.success(`Agent "${name}" created!`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setAgents((prev) => prev.filter((a) => a.id !== deleteTarget));
    toast.success("Agent deleted");
    setDeleteTarget(null);
  };

  const toggleAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, enabled: !a.enabled, nextRun: !a.enabled ? "Pending" : "Not scheduled" } : a
      )
    );
  };

  const typeLabel = agentType === "holiday" ? "Holiday" : agentType === "competitor" ? "Competitor" : "";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground text-sm">Manage and customize your creative workflows.</p>
        </div>
        <Button variant="outline" onClick={openCreate}>Create agent</Button>
      </div>

      {/* Your agents */}
      <Card className="border border-border/60">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold mb-4">Your agents</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {agents.map((agent, idx) => (
              <Card key={agent.id} className="border border-border/60">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                        <Zap className="h-4 w-4 text-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm">{agent.name}</p>
                        <Badge variant="outline" className={`text-[10px] mt-1 ${agent.type === "holiday" ? "border-pink-200 text-pink-700 bg-pink-50" : "border-violet-200 text-violet-700 bg-violet-50"}`}>
                          {agent.type === "holiday" ? "HOLIDAY" : "COMPETITOR"}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1.5">{agent.description}</p>
                      </div>
                    </div>
                    <Switch checked={agent.enabled} onCheckedChange={() => toggleAgent(agent.id)} />
                  </div>

                  {/* ── Variant 1: Labeled inline with icon + "Next run:" prefix ── */}
                  {idx === 0 && (
                    <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
                      <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground">Next run:</span>
                      <span className="text-xs font-semibold text-foreground">{agent.nextRun}</span>
                    </div>
                  )}

                  {/* ── Variant 2: Full-width banner bar at bottom ── */}
                  {idx === 1 && (
                    <div className="rounded-md border border-border bg-muted/30 px-3 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Scheduled</span>
                      </div>
                      <span className="text-xs font-semibold text-foreground">{agent.nextRun}</span>
                    </div>
                  )}

                  {/* ── Variant 3: Badge-style pill ── */}
                  {idx === 2 && (
                    <div className="pt-1">
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-0 text-[11px] font-medium gap-1.5 px-2.5 py-1">
                        <Timer className="h-3 w-3" />
                        Next run · {agent.nextRun}
                      </Badge>
                    </div>
                  )}

                  {/* ── Variant 4: Two-line stacked date + time ── */}
                  {idx === 3 && (
                    <div className="flex items-center gap-3 pt-1">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Next scheduled run</p>
                        <p className="text-sm font-semibold text-foreground -mt-0.5">{agent.nextRun}</p>
                      </div>
                    </div>
                  )}

                  {/* ── Variant 5: Progress-bar style countdown feel ── */}
                  {idx === 4 && (
                    <div className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">Upcoming run</span>
                        <span className="text-[10px] text-muted-foreground">in ~12 days</span>
                      </div>
                      <p className="text-xs font-semibold text-foreground">{agent.nextRun}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-end pt-1">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Play className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Settings2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteTarget(agent.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Run History */}
      <Card className="border border-border/60">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold">Run History</h2>
          <p className="text-sm text-muted-foreground mt-1">No runs yet.</p>
          <Button variant="secondary" size="sm" className="mt-3">Run agent manually</Button>
        </CardContent>
      </Card>

      {/* ── Create Agent Modal ── */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <h2 className="text-lg font-semibold">
              {step === 0 ? "Create agent" : `Create ${typeLabel} agent`}
            </h2>
          </div>

          <div className="flex px-6 pb-6 pt-2 gap-8">
            {/* Vertical stepper */}
            <div className="shrink-0 space-y-0 pt-1">
              {stepLabels.map((label, i) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                        i < step
                          ? "bg-primary border-primary text-primary-foreground"
                          : i === step
                          ? "border-primary text-primary bg-background"
                          : "border-muted text-muted-foreground bg-background"
                      }`}
                    >
                      {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    {i < stepLabels.length - 1 && (
                      <div className={`w-0.5 h-6 ${i < step ? "bg-primary" : "bg-border"}`} />
                    )}
                  </div>
                  <span className={`text-sm pt-2 ${i === step ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Step content */}
            <div className="flex-1 min-h-[320px] flex flex-col">
              <div className="flex-1 space-y-5">
                {/* Step 1: Type */}
                {step === 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    <Card
                      className={`cursor-pointer border-2 transition-all ${agentType === "holiday" ? "border-primary" : "border-border hover:border-muted-foreground/30"}`}
                      onClick={() => setAgentType("holiday")}
                    >
                      <CardContent className="p-5 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">Holiday agent</span>
                          <Badge variant="outline" className="text-[10px] border-pink-200 text-pink-700 bg-pink-50">HOLIDAY</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Automate a fixed-date creative run ahead of a holiday.</p>
                      </CardContent>
                    </Card>
                    <Card
                      className={`cursor-pointer border-2 transition-all ${agentType === "competitor" ? "border-primary" : "border-border hover:border-muted-foreground/30"}`}
                      onClick={() => setAgentType("competitor")}
                    >
                      <CardContent className="p-5 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">Competitor agent</span>
                          <Badge variant="outline" className="text-[10px] border-violet-200 text-violet-700 bg-violet-50">COMPETITOR</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Mine competitor ads and generate new variations.</p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Step 2: Basics */}
                {step === 1 && (
                  <div className="space-y-5">
                    <Card className="border border-border/60">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">Enable automation</p>
                          <p className="text-xs text-muted-foreground">Enabled agents can run automatically.</p>
                        </div>
                        <Switch checked={enableAutomation} onCheckedChange={setEnableAutomation} />
                      </CardContent>
                    </Card>

                    {agentType === "holiday" ? (
                      <>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold">Holiday name</Label>
                          <Input value={holidayName} onChange={(e) => setHolidayName(e.target.value)} placeholder="e.g. Christmas, Black Friday" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-sm font-semibold">Holiday date</Label>
                            <Input type="date" value={holidayDate} onChange={(e) => setHolidayDate(e.target.value)} placeholder="Pick a date" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-sm font-semibold">Lead time (days)</Label>
                            <Input type="number" value={leadTime} onChange={(e) => setLeadTime(Number(e.target.value))} min={1} max={90} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-1.5">
                        <Label className="text-sm font-semibold">Competitor name</Label>
                        <Input value={competitorName} onChange={(e) => setCompetitorName(e.target.value)} placeholder="e.g. Nike, Adidas" />
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Settings */}
                {step === 2 && (
                  <div className="space-y-5">
                    <Card className="border border-border/60">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold">Concept count</span>
                          <span className="text-sm text-muted-foreground">{conceptCount} per product</span>
                        </div>
                        <Slider value={[conceptCount]} onValueChange={(v) => setConceptCount(v[0])} min={1} max={20} step={1} />
                      </CardContent>
                    </Card>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold">Image GPT sets</Label>
                      <Select value={imageGptSets} onValueChange={setImageGptSets}>
                        <SelectTrigger><SelectValue placeholder="Select one or more" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product-shots">Product Shots</SelectItem>
                          <SelectItem value="lifestyle">Lifestyle</SelectItem>
                          <SelectItem value="ugc">UGC Style</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold">Products</Label>
                      <Select value={products} onValueChange={setProducts}>
                        <SelectTrigger><SelectValue placeholder="Select one or more" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Products</SelectItem>
                          <SelectItem value="bestsellers">Bestsellers</SelectItem>
                          <SelectItem value="new-arrivals">New Arrivals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Step 4: More */}
                {step === 3 && (
                  <div className="space-y-5">
                    <p className="text-sm text-muted-foreground">Additional settings for fine-tuning your agent.</p>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">Auto-schedule approved ads</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">Feed learnings back to Knowledge</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">Auto-iterate on rejected concepts</span>
                      <Switch />
                    </div>
                  </div>
                )}

                {/* Step 5: Review */}
                {step === 4 && (
                  <div className="space-y-4">
                    <Card className="border border-border/60">
                      <CardContent className="p-4">
                        <p className="font-semibold">Review</p>
                        <p className="text-sm text-muted-foreground mt-0.5">Confirm your settings before creating the agent.</p>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-3">
                      <Card className="border border-border/60">
                        <CardContent className="p-4">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">NAME</p>
                          <p className="font-semibold text-sm mt-0.5">{agentType === "holiday" ? holidayName : competitorName}</p>
                        </CardContent>
                      </Card>
                      {agentType === "holiday" && (
                        <Card className="border border-border/60">
                          <CardContent className="p-4">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">DATE</p>
                            <p className="font-semibold text-sm mt-0.5">{holidayDate || "Not set"}</p>
                          </CardContent>
                        </Card>
                      )}
                      {agentType === "holiday" && (
                        <Card className="border border-border/60">
                          <CardContent className="p-4">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">LEAD TIME</p>
                            <p className="font-semibold text-sm mt-0.5">{leadTime} days</p>
                          </CardContent>
                        </Card>
                      )}
                      <Card className="border border-border/60">
                        <CardContent className="p-4">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">OUTPUT</p>
                          <p className="font-semibold text-sm mt-0.5">{conceptCount} variations</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer nav */}
              <div className="flex justify-end gap-3 pt-4 mt-auto">
                {step > 0 && (
                  <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>
                )}
                {step < 4 ? (
                  <Button
                    variant="secondary"
                    disabled={!canContinue()}
                    onClick={() => setStep(step + 1)}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={handleCreate}
                  >
                    Create
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete agent</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this agent? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
