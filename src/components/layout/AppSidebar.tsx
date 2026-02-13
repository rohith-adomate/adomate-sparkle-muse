import {
  Home, Database, Megaphone, Lightbulb, Palette, FileText, CalendarDays,
  BarChart3, Workflow, Settings, BookOpen, Package, Users, Link2, Search,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const mainNav = [
  { title: "Home", url: "/", icon: Home },
];

const dataRoomSubs = [
  { title: "Brand Knowledge", url: "/brand-data-room/knowledge", icon: BookOpen },
  { title: "Products", url: "/brand-data-room/products", icon: Package },
  { title: "Customer Personas", url: "/brand-data-room/personas", icon: Users },
  { title: "Meta Integration", url: "/brand-data-room/meta", icon: Link2 },
  { title: "Custom Keywords", url: "/brand-data-room/keywords", icon: Search },
];

const bottomNav = [
  { title: "Campaigns", url: "/campaigns", icon: Megaphone },
  { title: "Concepts", url: "/concepts", icon: Lightbulb },
  { title: "Studio", url: "/studio", icon: Palette },
  { title: "Content", url: "/content", icon: FileText },
  { title: "Calendar", url: "/calendar", icon: CalendarDays },
  { title: "Performance", url: "/performance", icon: BarChart3 },
  { title: "Workflows", url: "/workflows", icon: Workflow },
  { title: "Settings", url: "/settings", icon: Settings },
];

const linkCls = "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent";
const activeCls = "bg-accent text-accent-foreground font-medium";

export function AppSidebar() {
  const { pathname } = useLocation();
  const inDataRoom = pathname.startsWith("/brand-data-room");

  return (
    <Sidebar collapsible="offcanvas" className="border-r">
      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={linkCls} activeClassName={activeCls}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Brand Data Room with collapsible sub-menu */}
              <li>
                <Collapsible defaultOpen={inDataRoom}>
                  <CollapsibleTrigger className={cn(linkCls, "w-full justify-between group/dr", inDataRoom && "text-accent-foreground font-medium")}>
                    <span className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <span>Brand Data Room</span>
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-data-[state=open]/dr:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className="ml-4 mt-0.5 space-y-0.5 border-l pl-2">
                      <li>
                        <NavLink to="/brand-data-room" end className={cn(linkCls, "text-xs")} activeClassName={activeCls}>
                          Overview
                        </NavLink>
                      </li>
                      {dataRoomSubs.map((sub) => (
                        <li key={sub.url}>
                          <NavLink to={sub.url} className={cn(linkCls, "text-xs")} activeClassName={activeCls}>
                            <sub.icon className="h-3.5 w-3.5" />
                            <span>{sub.title}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </li>

              {bottomNav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={linkCls} activeClassName={activeCls}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
