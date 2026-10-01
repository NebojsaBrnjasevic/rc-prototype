<template>
  <AppLayout>
    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <div class="flex items-start justify-between mb-1">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          Dashboards
          <span class="text-brand-400">· {{ scopeLabel }}</span>
        </h1>
        <p class="text-sm text-subtle mt-0.5">Activity insights for your selected scope, date range, and filters.</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="flex items-center gap-1.5 text-xs text-subtle">
          <ClockIcon class="w-3.5 h-3.5" />
          Updated {{ currentTime }}
        </span>
        <button class="icon-btn" @click="refresh" title="Refresh">
          <ArrowPathIcon class="w-4 h-4" :class="refreshing ? 'animate-spin' : ''" />
        </button>
        <AppButton variant="secondary" size="sm" @click="exportCSV">
          <ArrowDownTrayIcon class="w-3.5 h-3.5" />
          Export CSV
        </AppButton>
      </div>
    </div>

    <!-- ── Overview / Activities tabs ────────────────────────────────────── -->
    <div class="flex items-center gap-0 border-b border-gray-200 dark:border-surface-dark-border mb-5 mt-4">
      <button v-for="tab in tabs" :key="tab.key"
        class="px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-1.5"
        :class="activeTab === tab.key
          ? 'border-brand-400 text-brand-400'
          : 'border-transparent text-subtle hover:text-gray-700 dark:hover:text-gray-300'"
        @click="activeTab = tab.key">
        <component :is="tab.icon" class="w-4 h-4" />
        {{ tab.label }}
        <span v-if="tab.count !== undefined"
          class="text-xs px-1.5 py-0.5 rounded-full"
          :class="activeTab === tab.key ? 'bg-brand-400/15 text-brand-400' : 'bg-gray-100 dark:bg-surface-dark-overlay text-subtle'">
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- ── Filter bar ─────────────────────────────────────────────────────── -->
    <div class="flex items-center gap-2 mb-5 flex-wrap">
      <!-- Scope pills -->
      <div class="flex items-center gap-1 bg-gray-100 dark:bg-surface-dark-overlay rounded-lg p-0.5">
        <button v-for="s in scopes" :key="s.key"
          class="flex items-center gap-1.5 px-3 h-7 rounded-md text-sm font-medium transition-all"
          :class="scope === s.key
            ? 'bg-white dark:bg-surface-dark-raised text-gray-900 dark:text-white shadow-sm'
            : 'text-subtle hover:text-gray-700 dark:hover:text-gray-300'"
          @click="scope = s.key">
          <component :is="s.icon" class="w-3.5 h-3.5" />
          {{ s.label }}
        </button>
      </div>

      <!-- Divider -->
      <div class="w-px h-5 bg-gray-200 dark:bg-surface-dark-border" />

      <!-- Category filters -->
      <div class="flex items-center gap-1">
        <button v-for="cat in categories" :key="cat.key"
          class="flex items-center gap-1.5 px-3 h-7 rounded-lg text-sm font-medium transition-all border"
          :class="activeCategory === cat.key
            ? 'border-transparent text-white'
            : 'border-gray-200 dark:border-surface-dark-border text-subtle bg-transparent hover:border-gray-300'"
          :style="activeCategory === cat.key ? { background: cat.color } : {}"
          @click="activeCategory = cat.key">
          <span v-if="cat.color && cat.key !== 'all'" class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: activeCategory === cat.key ? 'rgba(255,255,255,0.7)' : cat.color }" />
          {{ cat.label }}
          <span class="tabular-nums opacity-70">{{ cat.count }}</span>
        </button>
      </div>

      <!-- Spacer -->
      <div class="flex-1" />

      <!-- Date range -->
      <button class="flex items-center gap-1.5 px-3 h-8 rounded-lg text-sm text-subtle border border-gray-200 dark:border-surface-dark-border hover:border-gray-300 transition-colors">
        <CalendarDaysIcon class="w-3.5 h-3.5" />
        Last 30 days
        <ChevronDownIcon class="w-3 h-3 opacity-60" />
      </button>

      <!-- Search -->
      <div class="relative">
        <MagnifyingGlassIcon class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-subtle pointer-events-none" />
        <input
          v-model="vendorSearch"
          type="text"
          placeholder="Search vendors..."
          class="pl-8 pr-3 h-8 w-40 rounded-lg text-sm bg-transparent border border-gray-200 dark:border-surface-dark-border text-gray-900 dark:text-white placeholder:text-subtle focus:outline-none focus:ring-1 focus:ring-brand-400 transition-all focus:w-52"
        />
      </div>

      <!-- Filters button -->
      <button class="flex items-center gap-1.5 px-3 h-8 rounded-lg text-sm text-subtle border border-gray-200 dark:border-surface-dark-border hover:border-gray-300 transition-colors">
        <AdjustmentsHorizontalIcon class="w-3.5 h-3.5" />
        Filters
      </button>
    </div>

    <!-- ── KPI Cards ───────────────────────────────────────────────────────── -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
      <div v-for="kpi in kpiCards" :key="kpi.label"
        class="rounded-2xl border p-4 flex flex-col gap-3"
        :style="{ borderColor: kpi.color + '40', background: kpi.color + '0d' }">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-overline text-subtle">{{ kpi.label }}</p>
            <p class="text-xs text-subtle mt-0.5 opacity-70">last30</p>
          </div>
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" :style="{ background: kpi.color + '20' }">
            <component :is="kpi.icon" class="w-4 h-4" :style="{ color: kpi.color }" />
          </div>
        </div>
        <p class="text-3xl font-bold tabular-nums" :style="{ color: kpi.color }">{{ kpi.value }}</p>
      </div>
    </div>

    <!-- ── Middle row: By record type + Activity trend ─────────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
      <!-- By record type -->
      <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-5">
        <div class="flex items-center gap-2 mb-4">
          <Squares2X2Icon class="w-4 h-4 text-brand-400" />
          <p class="text-sm font-semibold text-gray-900 dark:text-white">By record type</p>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-xl border border-brand-400/20 bg-brand-400/[0.05] p-4 text-center">
            <p class="text-3xl font-bold text-brand-400 tabular-nums">{{ recordTypeCounts.upcoming }}</p>
            <p class="text-xs text-brand-400 mt-1 font-medium">Upcoming</p>
          </div>
          <div class="rounded-xl border border-success/20 bg-success/[0.05] p-4 text-center">
            <p class="text-3xl font-bold text-success tabular-nums">{{ recordTypeCounts.completed }}</p>
            <p class="text-xs text-success mt-1 font-medium">Completed</p>
          </div>
        </div>
      </div>

      <!-- Activity trend -->
      <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-5">
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center gap-2">
            <ArrowTrendingUpIcon class="w-4 h-4 text-brand-400" />
            <p class="text-sm font-semibold text-gray-900 dark:text-white">Activity trend</p>
          </div>
        </div>
        <p class="text-xs text-subtle mb-4">{{ trendDateRange }}</p>
        <div v-if="hasTrendData" class="h-[120px]">
          <apexchart type="area" height="120" width="100%" :options="trendChartOptions" :series="trendSeries" />
        </div>
        <div v-else class="h-[120px] flex items-center justify-center">
          <p class="text-sm text-subtle">Not enough data in this range</p>
        </div>
      </div>
    </div>

    <!-- ── Partner Activity ────────────────────────────────────────────────── -->
    <div class="mb-5">
      <div class="mb-3">
        <p class="text-base font-semibold text-gray-900 dark:text-white">Partner Activity</p>
        <p class="text-xs text-subtle mt-0.5">Top vendors, resellers, and end users by activity volume</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div v-for="partner in partnerCards" :key="partner.label"
          class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-5">
          <div class="flex items-center gap-2 mb-4">
            <component :is="partner.icon" class="w-4 h-4 text-brand-400" />
            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ partner.label }}</p>
          </div>
          <div v-if="partner.items.length" class="space-y-2">
            <div v-for="(item, i) in partner.items" :key="item.name"
              class="flex items-center justify-between">
              <div class="flex items-center gap-2 min-w-0">
                <span class="text-xs text-subtle w-4 tabular-nums">{{ i + 1 }}</span>
                <span class="text-sm text-gray-800 dark:text-gray-200 truncate">{{ item.name }}</span>
              </div>
              <span class="text-xs font-semibold text-brand-400 tabular-nums ml-2">{{ item.count }}</span>
            </div>
          </div>
          <div v-else class="h-16 flex items-center justify-center">
            <p class="text-xs text-subtle">{{ partner.empty }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Activities by record type ──────────────────────────────────────── -->
    <div class="rounded-2xl border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-raised p-5">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <LayersIcon class="w-4 h-4 text-brand-400" />
          <p class="text-sm font-semibold text-gray-900 dark:text-white">Activities by record type</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1.5 px-2.5 h-7 rounded-lg border border-gray-200 dark:border-surface-dark-border text-xs text-subtle">
            Group by
            <span class="text-gray-700 dark:text-gray-300 font-medium">Auto</span>
            <span class="opacity-50">(Record type)</span>
            <ChevronDownIcon class="w-3 h-3 opacity-50" />
          </div>
          <RouterLink to="/activity" class="text-xs text-brand-400 hover:underline flex items-center gap-0.5">
            View activities <ArrowRightIcon class="w-3 h-3" />
          </RouterLink>
        </div>
      </div>

      <!-- Grouped activity list -->
      <div v-if="groupedActivities.length" class="space-y-4">
        <div v-for="group in groupedActivities" :key="group.label">
          <p class="text-overline text-subtle mb-2">{{ group.label }} · {{ group.items.length }}</p>
          <div class="space-y-2">
            <div v-for="act in group.items" :key="act.id"
              class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-surface-dark-overlay hover:bg-gray-100 dark:hover:bg-surface-dark-border transition-colors cursor-pointer">
              <div class="flex items-center gap-3 min-w-0">
                <span class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: typeColor(act.type) }" />
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ act.vendor }}</p>
                  <p class="text-xs text-subtle truncate">{{ act.type }} · {{ act.date }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2 ml-2 flex-shrink-0">
                <span v-if="act.pipelineValue" class="text-xs text-subtle tabular-nums">£{{ act.pipelineValue.toLocaleString() }}</span>
                <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                  :class="act.recordType === 'Completed' ? 'bg-success/10 text-success' : 'bg-brand-400/10 text-brand-400'">
                  {{ act.recordType }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="py-10 text-center">
        <p class="text-sm text-subtle">No data available</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeStore } from '@/stores/useThemeStore'
import { useActivityStore } from '@/stores/useActivityStore'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import {
  ClockIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  CursorArrowRaysIcon,
  SparklesIcon,
  FireIcon,
  Squares2X2Icon,
  ArrowTrendingUpIcon,
  BuildingStorefrontIcon,
  BuildingOffice2Icon,
  UsersIcon,
  ArrowRightIcon,
} from '@heroicons/vue/24/outline'
import { ChartPieIcon } from '@heroicons/vue/24/outline'

// Layers icon inline (not in heroicons v2 outline by default)
const LayersIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
  </svg>`,
}

const themeStore = useThemeStore()
const activityStore = useActivityStore()

// ── State ─────────────────────────────────────────────────────────────────
const activeTab = ref('overview')
const scope = ref('my')
const activeCategory = ref('all')
const vendorSearch = ref('')
const refreshing = ref(false)

const currentTime = ref(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

// ── Tabs ──────────────────────────────────────────────────────────────────
const tabs = computed(() => [
  { key: 'overview', label: 'Overview', icon: ChartBarIcon },
  { key: 'activities', label: 'Activities', icon: ChartPieIcon, count: activityStore.filtered.length },
])

// ── Scopes ────────────────────────────────────────────────────────────────
const scopes = [
  { key: 'my',   label: 'My Dashboard', icon: UsersIcon },
  { key: 'team', label: 'Team',         icon: BuildingOffice2Icon },
  { key: 'all',  label: 'All',          icon: Squares2X2Icon },
]
const scopeLabel = computed(() => scopes.find(s => s.key === scope.value)?.label ?? 'My')

// ── Category filters ──────────────────────────────────────────────────────
const TYPE_COLORS = {
  Sales:     '#3BB3E5',
  'Pre-Sales': '#A78BFA',
  Marketing: '#10B981',
}
function typeColor(type) { return TYPE_COLORS[type] ?? '#9CA3AF' }

const categories = computed(() => {
  const acts = activityStore.filtered
  return [
    { key: 'all',       label: 'All',       color: null,      count: acts.length },
    { key: 'Sales',     label: 'Sales',     color: '#3BB3E5', count: acts.filter(a => a.type === 'Sales').length },
    { key: 'Pre-Sales', label: 'Pre-Sales', color: '#A78BFA', count: acts.filter(a => a.type === 'Pre-Sales').length },
    { key: 'Marketing', label: 'Marketing', color: '#10B981', count: acts.filter(a => a.type === 'Marketing').length },
  ]
})

// ── KPI Cards ─────────────────────────────────────────────────────────────
const kpiCards = computed(() => {
  const acts = activityStore.filtered
  return [
    {
      label: 'Total Activities',
      value: acts.length,
      icon: ChartBarIcon,
      color: '#3BB3E5',
    },
    {
      label: 'Sales',
      value: acts.filter(a => a.type === 'Sales').length,
      icon: CursorArrowRaysIcon,
      color: '#3BB3E5',
    },
    {
      label: 'Pre-Sales',
      value: acts.filter(a => a.type === 'Pre-Sales').length,
      icon: SparklesIcon,
      color: '#A78BFA',
    },
    {
      label: 'Marketing',
      value: acts.filter(a => a.type === 'Marketing').length,
      icon: FireIcon,
      color: '#10B981',
    },
  ]
})

// ── Record type counts ─────────────────────────────────────────────────────
const recordTypeCounts = computed(() => ({
  upcoming:  activityStore.filtered.filter(a => a.recordType === 'Upcoming').length,
  completed: activityStore.filtered.filter(a => a.recordType === 'Completed').length,
}))

// ── Trend chart ───────────────────────────────────────────────────────────
const trendDateRange = computed(() => {
  const now = new Date()
  const from = new Date(now); from.setDate(from.getDate() - 30)
  const fmt = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  return `${fmt(from)} – ${fmt(now)}`
})

const hasTrendData = computed(() => activityStore.filtered.length >= 3)

// Mock trend data — 5 week buckets
const trendData = [1, 3, 2, 5, 4, 7, 6]
const trendSeries = [{ name: 'Activities', data: trendData }]

const trendChartOptions = computed(() => ({
  chart: {
    type: 'area',
    sparkline: { enabled: false },
    toolbar: { show: false },
    background: 'transparent',
    animations: { speed: 600 },
  },
  grid: {
    borderColor: themeStore.isDark ? '#1E3A4A' : '#E5E7EB',
    strokeDashArray: 4,
    padding: { left: 0, right: 0, top: 0, bottom: 0 },
  },
  xaxis: {
    categories: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
    labels: { style: { colors: themeStore.isDark ? '#6B7280' : '#9CA3AF', fontSize: '10px' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { colors: themeStore.isDark ? '#6B7280' : '#9CA3AF', fontSize: '10px' },
      formatter: (v) => Math.round(v),
    },
    min: 0,
  },
  stroke: { curve: 'smooth', width: 2 },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0, stops: [0, 100] },
  },
  colors: ['#3BB3E5'],
  tooltip: {
    theme: themeStore.isDark ? 'dark' : 'light',
    y: { formatter: (v) => `${v} activities` },
  },
  dataLabels: { enabled: false },
}))

// ── Partner Activity ──────────────────────────────────────────────────────
const partnerCards = computed(() => {
  const acts = activityStore.filtered

  const tally = (field) => {
    const map = {}
    acts.forEach(a => {
      const key = a[field]
      if (key) map[key] = (map[key] ?? 0) + 1
    })
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))
  }

  const endUserTally = () => {
    const map = {}
    acts.forEach(a => (a.endUsers ?? []).forEach(u => { map[u] = (map[u] ?? 0) + 1 }))
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }))
  }

  return [
    { label: 'Top Vendors',   icon: BuildingStorefrontIcon, items: tally('vendor'),   empty: 'No vendor data' },
    { label: 'Top Resellers', icon: BuildingOffice2Icon,    items: tally('reseller'), empty: 'No reseller data' },
    { label: 'Top End Users', icon: UsersIcon,              items: endUserTally(),    empty: 'No end user data' },
  ]
})

// ── Grouped activities ─────────────────────────────────────────────────────
const groupedActivities = computed(() => {
  const acts = activityStore.filtered
  const groups = {}
  acts.forEach(a => {
    if (!groups[a.recordType]) groups[a.recordType] = []
    groups[a.recordType].push(a)
  })
  return Object.entries(groups).map(([label, items]) => ({ label, items }))
})

// ── Actions ───────────────────────────────────────────────────────────────
async function refresh() {
  refreshing.value = true
  await activityStore.fetchActivities()
  currentTime.value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  refreshing.value = false
}

function exportCSV() {
  const rows = [
    ['Date', 'Type', 'Vendor', 'Reseller', 'End Users', 'Record Type', 'Pipeline Value'],
    ...activityStore.filtered.map(a => [
      a.date, a.type, a.vendor, a.reseller, (a.endUsers ?? []).join('; '), a.recordType, a.pipelineValue ?? '',
    ]),
  ]
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url; link.download = 'activities.csv'; link.click()
  URL.revokeObjectURL(url)
}
</script>
