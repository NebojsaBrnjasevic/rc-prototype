<template>
  <div class="relative overflow-hidden rounded-2xl border border-[#A78BFA]/25 bg-[#A78BFA]/[0.04] dark:bg-[#A78BFA]/[0.07] p-5 flex flex-col min-h-[220px]">
    <!-- Header -->
    <div>
      <p class="text-overline text-subtle">Activity Mix</p>
      <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ topType }}</p>
      <p class="text-xs text-subtle mt-0.5">Dominant type</p>
    </div>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Donut + Legend -->
    <div class="flex items-center gap-2">
      <apexchart
        type="donut"
        height="100"
        width="100"
        :options="chartOptions"
        :series="series"
      />
      <div class="flex flex-col gap-1.5 flex-1 min-w-0">
        <div v-for="(item, i) in breakdown" :key="item.label" class="flex items-center justify-between gap-1">
          <div class="flex items-center gap-1.5 min-w-0">
            <span class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: colors[i] }" />
            <span class="text-xs text-subtle truncate">{{ item.label }}</span>
          </div>
          <span class="text-xs font-semibold text-gray-700 dark:text-gray-300 tabular-nums">{{ item.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/useThemeStore'

const themeStore = useThemeStore()

const breakdown = [
  { label: 'Sales',     count: 12 },
  { label: 'Pre-Sales', count: 7  },
  { label: 'Marketing', count: 3  },
]

const colors = ['#3BB3E5', '#A78BFA', '#10B981']
const series = breakdown.map(b => b.count)
const topType = computed(() => breakdown.reduce((a, b) => b.count > a.count ? b : a).label)

const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
    background: 'transparent',
    animations: { speed: 600 },
  },
  colors,
  labels: breakdown.map(b => b.label),
  dataLabels: { enabled: false },
  legend: { show: false },
  stroke: { width: 0 },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '9px',
            color: themeStore.isDark ? '#9CA3AF' : '#6B7280',
          },
          value: {
            show: true,
            fontSize: '14px',
            fontWeight: 700,
            color: themeStore.isDark ? '#F9FAFB' : '#111827',
            offsetY: 2,
          },
          total: {
            show: true,
            label: 'Total',
            fontSize: '9px',
            color: themeStore.isDark ? '#9CA3AF' : '#6B7280',
            fontWeight: 400,
            formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0),
          },
        },
      },
    },
  },
  tooltip: {
    theme: themeStore.isDark ? 'dark' : 'light',
    y: { formatter: (v) => `${v} activities` },
  },
}))
</script>
