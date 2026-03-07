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
    <>
      <button
        onClick={toggleSidebar}
        className="fixed z-50 h-8 w-4 rounded-r-md border border-border bg-sidebar flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
        style={{
          left: sidebarEdge,
          top: "50%",
          transform: "translateY(-50%)",
          borderLeft: "none",
        }}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
      {/* Cover to hide sidebar border behind the notch */}
      <div
        className="fixed z-40 w-px bg-sidebar pointer-events-none transition-all duration-200"
        style={{
          left: `calc(${sidebarEdge} - 1px)`,
          top: "50%",
          transform: "translateY(-50%)",
          height: "32px",
        }}
      />
    </>
  );
}

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full">
        <TopNav />
        <div className="flex flex-1 w-full overflow-hidden">
          <AppSidebar />
          <SidebarToggleNotch />
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
