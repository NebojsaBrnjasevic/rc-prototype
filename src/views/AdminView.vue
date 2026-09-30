<template>
  <AppLayout>
    <!--
      UX FIX: Admin mode visual indicator — user knows they're in admin context.
      Original app had no visual separation from the main app.
    -->
    <div class="mb-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-400/10 border border-brand-400/20">
      <svg class="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
      <span class="text-sm font-semibold text-brand-400">Admin Mode</span>
      <RouterLink to="/" class="ml-auto text-xs text-subtle hover:text-brand-400 transition-colors">← Back to App</RouterLink>
    </div>

    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Admin Overview</h1>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <StatCard label="Total Users" value="102" />
      <StatCard label="Active Users" value="92" />
      <StatCard label="Total Points" value="568,990" />
      <StatCard label="Avg Level" value="6.5" />
    </div>

    <!-- System status -->
    <div class="card p-5 mb-4">
      <p class="text-overline text-subtle mb-3">System Status</p>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-warning animate-pulse-soft" />
          <p class="text-sm text-gray-700 dark:text-gray-300">Salesforce — Not checked</p>
        </div>
        <AppBadge color="warning">9 failed syncs</AppBadge>
      </div>
      <RouterLink to="/admin/system" class="text-xs text-brand-400 hover:text-brand-500 mt-3 inline-block">View System Details →</RouterLink>
    </div>

    <!-- TODO: Implement admin sub-sections -->
    <!-- /admin/management, /admin/content, /admin/system, /admin/analytics -->
    <div class="card p-10 text-center text-subtle">
      <p class="text-sm">Implement admin sub-sections: Management, Content, System, Analytics.</p>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import StatCard from '@/components/ui/StatCard.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
</script>
