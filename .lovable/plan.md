

# Adomate — Self-Serve Creative Ad Platform (UI Prototype)

A fully clickable, UI-only prototype of the Adomate platform covering all post-onboarding screens. No backend — all data is hardcoded/mock. The goal is to visualize screen layouts, navigation flows, and key interactions.

---

## Global Shell

- **Top Nav Bar**: Brand switcher dropdown (e.g. "Acme Co" → "Beta Brand"), notification bell icon, help icon
- **Side Nav Bar**: Collapsible sidebar with icons + labels for: Home, Brand Data Room (with hoverable sub-menu showing card names), Campaigns, Concepts, Studio, Content, Calendar, Performance, Workflows, Settings
- Brand Data Room side nav item shows a fly-out sub-menu on hover listing: Brand Knowledge, Products, Customer Personas, Meta Integration, Custom Keywords

---

## 1. Home Dashboard

A visual overview page with summary cards/widgets:
- **This Week's Insights** — short text blurb
- **Concepts Ready** — count badge (e.g. "7 concepts ready")
- **Studio Assets** — "21 generated"
- **Calendar** — "3 scheduled"
- **Performance Snapshot** — key metrics (CTR, spend, ROAS)
- **Next Scheduled Run** — date/time
- **Recent Activity** — feed of recent actions
- **Setup Health** — checklist-style progress indicator

---

## 2. Brand Data Room

### 2a. Overview Page
Grid of clickable summary cards, one per data source:
- Brand Knowledge, Products, Customer Personas, Meta Integration, Custom Keywords
- Each card shows a brief summary and a "View Details" action

### 2b. Brand Knowledge Detail
- Displays brand name, mission, tone of voice, visual style (colors, fonts, imagery guidelines)
- Inline editable fields

### 2c. Products Detail
- List/grid of product cards with name, description, hypothesis, problem, solution, competitor info
- Actions: Add Product, Edit, Delete

### 2d. Customer Personas Detail
- List of persona cards (name, age range, income, lifestyle, pain points)
- Actions: Add Persona, Edit, Delete, Link Persona ↔ Product

### 2e. Meta Integration Detail
- Connection status card, "Connect Meta Account" button
- If connected: summary of ad accounts, pages, spend overview

### 2f. Custom Keywords Detail
- Tag-style list of keywords, add/remove functionality

---

## 3. Campaigns

### 3a. Campaigns List
- Table/card list of existing campaigns: name, workflow used, last run date, status, summary metrics
- "Start New Campaign" button

### 3b. New Campaign Modal Flow
**Step 1 — Choose Workflow:**
- Recommended: "Standard Weekly Sprint" (highlighted)
- Templates grid: Weekly Ad Sprint, Ads from Twitter Data, Retail Ads, Christmas Special, Unspecified Ads, etc.
- Option: "Create Your Own Workflow"
- Hovering/clicking a template shows a detail card: description, outputs, inputs required, typical runtime

**Step 2 — Name Your Campaign:**
- Text input for campaign name

**Step 3 — Workflow Settings (3-step wizard):**
- Left panel: step list (Knowledge → Insights/Agent → Concepts)
- Right panel: settings for selected step
  - Knowledge: toggle data sources on/off, set focus areas
  - Insights/Agent: customize prompt, requirements
  - Concepts: iteration settings
- "Save Workflow & Create Campaign" button

### 3c. Campaign Detail Page
- Campaign header with name, status, "Start Campaign" button
- Timeline/progress of the campaign run
- Outputs summary linking to Concepts

---

## 4. Concepts (Tinder/Pinterest Style)

### 4a. Concepts Gallery
- Top filter bar: This Week, Product, Campaign, Status
- Rows of horizontal carousels, each row = one campaign's outputs
- Each card = a generated ad concept thumbnail

### 4b. Campaign Concepts Expanded View
- Full-screen view of a campaign's concepts grouped by source (e.g. "Based on Competitor Ad A" → 3 concepts)
- Each concept is a clickable card

### 4c. Concept Detail
- Large preview of the concept
- Action buttons: ✅ Accept, ❌ Reject, 💬 Iterate (feedback text input)
- Concept metadata (source, campaign, product)

---

## 5. Studio

- **Left Panel — Concept Queue**: Cards grouped by status (Ready, In Progress, Approved), each showing thumbnail, name, format
- **Center — Preview Canvas**: Large ad preview with placement toggle (Feed, Story, Reels). Below: "Add to Calendar", "Send to Approval", "Send to Designer" buttons. Export/download option.
- **Right Panel — Controls**: Regenerate Image button, Regenerate Copy button, QA Checklist (spacing OK, text length OK, no restricted claims, etc.)

---

## 6. Content

### 6a. Content Library
- Tabs: Ads, Hooks, Primary Text, CTAs, Headlines
- Each tab shows a grid of content cards with thumbnail/text preview, tags, actions (Copy, Send to Calendar, Add to Favorite)

### 6b. Calendar (sub-section or navigated via "Send to Calendar")
- **Top: Draft to Schedule** — row of ad cards pending scheduling, draggable
- **Below: Weekly Calendar Grid** — columns: Campaign label + Sun–Sat. Rows = campaigns (Google Calendar style)
- Calendar items show: creative thumbnail, status (Scheduled/Published), actions (Republish, Swap, Remove)
- Drag-and-drop from drafts to calendar slots

---

## 7. Performance & Learnings

- **KPI Strip** — horizontal row of key metrics (impressions, CTR, ROAS, spend, conversions)
- **Creative Performance** — grid of ad thumbnails with performance stats + "Generate More Like This" button
- **Learnings** — insight cards (e.g. "This claim triggers drop-off — avoid", "UGC-style outperforms polished by 2x")

---

## 8. Workflows

- **Current Workflow Card** — shows active workflow name (e.g. "Weekly Ad Sprint") + "Customize" button
- **Template Gallery** — grid of predefined workflow template cards
- **Run History** — table of past runs with date, status, duration
- Clicking a template → template detail popup (outputs, inputs, runtime, "Use Template", "Customize")
- Customize opens a **6-step workflow settings modal**:
  - Steps: Knowledge → Insights/Agent → Concepts → Studio → Calendar → Learnings
  - Left: step navigator. Right: step-specific settings
  - Actions: Add Step, Remove Step, Save Workflow

---

## 9. Settings

- Standard settings layout with sections: Profile, Team Members, Billing, Integrations, Notifications Preferences
- Clean form-based UI

---

## Design Approach
- Clean, modern SaaS aesthetic using the existing shadcn/ui component library
- All data is hardcoded mock data — no API calls or backend
- All screens are linked via React Router for a fully navigable prototype
- Emphasis on layout and flow clarity over pixel-perfect polish

