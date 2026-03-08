import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

export default function AdminCompanies() {
  const [onboarded, setOnboarded] = useState(true);
  const [trialAccess, setTrialAccess] = useState(true);
  const [createBrand, setCreateBrand] = useState(true);
  const [assignOnboarded, setAssignOnboarded] = useState(true);
  const [assignTrial, setAssignTrial] = useState(true);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Companies & brands</h1>
        <p className="text-muted-foreground text-sm mt-1">Admin utilities to create companies/brands and provision users into a preconfigured workspace.</p>
      </div>

      {/* Create company */}
      <Card className="border border-border/60">
        <CardContent className="p-6 space-y-4">
          <p className="font-semibold">Create company</p>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium mb-1.5">Company name <span className="text-destructive">*</span></p>
              <Input placeholder="e.g. Acme Inc" />
            </div>
            <div>
              <p className="text-sm font-medium mb-1.5">Company type</p>
              <Select defaultValue="single">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single brand</SelectItem>
                  <SelectItem value="multi">Multi brand</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm font-medium mb-1.5">Status</p>
              <Select defaultValue="active">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-0.5">Company email allowlist</p>
            <p className="text-xs text-muted-foreground mb-1.5">Optional allowlist for auto-assignment on sign-up. One email per line (or comma-separated).</p>
            <Textarea placeholder={"jane@acme.com\nteam@acme.com"} rows={3} />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox checked={onboarded} onCheckedChange={(v) => setOnboarded(!!v)} />
              <span className="text-sm">Treat this company as already onboarded</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={trialAccess} onCheckedChange={(v) => setTrialAccess(!!v)} />
              <span className="text-sm">Allow trial access</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">When enabled, users assigned to this company can go straight to the workspace instead of the onboarding flow.</p>

          <div className="flex items-center gap-3">
            <Checkbox checked={createBrand} onCheckedChange={(v) => setCreateBrand(!!v)} />
            <span className="text-sm">Create initial brand</span>
            <div>
              <p className="text-sm font-medium">Initial brand name</p>
              <Input placeholder="Defaults to company name" className="w-56 mt-1" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">If no brand exists yet, creating one now avoids setup friction for the first assigned users.</p>

          <div className="flex justify-end">
            <Button variant="outline" size="sm">Create company</Button>
          </div>
        </CardContent>
      </Card>

      {/* Create brand */}
      <Card className="border border-border/60">
        <CardContent className="p-6 space-y-4">
          <p className="font-semibold">Create brand (existing company)</p>

          <div>
            <p className="text-sm font-medium mb-1.5">Company</p>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select a company" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="whitespace">Whitespace</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1.5">Brand name <span className="text-destructive">*</span></p>
              <Input placeholder="e.g. Acme Fitness" />
            </div>
            <div>
              <p className="text-sm font-medium mb-1.5">Existing brands</p>
              <div className="h-9 rounded-md bg-muted/50 border border-border/60" />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1.5">Description (optional)</p>
            <Textarea rows={3} />
          </div>

          <div className="flex justify-end">
            <Button variant="outline" size="sm">Create brand</Button>
          </div>
        </CardContent>
      </Card>

      {/* Assign user */}
      <Card className="border border-border/60">
        <CardContent className="p-6 space-y-4">
          <p className="font-semibold">Assign user to company</p>

          <div>
            <p className="text-sm font-medium">User search</p>
            <p className="text-xs text-muted-foreground mb-1.5">Search by name or email (min 2 characters).</p>
            <Input placeholder="e.g. jane@acme.com" />
            <p className="text-xs text-muted-foreground mt-1">Enter at least 2 characters to search.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1.5">Company</p>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select a company" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="whitespace">Whitespace</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm font-medium mb-1.5">Brand</p>
              <Select>
                <SelectTrigger><SelectValue placeholder="Auto-select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-select</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">Brand is optional. If omitted, we use the oldest existing brand for that company, or create one automatically if none exists.</p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox checked={assignOnboarded} onCheckedChange={(v) => setAssignOnboarded(!!v)} />
              <span className="text-sm">Mark user onboarding as completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={assignTrial} onCheckedChange={(v) => setAssignTrial(!!v)} />
              <span className="text-sm">Allow trial access</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Enable only for users who are already configured, so their next login opens directly in the workspace.</p>

          <p className="text-sm text-muted-foreground">Selected company: —</p>

          <div className="flex justify-end">
            <Button variant="outline" size="sm" disabled>Assign user</Button>
          </div>
        </CardContent>
      </Card>

      {/* Current companies table */}
      <Card className="border border-border/60">
        <CardContent className="p-5">
          <p className="font-semibold mb-3">Current companies</p>
          <div className="rounded-lg border border-border/60 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-semibold text-foreground">Company</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                  <TableHead className="font-semibold text-foreground">Users</TableHead>
                  <TableHead className="font-semibold text-foreground">Brands</TableHead>
                  <TableHead className="font-semibold text-foreground">Brand list</TableHead>
                  <TableHead className="font-semibold text-foreground">Allowlist emails</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Whitespace</TableCell>
                  <TableCell>
                    <div className="text-xs">DEMO · MULTI BRAND</div>
                    <div className="text-xs text-muted-foreground">Onboarded · Trial not allowed</div>
                  </TableCell>
                  <TableCell>4</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell className="text-sm">Demo - Oy Care, Demo - Headlight</TableCell>
                  <TableCell className="text-muted-foreground">—</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
