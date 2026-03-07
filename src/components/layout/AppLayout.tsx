import { Outlet } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { TopNav } from "./TopNav";
import { AppSidebar } from "./AppSidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";

function SidebarToggleEdge() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <button
      onClick={toggleSidebar}
      className="fixed top-1/2 -translate-y-1/2 z-30 h-6 w-6 rounded-full border border-border bg-background shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
      style={{ left: collapsed ? "calc(3rem - 12px)" : "calc(16rem - 12px)" }}
      aria-label="Toggle sidebar"
    >
      {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
    </button>
  );
}

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full">
        <TopNav />
        <div className="flex flex-1 w-full overflow-hidden relative">
          <AppSidebar />
          <SidebarToggleEdge />
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
