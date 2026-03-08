import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";

const purchases = [
  { date: "3/8/2026", time: "12:56 PM", status: "PROCESSING", credits: 100, amount: "€100.00", invoice: "—" },
  { date: "3/8/2026", time: "12:37 PM", status: "PROCESSING", credits: 100, amount: "€100.00", invoice: "—" },
];

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
            <Button size="sm" className="mt-2">Buy</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/60">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold">Purchase history</p>
            <Badge variant="outline" className="text-[10px] font-semibold">{purchases.length} TOTAL</Badge>
          </div>
          <div className="rounded-lg border border-border/60 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-semibold text-foreground">Date</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                  <TableHead className="font-semibold text-foreground">Credits</TableHead>
                  <TableHead className="font-semibold text-foreground">Amount</TableHead>
                  <TableHead className="font-semibold text-foreground">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="text-sm font-medium">{p.date}</div>
                      <div className="text-xs text-muted-foreground">{p.time}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-100 text-[10px] font-bold mb-1">
                        {p.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">Payment is still processing. Credits may take a moment to appear.</p>
                    </TableCell>
                    <TableCell className="font-medium">{p.credits}</TableCell>
                    <TableCell>{p.amount}</TableCell>
                    <TableCell className="text-muted-foreground">{p.invoice}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
