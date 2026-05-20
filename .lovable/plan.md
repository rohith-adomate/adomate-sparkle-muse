# Skip Schedule step when rows are manually selected

When `manualAdGen.on` is true, the Schedule node is already hidden from the canvas and the catalog, but the **Continue chain** still walks into `ScheduleDrawer` after the user finishes the previous step (e.g. Select / Generate). It should instead jump straight to the final-step **SetupSummaryDrawer**, identical to the Ad Library tracker manual flow.

## Changes (single file: `src/pages/WorkflowCanvas.tsx`)

1. **`openNextDrawerFor` (line 364)** — when the next pipeline step is `schedule` and `manualAdGen.on`, skip it: open `SetupSummaryDrawer` instead of `ScheduleDrawer`.
2. **`continueLabelFor` (line 379)** — when the current step is the last *non-schedule* step under manual mode, return `"Finish"` so the previous drawer's CTA reads correctly.
3. No changes to the summary drawer itself — its CTAs (`Save draft` / `Save & run`) already swap to "manual" mode via the existing `mode={manualAdGen.on ? "manual" : ...}` prop and `onRunNow` handler.

## Technical notes

- Use the existing `manualAdGen.on` flag (already in scope) inside both callbacks and add it to their dependency arrays.
- Compute the "effective next" step by skipping any `schedule` entry in `pipeline` when manual mode is active. If skipping makes it the end of the pipeline, open `SetupSummaryDrawer`.
