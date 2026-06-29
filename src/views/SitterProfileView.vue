<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useSitterStore } from "../stores/sitter";
import type { PricingUnit } from "../types";

const route = useRoute();
const { sitter, activeServices } = storeToRefs(useSitterStore());

// Only one sitter for now, but match the slug so bad URLs 404 cleanly.
const found = computed(() => route.params.slug === sitter.value.slug);

// Gallery: which photo is shown large. Local UI state → a plain ref.
const selectedPhoto = ref(0);

// "night" → "/night", "walk" → "/walk", etc.
const unitLabel = (unit: PricingUnit) => `/${unit}`;
</script>

<template>
  <section v-if="found" class="profile">
    <!-- Gallery -->
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

    <!-- Identity -->
    <header class="identity">
      <h1>{{ sitter.name }}</h1>
      <p class="headline">{{ sitter.headline }}</p>
      <p class="area">📍 {{ sitter.area }}</p>
    </header>

    <!-- About -->
    <section class="about">
      <h2>About</h2>
      <p>{{ sitter.bio }}</p>
    </section>

    <!-- Services & pricing -->
    <section class="services">
      <h2>Services &amp; pricing</h2>
      <ul class="service-list">
        <li v-for="service in activeServices" :key="service.id" class="service">
          <span class="service-name">{{ service.name }}</span>
          <span class="price">
            €{{ service.baseRate }}<small>{{ unitLabel(service.unit) }}</small>
          </span>
          <span class="extra">
            +€{{ service.additionalPetRate }} per additional pet
          </span>
        </li>
      </ul>
    </section>

    <!-- Availability (placeholder until we add a calendar) -->
    <section class="availability">
      <h2>Availability</h2>
      <div class="calendar-placeholder">Calendar coming soon</div>
    </section>

    <!-- CTA -->
    <RouterLink class="cta" :to="`/s/${sitter.slug}/book`">
      Request a booking
    </RouterLink>
  </section>

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

/* Services */
.service-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}
.service {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.25rem 1rem;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 0.85rem 1rem;
}
.service-name {
  font-weight: 600;
}
.price {
  font-weight: 700;
  color: #137a4b;
  justify-self: end;
}
.price small {
  font-weight: 400;
  color: #999;
}
.extra {
  grid-column: 1 / -1;
  color: #777;
  font-size: 0.85rem;
}

/* Availability placeholder */
.calendar-placeholder {
  display: grid;
  place-items: center;
  height: 160px;
  color: #aaa;
  background: #fafafa;
  border: 1px dashed #ddd;
  border-radius: 10px;
}

/* CTA */
.cta {
  justify-self: start;
  background: #137a4b;
  color: white;
  text-decoration: none;
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  font-weight: 600;
}
.cta:hover {
  background: #0f5f3a;
}

.missing {
  color: #888;
}
</style>
