<template>
  <div class="prose max-w-none">
    <div class="flex justify-between items-center mb-8">
      <h1>Changelog Management</h1>
      <NuxtLink to="/admin/changelogs/new" class="no-underline">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create New
        </button>
      </NuxtLink>
    </div>

    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error loading changelogs.</div>
    <table v-else-if="changelogs && changelogs.length" class="w-full">
      <thead>
        <tr>
          <th class="text-left">Slug</th>
          <th class="text-left">Created At</th>
          <th class="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="log in changelogs" :key="log.id" class="border-b">
          <td>{{ log.slug }}</td>
          <td>{{ new Date(log.created_at).toLocaleString() }}</td>
          <td class="text-right">
            <NuxtLink :to="`/admin/changelogs/${log.id}`" class="text-blue-500 hover:underline mr-4">Edit</NuxtLink>
            <button @click="deleteChangelog(log.id)" class="text-red-500 hover:underline">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else>
      <p>No changelogs found. Why not create one?</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: changelogs, pending, error, refresh } = await useFetch('/api/admin/changelogs', {
  transform: (response) => response.data,
});

async function deleteChangelog(id: number) {
  if (!confirm('Are you sure you want to delete this changelog?')) {
    return;
  }

  try {
    await $fetch(`/api/admin/changelogs/${id}`, {
      method: 'DELETE',
    });
    // Refresh the list after deletion
    refresh();
  } catch (err) {
    console.error('Failed to delete changelog:', err);
    alert('Failed to delete changelog.');
  }
}
</script>

<style scoped>
/* Scoped styles to remove prose styling from buttons if needed */
button {
  text-decoration: none;
}
</style>
