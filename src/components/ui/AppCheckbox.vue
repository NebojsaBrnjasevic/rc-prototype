<template>
  <label
    :class="['inline-flex items-start gap-2.5 cursor-pointer select-none group', disabled && 'opacity-50 cursor-not-allowed']"
  >
    <span class="relative flex-shrink-0 mt-0.5">
      <input
        type="checkbox"
        class="sr-only peer"
        :checked="modelValue"
        :disabled="disabled"
        :indeterminate="indeterminate"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <span
        :class="[
          'flex items-center justify-center rounded-md border-2 transition-all duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-page',
          sizeMap[size],
          modelValue || indeterminate
            ? 'bg-brand border-brand text-brand-on'
            : 'bg-surface-2 border-line group-hover:border-brand',
        ]"
      >
        <!-- Check -->
        <svg v-if="modelValue && !indeterminate" class="w-3 h-3" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <!-- Indeterminate dash -->
        <svg v-else-if="indeterminate" class="w-3 h-3" viewBox="0 0 12 12" fill="none">
          <path d="M2 6h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </span>
    </span>

    <span v-if="$slots.default" class="text-sm text-fg leading-5">
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
