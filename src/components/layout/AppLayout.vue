<template>
  <div class="min-h-screen bg-surface-light-base dark:bg-surface-dark-base transition-colors duration-250">
    <AppTopbar />
    <!-- Main content shifted down by topbar height -->
    <main class="pt-14 min-h-screen">
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import AppTopbar from './AppTopbar.vue'
</script>
