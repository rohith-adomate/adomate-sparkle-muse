
# 5-Change Refinement Plan

## Change 1: Replace "Adomate" Text in TopNav with the Logo Image

The uploaded logo (`user-uploads://adomate_og_logo.png`) shows the Adomate brand mark — a red square with "Ad" in white plus "omate" in dark navy text. We need to:

1. Copy the logo from `user-uploads://adomate_og_logo.png` to `src/assets/adomate-logo.png`
2. In `src/components/layout/TopNav.tsx`, replace the current logo area (lines 27-32) — the gradient square + "Adomate" text span — with an `<img>` tag importing the logo asset
3. Size it appropriately: `h-7 w-auto` so it fits the 56px nav height without distortion
4. Remove the now-unused `Sparkles` import

---

## Change 2: Visual Polish — Animations, Graphics, Steve Jobs Quality

This touches `src/index.css`, `src/components/layout/AppLayout.tsx`, `src/components/OnboardingOverlay.tsx`, and key pages. Specific improvements:

**Global CSS additions (`src/index.css`):**
- Add `@keyframes float` — subtle vertical bob for hero icons (transform: translateY 0 → -8px → 0, 3s infinite)
- Add `@keyframes shimmer` — scan animation for loading skeletons/scraping screens
- Add `@keyframes glow-pulse` — soft halo pulse on primary-colored elements
- Add `.animate-float`, `.animate-shimmer`, `.animate-glow` utility classes
- Add smoother `transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]` base to cards

**Onboarding Overlay (`src/components/OnboardingOverlay.tsx`):**
- Backdrop: animate from `opacity-0` to `opacity-100` on mount using a `mounted` state + CSS transition
- Card: animate from `scale-95 opacity-0` → `scale-100 opacity-100` on mount (300ms cubic-bezier)
- Progress bar: already transitions, enhance with `ease-[cubic-bezier(0.4,0,0.2,1)]`
- Step pills: add `transition-all duration-300` so active state slides smoothly

**Onboarding Steps (`src/pages/Onboarding.tsx`):**
- Step 1 scrape screen: make the loader icon float with `animate-float`, add a subtle pulsing glow ring behind it, stagger each scrape step's fade-in with a 150ms CSS delay per item
- Step 5 phone mockup: add a `shadow-2xl` and a subtle `ring-1 ring-white/20` to make it look premium, add a thin bezel effect
- Step 6 topic cards: improve the stagger reveal — use `scale-95 → scale-100` in addition to the translate, making it "pop" in

**Home page (`src/pages/Home.tsx`):**
- Widget cards: add `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200` for micro-lift on hover
- Performance chart area: add animated gradient background that subtly shifts

**Sidebar (`src/components/layout/AppSidebar.tsx`):**
- Active nav item: add a left accent bar via `before:absolute before:left-0 before:h-full before:w-0.5 before:bg-primary before:rounded-r` with transition

---

## Change 3: New Onboarding Step — "AI Chat History" (Between Step 1 and Step 2)

The current flow is: Step 1 (Basic Info) → scrape → Step 2 (Brand Review) → Step 3 (Connect Meta) → ...

We need to insert a new step **between the scrape completion and Brand Review**, making the total 7 steps instead of 6.

**Changes needed:**

### `src/components/OnboardingOverlay.tsx`
- Change `stepLabels` array from 6 items to 7: `["Basic Info", "AI History", "Brand Review", "Connect Meta", "Upload Assets", "Visual Style", "Launch"]`
- Change all `currentStep === 6` references to `currentStep === 7`
- Change `Math.min(prev + 1, 6)` to `Math.min(prev + 1, 7)`
- Update progress calculation to divide by 7

### `src/pages/Onboarding.tsx`
- Rename/shift all step numbers: Step 2 (AI Chat History — new), Step 3 (Brand Review — was 2), Step 4 (Connect Meta — was 3), Step 5 (Upload Assets — was 4), Step 6 (Visual Style — was 5), Step 7 (Wow Moment — was 6)
- Add state: `const [aiChatLink, setAiChatLink] = useState("")`
- After scraping completes (currently `setStep(2)`), change to `setStep(2)` which now hits the new AI chat step
- The scrape auto-advance stays the same, just the step it lands on is now the new intermediate screen

**New Step 2 — AI Chat History screen content:**
```
Title: "Have you already started thinking about your ads?"
Subtitle: "If you've worked with an AI assistant (ChatGPT, Claude, etc.) to brainstorm ad ideas, paste the shareable link below and we'll incorporate those insights."

Icon: Large chat bubble icon (MessageSquare from lucide) with a subtle gradient glow

Input area:
  - Label: "Paste your AI chat link (optional)"
  - Input: full-width, placeholder="https://chatgpt.com/share/... or https://claude.ai/share/..."
  - Helper text below: "Supports ChatGPT and Claude public share links. We'll analyze the conversation to extract brand preferences, ad angles, and creative direction."

Two example cards below showing what this looks like:
  - "ChatGPT" card with logo color + "Share via chatgpt.com/share/..."
  - "Claude" card with Claude's orange/amber color + "Share via claude.ai/share/..."

HoverExplainer: "Backend: POST /api/onboarding/parse-ai-chat { url }. The scraper fetches the public chat transcript and sends it to an LLM with a prompt to extract: preferred ad angles, rejected ideas, brand voice notes, competitor mentions. Output merged into brand_knowledge.ai_context JSON field."
```

---

## Change 4: Swap "Workflows" and "Brand Data Room" in Sidebar

Currently in `src/components/layout/AppSidebar.tsx`:
- **Top section**: Home + Brand Data Room (collapsible)
- **Middle section** (`coreNav`): Campaigns, Concepts, Studio, Content, Calendar
- **Bottom section** (`bottomNav`): Performance, Workflows, Settings

The request is to swap Workflows position with Brand Data Room position.

**New layout:**
- **Top section**: Home + Workflows (no sub-items, just a direct link)
- **Middle section** (`coreNav`): Campaigns, Concepts, Studio, Content, Calendar — unchanged
- **Bottom section** (`bottomNav`): Performance, **Brand Data Room** (collapsible, moved here), Settings

Wait — re-reading: "swap the 'Workflow' menu item with the 'Brand Data Room' menu item". Brand Data Room is at the top (second item after Home). Workflows is at the bottom (second item in bottomNav). So we swap them:

- **Top section**: Home + **Workflows** (was at bottom)
- **Bottom section**: Performance + **Brand Data Room** (collapsible, was at top), Settings

The Brand Data Room collapsible with its 5 sub-items moves to the bottom nav group, replacing Workflows. Workflows moves to the top group as a simple nav link.

---

## Change 5: Placeholder Images Everywhere No Image Is Present

Pages that have empty/placeholder image areas:
1. **`src/pages/Products.tsx`** — product card thumbnails (currently a gradient rectangle with an Image icon)
2. **`src/pages/Studio.tsx`** — creative asset preview areas
3. **`src/pages/Concepts.tsx`** — concept card preview areas (likely gradient placeholders)
4. **`src/pages/Content.tsx`** — content card thumbnails
5. **`src/pages/BrandKnowledge.tsx`** — logo/visual asset upload areas
6. **`src/pages/Onboarding.tsx`** — Step 4 asset upload dropzones could show sample images
7. **`src/pages/Home.tsx`** — any image areas in widgets

We'll use `picsum.photos` URLs for authentic-looking placeholder images since they're free, reliable, and don't require authentication. For advertising/product contexts we'll use specific seeds that return relevant imagery:
- `https://picsum.photos/seed/product1/400/300` — product shots
- `https://picsum.photos/seed/ad1/400/400` — square ad format
- `https://picsum.photos/seed/brand1/800/400` — banner/hero format

For each page, we'll identify where gradients or empty boxes exist and replace/augment them with `<img>` tags using picsum URLs with `object-cover` and appropriate `aspect-ratio` classes.

---

## Technical Summary

**Files to copy:**
- `user-uploads://adomate_og_logo.png` → `src/assets/adomate-logo.png`

**Files to modify:**
1. `src/components/layout/TopNav.tsx` — Logo image (Change 1)
2. `src/index.css` — Animation utilities (Change 2)
3. `src/components/OnboardingOverlay.tsx` — 7-step labels, animation (Changes 2 & 3)
4. `src/pages/Onboarding.tsx` — New step 2, shifted step numbers, placeholder images (Changes 3 & 5)
5. `src/components/layout/AppSidebar.tsx` — Swap Workflows ↔ Brand Data Room (Change 4)
6. `src/pages/Products.tsx` — Placeholder images (Change 5)
7. `src/pages/Studio.tsx` — Placeholder images (Change 5)
8. `src/pages/Concepts.tsx` — Placeholder images (Change 5)
9. `src/pages/Content.tsx` — Placeholder images (Change 5)
10. `src/pages/Home.tsx` — Visual polish + placeholder images (Changes 2 & 5)

No new npm packages needed. All images use picsum.photos CDN URLs.
