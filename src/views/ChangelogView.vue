<template>
  <AppLayout>
    <div class="max-w-2xl">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Changelog</h1>
      <!-- TODO: Fetch from API or static JSON file -->
      <div class="space-y-4">
        <div v-for="entry in entries" :key="entry.date + entry.title" class="card p-5">
          <div class="flex items-start gap-3">
            <span class="text-lg leading-none mt-0.5">{{ entry.emoji }}</span>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ entry.title }}</h3>
                <AppBadge :color="entry.type === 'feature' ? 'brand' : entry.type === 'improvement' ? 'success' : 'neutral'" size="xs">
                  {{ entry.type }}
                </AppBadge>
              </div>
              <p class="text-xs text-subtle mt-0.5">{{ entry.date }}</p>
              <p v-if="entry.description" class="text-sm text-gray-600 dark:text-gray-400 mt-2">{{ entry.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import AppBadge from '@/components/ui/AppBadge.vue'

const entries = [
  { emoji: '🔐', title: 'Passkeys Now Supported!', type: 'feature', date: 'June 2026' },
  { emoji: '🏠', title: 'Updated Home & Activity Pages', type: 'improvement', date: 'March 2026' },
  // TODO: Load full changelog from API or /data/changelog.json
]
</script>
