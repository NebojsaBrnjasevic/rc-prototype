<template>
  <div class="relative flex items-center">
    <!-- Leading icon -->
    <span v-if="$slots.leading" class="absolute left-3 flex items-center text-subtle pointer-events-none">
      <slot name="leading" />
    </span>

    <input
      v-bind="$attrs"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :class="inputClasses"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />

    <!-- Trailing icon / slot -->
    <span v-if="$slots.trailing || (clearable && modelValue)" class="absolute right-3 flex items-center gap-1">
      <button v-if="clearable && modelValue" type="button" @click="$emit('update:modelValue', '')"
        class="text-subtle hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <slot name="trailing" />
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  type:        { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  size:        { type: String, default: 'md' }, // 'sm' | 'md' | 'lg'
  error:       { type: Boolean, default: false },
  disabled:    { type: Boolean, default: false },
  readonly:    { type: Boolean, default: false },
  clearable:   { type: Boolean, default: false },
})

defineEmits(['update:modelValue', 'blur', 'focus'])

const inputClasses = computed(() => {
  const hasLeading  = !!document.querySelector // deferred — handled via padding variants below
  return [
    'w-full rounded-xl border bg-white dark:bg-surface-dark-overlay text-gray-900 dark:text-white',
    'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    'transition-all duration-150 outline-none',
    'focus:ring-2 focus:ring-brand-400 focus:border-brand-400',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'read-only:bg-gray-50 dark:read-only:bg-surface-dark-raised read-only:cursor-default',

    // Size
    {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-3 text-sm',
      lg: 'h-12 px-4 text-base',
    }[props.size] ?? 'h-10 px-3 text-sm',

    // Error vs normal border
    props.error
      ? 'border-danger focus:ring-danger focus:border-danger'
      : 'border-gray-200 dark:border-surface-dark-border',

    // Padding compensation for slots (always add to be safe; slots are positioned absolute)
    'pl-3',
  ]
})
</script>
