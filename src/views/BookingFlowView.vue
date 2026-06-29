<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <section>
    <RouterLink :to="`/s/${route.params.slug}`">← Back to profile</RouterLink>
    <h1>Request a booking</h1>
    <p>Booking flow coming next — dates, pets, and live cost.</p>
  </section>
</template>
