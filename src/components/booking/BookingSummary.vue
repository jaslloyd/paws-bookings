<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useBookingDraftStore } from "@/stores/bookingDraft";

const { service, pets, start, end, formattedTotal } = storeToRefs(
  useBookingDraftStore(),
);
</script>

<template>
  <div class="summary">
    <div class="row">
      <span>Service</span><strong>{{ service?.name }}</strong>
    </div>
    <div class="row">
      <span>Dates</span><strong>{{ start }} → {{ end }}</strong>
    </div>
    <div class="row">
      <span>Pets</span><strong>{{ pets }}</strong>
    </div>
    <hr />
    <div class="row total">
      <span>Total</span><strong>{{ formattedTotal }}</strong>
    </div>
  </div>
</template>

<style scoped>
.summary {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 1rem 1.25rem;
}
.row {
  display: flex;
  justify-content: space-between;
  padding: 0.35rem 0;
  color: #555;
}
.row strong {
  color: #1a1a1a;
}
.total {
  font-size: 1.1rem;
}
hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 0.5rem 0;
}
</style>
