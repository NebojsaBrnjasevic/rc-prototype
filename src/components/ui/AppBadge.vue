<template>
  <span :class="classes">
    <span v-if="dot" class="w-1.5 h-1.5 rounded-full bg-current mr-1.5" aria-hidden="true" />
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /**
   * Semantic color:
   * 'success' | 'warning' | 'danger' | 'brand' | 'neutral' | 'reward'
   */
  color: {
    type: String,
    default: 'neutral',
  },
  /** Show a leading dot indicator */
  dot: Boolean,
  /** Pill-shaped (fully rounded) vs slightly rounded */
  pill: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
    default: 'sm', // 'xs' | 'sm' | 'md'
  },
})

const colorMap = {
  success: 'bg-success/10 text-success border-success/20 dark:bg-success/20 dark:border-success/30',
  warning: 'bg-warning/10 text-warning border-warning/20 dark:bg-warning/20 dark:border-warning/30',
  danger:  'bg-danger/10 text-danger border-danger/20 dark:bg-danger/20 dark:border-danger/30',
  brand:   'bg-brand-400/10 text-brand-400 border-brand-400/20 dark:bg-brand-400/20 dark:border-brand-400/30',
  neutral: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-surface-dark-overlay dark:text-gray-300 dark:border-surface-dark-border',
  reward:  'bg-reward/10 text-reward border-reward/20 dark:bg-reward/20 dark:border-reward/30',
}

const sizeMap = {
  xs: 'text-2xs px-1.5 py-0.5',
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
}

const classes = computed(() => [
  'inline-flex items-center border font-medium',
  props.pill ? 'rounded-full' : 'rounded-md',
  colorMap[props.color] ?? colorMap.neutral,
  sizeMap[props.size] ?? sizeMap.sm,
])
</script>
