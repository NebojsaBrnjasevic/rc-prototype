<template>
  <AppLayout>
    <!-- Page header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Admin Overview</h1>
        <p class="mt-1 text-sm text-subtle">System status and quick actions</p>
      </div>
      <RouterLink
        to="/"
        class="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium text-subtle
          hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-surface-dark-overlay transition-colors"
      >
        <ArrowLeftIcon class="w-3.5 h-3.5" />
        Back to App
      </RouterLink>
    </div>

    <!-- KPI row 1: Users -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
      <div class="card p-4 flex items-center justify-between">
        <div>
          <p class="text-overline text-subtle">Total Users</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1 tabular-nums">102</p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-gray-100 dark:bg-surface-dark-overlay flex items-center justify-center flex-shrink-0">
          <UsersIcon class="w-4 h-4 text-subtle" />
        </div>
      </div>
      <div class="card p-4 flex items-center justify-between">
        <div>
          <p class="text-overline text-subtle">Active Users</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1 tabular-nums">92</p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-gray-100 dark:bg-surface-dark-overlay flex items-center justify-center flex-shrink-0">
          <UserPlusIcon class="w-4 h-4 text-subtle" />
        </div>
      </div>
      <div class="card p-4 flex items-center justify-between">
        <div>
          <p class="text-overline text-subtle">Admins</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1 tabular-nums">4</p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-gray-100 dark:bg-surface-dark-overlay flex items-center justify-center flex-shrink-0">
          <ShieldCheckIcon class="w-4 h-4 text-subtle" />
        </div>
      </div>
      <div class="card p-4 flex items-center justify-between">
        <div>
          <p class="text-overline text-subtle">Managers</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1 tabular-nums">19</p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-gray-100 dark:bg-surface-dark-overlay flex items-center justify-center flex-shrink-0">
          <UsersIcon class="w-4 h-4 text-subtle" />
        </div>
      </div>
    </div>

    <!-- KPI row 2: Points / Purchases -->
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
      <div class="card p-4 flex items-center justify-between sm:col-span-1">
        <div class="min-w-0">
          <p class="text-overline text-subtle">Total Points</p>
          <p class="text-xl font-bold text-gray-900 dark:text-white mt-1 tabular-nums">568,990</p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-gray-100 dark:bg-surface-dark-overlay flex items-center justify-center flex-shrink-0">
          <CurrencyDollarIcon class="w-4 h-4 text-subtle" />
        </div>
      </div>
      <div class="card p-4 flex items-center justify-between">
        <div>
          <p class="text-overline text-subtle">Users w/ Points</p>
          <p class="text-xl font-bold text-gray-900 dark:text-white mt-1 tabular-nums">98</p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-gray-100 dark:bg-surface-dark-overlay flex items-center justify-center flex-shrink-0">
          <ArrowTrendingUpIcon class="w-4 h-4 text-subtle" />
        </div>
      </div>
      <div class="card p-4 flex items-center justify-between">
        <div>
          <p class="text-overline text-subtle">Total Purchases</p>
          <p class="text-xl font-bold text-gray-900 dark:text-white mt-1 tabular-nums">6</p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-gray-100 dark:bg-surface-dark-overlay flex items-center justify-center flex-shrink-0">
          <ShoppingBagIcon class="w-4 h-4 text-subtle" />
        </div>
      </div>
      <div class="card p-4 flex items-center justify-between">
        <div>
          <p class="text-overline text-subtle">Points Spent</p>
          <p class="text-xl font-bold text-gray-900 dark:text-white mt-1 tabular-nums">25,000</p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-gray-100 dark:bg-surface-dark-overlay flex items-center justify-center flex-shrink-0">
          <CurrencyDollarIcon class="w-4 h-4 text-subtle" />
        </div>
      </div>
      <div class="card p-4 flex items-center justify-between">
        <div>
          <p class="text-overline text-subtle">Avg Level</p>
          <p class="text-xl font-bold text-gray-900 dark:text-white mt-1 tabular-nums">6.5</p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-gray-100 dark:bg-surface-dark-overlay flex items-center justify-center flex-shrink-0">
          <TrophyIcon class="w-4 h-4 text-subtle" />
        </div>
      </div>
    </div>

    <!-- System Status + Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

      <!-- System Status -->
      <div class="card p-5">
        <div class="mb-4">
          <p class="text-overline text-subtle">System Status</p>
          <h2 class="text-base font-semibold text-gray-900 dark:text-white mt-0.5">Current system health</h2>
        </div>
        <div class="space-y-3">
          <!-- Salesforce Connection -->
          <div class="flex items-center justify-between py-3 border-b border-surface-light-border dark:border-surface-dark-border">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-surface-dark-overlay flex items-center justify-center">
                <ClockIcon class="w-4 h-4 text-subtle" />
              </div>
              <span class="text-sm text-gray-700 dark:text-gray-300">Salesforce Connection</span>
            </div>
            <AppBadge color="neutral">Not checked</AppBadge>
          </div>
          <!-- Failed Syncs -->
          <div class="flex items-center justify-between py-3">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <ExclamationTriangleIcon class="w-4 h-4 text-warning" />
              </div>
              <span class="text-sm text-gray-700 dark:text-gray-300">Failed Syncs</span>
            </div>
            <AppBadge color="warning">9 pending</AppBadge>
          </div>
        </div>
        <button class="mt-4 flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-500 font-medium transition-colors">
          View System Details
          <ArrowRightIcon class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Recent Activity (Audit Log) -->
      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-overline text-subtle">Recent Activity</p>
            <h2 class="text-base font-semibold text-gray-900 dark:text-white mt-0.5">Latest audit log entries</h2>
          </div>
          <button class="text-xs text-brand-400 hover:text-brand-500 font-medium">View all</button>
        </div>
        <div class="space-y-1">
          <div
            v-for="entry in auditLog"
            :key="entry.id"
            class="flex items-center gap-3 py-2.5 border-b last:border-0 border-surface-light-border dark:border-surface-dark-border"
          >
            <div class="w-7 h-7 rounded-lg bg-gray-100 dark:bg-surface-dark-overlay flex items-center justify-center flex-shrink-0">
              <BoltIcon class="w-3.5 h-3.5 text-subtle" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ entry.event }}</p>
              <p class="text-xs text-subtle truncate">{{ entry.entity }}</p>
            </div>
            <span class="text-xs text-subtle flex-shrink-0">{{ entry.time }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Failed Salesforce Syncs -->
    <div class="rounded-xl border border-warning/30 bg-warning/5 p-5 mb-6">
      <div class="flex items-center gap-2 mb-1">
        <ExclamationTriangleIcon class="w-4 h-4 text-warning flex-shrink-0" />
        <h2 class="text-sm font-semibold text-warning">Failed Salesforce Syncs</h2>
      </div>
      <p class="text-xs text-subtle mb-4">These activities failed to sync and may need attention</p>

      <div class="space-y-px">
        <div
          v-for="sync in failedSyncs"
          :key="sync.id"
          class="flex items-start justify-between gap-4 py-3 border-b border-warning/10 last:border-0"
        >
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ sync.title }}</p>
            <p class="text-xs text-danger mt-0.5 truncate">{{ sync.error }}</p>
            <p class="text-xs text-subtle mt-0.5">{{ sync.ago }}</p>
          </div>
          <button
            class="flex items-center gap-1.5 px-3 h-7 rounded-lg text-xs font-medium flex-shrink-0
              text-gray-700 dark:text-gray-300 border border-surface-light-border dark:border-surface-dark-border
              hover:bg-gray-100 dark:hover:bg-surface-dark-overlay transition-colors"
          >
            <ArrowPathIcon class="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div>
      <h2 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          v-for="action in quickActions"
          :key="action.label"
          class="card p-4 flex flex-col items-center gap-2.5 hover:bg-gray-50 dark:hover:bg-surface-dark-overlay transition-colors group"
        >
          <div class="w-9 h-9 rounded-xl bg-gray-100 dark:bg-surface-dark-overlay group-hover:bg-brand-400/10 flex items-center justify-center transition-colors">
            <component :is="action.icon" class="w-4 h-4 text-subtle group-hover:text-brand-400 transition-colors" />
          </div>
          <span class="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-brand-400 transition-colors text-center">{{ action.label }}</span>
        </button>
      </div>
    </div>

  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import {
  UsersIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ShoppingBagIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  BoltIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ServerIcon,
  UserGroupIcon,
} from '@heroicons/vue/24/outline'

// TODO: replace with real API data
const auditLog = [
  { id: 1, event: 'activity.sync_success', entity: 'activity · 1a3411fd…', time: 'about 17 hours ago' },
  { id: 2, event: 'activity.created',      entity: 'activity · 1a3411fd…', time: 'about 17 hours ago' },
  { id: 3, event: 'activity.sync_success', entity: 'activity · e9b7f49e…', time: 'about 19 hours ago' },
  { id: 4, event: 'activity.created',      entity: 'activity · e3b7f49e…', time: 'about 19 hours ago' },
  { id: 5, event: 'activity.sync_success', entity: 'activity · 93b6e90f…', time: 'about 20 hours ago' },
]

const failedSyncs = [
  {
    id: 1,
    title: 'Meeting with Alem Sistem regarding ongoing projects (Fedja). As for BH Telekom, the tender is expected to be issued in August…',
    error: 'Failed to create Sales Activity: <html><body><center>We are down for maintenance.</center></body></html>',
    ago: '14 days ago',
  },
  {
    id: 2,
    title: 'CISO.bg - podcast. Presentor - Presales engineer from CRWD + Presales Engineer from EXN (Rafal)',
    error: 'Failed to create Sales Activity: [{"message":"bad value for restricted picklist field: Ignition - CEE","errorCode":"INVALID_OR_NULL_FOR_RESTRICTED_PICKLIST","fields":["Territory__c"]}]',
    ago: '6 months ago',
  },
  {
    id: 3,
    title: 'On-site event organized by Cyber Club Bulgaria, gathering together the cybersecurity community at one place (around 500 participants).',
    error: 'Failed to create Sales Activity: [{"message":"bad value for restricted picklist field: Ignition - CEE","errorCode":"INVALID_OR_NULL_FOR_RESTRICTED_PICKLIST","fields":["Territory__c"]}]',
    ago: '6 months ago',
  },
  {
    id: 4,
    title: 'Cyber Security Talks Bulgaria - onsite event dedicated to Crowdstrike',
    error: 'Failed to create Sales Activity: [{"message":"bad value for restricted picklist field: Ignition - CEE","errorCode":"INVALID_OR_NULL_FOR_RESTRICTED_PICKLIST","fields":["Territory__c"]}]',
    ago: '6 months ago',
  },
  {
    id: 5,
    title: 'End Customer Event - Protecting Your Organization in the Era of AI-Powered Adversaries',
    error: 'Failed to create Sales Activity: [{"message":"bad value for restricted picklist field: Ignition - CEE","errorCode":"INVALID_OR_NULL_FOR_RESTRICTED_PICKLIST","fields":["Territory__c"]}]',
    ago: '6 months ago',
  },
  {
    id: 6,
    title: 'Example new partner onboarding - updated',
    error: 'The requested resource does not exist',
    ago: '6 months ago',
  },
  {
    id: 7,
    title: 'Failed Activity Sync Test - Example Example',
    error: 'Failed to create Sales Activity: [{"message":"No such column \'Related_Opportunity__c\' on object of type Sales_Activity__c","errorCode":"INVALID_FIELD"}]',
    ago: '6 months ago',
  },
  {
    id: 8,
    title: 'I sent the follow ups to the subscribers of the Mimecast webinar 26-02-2026',
    error: 'Failed to create Sales Activity: [{"message":"bad value for restricted picklist field: Ignition - Italy","errorCode":"INVALID_OR_NULL_FOR_RESTRICTED_PICKLIST","fields":["Territory__c"]}]',
    ago: '7 months ago',
  },
]

const quickActions = [
  { label: 'Manage Users',   icon: UserGroupIcon },
  { label: 'Edit Changelog', icon: ClipboardDocumentListIcon },
  { label: 'View Audit Logs', icon: ChartBarIcon },
  { label: 'System Health',  icon: ServerIcon },
]
</script>
