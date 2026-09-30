<template>
  <div class="card p-5 flex flex-col gap-3 min-w-0">
    <!-- Header row -->
    <div class="flex items-center justify-between">
      <p class="text-overline text-subtle truncate">{{ label }}</p>
      <div
        v-if="icon"
        class="w-8 h-8 rounded-lg flex items-center justify-center text-brand-400 bg-brand-400/10 flex-shrink-0"
      >
        <component :is="icon" class="w-4 h-4" />
      </div>
    </div>

    <!-- Value -->
    <div class="flex items-end gap-2">
      <span class="text-2xl font-bold text-gray-900 dark:text-white leading-none tabular-nums">
        {{ value ?? '—' }}
      </span>
      <span v-if="suffix" class="text-sm text-subtle mb-0.5">{{ suffix }}</span>
    </div>

    <!-- Sub-label / trend -->
    <p v-if="sublabel" class="text-xs text-subtle truncate">{{ sublabel }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], default: null },
  suffix: { type: String, default: null },
  sublabel: { type: String, default: null },
  /** Vue component (e.g. a heroicon) */
  icon: { type: [Object, Function], default: null },
})
</script>
