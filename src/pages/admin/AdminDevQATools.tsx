import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { AlertCircle, RotateCcw, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AdminDevQATools() {
  const [resetOpen, setResetOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page header */}
      <Card className="border border-border/60">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold tracking-tight">Dev & QA Tools</h1>
          <p className="text-muted-foreground text-sm mt-1">
            System-level tools intended for internal testing and support.
          </p>
        </CardContent>
      </Card>

      {/* Demo Data */}
      <Card className="border border-border/60">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-base">Demo Data</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Reset the configured demo brand back to a clean seeded state.
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Current selection: <strong>Demo – Oy Care</strong>
              </p>
            </div>
            <Button
              variant="outline"
              className="gap-1.5 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => setResetOpen(true)}
            >
              <RotateCcw className="h-4 w-4" />
              Reset demo data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding QA */}
      <Card className="border border-border/60">
        <CardContent className="p-6 space-y-4">
          <div>
            <p className="font-semibold text-base">Onboarding QA</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              QA utilities for testing onboarding flows. Use with caution.
            </p>
          </div>

          <Separator />

          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Create a new user account (non-admin), then walk through onboarding.</li>
            <li>
              Use <strong className="text-foreground">Hard reset user</strong> to restart onboarding from a clean state.
            </li>
            <li>
              Use <strong className="text-foreground">Delete company</strong> to fully wipe the company (brands will cascade delete) and unlink users.
            </li>
          </ul>

          <p className="text-xs text-destructive/80">
            These actions are destructive; always read the confirmation text before proceeding.
          </p>

          <div className="rounded-lg border border-border/60 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-semibold text-foreground">User</TableHead>
                  <TableHead className="font-semibold text-foreground">Company</TableHead>
                  <TableHead className="font-semibold text-foreground">Onboarding</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">QA actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} className="text-sm text-muted-foreground text-center py-8">
                    No users found.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Reset dialog */}
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset demo brand data</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm">
              This will permanently reset demo data for the selected brand:{" "}
              <strong>Demo – Oy Care</strong>.
            </p>
            <p className="text-sm text-muted-foreground">
              This deletes seeded campaigns, generated artifacts, and related demo workspace data
              before re-seeding it. This action is destructive and cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setResetOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => setResetOpen(false)}>
                Reset demo data
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
