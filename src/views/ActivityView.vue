<template>
  <AppLayout>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <h1 class="font-display font-bold text-[28px] sm:text-[34px] tracking-tight">Activities</h1>
        <p class="mt-2 text-base text-fg-2">The work you've logged, the follow-up it creates and the pipeline behind it.</p>
      </div>
      <AppButton @click="ui.openActivityModal()">
        <PlusIcon class="w-[18px] h-[18px] stroke-[2.5]" />Log activity
      </AppButton>
    </div>

    <!-- KPIs — always describe the filtered set, whatever the view -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
      <StatCard label="Activities" :value="filtered.length" :sublabel="rangeLabel" :icon="BoltIcon" />
      <StatCard label="Top activity type" :value="topType" :sublabel="topType ? rangeLabel : 'Shows once activities are logged'" :icon="SparklesIcon" />
      <StatCard label="Pipeline influenced" :value="gbpCompact(pipeline)" :sublabel="rangeLabel" :icon="BriefcaseIcon" />
      <StatCard label="Next booked" :value="nextBooked ? formatDate(nextBooked.date, { day: 'numeric', month: 'short' }) : null" :sublabel="nextBooked ? `${nextBooked.activityType} · ${relativeDays(nextBooked.date)}` : 'No upcoming activity'" :icon="CalendarDaysIcon" />
    </div>

    <!-- Toolbar -->
    <div class="card p-4 sm:p-5 mb-5 space-y-4">
      <div class="flex flex-col xl:flex-row xl:items-center gap-3">
        <div class="flex gap-3 flex-1 min-w-0">
          <div class="flex-1 min-w-0">
            <AppInput v-model="q" placeholder="Search activities, companies, people…" aria-label="Search activities" clearable>
              <template #leading><MagnifyingGlassIcon class="w-[18px] h-[18px]" /></template>
            </AppInput>
          </div>

          <AppPopover label="Filters" width-class="w-[min(340px,calc(100vw-48px))]">
            <template #trigger="{ toggle, open }">
              <AppButton variant="secondary" :aria-expanded="open" @click="toggle">
                <FunnelIcon class="w-[18px] h-[18px]" />Filters
                <span v-if="activeFilterCount" class="min-w-[20px] h-5 px-1.5 rounded-md bg-brand text-brand-on text-xs font-extrabold flex items-center justify-center">{{ activeFilterCount }}</span>
              </AppButton>
            </template>
            <template #default="{ close }">
              <div class="space-y-4">
                <AppFormField label="Record type" input-id="f-record">
                  <AppSelect id="f-record" v-model="filters.recordType" :options="[{ value: '', label: 'All types' }, ...RECORD_TYPES]" />
                </AppFormField>
                <AppFormField label="Stage" input-id="f-stage">
                  <AppSelect id="f-stage" v-model="filters.stage" :options="[{ value: '', label: 'All stages' }, ...STAGES]" />
                </AppFormField>
                <div class="grid grid-cols-2 gap-3">
                  <AppFormField label="From" input-id="f-from">
                    <AppInput id="f-from" v-model="filters.from" type="date" />
                  </AppFormField>
                  <AppFormField label="To" input-id="f-to">
                    <AppInput id="f-to" v-model="filters.to" type="date" />
                  </AppFormField>
                </div>
                <div class="flex justify-between pt-1">
                  <AppButton variant="ghost" size="sm" :disabled="!activeFilterCount" @click="resetFilters">Reset</AppButton>
                  <AppButton size="sm" @click="close">Done</AppButton>
                </div>
              </div>
            </template>
          </AppPopover>
        </div>

        <div class="flex flex-wrap gap-3">
          <AppSegmentControl v-model="scope" :options="scopeOptions" aria-label="Scope" />
          <AppSegmentControl v-model="view" :options="viewOptions" aria-label="View" />
        </div>
      </div>

      <!-- Narrative + active filters -->
      <div class="flex flex-col lg:flex-row lg:items-center gap-3 pt-4 border-t border-line">
        <p class="text-sm text-fg-2 flex-1">
          Showing <span class="font-extrabold text-fg tabular">{{ filtered.length }}</span>
          {{ filtered.length === 1 ? 'activity' : 'activities' }}{{ scope === 'my' ? ' you logged' : ' across your team' }}
        </p>
        <div class="flex flex-wrap items-center gap-2">
          <span
            v-for="chip in filterChips"
            :key="chip.key"
            class="h-8 pl-3 pr-1 rounded-full bg-brand/10 border border-brand/30 text-[13px] font-bold flex items-center gap-1"
          >
            {{ chip.label }}
            <button type="button" class="w-6 h-6 rounded-full flex items-center justify-center hover:bg-brand/20" :aria-label="`Remove filter ${chip.label}`" @click="chip.clear()">
              <XMarkIcon class="w-3.5 h-3.5" />
            </button>
          </span>
          <span v-for="s in signals" :key="s.label" :class="['h-8 px-3 rounded-full border border-line text-[13px] font-semibold flex items-center gap-1.5', s.tone]">
            <component :is="s.icon" class="w-4 h-4" />{{ s.value }} {{ s.label }}
          </span>
          <AppSelect
            v-if="view === 'kanban'"
            v-model="groupBy"
            class="!h-9 !w-auto"
            :options="groupOptions"
            aria-label="Group by"
          />
        </div>
      </div>
    </div>

    <!-- Views -->
    <template v-if="filtered.length || view === 'calendar'">
      <ActivityTable v-if="view === 'table'" :activities="sorted" />
      <ActivityCalendar v-else-if="view === 'calendar'" :activities="filtered" />
      <ActivityKanban v-else :activities="filtered" :group-by="groupBy" />
    </template>

    <div v-else class="card">
      <AppEmptyState
        :icon="BoltIcon"
        :title="hasAnyFilter ? 'No activities match' : 'No activities yet'"
        :description="hasAnyFilter ? 'Try clearing a filter or searching for something else.' : 'Log your first activity — every one earns race points and XP.'"
      >
        <template #action>
          <AppButton v-if="hasAnyFilter" variant="secondary" @click="clearAll">Clear filters</AppButton>
          <AppButton v-else @click="ui.openActivityModal()"><PlusIcon class="w-[18px] h-[18px]" />Log activity</AppButton>
        </template>
      </AppEmptyState>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  PlusIcon, BoltIcon, SparklesIcon, BriefcaseIcon, CalendarDaysIcon, MagnifyingGlassIcon, FunnelIcon, XMarkIcon,
  TableCellsIcon, ViewColumnsIcon, ArrowUturnRightIcon, LinkIcon, ClockIcon,
} from '@heroicons/vue/24/outline'
import { useUiStore } from '@/stores/useUiStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { useActivityStore, RECORD_TYPES, STAGES } from '@/stores/useActivityStore'
import { useDirectoryStore } from '@/stores/useDirectoryStore'
import { getPeriodRange } from '@/stores/useRaceStore'
import { formatDate, relativeDays } from '@/utils/activity'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppFormField from '@/components/ui/AppFormField.vue'
import AppPopover from '@/components/ui/AppPopover.vue'
import AppSegmentControl from '@/components/ui/AppSegmentControl.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'
import StatCard from '@/components/ui/StatCard.vue'
import ActivityTable from '@/components/features/activity/ActivityTable.vue'
import ActivityCalendar from '@/components/features/activity/ActivityCalendar.vue'
import ActivityKanban from '@/components/features/activity/ActivityKanban.vue'

const route = useRoute()
const router = useRouter()
const ui = useUiStore()
const auth = useAuthStore()
const activityStore = useActivityStore()
const directory = useDirectoryStore()

// ── State (view + scope live in the URL so links from Home land correctly) ─
const VIEWS = ['table', 'calendar', 'kanban']
const view = computed({
  get: () => (VIEWS.includes(route.query.view) ? route.query.view : 'table'),
  set: (v) => router.replace({ query: { ...route.query, view: v === 'table' ? undefined : v } }),
})
const scope = computed({
  get: () => (route.query.scope === 'team' || route.query.scope === 'all' ? 'team' : 'my'),
  set: (v) => router.replace({ query: { ...route.query, scope: v === 'my' ? undefined : v } }),
})

const q = ref('')
const filters = reactive({ recordType: '', stage: '', from: '', to: '' })
const groupBy = ref('activityType')

// ?period=week|month|quarter|year (from Home) → date range filter
const toIso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
watch(() => route.query.period, (p) => {
  if (!['week', 'month', 'quarter', 'year'].includes(p)) return
  const { start, end } = getPeriodRange(p)
  filters.from = toIso(start)
  filters.to = toIso(new Date(end.getTime() - 1))
}, { immediate: true })

const scopeOptions = [
  { value: 'my', label: 'My activities' },
  { value: 'team', label: 'Team' },
]
const viewOptions = [
  { value: 'table', label: 'Table', icon: TableCellsIcon },
  { value: 'calendar', label: 'Calendar', icon: CalendarDaysIcon },
  { value: 'kanban', label: 'Kanban', icon: ViewColumnsIcon },
]
const groupOptions = [
  { value: 'activityType', label: 'Group by: Activity type' },
  { value: 'recordType', label: 'Group by: Record type' },
  { value: 'stage', label: 'Group by: Stage' },
  { value: 'month', label: 'Group by: Month' },
  { value: 'createdBy', label: 'Group by: User' },
]

// ── Filtering ───────────────────────────────────────────────────────────────
const haystack = (a) => [
  a.description, a.nextStep, a.activityType, a.recordType, a.createdBy, a.opportunity,
  ...a.vendors.map(directory.name), a.reseller && directory.name(a.reseller), ...a.endUsers.map(directory.name),
].filter(Boolean).join(' ').toLowerCase()

const filtered = computed(() => {
  const s = q.value.trim().toLowerCase()
  return activityStore.activities.filter((a) =>
    (scope.value === 'team' || a.createdBy === auth.user?.name || a.attendees.includes(auth.user?.name)) &&
    (!filters.recordType || a.recordType === filters.recordType) &&
    (!filters.stage || a.stage === filters.stage) &&
    (!filters.from || a.date >= filters.from) &&
    (!filters.to || a.date <= filters.to) &&
    (!s || haystack(a).includes(s)))
})
const sorted = computed(() => [...filtered.value].sort((x, y) => y.date.localeCompare(x.date)))

const activeFilterCount = computed(() => [filters.recordType, filters.stage, filters.from || filters.to].filter(Boolean).length)
const hasAnyFilter = computed(() => activeFilterCount.value > 0 || !!q.value.trim())

function resetFilters() { Object.assign(filters, { recordType: '', stage: '', from: '', to: '' }) }
function clearAll() { resetFilters(); q.value = '' }

const filterChips = computed(() => {
  const chips = []
  if (filters.recordType) chips.push({ key: 'rt', label: filters.recordType, clear: () => { filters.recordType = '' } })
  if (filters.stage) chips.push({ key: 'st', label: filters.stage, clear: () => { filters.stage = '' } })
  if (filters.from || filters.to) {
    const f = filters.from ? formatDate(filters.from, { day: 'numeric', month: 'short' }) : '…'
    const t = filters.to ? formatDate(filters.to, { day: 'numeric', month: 'short' }) : '…'
    chips.push({ key: 'dt', label: `${f} – ${t}`, clear: () => { filters.from = ''; filters.to = '' } })
  }
  return chips
})

// ── KPIs + signals ──────────────────────────────────────────────────────────
const rangeLabel = computed(() => (filters.from || filters.to ? 'In selected dates' : 'All time'))
const topType = computed(() => {
  const m = {}
  filtered.value.forEach((a) => { m[a.activityType] = (m[a.activityType] ?? 0) + 1 })
  return Object.entries(m).sort((x, y) => y[1] - x[1])[0]?.[0] ?? null
})
const pipeline = computed(() => filtered.value.reduce((s, a) => s + (a.pipelineValue ?? 0), 0))
const nextBooked = computed(() => {
  const today = toIso(new Date())
  return [...filtered.value].filter((a) => a.stage !== 'Completed' && a.date >= today).sort((x, y) => x.date.localeCompare(y.date))[0] ?? null
})
const gbpCompact = (n) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', notation: 'compact', maximumFractionDigits: 2 }).format(n)

const signals = computed(() => [
  { label: 'with follow-up', value: filtered.value.filter((a) => activityStore.activities.some((x) => x.followUpOf === a.id)).length, icon: ArrowUturnRightIcon, tone: 'text-presales' },
  { label: 'linked opportunities', value: filtered.value.filter((a) => a.opportunity).length, icon: LinkIcon, tone: 'text-success' },
  { label: 'scheduled', value: filtered.value.filter((a) => a.stage !== 'Completed').length, icon: ClockIcon, tone: 'text-brand' },
])
</script>
