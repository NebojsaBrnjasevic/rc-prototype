<template>
  <div class="space-y-5">
    <!-- Salesforce connection + summary -->
    <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-5">
      <section class="card p-6 flex items-center gap-4">
        <span :class="['w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0', sf.box]">
          <component :is="sf.icon" :class="['w-6 h-6', admin.salesforce.status === 'checking' && 'animate-spin']" />
        </span>
        <div class="flex-1 min-w-0">
          <h2 class="text-lg font-extrabold">Salesforce connection</h2>
          <p class="text-sm text-fg-2" aria-live="polite">{{ sf.text }}</p>
        </div>
        <AppButton variant="secondary" size="sm" :loading="admin.salesforce.status === 'checking'" @click="admin.checkSalesforce()">
          Check now
        </AppButton>
      </section>

      <section class="card p-6 flex items-center gap-6">
        <div>
          <p class="text-overline text-fg-muted">Failed syncs</p>
          <p class="font-display font-bold text-num-lg tabular mt-1" :class="admin.failedSyncs.length ? 'text-warning' : 'text-success'">
            {{ admin.failedSyncs.length }}
          </p>
        </div>
        <div class="w-px self-stretch bg-line" aria-hidden="true" />
        <div>
          <p class="text-overline text-fg-muted">Root causes</p>
          <p class="font-display font-bold text-num-lg tabular mt-1">{{ admin.syncErrorGroups.length }}</p>
        </div>
        <p class="text-sm text-fg-2 flex-1 hidden sm:block">Fix a cause once, then retry its whole group.</p>
      </section>
    </div>

    <!-- Groups -->
    <section
      v-for="group in admin.syncErrorGroups"
      :key="group.key"
      :aria-label="group.label"
      class="card overflow-hidden"
    >
      <header class="px-6 py-4 border-b border-line flex flex-col sm:flex-row sm:items-center gap-3">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2.5">
            <ExclamationTriangleIcon class="w-5 h-5 text-warning flex-shrink-0" />
            <h3 class="text-base font-extrabold">{{ group.label }}</h3>
            <AppBadge color="warning" :pill="false">{{ group.items.length }}</AppBadge>
          </div>
          <p v-if="group.hint" class="text-[13px] text-fg-2 mt-1 sm:pl-[30px]">{{ group.hint }}</p>
        </div>
        <AppButton
          v-if="group.items.length > 1"
          variant="secondary"
          size="sm"
          :loading="group.items.some((s) => s.retrying)"
          @click="admin.retryGroup(group.key)"
        >
          <ArrowPathIcon class="w-4 h-4" />Retry all {{ group.items.length }}
        </AppButton>
      </header>

      <ul>
        <li v-for="sync in group.items" :key="sync.id" class="px-6 py-4 border-b last:border-0 border-line flex gap-4 items-start">
          <div class="flex-1 min-w-0">
            <p class="text-[15px] font-bold line-clamp-2">{{ sync.title }}</p>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[13px] text-fg-muted">
              <span>{{ sync.ago }}</span>
              <details class="group">
                <summary class="cursor-pointer text-brand font-semibold hover:text-brand-hover list-none flex items-center gap-1">
                  <ChevronRightIcon class="w-3.5 h-3.5 transition-transform group-open:rotate-90" />Raw error
                </summary>
                <pre class="mt-2 p-3 rounded-xl bg-page border border-line font-mono text-xs text-fg-2 whitespace-pre-wrap break-all">{{ sync.error }}</pre>
              </details>
            </div>
          </div>
          <AppButton variant="ghost" size="sm" :loading="sync.retrying" @click="admin.retrySync(sync.id)">
            <ArrowPathIcon v-if="!sync.retrying" class="w-4 h-4" />Retry
          </AppButton>
        </li>
      </ul>
    </section>

    <AppEmptyState
      v-if="!admin.failedSyncs.length"
      class="card"
      :icon="CheckCircleIcon"
      title="All activities are in sync"
      description="Nothing failed to reach Salesforce."
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  ExclamationTriangleIcon, ArrowPathIcon, ChevronRightIcon, CheckCircleIcon, CloudIcon, XCircleIcon,
} from '@heroicons/vue/24/outline'
import { useAdminStore } from '@/stores/useAdminStore'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'

const admin = useAdminStore()

const sf = computed(() => ({
  unchecked: { box: 'bg-surface-3 text-fg-2', icon: CloudIcon, text: 'Not checked yet this session.' },
  checking:  { box: 'bg-brand/10 text-brand', icon: ArrowPathIcon, text: 'Checking connection…' },
  ok:        { box: 'bg-success/10 text-success', icon: CheckCircleIcon, text: `Connected · checked ${admin.salesforce.checkedAt?.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}` },
  error:     { box: 'bg-danger/10 text-danger', icon: XCircleIcon, text: 'Connection failed.' },
}[admin.salesforce.status]))
</script>
