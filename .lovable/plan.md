

## Plan: Add "Manual Image Input" Node to Workflow Canvas

### Overview

Add a new **Manual Image Input** node type that lets users upload images at run time. When present, the workflow cannot be scheduled—only manually run. Clicking **Run** opens an upload modal instead of starting immediately.

### Changes

#### 1. New component: `src/components/ManualImageInputDrawer.tsx`
A drawer (matching existing drawer pattern) that opens when clicking the node on canvas. Shows explanation text: "Images will be requested when you run this workflow." Displays a read-only preview of previously uploaded images from the last run (if any). Minimal configuration—this node's real interaction happens at run time via the upload modal.

#### 2. New component: `src/components/ManualImageUploadModal.tsx`
A `Dialog` modal triggered by the Run button when a `manual-image-input` node exists:
- Drag-and-drop zone + file picker for uploading one or more images
- Image thumbnails with remove buttons
- "Run Workflow" primary button (disabled when no images uploaded)
- Helper text: "This workflow requires manual image input. Upload one or more images to start the run."
- Uses `ImagePlus` icon from lucide-react

#### 3. Update `src/pages/WorkflowCanvas.tsx`

**Node catalog** — Add new entry under a new `"dynamic-data"` category group:
```
{ type: "manual-image-input", label: "Manual Image Input",
  description: "Upload images at run time.",
  icon: ImagePlus, inputs: [], outputs: ["Images"] }
```
Add `"dynamic-data"` to `CATEGORY_COLORS` with a warm orange/amber hue (e.g. `"35 90% 55%"`).

**Schedule/activation logic** — Extend `canActivate` to return `false` when a `manual-image-input` node is present. Update the tooltip text to explain why ("Manual Image Input nodes require manual runs").

**Active toggle** — When `manual-image-input` node exists, force `agentEnabled` to `false` and disable the toggle with appropriate tooltip.

**Run button behavior** — When clicked, check if `manual-image-input` node exists. If yes, open `ManualImageUploadModal` instead of running immediately. On confirm (with images), show success toast simulating run start.

**Node click handler** — Add `else if (node.type === "manual-image-input")` branch to open the new drawer.

**State additions** — `manualImageDrawerOpen`, `manualImageUploadModalOpen`, `uploadedImages` state variables.

### Technical Details

- Category color for `dynamic-data`: `"35 90% 55%"` (amber)
- Icon: `ImagePlus` from lucide-react
- The upload modal stores images as `File[]` in local state (no actual upload—this is mock/demo)
- Image thumbnails use `URL.createObjectURL` for preview
- The node outputs `["Images"]` which can connect to `generate-concepts` input

### File Summary

| File | Action |
|------|--------|
| `src/components/ManualImageInputDrawer.tsx` | Create |
| `src/components/ManualImageUploadModal.tsx` | Create |
| `src/pages/WorkflowCanvas.tsx` | Modify (catalog, colors, state, run logic, click handler, activation logic) |

