<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import type { PricingUnit, Service } from "@/types";
import { useSitterStore } from "@/stores/sitter";

const sitterStore = useSitterStore();
const { sitter } = storeToRefs(sitterStore);

const UNITS: PricingUnit[] = ["night", "day", "walk", "hour", "visit"];

// Editable copies — changes aren't committed until "Save". Initialised once
// when services first load; not re-synced afterwards so in-progress edits
// aren't clobbered.
const drafts = ref<Service[]>([]);
watch(
  () => sitter.value.services,
  (services) => {
    if (!drafts.value.length && services.length) {
      drafts.value = services.map((s) => ({ ...s }));
    }
  },
  { immediate: true },
);

const savingId = ref<string | null>(null);
async function save(draft: Service) {
  savingId.value = draft.id;
  await sitterStore.updateService(draft);
  savingId.value = null;
}

const emptyNew = (): Omit<Service, "id"> => ({
  name: "",
  unit: "night",
  baseRate: 0,
  additionalPetRate: 0,
  active: true,
});
const newService = ref(emptyNew());
const adding = ref(false);
async function add() {
  if (!newService.value.name.trim()) return;
  adding.value = true;
  const created = await sitterStore.addService({ ...newService.value });
  adding.value = false;
  if (created) {
    drafts.value.push({ ...created });
    newService.value = emptyNew();
  }
}
</script>

<template>
  <div class="services">
    <article v-for="s in drafts" :key="s.id" class="service">
      <div class="row">
        <input v-model.trim="s.name" class="name" placeholder="Service name" />
        <select v-model="s.unit" class="unit">
          <option v-for="u in UNITS" :key="u" :value="u">per {{ u }}</option>
        </select>
      </div>
      <div class="row prices">
        <label>Base € <input v-model.number="s.baseRate" type="number" min="0" /></label>
        <label>
          Extra pet € <input v-model.number="s.additionalPetRate" type="number" min="0" />
        </label>
      </div>
      <div class="row foot">
        <label class="active">
          <input v-model="s.active" type="checkbox" /> Active
        </label>
        <button class="save" :disabled="savingId === s.id" @click="save(s)">
          {{ savingId === s.id ? "Saving…" : "Save" }}
        </button>
      </div>
    </article>

    <form class="service add" @submit.prevent="add">
      <div class="row">
        <input
          v-model.trim="newService.name"
          class="name"
          placeholder="New service name"
        />
        <select v-model="newService.unit" class="unit">
          <option v-for="u in UNITS" :key="u" :value="u">per {{ u }}</option>
        </select>
      </div>
      <div class="row prices">
        <label>Base € <input v-model.number="newService.baseRate" type="number" min="0" /></label>
        <label>
          Extra pet €
          <input v-model.number="newService.additionalPetRate" type="number" min="0" />
        </label>
      </div>
      <button type="submit" class="save" :disabled="adding">
        {{ adding ? "Adding…" : "Add service" }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.services {
  display: grid;
  gap: 0.75rem;
}
.service {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: grid;
  gap: 0.6rem;
}
.service.add {
  border-style: dashed;
}
.row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.name {
  flex: 1;
  min-width: 160px;
  font: inherit;
  font-weight: 600;
  padding: 0.35rem 0.5rem;
  border: 1px solid #d4d4d4;
  border-radius: 6px;
}
.unit,
.prices input {
  font: inherit;
  padding: 0.35rem 0.5rem;
  border: 1px solid #d4d4d4;
  border-radius: 6px;
}
.prices label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: #555;
  font-size: 0.9rem;
}
.prices input {
  width: 80px;
}
.foot {
  justify-content: space-between;
}
.active {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: #555;
}
.save {
  background: #137a4b;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.45rem 1rem;
  font: inherit;
  cursor: pointer;
}
.save:disabled {
  opacity: 0.6;
  cursor: default;
}
</style>
