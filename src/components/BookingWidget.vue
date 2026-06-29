<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useSitterStore } from "../stores/sitter";
import { quoteForRange } from "../utils/pricing";

const { sitter, activeServices } = storeToRefs(useSitterStore());

// ── Booking selection (local UI state for now) ──────────────
const serviceId = ref(activeServices.value[0]?.id ?? "");
const pets = ref(1);
const start = ref("2026-08-03");
const end = ref("2026-08-05");

// The chosen service object, derived from the selected id.
const service = computed(() =>
  activeServices.value.find((s) => s.id === serviceId.value),
);

// Live total — recomputes whenever service, dates, or pet count change.
const total = computed(() =>
  service.value ? quoteForRange(service.value, start.value, end.value, pets.value) : 0,
);

// Currency formatting the real-world way (locale-aware).
const eur = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});
const formattedTotal = computed(() => eur.format(total.value));

const decPets = () => {
  if (pets.value > 1) pets.value--;
};
const incPets = () => {
  pets.value++;
};
</script>

<template>
  <div class="widget">
    <!-- Service picker -->
    <div class="row service-row">
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
        <button type="button" @click="decPets" :disabled="pets <= 1">−</button>
        <span class="count">{{ pets }}</span>
        <button type="button" @click="incPets">+</button>
      </div>
    </div>

    <hr />

    <!-- Dates (plain inputs now; a calendar drawer comes later) -->
    <div class="row dates-row">
      <label>From <input type="date" v-model="start" /></label>
      <label>To <input type="date" v-model="end" /></label>
    </div>

    <hr />

    <!-- Total -->
    <div class="row total-row">
      <div>
        <div class="total">Total: {{ formattedTotal }}</div>
        <div class="total-note">No payment taken online</div>
      </div>
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
