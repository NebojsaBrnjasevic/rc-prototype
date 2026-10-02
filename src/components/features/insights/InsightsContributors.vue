<template>
  <section aria-labelledby="contrib-title" class="card p-6">
    <div class="flex items-start justify-between gap-4 mb-4">
      <div>
        <h3 id="contrib-title" class="font-display font-semibold text-xl">Contributors</h3>
        <p class="text-sm text-fg-2 mt-1">Who logged what {{ thisLabel }}.</p>
      </div>
      <AppBadge :pill="false">{{ rows.length }} {{ rows.length === 1 ? 'person' : 'people' }}</AppBadge>
    </div>

    <div v-if="rows.length" class="space-y-2">
      <div
        v-for="r in rows"
        :key="r.name"
        :class="['grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_96px_80px] gap-4 items-center px-4 py-3 rounded-[14px]', r.isMe ? 'bg-brand/10 ring-1 ring-inset ring-brand/40' : 'bg-surface-2']"
      >
        <span class="flex items-center gap-3 min-w-0">
          <AppAvatar :name="r.name" size="sm" />
          <span :class="['text-[15px] font-bold truncate', r.isMe ? 'text-brand' : '']">{{ r.name }}<template v-if="r.isMe"> (you)</template></span>
        </span>
        <span class="hidden sm:block h-1.5 rounded-full bg-surface-3 overflow-hidden" aria-hidden="true">
          <span :class="['block h-full rounded-full', r.isMe ? 'bg-brand' : 'bg-brand/50']" :style="{ width: `${r.share}%` }" />
        </span>
        <span class="text-sm font-extrabold tabular text-right">{{ r.activities }} <span class="font-semibold text-fg-muted">act.</span></span>
        <span class="hidden sm:block text-sm font-semibold text-fg-2 tabular text-right">{{ gbp(r.pipeline) }}</span>
      </div>
    </div>
    <p v-else class="py-6 text-center text-sm text-fg-muted">Nobody has logged an activity {{ thisLabel }} yet.</p>
  </section>
</template>

<script setup>
import AppAvatar from '@/components/ui/AppAvatar.vue'
import AppBadge from '@/components/ui/AppBadge.vue'

defineProps({
  /** From useInsightsStore().contributors */
  rows:      { type: Array, required: true },
  /** e.g. 'this week' */
  thisLabel: { type: String, required: true },
})

const fmt = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', notation: 'compact', maximumFractionDigits: 1 })
const gbp = (n) => fmt.format(n)
</script>
