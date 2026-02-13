import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Eye } from "lucide-react";

const colors = [
  { hex: "#6366F1", name: "Indigo" },
  { hex: "#0EA5E9", name: "Sky" },
  { hex: "#F97316", name: "Orange" },
];

export default function BrandKnowledge() {
  return (
    <div className="space-y-6 max-w-3xl">
      <Breadcrumbs items={[{ label: "Brand Data Room", href: "/brand-data-room" }, { label: "Brand Knowledge" }]} />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Brand Knowledge</h1>
        <p className="text-muted-foreground text-sm">Define your brand identity and visual style.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base section-header">Identity</CardTitle></CardHeader>
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
        <CardHeader><CardTitle className="text-base section-header">Visual Style</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Primary Colors</Label>
            <div className="flex gap-3">
              {colors.map((c) => (
                <button key={c.hex} className="flex items-center gap-2 rounded-xl border p-2 px-3 hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="h-8 w-8 rounded-lg shadow-inner" style={{ background: c.hex }} />
                  <div className="text-left">
                    <p className="text-xs font-medium">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground">{c.hex}</p>
                  </div>
                </button>
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

      {/* Brand Identity Preview */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            Brand Identity Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border-2 border-dashed border-border p-6 text-center space-y-3">
            <div className="flex justify-center gap-2">
              {colors.map((c) => (
                <div key={c.hex} className="h-10 w-10 rounded-lg" style={{ background: c.hex }} />
              ))}
            </div>
            <p className="text-lg font-bold font-['Space_Grotesk'] tracking-tight">Acme Co</p>
            <p className="text-sm text-muted-foreground italic">Confident, approachable, data-driven</p>
            <p className="text-xs text-muted-foreground">How your brand might appear in an ad creative</p>
          </div>
        </CardContent>
      </Card>

      <Button>Save Changes</Button>
    </div>
  );
}
