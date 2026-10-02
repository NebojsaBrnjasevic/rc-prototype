<template>
  <!-- text variant -->
  <div v-if="variant === 'text'" class="space-y-2">
    <div
      v-for="i in lines"
      :key="i"
      class="rounded"
      :class="['bg-surface-3', animate && 'animate-pulse']"
      :style="{ height: height, width: i === lines ? '70%' : width }"
    />
  </div>

  <!-- card variant -->
  <div
    v-else-if="variant === 'card'"
    class="rounded-card border border-line bg-surface-1 p-5 space-y-4"
    :class="animate && 'animate-pulse'"
  >
    <!-- header row -->
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-lg bg-surface-3 flex-shrink-0" />
      <div class="flex-1 space-y-2">
        <div class="h-3 rounded bg-surface-3 w-1/2" />
        <div class="h-2.5 rounded bg-surface-3 w-1/3" />
      </div>
    </div>
    <!-- text lines -->
    <div class="space-y-2">
      <div class="h-2.5 rounded bg-surface-3 w-full" />
      <div class="h-2.5 rounded bg-surface-3 w-full" />
      <div class="h-2.5 rounded bg-surface-3 w-4/5" />
    </div>
  </div>

  <!-- circle variant -->
  <div
    v-else-if="variant === 'circle'"
    class="rounded-full bg-surface-3"
    :class="animate && 'animate-pulse'"
    :style="{ width: width, height: height }"
  />

  <!-- rect (default) -->
  <div
    v-else
    class="rounded-lg bg-surface-3"
    :class="animate && 'animate-pulse'"
    :style="{ width: width, height: height }"
  />
</template>

<script setup>
defineProps({
  variant: { type: String,  default: 'rect' },
  width:   { type: String,  default: '100%' },
  height:  { type: String,  default: '16px' },
  lines:   { type: Number,  default: 3 },
  animate: { type: Boolean, default: true },
})
</script>
