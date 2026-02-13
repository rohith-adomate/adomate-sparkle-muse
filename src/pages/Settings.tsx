import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
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
            <CardHeader><CardTitle className="text-base">Profile Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
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
            <CardHeader><CardTitle className="text-base">Team Members</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[{ name: "John Doe", email: "john@acmeco.com", role: "Admin" }, { name: "Jane Smith", email: "jane@acmeco.com", role: "Editor" }, { name: "Mike Johnson", email: "mike@acmeco.com", role: "Viewer" }].map((m) => (
                <div key={m.email} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div><p className="text-sm font-medium">{m.name}</p><p className="text-xs text-muted-foreground">{m.email}</p></div>
                  <Badge variant="outline">{m.role}</Badge>
                </div>
              ))}
              <Button variant="outline" size="sm">Invite Member</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Current Plan</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div><p className="font-semibold">Pro Plan</p><p className="text-sm text-muted-foreground">$99/month</p></div>
                <Badge>Active</Badge>
              </div>
              <Separator />
              <Button variant="outline">Manage Subscription</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Connected Services</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b"><span className="text-sm font-medium">Meta Business Suite</span><Badge variant="default">Connected</Badge></div>
              <div className="flex items-center justify-between py-2 border-b"><span className="text-sm font-medium">Google Analytics</span><Badge variant="secondary">Not Connected</Badge></div>
              <div className="flex items-center justify-between py-2"><span className="text-sm font-medium">Slack</span><Badge variant="secondary">Not Connected</Badge></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {["Campaign completed", "New concepts ready for review", "Ad performance alerts", "Weekly summary email", "Team activity updates"].map((n) => (
                <div key={n} className="flex items-center justify-between"><span className="text-sm">{n}</span><Switch defaultChecked /></div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
