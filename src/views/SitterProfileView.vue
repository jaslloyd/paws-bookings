<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useTitle } from "@vueuse/core";
import { useSitterStore } from "@/stores/sitter";
import { useBookingUrlSync } from "@/composables/useBookingUrlSync";
import SitterHeader from "@/components/sitter/SitterHeader.vue";
import SitterGallery from "@/components/sitter/SitterGallery.vue";
import AvailabilityCalendar from "@/components/calendar/AvailabilityCalendar.vue";
import BookingWidget from "@/components/booking/BookingWidget.vue";
import BookingBar from "@/components/booking/BookingBar.vue";
import BookingDrawer from "@/components/booking/BookingDrawer.vue";

const route = useRoute();
const sitterStore = useSitterStore();
const { sitter, status } = storeToRefs(sitterStore);

// Load the sitter (+ services) for this slug.
onMounted(() => sitterStore.fetch(route.params.slug as string));

// Keep the booking selection (service/pets/dates) in the URL query string.
useBookingUrlSync();

// Dynamic tab title from the (async) sitter name.
useTitle(() => sitter.value.name || "Pet sitter", {
  titleTemplate: "%s | Pet Sitter | Paws",
});

// Drawer open/close state lives here (parent of bar + drawer).
const drawerOpen = ref(false);
</script>

<template>
  <p v-if="status === 'loading' || status === 'idle'" class="state">Loading…</p>
  <p v-else-if="status === 'error'" class="missing">
    Sorry, we couldn't find that sitter.
  </p>

  <div v-else class="profile-page">
    <SitterHeader />

    <!-- Two columns: calendar (+ secondary info) scrolls on the left, the
         booking widget stays sticky on the right so the price/CTA is visible
         above the fold for warm visitors arriving via the private link. -->
    <div class="profile">
      <div class="content">
        <section class="availability">
          <h2>Availability</h2>
          <AvailabilityCalendar />
        </section>

        <section class="about">
          <h2>About</h2>
          <p>{{ sitter.bio }}</p>
        </section>

        <SitterGallery :photos="sitter.photos" :alt="sitter.name" />
      </div>

      <aside class="booking-aside">
        <BookingWidget />
      </aside>

      <!-- Mobile-only: condensed bar + a drawer it opens. -->
      <BookingBar @open="drawerOpen = true" />
      <BookingDrawer :open="drawerOpen" @close="drawerOpen = false" />
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  display: grid;
  gap: 1.5rem;
  padding-bottom: 4rem;
}

.profile {
  display: grid;
  gap: 2rem;
}
/* Mobile: hide the sidebar card (bar + drawer take over), pad for the bar. */
@media (max-width: 859px) {
  .booking-aside {
    display: none;
  }
  .profile-page {
    padding-bottom: 96px;
  }
}
@media (min-width: 860px) {
  .profile {
    grid-template-columns: 1fr 340px;
    align-items: start;
  }
  .booking-aside {
    position: sticky;
    top: 1rem;
  }
}

/* Left column stacks its sections. */
.content {
  display: grid;
  gap: 2rem;
  min-width: 0; /* lets the column shrink instead of overflowing */
}

.availability h2,
.about h2 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
.about p {
  color: #333;
  line-height: 1.6;
  max-width: 640px;
}

.missing,
.state {
  color: #888;
}
</style>
