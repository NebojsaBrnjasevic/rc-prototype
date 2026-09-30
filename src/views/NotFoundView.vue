<template>
  <div class="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-surface-light-base dark:bg-surface-dark-base">
    <p class="text-6xl font-bold text-brand-400 mb-4">404</p>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page not found</h1>
    <p class="text-sm text-subtle mb-6">This page doesn't exist or you don't have permission to view it.</p>
    <RouterLink to="/" class="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-brand-500 font-medium">
      ← Back to Home
    </RouterLink>
  </div>
</template>
