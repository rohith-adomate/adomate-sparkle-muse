import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AdminUsers() {
  const nav = useNavigate();
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Card className="border border-border/60">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">This admin section is still being prepared. Return to the Admin home dashboard to continue with available tools.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => nav("/admin")}>Go to Admin Home</Button>
        </CardContent>
      </Card>
    </div>
  );
}
