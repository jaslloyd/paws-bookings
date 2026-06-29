<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBookingsStore } from "../stores/bookings";
import { nightsBetween } from "../utils/bookings";

const route = useRoute(); // info about the CURRENT route (params, query, etc.)
const router = useRouter(); // the router instance, for programmatic navigation

// getBooking/removeBooking are actions (functions) → fine to destructure.
const { getBooking, removeBooking } = useBookingsStore();

// route.params.id is reactive — wrap the lookup in computed so the page
// updates if the param changes (or the underlying data changes).
const booking = computed(() => getBooking(route.params.id as string));

// Pop back to wherever we came from (/admin or /), with a safe fallback
// for when the page was opened directly (no in-app history to pop).
const goBack = () => {
  if (window.history.state?.back) router.back();
  else router.push("/");
};

const handleDelete = () => {
  if (!booking.value) return;
  removeBooking(booking.value.id);
  router.push("/admin"); // navigate in code after deleting
};
</script>

<template>
  <section>
    <button type="button" class="back" @click="goBack">← Back</button>

    <!-- v-if / v-else: the booking might not exist (bad/stale id) -->
    <template v-if="booking">
      <h1>{{ booking.clientName }}</h1>
      <span class="source" :class="booking.source">{{ booking.source }}</span>

      <dl class="details">
        <dt>Pets</dt>
        <dd>{{ booking.petNames }}</dd>

        <dt>Dates</dt>
        <dd>
          {{ booking.start }} → {{ booking.end }}
          ({{ nightsBetween(booking) }} nights)
        </dd>

        <dt>Notes</dt>
        <dd>{{ booking.notes || "—" }}</dd>
      </dl>

      <button class="delete" @click="handleDelete">Delete booking</button>
    </template>

    <p v-else class="missing">Booking not found.</p>
  </section>
</template>

<style scoped>
section {
  max-width: 640px;
}
.back {
  background: none;
  border: none;
  padding: 0;
  color: #137a4b;
  font: inherit;
  font-size: 0.9rem;
  cursor: pointer;
}
.back:hover {
  text-decoration: underline;
}
.source {
  display: inline-block;
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
.details {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem 1.5rem;
  margin: 1.5rem 0;
}
.details dt {
  font-weight: 600;
  color: #555;
}
.details dd {
  margin: 0;
}
.delete {
  background: #c0392b;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font: inherit;
  cursor: pointer;
}
.missing {
  color: #888;
}
</style>
