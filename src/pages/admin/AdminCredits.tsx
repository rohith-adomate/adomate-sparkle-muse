import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";

const companies = [
  { name: "Whitespace", created: "Mar 5, 2026", credits: 0 },
];

export default function AdminCredits() {
  const [search, setSearch] = useState("");
  const filtered = companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="border border-border/60">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Credits</h1>
              <p className="text-muted-foreground text-sm mt-1">View and manage company credit balances.</p>
            </div>
            <div className="relative w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search company..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-[10px] font-semibold">{filtered.length} COMPANIES</Badge>
            <span className="text-xs text-muted-foreground">Click headers to sort</span>
          </div>

          <div>
            <div className="grid grid-cols-3 px-4 py-2">
              <span className="text-sm font-medium text-primary cursor-pointer">Company</span>
              <span className="text-sm font-medium text-primary cursor-pointer">Created</span>
              <span className="text-sm font-medium text-primary cursor-pointer">Remaining credits</span>
            </div>
            {filtered.map((c) => (
              <div key={c.name} className="grid grid-cols-3 px-4 py-3 border-t border-border/40">
                <span className="text-sm font-medium">{c.name}</span>
                <span className="text-sm">{c.created}</span>
                <span className="text-sm font-bold text-primary">{c.credits}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
