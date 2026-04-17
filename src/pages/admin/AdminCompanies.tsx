import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Search, Plus, Check, MoreHorizontal } from "lucide-react";

const companies = [
  {
    name: "Brand",
    status: "DEMO",
    users: 6,
    brands: "Brand, Demo - Headlight",
    onboarded: true,
  },
];

export default function AdminCompanies() {
  return (
    <div className="min-h-full bg-muted/40 -m-6 p-6">
      <div className="space-y-4 max-w-6xl mx-auto">
        {/* Header card */}
        <Card className="border border-border/60 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Companies & brands</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage companies, brands, and user membership.
            </p>
          </CardContent>
        </Card>

        {/* Filter bar card */}
        <Card className="border border-border/60 shadow-sm rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by company name..." className="pl-9 h-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="demo">Demo</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button className="h-10 bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
              <Plus className="h-4 w-4" />
              Create company
            </Button>
          </CardContent>
        </Card>

        {/* Data table card */}
        <Card className="border border-border/60 shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/60">
                  <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wide">Company</TableHead>
                  <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wide">Status</TableHead>
                  <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wide">Users</TableHead>
                  <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wide">Brands</TableHead>
                  <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wide">Onboarded</TableHead>
                  <TableHead className="font-medium text-muted-foreground text-xs uppercase tracking-wide w-16">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((c) => (
                  <TableRow key={c.name} className="hover:bg-muted/40">
                    <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                    <TableCell className="text-sm text-foreground">{c.status}</TableCell>
                    <TableCell>
                      <button className="text-sky-600 underline underline-offset-2 hover:text-sky-700 text-sm">
                        {c.users}
                      </button>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">{c.brands}</TableCell>
                    <TableCell>
                      {c.onboarded && (
                        <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
