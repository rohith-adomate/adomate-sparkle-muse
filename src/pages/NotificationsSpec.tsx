import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Lightbulb, Palette, CalendarDays, BarChart3, Database, Settings, Bell } from "lucide-react";

const categories = [
  {
    name: "Campaign Lifecycle",
    icon: Megaphone,
    color: "bg-amber-100 text-amber-700 border-amber-200",
    iconColor: "text-amber-600",
    messages: [
      { type: "campaign_started", template: "Campaign '{name}' has started running. Estimated completion: {time}", trigger: "When a campaign run begins", actions: "[View Campaign]", priority: "Normal" },
      { type: "campaign_completed", template: "Campaign '{name}' completed. {count} concepts generated.", trigger: "When all campaign steps finish successfully", actions: "[Review Concepts] [View Campaign]", priority: "High" },
      { type: "campaign_failed", template: "Campaign '{name}' failed at step '{step}'. Error: {message}.", trigger: "When any campaign step fails with an error", actions: "[Retry] [View Details]", priority: "Urgent" },
      { type: "campaign_step_progress", template: "Campaign '{name}': Step {n}/{total} '{step_name}' completed.", trigger: "When each individual step completes", actions: "[View Campaign]", priority: "Low" },
    ],
  },
  {
    name: "Concept Review",
    icon: Lightbulb,
    color: "bg-violet-100 text-violet-700 border-violet-200",
    iconColor: "text-violet-600",
    messages: [
      { type: "concepts_ready", template: "{count} new concepts ready for review from campaign '{name}'.", trigger: "When concept generation step completes", actions: "[Review Now]", priority: "High" },
      { type: "concept_auto_iterated", template: "Concept '{name}' was auto-iterated based on your feedback.", trigger: "When the system auto-iterates a rejected concept", actions: "[View Updated]", priority: "Normal" },
      { type: "concept_batch_approved", template: "{count} concepts approved and moved to Studio queue.", trigger: "When user bulk-approves concepts", actions: "[Open Studio]", priority: "Normal" },
    ],
  },
  {
    name: "Studio & Creative",
    icon: Palette,
    color: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
    iconColor: "text-fuchsia-600",
    messages: [
      { type: "asset_generation_complete", template: "Asset '{name}' finished generating in {format} format.", trigger: "When AI finishes rendering an asset", actions: "[Preview]", priority: "Normal" },
      { type: "qa_check_failed", template: "Asset '{name}' failed QA: {check_name}.", trigger: "When automated QA detects an issue", actions: "[Fix Now]", priority: "High" },
      { type: "asset_sent_to_approval", template: "Asset '{name}' sent for approval to {approver}.", trigger: "When user clicks 'Send to Approval'", actions: "[Track Status]", priority: "Normal" },
      { type: "approval_received", template: "Asset '{name}' approved by {approver}.", trigger: "When an approver approves an asset", actions: "[Add to Calendar]", priority: "High" },
      { type: "approval_rejected", template: "Asset '{name}' rejected by {approver}. Reason: {reason}.", trigger: "When an approver rejects an asset", actions: "[Iterate]", priority: "High" },
    ],
  },
  {
    name: "Calendar & Publishing",
    icon: CalendarDays,
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
    iconColor: "text-cyan-600",
    messages: [
      { type: "ad_scheduled", template: "Ad '{name}' scheduled for {date} on {platform}.", trigger: "When user schedules an ad on the calendar", actions: "[View Calendar]", priority: "Normal" },
      { type: "ad_published", template: "Ad '{name}' is now live on {platform}.", trigger: "When Meta API confirms ad is active", actions: "[View Performance]", priority: "High" },
      { type: "ad_publish_failed", template: "Failed to publish '{name}' to {platform}. Error: {message}.", trigger: "When Meta API returns a publish error", actions: "[Retry]", priority: "Urgent" },
      { type: "upcoming_deadline", template: "Reminder: {count} ads scheduled for tomorrow.", trigger: "Daily at 6 PM for next-day scheduled items", actions: "[Review Calendar]", priority: "Normal" },
    ],
  },
  {
    name: "Performance & Learnings",
    icon: BarChart3,
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    iconColor: "text-emerald-600",
    messages: [
      { type: "performance_milestone", template: "Ad '{name}' hit {metric} = {value}, outperforming benchmark by {percent}.", trigger: "When an ad exceeds configured benchmark thresholds", actions: "[Generate More]", priority: "High" },
      { type: "performance_alert", template: "Ad '{name}' ROAS dropped below {threshold}. Consider pausing.", trigger: "When ROAS falls below user-configured threshold (default 2.0x)", actions: "[View Details] [Pause Ad]", priority: "Urgent" },
      { type: "new_learning", template: "New insight: '{learning_summary}'.", trigger: "When the AI generates a new learning after 48h of data", actions: "[View Learnings]", priority: "Normal" },
      { type: "weekly_digest", template: "Your weekly performance digest is ready. {highlights}.", trigger: "Every Monday at 9 AM", actions: "[View Report]", priority: "Normal" },
    ],
  },
  {
    name: "Data Room & Integration",
    icon: Database,
    color: "bg-sky-100 text-sky-700 border-sky-200",
    iconColor: "text-sky-600",
    messages: [
      { type: "meta_sync_complete", template: "Meta data synced successfully. {records} records updated.", trigger: "After a successful Meta API data sync", actions: "[View Details]", priority: "Low" },
      { type: "meta_sync_failed", template: "Meta sync failed. Error: {message}.", trigger: "When Meta API sync encounters an error", actions: "[Retry] [Check Connection]", priority: "Urgent" },
      { type: "meta_disconnected", template: "Your Meta account has been disconnected.", trigger: "When OAuth token expires or is revoked", actions: "[Reconnect]", priority: "Urgent" },
      { type: "brand_data_updated", template: "Brand Knowledge updated by {user}.", trigger: "When any brand data field is modified", actions: "[View Changes]", priority: "Low" },
      { type: "new_product_added", template: "Product '{name}' added to catalog.", trigger: "When a new product is created", actions: "[Link Personas]", priority: "Normal" },
    ],
  },
  {
    name: "System & Account",
    icon: Settings,
    color: "bg-muted text-muted-foreground",
    iconColor: "text-muted-foreground",
    messages: [
      { type: "workflow_updated", template: "Workflow '{name}' settings updated.", trigger: "When workflow configuration changes are saved", actions: "[View Workflow]", priority: "Low" },
      { type: "team_member_invited", template: "{name} joined your workspace.", trigger: "When an invited team member accepts invitation", actions: "[Manage Team]", priority: "Normal" },
      { type: "billing_alert", template: "Usage approaching plan limit ({percent}%).", trigger: "When usage reaches 80% and 95% of plan limit", actions: "[Upgrade Plan]", priority: "High" },
      { type: "feature_announcement", template: "New feature: {feature_name}.", trigger: "When new features are released (admin-triggered)", actions: "[Learn More]", priority: "Low" },
    ],
  },
];

const priorityColors: Record<string, string> = {
  Urgent: "bg-red-100 text-red-700 border-red-200",
  High: "bg-amber-100 text-amber-700 border-amber-200",
  Normal: "bg-sky-100 text-sky-700 border-sky-200",
  Low: "bg-muted text-muted-foreground",
};

export default function NotificationsSpec() {
  const totalMessages = categories.reduce((acc, c) => acc + c.messages.length, 0);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="icon-badge rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications — Implementation Specification</h1>
        </div>
        <p className="text-muted-foreground text-sm">Comprehensive specification for all notification types in the Adomate platform.</p>
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold tracking-tight">{categories.length}</p>
              <p className="text-xs text-muted-foreground">Categories</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold tracking-tight">{totalMessages}</p>
              <p className="text-xs text-muted-foreground">Message Types</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold tracking-tight">4</p>
              <p className="text-xs text-muted-foreground">Priority Levels</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold tracking-tight">5</p>
              <p className="text-xs text-muted-foreground">UI Tabs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* UI Spec */}
      <Card>
        <CardHeader><CardTitle className="text-base section-header">Notification Panel UI Spec</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="space-y-2">
            <p><span className="font-semibold">Trigger:</span> Click bell icon in TopNav</p>
            <p><span className="font-semibold">Component:</span> Dropdown panel (DropdownMenu or Popover), not a full page</p>
            <p><span className="font-semibold">Width:</span> 400px, max-height 500px with scroll</p>
            <p><span className="font-semibold">Tabs:</span> All | Unread | Campaign | Performance | System</p>
            <p><span className="font-semibold">Each item shows:</span> Category icon (color-coded), title, description, relative timestamp, action buttons</p>
            <p><span className="font-semibold">Actions:</span> Mark as read (individual + mark all), delete, mute category</p>
            <p><span className="font-semibold">Badge:</span> Red dot with unread count on bell icon. Count resets when panel is opened.</p>
            <p><span className="font-semibold">Real-time:</span> Subscribe to Supabase Realtime channel 'notifications' filtered by user_id. INSERT events push to local state.</p>
            <p><span className="font-semibold">Storage:</span> notifications table with columns: id, user_id, category, type, title, description, data (jsonb), read_at, created_at</p>
            <p><span className="font-semibold">Retention:</span> 90 days, auto-cleanup via cron job</p>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      {categories.map((cat) => (
        <Card key={cat.name}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <div className={`icon-badge rounded-lg ${cat.color.split(" ")[0]}`}>
                <cat.icon className={`h-4 w-4 ${cat.iconColor}`} />
              </div>
              {cat.name}
              <Badge variant="outline" className="ml-auto text-[10px]">{cat.messages.length} types</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cat.messages.map((msg) => (
                <div key={msg.type} className="border rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">{msg.type}</code>
                    <Badge variant="outline" className={`text-[10px] border ${priorityColors[msg.priority]}`}>{msg.priority}</Badge>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm font-medium font-mono">{msg.template}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Trigger</span>
                      <p className="mt-0.5">{msg.trigger}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Actions</span>
                      <p className="mt-0.5 font-mono">{msg.actions}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Database Schema */}
      <Card>
        <CardHeader><CardTitle className="text-base section-header">Database Schema</CardTitle></CardHeader>
        <CardContent>
          <pre className="bg-muted rounded-xl p-4 text-xs font-mono overflow-x-auto whitespace-pre">{`CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'campaign', 'concept', 'studio', 'calendar', 'performance', 'data_room', 'system'
  type TEXT NOT NULL,     -- e.g. 'campaign_started', 'qa_check_failed'
  title TEXT NOT NULL,
  description TEXT,
  data JSONB DEFAULT '{}', -- Flexible payload: { campaign_id, concept_id, asset_id, etc. }
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Users can only see their own notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for fast queries
CREATE INDEX idx_notifications_user_unread
  ON notifications (user_id, created_at DESC)
  WHERE read_at IS NULL;`}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
