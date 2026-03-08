import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Settings, Users, Trash2, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const members = [
  { name: "Lucas Desard", email: "lucas@adomate.com", role: "Admin", access: "All brands" },
  { name: "Simon Logghe", email: "simon@adomate.com", role: "Admin", access: "All brands" },
  { name: "Diego Goethals", email: "diego@adomate.com", role: "Admin", access: "All brands" },
  { name: "Ankit Kumar", email: "ankit@adomate.com", role: "Admin", access: "All brands" },
];

const allowedBrands = ["Demo - Oy Care", "Demo - Headlight"];

interface WorkspaceSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WorkspaceSettingsModal({ open, onOpenChange }: WorkspaceSettingsModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [brands, setBrands] = useState<string[]>(allowedBrands);

  const removeBrand = (brand: string) => {
    setBrands(brands.filter(b => b !== brand));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5" />
            Workspace Settings
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-0 p-6 pt-4">
          {/* Sidebar */}
          <div className="w-56 shrink-0 pr-6">
            <p className="text-xs text-muted-foreground mb-2">Workspace</p>
            <button className="w-full flex items-center gap-2 rounded-lg bg-primary/10 text-primary px-3 py-2 text-sm font-medium">
              <Users className="h-4 w-4" />
              Team management
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-5">
            {/* Header card */}
            <Card className="border border-border/60">
              <CardContent className="p-5">
                <p className="font-semibold">Team management</p>
                <p className="text-sm text-muted-foreground">Invite and manage users for <strong>Whitespace</strong>.</p>
              </CardContent>
            </Card>

            {/* Invite card */}
            <Card className="border border-border/60">
              <CardContent className="p-5 space-y-4">
                <p className="font-semibold">Invite a user</p>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1.5">Email</p>
                    <Input
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="w-36">
                    <p className="text-sm font-medium mb-1.5">Role</p>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Members can work in assigned brands but cannot manage members.</p>

                <div>
                  <p className="text-sm font-medium mb-1.5">Allowed brands</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {brands.map((brand) => (
                      <Badge key={brand} variant="secondary" className="gap-1 pr-1">
                        {brand}
                        <button onClick={() => removeBrand(brand)} className="ml-0.5 hover:text-foreground">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    <Select>
                      <SelectTrigger className="w-36 h-8 text-xs">
                        <SelectValue placeholder="Select brands" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="demo-new">Demo - New Brand</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button size="sm">Send invite</Button>
              </CardContent>
            </Card>

            {/* Pending invites */}
            <Card className="border border-border/60">
              <CardContent className="p-5">
                <p className="font-semibold mb-3">Pending & past invites</p>
                <div className="rounded-lg border border-border/60 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-semibold text-foreground">Email</TableHead>
                        <TableHead className="font-semibold text-foreground">Role</TableHead>
                        <TableHead className="font-semibold text-foreground">Status</TableHead>
                        <TableHead className="font-semibold text-foreground">Expires</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={4} className="text-sm text-muted-foreground">
                          No invites yet. Invite a user above to get started.
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Members */}
            <Card className="border border-border/60">
              <CardContent className="p-5">
                <p className="font-semibold mb-3">Members</p>
                <div className="rounded-lg border border-border/60 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-semibold text-foreground">Name</TableHead>
                        <TableHead className="font-semibold text-foreground">Email</TableHead>
                        <TableHead className="font-semibold text-foreground">Role</TableHead>
                        <TableHead className="font-semibold text-foreground">Brand access</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((m) => (
                        <TableRow key={m.email}>
                          <TableCell className="font-medium">{m.name}</TableCell>
                          <TableCell>{m.email}</TableCell>
                          <TableCell>
                            <Select defaultValue={m.role}>
                              <SelectTrigger className="w-28 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Member">Member</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{m.access}</TableCell>
                          <TableCell>
                            <button className="text-destructive hover:text-destructive/80">
                              <Trash2 className="h-4 w-4" />
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
