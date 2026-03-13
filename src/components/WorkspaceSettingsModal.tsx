import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings, Users, Trash2, X, UserPlus, Mail, Plus, Search, ShieldCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const members = [
  { name: "Lucas Desard", email: "lucas@adomate.com", role: "Admin", access: "All brands" },
  { name: "Simon Logghe", email: "simon@adomate.com", role: "Admin", access: "All brands" },
  { name: "Diego Goethals", email: "diego@adomate.com", role: "Admin", access: "All brands" },
  { name: "Ankit Kumar", email: "ankit@adomate.com", role: "Admin", access: "All brands" },
];

const ALL_BRANDS = [
  { id: "1", name: "Demo - Oy Care" },
  { id: "2", name: "Demo - Headlight" },
  { id: "3", name: "Demo - New Brand" },
];

interface WorkspaceSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function InviteUserModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>(["1", "2"]);
  const [brandPopoverOpen, setBrandPopoverOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");

  const isAdmin = role === "Admin";

  const selectedBrands = ALL_BRANDS.filter((b) => selectedBrandIds.includes(b.id));
  const unselectedBrands = useMemo(() => {
    return ALL_BRANDS.filter(
      (b) => !selectedBrandIds.includes(b.id) && b.name.toLowerCase().includes(brandSearch.toLowerCase())
    );
  }, [selectedBrandIds, brandSearch]);

  const removeBrand = (id: string) => {
    setSelectedBrandIds((prev) => prev.filter((bid) => bid !== id));
  };

  const addBrand = (id: string) => {
    setSelectedBrandIds((prev) => [...prev, id]);
  };

  const handleSendInvite = () => {
    setEmail("");
    setRole("Member");
    setSelectedBrandIds(["1", "2"]);
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
              {isAdmin
                ? "Admins can manage members, settings and have full access."
                : "Members can work in assigned brands but cannot manage members."}
            </p>
          </div>

          {isAdmin ? (
            <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <p className="text-xs text-foreground">
                Admins automatically have access to <strong>all brands</strong>.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label>Brand access</Label>
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedBrands.map((brand) => (
                  <Badge key={brand.id} variant="secondary" className="gap-1 py-0.5 px-2 text-[11px]">
                    {brand.name}
                    <button
                      onClick={() => removeBrand(brand.id)}
                      className="shrink-0 hover:text-destructive transition-colors"
                      aria-label={`Remove ${brand.name}`}
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))}
                <Popover open={brandPopoverOpen} onOpenChange={(o) => { setBrandPopoverOpen(o); if (!o) setBrandSearch(""); }}>
                  <PopoverTrigger asChild>
                    <button className="h-6 px-2 rounded-md border border-dashed border-muted-foreground/30 text-[10px] text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center gap-0.5">
                      <Plus className="h-2.5 w-2.5" /> Add
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2" align="start">
                    <div className="flex items-center gap-2 border-b pb-2 mb-1">
                      <Search className="h-3 w-3 text-muted-foreground shrink-0" />
                      <input
                        value={brandSearch}
                        onChange={(e) => setBrandSearch(e.target.value)}
                        placeholder="Search brands..."
                        className="flex-1 text-xs bg-transparent outline-none placeholder:text-muted-foreground"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-0.5">
                      {unselectedBrands.length === 0 ? (
                        <p className="text-[10px] text-muted-foreground p-2 text-center">No brands found</p>
                      ) : (
                        unselectedBrands.map((b) => (
                          <button
                            key={b.id}
                            onClick={() => addBrand(b.id)}
                            className="w-full flex items-center gap-2 text-left text-xs px-2 py-1.5 rounded hover:bg-accent transition-colors"
                          >
                            {b.name}
                          </button>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

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

                {/* Fixed-height container for smooth tab switching */}
                <div className="min-h-[340px]">
                  <TabsContent value="members" className="mt-0">
                    <Card className="border border-border/60 mt-2">
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

                  <TabsContent value="invites" className="mt-0">
                    <Card className="border border-border/60 mt-2">
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
                </div>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <InviteUserModal open={inviteOpen} onOpenChange={setInviteOpen} />
    </>
  );
}
