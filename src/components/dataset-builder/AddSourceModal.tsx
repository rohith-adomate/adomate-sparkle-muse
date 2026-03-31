import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DatasetSource } from "./types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSource: (source: DatasetSource) => void;
}

const SOURCE_TYPES = [
  { value: "competitor", label: "Competitor Ad Library URL" },
  { value: "landing-page", label: "Landing Page URL" },
  { value: "csv", label: "CSV Upload" },
  { value: "manual", label: "Manual List" },
  { value: "api", label: "API Connection" },
] as const;

export default function AddSourceModal({ open, onOpenChange, onAddSource }: Props) {
  const [sourceType, setSourceType] = useState<string>("");
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");

  const reset = () => {
    setSourceType("");
    setLabel("");
    setUrl("");
  };

  const handleAdd = () => {
    const domain = url ? new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace("www.", "") : undefined;
    onAddSource({
      id: `src-${Date.now()}`,
      type: sourceType as DatasetSource["type"],
      label: label || sourceType,
      avatar: domain ? `https://logo.clearbit.com/${domain}` : undefined,
      url: url || undefined,
      status: "connected",
    });
    reset();
    onOpenChange(false);
  };

  const canAdd = sourceType && label.trim();

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Add Source</DialogTitle>
          <p className="text-xs text-muted-foreground">Connect a new data source to your dataset</p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-semibold mb-1.5 block">Source Type</label>
            <Select value={sourceType} onValueChange={setSourceType}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select source type" />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_TYPES.map(st => (
                  <SelectItem key={st.value} value={st.value}>{st.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1.5 block">Label</label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., CeraVe Meta Ad Library"
              className="h-9 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1.5 block">URL</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.facebook.com/ads/library/..."
              className="h-9 text-sm"
            />
          </div>

          <Button className="w-full" onClick={handleAdd} disabled={!canAdd}>
            Add Source
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
