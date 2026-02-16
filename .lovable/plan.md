

# Onboarding Flow as Modal Overlay

Instead of a separate full-screen route, the onboarding wizard will render as a large modal/dialog overlaying the main Adomate application. The user sees the real app (sidebar, topnav, Home dashboard) blurred/dimmed in the background, making the product feel tangible while they complete setup.

---

## Architecture

- Create `src/pages/Onboarding.tsx` containing all 6 steps as a self-contained wizard component
- Create `src/components/OnboardingOverlay.tsx` -- a full-viewport overlay that renders the onboarding wizard inside a large centered card (roughly 90vw x 90vh) with the app visible but blurred behind it
- Wire it into `AppLayout.tsx` so it renders on top of the normal app shell. A state flag (`showOnboarding`) controls visibility. For the prototype, it defaults to `true` and can be dismissed on completion
- No separate `/onboarding` route needed -- the overlay sits inside the existing layout
- When the user finishes Step 6 ("Launch into Adomate"), the overlay closes and reveals the full app beneath

## Visual Treatment

- **Background**: The full Adomate app renders normally (sidebar, topnav, Home page content)
- **Overlay**: A semi-transparent dark backdrop (`bg-black/60 backdrop-blur-sm`) covers the entire viewport at `z-60`
- **Wizard Card**: A large white/glass card centered on screen (`max-w-4xl w-[90vw] max-h-[85vh]`) with rounded corners, shadow, and internal scroll
- **Progress Bar**: Thin gradient bar at the top of the card showing steps 1-6
- **Skip / Back / Continue**: Button row at the bottom of the card

## The 6 Steps (Content unchanged from approved plan)

1. **Basic Info** -- Company name, website, industry, role, goal. "Continue" triggers a 3-second scrape animation
2. **Brand Review** -- Inferred data (pre-filled) plus industry-specific question templates (D2C, SaaS, Retail, F&B, Health, Finance, Education, Other)
3. **Connect Meta** -- Enticing upsell screen with benefits cards and "Connect with Meta" button. Skippable
4. **Upload Assets** -- Drag-and-drop zones for Brand Kit, Product Photos, Videos, Other
5. **Visual Style + Live Preview** -- Split panel: left controls (style presets, colors, font, copy), right shows a live-updating mock Instagram ad in a phone frame
6. **Wow Moment** -- Staggered reveal of 7 AI-generated ad topic cards with sparkle animation. "Launch into Adomate" button closes the overlay

## Files

### New Files
- `src/pages/Onboarding.tsx` -- The 6-step wizard component with all step content, local state management, mock data, industry templates, and HoverExplainers
- `src/components/OnboardingOverlay.tsx` -- The overlay wrapper (backdrop + centered card + progress bar + navigation buttons)

### Modified Files
- `src/components/layout/AppLayout.tsx` -- Import and render `OnboardingOverlay` on top of the existing layout. Add a `useState(true)` flag to control visibility. Pass `onComplete` callback to hide the overlay

## Technical Details

- All 6 steps live as internal state (`currentStep`) inside the wizard -- no routing changes
- The overlay uses `fixed inset-0 z-[60]` to sit above everything including the sidebar (`z-40`) and topnav (`z-50`)
- Step 5's split layout uses `grid grid-cols-2` inside the card, with the phone frame mock on the right updating via React state
- Step 6 uses `setTimeout` chains for the staggered card reveal animation
- Every section includes `HoverExplainer` tooltips with developer implementation notes
- A "Re-run Onboarding" button could optionally be added to Settings for demo purposes

