import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Credits() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Credits</h1>
        <p className="text-muted-foreground text-sm mt-1">Your company credit pool is used to run workflows and generate outputs.</p>
      </div>

      <Card className="border border-border/60">
        <CardContent className="p-6 flex items-center justify-between">
          <p className="text-base">
            <span className="font-semibold">Credits:</span>{" "}
            <span className="text-primary font-bold">0</span>
          </p>
          <div className="text-right">
            <p className="font-semibold">Buy credits</p>
            <p className="text-sm text-muted-foreground">100 credits for €100.00 (one-time)</p>
            <Button size="sm" className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground">Buy</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/60">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Purchase history</p>
            <Badge variant="outline" className="text-[10px] font-semibold">0 TOTAL</Badge>
          </div>
          <Separator className="my-3" />
          <p className="text-sm text-muted-foreground">No purchases yet.</p>
        </CardContent>
      </Card>
    </div>
  );
}
