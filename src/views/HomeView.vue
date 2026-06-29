<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useReservationsStore } from "@/stores/reservations";
import { sortByStart, nightsBetween } from "@/utils/bookings";

const { reservations, pending } = storeToRefs(useReservationsStore());

const confirmed = computed(() =>
  sortByStart(reservations.value.filter((r) => r.status === "approved")),
);
const nextBooking = computed(() => confirmed.value[0]);
const totalNights = computed(() =>
  confirmed.value.reduce((sum, r) => sum + nightsBetween(r), 0),
);
</script>

<template>
  <section>
    <h1>🐾 Dashboard</h1>

    <p class="stats">
      <strong>{{ confirmed.length }}</strong> confirmed ·
      <strong>{{ pending.length }}</strong> pending ·
      <strong>{{ totalNights }}</strong> nights
    </p>

    <p v-if="nextBooking" class="next">
      Next up: <strong>{{ nextBooking.contact.name }}</strong> from
      {{ nextBooking.start }}
    </p>
    <p v-else class="next">No confirmed bookings yet.</p>

    <RouterLink to="/admin" class="link">Manage requests →</RouterLink>
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
.link {
  color: #137a4b;
}
</style>
