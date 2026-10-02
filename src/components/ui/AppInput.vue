<template>
  <div :class="['relative flex items-center', wrapperClass]">
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
        aria-label="Clear" class="text-fg-muted hover:text-fg transition-colors">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <slot name="trailing" />
    </span>
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue'

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
  /** Classes for the wrapper (class/attrs go to the <input>) */
  wrapperClass: { type: [String, Array, Object], default: '' },
})

defineEmits(['update:modelValue', 'blur', 'focus'])

const slots = useSlots()

const inputClasses = computed(() => {
  return [
    'w-full rounded-control border bg-surface-2 text-fg',
    'placeholder:text-fg-muted',
    'transition-all duration-150 outline-none',
    'focus:ring-2 focus:ring-brand focus:border-brand',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'read-only:bg-surface-1 read-only:cursor-default',

    // Size
    {
      sm: 'h-8 px-3 text-sm',
      md: 'h-11 px-3 text-sm',
      lg: 'h-12 px-4 text-base',
    }[props.size] ?? 'h-11 px-3 text-sm',

    // Error vs normal border
    props.error
      ? 'border-danger focus:ring-danger focus:border-danger'
      : 'border-line',

    // Room for absolutely-positioned leading / trailing slots
    slots.leading ? 'pl-10' : '',
    slots.trailing || props.clearable ? 'pr-10' : '',
  ]
})
</script>
