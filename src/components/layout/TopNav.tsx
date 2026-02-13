import { Bell, HelpCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const brands = ["Acme Co", "Beta Brand", "Gamma Inc"];

export function TopNav() {
  const [activeBrand, setActiveBrand] = useState(brands[0]);

  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <span className="text-lg font-bold tracking-tight text-primary">Adomate</span>
        <span className="mx-2 text-border">|</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 font-medium">
              {activeBrand}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {brands.map((b) => (
              <DropdownMenuItem key={b} onClick={() => setActiveBrand(b)}>
                {b}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
