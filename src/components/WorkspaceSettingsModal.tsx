import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Settings, Users, Trash2, X, UserPlus, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
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

function InviteUserModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [brands, setBrands] = useState<string[]>([...allowedBrands]);

  const removeBrand = (brand: string) => {
    setBrands(brands.filter(b => b !== brand));
  };

  const handleSendInvite = () => {
    // Handle invite logic
    setEmail("");
    setRole("Member");
    setBrands([...allowedBrands]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Invite user
          </DialogTitle>
          <DialogDescription>
            Send an invitation to join your workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div className="space-y-1.5">
            <Label>Email address</Label>
            <Input
              placeholder="name@company.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Member">Member</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Members can work in assigned brands but cannot manage members.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>Brand access</Label>
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
                  <SelectValue placeholder="Add brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demo-new">Demo - New Brand</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSendInvite} disabled={!email}>
              <Mail className="h-4 w-4 mr-1" />
              Send invite
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function WorkspaceSettingsModal({ open, onOpenChange }: WorkspaceSettingsModalProps) {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
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
              <Card className="border border-border/60">
                <CardContent className="p-5">
                  <p className="font-semibold">Team management</p>
                  <p className="text-sm text-muted-foreground">Invite and manage users for <strong>Whitespace</strong>.</p>
                </CardContent>
              </Card>

              <Tabs defaultValue="members" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="members">Members</TabsTrigger>
                  <TabsTrigger value="invites">Invites</TabsTrigger>
                </TabsList>

                <TabsContent value="members">
                  <Card className="border border-border/60">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-semibold">Members</p>
                        <Button size="sm" onClick={() => setInviteOpen(true)}>
                          <UserPlus className="h-4 w-4 mr-1" />
                          Invite user
                        </Button>
                      </div>
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
                </TabsContent>

                <TabsContent value="invites">
                  <Card className="border border-border/60">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-semibold">Pending & past invites</p>
                        <Button size="sm" onClick={() => setInviteOpen(true)}>
                          <UserPlus className="h-4 w-4 mr-1" />
                          Invite user
                        </Button>
                      </div>
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
                                No invites yet. Invite a user to get started.
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <InviteUserModal open={inviteOpen} onOpenChange={setInviteOpen} />
    </>
  );
}
