<template>
  <AppLayout>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="text-sm text-subtle mt-0.5">Updated {{ new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
      </div>
      <!-- Export only shown when there's data -->
      <AppButton v-if="hasData" variant="secondary" size="sm">Export CSV</AppButton>
    </div>

    <!-- Scope tabs -->
    <!--
      UX FIX: Default to 'team' scope if current user has no personal data,
      to avoid showing an entirely empty dashboard to new users.
    -->
    <div class="flex items-center gap-1 mb-5">
      <button v-for="s in scopes" :key="s.key"
        :class="['px-3 h-8 rounded-lg text-sm font-medium transition-colors', scope === s.key ? 'bg-gray-100 dark:bg-surface-dark-overlay text-gray-900 dark:text-white' : 'text-subtle']"
        @click="scope = s.key">
        {{ s.label }}
      </button>
    </div>

    <!-- TODO: Implement -->
    <!-- <DashboardKPIs :scope="scope" :dateRange="dateRange" /> -->
    <!-- <ActivityTrend :scope="scope" :dateRange="dateRange" /> -->
    <!-- <PartnerBreakdown :scope="scope" :dateRange="dateRange" /> -->

    <div class="card p-10 text-center text-subtle">
      <p class="text-sm">Implement DashboardKPIs, ActivityTrend, and PartnerBreakdown components.</p>
      <p class="text-xs mt-1">Use useActivityStore for data. Note: show 'team' scope by default if user has no personal data.</p>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useActivityStore } from '@/stores/useActivityStore'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'

const activityStore = useActivityStore()
const scope = ref('team') // Default to team — UX fix
const scopes = [
  { key: 'my', label: 'My Dashboard' },
  { key: 'team', label: 'Team' },
  { key: 'all', label: 'All' },
]
const hasData = computed(() => activityStore.filtered.length > 0)
</script>
