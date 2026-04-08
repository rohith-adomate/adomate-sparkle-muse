

## Problem Analysis

The top-right `X` button (closes the entire dataset drawer) is positioned directly above the inspector panel's `>>` close button. When the inspector is open, users instinctively click the more prominent `X` thinking it will close the inspector, but it closes everything instead.

## Recommended Solution: Remove the top-right X entirely

The simplest and most effective fix. Here's the reasoning:

1. **The X is redundant** — the `← Arrow` button on the left already closes the drawer with a "Back to canvas" tooltip. The 5% backdrop click also closes it. Three close mechanisms is excessive.

2. **Removing it eliminates confusion entirely** — no ambiguous close button near the inspector panel.

3. **It follows established patterns** — most full-screen/near-full-screen panels (Google Sheets sidebars, Figma panels, Notion databases) use a single back/close affordance on the left side, not a competing X on the right.

### Alternative considered but not recommended

- *Hide the X only when inspector is open* — creates inconsistency; users would notice the button appearing/disappearing.
- *Move the X further left away from the inspector* — still two close buttons competing for attention.
- *Add a visual separator between top bar and inspector* — adds complexity without solving the root cause.

### Implementation

**Single file change:** `src/components/dataset-builder/DatasetBuilderDrawer.tsx`
- Remove the absolute-positioned `X` button (line 208-210)
- Remove the `mr-10` spacing on the Export CSV container (was only there to make room for the X)
- The `← Back` button and backdrop click remain as the two ways to close the drawer

