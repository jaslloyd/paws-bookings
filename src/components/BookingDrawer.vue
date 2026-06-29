<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSitterStore } from "../stores/sitter";
import { useBookingDraftStore } from "../stores/bookingDraft";
import BookingControls from "./BookingControls.vue";

defineProps<{ open: boolean }>();
const emit = defineEmits<{ close: [] }>();

const { sitter } = storeToRefs(useSitterStore());
const { formattedTotal } = storeToRefs(useBookingDraftStore());
</script>

<template>
  <Teleport to="body">
    <!-- <Transition> animates the enter/leave of whatever is inside it. -->
    <Transition name="drawer">
      <!-- @click.self → only fires when the backdrop itself is clicked,
           not when a click bubbles up from the sheet. -->
      <div v-if="open" class="overlay" @click.self="emit('close')">
        <div class="sheet">
          <header class="sheet-head">
            <h3>Customise your booking</h3>
            <button class="x" type="button" @click="emit('close')">✕</button>
          </header>

          <BookingControls />

          <hr />
          <div class="total">Total: {{ formattedTotal }}</div>

          <RouterLink class="cta" :to="`/s/${sitter.slug}/book`">
            Request a booking
          </RouterLink>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
}
.sheet {
  width: 100%;
  background: white;
  border-radius: 16px 16px 0 0;
  padding: 1.25rem;
  /* the sheet slides; see the transition rules below */
  transition: transform 0.25s ease;
}
.sheet-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.sheet-head h3 {
  margin: 0;
  font-size: 1.1rem;
}
.x {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: #888;
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
.cta {
  display: block;
  text-align: center;
  margin-top: 1rem;
  background: #137a4b;
  color: white;
  text-decoration: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: 600;
}

/* ── Transition: backdrop fades, sheet slides up ──
   Vue toggles these classes automatically around v-if. */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from .sheet,
.drawer-leave-to .sheet {
  transform: translateY(100%);
}
</style>
