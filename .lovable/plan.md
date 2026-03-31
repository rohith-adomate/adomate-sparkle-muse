

## Dataset Builder — Full Implementation Plan

This is a large feature that transforms the existing bottom-up Dataset drawer into a right-sliding full-page editor with custom columns, filters, sources, and run capabilities.

---

### Architecture Overview

```text
WorkflowCanvas.tsx
  ├─ Editor tab: click dataset node → DatasetBuilderDrawer (full editor, right-to-left)
  └─ Runs tab: click dataset node → DatasetRunResultsDrawer (read-only results, right-to-left)

DatasetBuilderDrawer.tsx (~95% width, slide from right)
  ├─ Top bar: ← Back | "Competitor Dataset" | + Add Column | Save as Template | ▶ Run | ✕
  ├─ Left panel (w-72): Sources + Filters
  ├─ Center: Data table (facts columns first, AI columns last, purple styling)
  ├─ Right panel (contextual): Column inspector with stats, AI prompt, collapse
  └─ Add Column Modal: "Pick from template" or "Define custom"
```

---

### Files to Create

**1. `src/components/dataset-builder/DatasetBuilderDrawer.tsx`** — Main container
- Fixed overlay, slides right-to-left with `translate-x` animation
- ~95% screen width, ~5% gap on left (semi-transparent backdrop visible)
- Top bar: Back button (left, behaves like close), title "Competitor Dataset" (no Draft badge), "+ Add Column" button, "Save as Template" button, Run button with smart tooltip, X close button (right, not overlapping)
- Three-column layout: left panel, center table, right contextual panel

**2. `src/components/dataset-builder/DatasetBuilderLeftPanel.tsx`** — Sources + Filters
- **Sources section**: List of competitor sources with brand avatar images (clearbit URLs from mock data), name, status chip (Connected/Error), "+ Add Source" button with popover for source types (Competitor Ad Library URL, Landing Page URL, CSV Upload, Manual List, API)
- **Filters section**: Below sources. Filters are either present or not (no toggle). Each filter shows its condition and an X to remove. "+ Add Filter" button opens a popover with filter type options:
  - Status (Active/Inactive)
  - Minimum days online (number input)
  - Format contains (text input)
  - Landing page domain contains (text input)
  - Brand (multi-select)
  - Funnel stage (multi-select)
- Adding a filter immediately adds it; removing deletes it. Clean, simple cards.

**3. `src/components/dataset-builder/DatasetBuilderTable.tsx`** — Center table
- Column ordering: Facts columns first (Preview, #, Brand, Headline, Format, Platform, First Launched, Days Online, Status, Funnel, Hook, Offer, Brand Alignment), then AI columns grouped at end
- **Facts columns**: Neutral header styling, no special badge
- **AI columns**: Purple-tinted header background (`bg-purple-50`), small sparkle icon next to name, tooltip "AI-generated column"
- Row selection via checkboxes (leftmost column)
- Row hover: shows a small Play/Run button to the left of the row number
- Selected rows: bulk action bar appears below table header — "X rows selected" | Export | Remove | **▶ Run selected**
- New columns added via templates or custom are appended to AI group with blank/empty cells (dash placeholder) until run
- Inline column header rename on double-click
- Click column header → opens right inspector panel for that column

**4. `src/components/dataset-builder/ColumnInspectorPanel.tsx`** — Right contextual panel
- Slides in from right edge when a column is clicked
- Header: Column name + collapse button (chevron-right icon to close panel)
- Shows column type (Facts or AI with purple indicator)
- **Stats section**: Contextual stats for the column. E.g., for "Ad Type": "CeraVe: 42% Static, 35% UGC, 23% Carousel" / "The Ordinary: 50% Static, 30% UGC, 20% Carousel". For "Status": "67% Active, 33% Inactive". For numeric columns: min, max, avg.
- **AI Prompt section** (AI columns only): Shows the prompt the user entered when creating the column, in a read-only code/text block
- **Column settings**: Name field, description field, delete column button

**5. `src/components/dataset-builder/AddColumnModal.tsx`** — Two-path modal
- Opens as a dialog/modal
- **Step 0 — Choose path**: Two cards side by side:
  - "Pick from templates" — icon grid, description: "Pre-built enrichment columns"
  - "Define custom column" — icon, description: "Create your own column with AI or rules"
- **Template path**: Shows 4 template cards:
  1. **Ad Type** — Classifies ads as Static, UGC, or Carousel
  2. **Visual Format Signals** — Detects testimonials, product demos, founder-led, before/after
  3. **Landing Page Usage Mix** — Top landing pages with % share
  4. **Longest Running Ads** — Flags likely winners by longevity
  - Click a template → column is added immediately (blank cells), modal closes
- **Custom column path** (simplified, 3 steps):
  - **Step 1**: Column type selection (Metric, Classification, Extraction, Scoring, AI Summary) — card grid, no text input
  - **Step 2**: Data source/input mapping + Logic (rule-based or AI prompt textarea)
  - **Step 3**: Column name + description → Save
  - The AI prompt entered here is stored and displayed in the column inspector

**6. `src/components/dataset-builder/DatasetRunResultsDrawer.tsx`** — Runs tab view
- Right-to-left slide drawer (same animation style)
- Shows the existing DatasetDrawer content (the table with competitor data, read-only)
- No "Advanced Customization" button
- Simple close button

---

### Files to Modify

**7. `src/pages/WorkflowCanvas.tsx`**
- Replace `DatasetDrawer` usage with conditional logic:
  - `activeTab === "editor"` + dataset node click → open `DatasetBuilderDrawer`
  - `activeTab === "runs"` + dataset node click → open `DatasetRunResultsDrawer`
- Add state: `datasetBuilderOpen`, `datasetRunResultsOpen`
- Remove old `datasetDrawerOpen` state

**8. `src/components/DatasetDrawer.tsx`**
- Keep as-is or refactor into `DatasetRunResultsDrawer` — change animation from bottom-up to right-to-left slide

---

### Run Button UX

The Run button in the top bar:
- **No rows selected**: Button label "▶ Run All" with tooltip "Process all rows with AI enrichment"
- **Rows selected**: Button label "▶ Run (X)" with tooltip "Process X selected rows"
- Clicking shows a brief confirmation or runs immediately
- Per-row run button: small Play icon on hover, left of row number, tooltip "Run this row"

---

### Data Model (in-component state)

```typescript
interface DatasetColumn {
  id: string;
  name: string;
  type: "facts" | "ai";
  columnKind?: "metric" | "classification" | "extraction" | "scoring" | "ai-summary";
  aiPrompt?: string;       // stored for AI columns
  description?: string;
  templateId?: string;      // if from template
}

interface DatasetFilter {
  id: string;
  type: "status" | "min-days" | "format-contains" | "domain-contains" | "brand" | "funnel-stage";
  value: string | number | string[];
}

interface DatasetSource {
  id: string;
  type: "competitor" | "landing-page" | "csv" | "manual" | "api";
  label: string;
  avatar?: string;
  url?: string;
  status: "connected" | "needs-auth" | "error";
}
```

---

### Mock Data

- Reuse existing `MOCK_ADS` data from DatasetDrawer for the table rows
- Template columns added with blank values (rendered as "—") until "run"
- When user clicks Run on a row, simulate by filling that row's AI column cells with realistic mock values after a brief loading state

---

### Key Interactions Summary

| Action | Result |
|--------|--------|
| Click dataset node (Editor tab) | DatasetBuilderDrawer slides in from right |
| Click dataset node (Runs tab) | DatasetRunResultsDrawer slides in from right |
| Click column header | Right inspector panel opens with stats + settings |
| Click collapse in inspector | Inspector panel closes |
| Click "+ Add Column" | Modal with template vs custom choice |
| Add column (either path) | New AI column appended to end, cells blank |
| Hover row | Small run button appears left of row # |
| Select rows + click Run | Runs only selected rows |
| Click Run with nothing selected | Runs all rows |
| Click Back or X | Closes drawer, returns to canvas |
| Add filter | Filter appears in left panel, affects table rows |
| Remove filter (X) | Filter removed |

