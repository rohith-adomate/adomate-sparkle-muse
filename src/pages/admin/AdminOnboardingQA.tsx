import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

export default function AdminOnboardingQA() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Card className="border border-border/60">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold tracking-tight">Onboarding QA</h1>
          <p className="text-muted-foreground text-sm mt-1">QA utilities for onboarding flows. Use with caution.</p>
        </CardContent>
      </Card>

      <Card className="border border-border/60">
        <CardContent className="p-6 space-y-3">
          <p className="font-semibold">QA test instructions</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Create a new user account (non-admin), then walk through onboarding.</li>
            <li>Use <strong>Hard reset user</strong> to restart onboarding from a clean state.</li>
            <li>Use <strong>Delete company</strong> to fully wipe the company (brands will cascade delete) and unlink users.</li>
          </ul>
          <p className="text-sm text-muted-foreground">These actions are destructive; always read the confirmation text before proceeding.</p>
        </CardContent>
      </Card>

      <Card className="border border-border/60">
        <CardContent className="p-0">
          <div className="rounded-lg border border-border/60 overflow-hidden m-5">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-semibold text-foreground">User</TableHead>
                  <TableHead className="font-semibold text-foreground">Company</TableHead>
                  <TableHead className="font-semibold text-foreground">Onboarding</TableHead>
                  <TableHead className="font-semibold text-foreground">QA actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} className="text-sm text-muted-foreground">No users found.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
