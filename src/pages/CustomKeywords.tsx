import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { useState } from "react";

const initialKeywords: Record<string, string[]> = {
  "Brand Terms": ["acme ads", "acme creative", "acme ai"],
  "Competitor Terms": ["canva ads", "smartly.io", "pencil ai", "adcreative"],
  "Industry Terms": ["ai ad generation", "creative automation", "performance creative", "ugc ads", "meta ads optimization", "dynamic creative", "ad variations", "creative testing", "roas optimization", "ad copy ai", "social media ads"],
};

export default function CustomKeywords() {
  const [keywords] = useState(initialKeywords);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Custom Keywords</h1>
          <p className="text-muted-foreground text-sm">Track keywords across categories for competitive intelligence.</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Category</Button>
      </div>
      {Object.entries(keywords).map(([cat, kws]) => (
        <Card key={cat}>
          <CardHeader className="pb-2"><CardTitle className="text-base">{cat}</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-3">
              {kws.map((kw) => (
                <Badge key={kw} variant="secondary" className="gap-1 pr-1">
                  {kw}
                  <button className="ml-1 rounded-full hover:bg-muted p-0.5"><X className="h-3 w-3" /></button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Add keyword…" className="max-w-xs h-8 text-sm" />
              <Button size="sm" variant="outline">Add</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
