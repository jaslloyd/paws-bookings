<script setup lang="ts">
import type { Review } from "@/types";
import StarRating from "@/components/ui/StarRating.vue";

defineProps<{ review: Review }>();

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IE", { year: "numeric", month: "long" });
</script>

<template>
  <article class="review">
    <header class="head">
      <strong class="author">{{ review.author }}</strong>
      <span class="date">{{ formatDate(review.date) }}</span>
    </header>
    <StarRating :rating="review.rating" />
    <p class="text">{{ review.text }}</p>
  </article>
</template>

<style scoped>
.review {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: grid;
  gap: 0.4rem;
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.author {
  font-size: 1.02rem;
}
.date {
  color: #999;
  font-size: 0.82rem;
}
.text {
  margin: 0.15rem 0 0;
  color: #333;
  line-height: 1.55;
}
</style>
