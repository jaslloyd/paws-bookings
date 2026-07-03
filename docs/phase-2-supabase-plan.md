# Phase 2a — Supabase Data Layer (auth deferred)

> Status: **✅ DONE.** All stores migrated to Supabase (reviews, sitter/services,
> reservations CRUD). Public availability reads the PII-free `availability` view;
> admin reads the full table; guest booking inserts real rows. Verified
> end-to-end. Next up: **Phase 2b — auth** (see bottom).

## Context

The app is fully built on the front end but all data lives in mock seeds /
`localStorage` (`src/stores/*`). That means it's single-browser: the public
booking link can't actually work for other people, and the admin can't see real
requests across devices. Phase 2a swaps the stores' data source from local
seeds to **Supabase (Postgres)** so the data is real, durable, and multi-device
— while **keeping the current guest booking flow** (no login yet). Auth
(Google/email, gating booking + admin) is a focused follow-up (Phase 2b).

This is the payoff of the "seam" we designed: each store isolates its data
source behind a small surface (a seed / `useLocalStorage` ref + a handful of
mutation functions). We replace the *internals* of those stores; the components
that consume them via `storeToRefs` barely change.

## Scope

**In:** Supabase project setup, client, schema + seed + RLS, and migrating the
**reviews**, **sitter/services**, and **reservations** stores to async Supabase
queries. Public availability via a PII-free view.

**Out (later):** Auth + role gating (Phase 2b), realtime subscriptions
(optional), deployment to Vercel/Netlify.

## Step 0 — Supabase project setup (user does, walk through)

1. Create a free project at supabase.com (region near Ireland, e.g.
   `eu-west-1`).
2. Project Settings → API → copy **Project URL** and the **anon public key**.
3. Create `.env.local` (gitignored):
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
   Add a committed `.env.example` documenting the vars. The anon key is safe to
   expose in the client — **RLS is the security boundary**, not key secrecy.

## Step 1 — Client, schema, seed, RLS

- `npm i @supabase/supabase-js`; create `src/lib/supabase.ts` exporting a single
  configured client (reads the `import.meta.env.VITE_SUPABASE_*` vars).
- Run `supabase/schema.sql` in the dashboard SQL editor (no CLI needed yet).
  Tables (snake_case columns), mirroring `src/types.ts`:
  - **sitters**: `id, slug, name, avatar, headline, bio, area, photos text[],
    whatsapp`.
  - **services**: `id, sitter_id fk, name, unit, base_rate, additional_pet_rate,
    active`.
  - **reviews**: `id, sitter_id fk, author, rating, date, text`.
  - **reservations** (the `DirectReservation | ManualBlock` union as one table):
    common `id, sitter_id fk, source ('direct'|'manual'), start_date, end_date,
    status, created_at, notes`; direct-only (nullable) `service_id, pets,
    quoted_price, contact_name, contact_email, contact_phone, pet_details,
    message`; manual-only (nullable) `title`. A CHECK constraint enforces the
    union per `source`.
  - **availability view**: `select sitter_id, start_date, end_date from
    reservations where status = 'approved'` — booked ranges with **no PII** for
    the public calendar.
- `supabase/seed.sql`: INSERTs translated from current seeds (`mockSitter` +
  services in `stores/sitter.ts`, `seed` in `stores/reviews.ts`, the Aoife
  request + `b1..b10` blocks in `stores/reservations.ts`).
- **RLS** (enable on all tables): public `SELECT` on sitters/services/reviews
  and the availability view; public `INSERT` on reservations (guest booking
  creates pending requests). ⚠️ Until auth lands, the **full reservations table
  (with PII) and update/delete stay open to the anon key** so the un-gated admin
  still works — flagged to lock down in Phase 2b (admin-only full-row read;
  public sees only the view).

## Step 2 — Reviews store → Supabase (the proof)

Smallest, read-only, no auth — validates the whole pipeline first.
- `stores/reviews.ts`: replace `ref(seed)` with `reviews = ref<Review[]>([])`,
  add `isLoading` + an async `fetch()` →
  `supabase.from('reviews').select().order('date',{ascending:false})`, map rows
  → `Review` (snake→camel). `addReview` becomes an async `insert`.
  `count`/`average`/`sorted` getters unchanged.
- `ReviewsView.vue` + `SitterHeader.vue` consume via `storeToRefs`; just trigger
  `fetch()` (idempotent) on mount + a light loading state.

## Step 3 — Sitter + services → Supabase

- `stores/sitter.ts`: `fetch(slug)` selects the sitter row + its services;
  `activeServices`/`getService` unchanged. Consumers untouched beyond triggering
  the fetch.

## Step 4 — Reservations → Supabase (read + write)

Full CRUD maps 1:1 to the existing functions:
- `fetch()` → `select()`; `pending`/`getReservation` getters unchanged.
- `createRequest` → `insert` a direct/pending row (guest booking).
- `addManualBlock` → `insert` a manual/approved row.
- `setStatus` → `update`; `removeReservation` → `delete`.
- Public availability calendar reads the `availability` **view** (so
  `utils/calendar.ts > bookedDates` gets PII-free data); admin reads the full
  table.
- Mutations: write to Supabase, then optimistic local update (or re-fetch).

## Cross-cutting

- **Async/loading pattern (new):** each store gains `isLoading` + `fetch()`;
  views call `fetch()` in `onMounted` (guarded to run once). Initial render shows
  empty/loading instead of instant seed data — add minimal loading states.
- **snake_case ↔ camelCase mapping:** keep camelCase TS types; add small
  per-entity mappers (`rowToReservation` / `reservationToRow`) colocated in each
  store or `lib/mappers.ts`.
- **Unchanged:** `bookingDraft` store (transient, in-memory), the URL sync, all
  components/composables, the discriminated-union model, pure utils. Remove the
  `useLocalStorage` import from `reservations.ts`.

## Critical files

- New: `src/lib/supabase.ts`, `supabase/schema.sql`, `supabase/seed.sql`,
  `.env.local` (gitignored) + `.env.example`, optional `src/lib/mappers.ts`.
- Modified: `src/stores/{reviews,sitter,reservations}.ts`; fetch-triggering
  views (`ReviewsView`, `SitterProfileView`, `HomeView`, `AdminView`);
  `package.json`; `.gitignore`.

## Verification (end to end)

1. After Step 1: run schema + seed; confirm rows in the Supabase Table editor.
2. After each store migration: `npx vue-tsc --noEmit` clean, then load the page
   and confirm data comes from the DB (edit a row in Supabase → refresh → see it).
3. Reservations: submit a booking via the public flow → new `pending` row in
   Supabase and in `/admin`. Approve it → status updates + availability reflects
   it. **Multi-device:** open a second browser/incognito → same data.
4. Confirm the public availability path reads the **view** (no contact PII in the
   public profile's network responses).

## Out of scope / next

- **Phase 2b — Auth:** Supabase Google + email/password, gate booking + admin,
  tie reservations to the signed-in client, pet profiles, tighten RLS.
- **Deploy:** Vercel/Netlify so the public `/s/:slug` link works for real.
