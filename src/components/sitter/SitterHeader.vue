<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSitterStore } from "@/stores/sitter";
import { useReviewsStore } from "@/stores/reviews";
import StarRating from "@/components/ui/StarRating.vue";

const { sitter } = storeToRefs(useSitterStore());
const { count, average } = storeToRefs(useReviewsStore());
</script>

<template>
  <header class="profile-header">
    <img class="avatar" :src="sitter.avatar" :alt="sitter.name" />

    <div class="header-main">
      <h1 class="name">{{ sitter.name }}</h1>
      <p class="header-sub">📍 {{ sitter.area }} · {{ sitter.headline }}</p>
    </div>

    <div class="rating">
      <StarRating :rating="average" />
      <RouterLink class="reviews-link" :to="`/s/${sitter.slug}/reviews`">
        ({{ count }} reviews)
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.avatar {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  object-fit: cover;
}
.header-main {
  min-width: 0;
}
.name {
  margin: 0;
  font-size: 1.8rem;
}
.header-sub {
  margin: 0.15rem 0 0;
  color: #777;
}
.rating {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.reviews-link {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: #333;
  text-decoration: underline;
  cursor: pointer;
}
</style>
