<template>
  <div class="w-full">
    <div v-if="label || showValue" class="flex items-center justify-between mb-1.5">
      <span v-if="label" class="text-xs text-subtle">{{ label }}</span>
      <span v-if="showValue" class="text-xs font-medium text-gray-700 dark:text-gray-300 tabular-nums">
        {{ Math.round(clampedValue) }}%
      </span>
    </div>
    <div
      :class="['w-full rounded-full overflow-hidden', trackClass]"
      role="progressbar"
      :aria-valuenow="clampedValue"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        :class="['h-full rounded-full transition-all duration-500 ease-out', fillClass]"
        :style="{ width: `${clampedValue}%` }"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** 0–100 */
  value: { type: Number, default: 0 },
  label: { type: String, default: null },
  showValue: Boolean,
  /** 'sm' | 'md' | 'lg' */
  size: { type: String, default: 'md' },
  /** 'brand' | 'success' | 'warning' | 'reward' */
  color: { type: String, default: 'brand' },
})

const clampedValue = computed(() => Math.max(0, Math.min(100, props.value)))

const trackClass = computed(() => ({
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}[props.size] + ' bg-gray-200 dark:bg-surface-dark-overlay'))

const fillClass = computed(() => ({
  brand: 'bg-brand-400',
  success: 'bg-success',
  warning: 'bg-warning',
  reward: 'bg-reward',
}[props.color] ?? 'bg-brand-400'))
</script>
