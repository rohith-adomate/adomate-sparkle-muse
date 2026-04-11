import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, Loader2, Check, RefreshCw, Facebook, Instagram, ExternalLink } from "lucide-react";

type ScrapingStatus = "scraping" | "ready" | "failed";

type SocialInfo = {
  fbHandle?: string;
  fbFollowers?: string;
  igHandle?: string;
  igFollowers?: string;
};

type AdminCompetitor = {
  id: string;
  name: string;
  avatarUrl: string;
  pageId: string;
  lastUpdated: string;
  adsTracked: number;
  adsTotal: number;
  scrapingStatus: ScrapingStatus;
  social?: SocialInfo;
  dateAdded: string;
  brandName: string;
  companyName: string;
};

const mockCompetitors: AdminCompetitor[] = [
  { id: "1", name: "Canva Ads", avatarUrl: "https://logo.clearbit.com/canva.com", pageId: "284789375333902", lastUpdated: "4 Mar 2026", adsTracked: 185, adsTotal: 210, scrapingStatus: "ready", social: { fbHandle: "canva", fbFollowers: "4.2M", igHandle: "canva", igFollowers: "1.8M" }, dateAdded: "28 Feb 2026", brandName: "Adomate", companyName: "Adomate Inc." },
  { id: "2", name: "Smartly.io", avatarUrl: "https://logo.clearbit.com/smartly.io", pageId: "959624700738003", lastUpdated: "3 Mar 2026", adsTracked: 200, adsTotal: 200, scrapingStatus: "ready", social: { fbHandle: "smartlyio", fbFollowers: "12K" }, dateAdded: "1 Mar 2026", brandName: "Adomate", companyName: "Adomate Inc." },
  { id: "3", name: "AdCreative.ai", avatarUrl: "https://logo.clearbit.com/adcreative.ai", pageId: "355782130956396", lastUpdated: "—", adsTracked: 0, adsTotal: 145, scrapingStatus: "failed", social: { fbHandle: "adcreativeai", fbFollowers: "85K", igHandle: "adcreative.ai", igFollowers: "22K" }, dateAdded: "2 Mar 2026", brandName: "Adomate", companyName: "Adomate Inc." },
  { id: "4", name: "Icon", avatarUrl: "https://logo.clearbit.com/icon.com", pageId: "111433260868447", lastUpdated: "—", adsTracked: 5, adsTotal: 92, scrapingStatus: "scraping", dateAdded: "4 Mar 2026", brandName: "Adomate", companyName: "Adomate Inc." },
  { id: "5", name: "HubSpot Ads", avatarUrl: "https://logo.clearbit.com/hubspot.com", pageId: "203817629684562", lastUpdated: "3 Mar 2026", adsTracked: 312, adsTotal: 350, scrapingStatus: "ready", social: { fbHandle: "hubspot", fbFollowers: "2.1M", igHandle: "hubspot", igFollowers: "450K" }, dateAdded: "15 Feb 2026", brandName: "GrowthLoop", companyName: "GrowthLoop Ltd." },
  { id: "6", name: "Mailchimp", avatarUrl: "https://logo.clearbit.com/mailchimp.com", pageId: "482910573621048", lastUpdated: "2 Mar 2026", adsTracked: 98, adsTotal: 120, scrapingStatus: "ready", social: { fbHandle: "mailchimp", fbFollowers: "580K", igHandle: "mailchimp", igFollowers: "210K" }, dateAdded: "20 Feb 2026", brandName: "GrowthLoop", companyName: "GrowthLoop Ltd." },
  { id: "7", name: "Semrush", avatarUrl: "https://logo.clearbit.com/semrush.com", pageId: "738291046583201", lastUpdated: "—", adsTracked: 12, adsTotal: 275, scrapingStatus: "scraping", social: { fbHandle: "semrush", fbFollowers: "320K" }, dateAdded: "4 Mar 2026", brandName: "PixelForge", companyName: "PixelForge Studio" },
];

function StatusChip({ status }: { status: ScrapingStatus }) {
  const base = "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium";

  if (status === "scraping") {
    return (
      <span className={`${base} text-muted-foreground border-border bg-muted/30`}>
        <Loader2 className="h-3 w-3 animate-spin" />
        Scraping…
      </span>
    );
  }
  if (status === "ready") {
    return (
      <span className={`${base} text-emerald-600 border-emerald-200 bg-emerald-50`}>
        <Check className="h-3 w-3" />
        Ready
      </span>
    );
  }
  return (
    <span className={`${base} text-destructive border-destructive/30 bg-destructive/5`}>
      <RefreshCw className="h-3 w-3" />
      Failed
    </span>
  );
}

function SocialBadge({ icon: Icon, handle, followers }: { icon: React.ElementType; handle: string; followers: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
      <Icon className="h-3 w-3" />
      <span className="font-medium text-foreground/80">@{handle}</span>
      <span className="text-muted-foreground/60">·</span>
      <span>{followers}</span>
    </span>
  );
}

export default function AdminCompetitors() {
  const [filterQuery, setFilterQuery] = useState("");

  const filtered = mockCompetitors.filter((c) =>
    c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.brandName.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.companyName.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const hasSocial = (s?: SocialInfo) => s && (s.fbHandle || s.igHandle);

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Competitors</h1>
        <p className="text-muted-foreground text-sm">All competitors tracked across brands and companies, sorted by most recently added.</p>
      </div>

      <div className="relative max-w-[350px] w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search competitors, brands, companies..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Competitor</TableHead>
              <TableHead>Socials</TableHead>
              <TableHead>Page ID</TableHead>
              <TableHead>Brand / Company</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-center">Ads Tracked</TableHead>
              <TableHead className="text-center w-28">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                  No competitors match your search.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={c.avatarUrl} alt="" className="h-8 w-8 rounded-full bg-muted object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                      <span className="font-medium text-sm">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {hasSocial(c.social) ? (
                      <div className="flex flex-col gap-0.5">
                        {c.social?.fbHandle && (
                          <SocialBadge icon={Facebook} handle={c.social.fbHandle} followers={c.social.fbFollowers!} />
                        )}
                        {c.social?.igHandle && (
                          <SocialBadge icon={Instagram} handle={c.social.igHandle} followers={c.social.igFollowers!} />
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm font-mono">
                    <a href={`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&view_all_page_id=${c.pageId}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground underline hover:text-foreground transition-colors inline-flex items-center gap-1">
                      {c.pageId.slice(0, 8)}…
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{c.brandName}</span>
                      <span className="text-[11px] text-muted-foreground">{c.companyName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.dateAdded}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.lastUpdated}</TableCell>
                  <TableCell className="text-sm text-muted-foreground text-center">
                    {c.scrapingStatus === "scraping" ? (
                      <div className="inline-flex flex-col items-center gap-0.5">
                        <span>{c.adsTracked} / {c.adsTotal}</span>
                        <div className="relative h-[2px] w-8 rounded-full bg-muted overflow-hidden">
                          <div className="absolute h-full w-4 rounded-full bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-[slide-bar_1.2s_ease-in-out_infinite]" />
                        </div>
                      </div>
                    ) : (
                      <span>{c.adsTracked} / {c.adsTotal}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusChip status={c.scrapingStatus} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
