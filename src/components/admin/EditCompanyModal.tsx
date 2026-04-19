import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Building2, Sparkles, Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "ACTIVE" | "TRIAL" | "DEMO" | "CHURNED";

interface EditCompanyModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  companyName: string;
  initialStatus?: Status;
  initialOnboarded?: boolean;
}

const statusStyles: Record<Status, { active: string; inactive: string }> = {
  ACTIVE: {
    active: "bg-emerald-500 text-white border-emerald-500",
    inactive: "bg-white text-emerald-600 border-emerald-500",
  },
  TRIAL: {
    active: "bg-sky-500 text-white border-sky-500",
    inactive: "bg-white text-sky-600 border-sky-500",
  },
  DEMO: {
    active: "bg-purple-500 text-white border-purple-500",
    inactive: "bg-white text-purple-600 border-purple-500",
  },
  CHURNED: {
    active: "bg-orange-500 text-white border-orange-500",
    inactive: "bg-white text-orange-600 border-orange-500",
  },
};

export function EditCompanyModal({
  open,
  onOpenChange,
  companyName,
  initialStatus = "DEMO",
  initialOnboarded = true,
}: EditCompanyModalProps) {
  const [name, setName] = useState(companyName);
  const [status, setStatus] = useState<Status>(initialStatus);
  const [onboarded, setOnboarded] = useState(initialOnboarded);

  useEffect(() => {
    if (open) {
      setName(companyName);
      setStatus(initialStatus);
      setOnboarded(initialOnboarded);
    }
  }, [open, companyName, initialStatus, initialOnboarded]);

  const hasChanges =
    name !== companyName || status !== initialStatus || onboarded !== initialOnboarded;
  const canSave = hasChanges && name.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-pink-100 to-rose-100 px-6 pt-5 pb-4">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <Pencil className="h-4 w-4 text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">
              Edit "{companyName}"
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Update the company profile and workspace settings.
          </p>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Company Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              <Building2 className="h-3.5 w-3.5" />
              Company details
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Company name <span className="text-destructive">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground font-normal">
                Status — shown next to the company in dashboards
              </Label>
              <div className="flex flex-wrap gap-2">
                {(["ACTIVE", "TRIAL", "DEMO", "CHURNED"] as Status[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={cn(
                      "px-3 py-1 rounded-full border text-xs font-semibold tracking-wide transition",
                      status === s ? statusStyles[s].active : statusStyles[s].inactive,
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Workspace Defaults */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-pink-600">
              <Sparkles className="h-3.5 w-3.5" />
              Workspace defaults
            </div>
            <div className="flex items-start justify-between gap-3 rounded-xl bg-pink-50 border border-pink-100 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Company onboarding complete
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  When enabled, newly assigned users skip onboarding and go straight to the workspace.
                </p>
              </div>
              <Switch
                checked={onboarded}
                onCheckedChange={setOnboarded}
                className="data-[state=checked]:bg-pink-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/60 bg-muted/30">
          <button
            onClick={() => onOpenChange(false)}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <Button
            disabled={!canSave}
            onClick={() => onOpenChange(false)}
            className="rounded-full bg-pink-500 hover:bg-pink-600 text-white disabled:bg-muted disabled:text-muted-foreground"
          >
            Save changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
