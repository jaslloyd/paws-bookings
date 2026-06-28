<script setup lang="ts">
import { reactive } from "vue";
import type { Booking } from "./types";
import BookingCard from "./components/BookingCard.vue";
import { useBookings } from "./composables/useBookings";

// Pull domain state + operations from the composable.
// Destructuring is SAFE here — these are refs/functions, not a reactive() object.
const { bookings, sortedBookings, totalNights, addBooking, removeBooking } =
  useBookings();

// Form is local UI state, so it stays in the component.
const emptyForm = (): Omit<Booking, "id"> => ({
  clientName: "",
  petNames: "",
  start: "",
  end: "",
  source: "direct",
  notes: "",
});

const form = reactive(emptyForm());

const submitBooking = () => {
  // Form-level validation lives with the form.
  if (!form.clientName || !form.start || !form.end) return;
  addBooking({ ...form }); // hand a plain snapshot to the composable
  Object.assign(form, emptyForm()); // reset
};
</script>

<template>
  <main>
    <h1>🐾 Bookings</h1>
    <p class="count">
      {{ bookings.length }} upcoming · {{ totalNights }} nights
    </p>

    <form class="form" @submit.prevent="submitBooking">
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
