import { Outlet } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { TopNav } from "./TopNav";
import { AppSidebar } from "./AppSidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";

function SidebarToggleNotch() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const sidebarEdge = collapsed ? "3rem" : "16rem";

  return (
    <button
      onClick={toggleSidebar}
      className="fixed z-50 h-8 w-4 rounded-r-md border border-border bg-sidebar flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
      style={{
        left: sidebarEdge,
        top: "calc(50% - 16px)",
        borderLeft: "none",
        boxShadow: `inset 1px 0 0 0 hsl(var(--sidebar-background))`,
      }}
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
        <SidebarToggleNotch />
        {/* White cover to hide the sidebar border behind the notch */}
        <SidebarToggleNotchCover />
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

function SidebarToggleNotchCover() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const sidebarEdge = collapsed ? "3rem" : "16rem";

  return (
    <div
      className="fixed z-40 w-px bg-sidebar pointer-events-none transition-all duration-200"
      style={{
        left: `calc(${sidebarEdge} - 1px)`,
        top: "calc(50% - 16px)",
        height: "32px",
      }}
    />
  );
}
