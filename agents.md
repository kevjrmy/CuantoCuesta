# Agents.md — Price Comparison PWA (Techstars Startup Weekend Valencia)

## Project Overview

This is a 2-day MVP built during a Techstars Startup Weekend. The product is a **price comparison PWA** — users can search/browse items and compare prices across sources.

## Tech Stack

- **Build tool:** Vite
- **Framework:** Vue 3, Composition API, `<script setup>`
- **PWA:** vite-plugin-pwa
- **Styling:** Vanilla CSS only — no Tailwind, no SASS/SCSS
- **Icons:** unplugin-vue-components + unplugin-icons + @iconify/json
- **Backend:** Go (deployed on Google Cloud Run)
- **API spec:** `api/openapi.yaml` (OpenAPI 3.0)

## Frontend Ownership

Frontend and UI/UX are owned by the frontend dev on the team — visual design and polish matter, this needs to look good in a demo. When in doubt about visual decisions, favor clean, simple, mobile-first design.
Let's think it at app mobile design more than web design. Remember about the iOS safe area padding

## Code Style Conventions

### JavaScript / Vue

- **No semicolons.** Ever. Match this style in all generated code.
- Use `<script setup>` with the Composition API — no Options API.
- Prefer `const` over `let`, avoid `var`.
- Use `ref` / `reactive` / `computed` as appropriate; keep state local to the component unless it needs to be shared.
- Component file names and `<template>` tags: **PascalCase** (e.g. `BottomNav.vue` → `<BottomNav />`).
- Props: use the object syntax with types (`defineProps({ ... })`), not the array shorthand, unless trivial.

Example of expected style:

```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)

const doubled = computed(() => count.value * 2)

function increment() {
  count.value++
}
</script>
```

### CSS

- **Vanilla CSS only** — no Tailwind, no SASS/SCSS, no CSS-in-JS.
- Use `<style scoped>` inside each component by default.
- Shared design tokens (colors, spacing, radius, font sizes) go in a global stylesheet (e.g. `src/assets/main.css` or `src/styles/variables.css`) as CSS custom properties (`--color-primary`, `--space-md`, etc.), and components reference them via `var(...)`.
- Mobile-first: design and write media queries for small screens first, then scale up.

### Vue Components

- **Single File Components (.vue)** — keep template, script, and style together in the same file whenever reasonably possible.
- Avoid splitting into extra files (separate composables, util files, etc.) unless logic is genuinely reused across multiple components. Prefer "more code in one file" over "many small files" for this MVP timeline.
- **Component-driven**: each component should have one clear responsibility (e.g. `DrawerMenu.vue` only handles the drawer, `BottomNav.vue` only handles bottom navigation).
- Keep components self-contained: a component should bring its own styles and logic, not rely on global CSS classes for its core appearance.

## Icons

- Icons are handled via `unplugin-icons` + `@iconify/json`, auto-imported through `unplugin-vue-components`.
- Import and use icons as components directly in templates, e.g.:

```vue
<script setup>
import IconHome from '~icons/mdi/home'
import IconSearch from '~icons/mdi/magnify'
</script>

<template>
  <IconHome />
  <IconSearch />
</template>
```

- Prefer a consistent icon set (e.g. stick to one icon collection like `mdi` or `tabler` for visual consistency) unless a specific icon is missing from that set.

## Project Structure (current)

```text
api/
  openapi.yaml
src/
  components/
    explore/
      ExploreFilters.vue
      ItemCard.vue
    home/
      BottomItem.vue
      Header.vue
      Hero.vue
      Map.vue
    inc/
      BottomNav.vue
      MenuDrawer.vue
    ui/
      Back.vue
      Toast.vue
  data/
    cuanto_cuesta.json        ← mock data, kept for reference/fallback
  layouts/
    AltLayout.vue
    DefaultLayout.vue
    MainLayout.vue
  views/
    pages/
      About.vue
      Account.vue
      Explore.vue
      Home.vue
      ItemDetail.vue
  App.vue
  main.js
  style.css
```

## Current Scope: Layouts and Pages

The application structure consists of:

- **Layouts** — `MainLayout.vue`, `DefaultLayout.vue`, and `AltLayout.vue` provide the structural shell.
- **Drawer menu** (`MenuDrawer.vue`) — slide-out side navigation, triggered from the top bar or a menu icon.
- **Bottom navigation** (`BottomNav.vue`) — fixed bottom nav bar for primary app sections.
- **Pages** (`views/pages/`) — main content views (`Home.vue`, `Explore.vue`, `About.vue`) containing price comparison results, search, etc.

## Data Model

The basic structure of a business/item record (`BusinessSummary` schema):

```json
{
  "id": 86,
  "name": "Andymer Tattoo",
  "category": "tienda-de-tatuajes",
  "label": "Tatuajes",
  "schema_type": "HealthAndBeautyBusiness",
  "description": "...",
  "city": "valencia",
  "address": {
    "street": "...",
    "locality": "...",
    "postal_code": "...",
    "country": "es"
  },
  "location": { "lat": 39.46, "lng": -0.37 },
  "rating": { "value": 5, "review_count": 13 },
  "price_from": 60,
  "price_to": 150,
  "price_currency": "EUR",
  "image_url": "...",
  "logo_url": "...",
  "sponsored": true,
  "verified": true,
  "unknown": false,
  "sources": ["booksy"],
  "last_verified": "2026-06-13T10:42:58Z",
  "stale": false
}
```

## API

The backend is a Go service deployed on **Google Cloud Run**:

- **Production URL:** `https://cuanto-cuesta-85809682499.us-central1.run.app`
- **Spec:** `api/openapi.yaml` (OpenAPI 3.0)
- **Scope:** Valencia only (`city=valencia`)

### Dev proxy (CORS)

The Cloud Run API does not send CORS headers, so direct browser fetches from `localhost` are blocked.
The Vite dev server proxies all `/v1/*` requests to the Cloud Run origin (`vite.config.js` → `server.proxy`).

In components, always use a **relative path** with no base URL:

```js
const API_BASE = import.meta.env.VITE_API_BASE ?? ''
// → VITE_API_BASE is intentionally empty in .env
// → In dev: Vite proxy forwards /v1/... to Cloud Run
// → In prod: same-origin Go server handles /v1/...
fetch(`${API_BASE}/v1/businesses?city=valencia&limit=100`)
```

Never hardcode the Cloud Run URL in component code — it only lives in `vite.config.js`.

### Key endpoints

| Endpoint | Description |
|---|---|
| `GET /v1/businesses` | List/search with filters (category, city, q, min_rating, geo, pagination) |
| `GET /v1/businesses/{id}` | Full business detail (with ETag caching) |
| `GET /v1/businesses/{id}/services` | Service menu per business |
| `GET /v1/businesses/{id}/reviews` | Sample reviews per business |
| `GET /v1/categories` | Facet index of categories with counts |
| `GET /v1/cities` | Facet index of cities with counts |
| `POST /v1/admin/scrape` | Authenticated background scraper |
| `GET /v1/admin/scrape` | Status of most recent scrape job |

### API response shape (`GET /v1/businesses`)

```json
{
  "items": [ /* BusinessSummary[] */ ],
  "total": 42,
  "limit": 20,
  "offset": 0
}
```

## Out of Scope (for now)

- Business model / monetization