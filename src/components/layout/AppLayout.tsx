import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TopNav } from "./TopNav";
import { AppSidebar } from "./AppSidebar";
import { OnboardingOverlay } from "@/components/OnboardingOverlay";

export function AppLayout() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full">
        <TopNav />
        <div className="flex flex-1 w-full overflow-hidden">
          <AppSidebar />
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
      {showOnboarding && <OnboardingOverlay onComplete={() => setShowOnboarding(false)} />}
    </SidebarProvider>
  );
}
