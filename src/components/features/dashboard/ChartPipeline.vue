<template>
  <div class="relative overflow-hidden rounded-2xl border border-success/25 bg-success/[0.04] dark:bg-success/[0.07] p-5 flex flex-col min-h-[220px]">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <p class="text-overline text-subtle">Pipeline Generated</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums mt-1">
          £{{ total.toLocaleString() }}
        </p>
        <p class="text-xs text-subtle mt-0.5">This month</p>
      </div>
      <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">
        +{{ growthPct }}%
      </span>
    </div>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Chart -->
    <apexchart
      type="area"
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

const data = [4000, 7500, 5000, 12000, 9000, 18000, 22000]
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const total = computed(() => data[data.length - 1])
const growthPct = computed(() => Math.round(((data[data.length - 1] - data[0]) / data[0]) * 100))

const series = [{ name: 'Pipeline', data }]

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    sparkline: { enabled: true },
    toolbar: { show: false },
    animations: { speed: 600 },
    background: 'transparent',
  },
  stroke: { curve: 'smooth', width: 2 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0,
      stops: [0, 100],
    },
  },
  colors: ['#10B981'],
  tooltip: {
    theme: themeStore.isDark ? 'dark' : 'light',
    x: { formatter: (_, { dataPointIndex }) => days[dataPointIndex] },
    y: { formatter: (v) => `£${v.toLocaleString()}` },
  },
}))
</script>
