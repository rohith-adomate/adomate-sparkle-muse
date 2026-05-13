## Goal

When a suggestion chip is selected (Ad Objective, Creative Category, Offer Type), surface the **allowed values** as a separate, scannable element below the prompt box — so users immediately see this list controls what gets written into each cell, without having to read to the bottom of the long prompt.

## Where

`src/components/dataset-builder/EnrichDataModal.tsx`

Add a small `allowedValues: string[]` field to each entry in `SUGGESTIONS`. Render the values just under the prompt textarea, only when a chip is active (or when the prompt contains an `Allowed values:` line — parsed automatically).

## Three design directions to choose from

**Option A — Pill row (recommended)**
A muted label "Will output one of:" followed by small rounded outline pills, one per value. Pills wrap to multiple lines. Same accent color family as the active chip but lower contrast (border + tinted bg).

```text
Will output one of
[ Awareness ] [ Consideration ] [ Conversion ] [ Retargeting ] [ Retention ]
```

Pros: very scannable, feels like "tags" → matches what cells will display.
Cons: takes 1–2 lines vertical space for long lists (Creative Category = 14 values).

**Option B — Inline comma list with leading icon**
A single line under the prompt: a small `ListChecks` icon + "Outputs: Awareness · Consideration · Conversion · Retargeting · Retention". Truncates with `+N more` when >6 values; click to expand.

Pros: minimal footprint, stays out of the way.
Cons: less obvious these are the *only* allowed answers.

**Option C — Collapsible "Allowed values (5)" caption**
A subtle text button under the prompt: `Allowed values (5) ▾`. Expands to a soft-bg rounded box containing the pill row. Collapsed by default for long lists, expanded by default for ≤5.

Pros: handles 14-value Creative Category cleanly without dominating the modal.
Cons: one extra click for users who want to see the list.

## Behavior (all options)

- Visible only when `selectedChip` is set, OR when the user's custom prompt contains an `Allowed values: ...` line (parsed with a regex). This keeps the affordance useful even for hand-written prompts.
- If shown, also strip the trailing `Allowed values: ...` line from the visible textarea so it isn't duplicated. (Keep it in the prompt sent to `onRun`.)
- Style: `text-[11px]` muted label + pills using `border-border bg-muted/40 text-foreground/80`, no pink accent so it doesn't compete with the active chip.

## Recommendation

Go with **Option A** as the default, and auto-switch to **Option C** (collapsed) when the list has more than 8 values — so Creative Category stays tidy while Ad Objective and Offer Type stay fully visible.

Pick one (A / B / C / hybrid) and I'll implement.