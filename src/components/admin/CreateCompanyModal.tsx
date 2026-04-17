import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Building2, Sparkles, CheckCircle2, Paintbrush } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "ACTIVE" | "TRIAL" | "DEMO" | "CHURNED";

interface CreateCompanyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusOptions: {
  key: Status;
  label: string;
  active: string;
  inactive: string;
}[] = [
  {
    key: "ACTIVE",
    label: "ACTIVE",
    active: "bg-emerald-500 text-white border-emerald-500",
    inactive: "bg-white text-emerald-600 border-emerald-500",
  },
  {
    key: "TRIAL",
    label: "TRIAL",
    active: "bg-emerald-500 text-white border-emerald-500",
    inactive: "bg-white text-emerald-600 border-emerald-500",
  },
  {
    key: "DEMO",
    label: "DEMO",
    active: "bg-sky-500 text-white border-sky-500",
    inactive: "bg-white text-sky-600 border-sky-500",
  },
  {
    key: "CHURNED",
    label: "CHURNED",
    active: "bg-rose-500 text-white border-rose-500",
    inactive: "bg-white text-rose-600 border-rose-500",
  },
];

export function CreateCompanyModal({ open, onOpenChange }: CreateCompanyModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [status, setStatus] = useState<Status>("ACTIVE");
  const [onboardingComplete, setOnboardingComplete] = useState(true);
  const [createBrand, setCreateBrand] = useState(true);
  const [brandName, setBrandName] = useState("");

  const canSubmit = companyName.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl gap-0">
        {/* Pink banner header */}
        <div className="bg-pink-50 px-8 pt-7 pb-5">
          <h2 className="text-[20px] font-bold text-[#1a1a2e] tracking-tight">
            Create company
          </h2>
          <p className="text-[13px] text-muted-foreground mt-1">
            Set up your company profile and workspace defaults.
          </p>
        </div>

        <div className="px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* COMPANY DETAILS section */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              <Building2 className="h-3.5 w-3.5" />
              Company details
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-foreground">
                Company name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Inc"
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-normal text-muted-foreground">
                Status — shown next to the company in dashboards
              </Label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((opt) => {
                  const selected = status === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setStatus(opt.key)}
                      className={cn(
                        "px-3 py-1 rounded-full border text-[11px] font-bold tracking-wide transition-colors",
                        selected ? opt.active : opt.inactive,
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* WORKSPACE DEFAULTS section */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-pink-600 uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Workspace defaults
            </div>

            {/* Onboarding complete card */}
            <div className="bg-pink-50 rounded-xl p-3.5 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-pink-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Company onboarding complete
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Newly assigned users skip onboarding and go straight to the workspace.
                </p>
              </div>
              <Switch
                checked={onboardingComplete}
                onCheckedChange={setOnboardingComplete}
                className="mt-0.5 data-[state=checked]:bg-pink-600"
              />
            </div>

            {/* Create initial brand card */}
            <div className="bg-white border border-border rounded-xl p-3.5 flex items-center gap-3">
              <Paintbrush className="h-5 w-5 text-pink-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Create initial brand
                </p>
              </div>
              <Switch
                checked={createBrand}
                onCheckedChange={setCreateBrand}
                className="data-[state=checked]:bg-pink-600"
              />
            </div>

            {createBrand && (
              <div className="space-y-1.5 pt-1">
                <Label className="text-sm text-foreground">Initial brand name</Label>
                <Input
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Defaults to company name"
                  className="h-10"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 flex items-center justify-between border-t border-border">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <Button
            disabled={!canSubmit}
            className={cn(
              "rounded-full px-5 h-9 text-sm font-medium",
              canSubmit
                ? "bg-pink-600 text-white hover:bg-pink-700"
                : "bg-muted text-muted-foreground hover:bg-muted",
            )}
          >
            Create Company
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
