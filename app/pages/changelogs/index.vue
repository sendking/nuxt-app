<template>
  <div>
    <h1>Changelog Index</h1>
    <p>Here are the available changelogs:</p>
    <ul>
      <li v-for="log in changelogs" :key="log.slug">
        <NuxtLink :to="`/changelogs/${log.slug}`">{{ log.slug }}</NuxtLink>
      </li>
    </ul>
    <div v-if="!changelogs.length">
      <p>No changelogs found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const changelogs = ref([]);

// Using a relative path from this file to the target directory
const modules = import.meta.glob('../../../changelogs/*.md');

console.log('Glob modules found:', modules); // Debugging line

const logPaths = Object.keys(modules);

changelogs.value = logPaths.map(p => {
  // Extract filename without extension to use as a slug (client-safe)
  const slug = p.substring(p.lastIndexOf('/') + 1, p.lastIndexOf('.md'));
  return { slug };
});
</script>
