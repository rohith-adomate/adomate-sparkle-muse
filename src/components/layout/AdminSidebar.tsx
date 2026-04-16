import {
  Home, Users, Crown, CreditCard, Settings, Building2,
  Swords, Image, Code2, BarChart3,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";

const topNav = [
  { title: "Home", url: "/admin", icon: Home },
  { title: "Admins", url: "/admin/admins", icon: Crown },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Companies & Brands", url: "/admin/dashboards/companies", icon: Building2 },
  { title: "Competitors", url: "/admin/competitors", icon: Swords },
  { title: "Competitor Ads", url: "/admin/competitor-ads", icon: BarChart3 },
  { title: "Credits", url: "/admin/credits", icon: CreditCard },
  { title: "Image GPTs", url: "/admin/image-gpts", icon: Image },
];

const bottomNav = [
  { title: "Dev & QA Tools", url: "/admin/dev-qa-tools", icon: Code2 },
];

const linkCls = "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-150 hover:bg-primary/15 text-foreground/70 hover:text-foreground";
const activeCls = "bg-primary/20 text-primary font-semibold border border-primary/30";

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
  

  return (
    <Sidebar
      collapsible="icon"
      className="border-r admin-sidebar"
    >
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

        <Separator className="mx-3 w-auto my-1 bg-primary/20" />

        {/* Bottom nav items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomNav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <AdminNavItem item={item} collapsed={collapsed} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User avatar at bottom */}
        <div className="mt-auto px-3 py-3 border-t border-primary/20">
          <button
            onClick={() => nav("/")}
            className={cn("w-full flex items-center cursor-pointer hover:opacity-80 transition-opacity", collapsed ? "justify-center" : "gap-2.5")}
          >
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-sm shrink-0">
              <span className="text-sm font-bold text-primary-foreground">N</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium truncate text-foreground">Ankit Kumar</p>
                <p className="text-[11px] text-muted-foreground truncate">ankit@adomate.com</p>
              </div>
            )}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
