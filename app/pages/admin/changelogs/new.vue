<template>
  <div class="prose max-w-none">
    <h1>Create New Changelog</h1>
    <form @submit.prevent="createChangelog">
      <div class="mb-4">
        <label for="slug" class="block mb-2">Slug</label>
        <input id="slug" v-model="form.slug" type="text" required class="w-full p-2 border rounded" placeholder="e.g., 2025-12-20">
      </div>
      <div class="mb-4">
        <label for="content" class="block mb-2">Content (Markdown)</label>
        <textarea id="content" v-model="form.content" rows="15" required class="w-full p-2 border rounded"></textarea>
      </div>
      <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
      <div>
        <button type="submit" :disabled="pending" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {{ pending ? 'Creating...' : 'Create Changelog' }}
        </button>
        <NuxtLink to="/admin/changelogs" class="ml-4 text-gray-500">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = ref({
  slug: '',
  content: '',
});
const pending = ref(false);
const error = ref<string | null>(null);

async function createChangelog() {
  pending.value = true;
  error.value = null;
  try {
    await $fetch('/api/admin/changelogs', {
      method: 'POST',
      body: form.value,
    });
    router.push('/admin/changelogs');
  } catch (err: any) {
    error.value = err.data?.message || 'An unexpected error occurred.';
    console.error('Failed to create changelog:', err);
  } finally {
    pending.value = false;
  }
}
</script>
