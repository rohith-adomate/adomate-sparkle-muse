export interface DatasetColumn {
  id: string;
  name: string;
  type: "facts" | "ai";
  columnKind?: "metric" | "classification" | "extraction" | "scoring" | "ai-summary";
  aiPrompt?: string;
  description?: string;
  templateId?: string;
}

export interface DatasetFilter {
  id: string;
  type: "status" | "min-days" | "format-contains" | "domain-contains" | "brand" | "funnel-stage";
  label: string;
  value: string | number | string[];
}

export interface DatasetSource {
  id: string;
  type: "competitor" | "landing-page" | "csv" | "manual" | "api";
  label: string;
  avatar?: string;
  url?: string;
  status: "connected" | "needs-auth" | "error";
}

export interface DatasetRow {
  id: string;
  brand: string;
  brandAvatar?: string;
  headline: string;
  format: string;
  platform: string;
  firstLaunched: string;
  status: string;
  funnelStage: string;
  hook: string;
  offerPresent: boolean;
  brandAlignment: "High" | "Med" | "Low";
  aiValues: Record<string, string>;
  isRunning?: boolean;
}
