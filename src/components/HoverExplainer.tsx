import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ReactNode } from "react";

interface HoverExplainerProps {
  children: ReactNode;
  text: string;
  className?: string;
}

export function HoverExplainer({ children, text, className }: HoverExplainerProps) {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <div className={className}>{children}</div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs text-xs leading-relaxed bg-foreground text-background border-foreground">
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
}
