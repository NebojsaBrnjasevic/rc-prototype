<template>
  <label
    :class="['inline-flex items-start gap-2.5 cursor-pointer select-none group', disabled && 'opacity-50 cursor-not-allowed']"
  >
    <span class="relative flex-shrink-0 mt-0.5">
      <input
        type="checkbox"
        class="sr-only"
        :checked="modelValue"
        :disabled="disabled"
        :indeterminate="indeterminate"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <span
        :class="[
          'flex items-center justify-center rounded border-2 transition-all duration-150',
          sizeMap[size],
          modelValue || indeterminate
            ? 'bg-brand-400 border-brand-400'
            : 'bg-white dark:bg-surface-dark-overlay border-gray-300 dark:border-surface-dark-border group-hover:border-brand-400',
        ]"
      >
        <!-- Check -->
        <svg v-if="modelValue && !indeterminate" class="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <!-- Indeterminate dash -->
        <svg v-else-if="indeterminate" class="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
          <path d="M2 6h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </span>
    </span>

    <span v-if="$slots.default" class="text-sm text-gray-800 dark:text-gray-200 leading-5">
      <slot />
    </span>
  </label>
</template>

<script setup>
defineProps({
  modelValue:   { type: Boolean, default: false },
  indeterminate:{ type: Boolean, default: false },
  disabled:     { type: Boolean, default: false },
  size:         { type: String,  default: 'md' }, // 'sm' | 'md'
})

defineEmits(['update:modelValue'])

const sizeMap = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4.5 h-4.5',
}
</script>
