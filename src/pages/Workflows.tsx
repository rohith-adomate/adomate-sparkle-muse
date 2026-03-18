import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Trash2, Calendar as CalendarIcon, MoreVertical, Eye, Lightbulb, TreePine, Ghost, ShoppingCart, PartyPopper, Heart, Sparkles, ChevronRight, Pencil, ImagePlus,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
    nextRun: "Dec 10, 2026",
  },
  {
    id: "holiday-2",
    name: "Black Friday Blitz",
    type: "holiday",
    description: "Automated deal-focused ads for Black Friday.",
    concepts: 8,
    enabled: true,
    nextRun: "Nov 15, 2026",
  },
  {
    id: "holiday-3",
    name: "Valentine's Day Specials",
    type: "holiday",
    description: "Romantic-themed creatives for Valentine's Day.",
    concepts: 6,
    enabled: true,
    nextRun: "Feb 1, 2027",
  },
  {
    id: "competitor-1",
    name: "Nike Ad Monitor",
    type: "competitor",
    description: "Weekly scan of Nike ads → generate on-brand variations.",
    concepts: 9,
    enabled: true,
    nextRun: "Mar 14, 2026",
  },
  {
    id: "competitor-2",
    name: "Adidas Creative Tracker",
    type: "competitor",
    description: "Monitor Adidas campaigns and produce counter-creatives.",
    concepts: 5,
    enabled: true,
    nextRun: "Mar 21, 2026",
  },
];

const eventAgents = [
  { id: "christmas", name: "Christmas", description: "Generate festive holiday creatives with seasonal themes and messaging.", icon: TreePine, color: "text-green-600 bg-green-50 border-green-200" },
  { id: "halloween", name: "Halloween", description: "Spooky-themed ads with dark aesthetics and Halloween visuals.", icon: Ghost, color: "text-orange-600 bg-orange-50 border-orange-200" },
  { id: "black-friday", name: "Black Friday", description: "Deal-focused creatives with urgency-driven messaging.", icon: ShoppingCart, color: "text-foreground bg-muted border-border" },
  { id: "valentines", name: "Valentine's Day", description: "Romantic-themed creatives for Valentine's Day campaigns.", icon: Heart, color: "text-pink-600 bg-pink-50 border-pink-200" },
  { id: "new-year", name: "New Year", description: "Fresh-start messaging and celebratory visuals for the new year.", icon: PartyPopper, color: "text-amber-600 bg-amber-50 border-amber-200" },
  { id: "custom", name: "Custom Season", description: "Create a custom seasonal workflow for any occasion or date.", icon: Sparkles, color: "text-primary bg-primary/5 border-primary/20" },
];

const competitorAgents = [
  { id: "visual-variations", name: "Visual Variations", description: "Takes top-performing competitor designs and rebuilds them with your brand assets.", icon: Eye },
  { id: "strategy-variations", name: "Strategy Variations", description: "Creates new visuals using a similar marketing message and angle.", icon: Lightbulb },
];

const manualAgents = [
  { id: "manual-image-input", name: "Manual Image Input", description: "Upload your own images at run time and generate ad variations from them. Cannot be scheduled.", icon: ImagePlus },
];

/* ── Component ── */

export default function Workflows() {
  const [agents, setAgents] = useState<Agent[]>(defaultAgents);
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<Agent | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const openCreate = () => {
    setShowCreateModal(true);
  };

  const handleSelectAgent = (type: AgentType, name: string, description: string) => {
    const newAgent: Agent = {
      id: crypto.randomUUID(),
      name,
      type,
      description,
      concepts: 6,
      enabled: true,
      nextRun: "Pending",
    };
    setAgents((prev) => [newAgent, ...prev]);
    setShowCreateModal(false);
    toast.success(`Workflow "${name}" created!`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setAgents((prev) => prev.filter((a) => a.id !== deleteTarget));
    toast.success("Workflow deleted");
    setDeleteTarget(null);
  };

  const toggleAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, enabled: !a.enabled, nextRun: !a.enabled ? "Pending" : "Not scheduled" } : a
      )
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground text-sm">Manage and customize your creative workflows.</p>
        </div>
        <Button variant="outline" onClick={openCreate}>Create workflow</Button>
      </div>

      {/* Your agents */}
      <Card className="border border-border/60">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold mb-4">Your workflows</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {agents.map((agent) => (
              <Card key={agent.id} className="border border-border/60 cursor-pointer hover:shadow-md transition-shadow overflow-hidden" onClick={() => navigate(`/workflows/${agent.id}`)}>
                <div className={`h-1 w-full ${agent.type === "holiday" ? "bg-pink-400" : "bg-violet-400"}`} /> 
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">{agent.name}</p>
                      <Badge variant="outline" className={`text-[10px] ${agent.type === "holiday" ? "border-pink-200 text-pink-700 bg-pink-50" : "border-violet-200 text-violet-700 bg-violet-50"}`}>
                        {agent.type === "holiday" ? "SEASONAL" : "COMPETITOR"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Switch checked={agent.enabled} onCheckedChange={() => toggleAgent(agent.id)} onClick={(e) => e.stopPropagation()} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditTarget(agent); setEditName(agent.name); setEditDescription(agent.description); }}>
                            <Pencil className="h-3.5 w-3.5 mr-2" /> Edit title
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteTarget(agent.id); }}>
                            <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete workflow
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{agent.description}</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="mt-3 rounded-md bg-muted/50 px-2.5 py-1.5 flex items-center gap-1.5 cursor-default">
                        <div className="relative shrink-0">
                          <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <span className="text-xs text-muted-foreground">{agent.nextRun}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Next scheduled run for this workflow</p>
                    </TooltipContent>
                  </Tooltip>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Run History */}
      <Card className="border border-border/60">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold mb-4">Run History</h2>
          <div className="divide-y divide-border/50">
            {[
              { id: "run-1", workflow: "Nike Ad Monitor", type: "competitor" as const, status: "completed" as const, concepts: 9, date: "Mar 12, 2026", time: "14:32", duration: "3m 12s" },
              { id: "run-2", workflow: "Christmas Campaign", type: "holiday" as const, status: "completed" as const, concepts: 12, date: "Mar 10, 2026", time: "09:15", duration: "4m 48s" },
              { id: "run-3", workflow: "Adidas Creative Tracker", type: "competitor" as const, status: "failed" as const, concepts: 0, date: "Mar 8, 2026", time: "11:05", duration: "1m 03s" },
            ].map((run) => (
              <div key={run.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${run.status === "completed" ? "bg-emerald-500" : "bg-red-500"}`} />
                  <span className="text-sm font-medium">{run.workflow}</span>
                  <span className="text-xs text-muted-foreground">{run.date} · {run.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{run.duration}</span>
                  {run.status === "completed" ? (
                    <span className="text-xs font-medium text-emerald-600">{run.concepts} concepts</span>
                  ) : (
                    <span className="text-xs font-medium text-red-600">Failed</span>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Create Agent Modal ── */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
          <div className="px-6 pt-6 pb-4">
             <h2 className="text-lg font-semibold">Create workflow</h2>
            <p className="text-sm text-muted-foreground mt-1">Choose a workflow type to get started.</p>
          </div>

          <Tabs defaultValue="competitor" className="px-6 pb-6" orientation="vertical">
            <div className="flex gap-5">
              <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-1 shrink-0">
                <TabsTrigger value="competitor" className="justify-start w-full px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-md">Competitor</TabsTrigger>
                <TabsTrigger value="events" className="justify-start w-full px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-md">Seasonal</TabsTrigger>
                <TabsTrigger value="manual" className="justify-start w-full px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-md">Manual</TabsTrigger>
              </TabsList>

              <div className="flex-1 min-w-0">
                <TabsContent value="competitor" className="mt-0">
                  <div className="grid grid-cols-2 gap-3">
                    {competitorAgents.map((agent) => {
                      const Icon = agent.icon;
                      return (
                        <Card
                          key={agent.id}
                          className="border border-border/60 cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all"
                          onClick={() => handleSelectAgent("competitor", agent.name, agent.description)}
                        >
                          <CardContent className="p-4 space-y-3">
                            <div className="h-10 w-10 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center">
                              <Icon className="h-5 w-5 text-violet-600" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-semibold text-sm">{agent.name}</p>
                              <p className="text-xs text-muted-foreground leading-relaxed">{agent.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="events" className="mt-0">
                  <div className="grid grid-cols-2 gap-3">
                    {eventAgents.map((agent) => {
                      const Icon = agent.icon;
                      const colorParts = agent.color.split(" ");
                      const textColor = colorParts[0];
                      const bgColor = colorParts[1];
                      const borderColor = colorParts[2];
                      return (
                        <Card
                          key={agent.id}
                          className="border border-border/60 cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all"
                          onClick={() => handleSelectAgent("holiday", agent.name, agent.description)}
                        >
                          <CardContent className="p-4 space-y-3">
                            <div className={`h-10 w-10 rounded-lg ${bgColor} border ${borderColor} flex items-center justify-center`}>
                              <Icon className={`h-5 w-5 ${textColor}`} />
                            </div>
                            <div className="space-y-1">
                              <p className="font-semibold text-sm">{agent.name}</p>
                              <p className="text-xs text-muted-foreground leading-relaxed">{agent.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="manual" className="mt-0">
                  <div className="grid grid-cols-2 gap-3">
                    {manualAgents.map((agent) => {
                      const Icon = agent.icon;
                      return (
                        <Card
                          key={agent.id}
                          className="border border-border/60 cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all"
                          onClick={() => handleSelectAgent("competitor", agent.name, agent.description)}
                        >
                          <CardContent className="p-4 space-y-3">
                            <div className="h-10 w-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                              <Icon className="h-5 w-5 text-amber-600" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-semibold text-sm">{agent.name}</p>
                              <p className="text-xs text-muted-foreground leading-relaxed">{agent.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete workflow</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this workflow? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Title/Description */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit workflow</DialogTitle>
            <DialogDescription>Update the title and description of this workflow.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={2} />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button onClick={() => {
              if (!editTarget) return;
              setAgents((prev) => prev.map((a) => a.id === editTarget.id ? { ...a, name: editName, description: editDescription } : a));
              toast.success("Workflow updated");
              setEditTarget(null);
            }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
