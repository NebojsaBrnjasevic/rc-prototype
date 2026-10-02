<template>
  <div class="space-y-4">
    <!-- Toolbar -->
    <div class="card px-5 py-4 flex flex-wrap items-center gap-3">
      <div class="flex items-center gap-1">
        <button type="button" class="w-9 h-9 rounded-lg flex items-center justify-center text-fg-2 hover:bg-surface-2 hover:text-fg" :aria-label="`Previous ${view}`" @click="shift(-1)">
          <ChevronLeftIcon class="w-5 h-5" />
        </button>
        <button type="button" class="w-9 h-9 rounded-lg flex items-center justify-center text-fg-2 hover:bg-surface-2 hover:text-fg" :aria-label="`Next ${view}`" @click="shift(1)">
          <ChevronRightIcon class="w-5 h-5" />
        </button>
      </div>
      <h2 class="font-display font-semibold text-xl min-w-[200px]" aria-live="polite">{{ heading }}</h2>
      <AppButton variant="secondary" size="sm" @click="cursor = startOfDay(new Date())">Today</AppButton>

      <div class="ml-auto flex flex-wrap items-center gap-4">
        <AppSegmentControl v-model="view" size="sm" :options="viewOptions" aria-label="Calendar view" />
        <label class="flex items-center gap-2.5 text-sm font-semibold text-fg-2 cursor-pointer">
          <AppToggle v-model="excludeWeekends" size="sm" aria-label="Exclude weekends" />
          Exclude weekends
        </label>
      </div>
    </div>

    <!-- Month / week grid -->
    <div v-if="view !== 'day'" class="card p-3 sm:p-4 overflow-x-auto">
      <div class="grid gap-2 min-w-[640px]" :style="{ gridTemplateColumns: `repeat(${weekdays.length}, minmax(0, 1fr))` }">
        <div v-for="d in weekdays" :key="d" class="text-center text-overline text-fg-muted py-2">{{ d }}</div>

        <div
          v-for="day in days"
          :key="day.key"
          :class="[
            'rounded-xl border p-2 flex flex-col gap-1',
            view === 'month' ? 'min-h-[118px]' : 'min-h-[320px]',
            day.isToday ? 'border-reward-fill/50 bg-reward-fill/[0.04]' : 'border-line bg-surface-2/40',
            !day.inMonth && 'opacity-40',
          ]"
        >
          <button
            type="button"
            :class="['self-start text-xs font-extrabold tabular w-7 h-7 rounded-lg hover:bg-surface-3', day.isToday ? 'text-reward' : 'text-fg-2']"
            :aria-label="`Open ${day.label}`"
            @click="openDay(day.date)"
          >{{ day.date.getDate() }}</button>

          <button
            v-for="a in day.items.slice(0, view === 'month' ? 3 : 20)"
            :key="a.id"
            type="button"
            :class="['w-full text-left h-6 px-2 rounded-md text-xs font-bold truncate flex items-center gap-1.5', RECORD_STYLE[a.recordType].soft]"
            :title="activityTitle(a)"
            @click="ui.openActivity(a.id)"
          >
            <component :is="RECORD_STYLE[a.recordType].icon" class="w-3.5 h-3.5 flex-shrink-0" />
            <span class="truncate">{{ a.activityType }}</span>
          </button>
          <button
            v-if="view === 'month' && day.items.length > 3"
            type="button"
            class="text-left text-xs font-bold text-fg-muted hover:text-brand px-1"
            @click="openDay(day.date)"
          >+{{ day.items.length - 3 }} more</button>
        </div>
      </div>
    </div>

    <!-- Day -->
    <div v-else class="card p-5">
      <div v-if="dayItems.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        <ActivityCard v-for="a in dayItems" :key="a.id" :activity="a" />
      </div>
      <AppEmptyState v-else :icon="CalendarDaysIcon" title="Nothing on this day" description="No activities match your filters for this date." compact />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline'
import { useUiStore } from '@/stores/useUiStore'
import { RECORD_STYLE, activityTitle } from '@/utils/activity'
import AppButton from '@/components/ui/AppButton.vue'
import AppSegmentControl from '@/components/ui/AppSegmentControl.vue'
import AppToggle from '@/components/ui/AppToggle.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'
import ActivityCard from './ActivityCard.vue'

const props = defineProps({ activities: { type: Array, required: true } })
const ui = useUiStore()

const DAY = 86_400_000
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const mondayOf = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7))

const view = ref('month')
const cursor = ref(startOfDay(new Date()))
const excludeWeekends = ref(true)

const viewOptions = [
  { value: 'month', label: 'Month' },
  { value: 'week', label: 'Week' },
  { value: 'day', label: 'Day' },
]

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const weekdays = computed(() => (excludeWeekends.value ? ALL_DAYS.slice(0, 5) : ALL_DAYS))

const byDate = computed(() => {
  const map = {}
  props.activities.forEach((a) => { (map[a.date] ??= []).push(a) })
  return map
})

const days = computed(() => {
  const c = cursor.value
  let start, count
  if (view.value === 'week') {
    start = mondayOf(c); count = 7
  } else {
    const first = new Date(c.getFullYear(), c.getMonth(), 1)
    const last = new Date(c.getFullYear(), c.getMonth() + 1, 0)
    start = mondayOf(first)
    count = Math.ceil((last - start) / DAY / 7 + 1 / 7) * 7
  }
  const today = iso(new Date())
  const out = []
  for (let i = 0; i < count; i++) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    const dow = (date.getDay() + 6) % 7
    if (excludeWeekends.value && dow > 4) continue
    const key = iso(date)
    out.push({
      key,
      date,
      label: date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }),
      inMonth: view.value === 'week' || date.getMonth() === c.getMonth(),
      isToday: key === today,
      items: byDate.value[key] ?? [],
    })
  }
  return out
})

const dayItems = computed(() => byDate.value[iso(cursor.value)] ?? [])

const heading = computed(() => {
  const c = cursor.value
  if (view.value === 'month') return c.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  if (view.value === 'week') return `Week of ${mondayOf(c).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
  return c.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
})

function shift(dir) {
  const c = cursor.value
  if (view.value === 'month') cursor.value = new Date(c.getFullYear(), c.getMonth() + dir, 1)
  else if (view.value === 'week') cursor.value = new Date(c.getFullYear(), c.getMonth(), c.getDate() + 7 * dir)
  else cursor.value = new Date(c.getFullYear(), c.getMonth(), c.getDate() + dir)
}

function openDay(date) {
  cursor.value = startOfDay(date)
  view.value = 'day'
}
</script>
