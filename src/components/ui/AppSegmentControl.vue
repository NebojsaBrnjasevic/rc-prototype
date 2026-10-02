<template>
  <div
    role="tablist"
    :aria-label="ariaLabel"
    :class="['inline-flex rounded-control bg-surface-1 border border-line p-1 gap-1', size === 'sm' ? 'h-9' : 'h-11']"
  >
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      role="tab"
      :aria-selected="modelValue === opt.value"
      class="rounded-[9px] px-3.5 text-sm font-bold cursor-pointer transition-colors flex items-center gap-1.5"
      :class="modelValue === opt.value
        ? 'bg-surface-3 text-fg'
        : 'text-fg-2 hover:text-fg'"
      @click="$emit('update:modelValue', opt.value)"
    >
      <component v-if="opt.icon && typeof opt.icon !== 'string'" :is="opt.icon" class="w-4 h-4" />
      <span v-else-if="opt.icon">{{ opt.icon }}</span>
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { required: true },
  /** [{ value, label, icon? }] — icon can be a component or a string */
  options:    { type: Array, required: true },
  /** 'sm' (36px) | 'md' (44px) */
  size:       { type: String, default: 'md' },
  ariaLabel:  { type: String, default: null },
})
defineEmits(['update:modelValue'])
</script>
