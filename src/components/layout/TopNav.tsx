import { Bell, HelpCircle, ChevronDown, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const brands = [
  { name: "Acme Co", color: "hsl(243 75% 59%)" },
  { name: "Beta Brand", color: "hsl(152 60% 42%)" },
  { name: "Gamma Inc", color: "hsl(25 95% 55%)" },
];

export function TopNav() {
  const [activeBrand, setActiveBrand] = useState(brands[0]);

  return (
    <header className="h-14 border-b glass flex items-center justify-between px-4 shrink-0 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="flex items-center gap-1.5">
          <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight font-['Space_Grotesk']">Adomate</span>
        </div>
        <span className="mx-1 h-5 w-px bg-border" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 font-medium">
              <span
                className="h-5 w-5 rounded-md text-[10px] font-bold text-white flex items-center justify-center"
                style={{ background: activeBrand.color }}
              >
                {activeBrand.name[0]}
              </span>
              {activeBrand.name}
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {brands.map((b) => (
              <DropdownMenuItem key={b.name} onClick={() => setActiveBrand(b)} className="gap-2">
                <span
                  className="h-5 w-5 rounded-md text-[10px] font-bold text-white flex items-center justify-center"
                  style={{ background: b.color }}
                >
                  {b.name[0]}
                </span>
                {b.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 text-muted-foreground text-xs border border-border rounded-lg px-3 h-8">
          <Search className="h-3.5 w-3.5" />
          <span>Search...</span>
          <kbd className="ml-3 inline-flex h-5 items-center rounded border bg-muted px-1.5 text-[10px] font-mono text-muted-foreground">⌘K</kbd>
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
        </Button>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
