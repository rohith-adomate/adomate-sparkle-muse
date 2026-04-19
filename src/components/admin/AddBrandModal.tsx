import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, X } from "lucide-react";

interface AddBrandModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  companyName: string;
  existingBrands: string[];
}

export function AddBrandModal({
  open,
  onOpenChange,
  companyName,
  existingBrands,
}: AddBrandModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
    }
  }, [open]);

  const canCreate = name.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
        <div className="relative bg-gradient-to-r from-pink-100 to-rose-100 px-6 pt-5 pb-4">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">
            Add brand to "{companyName}"
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create a new brand and attach it to this company.
          </p>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-pink-600">
            <PenLine className="h-3.5 w-3.5" />
            Brand details
          </div>

          {existingBrands.length > 0 && (
            <div className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Existing brands:</span>{" "}
              {existingBrands.join(", ")}
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Brand name <span className="text-destructive">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Fitness"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Description (optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of the brand…"
              rows={3}
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-border/60 bg-muted/30">
          <button
            onClick={() => onOpenChange(false)}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <Button
            disabled={!canCreate}
            onClick={() => onOpenChange(false)}
            className="rounded-full bg-pink-500 hover:bg-pink-600 text-white disabled:bg-muted disabled:text-muted-foreground"
          >
            Create brand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
