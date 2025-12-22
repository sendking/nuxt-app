<template>
  <div>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error" class="error">
      <h2>Changelog Not Found</h2>
      <p>Could not find a changelog with the slug: <strong>{{ slug }}</strong></p>
      <NuxtLink to="/changelogs">Back to changelog index</NuxtLink>
    </div>
    <div v-else-if="changelog" v-html="renderedMarkdown" class="prose"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { marked } from 'marked';

const route = useRoute();
const slug = route.params.slug as string;

const { data: changelog, pending, error } = await useFetch(`/api/changelogs/${slug}`, {
  transform: (response) => response.data,
});

const renderedMarkdown = computed(() => {
  if (changelog.value?.content) {
    return marked(changelog.value.content);
  }
  return '';
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
}
</style>
