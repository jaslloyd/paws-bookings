<script setup lang="ts">
// Presentational + reusable: takes a rating, renders 5 stars filled to %.
const props = defineProps<{ rating: number }>();
</script>

<template>
  <span
    class="stars"
    :style="{ '--pct': (props.rating / 5) * 100 + '%' }"
    :aria-label="`${props.rating} out of 5`"
  >
    <span class="bg">★★★★★</span>
    <span class="fg">★★★★★</span>
  </span>
</template>

<style scoped>
.stars {
  position: relative;
  display: inline-block;
  font-size: 1.25rem;
  line-height: 1;
}
.bg {
  color: #ddd;
}
.fg {
  position: absolute;
  inset: 0;
  width: var(--pct);
  overflow: hidden;
  white-space: nowrap;
  color: #f5b50a;
}
</style>
