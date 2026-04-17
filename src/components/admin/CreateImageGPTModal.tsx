import { useState } from "react";
import { Upload, Sparkles, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const VISUAL_STYLE_OPTIONS = ["MINIMALIST_MODERN", "VALUE_BUDGET", "BOLD_PLAYFUL", "PREMIUM_LUXE", "EDITORIAL"];
const FUNNEL_STAGE_OPTIONS = ["UNAWARE", "PROBLEM_AWARE", "SOLUTION_AWARE", "PRODUCT_AWARE", "MOST_AWARE"];
const FEASIBILITY_OPTIONS = ["EASY", "MEDIUM", "HARD"];
const INDUSTRY_OPTIONS = ["DTC", "SAAS", "RETAIL", "B2B", "BEAUTY", "HEALTH"];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateImageGPTModal({ open, onOpenChange }: Props) {
  const [autoSuggest, setAutoSuggest] = useState(true);
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [feasibility, setFeasibility] = useState("");
  const [industries, setIndustries] = useState<string[]>([]);
  const [visualStyles, setVisualStyles] = useState<string[]>([]);
  const [funnelStages, setFunnelStages] = useState<string[]>([]);

  const reset = () => {
    setAutoSuggest(false);
    setName(""); setPrompt(""); setFeasibility("");
    setIndustries([]); setVisualStyles([]); setFunnelStages([]);
  };

  const handleClose = (o: boolean) => {
    if (!o) reset();
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[560px] p-0 gap-0 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Create Image GPT profile</h2>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-5">
          {/* Profile picture section */}
          <div className="bg-primary/5 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Profile picture (optional)</Label>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-foreground">Auto suggest fields from uploaded image</span>
              <Switch checked={autoSuggest} onCheckedChange={setAutoSuggest} />
            </div>
            <div className="rounded-lg border-[1.5px] border-dashed border-primary/40 bg-background py-8 px-4 flex flex-col items-center text-center gap-1.5 cursor-pointer hover:bg-primary/5 transition-colors">
              <Upload className="h-6 w-6 text-muted-foreground mb-1" />
              <div className="text-sm font-medium text-foreground">Drag and drop or click to select</div>
              <div className="text-xs text-muted-foreground">PNG, JPEG, or WebP · Max 25MB</div>
              <div className="text-xs text-muted-foreground italic">
                {autoSuggest
                  ? "Auto-suggest fills fields now; image uploads only when you save."
                  : "Image stays local until you click save."}
              </div>
            </div>
          </div>

          {/* Profile details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Profile details</h3>
              <Badge className="bg-primary/15 text-primary hover:bg-primary/15 text-[10px] font-bold tracking-wide">
                AI READY
              </Badge>
            </div>

            {autoSuggest ? (
              <p className="text-sm text-muted-foreground italic">
                Upload an image first. Vertex AI will auto-fill all fields and show them here once ready.
              </p>
            ) : (
              <>
                <Field label="Name" required>
                  <div className="flex gap-2">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. ProblemSolutionGPT"
                      className="rounded-lg flex-1"
                    />
                    <Button
                      type="button"
                      className="rounded-lg shrink-0 gap-1.5"
                      onClick={() => setName("ProblemSolutionGPT")}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Generate name from prompt
                    </Button>
                  </div>
                </Field>

                <Field label="Prompt" required>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the visual style and instructions for generation."
                    className="rounded-lg min-h-[90px]"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Design feasibility">
                    <Select value={feasibility} onValueChange={setFeasibility}>
                      <SelectTrigger className="rounded-lg"><SelectValue placeholder=" " /></SelectTrigger>
                      <SelectContent>
                        {FEASIBILITY_OPTIONS.map((o) => (
                          <SelectItem key={o} value={o}>{o}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Industry types">
                    <MultiSelect
                      values={industries}
                      options={INDUSTRY_OPTIONS}
                      onAdd={(v) => setIndustries((s) => s.includes(v) ? s : [...s, v])}
                      onRemove={(v) => setIndustries((s) => s.filter((x) => x !== v))}
                      placeholder="Add industry"
                    />
                  </Field>
                </div>

                <Field label="Visual styles">
                  <MultiSelect
                    values={visualStyles}
                    options={VISUAL_STYLE_OPTIONS}
                    onAdd={(v) => setVisualStyles((s) => s.includes(v) ? s : [...s, v])}
                    onRemove={(v) => setVisualStyles((s) => s.filter((x) => x !== v))}
                    placeholder="Add visual style"
                  />
                </Field>

                <Field label="Funnel stages">
                  <MultiSelect
                    values={funnelStages}
                    options={FUNNEL_STAGE_OPTIONS}
                    onAdd={(v) => setFunnelStages((s) => s.includes(v) ? s : [...s, v])}
                    onRemove={(v) => setFunnelStages((s) => s.filter((x) => x !== v))}
                    placeholder="Add funnel stage"
                  />
                </Field>

                <div className="flex flex-wrap gap-2 pt-1">
                  <SummaryTag>{visualStyles.length} VISUAL STYLES</SummaryTag>
                  <SummaryTag>{funnelStages.length} FUNNEL STAGES</SummaryTag>
                  <SummaryTag>{industries.length} INDUSTRIES</SummaryTag>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t bg-background">
          <Button variant="outline" className="rounded-lg" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button
            className="rounded-lg"
            disabled={autoSuggest || !name || !prompt}
            onClick={() => handleClose(false)}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function SummaryTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wide">
      {children}
    </span>
  );
}

function MultiSelect({
  values, options, onAdd, onRemove, placeholder,
}: {
  values: string[];
  options: string[];
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
  placeholder: string;
}) {
  const available = options.filter((o) => !values.includes(o));
  return (
    <div className="rounded-lg border bg-background p-2 min-h-10 flex flex-wrap gap-1.5 items-center">
      {values.map((v) => (
        <span
          key={v}
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full",
            "bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wide",
          )}
        >
          {v}
          <button onClick={() => onRemove(v)} className="hover:bg-primary/20 rounded-full p-0.5">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      {available.length > 0 && (
        <Select value="" onValueChange={(v) => v && onAdd(v)}>
          <SelectTrigger className="h-7 w-auto border-0 shadow-none bg-transparent text-xs text-muted-foreground hover:text-foreground px-2 focus:ring-0">
            <SelectValue placeholder={`+ ${placeholder}`} />
          </SelectTrigger>
          <SelectContent>
            {available.map((o) => (
              <SelectItem key={o} value={o}>{o}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
