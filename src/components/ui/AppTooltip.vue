<template>
  <div class="relative inline-flex group">
    <slot />
    <div
      role="tooltip"
      :class="[
        'absolute z-50 px-2 py-1 text-xs font-medium rounded-lg whitespace-nowrap pointer-events-none',
        'bg-gray-900 text-white dark:bg-gray-700',
        'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
        positionClass,
      ]"
    >
      {{ text }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  /** 'top' | 'bottom' | 'left' | 'right' */
  position: { type: String, default: 'top' },
})

const positionClass = computed(() => ({
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}[props.position] ?? 'bottom-full left-1/2 -translate-x-1/2 mb-2'))
</script>
