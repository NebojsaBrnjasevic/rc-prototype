<template>
  <AppLayout>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Directory</h1>
      <p class="mt-1 text-sm text-subtle">Partner momentum, in one view.</p>
    </div>

    <!-- Trending hero -->
    <div class="card p-5 mb-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-overline text-subtle">Trending this week</p>
          <p class="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
            Top signal: <span class="font-semibold text-brand-400">SALES · 149</span>
            <span class="text-subtle"> · Sample: 200 activities</span>
          </p>
        </div>
        <!-- TODO: Tooltip explaining what "signal" means -->
        <AppTooltip text="Signal = total activities logged against this vendor in the selected period" position="left">
          <button class="w-6 h-6 rounded-full border border-surface-light-border dark:border-surface-dark-border flex items-center justify-center text-subtle hover:text-gray-600 dark:hover:text-gray-300 text-xs font-semibold">
            ℹ
          </button>
        </AppTooltip>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RouterLink
          v-for="v in directoryStore.trendingVendors"
          :key="v.id"
          :to="`/directory/vendor/${v.id}`"
          class="p-4 rounded-xl border border-surface-light-border dark:border-surface-dark-border
            hover:border-brand-400/40 hover:bg-brand-400/5 transition-all group"
        >
          <div class="flex items-center justify-between mb-2">
            <AppAvatar :name="v.name" size="sm" />
            <AppBadge color="brand" size="xs">Trending</AppBadge>
          </div>
          <p class="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-brand-400 transition-colors">{{ v.name }}</p>
          <p class="text-xs text-subtle mt-0.5">{{ v.activities }} linked activities</p>
        </RouterLink>
      </div>
    </div>

    <!-- Tabs + search -->
    <div class="flex flex-col sm:flex-row gap-3 mb-4">
      <div class="flex items-center gap-1 bg-gray-100 dark:bg-surface-dark-overlay p-1 rounded-xl">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="[
            'px-4 h-8 rounded-lg text-sm font-medium transition-colors',
            activeTab === tab
              ? 'bg-white dark:bg-surface-dark-raised text-gray-900 dark:text-white shadow-sm'
              : 'text-subtle hover:text-gray-700 dark:hover:text-gray-200',
          ]"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Search -->
      <div class="relative flex-1 max-w-sm">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="search"
          @input="directoryStore.setSearch(search)"
          type="search"
          placeholder="Search vendors..."
          class="w-full h-10 pl-9 pr-4 text-sm rounded-xl border
            border-surface-light-border bg-white text-gray-900 placeholder-gray-400
            dark:border-surface-dark-border dark:bg-surface-dark-overlay dark:text-gray-100 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-brand-400 transition"
        />
      </div>
    </div>

    <!-- Vendor list -->
    <!--
      UX FIX: Each row is a RouterLink covering the ENTIRE row (not just the chevron).
      Original app only had the chevron clickable.
    -->
    <div class="space-y-1">
      <RouterLink
        v-for="vendor in directoryStore.filteredVendors"
        :key="vendor.id"
        :to="`/directory/vendor/${vendor.id}`"
        class="flex items-center gap-3 px-4 py-3.5 rounded-xl border
          border-surface-light-border dark:border-surface-dark-border
          hover:border-brand-400/30 hover:bg-gray-50 dark:hover:bg-surface-dark-overlay
          transition-all cursor-pointer group"
      >
        <AppAvatar :name="vendor.name" size="md" />

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-brand-400 transition-colors">
              {{ vendor.name }}
            </span>
            <AppBadge v-if="vendor.isTrending" color="brand" size="xs">Trending</AppBadge>
          </div>
          <p class="text-xs text-subtle mt-0.5">{{ vendor.activities }} activities · Last: {{ vendor.lastActivity }}</p>
        </div>

        <AppBadge color="neutral" size="xs">{{ vendor.type }}</AppBadge>

        <svg class="w-4 h-4 text-subtle group-hover:text-brand-400 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </RouterLink>

      <div v-if="directoryStore.filteredVendors.length === 0" class="py-12 text-center text-subtle text-sm">
        No results for "{{ search }}"
      </div>
    </div>

  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useDirectoryStore } from '@/stores/useDirectoryStore'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppAvatar from '@/components/ui/AppAvatar.vue'
import AppTooltip from '@/components/ui/AppTooltip.vue'

const directoryStore = useDirectoryStore()
directoryStore.fetchVendors()

const tabs = ['Vendors', 'Resellers', 'End Users']
const activeTab = ref('Vendors')
const search = ref('')
</script>
