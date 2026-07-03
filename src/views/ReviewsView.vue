<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useSitterStore } from "@/stores/sitter";
import { useReviewsStore } from "@/stores/reviews";
import StarRating from "@/components/ui/StarRating.vue";
import ReviewCard from "@/components/reviews/ReviewCard.vue";

const route = useRoute();
const sitterStore = useSitterStore();
const { sitter } = storeToRefs(sitterStore);
const reviewsStore = useReviewsStore();
const { sorted, count, average, status } = storeToRefs(reviewsStore);

onMounted(() => {
  sitterStore.fetch(route.params.slug as string); // for the name/back link
  reviewsStore.fetch();
});
</script>

<template>
  <section class="reviews-page">
    <RouterLink :to="`/s/${sitter.slug}`" class="back">
      ← Back to profile
    </RouterLink>

    <header class="summary">
      <h1>Reviews for {{ sitter.name }}</h1>
      <div class="rating">
        <StarRating :rating="average" />
        <strong>{{ average.toFixed(1) }}</strong>
        <span class="count">· {{ count }} reviews</span>
      </div>
    </header>

    <p v-if="status === 'loading'" class="loading">Loading reviews…</p>
    <p v-else-if="status === 'error'" class="loading">
      Couldn't load reviews — please try again.
    </p>
    <div v-else class="list">
      <ReviewCard v-for="r in sorted" :key="r.id" :review="r" />
    </div>
  </section>
</template>

<style scoped>
.reviews-page {
  max-width: 640px;
  margin: 0 auto;
  display: grid;
  gap: 1rem;
  padding-bottom: 3rem;
}
.back {
  color: #137a4b;
  text-decoration: none;
  font-size: 0.9rem;
}
.summary h1 {
  margin: 0 0 0.25rem;
  font-size: 1.6rem;
}
.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.count {
  color: #888;
}
.list {
  display: grid;
  gap: 0.75rem;
}
.loading {
  color: #888;
}
</style>
