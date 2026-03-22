import { ChevronDown, Rocket, Loader2, Save } from "lucide-react";
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

      <SaveIndicator state={saveState} />

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
