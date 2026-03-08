import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Search } from "lucide-react";

const companies = [
  { name: "Whitespace", created: "Mar 5, 2026", credits: 0 },
];

export default function AdminCredits() {
  const [search, setSearch] = useState("");
  const filtered = companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
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

      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-[10px] font-semibold">{filtered.length} COMPANIES</Badge>
        <span className="text-xs text-muted-foreground">Click headers to sort</span>
      </div>

      <div className="rounded-lg border border-border/60 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold text-primary cursor-pointer">Company</TableHead>
              <TableHead className="font-semibold text-primary cursor-pointer">Created</TableHead>
              <TableHead className="font-semibold text-primary cursor-pointer">Remaining credits</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.name}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.created}</TableCell>
                <TableCell className="text-primary font-bold">{c.credits}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
