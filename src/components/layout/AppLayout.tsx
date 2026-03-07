import { Outlet } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { TopNav } from "./TopNav";
import { AppSidebar } from "./AppSidebar";
import { ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen, ArrowLeftFromLine, ArrowRightFromLine, ChevronsLeft, ChevronsRight } from "lucide-react";

function SidebarToggleVariants() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const leftPos = collapsed ? "calc(3rem - 12px)" : "calc(16rem - 12px)";

  return (
    <>
      {/* Variant 1: Pill / elongated capsule */}
      <button
        onClick={toggleSidebar}
        className="fixed z-50 h-10 w-5 rounded-full border border-border bg-background shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
        style={{ left: leftPos, top: "calc(50% - 80px)" }}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Variant 2: Subtle line notch */}
      <button
        onClick={toggleSidebar}
        className="fixed z-50 h-8 w-4 rounded-r-md border border-l-0 border-border bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
        style={{ left: collapsed ? "3rem" : "16rem", top: "calc(50% - 30px)" }}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Variant 3: Current circle (original) */}
      <button
        onClick={toggleSidebar}
        className="fixed z-50 h-6 w-6 rounded-full border border-border bg-background shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
        style={{ left: leftPos, top: "calc(50%)" }}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Variant 4: Accent-tinted circle */}
      <button
        onClick={toggleSidebar}
        className="fixed z-50 h-7 w-7 rounded-full border-2 border-primary/30 bg-accent shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
        style={{ left: leftPos, top: "calc(50% + 40px)" }}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronsRight className="h-3.5 w-3.5" /> : <ChevronsLeft className="h-3.5 w-3.5" />}
      </button>

      {/* Variant 5: Ghost icon button */}
      <button
        onClick={toggleSidebar}
        className="fixed z-50 h-8 w-8 rounded-lg bg-transparent flex items-center justify-center text-muted-foreground/50 hover:text-foreground hover:bg-muted/80 transition-all duration-200"
        style={{ left: collapsed ? "calc(3rem - 16px)" : "calc(16rem - 16px)", top: "calc(50% + 80px)" }}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
      </button>
    </>
  );
}

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarToggleVariants />
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
