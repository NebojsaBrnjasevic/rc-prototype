<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    :class="[
      'relative flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-dark-base',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      sizeMap[size].track,
      modelValue ? activeColor : 'bg-gray-200 dark:bg-surface-dark-border',
    ]"
    @click="!disabled && $emit('update:modelValue', !modelValue)"
  >
    <span
      :class="[
        'absolute rounded-full bg-white shadow transition-transform duration-200',
        sizeMap[size].thumb,
        modelValue ? sizeMap[size].on : sizeMap[size].off,
      ]"
    />
  </button>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  size:       { type: String,  default: 'md' }, // 'sm' | 'md' | 'lg'
  disabled:   { type: Boolean, default: false },
  /** Tailwind bg class when active — defaults to brand cyan */
  activeColor: { type: String, default: 'bg-brand-400' },
})

defineEmits(['update:modelValue'])

const sizeMap = {
  sm: { track: 'w-8 h-4',   thumb: 'top-0.5 w-3 h-3',   off: 'left-0.5',  on: 'left-4.5' },
  md: { track: 'w-11 h-6',  thumb: 'top-1 w-4 h-4',     off: 'left-1',    on: 'left-6'   },
  lg: { track: 'w-14 h-7',  thumb: 'top-1 w-5 h-5',     off: 'left-1',    on: 'left-8'   },
}
</script>
