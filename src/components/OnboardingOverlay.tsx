import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Onboarding } from "@/pages/Onboarding";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const stepLabels = ["Basic Info", "AI History", "Brand Review", "Connect Meta", "Upload Assets", "Visual Style", "Launch"];

interface OnboardingOverlayProps {
  onComplete: () => void;
}

export function OnboardingOverlay({ onComplete }: OnboardingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isScraping, setIsScraping] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const progress = (currentStep / stepLabels.length) * 100;

  const handleNext = () => {
    if (currentStep === 7) {
      onComplete();
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 7));
    }
  };

  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const handleScraping = useCallback((v: boolean) => setIsScraping(v), []);

  // Step 1 has its own "Continue" button that triggers scrape → auto-advances
  const showFooterNav = currentStep !== 1 || isScraping;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-md"
        onClick={onComplete}
      />

      {/* Card */}
      <div
        className={`relative w-[90vw] max-w-4xl max-h-[88vh] bg-card rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.35)] border border-border/60 flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${mounted ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}`}
      >
        {/* Progress bar */}
        <div className="h-1 bg-muted w-full overflow-hidden">
          <div
            className="h-full gradient-primary transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] rounded-r-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2 border-b border-border/40">
          <div className="flex items-center gap-0.5 overflow-x-auto">
            {stepLabels.map((label, i) => {
              const isActive = i + 1 === currentStep;
              const isDone = i + 1 < currentStep;
              return (
                <div key={i} className="flex items-center shrink-0">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : isDone
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                  }`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${isDone ? "bg-primary/20" : ""}`}>
                      {isDone ? "✓" : i + 1}
                    </span>
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div className={`w-4 h-px mx-0.5 transition-colors duration-300 ${isDone ? "bg-primary/30" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
          <button
            onClick={onComplete}
            className="ml-3 p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <Onboarding step={currentStep} setStep={setCurrentStep} onScraping={handleScraping} />
        </div>

        {/* Footer */}
        {showFooterNav && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-muted/20">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              disabled={currentStep <= 1 || isScraping}
              className="gap-1 text-muted-foreground"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            <div className="flex items-center gap-3">
              {currentStep !== 7 && currentStep !== 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Skip
                </Button>
              )}
              {!isScraping && (
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="gap-1.5 px-6 shadow-sm"
                >
                  {currentStep === 7 ? (
                    "Launch into Adomate ✨"
                  ) : (
                    <>Continue <ChevronRight className="h-4 w-4" /></>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
