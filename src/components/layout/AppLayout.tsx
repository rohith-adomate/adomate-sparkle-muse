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
      className="fixed top-1/2 -translate-y-1/2 z-50 h-6 w-6 rounded-full border border-border bg-background shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
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
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarToggleEdge />
        <div className="flex flex-col flex-1 min-w-0">
          <TopNav />
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
