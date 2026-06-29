<script setup lang="ts">
import { reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import type { DirectReservation } from "@/types";
import { useSitterStore } from "@/stores/sitter";
import { useBookingDraftStore } from "@/stores/bookingDraft";
import { useReservationsStore } from "@/stores/reservations";
import BookingSummary from "@/components/booking/BookingSummary.vue";
import BookingControls from "@/components/booking/BookingControls.vue";

const { sitter } = storeToRefs(useSitterStore());
const draft = useBookingDraftStore();
const { formattedTotal } = storeToRefs(draft);
const reservations = useReservationsStore();

// Local form state (this becomes prefilled from the account once auth exists).
const form = reactive({
  name: "",
  email: "",
  phone: "",
  petDetails: "",
  message: "",
});

const errors = reactive<{ name?: string; email?: string }>({});
const submitted = ref<DirectReservation | null>(null);

const isEmail = (e: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);

function validate(): boolean {
  errors.name = form.name.trim() ? undefined : "Please enter your name";
  errors.email = isEmail(form.email) ? undefined : "Please enter a valid email";
  return !errors.name && !errors.email;
}

function submit() {
  if (!validate() || !draft.service) return;

  submitted.value = reservations.createRequest({
    sitterId: sitter.value.id,
    serviceId: draft.serviceId,
    start: draft.start,
    end: draft.end,
    pets: draft.pets,
    quotedPrice: draft.total, // snapshot the agreed price
    contact: {
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
    },
    petDetails: form.petDetails || undefined,
    message: form.message || undefined,
  });
}
</script>

<template>
  <section class="flow">
    <!-- Confirmation -->
    <div v-if="submitted" class="confirmation">
      <h1>Request sent ✅</h1>
      <p>
        Thanks {{ submitted.contact.name }} — your request has been sent to
        {{ sitter.name }}.
      </p>
      <p class="muted">
        You'll get an email once it's reviewed. Contact details are shared after
        the booking is approved.
      </p>
      <BookingSummary />
      <RouterLink class="link" to="/">Back to home</RouterLink>
    </div>

    <!-- Request form -->
    <template v-else>
      <RouterLink :to="`/s/${sitter.slug}`" class="back">
        ← Back to profile
      </RouterLink>
      <h1>Request a booking with {{ sitter.name }}</h1>

      <!-- Interactive: same BookingControls as the profile, bound to the
           shared draft store — change dates/service/pets right here. -->
      <div class="booking-box">
        <BookingControls />
        <hr />
        <div class="total-row">
          <span>Total</span>
          <strong>{{ formattedTotal }}</strong>
        </div>
      </div>

      <form class="form" novalidate @submit.prevent="submit">
        <label>
          Your name
          <input v-model.trim="form.name" :class="{ invalid: errors.name }" />
          <span v-if="errors.name" class="err">{{ errors.name }}</span>
        </label>

        <label>
          Email
          <input
            v-model.trim="form.email"
            type="email"
            :class="{ invalid: errors.email }"
          />
          <span v-if="errors.email" class="err">{{ errors.email }}</span>
        </label>

        <label>
          Phone (optional)
          <input v-model.trim="form.phone" type="tel" />
        </label>

        <label>
          About your pet(s)
          <textarea
            v-model="form.petDetails"
            rows="3"
            placeholder="Names, breed, age, and anything we should know"
          />
        </label>

        <label>
          Message (optional)
          <textarea
            v-model="form.message"
            rows="2"
            placeholder="Anything you'd like to add"
          />
        </label>

        <button type="submit">Send request</button>
        <p class="note">No payment is taken now — you'll arrange that directly.</p>
      </form>
    </template>
  </section>
</template>

<style scoped>
.flow {
  max-width: 520px;
  margin: 0 auto;
  display: grid;
  gap: 1rem;
}
.back {
  color: #137a4b;
  text-decoration: none;
  font-size: 0.9rem;
}
h1 {
  margin: 0;
  font-size: 1.5rem;
}
.link {
  color: #137a4b;
}

.booking-box {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 1rem 1.25rem;
}
.booking-box hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 1rem 0;
}
.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.15rem;
  font-weight: 700;
}

.form {
  display: grid;
  gap: 1rem;
}
.form label {
  display: grid;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: #444;
}
.form input,
.form textarea {
  font: inherit;
  padding: 0.5rem 0.6rem;
  border: 1px solid #d4d4d4;
  border-radius: 8px;
}
.form input.invalid {
  border-color: #c0392b;
}
.err {
  color: #c0392b;
  font-size: 0.8rem;
}
.form button {
  justify-self: start;
  background: #137a4b;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.65rem 1.25rem;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}
.note {
  font-size: 0.8rem;
  color: #999;
  margin: 0;
}

.confirmation {
  display: grid;
  gap: 1rem;
}
.muted {
  color: #666;
}
</style>
