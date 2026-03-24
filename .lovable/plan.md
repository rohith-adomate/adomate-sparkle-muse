

# Replace Placeholder Images with Oy Care Brand Assets

## Overview
Replace all picsum.photos placeholder images across Studio, Content, and Products pages with the actual Oy Care ad creatives uploaded by the user. This will make the prototype feel like a real production environment for the Oy Care brand.

## Uploaded Assets
The user provided 8 images (3 PNG, 5 AVIF) showing Oy Care product ads (Scalp & Hair Wash, Deo Wash). These will be copied into `src/assets/` and imported as ES6 modules.

## Changes

### 1. Copy uploaded images to `src/assets/oy/`
Copy all 8 uploaded files into `src/assets/oy/` with descriptive names:
- `oy-ad-1.png` (Scalp & Hair Wash - greenhouse)
- `oy-ad-2.png` (Deo Wash - gel to milk)
- `oy-ad-3.png` (Deo Wash - sport bubbles)
- `oy-ad-4.avif` through `oy-ad-8.avif` (remaining AVIF files)

### 2. Create a shared image registry (`src/data/oyImages.ts`)
A single file that imports all Oy Care assets and exports them as arrays, so all pages can reference them consistently:
- `oyAdImages`: array of all ad creative URLs
- `oyProductImages`: mapped subsets for product cards
- Helper function `getOyImage(index)` that cycles through available images

### 3. Update `src/pages/Studio.tsx`
- Replace the 6 `picsum.photos/seed/genN` URLs in `demoGenerations` with imports from the Oy image registry
- Update product name from "FACE WASH SENSITIVE" to Oy Care product names (e.g., "SCALP & HAIR WASH", "DEO WASH")

### 4. Update `src/data/contentData.ts`
- Replace all `imgSeed`-based picsum references: update the `imgSeed` values or add direct `imgUrl` fields
- Alternative (simpler): add an `imgUrl` property to `ContentAd` and each `AdVersion`/`AdHistoryEntry`, then update Content.tsx to prefer `imgUrl` over the picsum seed fallback

### 5. Update `src/pages/Content.tsx`
- Modify image rendering to use the new `imgUrl` field from contentData when available, falling back to picsum seed if not set
- This affects: ad card thumbnails, version carousel, history timeline images, and history detail view

### 6. Update `src/pages/Products.tsx`
- Replace `initialProducts` data with Oy Care product names (Scalp & Hair Wash, Deo Wash, Face Wash, etc.)
- Replace `getImageUrl` picsum function with imports from the Oy image registry
- Update product URLs to oycare.com equivalents

### 7. Update `src/pages/ProductDetail.tsx`
- Replace `productData` record with Oy Care product entries matching Products.tsx
- Replace `getImageUrl` picsum function with the shared image registry
- Update product URLs to oycare.com

### 8. Update related components
- `src/components/AddProductModal.tsx`: Replace picsum URL in scrape result with an Oy image
- `src/components/ExecutionOutputPanel.tsx`: Replace picsum URLs in ad previews and manual input outputs with Oy images

## Technical Notes
- All images imported via `src/assets/` for proper Vite bundling
- AVIF files are supported by Vite's asset pipeline
- Images will cycle/repeat where more slots exist than unique images (8 images across ~20+ slots)
- Brand name references ("acmeco.com") updated to "oycare.com" where they appear as product URLs

