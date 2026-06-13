# Agents.md — Price Comparison PWA (Techstars Startup Weekend Valencia)

## Project Overview

This is a 2-day MVP built during a Techstars Startup Weekend. The product is a **price comparison PWA** — users can search/browse items and compare prices across sources.

This document currently covers the **frontend only**. Backend, database, and business model sections will be added once the backend stack is confirmed (likely **Go**).

## Tech Stack

- **Build tool:** Vite
- **Framework:** Vue 3, Composition API, `<script setup>`
- **PWA:** vite-plugin-pwa
- **Styling:** Vanilla CSS only — no Tailwind, no SASS/SCSS
- **Icons:** unplugin-vue-components + unplugin-icons + @iconify/json
- **Backend:** Go

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
    cuanto_cuesta.json
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

## Data Model (Mock)

Currently, the app uses a mock JSON file (`src/data/cuanto_cuesta.json`) for items. The basic structure of a business/item record is:

```json
{
  "id": 1,
  "name": "Classic barber shop",
  "category": "barberia",
  "schema_type": "HairSalon",
  "description": "...",
  "city": "santiago-de-compostela",
  "address": {
    "street": "...",
    "locality": "...",
    "postal_code": "...",
    "country": "es"
  },
  "location": { "lat": 42.87, "lng": -8.54 },
  "rating": { "value": 4.8, "review_count": 67 },
  "price_range": "EUR 5 - 18",
  "price_from": 5,
  "price_to": 18,
  "price_currency": "EUR",
  "image_url": "...",
  "logo_url": "...",
  "sources": ["booksy"],
  "last_verified": "2026-06-12T22:21:24Z",
  "stale": false
}
```

## Out of Scope (for now)

- Backend integration (API calls, data fetching) — stack TBD, likely Go
- Business model / monetization

These sections will be appended to this file once decided.