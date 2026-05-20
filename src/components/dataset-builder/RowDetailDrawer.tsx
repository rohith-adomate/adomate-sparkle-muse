import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Play, Image as ImageIcon, Video, LayoutGrid, ExternalLink } from "lucide-react";
import type { DatasetRow } from "./types";
import { daysOnline, formatDate } from "./mockData";
import { oyAdImages } from "@/data/oyImages";
import { cn } from "@/lib/utils";

interface Props {
  row: DatasetRow | null;
  onClose: () => void;
  onRunRow: (rowId: string) => void;
  variant?: "preview" | "details";
}

const formatIcon: Record<string, typeof ImageIcon> = { Image: ImageIcon, Video, Carousel: LayoutGrid };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-border/60 last:border-b-0">
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground shrink-0 pt-0.5">{label}</span>
      <div className="text-xs text-foreground text-right min-w-0 break-words">{children}</div>
    </div>
  );
}

export default function RowDetailDrawer({ row, onClose, onRunRow, variant = "details" }: Props) {
  if (!row) return null;
  const FormatIcon = formatIcon[row.format] || ImageIcon;
  const days = daysOnline(row.firstLaunched);
  const img = oyAdImages[(parseInt(row.id, 10) || 0) % oyAdImages.length];


  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-[420px] bg-card border-l border-border flex flex-col animate-slide-in-right shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
          <h2 className="text-sm font-bold">Row Detail</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={() => onRunRow(row.id)} disabled={row.isRunning}><Play className="h-3 w-3" /> Run Row</Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}><X className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {variant === "preview" && (
            <div className="w-full rounded-xl border border-border bg-muted/30 overflow-hidden" style={{ aspectRatio: "4/5" }}>
              <img src={img} alt={row.headline} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Brand header */}
          <div className="flex items-center gap-2.5">
            {row.brandAvatar && (
              <img src={row.brandAvatar} alt={row.brand} className="h-9 w-9 rounded-md shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{row.brand}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  row.status === "Active" ? "bg-emerald-500" : "bg-muted-foreground/40",
                )} />
                <span>{row.status}</span>
                <span>·</span>
                <span>{days}d online</span>
              </div>
            </div>
          </div>

          {/* Headline */}
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1.5">Headline</p>
            <p className="text-sm leading-snug text-foreground">{row.headline}</p>
          </div>

          {/* Details */}
          <div className="rounded-lg border border-border bg-muted/20 px-3.5">
            <Field label="Format">
              <span className="inline-flex items-center gap-1.5">
                <FormatIcon className="h-3.5 w-3.5 text-muted-foreground" />
                {row.format}
              </span>
            </Field>
            <Field label="Platform">{row.platform}</Field>
            <Field label="First Launched">{formatDate(row.firstLaunched)}</Field>
            <Field label="Days Online">{days}d</Field>
            <Field label="Status">
              <Badge variant="outline" className={cn(
                "h-5 px-1.5 text-[10px] gap-1 border-0",
                row.status === "Active" ? "bg-emerald-500/15 text-emerald-700" : "bg-muted text-muted-foreground",
              )}>
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  row.status === "Active" ? "bg-emerald-500" : "bg-muted-foreground/50",
                )} />
                {row.status}
              </Badge>
            </Field>
            <Field label="Funnel Stage">{row.funnelStage}</Field>
            <Field label="Hook">{row.hook}</Field>
            <Field label="Offer">{row.offerPresent ? "Yes" : "No"}</Field>
            <Field label="Brand Alignment">{row.brandAlignment}</Field>
            {row.landingPage && (
              <Field label="Landing Page">
                <a
                  href={row.landingPage}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <span className="truncate max-w-[200px]">{row.landingPage}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </Field>
            )}
          </div>

          {/* AI enrichment values */}
          {row.aiValues && Object.keys(row.aiValues).length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1.5">AI Enrichment</p>
              <div className="rounded-lg border border-border bg-muted/20 px-3.5">
                {Object.entries(row.aiValues).map(([key, value]) => (
                  <Field key={key} label={key}>{value}</Field>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
