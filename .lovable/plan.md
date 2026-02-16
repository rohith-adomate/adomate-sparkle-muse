

# V1 Refinement: Landing Page, Notifications Spec, Navbar, Brand Data Room, and Concepts

This plan covers all 5 areas requested, with detailed implementation specs for developers.

---

## 1. Home (Landing Page) Changes

### Remove sections
- Delete the "This Week's Insights" widget from the `widgets` array (first item)
- Delete the "Recent Activity" card entirely (the middle card in the 3-column grid)

### Add "Assets In Progress" card
- Add a new widget card showing count of assets currently being generated/in-progress (e.g., "5 assets in progress")
- Uses a `Loader2` or `RefreshCw` icon with spinning animation
- Clicking navigates to `/studio`

### Make cards clickable with navigation
- Each summary widget card gets an `onClick` handler:
  - "Concepts Ready" navigates to `/concepts`
  - "Studio Assets" navigates to `/studio`
  - "Calendar" navigates to `/calendar`
  - "Assets In Progress" navigates to `/studio`
- "Next Scheduled Run" card: clicking navigates to `/campaigns/1` (the campaign detail for the relevant run)
- "Setup Health" items that are incomplete: clicking "Set up" navigates to the relevant Brand Data Room sub-page

### Performance Snapshot: Meta toggle
- Add a toggle/switch inside the Performance Snapshot card
- Two states:
  - **Meta Connected** (default ON): Shows the current KPI data (CTR, Spend, ROAS, Impressions) with the mini chart
  - **Meta Not Connected**: Shows a blurred/dimmed version of the metrics with an overlay CTA card saying "Connect your Meta account to unlock real-time performance data" with a "Connect Meta" button that navigates to `/brand-data-room/meta`
- Use a `Switch` component labeled "Meta Ad Account" to toggle between views

### On-Hover explainers (global)
- Create a reusable `HoverExplainer` wrapper component that uses `Tooltip` from shadcn
- Every card and interactive element across ALL pages gets a tooltip with a detailed description of its expected functionality
- The tooltip text will be specific and developer-oriented, e.g.:
  - Home > Concepts Ready: "Displays count of concepts in 'pending' status across all campaigns. Clicking navigates to /concepts filtered by status=pending. Backend: query concepts table WHERE status='pending' GROUP BY campaign."
  - Home > Performance Snapshot: "Pulls KPIs from the connected Meta Ad Account via Meta Marketing API. Updates every hour. Shows CTR, Spend, ROAS, Impressions for the current week. If no Meta account connected, shows upsell CTA."
  - Studio > QA Checklist: "Automated checks run against the creative asset: text overlay ratio, character count, restricted claims detection, safe zone compliance. Each check returns pass/fail. Must pass all checks before 'Send to Approval' is enabled."
- This will be applied to every page: Home, Brand Data Room (overview + all 5 detail pages), Campaigns, Campaign Detail, Concepts, Studio, Content, Calendar, Performance, Workflows, Settings

---

## 2. Notifications Implementation Specification Document

A new page/document will be created at `src/pages/NotificationsSpec.tsx` that renders a styled specification document accessible from the notification bell in TopNav. This will be a rich, readable spec page.

### Notification Categories and Message Types:

**Category 1: Campaign Lifecycle**
- Campaign started: "Campaign '{name}' has started running. Estimated completion: {time}"
- Campaign completed: "Campaign '{name}' completed. {count} concepts generated. [Review Concepts]"
- Campaign failed: "Campaign '{name}' failed at step '{step}'. Error: {message}. [Retry] [View Details]"
- Campaign step progress: "Campaign '{name}': Step {n}/{total} '{step_name}' completed"

**Category 2: Concept Review**
- New concepts ready: "{count} new concepts ready for review from campaign '{name}'. [Review Now]"
- Concept auto-iterated: "Concept '{name}' was auto-iterated based on your feedback. [View Updated]"
- Concept batch approved: "{count} concepts approved and moved to Studio queue. [Open Studio]"

**Category 3: Studio and Creative**
- Asset generation complete: "Asset '{name}' finished generating in {format} format. [Preview]"
- QA check failed: "Asset '{name}' failed QA: {check_name}. [Fix Now]"
- Asset sent to approval: "Asset '{name}' sent for approval to {approver}. [Track Status]"
- Approval received: "Asset '{name}' approved by {approver}. [Add to Calendar]"
- Approval rejected: "Asset '{name}' rejected by {approver}. Reason: {reason}. [Iterate]"

**Category 4: Calendar and Publishing**
- Ad scheduled: "Ad '{name}' scheduled for {date} on {platform}. [View Calendar]"
- Ad published: "Ad '{name}' is now live on {platform}. [View Performance]"
- Ad publish failed: "Failed to publish '{name}' to {platform}. Error: {message}. [Retry]"
- Upcoming deadline: "Reminder: {count} ads scheduled for tomorrow. [Review Calendar]"

**Category 5: Performance and Learnings**
- Performance milestone: "Ad '{name}' hit {metric} = {value}, outperforming benchmark by {percent}. [Generate More]"
- Performance alert: "Ad '{name}' ROAS dropped below {threshold}. Consider pausing. [View Details]"
- New learning detected: "New insight: '{learning_summary}'. [View Learnings]"
- Weekly digest: "Your weekly performance digest is ready. {highlights}. [View Report]"

**Category 6: Data Room and Integration**
- Meta sync complete: "Meta data synced successfully. {records} records updated. [View Details]"
- Meta sync failed: "Meta sync failed. Error: {message}. [Retry] [Check Connection]"
- Meta account disconnected: "Your Meta account has been disconnected. [Reconnect]"
- Brand data updated: "Brand Knowledge updated by {user}. [View Changes]"
- New product added: "Product '{name}' added to catalog. [Link Personas]"

**Category 7: System and Account**
- Workflow updated: "Workflow '{name}' settings updated. [View Workflow]"
- Team member invited: "{name} joined your workspace. [Manage Team]"
- Billing alert: "Usage approaching plan limit ({percent}%). [Upgrade Plan]"
- Feature announcement: "New feature: {feature_name}. [Learn More]"

**Notification UI Spec:**
- Bell icon shows unread count badge (red dot with number)
- Clicking bell opens a dropdown panel (not a full page) with tabs: All, Unread, Campaign, Performance, System
- Each notification shows: icon (color-coded by category), title, description, timestamp, action buttons
- Mark as read (individual + mark all), delete, mute category
- Real-time via WebSocket/Supabase Realtime in production

---

## 3. Sticky Top Navbar

- The TopNav already has `sticky top-0 z-50` but the `AppLayout` structure wraps it inside a flex column. The issue is the `overflow-hidden` on the flex container below it.
- Fix: Change `AppLayout.tsx` so the TopNav is truly sticky by making the overall container use a proper sticky positioning context. Update the main content area to handle its own scrolling while the TopNav stays fixed at top.

---

## 4. Brand Data Room Changes

### Remove "Overview" sub-menu item
- In `AppSidebar.tsx`, remove the "Overview" `<li>` from the Brand Data Room collapsible sub-menu (lines 78-82)
- Make clicking "Brand Data Room" label itself navigate to `/brand-data-room` (the overview page) by wrapping the CollapsibleTrigger in a NavLink or adding an onClick handler

### Brand Knowledge - Redesign to match wireframe
Based on the uploaded screenshot, the page needs 2 tabs: "Knowledge" and "Visual Style"

**Knowledge Tab (default):**
- Brand Name (text input)
- Languages (text input)
- Website URL (text input with "Refresh Knowledge" button next to it)
- Description (textarea)
- Tone of Voice (textarea)
- Brand Positioning (textarea)

**Visual Style Tab:**
- Fonts (text input)
- Logos (file upload area / placeholder)
- Brand Guidelines (file upload area / placeholder)
- Brand Colors (color picker / swatches with add/remove)
- Visual Style (textarea for general guidelines)

**Auto-save behavior:**
- Top right corner shows a loading spinner when saving
- Fields auto-save on blur/change with debounce (300ms)
- Show "Saving..." spinner then "Saved" checkmark
- No manual "Save" button -- everything auto-saves

### Products - Add thumbnail and product images
- Add a product image placeholder/thumbnail area at the top of each product card (a gradient rectangle with an image icon)
- Add a "Product Images" sub-section or screen where users can upload multiple product images
- In the product card grid, show a thumbnail preview in the card header area

### Custom Keywords - "NOT FOR MVP" hover
- Add a prominent tooltip/hover on the entire Custom Keywords card (both in Data Room overview and in the detail page) that says "NOT FOR MVP - DO NOT IMPLEMENT"
- Style with a red/warning border or badge overlay

---

## 5. Concepts - Tinder-style Like/Dislike on Ad Click

- When clicking a concept card, the detail dialog opens (already exists)
- Redesign the action area to be more Tinder-like:
  - Large swipeable card preview area
  - Three large circular action buttons at the bottom: Red X (reject), Green Heart/Check (accept), Blue message bubble (iterate)
  - Add swipe gesture hint text
  - Show accept/reject animation (card slides left for reject, right for accept with color flash)
- Keep the existing feedback textarea for the "Iterate" action

---

## Technical Summary

Files to modify:
1. `src/pages/Home.tsx` -- Remove sections, add assets card, make clickable, Meta toggle, hover explainers
2. `src/components/layout/TopNav.tsx` -- Link notification bell to spec page or dropdown
3. `src/components/layout/AppLayout.tsx` -- Fix sticky navbar
4. `src/components/layout/AppSidebar.tsx` -- Remove Overview sub-item, make Data Room label clickable
5. `src/pages/BrandKnowledge.tsx` -- Complete redesign with 2 tabs, auto-save
6. `src/pages/Products.tsx` -- Add thumbnails, product images section
7. `src/pages/CustomKeywords.tsx` -- Add "NOT FOR MVP" hover overlay
8. `src/pages/Concepts.tsx` -- Tinder-style accept/reject UX
9. `src/pages/NotificationsSpec.tsx` -- New file for notification spec document

New file:
- `src/pages/NotificationsSpec.tsx` -- Rendered spec document

Files that get hover explainers added:
- All 16 page files get `Tooltip` wrappers on key interactive elements

No new dependencies needed.

