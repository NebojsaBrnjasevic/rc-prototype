<template>
  <div class="flex flex-col gap-1.5" :class="align === 'end' ? 'items-end' : 'items-start'">
    <span v-if="label" class="text-[11px] font-extrabold uppercase tracking-[0.1em] text-fg-muted">{{ label }}</span>
    <div class="flex gap-1.5" role="timer" :aria-label="ariaText">
      <div
        v-for="part in parts"
        :key="part.unit"
        :class="[
          'rounded-xl bg-surface-2 border border-line flex flex-col items-center justify-center',
          size === 'sm' ? 'w-[52px] h-[52px]' : 'w-[60px] h-[60px]',
        ]"
      >
        <span :class="['font-mono font-bold tabular leading-none', size === 'sm' ? 'text-[19px]' : 'text-[22px]']">{{ part.value }}</span>
        <span class="text-[9px] font-extrabold tracking-[0.1em] text-brand mt-1">{{ part.unit }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  /** Target moment — Date, ISO string or timestamp */
  to:    { type: [Date, String, Number], required: true },
  /** Which units to show, in order: 'days' | 'hours' | 'minutes' | 'seconds' */
  units: { type: Array, default: () => ['days', 'hours', 'minutes'] },
  label: { type: String, default: null },
  /** 'sm' (52px tiles) | 'md' (60px tiles) */
  size:  { type: String, default: 'md' },
  align: { type: String, default: 'start' },
})

const now = ref(Date.now())
let timer = null

function start() {
  clearInterval(timer)
  const tick = props.units.includes('seconds') ? 1000 : 30_000
  timer = setInterval(() => { now.value = Date.now() }, tick)
}
onMounted(start)
onUnmounted(() => clearInterval(timer))
watch(() => props.units, start)

const LABELS = { days: 'DAYS', hours: 'HRS', minutes: 'MIN', seconds: 'SEC' }

const remaining = computed(() => Math.max(0, new Date(props.to).getTime() - now.value))

const parts = computed(() => {
  const s = Math.floor(remaining.value / 1000)
  const values = {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
  return props.units.map((u) => ({ unit: LABELS[u], value: String(values[u]).padStart(2, '0') }))
})

const ariaText = computed(() => parts.value.map((p) => `${p.value} ${p.unit.toLowerCase()}`).join(', ') + ' remaining')
</script>
