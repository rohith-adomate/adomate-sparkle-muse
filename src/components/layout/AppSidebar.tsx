import {
  Home, Database, Lightbulb, Palette, FileText,
  Workflow, Settings, BookOpen, Package, Users, Link2, Swords,
  ChevronRight, User, CreditCard,
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


const dataRoomSubs = [
  { title: "Brand Knowledge", url: "/brand-data-room/knowledge", icon: BookOpen },
  { title: "Products", url: "/brand-data-room/products", icon: Package },
  { title: "Customer Personas", url: "/brand-data-room/personas", icon: Users },
  { title: "Competitors", url: "/brand-data-room/competitors", icon: Swords },
  { title: "Meta Integration", url: "/brand-data-room/meta", icon: Link2 },
];

const coreNav = [
  { title: "Concepts", url: "/concepts", icon: Lightbulb },
  { title: "Studio", url: "/studio", icon: Palette },
  { title: "Content", url: "/content", icon: FileText },
];

const linkCls = "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-150 hover:bg-muted text-muted-foreground hover:text-foreground";
const activeCls = "bg-sidebar-accent text-sidebar-accent-foreground font-medium border border-sidebar-primary/20";

function SidebarNavItem({ item, collapsed }: { item: { title: string; url: string; icon: React.ElementType }; collapsed: boolean }) {
  const link = (
    <NavLink to={item.url} end={item.url === "/"} className={cn(linkCls, collapsed && "justify-center px-0")} activeClassName={activeCls}>
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

export function AppSidebar() {
  const { pathname } = useLocation();
  const nav = useNavigate();
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const inDataRoom = pathname.startsWith("/brand-data-room");

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent className="pb-3 flex flex-col h-full">
        {/* Top group: Home + Workflows */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Home">
                  <SidebarNavItem item={{ title: "Home", url: "/", icon: Home }} collapsed={collapsed} />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Workflows">
                  <SidebarNavItem item={{ title: "Workflows", url: "/workflows", icon: Workflow }} collapsed={collapsed} />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="mx-3 w-auto my-1" />

        {/* Core nav */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {coreNav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <SidebarNavItem item={item} collapsed={collapsed} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="mx-3 w-auto my-1" />

        {/* Data Room + Settings */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {collapsed ? (
                /* Collapsed: show just the icon with tooltip */
                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink
                        to="/brand-data-room"
                        className={cn(linkCls, "justify-center px-0")}
                        activeClassName={activeCls}
                      >
                        <Database className="h-4 w-4 shrink-0" />
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">Data Room</TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              ) : (
                /* Expanded: collapsible with sub-items */
                <li>
                  <Collapsible defaultOpen={inDataRoom}>
                    <CollapsibleTrigger
                      className={cn(linkCls, "w-full justify-between group/dr", inDataRoom && "text-sidebar-accent-foreground font-medium")}
                      onClick={() => nav("/brand-data-room")}
                    >
                      <span className="flex items-center gap-2.5">
                        <Database className="h-4 w-4" />
                        <span>Data Room</span>
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]/dr:rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul className="ml-[18px] mt-1 space-y-0.5 border-l border-sidebar-border pl-3">
                        {dataRoomSubs.map((sub) => (
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

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <SidebarNavItem item={{ title: "Settings", url: "/settings", icon: Settings }} collapsed={collapsed} />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Credits widget */}
        <div className="mt-auto">
          <div className="px-3 py-2">
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => nav("/credits")}
                    className="w-full rounded-xl bg-primary/10 px-2 py-2 flex items-center justify-center hover:bg-primary/15 transition-colors"
                  >
                    <span className="text-xs font-medium text-primary">Buy credits</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Credits</TooltipContent>
              </Tooltip>
            ) : (
              <button
                onClick={() => nav("/credits")}
                className="w-full rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5 flex items-center justify-between hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Credits</span>
                  <span className="text-sm font-bold text-primary">0</span>
                </div>
                <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-lg">Buy credits</span>
              </button>
            )}
          </div>

          {/* User avatar */}
          <div className="px-3 py-3 border-t border-sidebar-border">
            <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-2.5")}>
              <div className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center shadow-sm shrink-0">
                <span className="text-sm font-bold text-background">N</span>
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Ankit Kumar</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
