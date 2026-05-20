# Review Dataset node — configured visual

Bring the Review Dataset node visual in line with the Ad Library tracker (Dataset) node so it communicates its configured state at a glance.

## What changes

In `src/pages/WorkflowCanvas.tsx`, inside the node card body where each node type renders its mini-preview:

**Configured state (`review-dataset`)**
- Reuse the same stacked brand-avatar row used by `dataset` (3 overlapping 36px circles, `ring-2 ring-card`, `-space-x-2`).
- Overlay a small Trustpilot badge on the lead avatar: a white-ringed pill in the bottom-right corner containing a filled green star (Trustpilot green `#00B67A`) to signal the review source.

**Unconfigured state (`review-dataset`)**
- Mirror the dataset unconfigured placeholder: 3 dashed empty circles stacked, so the empty/filled transition reads the same as the Ad Library tracker.

No other node types, drawers, or logic are touched.

## Technical notes

- Edit only the two render branches inside the node body (`isUnconfigured` and `isConfiguredNode`) around lines 1486 and 1572.
- Use a small inline `Star` from `lucide-react` (already imported elsewhere) with `fill="#00B67A"` and `text-[#00B67A]`, wrapped in a `bg-card rounded-full p-0.5 ring-2 ring-card` badge anchored bottom-right of the first avatar.
- Brand initials reuse the existing `brands` array already defined in the configured block.
