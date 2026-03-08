import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type SaveState = "idle" | "saving" | "saved";

interface SaveIndicatorContextType {
  saveState: SaveState;
  triggerSave: () => void;
}

const SaveIndicatorContext = createContext<SaveIndicatorContextType>({
  saveState: "idle",
  triggerSave: () => {},
});

export function useSaveIndicator() {
  return useContext(SaveIndicatorContext);
}

export function SaveIndicatorProvider({ children }: { children: ReactNode }) {
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const triggerSave = useCallback(() => {
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2500);
    }, 800);
  }, []);

  return (
    <SaveIndicatorContext.Provider value={{ saveState, triggerSave }}>
      {children}
    </SaveIndicatorContext.Provider>
  );
}
