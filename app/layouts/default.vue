<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
    <!-- Sidebar -->
    <aside class="w-64 flex-shrink-0 bg-gray-800 dark:bg-gray-900/70 p-4">
      <div class="flex items-center mb-8">
        <a href="/" class="text-white text-2xl font-bold">My Nuxt App</a>
      </div>
      <nav>
        <ul>
          <li>
            <NuxtLink to="/" class="block text-gray-300 hover:text-white py-2">Home</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/changelogs" class="block text-gray-300 hover:text-white py-2">Changelogs</NuxtLink>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto p-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// No script needed for this static layout
</script>

<style scoped>
/* Scoped styles can be added if needed, but we rely on UnoCSS for now */
.router-link-exact-active {
  color: #42b883; /* A nice green for the active link, similar to Vite/Vue */
  font-weight: bold;
}
</style>
