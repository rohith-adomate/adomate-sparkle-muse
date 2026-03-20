import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, Info, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AdAccountDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MOCK_CAMPAIGNS = [
  { id: "c1", name: "Summer Sale 2026", status: "Active", budget: "$500/day", adSets: ["as1", "as2", "as3"] },
  { id: "c2", name: "Brand Awareness — Q1", status: "Active", budget: "$250/day", adSets: ["as4", "as5"] },
  { id: "c3", name: "Retargeting — Cart Abandoners", status: "Paused", budget: "$150/day", adSets: ["as6", "as7"] },
  { id: "c4", name: "Product Launch — Serum X", status: "Active", budget: "$800/day", adSets: ["as8", "as9", "as10"] },
];

const MOCK_AD_SETS: Record<string, { id: string; name: string; status: string; audience: string }> = {
  as1: { id: "as1", name: "Women 25-34 — Interest", status: "Active", audience: "Women 25-34" },
  as2: { id: "as2", name: "Lookalike — Top Purchasers", status: "Active", audience: "Lookalike 1%" },
  as3: { id: "as3", name: "Broad — US", status: "Paused", audience: "US 18-65" },
  as4: { id: "as4", name: "Cold — Video Viewers", status: "Active", audience: "Video Viewers 75%" },
  as5: { id: "as5", name: "Cold — Page Engagers", status: "Active", audience: "Page Engagers 30d" },
  as6: { id: "as6", name: "ATC Last 7 Days", status: "Active", audience: "Add to Cart 7d" },
  as7: { id: "as7", name: "ATC Last 30 Days", status: "Paused", audience: "Add to Cart 30d" },
  as8: { id: "as8", name: "Launch — Interest Stack", status: "Active", audience: "Skincare Interest" },
  as9: { id: "as9", name: "Launch — Lookalike", status: "Active", audience: "Lookalike 2%" },
  as10: { id: "as10", name: "Launch — Retarget", status: "Active", audience: "Website Visitors 14d" },
};

export default function AdAccountDrawer({ open, onOpenChange }: AdAccountDrawerProps) {
  const [allCampaigns, setAllCampaigns] = useState(true);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [allAdSets, setAllAdSets] = useState(true);
  const [selectedAdSets, setSelectedAdSets] = useState<string[]>([]);
  const [campaignSearch, setCampaignSearch] = useState("");
  const [adSetSearch, setAdSetSearch] = useState("");

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    if (!campaignSearch) return MOCK_CAMPAIGNS;
    return MOCK_CAMPAIGNS.filter((c) => c.name.toLowerCase().includes(campaignSearch.toLowerCase()));
  }, [campaignSearch]);

  // Available ad sets based on selected campaigns
  const availableAdSets = useMemo(() => {
    const campaignIds = allCampaigns ? MOCK_CAMPAIGNS.map((c) => c.id) : selectedCampaigns;
    const adSetIds = MOCK_CAMPAIGNS.filter((c) => campaignIds.includes(c.id)).flatMap((c) => c.adSets);
    return adSetIds.map((id) => MOCK_AD_SETS[id]).filter(Boolean);
  }, [allCampaigns, selectedCampaigns]);

  const filteredAdSets = useMemo(() => {
    if (!adSetSearch) return availableAdSets;
    return availableAdSets.filter((a) => a.name.toLowerCase().includes(adSetSearch.toLowerCase()));
  }, [availableAdSets, adSetSearch]);

  const toggleCampaign = (id: string) => {
    setSelectedCampaigns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleAdSet = (id: string) => {
    setSelectedAdSets((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // Summary text
  const campaignSummary = allCampaigns
    ? `All campaigns (${MOCK_CAMPAIGNS.length})`
    : `${selectedCampaigns.length} campaign${selectedCampaigns.length !== 1 ? "s" : ""} selected`;

  const adSetSummary = allAdSets
    ? `All ad sets (${availableAdSets.length})`
    : `${selectedAdSets.length} ad set${selectedAdSets.length !== 1 ? "s" : ""} selected`;

  if (!open) return null;

  return (
    <TooltipProvider>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Right-side drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50 bg-card border-l border-border shadow-2xl",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
        style={{ width: 380 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-sm font-bold">Ad Account</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Select campaigns and ad sets from your connected ad account.
            </p>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0" onClick={() => onOpenChange(false)}>
            <ChevronDown className="h-3.5 w-3.5 mr-1 rotate-[-90deg]" /> Close
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5" style={{ height: "calc(100% - 65px)" }}>
          {/* Summary card */}
          <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Selection Summary</p>
            <p className="text-xs">{campaignSummary}</p>
            <p className="text-xs text-muted-foreground">{adSetSummary}</p>
          </div>

          {/* Campaigns Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1 cursor-help">
                    Campaigns
                    <Info className="h-2.5 w-2.5" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[220px] text-[10px]">
                  Select which ad campaigns to pull creatives from. "All campaigns" includes any new campaigns added in the future.
                </TooltipContent>
              </Tooltip>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={allCampaigns}
                onCheckedChange={(v) => {
                  setAllCampaigns(!!v);
                  if (v) setSelectedCampaigns([]);
                }}
                className="h-3.5 w-3.5"
              />
              <span className="text-xs font-medium">All campaigns</span>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0">{MOCK_CAMPAIGNS.length}</Badge>
            </label>

            {!allCampaigns && (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    placeholder="Search campaigns…"
                    value={campaignSearch}
                    onChange={(e) => setCampaignSearch(e.target.value)}
                    className="h-7 text-xs pl-7"
                  />
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto rounded-md border border-border p-1.5">
                  {filteredCampaigns.map((campaign) => (
                    <label
                      key={campaign.id}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer transition-colors",
                        selectedCampaigns.includes(campaign.id) ? "bg-primary/5" : "hover:bg-muted/40"
                      )}
                    >
                      <Checkbox
                        checked={selectedCampaigns.includes(campaign.id)}
                        onCheckedChange={() => toggleCampaign(campaign.id)}
                        className="h-3.5 w-3.5"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">{campaign.name}</p>
                        <p className="text-[10px] text-muted-foreground">{campaign.status} · {campaign.budget}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Ad Sets Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1 cursor-help">
                    Ad Sets
                    <Info className="h-2.5 w-2.5" />
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[220px] text-[10px]">
                  Select which ad sets to include. "All ad sets" will automatically include any new ad sets added to the selected campaigns.
                </TooltipContent>
              </Tooltip>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={allAdSets}
                onCheckedChange={(v) => {
                  setAllAdSets(!!v);
                  if (v) setSelectedAdSets([]);
                }}
                className="h-3.5 w-3.5"
              />
              <span className="text-xs font-medium">All ad sets</span>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0">{availableAdSets.length}</Badge>
            </label>

            {!allAdSets && (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    placeholder="Search ad sets…"
                    value={adSetSearch}
                    onChange={(e) => setAdSetSearch(e.target.value)}
                    className="h-7 text-xs pl-7"
                  />
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto rounded-md border border-border p-1.5">
                  {filteredAdSets.map((adSet) => (
                    <label
                      key={adSet.id}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer transition-colors",
                        selectedAdSets.includes(adSet.id) ? "bg-primary/5" : "hover:bg-muted/40"
                      )}
                    >
                      <Checkbox
                        checked={selectedAdSets.includes(adSet.id)}
                        onCheckedChange={() => toggleAdSet(adSet.id)}
                        className="h-3.5 w-3.5"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">{adSet.name}</p>
                        <p className="text-[10px] text-muted-foreground">{adSet.status} · {adSet.audience}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
