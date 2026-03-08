import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Pencil, Plus } from "lucide-react";

const admins = [
  { name: "Ankit Kumar", email: "ankit@adomate.com", company: "Whitespace" },
  { name: "Diego Goethals", email: "diego@adomate.com", company: "Whitespace" },
  { name: "Simon Logghe", email: "simon@adomate.com", company: "Whitespace" },
  { name: "Lucas Desard", email: "lucas@adomate.com", company: "Whitespace" },
];

export default function AdminAdmins() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Card className="border border-border/60">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold tracking-tight">Admins</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage admin users and their company assignment.</p>
        </CardContent>
      </Card>

      <Card className="border border-border/60">
        <CardContent className="p-5 flex justify-end">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add admin
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-border/60">
        <CardContent className="p-0">
          <div className="rounded-lg border border-border/60 overflow-hidden m-5">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-semibold text-foreground">Admin</TableHead>
                  <TableHead className="font-semibold text-foreground">Company</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((a) => (
                  <TableRow key={a.email}>
                    <TableCell>
                      <div className="font-medium">{a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.email}</div>
                    </TableCell>
                    <TableCell>{a.company}</TableCell>
                    <TableCell className="text-right">
                      <button className="text-primary hover:text-primary/80">
                        <Pencil className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
