import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ImagePlus, Info } from "lucide-react";
import { HoverExplainer } from "./HoverExplainer";

interface ManualImageInputDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uploadedImages?: string[];
}

export default function ManualImageInputDrawer({ open, onOpenChange, uploadedImages = [] }: ManualImageInputDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[380px] sm:w-[420px] border-l border-border bg-card p-0 overflow-y-auto">
        <div className="p-5 space-y-5">
          <SheetHeader className="p-0 space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg p-2" style={{ background: "hsl(35 90% 55% / 0.12)" }}>
                <ImagePlus className="h-4 w-4" style={{ color: "hsl(35 90% 55%)" }} />
              </div>
              <SheetTitle className="text-base font-bold">Manual Image Input</SheetTitle>
            </div>
          </SheetHeader>

          <div className="rounded-lg border border-border bg-muted/40 p-3.5 flex items-start gap-2.5">
            <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-medium">Runtime image upload</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Images will be requested when you click <span className="font-semibold text-foreground">Run</span>. 
                This workflow cannot run on a schedule — it requires manual image input each time.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">How it works</p>
            <ol className="space-y-2 text-xs text-muted-foreground list-decimal list-inside">
              <li>Click the <span className="font-medium text-foreground">Run</span> button in the toolbar</li>
              <li>An upload dialog will appear for you to add images</li>
              <li>Uploaded images are passed to downstream nodes</li>
            </ol>
          </div>

          {uploadedImages.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Last run images ({uploadedImages.length})
              </p>
              <div className="grid grid-cols-3 gap-2">
                {uploadedImages.map((src, i) => (
                  <div key={i} className="aspect-square rounded-lg border border-border overflow-hidden bg-muted">
                    <img src={src} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <HoverExplainer text="Backend: When Run is clicked, uploaded images are stored temporarily and their references are injected into the workflow context as input_images[]. Downstream nodes like Generate Ad Variations receive these as base creatives for variation generation.">
            <p className="text-[10px] text-muted-foreground/60 italic cursor-help hover:text-muted-foreground transition-colors">
              Hover for backend details
            </p>
          </HoverExplainer>
        </div>
      </SheetContent>
    </Sheet>
  );
}
