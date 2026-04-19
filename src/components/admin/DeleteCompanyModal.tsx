import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, X } from "lucide-react";

interface DeleteCompanyModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  companyName: string;
  userCount: number;
  brandCount: number;
}

export function DeleteCompanyModal({
  open,
  onOpenChange,
  companyName,
  userCount,
  brandCount,
}: DeleteCompanyModalProps) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (open) setConfirmed(false);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
        <div className="relative bg-gradient-to-r from-rose-50 to-red-50 px-6 pt-5 pb-4">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
          <h2 className="text-lg font-semibold text-red-600">Delete company</h2>
          <p className="text-sm text-muted-foreground mt-1">
            This action cannot be undone. Please read carefully.
          </p>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-foreground">
            You are about to permanently delete{" "}
            <span className="font-semibold">{companyName}</span>. This will also
            remove all associated brands and unassign all users.
          </p>

          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-xs text-red-700">
              This company has <span className="font-semibold">{userCount} user(s)</span>{" "}
              and <span className="font-semibold">{brandCount} brand(s)</span>. They
              will all be affected.
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={confirmed}
              onCheckedChange={(v) => setConfirmed(!!v)}
            />
            <span className="text-sm text-foreground">
              I understand this action is irreversible
            </span>
          </label>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-border/60 bg-muted/30">
          <button
            onClick={() => onOpenChange(false)}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <Button
            disabled={!confirmed}
            onClick={() => onOpenChange(false)}
            className="rounded-full bg-red-500 hover:bg-red-600 text-white disabled:bg-muted disabled:text-muted-foreground"
          >
            Delete company
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
