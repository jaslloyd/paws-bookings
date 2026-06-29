<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSitterStore } from "@/stores/sitter";
import { useBookingDraftStore } from "@/stores/bookingDraft";

const { sitter } = storeToRefs(useSitterStore());
const { service, formattedTotal, start, end } = storeToRefs(
  useBookingDraftStore(),
);

// Tells the parent to open the drawer.
const emit = defineEmits<{ open: [] }>();
</script>

<template>
  <!-- Teleport renders this at <body>, so it overlays the page regardless of
       any parent's overflow/transform, and stays fixed to the viewport. -->
  <Teleport to="body">
    <div class="bar">
      <div class="summary">
        <span class="svc">{{ service?.name }}</span>
        <strong class="amt">{{ formattedTotal }}</strong>
        <span class="dates">{{ start }} – {{ end }}</span>
      </div>
      <button class="change" type="button" @click="emit('open')">Change</button>
      <RouterLink class="cta" :to="`/s/${sitter.slug}/book`">Contact ›</RouterLink>
    </div>
  </Teleport>
</template>

<style scoped>
.bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  border-top: 1px solid #e5e5e5;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
}
.summary {
  display: grid;
  flex: 1;
  min-width: 0;
}
.svc {
  font-size: 0.85rem;
  color: #555;
}
.amt {
  font-size: 1.05rem;
}
.dates {
  font-size: 0.8rem;
  color: #999;
}
.change {
  background: none;
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font: inherit;
  cursor: pointer;
}
.cta {
  background: #137a4b;
  color: white;
  text-decoration: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  white-space: nowrap;
}

/* Mobile only — desktop uses the sidebar widget instead. */
@media (min-width: 860px) {
  .bar {
    display: none;
  }
}
</style>
