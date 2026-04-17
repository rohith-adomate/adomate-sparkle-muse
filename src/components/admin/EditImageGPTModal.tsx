import { useState, useEffect } from "react";
import { X, Star } from "lucide-react";
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

export type ImageGPTProfile = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  visualStyle: string;
  funnelStage: string;
  feasibility: string;
  industry: string;
};

type EditState = {
  name: string;
  prompt: string;
  feasibility: string;
  industries: string[];
  visualStyles: string[];
  funnelStages: string[];
  image: string | null;
};

const VISUAL_STYLE_OPTIONS = ["MINIMALIST_MODERN", "VALUE_BUDGET", "BOLD_PLAYFUL", "PREMIUM_LUXE", "EDITORIAL"];
const FUNNEL_STAGE_OPTIONS = ["UNAWARE", "PROBLEM_AWARE", "SOLUTION_AWARE", "PRODUCT_AWARE", "MOST_AWARE"];
const FEASIBILITY_OPTIONS = ["EASY", "MEDIUM", "HARD"];
const INDUSTRY_OPTIONS = ["DTC", "SAAS", "RETAIL", "B2B", "BEAUTY", "HEALTH"];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: ImageGPTProfile | null;
}

export function EditImageGPTModal({ open, onOpenChange, profile }: Props) {
  const [state, setState] = useState<EditState>({
    name: "",
    prompt: "",
    feasibility: "EASY",
    industries: ["DTC"],
    visualStyles: ["MINIMALIST_MODERN", "VALUE_BUDGET"],
    funnelStages: ["PRODUCT_AWARE", "MOST_AWARE"],
    image: null,
  });

  useEffect(() => {
    if (profile) {
      setState({
        name: `${profile.title} ${profile.subtitle}`,
        prompt:
          "Create an ingredient and benefit infographic ad with centered product bottle, clean geometric blocks, and percentage-based proof points.",
        feasibility: profile.feasibility.toUpperCase(),
        industries: ["DTC"],
        visualStyles: ["MINIMALIST_MODERN", "VALUE_BUDGET"],
        funnelStages: ["PRODUCT_AWARE", "MOST_AWARE"],
        image: profile.image,
      });
    }
  }, [profile]);

  const removeFrom = (key: "industries" | "visualStyles" | "funnelStages", value: string) => {
    setState((s) => ({ ...s, [key]: s[key].filter((v) => v !== value) }));
  };

  const addTo = (key: "industries" | "visualStyles" | "funnelStages", value: string) => {
    setState((s) => (s[key].includes(value) ? s : { ...s, [key]: [...s[key], value] }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Edit Image GPT profile</h2>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-6">
          {/* Profile picture */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Profile picture (optional)</Label>
            <div className="bg-primary/5 rounded-xl p-4 flex items-center gap-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-lg overflow-hidden bg-background border">
                  {state.image && (
                    <img src={state.image} alt="profile" className="h-full w-full object-cover" />
                  )}
                </div>
                {state.image && (
                  <button
                    onClick={() => setState((s) => ({ ...s, image: null }))}
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="text-sm">
                <div className="font-medium text-foreground">Karen V.</div>
                <div className="flex items-center gap-0.5 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Profile details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Profile details</h3>
              <Badge className="bg-primary/15 text-primary hover:bg-primary/15 text-[10px] font-bold tracking-wide">AI READY</Badge>
            </div>

            <Field label="Name" required>
              <Input
                value={state.name}
                onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
                className="rounded-lg"
              />
            </Field>

            <Field label="Prompt" required>
              <Textarea
                value={state.prompt}
                onChange={(e) => setState((s) => ({ ...s, prompt: e.target.value }))}
                className="rounded-lg min-h-[100px]"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Design feasibility">
                <div className="relative">
                  <Select
                    value={state.feasibility}
                    onValueChange={(v) => setState((s) => ({ ...s, feasibility: v }))}
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FEASIBILITY_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Field>

              <Field label="Industry types">
                <MultiSelect
                  values={state.industries}
                  options={INDUSTRY_OPTIONS}
                  onAdd={(v) => addTo("industries", v)}
                  onRemove={(v) => removeFrom("industries", v)}
                  placeholder="Add industry"
                />
              </Field>
            </div>

            <Field label="Visual styles">
              <MultiSelect
                values={state.visualStyles}
                options={VISUAL_STYLE_OPTIONS}
                onAdd={(v) => addTo("visualStyles", v)}
                onRemove={(v) => removeFrom("visualStyles", v)}
                placeholder="Add visual style"
              />
            </Field>

            <Field label="Funnel stages">
              <MultiSelect
                values={state.funnelStages}
                options={FUNNEL_STAGE_OPTIONS}
                onAdd={(v) => addTo("funnelStages", v)}
                onRemove={(v) => removeFrom("funnelStages", v)}
                placeholder="Add funnel stage"
              />
            </Field>
          </div>

          {/* Summary tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            <SummaryTag>{state.visualStyles.length} VISUAL STYLES</SummaryTag>
            <SummaryTag>{state.funnelStages.length} FUNNEL STAGES</SummaryTag>
            <SummaryTag>{state.industries.length} INDUSTRIES</SummaryTag>
          </div>
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
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide">
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
            "bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide",
          )}
        >
          {v}
          <button
            onClick={() => onRemove(v)}
            className="hover:bg-primary/20 rounded-full p-0.5"
          >
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
