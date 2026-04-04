

## Change Run Label from "Run #4" to "Run #10"

**What to do**: In `src/data/conceptsData.ts`, update the `label` field of the `ai-image-studio-1` agent run from `"Run #4"` to `"Run #10"`.

**File**: `src/data/conceptsData.ts`, line ~27
- Change: `label: "Run #4"` → `label: "Run #10"`

This single change propagates to the page title, the run pill in the detail modal, and anywhere else `run.label` is referenced.

