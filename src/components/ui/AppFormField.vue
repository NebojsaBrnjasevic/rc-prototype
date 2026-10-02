<template>
  <div :class="['flex flex-col gap-1.5', fullWidth && 'w-full']">
    <!-- Label row -->
    <div v-if="label || $slots.label" class="flex items-center justify-between">
      <label :for="inputId" class="text-sm font-bold text-fg leading-none">
        <slot name="label">{{ label }}</slot>
        <span v-if="required" class="text-danger ml-0.5" aria-hidden="true">*</span>
      </label>
      <span v-if="$slots.hint || hint" class="text-xs text-fg-muted">
        <slot name="hint">{{ hint }}</slot>
      </span>
    </div>

    <!-- Input slot -->
    <slot :id="inputId" :has-error="!!error" />

    <!-- Error / helper -->
    <p v-if="error" class="text-xs text-danger flex items-center gap-1">
      <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
      </svg>
      {{ error }}
    </p>
    <p v-else-if="helper" class="text-xs text-fg-muted">{{ helper }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label:     { type: String,  default: null },
  hint:      { type: String,  default: null },
  helper:    { type: String,  default: null },
  error:     { type: String,  default: null },
  required:  { type: Boolean, default: false },
  fullWidth: { type: Boolean, default: true },
  /** Pass to auto-wire label[for] — must match your input's id */
  inputId:   { type: String,  default: () => `field-${Math.random().toString(36).slice(2, 7)}` },
})
</script>
