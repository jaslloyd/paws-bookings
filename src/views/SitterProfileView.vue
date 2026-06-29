<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useSitterStore } from "@/stores/sitter";
import { useReservationsStore } from "@/stores/reservations";
import { toBusyItems } from "@/utils/calendar";
import SitterHeader from "@/components/sitter/SitterHeader.vue";
import SitterGallery from "@/components/sitter/SitterGallery.vue";
import BookingCalendar from "@/components/calendar/BookingCalendar.vue";
import BookingWidget from "@/components/booking/BookingWidget.vue";
import BookingBar from "@/components/booking/BookingBar.vue";
import BookingDrawer from "@/components/booking/BookingDrawer.vue";

const route = useRoute();
const { sitter } = storeToRefs(useSitterStore());
const { reservations } = storeToRefs(useReservationsStore());

// Anonymised busy dates for the public availability calendar.
const busy = computed(() => toBusyItems(reservations.value));

// Only one sitter for now, but match the slug so bad URLs 404 cleanly.
const found = computed(() => route.params.slug === sitter.value.slug);

// Drawer open/close state lives here (parent of bar + drawer).
const drawerOpen = ref(false);
</script>

<template>
  <div v-if="found" class="profile-page">
    <SitterHeader />

    <!-- Below the header: two columns — left scrolls, right (booking) sticky. -->
    <div class="profile">
      <div class="content">
        <SitterGallery :photos="sitter.photos" :alt="sitter.name" />

        <section class="about">
          <h2>About</h2>
          <p>{{ sitter.bio }}</p>
        </section>

        <section class="availability">
          <h2>Availability</h2>
          <div class="availability-calendar">
            <BookingCalendar :items="busy" />
          </div>
        </section>
      </div>

      <aside class="booking-aside">
        <BookingWidget />
      </aside>

      <!-- Mobile-only: condensed bar + a drawer it opens. -->
      <BookingBar @open="drawerOpen = true" />
      <BookingDrawer :open="drawerOpen" @close="drawerOpen = false" />
    </div>
  </div>

  <p v-else class="missing">Sorry, we couldn't find that sitter.</p>
</template>

<style scoped>
.profile-page {
  display: grid;
  gap: 1.5rem;
}

/* Single column on mobile; two columns ≥ 860px with a sticky right rail. */
.profile {
  display: grid;
  gap: 2rem;
}
/* Mobile: hide the sidebar card (the bar+drawer take over) and leave room
   at the bottom so the fixed bar doesn't cover the last content. */
@media (max-width: 859px) {
  .booking-aside {
    display: none;
  }
  .profile {
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

/* Left column stacks its sections */
.content {
  display: grid;
  gap: 2rem;
  min-width: 0; /* lets the column shrink instead of overflowing */
}

h2 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
.about p {
  color: #333;
  line-height: 1.6;
}
.availability-calendar {
  height: 420px;
}

.missing {
  color: #888;
}
</style>
