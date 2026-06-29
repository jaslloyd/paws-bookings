<script setup lang="ts">
import { computed } from "vue";
import type { Reservation } from "@/types";
import { useSitterStore } from "@/stores/sitter";
import { formatEuro } from "@/utils/currency";
import { nightsBetween } from "@/utils/bookings";

const props = defineProps<{ reservation: Reservation }>();
const emit = defineEmits<{
  approve: [id: string];
  decline: [id: string];
}>();

const sitterStore = useSitterStore();

// One view-model: narrow the union ONCE here, return flat display primitives.
// The template then reads simple values with no `source` checks at all.
const vm = computed(() => {
  const r = props.reservation;

  if (r.source === "manual") {
    return {
      title: r.title,
      badge: "blocked",
      service: null as string | null,
      dates: `${r.start} → ${r.end}`,
      pets: null as string | null,
      price: null as string | null,
      canAct: false,
    };
  }

  const n = nightsBetween(r);
  return {
    title: r.contact.name,
    badge: r.status,
    service: sitterStore.getService(r.serviceId)?.name ?? "Service",
    dates: `${r.start} → ${r.end}${n > 0 ? ` (${n} nights)` : ""}`,
    pets: `${r.pets} pet${r.pets > 1 ? "s" : ""}`,
    price: formatEuro(r.quotedPrice),
    canAct: r.status === "pending",
  };
});
</script>

<template>
  <article class="card">
    <header class="head">
      <RouterLink class="title" :to="`/admin/reservations/${reservation.id}`">
        {{ vm.title }}
      </RouterLink>
      <span class="status" :class="vm.badge">{{ vm.badge }}</span>
    </header>

    <p class="line">
      <template v-if="vm.service">{{ vm.service }} · </template>{{ vm.dates
      }}<template v-if="vm.pets"> · {{ vm.pets }}</template>
    </p>

    <p v-if="vm.price" class="price">{{ vm.price }}</p>

    <div v-if="vm.canAct" class="actions">
      <button class="approve" @click="emit('approve', reservation.id)">
        Approve
      </button>
      <button class="decline" @click="emit('decline', reservation.id)">
        Decline
      </button>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: grid;
  gap: 0.35rem;
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #137a4b;
  text-decoration: none;
}
.title:hover {
  text-decoration: underline;
}
.status {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
}
.status.pending {
  background: #fff3cd;
  color: #8a6d00;
}
.status.approved {
  background: #d6f0e0;
  color: #137a4b;
}
.status.blocked {
  background: #e7e0f7;
  color: #5b3ca8;
}
.status.declined,
.status.cancelled {
  background: #eee;
  color: #777;
}
.line {
  margin: 0;
  color: #444;
}
.price {
  margin: 0;
  font-weight: 700;
}
.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.actions button {
  font: inherit;
  border-radius: 8px;
  padding: 0.45rem 1rem;
  cursor: pointer;
  border: 1px solid transparent;
}
.approve {
  background: #137a4b;
  color: white;
}
.decline {
  background: white;
  border-color: #d4d4d4;
  color: #555;
}
</style>
