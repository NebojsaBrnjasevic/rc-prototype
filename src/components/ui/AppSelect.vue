<template>
  <div class="relative">
    <select
      v-bind="$attrs"
      :value="modelValue"
      :disabled="disabled"
      :class="[
        'w-full appearance-none rounded-control border bg-surface-2',
        'text-fg text-sm font-semibold pr-9 outline-none cursor-pointer',
        'transition-all duration-150',
        'focus:ring-2 focus:ring-brand focus:border-brand',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        error
          ? 'border-danger focus:ring-danger'
          : 'border-line',
        sizeMap[size],
      ]"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-if="placeholder" value="" disabled :selected="!modelValue">{{ placeholder }}</option>
      <option v-for="opt in normalizedOptions" :key="opt.value" :value="opt.value" :disabled="opt.disabled">
        {{ opt.label }}
      </option>
    </select>

    <!-- Chevron -->
    <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-subtle">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
      </svg>
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue:  { type: [String, Number], default: '' },
  /**
   * Options: string[] | { label, value, disabled? }[]
   */
  options:     { type: Array, default: () => [] },
  placeholder: { type: String, default: null },
  size:        { type: String, default: 'md' }, // 'sm' | 'md' | 'lg'
  error:       { type: Boolean, default: false },
  disabled:    { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

const sizeMap = {
  sm: 'h-8 pl-3 text-xs',
  md: 'h-11 pl-3 text-sm',
  lg: 'h-12 pl-4 text-base',
}

const normalizedOptions = computed(() =>
  props.options.map(o =>
    typeof o === 'string' ? { label: o, value: o } : o
  )
)
</script>
