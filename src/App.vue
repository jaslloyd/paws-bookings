<script setup lang="ts">
// The shell: just navigation + the slot where the current route renders.
// No booking logic here anymore — that lives in the views/composable.
</script>

<template>
  <div class="app">
    <nav class="nav">
      <span class="brand">🐾 Paws</span>
      <!-- RouterLink renders an <a>; active-class styling is automatic. -->
      <RouterLink to="/">Dashboard</RouterLink>
      <RouterLink to="/admin">Admin</RouterLink>
      <RouterLink to="/s/jason-south-dublin">Public page</RouterLink>
    </nav>

    <main class="content">
      <!-- RouterView is the outlet: the matched route's component renders here. -->
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  max-width: 1100px;
  margin: 0 auto 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e5e5;
}
.brand {
  font-weight: 700;
}
.nav a {
  color: #555;
  text-decoration: none;
  font-size: 0.95rem;
}
.nav a:hover {
  color: #137a4b;
}
/* router-link-active is added automatically to the matching link */
.nav a.router-link-active {
  color: #137a4b;
  font-weight: 600;
}
.content {
  max-width: 1100px;
  margin: 0 auto;
}
</style>
