import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DatasetFilter } from "./types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddFilter: (filter: DatasetFilter) => void;
}

const FIELDS = [
  { value: "status", label: "Status" },
  { value: "days-running", label: "Days Running" },
  { value: "format", label: "Format" },
  { value: "platform", label: "Platform" },
  { value: "headline", label: "Headline" },
  { value: "brand", label: "Brand" },
  { value: "funnel-stage", label: "Funnel Stage" },
  { value: "ad-type", label: "Ad Type" },
  { value: "domain", label: "Landing Page Domain" },
];

const OPERATORS: Record<string, { value: string; label: string }[]> = {
  "status": [{ value: "equals", label: "equals" }, { value: "not-equals", label: "does not equal" }],
  "days-running": [{ value: "gte", label: "≥ (greater or equal)" }, { value: "lte", label: "≤ (less or equal)" }, { value: "equals", label: "equals" }],
  "format": [{ value: "equals", label: "equals" }, { value: "contains", label: "contains" }],
  "platform": [{ value: "equals", label: "equals" }],
  "headline": [{ value: "contains", label: "contains" }, { value: "is_not_empty", label: "is not empty" }],
  "brand": [{ value: "equals", label: "equals" }, { value: "contains", label: "contains" }],
  "funnel-stage": [{ value: "equals", label: "equals" }],
  "ad-type": [{ value: "equals", label: "equals" }],
  "domain": [{ value: "contains", label: "contains" }],
};

export default function AddFilterModal({ open, onOpenChange, onAddFilter }: Props) {
  const [filterName, setFilterName] = useState("");
  const [field, setField] = useState("");
  const [operator, setOperator] = useState("");
  const [value, setValue] = useState("");

  const operators = field ? OPERATORS[field] || [] : [];
  const needsValue = operator !== "is_not_empty";
  const fieldLabel = FIELDS.find(f => f.value === field)?.label || field;
  const operatorLabel = operators.find(o => o.value === operator)?.label || operator;

  const reset = () => { setFilterName(""); setField(""); setOperator(""); setValue(""); };

  const handleAdd = () => {
    const label = filterName || `${fieldLabel} ${operatorLabel} ${value}`;
    const description = `${fieldLabel} ${operatorLabel}${needsValue ? ` ${value}` : ""}`;
    onAddFilter({ id: `fil-${Date.now()}`, type: field as DatasetFilter["type"], label, value: description });
    reset();
    onOpenChange(false);
  };

  const canAdd = field && operator && (needsValue ? value.trim() : true);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Add Filter</DialogTitle>
          <p className="text-xs text-muted-foreground">Define a new filter for your dataset</p>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-semibold mb-1.5 block">Filter Name (optional)</label>
            <Input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="e.g., Active ads only" className="h-9 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1.5 block">Field</label>
            <Select value={field} onValueChange={(v) => { setField(v); setOperator(""); setValue(""); }}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select a field" /></SelectTrigger>
              <SelectContent>{FIELDS.map(f => (<SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          {field && (
            <div>
              <label className="text-xs font-semibold mb-1.5 block">Operator</label>
              <Select value={operator} onValueChange={setOperator}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select operator" /></SelectTrigger>
                <SelectContent>{operators.map(o => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}</SelectContent>
              </Select>
            </div>
          )}
          {field && operator && needsValue && (
            <div>
              <label className="text-xs font-semibold mb-1.5 block">Value</label>
              <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder={field === "days-running" ? "e.g., 14" : "e.g., Active"} className="h-9 text-sm" type={field === "days-running" ? "number" : "text"} />
            </div>
          )}
          <Button className="w-full" onClick={handleAdd} disabled={!canAdd}>Add Filter</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
