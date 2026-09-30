<template>
  <AppLayout>
    <div class="max-w-2xl">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">How-To Guide</h1>
      <p class="text-sm text-subtle mb-6">Everything you need to know about logging activities in Race Control.</p>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Steps" value="6" sublabel="Quick and easy" />
        <StatCard label="Record Types" value="3" sublabel="Sales, Pre-Sales, Marketing" />
        <StatCard label="Est. Time" value="~1 min" sublabel="Per activity" />
        <StatCard label="Synced To" value="Salesforce" sublabel="Automatically" />
      </div>

      <!-- TODO: Implement accordion steps -->
      <div class="space-y-2">
        <div v-for="(step, i) in steps" :key="i" class="card p-4">
          <p class="text-sm font-semibold text-gray-900 dark:text-white">Step {{ i + 1 }}: {{ step }}</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import StatCard from '@/components/ui/StatCard.vue'

const steps = [
  'Open the Activity Modal',
  'Choose a Record Type (Sales, Pre-Sales, Marketing)',
  'Link an Opportunity (optional)',
  'Fill in vendors, resellers, and end users',
  'Write a description and next step',
  'Click Create Activity',
]
</script>
