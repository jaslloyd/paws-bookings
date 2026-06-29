<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useSitterStore } from "../stores/sitter";
import BookingWidget from "../components/BookingWidget.vue";

const route = useRoute();
const { sitter } = storeToRefs(useSitterStore());

// Only one sitter for now, but match the slug so bad URLs 404 cleanly.
const found = computed(() => route.params.slug === sitter.value.slug);

// Gallery: which photo is shown large. Local UI state → a plain ref.
const selectedPhoto = ref(0);
</script>

<template>
  <div v-if="found" class="profile">
    <!-- Gallery (full width) -->
    <div class="gallery">
      <img class="hero" :src="sitter.photos[selectedPhoto]" :alt="sitter.name" />
      <div class="thumbs">
        <button
          v-for="(photo, i) in sitter.photos"
          :key="photo"
          class="thumb"
          :class="{ active: i === selectedPhoto }"
          @click="selectedPhoto = i"
        >
          <img :src="photo" alt="" />
        </button>
      </div>
    </div>

    <!-- Two columns: content + sticky booking widget -->
    <div class="layout">
      <div class="content">
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
  </div>

  <p v-else class="missing">Sorry, we couldn't find that sitter.</p>
</template>

<style scoped>
.profile {
  display: grid;
  gap: 2rem;
}

/* Gallery */
.hero {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 12px;
}
.thumbs {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.thumb {
  padding: 0;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: none;
  line-height: 0;
}
.thumb.active {
  border-color: #137a4b;
}
.thumb img {
  width: 80px;
  height: 56px;
  object-fit: cover;
}

/* Layout: single column on mobile, two columns ≥ 860px */
.layout {
  display: grid;
  gap: 2rem;
}
@media (min-width: 860px) {
  .layout {
    grid-template-columns: 1fr 320px;
    align-items: start;
  }
  /* Sticky so the booking card follows as you scroll the content */
  .booking-aside {
    position: sticky;
    top: 1rem;
  }
}

/* Content */
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
