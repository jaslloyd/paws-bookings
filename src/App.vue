<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import type { Booking } from "./types";
import { sortByStart, nightsBetween } from "./utils/bookings";
import BookingCard from "./components/BookingCard.vue";

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

// A factory for a blank form. Returns everything a Booking needs except `id`.
const emptyForm = (): Omit<Booking, "id"> => ({
  clientName: "",
  petNames: "",
  start: "",
  end: "",
  source: "direct",
  notes: "",
});

// reactive() — like ref(), but for objects, and WITHOUT .value (see notes below).
const form = reactive(emptyForm());

const addBooking = () => {
  // Minimal validation — we'll make this nicer later.
  if (!form.clientName || !form.start || !form.end) return;

  // Spread the reactive form into a plain object snapshot + a fresh id.
  bookings.value.push({ id: crypto.randomUUID(), ...form });

  // Reset by copying blank values back onto the same reactive object.
  Object.assign(form, emptyForm());
};

// Thin computed wrappers around the pure helpers (the "when", not the "what").
const sortedBookings = computed(() => sortByStart(bookings.value));

const totalNights = computed(() =>
  bookings.value.reduce((sum, b) => sum + nightsBetween(b), 0),
);

const removeBooking = (id: string) => {
  bookings.value = bookings.value.filter((b) => b.id !== id);
};
</script>

<template>
  <main>
    <h1>🐾 Bookings</h1>
    <p class="count">
      {{ bookings.length }} upcoming · {{ totalNights }} nights
    </p>

    <form class="form" @submit.prevent="addBooking">
      <input v-model="form.clientName" placeholder="Client name" />
      <input v-model="form.petNames" placeholder="Pet names" />
      <label> From <input type="date" v-model="form.start" /> </label>
      <label> To <input type="date" v-model="form.end" /> </label>
      <select v-model="form.source">
        <option value="direct">Direct</option>
        <option value="pawshake">Pawshake</option>
      </select>
      <textarea v-model="form.notes" placeholder="Notes (optional)" />
      <button type="submit">Add booking</button>
    </form>

    <ul class="bookings">
      <BookingCard
        v-for="booking in sortedBookings"
        :key="booking.id"
        :booking="booking"
        @delete="removeBooking"
      />
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

.form {
  display: grid;
  gap: 0.5rem;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}
.form input,
.form select,
.form textarea {
  font: inherit;
  padding: 0.4rem 0.5rem;
  border: 1px solid #d4d4d4;
  border-radius: 6px;
}
.form label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  color: #555;
  font-size: 0.9rem;
}
.form button {
  justify-self: start;
  background: #137a4b;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font: inherit;
  cursor: pointer;
}

.bookings {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}
</style>
