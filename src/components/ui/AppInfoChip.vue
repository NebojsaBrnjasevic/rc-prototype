<template>
  <span
    class="inline-flex items-center gap-1 rounded-full border font-bold"
    :class="[sizeClasses, variantClasses]"
  >
    <span v-if="arrowChar" class="opacity-75">{{ arrowChar }}</span>
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label:     { type: String, required: true },
  direction: { type: String, default: 'right' },
  variant:   { type: String, default: 'default' },
  size:      { type: String, default: 'sm' },
})

const arrowMap = { up: '↗', down: '↘', right: '↝', none: '' }
const arrowChar = computed(() => arrowMap[props.direction] ?? '')

const sizeClasses = computed(() =>
  props.size === 'md' ? 'text-xs px-3 py-1' : 'text-xs px-2 py-0.5'
)

const variantMap = {
  default: 'border-line bg-surface-2 text-fg-2',
  brand:   'border-brand/30 bg-brand/10 text-brand',
  success: 'border-success/30 bg-success/10 text-success',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  danger:  'border-danger/30 bg-danger/10 text-danger',
}
const variantClasses = computed(() => variantMap[props.variant] ?? variantMap.default)
</script>
