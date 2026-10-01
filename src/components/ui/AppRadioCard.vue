<template>
  <div
    class="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all select-none"
    :class="[
      isSelected
        ? 'border-brand-400 bg-brand-400/[0.04] dark:bg-brand-400/[0.07]'
        : disabled
          ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark-overlay opacity-50 cursor-not-allowed'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 bg-white dark:bg-surface-dark-overlay',
    ]"
    @click="!disabled && $emit('update:modelValue', value)"
  >
    <!-- Icon square -->
    <div
      class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
      :class="iconBgClass"
    >
      <slot name="icon" />
    </div>

    <!-- Text -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ label }}</p>
      <p v-if="description" class="text-xs text-subtle mt-0.5">{{ description }}</p>
    </div>

    <!-- Radio -->
    <div
      class="w-5 h-5 rounded-full border-2 flex-shrink-0 ml-auto flex items-center justify-center"
      :class="isSelected ? 'border-brand-400' : 'border-gray-300 dark:border-gray-600'"
    >
      <div v-if="isSelected" class="w-2.5 h-2.5 rounded-full bg-brand-400" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue:  { default: null },
  value:       { required: true },
  label:       { type: String,  required: true },
  description: { type: String,  default: '' },
  color:       { type: String,  default: 'brand' },
  disabled:    { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

const isSelected = computed(() => props.modelValue === props.value)

const iconBgMap = {
  brand:    'bg-brand-400/15 text-brand-400',
  presales: 'bg-[#A78BFA]/15 text-[#A78BFA]',
  success:  'bg-success/15 text-success',
  reward:   'bg-reward/15 text-reward',
  warning:  'bg-warning/15 text-warning',
  danger:   'bg-danger/15 text-danger',
}
const iconBgClass = computed(() => iconBgMap[props.color] ?? iconBgMap.brand)
</script>
