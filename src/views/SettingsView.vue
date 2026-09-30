<template>
  <AppLayout>
    <div class="max-w-2xl">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

      <!-- Appearance -->
      <div class="card p-5 mb-4">
        <p class="text-overline text-subtle mb-4">Appearance</p>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">Theme</p>
            <p class="text-xs text-subtle">{{ themeStore.isDark ? 'Dark mode' : 'Light mode' }}</p>
          </div>
          <button
            :class="['relative w-11 h-6 rounded-full transition-colors', themeStore.isDark ? 'bg-brand-400' : 'bg-gray-200']"
            @click="themeStore.toggle()"
            role="switch" :aria-checked="themeStore.isDark"
          >
            <span :class="['absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform', themeStore.isDark ? 'left-6' : 'left-1']" />
          </button>
        </div>
      </div>

      <!-- Notifications — TODO -->
      <div class="card p-5 mb-4">
        <p class="text-overline text-subtle mb-3">Notifications</p>
        <p class="text-sm text-subtle">TODO: Implement notification preference toggles.</p>
      </div>

      <!-- Account — TODO -->
      <div class="card p-5">
        <p class="text-overline text-subtle mb-3">Account</p>
        <p class="text-sm text-subtle">TODO: Display name, email, password change.</p>
        <RouterLink to="/profile" class="text-xs text-brand-400 hover:text-brand-500 mt-2 inline-block">
          View full profile →
        </RouterLink>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { useThemeStore } from '@/stores/useThemeStore'
import AppLayout from '@/components/layout/AppLayout.vue'

const themeStore = useThemeStore()
</script>
