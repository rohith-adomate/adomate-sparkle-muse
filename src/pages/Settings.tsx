import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { User, Crown, Eye, CheckCircle2 } from "lucide-react";

const team = [
  { name: "John Doe", email: "john@acmeco.com", role: "Admin", color: "from-indigo-500 to-violet-500" },
  { name: "Jane Smith", email: "jane@acmeco.com", role: "Editor", color: "from-emerald-500 to-teal-500" },
  { name: "Mike Johnson", email: "mike@acmeco.com", role: "Viewer", color: "from-amber-500 to-orange-500" },
];

const roleBadge: Record<string, string> = {
  Admin: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Editor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Viewer: "bg-muted text-muted-foreground",
};

const roleIcon: Record<string, React.ElementType> = {
  Admin: Crown,
  Editor: User,
  Viewer: Eye,
};

export default function Settings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account and preferences.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base section-header">Profile Information</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center">
                  <User className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="font-semibold">John Doe</p>
                  <p className="text-sm text-muted-foreground">john@acmeco.com</p>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>First Name</Label><Input defaultValue="John" /></div>
                <div className="space-y-1.5"><Label>Last Name</Label><Input defaultValue="Doe" /></div>
              </div>
              <div className="space-y-1.5"><Label>Email</Label><Input defaultValue="john@acmeco.com" type="email" /></div>
              <div className="space-y-1.5"><Label>Company</Label><Input defaultValue="Acme Co" /></div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base section-header">Team Members</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {team.map((m) => {
                const RoleIcon = roleIcon[m.role];
                return (
                  <div key={m.email} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                        <span className="text-xs font-bold text-white">{m.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-xs border gap-1 ${roleBadge[m.role]}`}>
                      <RoleIcon className="h-3 w-3" />
                      {m.role}
                    </Badge>
                  </div>
                );
              })}
              <Button variant="outline" size="sm">Invite Member</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base section-header">Current Plan</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {/* Plan comparison */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl border-2 border-primary p-4 space-y-2 relative">
                  <Badge className="absolute -top-2 right-3 gradient-primary text-white border-0 text-[10px]">Current</Badge>
                  <p className="text-lg font-bold">Pro Plan</p>
                  <p className="text-2xl font-bold tracking-tight">$99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Unlimited campaigns</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 5 team members</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> All integrations</li>
                  </ul>
                </div>
                <div className="rounded-xl border p-4 space-y-2 opacity-60">
                  <p className="text-lg font-bold">Enterprise</p>
                  <p className="text-2xl font-bold tracking-tight">Custom</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>Everything in Pro</li>
                    <li>Unlimited team members</li>
                    <li>Dedicated support</li>
                  </ul>
                  <Button variant="outline" size="sm">Contact Sales</Button>
                </div>
              </div>
              <Separator />
              <Button variant="outline">Manage Subscription</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base section-header">Connected Services</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Meta Business Suite", connected: true, icon: "M", color: "from-blue-600 to-blue-500" },
                { name: "Google Analytics", connected: false, icon: "G", color: "from-red-500 to-amber-500" },
                { name: "Slack", connected: false, icon: "S", color: "from-purple-600 to-pink-500" },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-xs font-bold`}>
                      {s.icon}
                    </div>
                    <span className="text-sm font-medium">{s.name}</span>
                  </div>
                  {s.connected ? (
                    <Badge variant="outline" className="text-xs border bg-emerald-50 text-emerald-700 border-emerald-200">Connected</Badge>
                  ) : (
                    <Button variant="outline" size="sm">Connect</Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base section-header">Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {["Campaign completed", "New concepts ready for review", "Ad performance alerts", "Weekly summary email", "Team activity updates"].map((n) => (
                <div key={n} className="flex items-center justify-between py-1">
                  <span className="text-sm">{n}</span>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
