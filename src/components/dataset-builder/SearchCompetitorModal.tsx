import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Competitor {
  id: string;
  name: string;
  avatar: string;
  url: string;
}

const MOCK_RESULTS: Competitor[] = [
  { id: "r1", name: "La Roche-Posay", avatar: "https://logo.clearbit.com/laroche-posay.com", url: "https://www.facebook.com/ads/library/?q=larocheposay" },
  { id: "r2", name: "Neutrogena", avatar: "https://logo.clearbit.com/neutrogena.com", url: "https://www.facebook.com/ads/library/?q=neutrogena" },
  { id: "r3", name: "Drunk Elephant", avatar: "https://logo.clearbit.com/drunkelephant.com", url: "https://www.facebook.com/ads/library/?q=drunkelephant" },
  { id: "r4", name: "Paula's Choice", avatar: "https://logo.clearbit.com/paulaschoice.com", url: "https://www.facebook.com/ads/library/?q=paulaschoice" },
  { id: "r5", name: "Tatcha", avatar: "https://logo.clearbit.com/tatcha.com", url: "https://www.facebook.com/ads/library/?q=tatcha" },
  { id: "r6", name: "Glow Recipe", avatar: "https://logo.clearbit.com/glowrecipe.com", url: "https://www.facebook.com/ads/library/?q=glowrecipe" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (competitor: { id: string; name: string; avatar: string; url: string }) => void;
  existingIds: string[];
}

export default function SearchCompetitorModal({ open, onOpenChange, onSelect, existingIds }: Props) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? MOCK_RESULTS.filter(r =>
        r.name.toLowerCase().includes(query.toLowerCase()) && !existingIds.includes(r.id)
      )
    : MOCK_RESULTS.filter(r => !existingIds.includes(r.id));

  const handleSelect = (comp: Competitor) => {
    onSelect(comp);
    setQuery("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) setQuery(""); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm">Search Competitor</DialogTitle>
          <p className="text-[11px] text-muted-foreground">Find competitors from the Meta Ad Library</p>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brand name…"
            className="h-8 text-xs pl-8"
            autoFocus
          />
        </div>

        <div className="max-h-[240px] overflow-y-auto -mx-1">
          {filtered.length === 0 ? (
            <p className="text-[11px] text-muted-foreground text-center py-6">No results found</p>
          ) : (
            filtered.map(comp => (
              <button
                key={comp.id}
                onClick={() => handleSelect(comp)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-muted transition-colors text-left"
              >
                <img
                  src={comp.avatar}
                  alt={comp.name}
                  className="h-5 w-5 rounded-full object-cover bg-muted shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <span className="text-xs font-medium truncate">{comp.name}</span>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
