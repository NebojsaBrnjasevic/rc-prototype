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
  /** 'primary' | 'secondary' | 'ghost' | 'reward' | 'danger' */
  variant: {
    type: String,
    default: 'primary',
  },
  /** 'sm' | 'md' | 'lg' */
  size: {
    type: String,
    default: 'md',
  },
  /** 'button' | 'a' | a component such as RouterLink (pass `to` as an attribute) */
  tag: {
    type: [String, Object],
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
  'inline-flex items-center justify-center font-bold rounded-control transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page disabled:opacity-50 disabled:cursor-not-allowed select-none',

  // Width
  props.fullWidth ? 'w-full' : '',

  // Size — md is 44px (minimum touch target)
  {
    sm: 'h-9 px-3 text-sm gap-1.5',
    md: 'h-11 px-5 text-[15px] gap-2',
    lg: 'h-12 px-6 text-base gap-2.5',
  }[props.size],

  // Variant — theme-aware tokens, no dark: pairs needed
  {
    // One per screen. Glow only on hover/focus.
    primary:
      'bg-brand text-brand-on font-extrabold hover:bg-brand-hover hover:shadow-glow-brand active:translate-y-px',
    secondary:
      'bg-surface-2 border border-line text-fg hover:bg-surface-3',
    ghost:
      'text-brand hover:bg-brand/10',
    // Claiming points / bonuses only — gold means reward
    reward:
      'bg-reward-fill text-reward-on font-extrabold hover:brightness-105 active:translate-y-px',
    danger:
      'bg-danger text-white hover:bg-danger-dark active:opacity-90',
  }[props.variant],
])
</script>
