<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSitterStore } from "@/stores/sitter";
import { useBookingDraftStore } from "@/stores/bookingDraft";

const { activeServices } = storeToRefs(useSitterStore());

const draft = useBookingDraftStore();
// State/getters need storeToRefs; actions come straight off the store.
const { serviceId, pets, start, end, service } = storeToRefs(draft);
const { addPet, removePet } = draft;
</script>

<template>
  <!-- Service picker -->
  <div class="row">
    <div class="service-info">
      <select v-model="serviceId" class="service-select">
        <option v-for="s in activeServices" :key="s.id" :value="s.id">
          {{ s.name }}
        </option>
      </select>
      <p v-if="service" class="rate">
        from <strong>€{{ service.baseRate }}</strong>/{{ service.unit }},
        <strong>€{{ service.additionalPetRate }}</strong>/additional pet
      </p>
    </div>
  </div>

  <hr />

  <!-- Pets stepper -->
  <div class="row">
    <span>Number of pets</span>
    <div class="stepper">
      <button type="button" @click="removePet" :disabled="pets <= 1">−</button>
      <span class="count">{{ pets }}</span>
      <button type="button" @click="addPet">+</button>
    </div>
  </div>

  <hr />

  <!-- Dates (plain inputs now; a calendar comes later) -->
  <div class="row dates-row">
    <label>From <input type="date" v-model="start" /></label>
    <label>To <input type="date" v-model="end" /></label>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 1rem 0;
}

.service-select {
  font: inherit;
  font-weight: 700;
  font-size: 1.05rem;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
}
.rate {
  color: #777;
  font-size: 0.85rem;
  margin: 0.35rem 0 0;
}

.stepper {
  display: flex;
  align-items: center;
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  overflow: hidden;
}
.stepper button {
  width: 38px;
  height: 38px;
  border: none;
  background: white;
  font-size: 1.1rem;
  cursor: pointer;
}
.stepper button:disabled {
  color: #ccc;
  cursor: not-allowed;
}
.stepper .count {
  min-width: 36px;
  text-align: center;
}

.dates-row {
  justify-content: flex-start;
  gap: 1.25rem;
}
.dates-row label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: #555;
}
.dates-row input {
  font: inherit;
  padding: 0.35rem 0.5rem;
  border: 1px solid #d4d4d4;
  border-radius: 6px;
}
</style>
