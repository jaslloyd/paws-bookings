<script setup lang="ts">
import { computed } from "vue";

// Presentational + reusable (could show pet photos later, not just sitters).
const props = defineProps<{ photos: string[]; alt?: string }>();

// Mosaic shows up to 5 (1 big + 2x2); the rest go behind "+N more".
const visiblePhotos = computed(() => props.photos.slice(0, 5));
const extraCount = computed(() => Math.max(0, props.photos.length - 5));
</script>

<template>
  <div class="gallery">
    <div
      v-for="(photo, i) in visiblePhotos"
      :key="photo"
      class="tile"
      :class="{ hero: i === 0 }"
    >
      <img :src="photo" :alt="i === 0 ? (alt ?? '') : ''" />
      <span v-if="i === visiblePhotos.length - 1 && extraCount" class="more">
        +{{ extraCount }} more
      </span>
    </div>
  </div>
</template>

<style scoped>
.gallery {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: repeat(2, 1fr);
  gap: 10px;
  aspect-ratio: 16 / 10;
}
.tile {
  position: relative;
  border-radius: 14px; /* rounded shape, per the reference */
  overflow: hidden;
  background: #f0f0f0; /* shows while the image loads */
}
.tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}
/* Big tile spans both rows of the first column */
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
/* Phones: just the big photo */
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
</style>
