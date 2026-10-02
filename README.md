# Race Control — Vue 3 Rebuild

Vue 3 + Vite + Pinia + Tailwind CSS rebuild of the Race Control activity tracking app (originally React).

Built from a UX audit of the live production app at `the production app`.  
See `../race-control-ux-audit.md` for the full audit findings and design rationale.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Build | Vite 6 |
| State | Pinia |
| Routing | Vue Router 4 |
| Styling | Tailwind CSS 3 (dark/light via `class` strategy, semantic CSS-variable tokens) |
| Language | JavaScript (no TypeScript) |

---

## Getting Started

```bash
npm install
npm run dev       # → http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build
```

---

## Folder Structure

```
src/
├── assets/
│   └── main.css              # Tailwind imports + global utility classes
├── components/
│   ├── layout/
│   │   ├── AppLayout.vue     # Root layout wrapper (topbar + content area)
│   │   └── AppTopbar.vue     # Fixed top navigation bar with theme toggle
│   ├── ui/                   # Generic, reusable design system components
│   │   ├── AppButton.vue     # primary / secondary / ghost / danger variants
│   │   ├── AppBadge.vue      # status badges — success / brand / warning / etc.
│   │   ├── AppAvatar.vue     # initials avatar with deterministic color
│   │   ├── AppModal.vue      # accessible dialog with Teleport + Transition
│   │   ├── AppProgressBar.vue
│   │   ├── AppTooltip.vue    # hover tooltip via group-hover
│   │   ├── StatCard.vue      # KPI stat card (label + value + sublabel)
│   │   └── DataTable.vue     # sortable table with slot cells + empty state
│   └── features/             # Domain-specific components (implement here)
│       ├── activity/
│       │   ├── ActivityModal.vue   # TODO: 2-step category picker → form
│       │   ├── ActivityTable.vue   # TODO: table view
│       │   ├── ActivityCalendar.vue
│       │   └── ActivityKanban.vue
│       ├── directory/
│       │   ├── VendorRow.vue       # TODO: full-row clickable vendor item
│       │   └── TrendingWidget.vue
│       ├── gamification/
│       │   ├── PointsCounter.vue
│       │   ├── Leaderboard.vue
│       │   └── LevelProgress.vue
│       └── dashboard/
│           ├── DashboardKPIs.vue
│           ├── ActivityTrend.vue
│           └── PartnerBreakdown.vue
├── views/
│   ├── MetricsView.vue       # / — Home: race, KPIs, Insights (merged former /dashboards)
│   ├── ActivityView.vue      # /activity — table/calendar/kanban
│   ├── DirectoryView.vue     # /directory — vendors/resellers/end users
│   ├── VendorView.vue        # /directory/vendor/:id — vendor detail
│   ├── ProfileView.vue       # /profile — user stats + gamification
│   ├── SettingsView.vue      # /settings — preferences + theme toggle (NEW)
│   ├── ChangelogView.vue     # /changelog
│   ├── GuideView.vue         # /guide — how-to
│   ├── AdminView.vue         # /admin — admin only, guarded by router
│   ├── LoginView.vue         # /login
│   └── NotFoundView.vue      # 404
├── stores/
│   ├── useAuthStore.js       # Mock auth — replace with real API
│   ├── useThemeStore.js      # Dark/light theme — persists to localStorage
│   ├── useActivityStore.js   # Activity CRUD — replace with real API
│   └── useDirectoryStore.js  # Vendors/resellers — replace with real API
├── router/
│   └── index.js              # Routes, auth guard, /dashboard → /dashboards redirect
├── composables/              # Add shared composables here (useToast, useInfiniteScroll, etc.)
├── data/                     # Static mock data / fixture files
├── App.vue                   # Root component (just <RouterView />)
└── main.js                   # App bootstrap: Pinia + Router + session restore
```

---

## Design System

Tokens are RGB channels in CSS variables (`src/assets/main.css`, light + `html.dark`) mapped in `tailwind.config.js`, so one class works in both themes and supports opacity (`bg-brand/10`). Browse everything at `/ds` (admin).

| Token | Dark value | Use for |
|---|---|---|
| `bg-page` | `#06131A` | Page background |
| `bg-surface-1/2/3` | `#0B1D27` / `#10283A` / `#163246` | Cards / rows & controls / hover & active |
| `border-line` | `#1C3A4B` | Borders, dividers |
| `text-fg` / `text-fg-2` / `text-fg-muted` | `#EAF4F8` / `#A3B9C5` / `#7591A0` | Text hierarchy |
| `brand` (+ `brand-on`, `brand-hover`) | `#3BB3E5` | Actions, active states, focus, links |
| `reward` (+ `reward-fill`, `reward-on`) | `#F5B623` | Points, levels, XP, bonuses — **only** |
| `podium-gold/silver/bronze` | | Rank 1/2/3 only |
| `success` · `warning` · `danger` | | Status |

All views and components use the semantic tokens — the old `surface-dark-*` / `surface-light-*` pairs were removed.

**Typography** — self-hosted via `@fontsource-variable` (imported in `main.js`): `font-display` Unbounded (titles, big numbers), `font-sans` Manrope (UI, default), `font-mono` JetBrains Mono (countdowns, IDs). Labels use `text-overline` (12px); avoid `text-2xs`.

**Gamification data** — level/XP comes only from `getLevelInfo()` / `auth.levelInfo` (`useAuthStore`). Races, periods and standings come from `useRaceStore` (week/month/quarter/year); the Metrics period switch drives both the race panel and the KPI row.

**Dark/Light mode:** Toggle class on `<html>`. ThemeStore reads/writes `localStorage('rc-theme')` and applies the class immediately on boot to avoid flash.

---

## UX Fixes Applied (from audit)

| # | Original issue | Fix in this rebuild |
|---|---|---|
| 1 | Gear icon → Admin panel | Gear icon → `/settings` (correct convention) |
| 2 | `/dashboard` 404s | Router redirect `/dashboard` → `/dashboards` |
| 3 | Directory rows not fully clickable | Entire row is a `<RouterLink>` |
| 4 | Dashboard defaults to empty "My" view | Defaults to "Team" scope |
| 5 | No Settings page | `/settings` view added |
| 6 | Admin via unexpected path | Admin in user dropdown, guarded by `requiresAdmin` |
| 7 | No tooltip on icon nav buttons | `AppTooltip` on all icon buttons |
| 8 | Period Progress bars mislabeled | Relabeled "Period elapsed" with explanatory sub-text |
| 9 | Create Follow-up loses vendor context | Prefill prop on ActivityModal |
| 10 | Admin no visual separation | "Admin Mode" banner + indicator in AdminView |

---

## Development Workflow

1. **Add a feature component** in `src/components/features/<domain>/`
2. **Connect it in the view** under `src/views/`
3. **Add state** to the appropriate store in `src/stores/`
4. **Replace TODO mock data** with real `fetch()` / `axios` calls pointing to the Race Control API
5. **Test dark + light mode** — use the toggle in the topbar

---

## GitHub Setup

```bash
# Remote je već podešen na:
# https://github.com/NebojsaBrnjasevic/rc-prototype

# Push sa terminala:
cd race-control-vue
git push -u origin main
```

---

## Deploy (GitHub Pages)

`.github/workflows/deploy-pages.yml` builds and publishes on every push to `main` (or manually via **Actions › Deploy to GitHub Pages › Run workflow**).

- One-time setup: **Settings › Pages › Source: GitHub Actions**
- URL: `https://<user>.github.io/<repo>/` — the workflow passes the repo name as `BASE_PATH`
- `npm run build:pages` also copies `index.html` to `404.html`, so deep links and refreshes on routes like `/activity` work
- Local `npm run dev` / `npm run build` are unchanged (base `/`)
