<template>
  <AppLayout>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Activity</h1>
      <AppButton @click="modalOpen = true">+ New Activity</AppButton>
    </div>

    <!--
      TODO: Implement the following sub-components:
        - <ActivityStats /> — 4 KPI cards with explicit date range filter (not tied to view tab)
        - <ActivityFilters /> — search, type filter, date range picker
        - <ActivityViewTabs /> — Table | Calendar | Kanban (changes display only, not date range)
        - <ActivityTable /> — sortable, paginated list using <DataTable />
        - <ActivityCalendar /> — calendar view
        - <ActivityKanban /> — grouped by type/status
        - <ActivityModal v-model="modalOpen" /> — 2-step: category picker → form
    -->

    <!-- Scope toggle -->
    <div class="flex items-center gap-2 mb-5">
      <button v-for="s in ['my', 'team']" :key="s"
        :class="['px-3 h-8 rounded-lg text-sm font-medium transition-colors', scope === s ? 'bg-gray-100 dark:bg-surface-dark-overlay text-gray-900 dark:text-white' : 'text-subtle']"
        @click="scope = s">
        {{ s === 'my' ? 'My Activities' : 'Team Activities' }}
      </button>
    </div>

    <!-- Placeholder -->
    <div class="card p-10 text-center text-subtle">
      <p class="text-sm">Activity view — implement ActivityTable, ActivityCalendar, ActivityKanban here.</p>
      <p class="text-xs mt-1">See stores/useActivityStore.js for data shape and API TODO comments.</p>
    </div>

    <!-- TODO: <ActivityModal v-model="modalOpen" /> -->
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useActivityStore } from '@/stores/useActivityStore'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'

const activityStore = useActivityStore()
const scope = ref('my')
const modalOpen = ref(false)
</script>
