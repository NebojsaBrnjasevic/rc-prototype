<template>
  <div :class="['flex flex-col items-center justify-center text-center py-12 px-6', compact && 'py-6']">
    <!-- Icon -->
    <div v-if="$slots.icon || icon" class="mb-4">
      <div class="w-14 h-14 rounded-2xl bg-surface-2 border border-line flex items-center justify-center mx-auto">
        <slot name="icon">
          <component :is="icon" class="w-6 h-6 text-brand" />
        </slot>
      </div>
    </div>

    <!-- Title -->
    <p class="text-[17px] font-extrabold text-fg mb-1">{{ title }}</p>

    <!-- Description -->
    <p v-if="description" class="text-sm text-fg-2 max-w-sm">{{ description }}</p>

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
