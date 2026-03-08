import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Content() {
  const nav = useNavigate();

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="border border-border/60">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold tracking-tight">Content</h1>
          <p className="text-muted-foreground text-sm mt-1">
            This section is still being prepared. Use Home to continue working in Adomate for now.
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => nav("/")}>
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
