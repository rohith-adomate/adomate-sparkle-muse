import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, TrendingUp, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const initialKeywords: Record<string, { words: string[]; color: string }> = {
  "Brand Terms": { words: ["acme ads", "acme creative", "acme ai"], color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  "Competitor Terms": { words: ["canva ads", "smartly.io", "pencil ai", "adcreative"], color: "bg-rose-100 text-rose-700 border-rose-200" },
  "Industry Terms": { words: ["ai ad generation", "creative automation", "performance creative", "ugc ads", "meta ads optimization", "dynamic creative", "ad variations", "creative testing", "roas optimization", "ad copy ai", "social media ads"], color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

const trending = ["ugc ads", "creative automation", "roas optimization"];

function keywordSize(kw: string, allKws: string[]): string {
  const idx = allKws.indexOf(kw);
  if (idx < 2) return "text-sm py-1.5 px-3";
  if (idx < 5) return "text-xs py-1 px-2.5";
  return "text-[11px] py-0.5 px-2";
}

export default function CustomKeywords() {
  const [keywords] = useState(initialKeywords);

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <div className="space-y-6 max-w-3xl relative">
          {/* NOT FOR MVP Banner */}
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500 shrink-0" />
            <div>
              <p className="font-bold text-red-700 text-sm">NOT FOR MVP — DO NOT IMPLEMENT</p>
              <p className="text-red-600 text-xs mt-0.5">This feature is planned for a future release. The UI below is for reference only. Skip this section during MVP development.</p>
            </div>
          </div>

          <Breadcrumbs items={[{ label: "Brand Data Room", href: "/brand-data-room" }, { label: "Custom Keywords" }]} />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Custom Keywords</h1>
              <p className="text-muted-foreground text-sm">Track keywords across categories for competitive intelligence.</p>
            </div>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Category</Button>
          </div>
          {Object.entries(keywords).map(([cat, { words, color }]) => (
            <Card key={cat}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base section-header">{cat}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {words.map((kw) => (
                    <Badge key={kw} variant="outline" className={`gap-1.5 pr-1 border ${color} ${keywordSize(kw, words)} transition-all hover:scale-105 cursor-default`}>
                      {kw}
                      {trending.includes(kw) && <TrendingUp className="h-3 w-3 text-emerald-600" />}
                      <button className="ml-0.5 rounded-full hover:bg-black/10 p-0.5"><X className="h-2.5 w-2.5" /></button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Add keyword..." className="max-w-xs h-8 text-sm" />
                  <Button size="sm" variant="outline">Add</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-red-600 text-white border-red-700 font-bold text-sm px-4 py-2">
        NOT FOR MVP — DO NOT IMPLEMENT
      </TooltipContent>
    </Tooltip>
  );
}
