<template>
  <div class="prose">
    <h1>Changelog Index</h1>
    <p>Here are the available changelogs:</p>
    
    <div v-if="pending">
      <p>Loading...</p>
    </div>
    <div v-else-if="error">
      <p>Could not load changelogs. Please try again later.</p>
    </div>
    <ul v-else-if="changelogs && changelogs.length">
      <li v-for="log in changelogs" :key="log.slug">
        <NuxtLink :to="`/changelogs/${log.slug}`">{{ log.slug }}</NuxtLink>
      </li>
    </ul>
    <div v-else>
      <p>No changelogs found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: changelogs, pending, error } = await useFetch('/api/changelogs', {
  transform: (response) => response.data,
});
</script>

