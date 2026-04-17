import { useMemo, useState } from "react";
import { Plus, Search, MoreHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { oyAdImages } from "@/data/oyImages";
import { EditImageGPTModal } from "@/components/admin/EditImageGPTModal";
import { CreateImageGPTModal } from "@/components/admin/CreateImageGPTModal";

type Profile = {
  id: string;
  title: string;
  subtitle: string;
  tags?: string[];
  image: string;
  visualStyle: string;
  funnelStage: string;
  feasibility: string;
  industry: string;
};

const profiles: Profile[] = [
  { id: "1", title: "Oy Deo Wash Benefits", subtitle: "Infographic", tags: ["Probleem"], image: oyAdImages[0], visualStyle: "Infographic", funnelStage: "Awareness", feasibility: "Easy", industry: "Skincare" },
  { id: "2", title: "Oy Deo Wash Daily Status", subtitle: "Before / After", tags: ["Probleem", "Oplossing"], image: oyAdImages[1], visualStyle: "Lifestyle", funnelStage: "Consideration", feasibility: "Medium", industry: "Skincare" },
  { id: "3", title: "Oy Deo Wash Freshness Simple", subtitle: "Texture claim", image: oyAdImages[2], visualStyle: "Product close-up", funnelStage: "Awareness", feasibility: "Easy", industry: "Skincare" },
  { id: "4", title: "Oy Deo Wash Microbiome Balance", subtitle: "Skin science", tags: ["Educatief"], image: oyAdImages[3], visualStyle: "Educational", funnelStage: "Consideration", feasibility: "Hard", industry: "Skincare" },
  { id: "5", title: "Oy Deo Wash Success Story", subtitle: "Confidence story", image: oyAdImages[4], visualStyle: "Lifestyle", funnelStage: "Decision", feasibility: "Medium", industry: "Personal care" },
  { id: "6", title: "Oy Deo Wash Texture Transition", subtitle: "Usage demo", tags: ["Tiener"], image: oyAdImages[5], visualStyle: "Lifestyle", funnelStage: "Consideration", feasibility: "Medium", industry: "Skincare" },
  { id: "7", title: "Oy Face Wash Science In Jar", subtitle: "Zweetzorg uitgelegd", tags: ["Wetenschap"], image: oyAdImages[6], visualStyle: "Educational", funnelStage: "Consideration", feasibility: "Hard", industry: "Skincare" },
  { id: "8", title: "Oy Face Wash Sensitive Soft Clean", subtitle: "Hydratatie & bescherming", image: oyAdImages[7], visualStyle: "Product close-up", funnelStage: "Decision", feasibility: "Easy", industry: "Skincare" },
  { id: "9", title: "Oy Scalp Hair Wash Checklist", subtitle: "Klinische checklist", tags: ["Expert"], image: oyAdImages[8], visualStyle: "Infographic", funnelStage: "Consideration", feasibility: "Medium", industry: "Haircare" },
  { id: "10", title: "Oy Scalp Hair Wash Nature Story", subtitle: "96% natuurlijk", tags: ["Natuurlijk"], image: oyAdImages[9], visualStyle: "Lifestyle", funnelStage: "Awareness", feasibility: "Easy", industry: "Haircare" },
];

const visualStyles = ["Infographic", "Lifestyle", "Product close-up", "Educational"];
const funnelStages = ["Awareness", "Consideration", "Decision"];
const feasibilities = ["Easy", "Medium", "Hard"];
const industries = ["Skincare", "Haircare", "Personal care"];

export default function AdminImageGPTs() {
  const [query, setQuery] = useState("");
  const [vStyle, setVStyle] = useState<string>("");
  const [fStage, setFStage] = useState<string>("");
  const [feas, setFeas] = useState<string>("");
  const [ind, setInd] = useState<string>("");
  const [editing, setEditing] = useState<Profile | null>(null);

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      if (query && !p.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (vStyle && p.visualStyle !== vStyle) return false;
      if (fStage && p.funnelStage !== fStage) return false;
      if (feas && p.feasibility !== feas) return false;
      if (ind && p.industry !== ind) return false;
      return true;
    });
  }, [query, vStyle, fStage, feas, ind]);

  const clearFilters = () => {
    setQuery(""); setVStyle(""); setFStage(""); setFeas(""); setInd("");
  };

  const hasFilters = query || vStyle || fStage || feas || ind;

  return (
    <div className="p-4 md:p-6 w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">ImageGPTs</h1>
          <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">{filtered.length} SHOWN</Badge>
          <Badge variant="secondary" className="bg-muted text-muted-foreground">{profiles.length} TOTAL</Badge>
        </div>
        <Button className="rounded-xl shadow-sm">
          <Plus className="h-4 w-4" /> Add profile
        </Button>
      </div>
      <p className="text-muted-foreground mb-6">
        Build and manage reusable visual generation profiles.
      </p>

      {/* Filter bar */}
      <div className="bg-card border rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Library filters
          </span>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-muted-foreground">
              <X className="h-3.5 w-3.5" /> Clear filters
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
          <FilterSelect value={vStyle} onChange={setVStyle} placeholder="Visual styles" options={visualStyles} />
          <FilterSelect value={fStage} onChange={setFStage} placeholder="Funnel stages" options={funnelStages} />
          <FilterSelect value={feas} onChange={setFeas} placeholder="Design feasibility" options={feasibilities} />
          <FilterSelect value={ind} onChange={setInd} placeholder="Industry types" options={industries} />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((p) => (
          <ProfileCard key={p.id} profile={p} onClick={() => setEditing(p)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No profiles match your filters.
        </div>
      )}

      <EditImageGPTModal
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        profile={editing}
      />
    </div>
  );
}

function FilterSelect({
  value, onChange, placeholder, options,
}: { value: string; onChange: (v: string) => void; placeholder: string; options: string[] }) {
  return (
    <Select value={value || undefined} onValueChange={(v) => onChange(v === "__all" ? "" : v)}>
      <SelectTrigger className="rounded-xl">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__all">All {placeholder.toLowerCase()}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o} value={o}>{o}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ProfileCard({ profile, onClick }: { profile: Profile; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative aspect-[4/5] rounded-2xl overflow-hidden border bg-muted text-left",
        "shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5",
      )}
    >
      <img
        src={profile.image}
        alt={profile.title}
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
        loading="lazy"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Options */}
      <div
        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black flex items-center justify-center shadow-sm transition-all hover:opacity-90 hover:scale-105"
        onClick={(e) => e.stopPropagation()}
      >
        <MoreHorizontal className="h-4 w-4 text-white" />
      </div>

      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="font-semibold text-base leading-tight line-clamp-2">{profile.title}</h3>
      </div>
    </button>
  );
}
