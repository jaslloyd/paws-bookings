<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useBookingsStore } from "@/stores/bookings";

const { sortedBookings, totalNights } = storeToRefs(useBookingsStore());

// The soonest upcoming booking, or undefined if there are none.
const nextBooking = computed(() => sortedBookings.value[0]);
</script>

<template>
  <section>
    <h1>🐾 Dashboard</h1>

    <p class="stats">
      <strong>{{ sortedBookings.length }}</strong> upcoming ·
      <strong>{{ totalNights }}</strong> nights booked
    </p>

    <p v-if="nextBooking" class="next">
      Next up: <strong>{{ nextBooking.clientName }}</strong> from
      {{ nextBooking.start }}
    </p>
    <p v-else class="next">No bookings yet.</p>

    <h2>Upcoming</h2>
    <ul class="list">
      <li v-for="booking in sortedBookings" :key="booking.id">
        <!-- router-link is Vue Router's <a>. Renders an anchor, no page reload. -->
        <RouterLink :to="`/bookings/${booking.id}`">
          {{ booking.start }} — {{ booking.clientName }} ({{ booking.petNames }})
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
section {
  max-width: 640px;
}
.stats {
  font-size: 1.1rem;
  color: #444;
}
.next {
  color: #666;
}
.list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0.4rem;
}
.list a {
  color: #137a4b;
  text-decoration: none;
}
.list a:hover {
  text-decoration: underline;
}
</style>
