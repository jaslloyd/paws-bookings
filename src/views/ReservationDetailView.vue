<script setup lang="ts">
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import type { ReservationStatus } from "@/types";
import { useReservationsStore } from "@/stores/reservations";
import { useSitterStore } from "@/stores/sitter";
import { formatEuro } from "@/utils/currency";
import { nightsBetween } from "@/utils/bookings";

const route = useRoute();
const router = useRouter();
const store = useReservationsStore();
const sitterStore = useSitterStore();
const { status } = storeToRefs(store);

onMounted(() => {
  store.fetch();
  sitterStore.fetch("jason-south-dublin"); // for the service name
});

const reservation = computed(() =>
  store.getReservation(route.params.id as string),
);

// Narrowed display values (computed in script so the template stays simple).
const direct = computed(() =>
  reservation.value?.source === "direct" ? reservation.value : null,
);
// Title differs per variant — narrow here so the template doesn't touch
// `reservation.title` (which only exists on ManualBlock).
const title = computed(() => {
  const r = reservation.value;
  if (!r) return "";
  return r.source === "direct" ? r.contact.name : r.title;
});
const serviceName = computed(() =>
  direct.value ? sitterStore.getService(direct.value.serviceId)?.name : null,
);
const nights = computed(() =>
  reservation.value ? nightsBetween(reservation.value) : 0,
);

const goBack = () => {
  if (window.history.state?.back) router.back();
  else router.push("/admin");
};

// One handler — the button passes the target status. The `ReservationStatus`
// type means only valid statuses can be passed (e.g. updateStatus('approve')
// won't compile).
const updateStatus = (status: ReservationStatus) => {
  if (reservation.value) store.setStatus(reservation.value.id, status);
};

// `remove` stays separate — it does more than set a field (deletes + navigates).
const remove = async () => {
  if (!reservation.value) return;
  await store.removeReservation(reservation.value.id);
  router.push("/admin");
};
</script>

<template>
  <section class="detail">
    <button type="button" class="back" @click="goBack">← Back</button>

    <p v-if="!reservation && (status === 'loading' || status === 'idle')">
      Loading…
    </p>
    <template v-else-if="reservation">
      <header class="head">
        <h1>{{ title }}</h1>
        <span
          class="status"
          :class="reservation.source === 'manual' ? 'blocked' : reservation.status"
        >
          {{ reservation.source === "manual" ? "blocked" : reservation.status }}
        </span>
      </header>

      <dl class="rows">
        <template v-if="direct">
          <dt>Service</dt>
          <dd>{{ serviceName }}</dd>
        </template>

        <dt>Dates</dt>
        <dd>
          {{ reservation.start }} → {{ reservation.end }}
          <template v-if="nights > 0">({{ nights }} nights)</template>
        </dd>

        <template v-if="direct">
          <dt>Pets</dt>
          <dd>{{ direct.pets }}</dd>

          <dt>Price</dt>
          <dd>{{ formatEuro(direct.quotedPrice) }}</dd>

          <dt>Contact</dt>
          <dd>
            {{ direct.contact.email
            }}<template v-if="direct.contact.phone">
              · {{ direct.contact.phone }}</template>
          </dd>

          <template v-if="direct.petDetails">
            <dt>Pet details</dt>
            <dd>{{ direct.petDetails }}</dd>
          </template>

          <template v-if="direct.message">
            <dt>Message</dt>
            <dd>{{ direct.message }}</dd>
          </template>
        </template>

        <template v-if="reservation.notes">
          <dt>Notes</dt>
          <dd>{{ reservation.notes }}</dd>
        </template>
      </dl>

      <div class="actions">
        <template v-if="reservation.status === 'pending'">
          <button class="primary" @click="updateStatus('approved')">
            Approve
          </button>
          <button class="ghost" @click="updateStatus('declined')">
            Decline
          </button>
        </template>
        <button
          v-else-if="reservation.source === 'direct' && reservation.status === 'approved'"
          class="ghost"
          @click="updateStatus('cancelled')"
        >
          Cancel booking
        </button>
        <button class="danger" @click="remove">
          {{ reservation.source === "manual" ? "Remove block" : "Delete" }}
        </button>
      </div>
    </template>

    <p v-else class="missing">Reservation not found.</p>
  </section>
</template>

<style scoped>
.detail {
  max-width: 560px;
  display: grid;
  gap: 1rem;
}
.back {
  justify-self: start;
  background: none;
  border: none;
  padding: 0;
  color: #137a4b;
  font: inherit;
  font-size: 0.9rem;
  cursor: pointer;
}
.head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.head h1 {
  margin: 0;
  font-size: 1.5rem;
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
.rows {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem 1.5rem;
  margin: 0;
}
.rows dt {
  font-weight: 600;
  color: #555;
}
.rows dd {
  margin: 0;
}
.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.actions button {
  font: inherit;
  border-radius: 8px;
  padding: 0.5rem 1.1rem;
  cursor: pointer;
  border: 1px solid transparent;
}
.primary {
  background: #137a4b;
  color: white;
}
.ghost {
  background: white;
  border-color: #d4d4d4;
  color: #555;
}
.danger {
  background: white;
  border-color: #e3b4ae;
  color: #c0392b;
  margin-left: auto;
}
.missing {
  color: #888;
}
</style>
