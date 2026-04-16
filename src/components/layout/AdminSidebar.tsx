import { useState } from "react";
import {
  Home, Users, Crown, CreditCard, Settings, BarChart3,
  Building2, ClipboardCheck, ChevronRight, Swords,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";

const topNav = [
  { title: "Home", url: "/admin", icon: Home },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Admins", url: "/admin/admins", icon: Crown },
  { title: "Competitors", url: "/admin/competitors", icon: Swords },
  { title: "Credits", url: "/admin/credits", icon: CreditCard },
  { title: "System Settings", url: "/admin/system-settings", icon: Settings },
];

const dashboardSubs = [
  { title: "Users overview", url: "/admin/dashboards/users", icon: Users },
  { title: "Companies & brands", url: "/admin/dashboards/companies", icon: Building2 },
  { title: "Onboarding QA", url: "/admin/dashboards/onboarding-qa", icon: ClipboardCheck },
];

const linkCls = "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-150 hover:bg-white/15 text-white/70 hover:text-white";
const activeCls = "bg-white/20 text-white font-semibold border border-white/30";

function AdminNavItem({ item, collapsed }: { item: { title: string; url: string; icon: React.ElementType }; collapsed: boolean }) {
  const link = (
    <NavLink to={item.url} end={item.url === "/admin"} className={cn(linkCls, collapsed && "justify-center px-0")} activeClassName={activeCls}>
      <item.icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{item.title}</span>}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" align="center">{item.title}</TooltipContent>
      </Tooltip>
    );
  }
  return link;
}

export function AdminSidebar() {
  const { pathname } = useLocation();
  const nav = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const inDashboards = pathname.startsWith("/admin/dashboards");

  return (
    <Sidebar
      collapsible="icon"
      className="border-r"
      style={{
        "--sidebar-background": "336 78% 50%",
        "--sidebar-foreground": "0 0% 100%",
        "--sidebar-border": "336 78% 40%",
        "--sidebar-accent": "336 78% 45%",
        "--sidebar-accent-foreground": "0 0% 100%",
        "--sidebar-primary": "0 0% 100%",
        "--sidebar-primary-foreground": "336 78% 50%",
      } as React.CSSProperties}
      <SidebarContent className="pb-3 flex flex-col h-full">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {topNav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <AdminNavItem item={item} collapsed={collapsed} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="mx-3 w-auto my-1" />

        {/* Dashboards */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {collapsed ? (
                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink to="/admin/dashboards/users" className={cn(linkCls, "justify-center px-0")} activeClassName={activeCls}>
                        <BarChart3 className="h-4 w-4 shrink-0" />
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">Dashboards</TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              ) : (
                <li>
                  <Collapsible defaultOpen={inDashboards}>
                    <CollapsibleTrigger
                      className={cn(linkCls, "w-full justify-between group/dash", inDashboards && "text-sidebar-accent-foreground font-medium")}
                    >
                      <span className="flex items-center gap-2.5">
                        <BarChart3 className="h-4 w-4" />
                        <span>Dashboards</span>
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]/dash:rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul className="ml-[18px] mt-1 space-y-0.5 border-l border-sidebar-border pl-3">
                        {dashboardSubs.map((sub) => (
                          <li key={sub.url}>
                            <NavLink to={sub.url} className={cn(linkCls, "text-xs py-1.5")} activeClassName={activeCls}>
                              <sub.icon className="h-3.5 w-3.5" />
                              <span>{sub.title}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                </li>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User avatar at bottom */}
        <div className="mt-auto px-3 py-3 border-t border-sidebar-border">
          <button
            onClick={() => nav("/")}
            className={cn("w-full flex items-center cursor-pointer hover:opacity-80 transition-opacity", collapsed ? "justify-center" : "gap-2.5")}
          >
            <div className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center shadow-sm shrink-0">
              <span className="text-sm font-bold text-background">N</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium truncate">Ankit Kumar</p>
                <p className="text-[11px] text-muted-foreground truncate">ankit@adomate.com</p>
              </div>
            )}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
