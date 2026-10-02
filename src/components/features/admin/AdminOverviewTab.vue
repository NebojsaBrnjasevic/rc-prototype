<template>
  <div class="space-y-5">
    <!-- Needs attention -->
    <section
      v-if="admin.failedSyncs.length"
      aria-labelledby="attention-title"
      class="rounded-panel border border-warning/35 bg-warning/[0.06] p-6 flex flex-col lg:flex-row lg:items-center gap-5"
    >
      <span class="w-12 h-12 rounded-[14px] bg-warning/15 text-warning flex items-center justify-center flex-shrink-0">
        <ExclamationTriangleIcon class="w-6 h-6" />
      </span>
      <div class="flex-1 min-w-0">
        <h2 id="attention-title" class="text-lg font-extrabold">
          {{ admin.failedSyncs.length }} activities failed to sync to Salesforce
        </h2>
        <p class="text-sm text-fg-2 mt-1">
          <template v-if="topGroup && topGroup.items.length > 1">
            {{ topGroup.items.length }} of them share one cause: {{ topGroup.label }}.
          </template>
          <template v-else>Review the errors and retry once they're fixed.</template>
        </p>
      </div>
      <AppButton variant="secondary" @click="$emit('navigate', 'activities')">
        Review syncs <ArrowRightIcon class="w-4 h-4" />
      </AppButton>
    </section>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <!-- Users -->
      <section aria-labelledby="ov-users" class="card p-6 flex flex-col gap-5">
        <div class="flex items-center justify-between">
          <h2 id="ov-users" class="font-display font-semibold text-xl">Users</h2>
          <button type="button" class="text-sm font-bold text-brand hover:text-brand-hover flex items-center gap-1" @click="$emit('navigate', 'users')">
            Manage users <ChevronRightIcon class="w-4 h-4" />
          </button>
        </div>
        <dl class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div v-for="s in userStats" :key="s.label" class="rounded-2xl bg-surface-2 p-4">
            <dt class="text-overline text-fg-muted">{{ s.label }}</dt>
            <dd class="font-display font-bold text-[28px] leading-tight tabular mt-1">{{ s.value }}</dd>
          </div>
        </dl>
        <div>
          <div class="flex justify-between text-[13px] font-bold mb-1.5">
            <span class="text-fg-2">Active users</span>
            <span class="tabular">{{ activePct }}%</span>
          </div>
          <AppProgressBar :value="activePct" color="success" size="sm" />
        </div>
      </section>

      <!-- Points economy -->
      <section aria-labelledby="ov-points" class="rounded-card border border-reward-fill/30 bg-reward-fill/[0.06] p-6 flex flex-col gap-5">
        <div class="flex items-center justify-between">
          <h2 id="ov-points" class="font-display font-semibold text-xl">Points economy</h2>
          <AppBadge color="reward" :pill="false">Avg level {{ admin.stats.points.avgLevel }}</AppBadge>
        </div>
        <div>
          <p class="text-overline text-reward">Points in circulation</p>
          <p class="font-display font-bold text-num-xl text-reward tabular mt-1">{{ fmt(admin.stats.points.total) }}</p>
        </div>
        <dl class="grid grid-cols-3 gap-3">
          <div v-for="s in pointStats" :key="s.label" class="rounded-2xl bg-surface-1/70 p-4">
            <dt class="text-overline text-fg-muted">{{ s.label }}</dt>
            <dd class="font-display font-bold text-xl tabular mt-1">{{ s.value }}</dd>
          </div>
        </dl>
      </section>
    </div>

    <!-- Recent events -->
    <section aria-labelledby="ov-events" class="card p-6">
      <div class="flex items-center justify-between mb-3">
        <h2 id="ov-events" class="font-display font-semibold text-xl">Recent events</h2>
        <button type="button" class="text-sm font-bold text-brand hover:text-brand-hover flex items-center gap-1" @click="$emit('navigate', 'events')">
          All events <ChevronRightIcon class="w-4 h-4" />
        </button>
      </div>
      <AdminEventRow v-for="e in admin.auditLog.slice(0, 5)" :key="e.id" :event="e" />
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ExclamationTriangleIcon, ArrowRightIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { useAdminStore } from '@/stores/useAdminStore'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppProgressBar from '@/components/ui/AppProgressBar.vue'
import AdminEventRow from './AdminEventRow.vue'

defineEmits(['navigate'])

const admin = useAdminStore()
const fmt = (n) => n.toLocaleString('en-GB')

const topGroup = computed(() => admin.syncErrorGroups[0] ?? null)

const userStats = computed(() => {
  const u = admin.stats.users
  return [
    { label: 'Total', value: fmt(u.total) },
    { label: 'Active', value: fmt(u.active) },
    { label: 'Managers', value: fmt(u.managers) },
    { label: 'Admins', value: fmt(u.admins) },
  ]
})
const activePct = computed(() => Math.round((admin.stats.users.active / admin.stats.users.total) * 100))

const pointStats = computed(() => {
  const p = admin.stats.points
  return [
    { label: 'Users earning', value: fmt(p.usersWithPoints) },
    { label: 'Purchases', value: fmt(p.purchases) },
    { label: 'Points spent', value: fmt(p.spent) },
  ]
})
</script>
