<template>
  <div :class="['flex flex-col items-center justify-center text-center py-12 px-6', compact && 'py-6']">
    <!-- Icon -->
    <div v-if="$slots.icon || icon" class="mb-4">
      <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-surface-dark-overlay flex items-center justify-center mx-auto">
        <slot name="icon">
          <component :is="icon" class="w-6 h-6 text-subtle" />
        </slot>
      </div>
    </div>

    <!-- Title -->
    <p class="text-sm font-semibold text-gray-900 dark:text-white mb-1">{{ title }}</p>

    <!-- Description -->
    <p v-if="description" class="text-sm text-subtle max-w-xs">{{ description }}</p>

    <!-- Action slot -->
    <div v-if="$slots.action" class="mt-4">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title:       { type: String, required: true },
  description: { type: String, default: null },
  icon:        { type: [Object, Function], default: null },
  compact:     { type: Boolean, default: false },
})
</script>
