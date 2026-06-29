<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useSitterStore } from "../stores/sitter";
import BookingWidget from "../components/BookingWidget.vue";

const route = useRoute();
const { sitter } = storeToRefs(useSitterStore());

// Only one sitter for now, but match the slug so bad URLs 404 cleanly.
const found = computed(() => route.params.slug === sitter.value.slug);

// Mosaic shows up to 5 photos (1 big + 2x2); the rest go behind "+N more".
const visiblePhotos = computed(() => sitter.value.photos.slice(0, 5));
const extraCount = computed(() => Math.max(0, sitter.value.photos.length - 5));
</script>

<template>
  <!-- Whole page is two columns: left scrolls, right (booking) is sticky. -->
  <div v-if="found" class="profile">
    <div class="content">
      <!-- Gallery mosaic: 1 big + a 2x2 grid, "+N more" on the last tile -->
      <div class="gallery">
        <div
          v-for="(photo, i) in visiblePhotos"
          :key="photo"
          class="tile"
          :class="{ hero: i === 0 }"
        >
          <img :src="photo" :alt="i === 0 ? sitter.name : ''" />
          <span
            v-if="i === visiblePhotos.length - 1 && extraCount"
            class="more"
          >
            +{{ extraCount }} more
          </span>
        </div>
      </div>

      <header class="identity">
        <h1>{{ sitter.name }}</h1>
        <p class="headline">{{ sitter.headline }}</p>
        <p class="area">📍 {{ sitter.area }}</p>
      </header>

      <section class="about">
        <h2>About</h2>
        <p>{{ sitter.bio }}</p>
      </section>

      <section class="availability">
        <h2>Availability</h2>
        <div class="calendar-placeholder">Calendar coming soon</div>
      </section>
    </div>

    <aside class="booking-aside">
      <BookingWidget />
    </aside>
  </div>

  <p v-else class="missing">Sorry, we couldn't find that sitter.</p>
</template>

<style scoped>
/* Single column on mobile; two columns ≥ 860px with a sticky right rail. */
.profile {
  display: grid;
  gap: 2rem;
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

/* Gallery mosaic */
.gallery {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: repeat(2, 1fr);
  gap: 8px;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
}
.tile {
  position: relative;
}
.tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
/* First tile is the big one: spans both rows in the first column */
.tile.hero {
  grid-column: 1;
  grid-row: 1 / span 2;
}
.more {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.45);
  color: white;
  font-weight: 600;
  font-size: 1.05rem;
}
/* On phones, collapse to just the big photo */
@media (max-width: 640px) {
  .gallery {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    aspect-ratio: 4 / 3;
  }
  .tile:not(.hero) {
    display: none;
  }
  .tile.hero {
    grid-row: auto;
  }
}

/* Identity */
.identity h1 {
  margin: 0;
}
.headline {
  font-size: 1.15rem;
  color: #444;
  margin: 0.25rem 0;
}
.area {
  color: #777;
  margin: 0;
}

h2 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
.about p {
  color: #333;
  line-height: 1.6;
}
.calendar-placeholder {
  display: grid;
  place-items: center;
  height: 160px;
  color: #aaa;
  background: #fafafa;
  border: 1px dashed #ddd;
  border-radius: 10px;
}

.missing {
  color: #888;
}
</style>
