<template>
  <div class="relative overflow-hidden rounded-2xl border border-reward/25 bg-reward/[0.04] dark:bg-reward/[0.07] p-5 flex flex-col min-h-[220px]">
    <!-- Header -->
    <div>
      <p class="text-overline text-subtle">Total Points</p>
      <p class="text-2xl font-bold text-reward tabular-nums mt-1">
        {{ points.toLocaleString() }}
      </p>
      <p class="text-xs text-subtle mt-0.5">Level {{ level }} · {{ ptsToNext }} to Lv.{{ level + 1 }}</p>
    </div>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Radial gauge centered -->
    <div class="flex justify-center">
      <apexchart
        type="radialBar"
        height="110"
        width="110"
        :options="chartOptions"
        :series="[progressPct]"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/useThemeStore'
import { useAuthStore } from '@/stores/useAuthStore'

const themeStore = useThemeStore()
const auth = useAuthStore()

const points    = computed(() => auth.user?.points ?? 600)
const level     = computed(() => auth.user?.level ?? 3)
const ptsToNext = 300
const levelMax  = 900
const progressPct = computed(() => Math.round((points.value / levelMax) * 100))

const chartOptions = computed(() => ({
  chart: {
    type: 'radialBar',
    background: 'transparent',
    animations: { speed: 800 },
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      hollow: { size: '55%' },
      track: {
        background: themeStore.isDark ? '#1E3A4A' : '#E5E7EB',
        strokeWidth: '100%',
      },
      dataLabels: {
        name: {
          show: true,
          offsetY: -6,
          fontSize: '9px',
          color: themeStore.isDark ? '#9CA3AF' : '#6B7280',
          formatter: () => `LV ${level.value}`,
        },
        value: {
          show: true,
          offsetY: 2,
          fontSize: '16px',
          fontWeight: 700,
          color: '#EAB308',
          formatter: () => `${progressPct.value}%`,
        },
      },
    },
  },
  colors: ['#EAB308'],
  stroke: { lineCap: 'round' },
  tooltip: { enabled: false },
}))
</script>
