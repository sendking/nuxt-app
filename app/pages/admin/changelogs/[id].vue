<template>
  <div class="prose max-w-none">
    <h1>Edit Changelog</h1>
    
    <div v-if="fetchPending">Loading changelog details...</div>
    <div v-else-if="fetchError">Could not load the changelog.</div>

    <form v-else @submit.prevent="updateChangelog">
      <div class="mb-4">
        <label for="slug" class="block mb-2">Slug</label>
        <input id="slug" v-model="form.slug" type="text" required class="w-full p-2 border rounded">
      </div>
      <div class="mb-4">
        <label for="content" class="block mb-2">Content (Markdown)</label>
        <textarea id="content" v-model="form.content" rows="15" required class="w-full p-2 border rounded"></textarea>
      </div>
      <div v-if="updateError" class="text-red-500 mb-4">{{ updateError }}</div>
      <div>
        <button type="submit" :disabled="updatePending" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {{ updatePending ? 'Updating...' : 'Update Changelog' }}
        </button>
        <NuxtLink to="/admin/changelogs" class="ml-4 text-gray-500">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const changelogId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

const form = ref({
  slug: '',
  content: '',
});

const updatePending = ref(false);
const updateError = ref<string | null>(null);

// Fetch the existing changelog data
const { data: changelog, pending: fetchPending, error: fetchError } = await useFetch(`/api/admin/changelogs/${changelogId}`, {
  transform: (response) => response.data,
});

// Populate the form once data is fetched
onMounted(() => {
  if (changelog.value) {
    form.value.slug = changelog.value.slug;
    form.value.content = changelog.value.content;
  }
});

async function updateChangelog() {
  updatePending.value = true;
  updateError.value = null;
  try {
    await $fetch(`/api/admin/changelogs/${changelogId}`, {
      method: 'PUT',
      body: form.value,
    });
    router.push('/admin/changelogs');
  } catch (err: any) {
    updateError.value = err.data?.message || 'An unexpected error occurred.';
    console.error('Failed to update changelog:', err);
  } finally {
    updatePending.value = false;
  }
}
</script>
