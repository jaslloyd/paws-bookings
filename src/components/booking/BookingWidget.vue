<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSitterStore } from "@/stores/sitter";
import { useBookingDraftStore } from "@/stores/bookingDraft";
import BookingControls from "./BookingControls.vue";

const { sitter } = storeToRefs(useSitterStore());
const { formattedTotal } = storeToRefs(useBookingDraftStore());
</script>

<template>
  <div class="widget">
    <BookingControls />

    <hr />

    <div class="total-row">
      <div class="total">Total: {{ formattedTotal }}</div>
      <div class="total-note">No payment taken online</div>
    </div>

    <RouterLink class="cta" :to="`/s/${sitter.slug}/book`">
      Request a booking
    </RouterLink>
  </div>
</template>

<style scoped>
.widget {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
  padding: 1.25rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}
hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 1rem 0;
}
.total {
  font-size: 1.2rem;
  font-weight: 700;
}
.total-note {
  color: #999;
  font-size: 0.8rem;
}
.cta {
  display: block;
  text-align: center;
  margin-top: 1.25rem;
  background: #137a4b;
  color: white;
  text-decoration: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: 600;
}
.cta:hover {
  background: #0f5f3a;
}
</style>
