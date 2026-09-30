<template>
  <component
    :is="tag"
    :type="tag === 'button' ? type : undefined"
    :disabled="disabled || loading"
    :class="classes"
    v-bind="$attrs"
  >
    <span v-if="loading" class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" aria-hidden="true" />
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** 'primary' | 'secondary' | 'ghost' | 'danger' */
  variant: {
    type: String,
    default: 'primary',
  },
  /** 'sm' | 'md' | 'lg' */
  size: {
    type: String,
    default: 'md',
  },
  tag: {
    type: String,
    default: 'button',
  },
  type: {
    type: String,
    default: 'button',
  },
  disabled: Boolean,
  loading: Boolean,
  fullWidth: Boolean,
})

const classes = computed(() => [
  // Base
  'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none',

  // Width
  props.fullWidth ? 'w-full' : '',

  // Size
  {
    sm: 'h-8 px-3 text-sm gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2.5',
  }[props.size],

  // Variant — light mode / dark mode via Tailwind dark:
  {
    primary:
      'bg-brand-400 text-white hover:bg-brand-500 active:bg-brand-600 shadow-sm dark:ring-offset-surface-dark-base',
    secondary:
      'bg-surface-light-overlay border border-surface-light-border text-gray-700 hover:bg-gray-100 dark:bg-surface-dark-overlay dark:border-surface-dark-border dark:text-gray-200 dark:hover:bg-surface-dark-overlay/70',
    ghost:
      'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-surface-dark-overlay dark:hover:text-white',
    danger:
      'bg-danger text-white hover:bg-danger-dark active:opacity-90',
  }[props.variant],
])
</script>
