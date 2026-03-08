import { Bell, HelpCircle, ChevronDown, Rocket, Loader2, Check, Cloud, CloudOff, Save, CheckCircle2, RefreshCw } from "lucide-react";
import adomateLogoSrc from "@/assets/adomate-logo.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSaveIndicator } from "@/contexts/SaveIndicatorContext";

const brands = [
  { name: "Acme Co", color: "hsl(336 78% 50%)" },
  { name: "Beta Brand", color: "hsl(152 60% 42%)" },
  { name: "Gamma Inc", color: "hsl(25 95% 55%)" },
];

/* ── Animation Variant 1: Pill badge with spinner/check ── */
function SaveVariant1({ state }: { state: string }) {
  if (state === "idle") return null;
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
      state === "saving"
        ? "bg-primary/10 text-primary"
        : "bg-emerald-500/10 text-emerald-600"
    }`}>
      {state === "saving" ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          Saving
        </>
      ) : (
        <>
          <Check className="h-3 w-3 animate-scale-in" />
          Saved
        </>
      )}
    </div>
  );
}

/* ── Animation Variant 2: Cloud icon morphing ── */
function SaveVariant2({ state }: { state: string }) {
  if (state === "idle") return null;
  return (
    <div className="relative flex items-center justify-center w-8 h-8">
      {state === "saving" ? (
        <div className="animate-pulse">
          <Cloud className="h-5 w-5 text-primary" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          </div>
        </div>
      ) : (
        <div className="animate-scale-in">
          <Cloud className="h-5 w-5 text-emerald-500" />
          <div className="absolute inset-0 flex items-center justify-center mt-0.5">
            <Check className="h-2.5 w-2.5 text-emerald-500 stroke-[3]" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Animation Variant 3: Progress bar under text ── */
function SaveVariant3({ state }: { state: string }) {
  if (state === "idle") return null;
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`text-[11px] font-medium transition-colors duration-300 ${
        state === "saving" ? "text-muted-foreground" : "text-emerald-600"
      }`}>
        {state === "saving" ? "Saving..." : "Saved ✓"}
      </span>
      <div className="w-12 h-0.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            state === "saving"
              ? "w-2/3 bg-primary animate-pulse"
              : "w-full bg-emerald-500"
          }`}
        />
      </div>
    </div>
  );
}

/* ── Animation Variant 4: Rotating sync icon → checkmark ── */
function SaveVariant4({ state }: { state: string }) {
  if (state === "idle") return null;
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium">
      {state === "saving" ? (
        <div className="flex items-center gap-1.5 text-primary">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          <span>Syncing</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-emerald-600 animate-fade-in">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>All changes saved</span>
        </div>
      )}
    </div>
  );
}

/* ── Animation Variant 5: Minimal dot indicator ── */
function SaveVariant5({ state }: { state: string }) {
  if (state === "idle") return null;
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full transition-all duration-500 ${
        state === "saving"
          ? "bg-primary animate-pulse scale-110"
          : "bg-emerald-500 scale-100"
      }`} />
      <span className={`text-[11px] font-medium transition-colors duration-300 ${
        state === "saving" ? "text-muted-foreground" : "text-emerald-600"
      }`}>
        {state === "saving" ? "Saving" : "Saved"}
      </span>
    </div>
  );
}

export function TopNav() {
  const [activeBrand, setActiveBrand] = useState(brands[0]);
  const nav = useNavigate();
  const { saveState } = useSaveIndicator();

  return (
    <header className="h-14 border-b flex items-center justify-between px-4 shrink-0 sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <img src={adomateLogoSrc} alt="Adomate" className="h-7 w-auto" />
        <span className="mx-1 h-5 w-px bg-border" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 font-medium">
              <span
                className="h-5 w-5 rounded-md text-[10px] font-bold text-white flex items-center justify-center"
                style={{ background: activeBrand.color }}
              >
                {activeBrand.name[0]}
              </span>
              {activeBrand.name}
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {brands.map((b) => (
              <DropdownMenuItem key={b.name} onClick={() => setActiveBrand(b)} className="gap-2">
                <span
                  className="h-5 w-5 rounded-md text-[10px] font-bold text-white flex items-center justify-center"
                  style={{ background: b.color }}
                >
                  {b.name[0]}
                </span>
                {b.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Save animation variants — displayed side by side for comparison */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-0.5">
          <SaveVariant1 state={saveState} />
          {saveState !== "idle" && <span className="text-[9px] text-muted-foreground/50">1</span>}
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <SaveVariant2 state={saveState} />
          {saveState !== "idle" && <span className="text-[9px] text-muted-foreground/50">2</span>}
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <SaveVariant3 state={saveState} />
          {saveState !== "idle" && <span className="text-[9px] text-muted-foreground/50">3</span>}
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <SaveVariant4 state={saveState} />
          {saveState !== "idle" && <span className="text-[9px] text-muted-foreground/50">4</span>}
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <SaveVariant5 state={saveState} />
          {saveState !== "idle" && <span className="text-[9px] text-muted-foreground/50">5</span>}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={() => nav("/onboarding")} className="gap-1.5 text-muted-foreground hover:text-foreground">
          <Rocket className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Onboarding</span>
        </Button>
        <Button variant="ghost" size="icon" className="relative" onClick={() => nav("/notifications-spec")}>
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
        </Button>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
