import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function BrandKnowledge() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Brand Knowledge</h1>
        <p className="text-muted-foreground text-sm">Define your brand identity and visual style.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Identity</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Brand Name</Label>
            <Input defaultValue="Acme Co" />
          </div>
          <div className="space-y-1.5">
            <Label>Mission Statement</Label>
            <Textarea defaultValue="Empowering small businesses with AI-driven advertising that converts." rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label>Tone of Voice</Label>
            <Input defaultValue="Confident, approachable, data-driven" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Visual Style</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Primary Colors</Label>
            <div className="flex gap-3">
              {["#6366F1", "#0EA5E9", "#F97316"].map((c) => (
                <div key={c} className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-md border" style={{ background: c }} />
                  <span className="text-sm text-muted-foreground">{c}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Fonts</Label>
            <Input defaultValue="Inter, DM Sans" />
          </div>
          <div className="space-y-1.5">
            <Label>Imagery Guidelines</Label>
            <Textarea defaultValue="Prefer lifestyle photography with diverse models. Avoid stock-photo aesthetics. Use warm lighting." rows={3} />
          </div>
        </CardContent>
      </Card>

      <Button>Save Changes</Button>
    </div>
  );
}
