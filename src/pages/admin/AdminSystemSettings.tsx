import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

export default function AdminSystemSettings() {
  const [resetOpen, setResetOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Card className="border border-border/60">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">System-level tools intended for internal testing and support.</p>
        </CardContent>
      </Card>

      <Card className="border border-border/60">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="font-semibold">Demo data</p>
            <p className="text-sm text-muted-foreground">Reset the configured demo brand back to a clean seeded state.</p>
            <p className="text-sm text-muted-foreground mt-0.5">Current selection: <strong>Demo - Oy Care</strong></p>
          </div>
          <Button variant="outline" className="gap-1.5 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => setResetOpen(true)}>
            <AlertCircle className="h-4 w-4" />
            Reset demo data
          </Button>
        </CardContent>
      </Card>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset demo brand data</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm">
              This will permanently reset demo data for the selected brand: <strong>Demo - Oy Care</strong>.
            </p>
            <p className="text-sm text-muted-foreground">
              This deletes seeded campaigns, generated artifacts, and related demo workspace data before re-seeding it. This action is destructive and cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setResetOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => setResetOpen(false)}>Reset demo data</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
