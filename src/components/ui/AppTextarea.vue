<template>
  <textarea
    v-bind="$attrs"
    :value="modelValue"
    :rows="rows"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="[
      'w-full rounded-control border bg-surface-2 text-fg text-sm px-3 py-2.5 leading-relaxed',
      'placeholder:text-fg-muted outline-none transition-all duration-150',
      'focus:ring-2 focus:ring-brand focus:border-brand',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      resize ? 'resize-y' : 'resize-none',
      error ? 'border-danger focus:ring-danger focus:border-danger' : 'border-line',
    ]"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
defineOptions({ inheritAttrs: false })

/** Multi-line text field — same look as AppInput. */
defineProps({
  modelValue:  { type: String,  default: '' },
  rows:        { type: Number,  default: 4 },
  placeholder: { type: String,  default: '' },
  error:       { type: Boolean, default: false },
  disabled:    { type: Boolean, default: false },
  resize:      { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
</script>
