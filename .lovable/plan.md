# Always-available "Manually select" option in Select node

Today, the Select node's "Manually selected" option is only enabled when users have already marked rows in the dataset (`manualSelectionAvailable = manualAdGen.on && manualAdGen.count > 0`). We want it to be **always available** so users can discover the manual flow from the Select drawer, and choosing it should bounce them back to the dataset panel to pick rows.

## Behavior

1. The "Manually selected {items}" option in the Select drawer is always selectable (no greyed-out / tooltip-locked state).
2. When the user picks `manual-selection`:
   - The Select drawer closes.
   - The **Dataset drawer** opens (`DatasetDrawer` for ad workflows, `ReviewDatasetDrawer` for review workflows) with an inline hint that they should mark rows with "Use for ad generation".
   - `manualAdGen.on` is set to `true` so the rest of the canvas reacts (Schedule node hides, summary swaps to manual mode, etc. — existing behavior).
3. When the user closes the dataset drawer with ≥1 row marked, the canvas continues into the existing manual flow (summary drawer with Save draft / Save & run).
4. If they close the dataset drawer with 0 rows marked, `manualAdGen.on` flips back to `false` and the Select node reverts to its previous mode so the workflow doesn't end up in an inconsistent state.

## Files to change

- **`src/components/TopAdsSelectionDrawer.tsx`**
  - Remove the `manualSelectionAvailable` gating on the option (or keep prop but treat it as always available). Show `(N)` count when there are existing marks; otherwise just the label.
  - Drop the disabled styling + tooltip for that option.

- **`src/pages/WorkflowCanvas.tsx`**
  - In `handleTopSelectChange` (or a new handler on the drawer), when `config.mode === "manual-selection"`:
    - `setManualAdGen({ on: true, count: prev.count })`
    - Close the Select drawer.
    - Open `DatasetDrawer` / `ReviewDatasetDrawer` (mirror the existing `openDrawerFor("dataset" | "review-dataset")` path).
  - Pass `manualSelectionAvailable={true}` unconditionally (or remove the prop usage).
  - When the dataset drawer closes, if `manualAdGen.count === 0` and mode is `manual-selection`, revert `topSelectConfig.mode` to `top-n` and `manualAdGen.on` to `false`.

## Technical notes

- The `manualAdGen` state already drives every downstream behavior (hide Schedule, swap summary CTAs, badge labels). No new state is needed.
- The dataset drawer already supports per-row "Use for ad generation" marking — no changes there.
- No business-logic changes outside the Select node ↔ Dataset drawer hand-off.
