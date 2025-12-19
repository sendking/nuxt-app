<template>
  <div>
    <div v-if="pending">Loading...</div>
    <div v-else-if="!markdownContent" class="error">
      <h2>Changelog Not Found</h2>
      <p>Could not find a changelog with the slug: <strong>{{ slug }}</strong></p>
      <NuxtLink to="/changelogs">Back to changelog index</NuxtLink>
    </div>
    <div v-else v-html="renderedMarkdown" class="prose"></div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import { marked } from 'marked';
import { useRoute } from 'vue-router';

const route = useRoute();
const slug = ref(route.params.slug);
const markdownContent = ref(null);
const pending = ref(true);

// Using a relative path from this file to the target directory
const modules = import.meta.glob('../../../changelogs/*.md', { as: 'raw' });

const renderedMarkdown = computed(() => {
  if (markdownContent.value) {
    return marked(markdownContent.value);
  }
  return '';
});

watchEffect(async () => {
  // Note: The key in `modules` will now be the relative path
  const targetPath = `../../../changelogs/${slug.value}.md`;

  // --- DEBUGGING LINES ---
  console.log('--- Debugging [slug].vue ---');
  console.log('Target Path:', targetPath);
  console.log('Available Modules:', Object.keys(modules));
  // --- END DEBUGGING ---

  pending.value = true;
  // Reset content when slug changes
  markdownContent.value = null;

  if (modules[targetPath]) {
    markdownContent.value = await modules[targetPath]();
  }

  pending.value = false;
});
</script>

<style scoped>
.prose {
  line-height: 1.6;
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3) {
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.prose :deep(code) {
  background-color: #f6f8fa;
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  border-radius: 3px;
}

.prose :deep(pre) {
  background-color: #f6f8fa;
  padding: 16px;
  overflow: auto;
  border-radius: 3px;
}

.prose :deep(blockquote) {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
}

.error {
  color: #cc0000;
}</style>

