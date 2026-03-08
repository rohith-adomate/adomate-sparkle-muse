import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const adAccounts = [
  { id: "act_123456789", name: "Oy Care - Main", avatar: "https://ui-avatars.com/api/?name=OC&background=7c3aed&color=fff&size=32" },
  { id: "act_987654321", name: "Oy Care - EU", avatar: "https://ui-avatars.com/api/?name=OE&background=2563eb&color=fff&size=32" },
  { id: "act_555444333", name: "Oy Care - US", avatar: "https://ui-avatars.com/api/?name=OU&background=059669&color=fff&size=32" },
];

const facebookPages = [
  { id: "fb_001", name: "Oy Care Official", avatar: "https://ui-avatars.com/api/?name=OC&background=1877f2&color=fff&size=32" },
  { id: "fb_002", name: "Oy Care Community", avatar: "https://ui-avatars.com/api/?name=CC&background=1877f2&color=fff&size=32" },
  { id: "fb_003", name: "Oy Care Support", avatar: "https://ui-avatars.com/api/?name=OS&background=1877f2&color=fff&size=32" },
];

const instagramPages = [
  { id: "ig_001", name: "@oycare", avatar: "https://ui-avatars.com/api/?name=OC&background=e1306c&color=fff&size=32" },
  { id: "ig_002", name: "@oycare.eu", avatar: "https://ui-avatars.com/api/?name=OE&background=e1306c&color=fff&size=32" },
  { id: "ig_003", name: "@oycare.community", avatar: "https://ui-avatars.com/api/?name=OG&background=e1306c&color=fff&size=32" },
];

export default function MetaIntegration() {
  const [selectedAdAccount, setSelectedAdAccount] = useState<string>("");
  const [selectedFbPage, setSelectedFbPage] = useState<string>("");
  const [selectedIgPage, setSelectedIgPage] = useState<string>("");

  const hasAdAccount = !!selectedAdAccount;

  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumbs items={[{ label: "Data Room", href: "/brand-data-room" }, { label: "Meta Integration" }]} />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Meta Integration</h1>
        <p className="text-muted-foreground text-sm">Connect and manage your Meta ad accounts.</p>
      </div>

      <Card className="border border-border/60">
        <CardContent className="p-6 space-y-6">
          {/* Header with status */}
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm">Account Configuration</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4" />
                Connected
              </div>
              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-xs">Active</Badge>
            </div>
          </div>

          <Separator />

          {/* Ad Account Selection */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Ad Account</Label>
            <Select value={selectedAdAccount} onValueChange={(v) => { setSelectedAdAccount(v); setSelectedFbPage(""); setSelectedIgPage(""); }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an ad account" />
              </SelectTrigger>
              <SelectContent>
                {adAccounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id}>
                    <div className="flex items-center gap-2">
                      <img src={acc.avatar} alt="" className="h-5 w-5 rounded-full shrink-0" />
                      <span>{acc.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Facebook Page Selection */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Facebook Page</Label>
            <Select value={selectedFbPage} onValueChange={setSelectedFbPage} disabled={!hasAdAccount}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={hasAdAccount ? "Select a Facebook page" : "Select an ad account first"} />
              </SelectTrigger>
              <SelectContent>
                {facebookPages.map((page) => (
                  <SelectItem key={page.id} value={page.id}>
                    <div className="flex items-center gap-2">
                      <img src={page.avatar} alt="" className="h-5 w-5 rounded-full shrink-0" />
                      <span>{page.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Instagram Page Selection */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Instagram Page</Label>
            <Select value={selectedIgPage} onValueChange={setSelectedIgPage} disabled={!hasAdAccount}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={hasAdAccount ? "Select an Instagram page" : "Select an ad account first"} />
              </SelectTrigger>
              <SelectContent>
                {instagramPages.map((page) => (
                  <SelectItem key={page.id} value={page.id}>
                    <div className="flex items-center gap-2">
                      <img src={page.avatar} alt="" className="h-5 w-5 rounded-full shrink-0" />
                      <span>{page.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Disconnect at bottom */}
          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">Disconnect</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
