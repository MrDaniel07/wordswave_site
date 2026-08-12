# WordsWave Landing Page — Current Status & Remaining Fix

## What's already done
- Full landing page built in `src/App.tsx`
- `src/lib/api.ts` now bypasses the edge function entirely — it talks directly to Supabase PostgREST (`/rest/v1/kv_store_5a760fd9`)
- The `kv.getKey` edge function errors are **stale logs from the old deployed function** and have no frontend impact

## The remaining risk: RLS on the kv table
The `kv_store_5a760fd9` table was created by Figma Make using the service role key. The anon key (used by the frontend) may be blocked by RLS policies, causing silent write failures on admin saves and feature submissions.

## Fix: Add RLS policies in Supabase dashboard
Go to: https://supabase.com/dashboard/project/urppgvmqayoektgbeapj/database/tables → `kv_store_5a760fd9` → RLS

Add two policies:
1. **Allow anon SELECT**: `USING (true)`
2. **Allow anon INSERT/UPDATE**: `WITH CHECK (true)`

Or simply disable RLS on the table (safe since no PII is stored there).

## Original Plan

## Context
Build a complete single-page scrolling landing page for **WordsWave**, a gamified mobile vocabulary learning app. The user supplied the app icon, two app screenshots, and a detailed brief. This replaces the existing placeholder App.tsx entirely.

## Design Decisions

- **Background**: `#84B8F6` (exact, user-specified) throughout the page
- **Cards**: Pink/salmon `#FAD4D4` surfaces, matching the app's card style seen in screenshots
- **Buttons**: Pink `#F9A8C9` / `#EC4899` rounded pills (matching app UI)
- **Accent**: Deep navy `#1E3A5F` for contrast text and borders
- **Fonts**: Nunito (Google Fonts) — rounded, playful, perfect for gamified edu apps. Bold weights for headings, regular for body.
- **Stance**: Playful-clean — not brutalist or archival. Rounded corners everywhere, friendly, mobile-app-aesthetic translated to web.

## Files to Modify

### `src/index.css`
- Add Google Fonts `@import` for Nunito (weights 400, 600, 700, 800, 900) at the top
- Set `font-family: 'Nunito', sans-serif` as global default
- Keep `@import 'tailwindcss'` after the Google Fonts import

### `src/App.tsx`
Full rewrite with all sections using React state for interactive elements. No external dependencies needed beyond what's already installed.

## Section Implementation

### 1. Navbar
- Fixed/sticky, `bg-[#84B8F6]` with subtle bottom border
- Logo: imported `icon-.png` as ES module via `<img>` (32×32) + "WordsWave" bold text
- Nav links: Features, FAQ, Events, Roadmap & Voting, Contact — smooth scroll anchors
- Mobile: hamburger menu with `useState` toggle

### 2. Hero
- Two-column layout (text left, phone mockup right) — stacks on mobile
- Headline, subheadline, two buttons:
  - Primary: "Get it on Google Play" → links to Play Store URL
  - Secondary: "Coming Soon on Apple Store" — ghost/disabled style
- Right column: stacked app screenshots (`WhatsApp_Image_2026-08-08_at_06.58.39.jpeg` and `WhatsApp_Image_2026-08-08_at_06.58.41__1_.jpeg`) in a rounded phone-frame mockup

### 3. Core Features (6 cards grid)
Cards on `#FAD4D4` background, 2-col on mobile / 3-col on desktop:
- Daily Word — 📖 icon
- Quiz System — ❓ icon
- Streak Tracking — 🔥 icon
- Leaderboards & Profiles — 🏆 icon
- Pro Premium — ⭐ icon
- Tools — 🛠 icon

### 4. FAQ Accordion
`useState` tracks open index. Each question toggles open/close with chevron rotation animation. Cards in `#FAD4D4`.

### 5. Events Section
Horizontal row of 4 cards (scrollable on mobile):
- Community Challenges, Seasonal Events, Leaderboard Tournaments, Educational Workshops

### 6. App Features Voting (Roadmap)
`useState` with an array of feature requests, each with upvote/downvote counts. Clicking vote buttons updates local state (sorted by votes). Features pre-seeded with plausible WordsWave roadmap items.

### 7. Footer & Contact
- Contact form (Name, Email, Message) with `mailto:wordswavesupport@gmail.com` via `<form action="mailto:...">` or a `useState`-managed form
- Social icons: Facebook 🔵, TikTok ⚫ (SVG icons inline)
- Privacy Policy and Terms of Service links (provided URLs)

## Image Imports
```tsx
import appIcon from "@/imports/icon-.png";
import screenshot1 from "@/imports/WhatsApp_Image_2026-08-08_at_06.58.39.jpeg";
import screenshot2 from "@/imports/WhatsApp_Image_2026-08-10_at_00.51.03.jpeg";
```
Note: `ImageWithFallback` component does not exist in this project (it's a plain Vite/React scaffold, not the full Figma Make template). Use standard `<img>` tags with ES module imports.

## No New Dependencies
All functionality uses React `useState`/`useEffect` only. No Firebase needed for this phase — voting uses local state. The user can connect Firebase later.

## Verification
1. Check that the dev server (already running on `$PORT`) reflects hot-reload changes
2. Scroll through all sections: nav links anchor-scroll correctly
3. FAQ accordion opens/closes
4. Voting buttons increment/decrement counts
5. Nav mobile hamburger toggles on narrow viewport
6. App screenshots render (not broken img tags)
