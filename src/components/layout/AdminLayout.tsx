import { Outlet } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { TopNav } from "./TopNav";
import { AdminSidebar } from "./AdminSidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";

function SidebarToggleNotch() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const sidebarEdge = collapsed ? "3rem" : "16rem";

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed z-50 h-8 w-4 rounded-r-md border border-primary/20 bg-accent flex items-center justify-center text-primary/60 hover:text-primary hover:bg-primary/10 transition-all duration-200"
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

export function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full">
        <TopNav />
        <div className="flex flex-1 w-full overflow-hidden">
          <AdminSidebar />
          <SidebarToggleNotch />
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
