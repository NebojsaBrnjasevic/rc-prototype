<template>
  <div class="relative overflow-hidden rounded-2xl border border-brand-400/25 bg-brand-400/[0.04] dark:bg-brand-400/[0.07] p-5 flex flex-col min-h-[220px]">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <p class="text-overline text-subtle">Activities</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums mt-1">{{ total }}</p>
        <p class="text-xs text-subtle mt-0.5">Last 7 days</p>
      </div>
      <span class="text-xs font-medium px-2 py-0.5 rounded-full"
        :class="trend >= 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'">
        {{ trend >= 0 ? '+' : '' }}{{ trend }}%
      </span>
    </div>

    <!-- Spacer pushes chart to bottom -->
    <div class="flex-1" />

    <!-- Chart -->
    <apexchart
      type="bar"
      height="80"
      width="100%"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/useThemeStore'

const themeStore = useThemeStore()

const data = [2, 5, 3, 8, 4, 6, 7]
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const total = computed(() => data.reduce((a, b) => a + b, 0))
const trend = computed(() => {
  const prev = data.slice(0, 3).reduce((a, b) => a + b, 0)
  const curr = data.slice(4).reduce((a, b) => a + b, 0)
  return prev === 0 ? 100 : Math.round(((curr - prev) / prev) * 100)
})

const series = [{ name: 'Activities', data }]

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    sparkline: { enabled: true },
    toolbar: { show: false },
    animations: { enabled: true, speed: 600 },
    background: 'transparent',
  },
  plotOptions: {
    bar: { columnWidth: '60%', borderRadius: 3 },
  },
  colors: ['#3BB3E5'],
  tooltip: {
    theme: themeStore.isDark ? 'dark' : 'light',
    x: { formatter: (_, { dataPointIndex }) => days[dataPointIndex] },
    y: { formatter: (v) => `${v} activities` },
  },
  states: {
    hover: { filter: { type: 'lighten', value: 0.2 } },
  },
}))
</script>
