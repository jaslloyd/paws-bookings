<script setup lang="ts">
import { computed, reactive, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useReservationsStore } from "@/stores/reservations";
import { useSitterStore } from "@/stores/sitter";
import ReservationCard from "@/components/reservation/ReservationCard.vue";
import ServicesManager from "@/components/admin/ServicesManager.vue";
import { sortByStart } from "@/utils/bookings";

const store = useReservationsStore();
const { reservations, pending } = storeToRefs(store);
const sitterStore = useSitterStore();
const { sitter } = storeToRefs(sitterStore);

onMounted(() => {
  store.fetch();
  // Single sitter for now; comes from the signed-in sitter once auth lands.
  sitterStore.fetch("jason-south-dublin");
});

const pendingSorted = computed(() => sortByStart(pending.value));
const confirmed = computed(() =>
  sortByStart(
    reservations.value.filter(
      (r) => r.source === "direct" && r.status === "approved",
    ),
  ),
);
const blocks = computed(() =>
  sortByStart(reservations.value.filter((r) => r.source === "manual")),
);

const approve = (id: string) => store.setStatus(id, "approved");
const decline = (id: string) => store.setStatus(id, "declined");

// Manual block form (a calendar will replace this UI later).
const blockForm = reactive({ title: "", start: "", end: "" });
const addBlock = () => {
  if (!blockForm.title || !blockForm.start || !blockForm.end) return;
  store.addManualBlock({
    sitterId: sitter.value.id,
    title: blockForm.title,
    start: blockForm.start,
    end: blockForm.end,
  });
  Object.assign(blockForm, { title: "", start: "", end: "" });
};
</script>

<template>
  <section>
    <h1>Admin</h1>

    <h2>Requests <span class="count">{{ pendingSorted.length }}</span></h2>
    <p v-if="!pendingSorted.length" class="empty">No pending requests.</p>
    <div class="list">
      <ReservationCard
        v-for="r in pendingSorted"
        :key="r.id"
        :reservation="r"
        @approve="approve"
        @decline="decline"
      />
    </div>

    <h2>Confirmed</h2>
    <p v-if="!confirmed.length" class="empty">No confirmed bookings yet.</p>
    <div class="list">
      <ReservationCard v-for="r in confirmed" :key="r.id" :reservation="r" />
    </div>

    <h2>Services &amp; pricing</h2>
    <ServicesManager />

    <h2>Blocked dates</h2>
    <div class="list">
      <ReservationCard v-for="r in blocks" :key="r.id" :reservation="r" />
    </div>

    <form class="block-form" @submit.prevent="addBlock">
      <input v-model.trim="blockForm.title" placeholder="Label (e.g. Pawshake — Bella)" />
      <label>From <input type="date" v-model="blockForm.start" /></label>
      <label>To <input type="date" v-model="blockForm.end" /></label>
      <button type="submit">Add block</button>
    </form>
  </section>
</template>

<style scoped>
section {
  max-width: 640px;
}
h2 {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.count {
  font-size: 0.8rem;
  background: #137a4b;
  color: white;
  border-radius: 999px;
  padding: 0.1rem 0.55rem;
}
.empty {
  color: #999;
}
.list {
  display: grid;
  gap: 0.75rem;
}
.block-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding: 1rem;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
}
.block-form input[type="text"],
.block-form > input:first-child {
  flex: 1;
  min-width: 180px;
}
.block-form input {
  font: inherit;
  padding: 0.4rem 0.5rem;
  border: 1px solid #d4d4d4;
  border-radius: 6px;
}
.block-form label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: #555;
}
.block-form button {
  background: #137a4b;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font: inherit;
  cursor: pointer;
}
</style>
