<template>
  <div class="flex flex-col gap-1.5 w-full">
    <div v-if="showLabels" class="flex items-baseline justify-between gap-2 text-[13px] font-bold">
      <span class="text-reward">Level {{ level }}</span>
      <span class="text-fg-2 tabular">{{ current.toLocaleString() }} / {{ max.toLocaleString() }} XP</span>
    </div>
    <div
      :class="['w-full rounded-full overflow-hidden bg-reward-fill/15', { sm: 'h-1.5', md: 'h-2.5' }[size]]"
      role="progressbar"
      :aria-valuenow="pct"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="`Level ${level} progress`"
    >
      <div class="h-full rounded-full bg-reward-fill transition-all duration-500" :style="{ width: `${pct}%` }" />
    </div>
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

/** Level progress — gold, because XP is a reward. Feed it from auth.levelInfo. */
const props = defineProps({
  level:      { type: Number, required: true },
  /** 0–100 progress inside the current level */
  value:      { type: Number, required: true },
  /** Lifetime points (shown in the label) */
  current:    { type: Number, default: 0 },
  /** Points needed for the next level */
  max:        { type: Number, default: 0 },
  showLabels: { type: Boolean, default: true },
  /** 'sm' | 'md' */
  size:       { type: String, default: 'md' },
})

const pct = computed(() => Math.max(0, Math.min(100, Math.round(props.value))))
</script>
