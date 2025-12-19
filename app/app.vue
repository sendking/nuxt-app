<template>
  <div style="font-family: sans-serif; padding: 1rem;">
    <header style="margin-bottom: 2rem; border-bottom: 1px solid #e5e5e5; padding-bottom: 1rem;">
      <nav>
        <NuxtLink to="/" style="margin-right: 1rem; text-decoration: none; color: #333;">Home</NuxtLink>
        <NuxtLink to="/changelogs" style="text-decoration: none; color: #333;">Changelogs</NuxtLink>
      </nav>
    </header>
    
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f9f9f9;
  color: #333;
}
</style>
