<script setup lang="ts">
import { ref } from "vue";

// A booking can come from two places, for now.
type BookingSource = "direct" | "pawshake";

// The shape of one booking. This is our core domain type —
// it'll grow, but this is enough to start.
interface Booking {
  id: string;
  clientName: string;
  petNames: string;
  start: string; // ISO date, e.g. '2026-07-03'
  end: string;
  source: BookingSource;
  notes?: string;
}

// ref() with a TS generic: a reactive array of Bookings.
// Hardcoded for now — Phase 2 swaps
const bookings = ref<Booking[]>([
  {
    id: "1",
    clientName: "Sarah Connor",
    petNames: "Rex",
    start: "2026-07-03",
    end: "2026-07-07",
    source: "pawshake",
  },
  {
    id: "2",
    clientName: "John Wick",
    petNames: "Daisy, Max",
    start: "2026-07-10",
    end: "2026-07-12",
    source: "direct",
    notes: "Daisy needs medication twice a day",
  },
]);
</script>

<template>
  <main>
    <h1>🐾 Bookings</h1>
    <p class="count">{{ bookings.length }} upcoming</p>

    <ul class="bookings">
      <li v-for="booking in bookings">
        <span class="dates">{{ booking.start }} → {{ booking.end }}</span>
        <span class="client">{{ booking.clientName }} </span>
        <span class="pets">{{ booking.petNames }}</span>
        <span class="source" :class="booking.source">{{ booking.source }}</span>
      </li>
    </ul>
  </main>
</template>

<style scoped>
main {
  max-width: 640px;
  margin: 0 auto;
}
h1 {
  margin-bottom: 0;
}
.count {
  color: #666;
  margin-top: 0.25rem;
}

.bookings {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}
.booking {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.25rem 1rem;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 0.75rem 1rem;
}
.dates {
  font-weight: 600;
}
.client {
  color: #333;
}
.pets {
  color: #777;
  font-size: 0.9rem;
}

.source {
  justify-self: end;
  align-self: start;
  font-size: 0.75rem;
  text-transform: uppercase;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
}
.source.pawshake {
  background: #ffe8d6;
  color: #b5530a;
}
.source.direct {
  background: #d6f0e0;
  color: #137a4b;
}
</style>
