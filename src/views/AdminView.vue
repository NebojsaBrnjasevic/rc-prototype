<template>
  <AppLayout>
    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <h1 class="font-display font-bold text-[28px] sm:text-[34px] tracking-tight">Admin</h1>
        <p class="mt-2 text-base text-fg-2">Users, Salesforce sync health and the audit trail.</p>
      </div>
    </div>

    <!-- Tabs — selection lives in ?tab= so it survives reloads and can be linked -->
    <AppViewTabs
      v-model="tab"
      :tabs="tabs"
      aria-label="Admin sections"
      id-prefix="admin"
      class="mb-6"
    />

    <div
      :id="`admin-panel-${tab}`"
      role="tabpanel"
      :aria-labelledby="`admin-tab-${tab}`"
      tabindex="0"
      class="focus-visible:ring-offset-4 rounded-panel"
    >
      <AdminOverviewTab v-if="tab === 'overview'" @navigate="tab = $event" />
      <AdminUsersTab v-else-if="tab === 'users'" />
      <AdminActivitiesTab v-else-if="tab === 'activities'" />
      <AdminEventsTab v-else-if="tab === 'events'" />
    </div>
  </AppLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Squares2X2Icon, UsersIcon, ArrowPathIcon, ClipboardDocumentListIcon } from '@heroicons/vue/24/outline'
import { useAdminStore } from '@/stores/useAdminStore'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppViewTabs from '@/components/ui/AppViewTabs.vue'
import AdminOverviewTab from '@/components/features/admin/AdminOverviewTab.vue'
import AdminUsersTab from '@/components/features/admin/AdminUsersTab.vue'
import AdminActivitiesTab from '@/components/features/admin/AdminActivitiesTab.vue'
import AdminEventsTab from '@/components/features/admin/AdminEventsTab.vue'

const route = useRoute()
const router = useRouter()
const admin = useAdminStore()

const TAB_KEYS = ['overview', 'users', 'activities', 'events']

const tab = computed({
  get: () => (TAB_KEYS.includes(route.query.tab) ? route.query.tab : 'overview'),
  set: (value) => router.replace({ query: { ...route.query, tab: value === 'overview' ? undefined : value } }),
})

const tabs = computed(() => [
  { value: 'overview',   label: 'Overview',   icon: Squares2X2Icon },
  { value: 'users',      label: 'Users',      icon: UsersIcon, count: admin.stats.users.total },
  {
    value: 'activities',
    label: 'Activities',
    icon: ArrowPathIcon,
    count: admin.failedSyncs.length || null,
    tone: 'warning',
  },
  { value: 'events',     label: 'Events',     icon: ClipboardDocumentListIcon },
])
</script>
