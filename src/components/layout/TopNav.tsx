import { ChevronDown, Rocket, Loader2, Save } from "lucide-react";
import adomateLogoSrc from "@/assets/adomate-logo.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSaveIndicator } from "@/contexts/SaveIndicatorContext";
import { FeedbackPopover } from "@/components/FeedbackPopover";

import oyLogoSrc from "@/assets/oy/oy-logo.png";

const brands = [
  { name: "Oy Care", logo: oyLogoSrc },
  { name: "Beta Brand", color: "hsl(152 60% 42%)" },
  { name: "Gamma Inc", color: "hsl(25 95% 55%)" },
];

function SaveIndicator({ state }: { state: string }) {
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
          <Save className="h-3 w-3 animate-scale-in" />
          Saved
        </>
      )}
    </div>
  );
}

export function TopNav() {
  const [activeBrand, setActiveBrand] = useState(brands[0]);
  const [isSwitching, setIsSwitching] = useState(false);
  const nav = useNavigate();

  const handleBrandSwitch = useCallback((b: typeof brands[0]) => {
    if (b.name === activeBrand.name) return;
    setIsSwitching(true);
    setActiveBrand(b);
    setTimeout(() => setIsSwitching(false), 800);
  }, [activeBrand.name]);
  const { saveState } = useSaveIndicator();

  return (
    <header className="h-14 border-b flex items-center justify-between px-4 shrink-0 sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <img src={adomateLogoSrc} alt="Adomate" className="h-7 w-auto" />
        <span className="mx-1 h-5 w-px bg-border" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 font-medium">
              {activeBrand.logo ? (
                <img src={activeBrand.logo} alt={activeBrand.name} className="h-5 w-5 rounded-md object-contain" />
              ) : (
                <span
                  className="h-5 w-5 rounded-md text-[10px] font-bold text-white flex items-center justify-center"
                  style={{ background: activeBrand.color }}
                >
                  {activeBrand.name[0]}
                </span>
              )}
              {activeBrand.name}
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {brands.map((b) => (
              <DropdownMenuItem key={b.name} onClick={() => setActiveBrand(b)} className="gap-2">
                {b.logo ? (
                  <img src={b.logo} alt={b.name} className="h-5 w-5 rounded-md object-contain" />
                ) : (
                  <span
                    className="h-5 w-5 rounded-md text-[10px] font-bold text-white flex items-center justify-center"
                    style={{ background: b.color }}
                  >
                    {b.name[0]}
                  </span>
                )}
                {b.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SaveIndicator state={saveState} />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => nav("/onboarding")} className="gap-1.5 text-muted-foreground hover:text-foreground">
          <Rocket className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Onboarding</span>
        </Button>
        <FeedbackPopover />
      </div>
    </header>
  );
}
