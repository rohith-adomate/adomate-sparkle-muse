import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Onboarding } from "@/pages/Onboarding";
import { ChevronLeft, ChevronRight, ArrowLeft, X } from "lucide-react";

const stepLabels = ["Goals", "Website", "Brand", "Product", "Launch"];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isScraping, setIsScraping] = useState(false);
  const navigate = useNavigate();

  const progress = (currentStep / stepLabels.length) * 100;

  const handleNext = () => {
    if (currentStep === 5) {
      navigate("/");
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const handleScraping = useCallback((v: boolean) => setIsScraping(v), []);

  const showFooterNav = currentStep !== 2 || isScraping;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 shrink-0">
        <div />

        {/* Step pills */}
        <div className="flex items-center gap-0.5 overflow-x-auto">
          {stepLabels.map((label, i) => {
            const isActive = i + 1 === currentStep;
            const isDone = i + 1 < currentStep;
            return (
              <div key={i} className="flex items-center shrink-0">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : isDone
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                }`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${isDone ? "bg-primary/20" : ""}`}>
                    {isDone ? "✓" : i + 1}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={`w-4 h-px mx-0.5 ${isDone ? "bg-primary/30" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>

        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground shrink-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted w-full overflow-hidden shrink-0">
        <div
          className="h-full gradient-primary transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] rounded-r-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <Onboarding step={currentStep} setStep={setCurrentStep} onScraping={handleScraping} />
        </div>
      </div>

      {/* Footer */}
      {showFooterNav && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-muted/20 shrink-0">
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
            {currentStep !== 5 && currentStep !== 1 && currentStep !== 2 && (
              <Button variant="ghost" size="sm" onClick={handleNext} className="text-muted-foreground hover:text-foreground">
                Skip
              </Button>
            )}
            {!isScraping && (
              <Button size="sm" onClick={handleNext} className="gap-1.5 px-6 shadow-sm">
                {currentStep === 5 ? "Launch into Adomate ✨" : <>Continue <ChevronRight className="h-4 w-4" /></>}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
