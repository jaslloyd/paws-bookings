<script setup lang="ts">
import type { Booking } from "../types";
import { nightsBetween } from "../utils/bookings";

// Typed props — this component's public input API.
// In React this would be: function BookingCard({ booking }: { booking: Booking })
defineProps<{
  booking: Booking;
}>();

// Typed events this component can emit up to its parent.
// `delete` carries the booking's id as its payload.
const emit = defineEmits<{
  delete: [id: string];
}>();
</script>

<template>
  <li class="booking">
    <span class="dates">{{ booking.start }} → {{ booking.end }}</span>
    <RouterLink class="client" :to="`/bookings/${booking.id}`">
      {{ booking.clientName }}
    </RouterLink>
    <span class="pets">{{ booking.petNames }}</span>
    <span class="nights">{{ nightsBetween(booking) }} nights</span>
    <span class="source" :class="booking.source">{{ booking.source }}</span>
    <button class="delete" @click="emit('delete', booking.id)">✕</button>
  </li>
</template>

<style scoped>
.booking {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: start;
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
.nights {
  color: #999;
  font-size: 0.85rem;
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
.delete {
  grid-row: 1 / -1;
  align-self: center;
  background: none;
  border: none;
  color: #bbb;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
}
.delete:hover {
  color: #c0392b;
}
</style>
