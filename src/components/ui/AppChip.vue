<template>
  <span
    class="inline-flex items-center gap-1 border font-bold"
    :class="[sizeClasses, variantClasses]"
  >
    <!-- dot -->
    <span v-if="dot" class="rounded-full flex-shrink-0" :class="dotClasses" style="width:6px;height:6px" />
    {{ label }}
    <!-- count -->
    <span v-if="count != null" class="ml-0.5 text-xs opacity-75 font-bold tabular">{{ count }}</span>
    <!-- remove -->
    <button
      v-if="removable"
      type="button"
      class="ml-0.5 flex-shrink-0 hover:opacity-75 transition-opacity leading-none"
      @click.stop="$emit('remove')"
      :aria-label="`Remove ${label}`"
    >×</button>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label:    { type: String,  required: true },
  variant:  { type: String,  default: 'default' },
  size:     { type: String,  default: 'md' },
  removable:{ type: Boolean, default: false },
  dot:      { type: Boolean, default: false },
  count:    { type: Number,  default: null },
})

defineEmits(['remove'])

const sizeClasses = computed(() =>
  props.size === 'sm'
    ? 'text-xs px-2 py-0.5 rounded-full'
    : 'text-sm px-3 py-1 rounded-full'
)

const variantMap = {
  default:  'border-line bg-surface-2 text-fg-2',
  brand:    'border-brand/30 bg-brand/10 text-brand',
  success:  'border-success/30 bg-success/10 text-success',
  warning:  'border-warning/30 bg-warning/10 text-warning',
  danger:   'border-danger/30 bg-danger/10 text-danger',
  presales: 'border-presales/30 bg-presales/10 text-presales',
  reward:   'border-reward-fill/30 bg-reward-fill/10 text-reward',
}
const variantClasses = computed(() => variantMap[props.variant] ?? variantMap.default)

const dotColorMap = {
  default:  'bg-fg-muted',
  brand:    'bg-brand',
  success:  'bg-success',
  warning:  'bg-warning',
  danger:   'bg-danger',
  presales: 'bg-presales',
  reward:   'bg-reward-fill',
}
const dotClasses = computed(() => dotColorMap[props.variant] ?? dotColorMap.default)
</script>
