# Next.js Migration Plan (TypeScript + Drizzle + Tailwind/shadcn)

## Goals
- Migrate the current Vite multi-page app to a Next.js App Router app using TypeScript (strict: false).
- Replace Firebase Auth/Firestore with Supabase Auth and Drizzle ORM backed by Supabase Postgres.
- Replace Cloudinary uploads with Supabase Storage.
- Remove Roboflow and HuggingFace; all AI features run through Google AI Studio (Gemini).
- Use Tailwind CSS + shadcn/ui for styling and component primitives.
- Use Bun for runtime and package management.
- Preserve feature and content parity before cleanup; keep secrets server-side.

## Non-Goals (for the first pass)
- Full UX redesign beyond necessary component refactors.
- New global state management beyond React state/hooks.
- Building a custom backend beyond auth/data/AI proxy needs.
- Automatic migration of historical Firebase data unless explicitly required.

## Current Inventory (What Exists Today)
- Pages: index.html (redirect), welcome.html, app.html, smart_ai.html, public/about.html, public/farmer_stories.html, public/our_research.html, public/team.html, public/pest-scan.html, public/local-risk-map.html, public/A4.html, public/bangla-voice-interface.html.
- Core modules: modules/auth.js, batches.js, weather.js, weatherRiskLogic.js, aiScan.js, ragService.js, profile.js, offline.js, localization.js, localRiskMap.js, quickRegister.js, ui.js.
- Assets: public/images, public/css, public/data.
- External services currently used: Firebase Auth/Firestore, Cloudinary, OpenWeather, Roboflow, HuggingFace, Google Gemini, RAG backend.

## Target Architecture (Next.js App Router)
- Next.js App Router with TypeScript.
- Tailwind CSS + shadcn/ui; legacy CSS only as a temporary bridge.
- Data layer: Drizzle ORM with Supabase Postgres.
- Auth: Supabase Auth for sessions and OTP; auth guards via middleware.
- API routes for weather and AI; Gemini handles all AI tasks.
- Supabase Storage replaces Cloudinary for uploads.
- Offline queue remains client-side and syncs to API routes.
- Bun for runtime and package manager (bun install, bun dev, bun run).

## Route Mapping (HTML -> Next.js Route)
- welcome.html -> /
- app.html -> /app (protected)
- smart_ai.html -> /smart-ai
- public/pest-scan.html -> /pest-scan
- public/local-risk-map.html -> /local-risk-map
- public/about.html -> /about
- public/farmer_stories.html -> /farmer-stories
- public/our_research.html -> /our-research
- public/team.html -> /team
- public/A4.html -> /A4 (or /risk-predictor)
- public/bangla-voice-interface.html -> /bangla-voice-interface

## Environment Variable Mapping
- Remove:
  - VITE_FIREBASE_*
  - VITE_CLOUDINARY_*
  - VITE_RF_API_*
  - VITE_HF_API_*
- Server-only (no prefix; use API routes):
  - DATABASE_URL
  - WEATHER_API_KEY, WEATHER_BASE_URL
  - GOOGLE_AI_STUDIO_API_KEY
  - SUPABASE_SERVICE_ROLE_KEY
  - SUPABASE_STORAGE_BUCKET
  - Optional: RAG_DATA_URL (only if used as context source for Gemini)
- Client-exposed (only if needed for Supabase Auth on client):
  - NEXT_PUBLIC_SITE_URL
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY

## Migration Phases

### Phase 0: Decisions and Baseline
- Confirm TypeScript strictness level.
- Confirm Supabase project (Postgres + Auth + Storage).
- Confirm Supabase Storage bucket and access pattern (signed uploads).
- Define Gemini prompt schemas and output contracts.
- Decide whether Firebase data needs migration.
- Supabase Auth setup checklist:
  - Enable Email/Password and Google OAuth providers.
  - Enable Phone OTP and set SMS provider.
  - Configure site URL, redirect URLs, and deep links.
  - Decide on session strategy (PKCE + cookies) and token lifetime.
  - Set RLS policies for user-owned data tables.

### Phase 1: Scaffold Next.js
- Create Next.js App Router project with TypeScript.
- Install Tailwind CSS and shadcn/ui; set up global styles.
- Install Drizzle ORM + driver + migrations tooling.
- Add base layout and route groups for marketing vs app.
- Initialize Bun lockfile and use Bun for installs and scripts.
- Update package.json scripts to Bun conventions (dev/build/start).

### Phase 2: Data Model + Drizzle
- Define Drizzle schema for users, profiles, batches, badges, scans, alerts.
- Create migrations and seed data for dev.
- Implement server data layer (db client + repositories).

### Phase 3: Auth + App Shell (Firebase Replacement)
- Implement auth flows (email/password + Google OAuth + OTP) with Supabase Auth.
- Store users and profiles in Drizzle; sessions via Supabase Auth cookies.
- Build protected /app layout and auth guard redirects.

### Phase 4: Migrate Marketing Pages
- Convert welcome.html to / (app/page.tsx) and componentize.
- Port welcome animations to client-only components with dynamic imports.
- Rebuild shared nav + language toggle in React.

### Phase 5: Migrate Static Content Pages
- Convert about, research, stories, team, A4, voice pages to routes.
- Replace legacy CSS with Tailwind/shadcn.
- Move assets to /public and update paths.

### Phase 6: Batches + Offline Queue + Uploads
- Port batch UI to React components using shadcn forms.
- Implement CRUD API routes backed by Drizzle.
- Keep offline queue in localStorage and sync when online.
- Integrate Supabase Storage for batch/profile images (signed uploads).
- Keep JSON/CSV export behavior.

### Phase 7: Weather + ETCL Risk
- Create /api/weather server route to call OpenWeather securely.
- Move ETCL logic to shared TypeScript utilities.
- Update client UI to use server data and render risk summaries.

### Phase 8: AI Features via Google AI Studio
- Implement /api/ai/scan, /api/ai/pest, /api/ai/alerts using Gemini.
- Remove Roboflow/HF calls; keep RAG only as a data source if needed.
- Normalize Gemini responses to match existing UI expectations.

### Phase 9: Local Risk Map
- Convert local risk map to a client-only Leaflet component.
- Load mock data from /public/data or read from DB.

### Phase 10: QA and Parity + Cleanup and Deploy
- Verify route parity, auth, batch CRUD, offline sync, weather/ETCL, AI, exports, and maps.
- Remove Vite config and Firebase/Cloudinary/Roboflow/HF dependencies.
- Update package.json scripts to Next.js defaults.
- Run Drizzle migrations and deploy to Vercel.

## Acceptance Criteria
- All routes render correctly under Next.js with TypeScript.
- Data persists via Drizzle on Supabase Postgres; Firebase removed.
- Auth via Supabase works for protected routes.
- Uploads use Supabase Storage; Cloudinary removed.
- AI scan/pest/alerts run via Gemini; Roboflow/HF removed.
- UI uses Tailwind + shadcn.
- Offline queue, exports, weather/ETCL, and local risk map work.

## Risks and Mitigations
- Auth replacement complexity: implement early and test flows.
- Data migration uncertainty: decide early whether Firestore data must be imported.
- Storage provider choice: pick early to avoid rework.
- AI cost/latency: add caching and rate limiting.
- SSR issues with DOM-only code: isolate to client components/dynamic imports.

## Rollback Plan
- Keep the Vite app in a /legacy folder or separate branch until parity is confirmed.
- If critical regressions appear, revert to the Vite build and fix in parallel.
