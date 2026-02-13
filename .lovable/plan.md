

# V1 Visual and Flow Upgrade for Adomate

This upgrade focuses on two things: (1) making every screen visually distinctive and polished rather than generic, and (2) ensuring all flows between screens are coherent and connected.

---

## Part 1: Visual Overhaul (All Screens)

### Global Design System Refinements

- **Sidebar**: Add a subtle gradient background, user avatar at bottom, section dividers between nav groups (Home, Data Room, Campaigns group, Settings), and a refined logo mark at top
- **Top Nav**: Add a subtle frosted-glass/backdrop-blur effect, improve brand switcher with colored avatar initials, add a search command bar (Cmd+K style)
- **Cards**: Add subtle gradient overlays, hover lift animations (translate-y + shadow), and colored left-border accents for different statuses
- **Typography**: Use varied font weights more deliberately -- large display numbers, tighter tracking on headings, softer muted descriptions
- **Color accents**: Use distinct accent colors per module (indigo for Home, blue for Data Room, orange for Campaigns, green for Performance, purple for Concepts/Studio) via colored icon backgrounds and section headers
- **Replace all emoji placeholders** with styled gradient placeholder boxes using the module's accent color

### Screen-by-Screen Visual Improvements

**Home Dashboard**
- Hero greeting area with a subtle gradient banner behind the welcome message
- Summary widget cards get colored icon backgrounds (small pill-shaped badges) instead of bare icons
- Performance Snapshot section: add a mini sparkline chart visual (a styled SVG or a decorative bar)
- Setup Health: use a progress ring/bar showing "3 of 5 complete" with a percentage
- Recent Activity: add timestamps and small avatar dots
- Add a "Quick Actions" strip with shortcut buttons (New Campaign, Review Concepts, Open Studio)

**Brand Data Room Overview**
- Cards get large icon areas with colored gradient backgrounds
- Add a completion indicator (progress bar or checkmark) on each card
- Add "Last updated" timestamps on each card
- Overview stats row at top (total products, personas, keywords tracked)

**Brand Knowledge**
- Visual color swatches rendered as larger, clickable pill chips
- Section headers with decorative left-border accents
- Add a visual "Brand Identity Preview" card that mocks up how the brand would look in an ad

**Products**
- Product cards get a colored left accent bar based on status
- Add a visual product image placeholder area
- Competitor badges styled as colored pills with different colors
- Add product-to-persona linking indicator

**Personas**
- Persona cards styled with an avatar/icon area at top
- Visual demographic bars (age range shown as a range slider visual, income as a scale)
- Product links shown as connected pill tags

**Meta Integration**
- Add a visual Meta logo/brand mark area
- Sync status with an animated pulse indicator
- Account cards styled as a mini dashboard with spend mini-charts
- Add sync history timeline

**Custom Keywords**
- Keywords styled as interactive tag cloud with size variation by importance
- Category sections with colored headers
- Add a "trending" indicator on certain keywords

**Campaigns**
- Campaign cards redesigned as horizontal strips with a colored status indicator bar on the left, mini progress indicator, and metrics preview
- "Start New Campaign" button styled as a prominent gradient CTA
- New Campaign modal: add visual step indicator (numbered circles connected by a line) at the top
- Template cards get gradient icon areas and "Popular" / "New" badges

**Campaign Detail**
- Timeline redesigned as a vertical stepper with connecting lines, colored step icons, and duration bars
- Add a header banner area with campaign status (color-coded)
- Output section styled with a mini concept grid preview

**Concepts**
- Concept cards get gradient placeholder images with varied colors per campaign
- Add a shimmer/glass effect on card hover
- Status badges use colored dots instead of text badges
- Expanded view: masonry-style grid instead of rigid 3-column
- Detail dialog: larger preview with rounded corners, action buttons styled as large icon buttons with labels below

**Studio**
- Concept queue cards get subtle color coding by status (green border for Ready, yellow for In Progress, blue for Approved)
- Preview canvas gets a device frame mockup (phone frame for Story/Reels, monitor frame for Feed)
- Action buttons styled as a floating toolbar below the canvas
- QA checklist items get green check animations when toggled
- Add a "compliance score" indicator (e.g., "4/5 checks passed")

**Content Library**
- Content cards styled with a subtle gradient overlay on the thumbnail area
- Tab indicators styled with underline animation
- Action buttons get tooltips on hover
- Add a "Favorites" section at the top for starred items

**Calendar**
- Draft cards styled with a grab cursor and subtle shadow lift
- Calendar grid cells get hover highlights and drop zone indicators
- Published items styled with a green left-border, Scheduled with blue
- Add week navigation arrows and a "Today" button
- Campaign labels get colored dots

**Performance**
- KPI cards styled with colored top borders matching their trend direction (green for up, amber for down)
- Add decorative mini-chart icons inside KPI cards
- Creative performance section: cards styled as a ranked leaderboard with position numbers
- "Generate More Like This" button styled as a gradient accent button
- Learnings section: cards styled as alert-style banners with icons and distinct success/warning coloring

**Workflows**
- Current workflow card styled as a hero banner with gradient background
- Template cards get descriptive icons and visual distinctiveness
- Run history styled as a proper table with alternating row colors and status dots
- Customize modal: step navigator styled with a vertical stepper with connecting lines and step status icons

**Settings**
- Tab content areas with cleaner form spacing
- Team members shown with avatar circles and role badges
- Billing section with a visual plan comparison card
- Integration cards with service logos/icons

---

## Part 2: Flow Coherence Fixes

These ensure clicking through the app feels connected and logical:

1. **Content "Send to Calendar" action**: Currently the Content page has calendar icon buttons but they don't navigate to the Calendar page. Wire these up to navigate to `/calendar` with a toast confirmation.

2. **Studio "Add to Calendar" button**: Wire this to navigate to `/calendar` with a toast.

3. **Studio "Send to Approval" button**: Show a toast confirmation with the concept name.

4. **Campaign creation completion**: After "Save & Create Campaign" in the modal, show a toast and briefly highlight the new campaign in the list.

5. **Concept Accept/Reject/Iterate actions**: Show a toast feedback message and update the badge status visually (local state change).

6. **Brand Data Room cards**: Add breadcrumb navigation on detail pages (Brand Data Room > Brand Knowledge) so users can navigate back.

7. **Performance "Generate More Like This"**: Navigate to `/concepts` or show a toast saying "Queued for next campaign run."

8. **Workflows "Use Template"**: Show a toast and set the current workflow, closing the dialog.

9. **Home quick actions**: Add clickable shortcuts that navigate to the relevant pages.

10. **Calendar item actions**: Republish/Swap/Remove buttons show toast confirmations.

---

## Technical Approach

- All changes are purely visual/UX -- no backend, just UI refinements
- Add CSS utility classes and animations in `index.css` (subtle transitions, gradient utilities)
- Refactor each page file with improved layouts, hover states, and color accents
- Add `sonner` toast calls for action feedback throughout
- Add breadcrumbs as a small shared component
- Use `useNavigate` and `toast` from sonner for flow connections
- Each page gets touched with refined spacing, card styles, and visual hierarchy

All 16 page files, the 3 layout files, and `index.css` will be updated. No new dependencies needed -- everything uses existing shadcn/ui components, Tailwind, and lucide-react.

