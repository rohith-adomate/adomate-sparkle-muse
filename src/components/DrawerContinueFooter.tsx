import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerContinueFooterProps {
  onContinue?: () => void;
  label?: string;
  disabled?: boolean;
  /**
   * When true, uses absolute/sticky positioning suitable for drawers whose
   * SheetContent itself scrolls (no inner flex column). Defaults to false
   * (renders as a normal flex-row inside a flex-column drawer body).
   */
  sticky?: boolean;
  className?: string;
}

/**
 * Standard footer for node configuration drawers — gives users a clear
 * "next step" CTA so they can move forward without hunting for the X.
 */
export default function DrawerContinueFooter({
  onContinue,
  label = "Continue",
  disabled,
  sticky,
  className,
}: DrawerContinueFooterProps) {
  if (!onContinue) return null;
  const isFinish = label.toLowerCase() === "finish";
  return (
    <div
      className={cn(
        "border-t border-border bg-card/95 backdrop-blur px-5 py-3 flex justify-end",
        sticky && "sticky bottom-0 left-0 right-0 -mx-5 mt-6 px-5",
        className,
      )}
    >
      <Button
        size="sm"
        onClick={onContinue}
        disabled={disabled}
        className="h-8 text-xs gap-1.5"
      >
        {label}
        {isFinish ? <Check className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
      </Button>
    </div>
  );
}
