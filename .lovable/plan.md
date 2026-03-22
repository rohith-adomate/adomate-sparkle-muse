

# Reddit Workflow Implementation Plan

## Summary

Add a complete "Reddit" workflow type to the application, including a new tab in the Create Workflow modal, a custom canvas layout with 4 nodes (2 existing + 2 new), and two new node drawer components with information tooltips on every configurable setting.

---

## 1. Add Reddit to Create Workflow Modal

**File: `src/pages/Workflows.tsx`**

- Add `"reddit"` to the `AgentType` union type
- Add a "Reddit" tab in the Create Workflow modal's vertical `TabsList`
- Add a Reddit template card (single card: "Reddit Ad Workflow") with a Reddit-themed icon and color (e.g., orange-red `bg-orange-50 border-orange-200 text-orange-600`)
- Clicking creates a workflow of type `"reddit"` and navigates to the canvas
- Add Reddit workflow cards styling (orange-red accent color bar and badge)

## 2. Reddit Canvas Node Layout

**File: `src/pages/WorkflowCanvas.tsx`**

Add new node types and default graph:

```text
                    ┌──────────────┐
               ┌───▶│ Product Data │───┐
┌──────────┐   │    └──────────────┘   │    ┌──────────────────────┐
│ Schedule  │───┤                       ├───▶│ Reddit Ad Generator  │
└──────────┘   │    ┌──────────────┐   │    └──────────────────────┘
               └───▶│ Subreddit    │───┘
                    │ Dataset      │
                    └──────────────┘
```

- Add `"reddit-subreddit"` and `"reddit-ad-generator"` to `NODE_CATALOG`
- `reddit-subreddit`: category `"static-data"`, icon `Database`, inputs: `["Trigger"]`, outputs: `["Reddit Data"]`
- `reddit-ad-generator`: category `"ai"`, icon `Sparkles`, inputs: `["Reddit Data", "Products"]`, outputs: `["Variations"]`
- Add `getRedditNodes()` returning 4 nodes with Schedule splitting to both Product Data and Subreddit Dataset
- Add `REDDIT_EDGES` connecting Schedule→Product Data, Schedule→Subreddit Dataset, both→Reddit Ad Generator
- Detect `type === "reddit"` from location state and use Reddit nodes/edges
- Wire node clicks to open respective drawers (editor tab) or run output panel (runs tab)
- Add state variables for `redditSubredditDrawerOpen` and `redditAdGeneratorDrawerOpen`

## 3. Subreddit Dataset Node — Editor Drawer

**New file: `src/components/RedditSubredditDrawer.tsx`**

Bottom-anchored drawer (70vh, same pattern as `DatasetDrawer.tsx`) with left settings panel + right data table.

**Left Panel — Settings (top to bottom):**

**SUBREDDIT section:**
- **Source Strategy** (Auto / Manual toggle) with info tooltip
  - **Auto mode**: Shows recommended subreddits with toggle switches per subreddit, each showing subscriber count (e.g., "r/SkincareAddiction · 2.1M subscribers")
  - **Manual mode**: Input field to add subreddits + suggested subreddits below based on entered text, each showing subscriber count
- **Excluded subreddits** (multi-select tags) with info tooltip
- **Language filter** with info tooltip
- **Region filter** (optional) with info tooltip

**POST section (separator):**
- **Sort mode** (hot / top / new) with info tooltip
- **Time window** (24h, 7d, 30d) with info tooltip
- **Max posts per subreddit** (number input) with info tooltip
- **Include comments** (toggle) with info tooltip
- **Top N comments per post** (number input, shown when comments enabled) with info tooltip

**FILTERS section:**
- **Deduplicate similar posts** (toggle) with info tooltip
- **Block NSFW content** (toggle) with info tooltip

**Right Panel — Data Table:**
Mock scraped Reddit posts table with columns: Preview snippet, Subreddit, Title, Upvotes, Comments, Posted date, Status

**Defaults:** Auto mode, top 6 subreddits, 7d window, 25 posts/sub, comments on (top 20), NSFW block on.

## 4. Reddit Ad Generator Node — Editor Drawer

**New file: `src/components/RedditAdGeneratorDrawer.tsx`**

Right-side Sheet drawer (same pattern as `GenerateConceptsDrawer.tsx`).

**Settings (top to bottom):**

- **Output type** (select: Commercial Image Static Ads / Meme-Based Ads / Trend-Based Ads) with info tooltip
- **Number of concepts** (number input) with info tooltip
- **Concept diversity slider** (close to brand ↔ exploratory) with info tooltip
- **Meme intensity** (none / light / medium — auto-set based on output type, user can override) with info tooltip
  - Commercial → none, Meme-Based → medium, Trend-Based → light
- **Prompt style** (strict brand / balanced / reddit-native) with info tooltip
- **Include direct Reddit phrasing** (toggle) with info tooltip

**Defaults:** 6 concepts, meme intensity light, commercial output type.

## 5. Run Output Views (Runs Tab)

**File: `src/components/ExecutionOutputPanel.tsx`**

Add output renderers for both new node types, shown when clicking nodes in Runs tab:

**Subreddit Dataset Run Output:**
- Summary card: subreddits fetched, posts scanned, comments scanned, usable snippets
- Quality card: confidence %, duplication %, noise %, toxicity %
- Top extracted insights list
- Selected evidence snippets with subreddit/post traceability
- Warnings section

**Reddit Ad Generator Run Output:**
- Concept list with status (accepted / rejected / generated)
- Generated assets grid with concept-to-image mapping
- Why-rejected reasons
- Token/cost + latency summary
- Regenerate controls

## 6. Information Tooltips on Every Setting

Both new drawer components will use the existing `Tooltip` + `Info` icon pattern (consistent with `DatasetDrawer`, `GenerateConceptsDrawer`, `ScheduleDrawer`) where every label has a small `Info` icon that shows an explanatory tooltip on hover describing what the setting does, expected behavior, and backend implications.

Pattern per setting:
```tsx
<Tooltip delayDuration={200}>
  <TooltipTrigger asChild>
    <Label className="... inline-flex items-center gap-1 cursor-help">
      Setting Name
      <Info className="h-2.5 w-2.5" />
    </Label>
  </TooltipTrigger>
  <TooltipContent side="right" className="max-w-[200px] text-[10px]">
    Explanation of the setting...
  </TooltipContent>
</Tooltip>
```

---

## Technical Details

### Files to create:
- `src/components/RedditSubredditDrawer.tsx` — bottom drawer, mirrors `DatasetDrawer.tsx` structure
- `src/components/RedditAdGeneratorDrawer.tsx` — right sheet, mirrors `GenerateConceptsDrawer.tsx` structure

### Files to modify:
- `src/pages/Workflows.tsx` — add Reddit type, tab, template card
- `src/pages/WorkflowCanvas.tsx` — add Reddit nodes/edges, drawer state, node click handlers, catalog entries
- `src/components/ExecutionOutputPanel.tsx` — add run output views for both new node types

### New icons needed:
- Will use existing lucide icons (e.g., `MessageSquare` or a custom Reddit-like icon for the workflow type)

### Activation logic:
- Reddit workflows can be scheduled (not manual-only), so activation toggle works with a Schedule node present
- `canActivate` logic updated to also accept `reddit-subreddit` node type

