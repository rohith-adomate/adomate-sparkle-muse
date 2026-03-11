import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Trash2, Calendar as CalendarIcon, MoreVertical, Eye, Lightbulb, TreePine, Ghost, ShoppingCart, PartyPopper, Heart, Sparkles,
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
  { id: "custom", name: "Custom Event", description: "Create a custom event agent for any occasion or date.", icon: Sparkles, color: "text-primary bg-primary/5 border-primary/20" },
];

const competitorAgents = [
  { id: "visual-variations", name: "Visual Variations", description: "Recreates the same visual layout, but with your product and branding.", icon: Eye },
  { id: "strategy-variations", name: "Strategy Variations", description: "Creates new visuals using the same marketing message and angle.", icon: Lightbulb },
];

/* ── Component ── */

export default function Workflows() {
  const [agents, setAgents] = useState<Agent[]>(defaultAgents);
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

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
            {agents.map((agent) => (
              <Card key={agent.id} className="border border-border/60 cursor-pointer hover:shadow-md transition-shadow overflow-hidden" onClick={() => navigate(`/workflows/${agent.id}`)}>
                <div className={`h-1 w-full ${agent.type === "holiday" ? "bg-pink-400" : "bg-violet-400"}`} />
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">{agent.name}</p>
                      <Badge variant="outline" className={`text-[10px] ${agent.type === "holiday" ? "border-pink-200 text-pink-700 bg-pink-50" : "border-violet-200 text-violet-700 bg-violet-50"}`}>
                        {agent.type === "holiday" ? "EVENT" : "COMPETITOR"}
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
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteTarget(agent.id); }}>
                            <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete agent
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
                      <p>Next scheduled run for this agent</p>
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
          <h2 className="text-base font-semibold">Run History</h2>
          <p className="text-sm text-muted-foreground mt-1">No runs yet.</p>
          <Button variant="secondary" size="sm" className="mt-3">Run agent manually</Button>
        </CardContent>
      </Card>

      {/* ── Create Agent Modal ── */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
          <div className="px-6 pt-6 pb-4">
            <h2 className="text-lg font-semibold">Create agent</h2>
            <p className="text-sm text-muted-foreground mt-1">Choose an agent type to get started.</p>
          </div>

          <Tabs defaultValue="competitor" className="px-6 pb-6" orientation="vertical">
            <div className="flex gap-5">
              <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-1 shrink-0">
                <TabsTrigger value="competitor" className="justify-start w-full px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-md">Competitor</TabsTrigger>
                <TabsTrigger value="events" className="justify-start w-full px-4 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-md">Events</TabsTrigger>
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
              </div>
            </div>
          </Tabs>
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
