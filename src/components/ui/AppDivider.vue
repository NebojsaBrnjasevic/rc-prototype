<template>
  <div :class="['flex items-center gap-3', vertical ? 'flex-col h-full' : 'flex-row w-full']">
    <span :class="['flex-1 bg-line', vertical ? 'w-px h-full' : 'h-px w-full']" />
    <span v-if="$slots.default" class="flex-shrink-0 text-overline text-fg-muted whitespace-nowrap">
      <slot />
    </span>
    <span v-if="$slots.default" :class="['flex-1 bg-line', vertical ? 'w-px h-full' : 'h-px w-full']" />
  </div>
</template>

<script setup>
defineProps({
  vertical: { type: Boolean, default: false },
})
</script>
