# 🐾 Paws

A lightweight booking and reservation platform for independent pet sitters, minders, and walkers — built to replace the awkward shuffle of managing enquiries over WhatsApp and blocking dates across multiple calendars.

The goal is a single source of truth: one place where a sitter publishes their services and availability, clients request bookings directly, and the sitter approves or declines — without the fees, insurance products, or payment processing of the big marketplaces. Payment is arranged directly between sitter and client (e.g. bank transfer / Revolut); Paws just handles the scheduling and the paperwork around it.

Although it's built around pet sitting, the core is a generic reservation system and could be repurposed for any date-based service business.

## What it does

**Public side — the sitter's bookable page** (`/s/:slug`)

- A shareable profile page with photo gallery, bio, location, rating, and reviews.
- Clearly listed services with transparent pricing (e.g. boarding per night, day care per day), each supporting a base rate plus a reduced rate for additional pets.
- An always-visible booking widget that calculates the **live cost** as the client picks a service, dates, and number of pets — sticky on desktop, a bottom bar + drawer on mobile.
- Clients request a booking directly from the page; contact details are only shared once a booking is confirmed.

**Admin side — the sitter's dashboard**

- A central calendar showing every booking in one place, tagged by source (direct vs. imported), so there's no more reconciling two calendars by hand.
- Incoming reservation requests to approve or decline.
- Client and pet records — names, notes, and special requests — visible at a glance.
- An at-a-glance dashboard: who's next, when, and the details that matter.

## Status

Early development. The public sitter profile and live-pricing booking widget are functional; the reservation workflow, admin calendar, authentication, and a hosted backend are in progress. Data is currently mocked/local while the front end is built out.

## Roadmap

- Reservation request → approve/decline workflow with email notifications
- Availability calendar (public + admin views)
- Client accounts (Google / email sign-in) and saved pet profiles
- Hosted backend (Postgres) for real, multi-device data and a public booking URL
- Multi-sitter onboarding (set your own services, pricing, and availability)

## Tech stack

- [Vue 3](https://vuejs.org/) (`<script setup>`, Composition API) + TypeScript
- [Vite](https://vite.dev/) for dev/build
- [Vue Router](https://router.vuejs.org/) for routing
- [Pinia](https://pinia.vuejs.org/) for state management
- A `@` path alias maps to `src/`

## Project structure

```
src/
  components/
    ui/           Reusable, domain-agnostic UI (e.g. StarRating)
    sitter/       Sitter profile pieces (header, gallery)
    booking/      Booking widget, controls, mobile bar & drawer
    reservation/  Reservation/booking cards
  views/          Routed pages (profile, admin, dashboard, detail)
  stores/         Pinia stores (sitter, bookings, booking draft)
  utils/          Pure helpers (pricing, dates)
  router/         Route definitions
  types.ts        Shared domain types
```

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check and build for production
npm run preview  # preview the production build
```
