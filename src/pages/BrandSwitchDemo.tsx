import { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import oyLogoSrc from "@/assets/oy/oy-logo.png";

type Brand = { name: string; logo?: string; color?: string };
const brand1: Brand = { name: "Oy Care", logo: oyLogoSrc };
const brand2: Brand = { name: "Beta Brand", color: "hsl(152 60% 42%)" };

function BrandIcon({ brand, isSwitching }: { brand: Brand; isSwitching: boolean }) {
  return (
    <span className={`relative flex items-center justify-center h-5 w-5 transition-all duration-300 ${isSwitching ? "scale-90 opacity-60" : ""}`}>
      {isSwitching && (
        <span className="absolute inset-0 rounded-md border-2 border-primary/40 border-t-primary animate-spin" />
      )}
      {"logo" in brand && brand.logo ? (
        <img src={brand.logo} alt={brand.name} className="h-5 w-5 rounded-md object-contain" />
      ) : (
        <span
          className="h-5 w-5 rounded-md text-[10px] font-bold text-white flex items-center justify-center"
          style={{ background: ("color" in brand ? brand.color : undefined) as string }}
        >
          {brand.name[0]}
        </span>
      )}
    </span>
  );
}

function useSwitch() {
  const [active, setActive] = useState(brand1);
  const [switching, setSwitching] = useState(false);
  const toggle = useCallback(() => {
    setSwitching(true);
    setActive((p) => (p.name === brand1.name ? brand2 : brand1));
    setTimeout(() => setSwitching(false), 1200);
  }, []);
  return { active, switching, toggle };
}

/* ── Variation 1: Skeleton pulse replacing name ── */
function V1() {
  const { active, switching, toggle } = useSwitch();
  return (
    <Button variant="ghost" size="sm" className="gap-2 font-medium" onClick={toggle}>
      <BrandIcon brand={active} isSwitching={switching} />
      {switching ? (
        <Skeleton className="h-3.5 w-16 rounded-full" />
      ) : (
        <span>{active.name}</span>
      )}
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </Button>
  );
}

/* ── Variation 2: Shimmer gradient sweep ── */
function V2() {
  const { active, switching, toggle } = useSwitch();
  return (
    <Button variant="ghost" size="sm" className="gap-2 font-medium" onClick={toggle}>
      <BrandIcon brand={active} isSwitching={switching} />
      <span className="relative overflow-hidden">
        <span className={`transition-opacity duration-200 ${switching ? "opacity-30" : ""}`}>
          {active.name}
        </span>
        {switching && (
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent animate-[shimmer_1s_ease-in-out_infinite]" />
        )}
      </span>
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </Button>
  );
}

/* ── Variation 3: Blurred text ── */
function V3() {
  const { active, switching, toggle } = useSwitch();
  return (
    <Button variant="ghost" size="sm" className="gap-2 font-medium" onClick={toggle}>
      <BrandIcon brand={active} isSwitching={switching} />
      <span className={`transition-all duration-300 ${switching ? "blur-[4px] opacity-50" : "blur-0 opacity-100"}`}>
        {active.name}
      </span>
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </Button>
  );
}

/* ── Variation 4: Three bouncing dots ── */
function V4() {
  const { active, switching, toggle } = useSwitch();
  return (
    <Button variant="ghost" size="sm" className="gap-2 font-medium" onClick={toggle}>
      <BrandIcon brand={active} isSwitching={switching} />
      {switching ? (
        <span className="flex gap-0.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-primary"
              style={{ animation: `bounce 0.6s ${i * 0.15}s ease-in-out infinite` }}
            />
          ))}
        </span>
      ) : (
        <span>{active.name}</span>
      )}
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </Button>
  );
}

/* ── Variation 5: Typing cursor blink ── */
function V5() {
  const { active, switching, toggle } = useSwitch();
  return (
    <Button variant="ghost" size="sm" className="gap-2 font-medium" onClick={toggle}>
      <BrandIcon brand={active} isSwitching={switching} />
      {switching ? (
        <span className="flex items-center gap-px">
          <Skeleton className="h-3 w-10 rounded-sm" />
          <span className="h-4 w-[2px] bg-primary animate-[blink_0.8s_step-end_infinite]" />
        </span>
      ) : (
        <span>{active.name}</span>
      )}
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </Button>
  );
}

/* ── Variation 6: Slide-up swap ── */
function V6() {
  const { active, switching, toggle } = useSwitch();
  return (
    <Button variant="ghost" size="sm" className="gap-2 font-medium overflow-hidden" onClick={toggle}>
      <BrandIcon brand={active} isSwitching={switching} />
      <span className="relative h-4 overflow-hidden inline-flex items-center" style={{ minWidth: 60 }}>
        <span
          className="transition-all duration-500 ease-out"
          style={{
            transform: switching ? "translateY(-100%)" : "translateY(0)",
            opacity: switching ? 0 : 1,
          }}
        >
          {active.name}
        </span>
        {switching && (
          <span className="absolute inset-0 flex items-center">
            <span className="flex gap-1">
              <span className="h-3 w-3 rounded-full bg-muted animate-pulse" />
              <span className="h-3 w-8 rounded-full bg-muted animate-pulse" style={{ animationDelay: "0.1s" }} />
              <span className="h-3 w-5 rounded-full bg-muted animate-pulse" style={{ animationDelay: "0.2s" }} />
            </span>
          </span>
        )}
      </span>
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </Button>
  );
}

/* ── Variation 7: Progress bar underline ── */
function V7() {
  const { active, switching, toggle } = useSwitch();
  return (
    <Button variant="ghost" size="sm" className="gap-2 font-medium" onClick={toggle}>
      <BrandIcon brand={active} isSwitching={switching} />
      <span className="relative">
        <span className={`transition-opacity duration-200 ${switching ? "opacity-30" : ""}`}>
          {active.name}
        </span>
        {switching && (
          <span className="absolute bottom-0 left-0 h-[2px] w-full overflow-hidden rounded-full">
            <span className="block h-full bg-primary animate-[progress_1.2s_ease-in-out_infinite] rounded-full" />
          </span>
        )}
      </span>
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </Button>
  );
}

/* ── Variation 8: Morphing pill / skeleton with glow ── */
function V8() {
  const { active, switching, toggle } = useSwitch();
  return (
    <Button variant="ghost" size="sm" className="gap-2 font-medium" onClick={toggle}>
      <BrandIcon brand={active} isSwitching={switching} />
      {switching ? (
        <span className="relative h-5 w-16 rounded-full bg-muted/60 overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/15 to-transparent animate-[shimmer_1s_ease-in-out_infinite]" />
        </span>
      ) : (
        <span>{active.name}</span>
      )}
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </Button>
  );
}

const variations = [
  { comp: V1, label: "1 · Skeleton Pulse" },
  { comp: V2, label: "2 · Shimmer Sweep" },
  { comp: V3, label: "3 · Blur Text" },
  { comp: V4, label: "4 · Bouncing Dots" },
  { comp: V5, label: "5 · Typing Cursor" },
  { comp: V6, label: "6 · Slide-Up Swap" },
  { comp: V7, label: "7 · Progress Underline" },
  { comp: V8, label: "8 · Glow Pill" },
];

export default function BrandSwitchDemo() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Brand Switch Variations</h1>
      <p className="text-sm text-muted-foreground">Click each to trigger the switching animation</p>
      <div className="grid grid-cols-4 gap-4">
        {variations.map(({ comp: Comp, label }) => (
          <div key={label} className="border rounded-xl p-4 flex flex-col items-center gap-3 bg-card">
            <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
            <Comp />
          </div>
        ))}
      </div>
    </div>
  );
}
