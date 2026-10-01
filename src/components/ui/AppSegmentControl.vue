<template>
  <div class="inline-flex rounded-full bg-gray-100 dark:bg-surface-dark-overlay p-0.5 gap-0.5">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="rounded-full px-4 py-1.5 text-sm cursor-pointer transition-all"
      :class="modelValue === opt.value
        ? 'bg-white dark:bg-surface-dark-base shadow-sm text-gray-900 dark:text-white font-medium'
        : 'text-subtle hover:text-gray-700 dark:hover:text-gray-300'"
      @click="$emit('update:modelValue', opt.value)"
    >
      <span v-if="opt.icon" class="mr-1">{{ opt.icon }}</span>{{ opt.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { required: true },
  options:    { type: Array, required: true },
  size:       { type: String, default: 'md' },
})
defineEmits(['update:modelValue'])
</script>
