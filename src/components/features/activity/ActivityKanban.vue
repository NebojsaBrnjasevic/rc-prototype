<template>
  <div class="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 scroll-thin snap-x" role="list" :aria-label="`Activities grouped by ${groupLabel}`">
    <section
      v-for="col in columns"
      :key="col.key"
      role="listitem"
      :aria-label="`${col.label}, ${col.items.length} activities`"
      class="snap-start w-[300px] flex-shrink-0 rounded-panel border border-line bg-surface-1 flex flex-col max-h-[calc(100vh-280px)]"
    >
      <header class="flex items-center justify-between gap-2 px-4 py-3.5 border-b border-line">
        <h3 class="text-[15px] font-extrabold truncate flex items-center gap-2">
          <span v-if="col.dot" :class="['w-2.5 h-2.5 rounded-[3px]', col.dot]" aria-hidden="true" />{{ col.label }}
        </h3>
        <span class="min-w-[26px] h-6 px-2 rounded-md bg-surface-3 text-xs font-extrabold tabular flex items-center justify-center">{{ col.items.length }}</span>
      </header>
      <div class="flex-1 overflow-y-auto scroll-thin p-3 space-y-2.5">
        <ActivityCard v-for="a in col.items" :key="a.id" :activity="a" />
      </div>
    </section>
    <AppEmptyState v-if="!columns.length" class="card w-full" title="No activities" description="Nothing matches your filters." compact />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RECORD_TYPES, STAGES, ACTIVITY_TYPES } from '@/stores/useActivityStore'
import { RECORD_STYLE } from '@/utils/activity'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'
import ActivityCard from './ActivityCard.vue'

const props = defineProps({
  activities: { type: Array, required: true },
  /** 'activityType' | 'recordType' | 'stage' | 'month' | 'createdBy' */
  groupBy: { type: String, default: 'activityType' },
})


const groupLabel = computed(() => ({ activityType: 'activity type', recordType: 'record type', stage: 'stage', month: 'month', createdBy: 'user' }[props.groupBy]))

const ORDER = {
  recordType: RECORD_TYPES,
  stage: STAGES,
  activityType: [...new Set(Object.values(ACTIVITY_TYPES).flat())].sort(),
}

const keyOf = (a) => props.groupBy === 'month' ? a.date.slice(0, 7) : a[props.groupBy]
const labelOf = (key) => props.groupBy === 'month'
  ? new Date(`${key}-01`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  : key

const columns = computed(() => {
  const map = {}
  props.activities.forEach((a) => { (map[keyOf(a)] ??= []).push(a) })
  let keys = Object.keys(map)
  const order = ORDER[props.groupBy]
  if (order) keys.sort((x, y) => order.indexOf(x) - order.indexOf(y))
  else if (props.groupBy === 'month') keys.sort().reverse()
  else keys.sort((x, y) => map[y].length - map[x].length)
  return keys.map((key) => ({
    key,
    label: labelOf(key),
    dot: props.groupBy === 'recordType' ? RECORD_STYLE[key]?.dot : null,
    items: map[key].sort((x, y) => y.date.localeCompare(x.date)),
  }))
})
</script>
