import { Card, CardContent } from "@/components/ui/card";

export default function AdminUsersOverview() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Card className="border border-border/60">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold tracking-tight">Users overview</h1>
          <p className="text-muted-foreground text-sm mt-1">All non-admin users in the app. "Credits used" is shown when the app has a defined credits tracking source-of-truth.</p>
        </CardContent>
      </Card>

      <Card className="border border-border/60">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">No non-admin users found.</p>
        </CardContent>
      </Card>
    </div>
  );
}
