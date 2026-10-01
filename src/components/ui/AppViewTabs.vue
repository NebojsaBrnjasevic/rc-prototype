<template>
  <div class="flex border-b border-gray-200 dark:border-gray-700">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      class="px-4 py-2.5 text-sm font-medium flex items-center gap-2 border-b-2 -mb-px transition-colors cursor-pointer"
      :class="modelValue === tab.value
        ? 'border-brand-400 text-brand-400'
        : 'border-transparent text-subtle hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'"
      @click="$emit('update:modelValue', tab.value)"
    >
      <span v-if="tab.icon">{{ tab.icon }}</span>
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, required: true },
  tabs:       { type: Array,  required: true },
})
defineEmits(['update:modelValue'])
</script>
