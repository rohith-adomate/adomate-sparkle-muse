import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Onboarding } from "@/pages/Onboarding";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const stepLabels = ["Basic Info", "Brand Review", "Connect Meta", "Upload Assets", "Visual Style", "Launch"];

interface OnboardingOverlayProps {
  onComplete: () => void;
}

export function OnboardingOverlay({ onComplete }: OnboardingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isScraping, setIsScraping] = useState(false);

  const progress = (currentStep / stepLabels.length) * 100;

  const handleNext = () => {
    if (currentStep === 6) {
      onComplete();
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const handleScraping = useCallback((v: boolean) => setIsScraping(v), []);

  // Step 1 has its own "Continue" button that triggers scrape → auto-advances
  const showFooterNav = currentStep !== 1 || isScraping;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative w-[90vw] max-w-4xl max-h-[85vh] bg-card rounded-2xl shadow-2xl border flex flex-col overflow-hidden">
        {/* Progress bar */}
        <div className="h-1.5 bg-muted w-full">
          <div className="h-full gradient-primary transition-all duration-500 ease-out rounded-r-full" style={{ width: `${progress}%` }} />
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <div className="flex items-center gap-1">
            {stepLabels.map((label, i) => (
              <div key={i} className="flex items-center">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  i + 1 === currentStep ? "bg-primary text-primary-foreground" : i + 1 < currentStep ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                }`}>
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold">
                    {i + 1 < currentStep ? "✓" : i + 1}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </div>
                {i < stepLabels.length - 1 && <div className="w-4 h-px bg-border mx-0.5" />}
              </div>
            ))}
          </div>
          <button onClick={onComplete} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Onboarding step={currentStep} setStep={setCurrentStep} onScraping={handleScraping} />
        </div>

        {/* Footer */}
        {showFooterNav && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <Button variant="ghost" size="sm" onClick={handleBack} disabled={currentStep <= 1 || isScraping} className="gap-1">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            <div className="flex items-center gap-3">
              {currentStep !== 6 && currentStep !== 1 && (
                <Button variant="ghost" size="sm" onClick={handleNext} className="text-muted-foreground">Skip</Button>
              )}
              {!isScraping && (
                <Button size="sm" onClick={handleNext} className="gap-1 px-6">
                  {currentStep === 6 ? "Launch into Adomate ✨" : <>Continue <ChevronRight className="h-4 w-4" /></>}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
