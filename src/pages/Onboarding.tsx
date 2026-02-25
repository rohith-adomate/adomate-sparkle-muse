import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HoverExplainer } from "@/components/HoverExplainer";
import {
  Loader2, Globe, Palette, Type, Image, Upload, Sparkles,
  ThumbsUp, ThumbsDown, Facebook, BarChart3, Users, TrendingUp,
  FileImage, Video, FileText, Check, MessageSquare, RefreshCw,
} from "lucide-react";

const stylePresets = [
  { id: "minimalist", label: "Minimalist", gradient: "from-gray-100 to-white" },
  { id: "bold", label: "Bold & Vibrant", gradient: "from-orange-400 to-pink-500" },
  { id: "luxury", label: "Luxury", gradient: "from-amber-200 to-yellow-900" },
  { id: "playful", label: "Playful", gradient: "from-cyan-300 to-purple-400" },
  { id: "corporate", label: "Corporate", gradient: "from-blue-800 to-indigo-900" },
  { id: "organic", label: "Organic", gradient: "from-green-300 to-emerald-600" },
  { id: "editorial", label: "Editorial", gradient: "from-neutral-200 to-stone-400" },
  { id: "retro", label: "Retro", gradient: "from-amber-400 to-red-600" },
];

const mockTopics = [
  { title: "Customer Success Story Spotlight", desc: "Showcase real results from your users. Social proof ads consistently outperform feature-focused ads by 2-3x.", tags: ["From website", "Industry trend"] },
  { title: "Problem-Agitation-Solution", desc: "Lead with the pain point your users face daily. This framework drives highest click-through rates.", tags: ["From website"] },
  { title: "Competitor Comparison", desc: "Position your unique advantages. Side-by-side ads perform well for consideration-stage prospects.", tags: ["Industry trend"] },
  { title: "Behind the Scenes", desc: "Show your team, culture, and process. Authenticity-driven content builds trust and brand affinity.", tags: ["From website"] },
  { title: "Feature Deep Dive", desc: "Highlight one specific feature that solves a pressing problem. Single-feature focus outperforms feature-list ads.", tags: ["From Meta data", "Industry trend"] },
  { title: "Limited Time Offer", desc: "Create urgency with a time-bound promotion. Urgency-driven CTAs see 30% higher conversion rates.", tags: ["From Meta data"] },
  { title: "User-Generated Content Style", desc: "Ads that look native to the platform. UGC-style creative outperforms polished ads by 2x on Meta.", tags: ["From Meta data", "Industry trend"] },
];

interface OnboardingProps {
  step: number;
  setStep: (step: number) => void;
  onScraping: (v: boolean) => void;
}

export function Onboarding({ step, setStep, onScraping }: OnboardingProps) {
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeProgress, setScrapeProgress] = useState(0);
  const [aiChatLink, setAiChatLink] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");

  const [brandDesc, setBrandDesc] = useState("");
  const [tone, setTone] = useState("");
  const [positioning, setPositioning] = useState("");

  const [selectedStyle, setSelectedStyle] = useState("minimalist");
  const [adFont, setAdFont] = useState("DM Sans");
  const [adHeadline, setAdHeadline] = useState("Transform Your Business Today");
  const [adBody, setAdBody] = useState("Discover how AI-powered advertising can 10x your creative output.");
  const [adCta, setAdCta] = useState("Get Started");

  const [revealedTopics, setRevealedTopics] = useState<number[]>([]);

  const scrapeSteps = ["Extracting brand info...", "Detecting colors & fonts...", "Reading product pages...", "Analyzing tone of voice..."];

  // Derive a screenshot URL from the entered website for the scraping animation
  const screenshotUrl = website
    ? `https://picsum.photos/seed/${encodeURIComponent(website)}/600/400`
    : null;

  useEffect(() => { onScraping(isScraping); }, [isScraping, onScraping]);

  // Handle Continue on Step 1 → scrape simulation
  useEffect(() => {
    if (step === 1 && isScraping) {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setScrapeProgress(i);
        if (i >= scrapeSteps.length) {
          clearInterval(interval);
          setTimeout(() => {
            // Extract a company name from the URL
            try {
              const hostname = new URL(website.startsWith("http") ? website : `https://${website}`).hostname;
              const name = hostname.replace(/^www\./, "").split(".")[0];
              setCompanyName(name.charAt(0).toUpperCase() + name.slice(1));
            } catch {
              setCompanyName("Your Brand");
            }
            setBrandDesc("An innovative company pushing the boundaries of modern advertising.");
            setTone("Professional yet approachable, with a focus on clarity and impact.");
            setPositioning("The AI-first platform for modern marketing teams.");
            setIsScraping(false);
            setStep(2); // → Brand Review
          }, 600);
        }
      }, 700);
      return () => clearInterval(interval);
    }
  }, [isScraping, step]);

  // Step 7 (Wow Moment) reveal
  useEffect(() => {
    if (step === 5) {
      setRevealedTopics([]);
      const timers = mockTopics.map((_, i) =>
        setTimeout(() => setRevealedTopics(prev => [...prev, i]), 400 + i * 250)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [step]);

  const startScrape = () => {
    setScrapeProgress(0);
    setIsScraping(true);
  };

  // ─── Step 1: Website URL only ─────────────────────────────────────────────
  if (step === 1) {
    if (isScraping) {
      return (
        <div className="flex flex-col items-center gap-8 py-12 max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 w-full">
            {/* Screenshot preview */}
            {screenshotUrl && (
              <div className="relative w-full max-w-[320px] shrink-0">
                <div className="rounded-xl overflow-hidden border border-border/60 shadow-xl bg-muted">
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/80 border-b border-border/40">
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                    <span className="ml-2 text-[10px] text-muted-foreground truncate flex-1">{website}</span>
                  </div>
                  <img
                    src={screenshotUrl}
                    alt="Website preview"
                    className="w-full aspect-[3/2] object-cover"
                  />
                </div>
                {/* Scanning overlay */}
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10 animate-pulse" />
                  <div className="absolute top-0 left-0 right-0 h-1 gradient-primary animate-[scan_2s_ease-in-out_infinite]" />
                </div>
              </div>
            )}

            {/* Progress steps */}
            <div className="flex flex-col items-center md:items-start gap-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 scale-150 animate-glow" />
                <div className="relative h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shadow-xl animate-float">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                </div>
              </div>
              <div className="text-center md:text-left space-y-1">
                <p className="text-xl font-bold tracking-tight">Analyzing your website...</p>
                <p className="text-sm text-muted-foreground">We're reading your brand to pre-fill your setup</p>
              </div>
              <div className="space-y-3 w-full max-w-xs">
                {scrapeSteps.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{
                      opacity: i <= scrapeProgress ? 1 : 0.2,
                      transitionDelay: `${i * 150}ms`,
                      transform: i <= scrapeProgress ? "translateX(0)" : "translateX(-8px)",
                    }}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      i < scrapeProgress ? "bg-emerald-100" : i === scrapeProgress ? "bg-primary/10" : "bg-muted"
                    }`}>
                      {i < scrapeProgress
                        ? <Check className="h-3.5 w-3.5 text-emerald-600" />
                        : i === scrapeProgress
                          ? <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                          : <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                      }
                    </div>
                    <span className={i < scrapeProgress ? "text-foreground font-medium" : i === scrapeProgress ? "text-foreground" : "text-muted-foreground"}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-5 max-w-lg mx-auto animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center mb-4 shadow-lg">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome to Adomate</h2>
          <p className="text-muted-foreground mt-1">Enter your website and we'll do the rest</p>
        </div>
        <HoverExplainer text="Step 1 collects the website URL. On submit, POST /api/onboarding/scrape { url }. Backend uses Firecrawl to scrape website and LLM to extract brand data.">
          <div className="space-y-4">
            <div>
              <Label>Website URL</Label>
              <Input placeholder="https://acme.com" value={website} onChange={e => setWebsite(e.target.value)} className="mt-1.5" />
            </div>
            <Button className="w-full mt-2 shadow-sm" onClick={startScrape} disabled={!website.trim()}>
              Continue
            </Button>
          </div>
        </HoverExplainer>
      </div>
    );
  }

  // ─── Step 2: Brand Review (was step 3) ────────────────────────────────────
  if (step === 2) {
    return (
      <div className="space-y-6 overflow-y-auto max-h-[55vh] pr-2 animate-scale-in">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Brand Review</h2>
          <p className="text-muted-foreground mt-1">We found this from your website — edit anything that's off</p>
        </div>
        <HoverExplainer text="Step 2 displays scraped results. All answers saved to brand_knowledge table via PUT /api/onboarding/brand-knowledge.">
          <div className="space-y-5">
            {/* Logo + Brand Name + Colors */}
            <div className="flex items-start gap-6">
              {/* Logo with hover overlay */}
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-2xl border-2 border-border bg-muted flex items-center justify-center overflow-hidden shadow-sm">
                  <span className="text-2xl font-bold text-primary">{companyName.charAt(0) || "A"}</span>
                </div>
                <label className="absolute inset-0 rounded-2xl bg-foreground/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <RefreshCw className="h-5 w-5 text-white" />
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
              <div className="flex-1 space-y-3">
                <div><Label>Brand Name</Label><Input className="mt-1.5" value={companyName} onChange={e => setCompanyName(e.target.value)} /></div>
                <div>
                  <Label>Detected Colors</Label>
                  <div className="flex gap-2 mt-2">
                    {["#6366f1", "#ec4899", "#f59e0b", "#10b981"].map(c => (
                      <div key={c} className="w-8 h-8 rounded-lg border cursor-pointer hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div><Label>Description</Label><Textarea className="mt-1.5" value={brandDesc} onChange={e => setBrandDesc(e.target.value)} rows={2} /></div>
            <div><Label>Tone of Voice</Label><Textarea className="mt-1.5" value={tone} onChange={e => setTone(e.target.value)} rows={2} /></div>

            {/* Marketing Key-Value Terms */}
            <div className="space-y-3">
              <Label>Marketing Key Terms</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Input defaultValue="Unique Selling Point" className="text-xs font-semibold bg-muted/50 border-border/60" />
                  <Textarea defaultValue="AI-powered ad creation that delivers 10x faster creative output with zero design skills needed." rows={2} className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Input defaultValue="Target Audience" className="text-xs font-semibold bg-muted/50 border-border/60" />
                  <Textarea defaultValue="Small-to-medium business marketing teams looking to scale ad creative without hiring designers." rows={2} className="text-sm" />
                </div>
              </div>
            </div>
          </div>
        </HoverExplainer>
      </div>
    );
  }

  // ─── Step 3: Connect Meta ─────────────────────────────────────────────────
  if (step === 3) {
    return (
      <div className="flex flex-col items-center gap-8 py-4 animate-scale-in">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Connect your Meta Ad Account</h2>
          <p className="text-muted-foreground mt-1">Supercharge your AI ads with real performance data</p>
        </div>
        <HoverExplainer text="Step 4 initiates Meta OAuth. Backend: GET /api/auth/meta/connect. On callback, store access_token, ad_account_id in meta_integrations. Triggers async pull of top 50 ads for LLM topic generation in Step 7.">
          <div className="grid grid-cols-3 gap-4 max-w-xl">
            {[
              { icon: BarChart3, title: "Import best-performing ads", desc: "We analyze what already works for your brand" },
              { icon: Users, title: "Audience insights", desc: "Understand who engages with your content" },
              { icon: TrendingUp, title: "Performance benchmarks", desc: "Compare AI ads against your history" },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="p-4 text-center card-hover border-border/60">
                <div className="mx-auto mb-3 w-11 h-11 rounded-xl bg-accent flex items-center justify-center shadow-sm">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-muted-foreground mt-1">{desc}</p>
              </Card>
            ))}
          </div>
        </HoverExplainer>
        <Button className="gap-2 px-8 shadow-sm" size="lg"><Facebook className="h-5 w-5" /> Connect with Meta</Button>
        <p className="text-xs text-muted-foreground">You can always connect later from Brand Data Room → Meta Integration</p>
      </div>
    );
  }

  // ─── Step 4: Visual Style + Live Preview ──────────────────────────────────
  if (step === 4) {
    const preset = stylePresets.find(s => s.id === selectedStyle) || stylePresets[0];
    const isDarkText = selectedStyle === "minimalist" || selectedStyle === "editorial";
    return (
      <div className="grid grid-cols-2 gap-6 h-[58vh] animate-scale-in">
        <div className="space-y-5 overflow-y-auto pr-3">
          <h2 className="text-xl font-bold tracking-tight">Visual Style</h2>
          <HoverExplainer text="Step 6 saves visual preferences as brand_knowledge.visual_preset. Live preview is pure frontend React state.">
            <div className="space-y-5">
              <div>
                <Label className="mb-2 block">Style Preset</Label>
                <div className="grid grid-cols-4 gap-2">
                  {stylePresets.map(s => (
                    <button key={s.id} onClick={() => setSelectedStyle(s.id)} className={`rounded-lg p-0.5 border-2 transition-all duration-200 ${selectedStyle === s.id ? "border-primary ring-2 ring-primary/30 shadow-md" : "border-transparent hover:border-muted-foreground/30"}`}>
                      <div className={`h-12 rounded-md bg-gradient-to-br ${s.gradient}`} />
                      <p className="text-[10px] font-medium mt-1">{s.label}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Font</Label>
                <Select value={adFont} onValueChange={setAdFont}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["DM Sans", "Space Grotesk", "Inter", "Poppins", "Playfair Display", "Montserrat"].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Brand Colors</Label>
                <div className="flex gap-2 mt-1.5">
                  {["#6366f1", "#ec4899", "#f59e0b", "#10b981"].map(c => (
                    <div key={c} className="w-8 h-8 rounded-md border cursor-pointer hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div><Label>Headline</Label><Input className="mt-1.5" value={adHeadline} onChange={e => setAdHeadline(e.target.value)} /></div>
              <div><Label>Body Copy</Label><Textarea className="mt-1.5" rows={2} value={adBody} onChange={e => setAdBody(e.target.value)} /></div>
              <div><Label>CTA Text</Label><Input className="mt-1.5" value={adCta} onChange={e => setAdCta(e.target.value)} /></div>
            </div>
          </HoverExplainer>
        </div>

        {/* Live Ad Preview */}
        <div className="flex items-center justify-center">
          <div className="w-[270px] bg-foreground/90 rounded-[2.5rem] p-3 shadow-2xl ring-1 ring-white/10">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 h-4 w-16 rounded-full bg-foreground/80 z-10" />
            <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-card">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">{companyName?.[0] || "A"}</div>
                <span className="text-xs font-semibold">{companyName || "yourbrand"}</span>
                <span className="text-[10px] text-muted-foreground ml-auto">Sponsored</span>
              </div>
              <div className={`aspect-square bg-gradient-to-br ${preset.gradient} flex items-center justify-center p-6 relative overflow-hidden`}>
                <img
                  src="https://picsum.photos/seed/ad-preview/300/300"
                  alt="Ad preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                />
                <p className="text-center font-bold text-lg leading-tight relative z-10" style={{ fontFamily: adFont, color: isDarkText ? "hsl(var(--foreground))" : "hsl(var(--primary-foreground))" }}>{adHeadline}</p>
              </div>
              <div className="px-3 py-2 text-[10px] text-muted-foreground flex gap-4"><span>♡ 1,243</span><span>💬 89</span><span>↗ 342</span></div>
              <div className="px-3 pb-2"><p className="text-[11px] leading-snug" style={{ fontFamily: adFont }}>{adBody}</p></div>
              <div className="px-3 pb-3"><button className="w-full py-1.5 rounded-md text-xs font-semibold bg-primary text-primary-foreground shadow-sm">{adCta}</button></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Step 5: Wow Moment ───────────────────────────────────────────────────
  if (step === 5) {
    return (
      <div className="space-y-6 text-center animate-scale-in">
        <div className="py-4">
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="absolute inset-0 rounded-2xl bg-primary/20 scale-150 animate-glow" />
            <Sparkles className="relative h-12 w-12 text-primary animate-float" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Based on everything we know about your brand...</h2>
          <p className="text-muted-foreground mt-1">Here are 7 ad topics we think will crush it this week</p>
        </div>
        <HoverExplainer text="Step 7 displays LLM-generated topics. Backend async job calls POST /api/ai/generate-topics. Returns 7 structured topic objects stored in campaign_topics table. Thumbs up/down saves to topic_feedback for reinforcement learning.">
          <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto text-left">
            {mockTopics.map((topic, i) => (
              <Card
                key={i}
                className={`p-4 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border-border/60 ${
                  revealedTopics.includes(i)
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-4 scale-95"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0 shadow-sm">
                    <span className="text-xs font-bold text-white">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{topic.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{topic.desc}</p>
                    <div className="flex gap-1.5 mt-2">
                      {topic.tags.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button className="p-1.5 rounded-full hover:bg-accent transition-colors"><ThumbsUp className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    <button className="p-1.5 rounded-full hover:bg-accent transition-colors"><ThumbsDown className="h-3.5 w-3.5 text-muted-foreground" /></button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </HoverExplainer>
      </div>
    );
  }

  return null;
}
