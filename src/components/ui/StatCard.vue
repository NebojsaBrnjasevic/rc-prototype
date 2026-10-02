<template>
  <div
    :class="[
      'relative rounded-card border p-5 flex flex-col gap-3 min-w-0',
      tone === 'reward' ? 'bg-reward-fill/[0.06] border-reward-fill/30' : 'bg-surface-1 border-line',
    ]"
  >
    <!-- Header row -->
    <div class="flex items-center justify-between gap-2">
      <p :class="['text-overline truncate', tone === 'reward' ? 'text-reward' : 'text-fg-2']">{{ label }}</p>
      <slot name="badge">
        <span
          v-if="delta !== undefined"
          :class="['h-6 px-2 rounded-md text-xs font-extrabold tabular flex items-center gap-0.5 flex-shrink-0', deltaClass]"
          :title="deltaLabel ?? undefined"
        >
          <template v-if="delta === null">New</template>
          <template v-else>{{ delta > 0 ? '▲' : delta < 0 ? '▼' : '' }} {{ Math.abs(delta) }}%</template>
          <span v-if="deltaLabel" class="sr-only"> {{ deltaLabel }}</span>
        </span>
        <div
          v-else-if="icon"
          :class="[
            'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
            tone === 'reward' ? 'text-reward bg-reward-fill/15' : 'text-brand bg-brand/10',
          ]"
        >
          <component :is="icon" class="w-4 h-4" />
        </div>
      </slot>
    </div>

    <!-- Value -->
    <div class="flex items-end gap-2">
      <span
        :class="[
          'font-display font-bold tabular truncate',
          isText ? 'text-[22px] leading-[40px]' : 'text-num-lg',
          value === null || value === '' ? 'text-fg-muted' : tone === 'reward' ? 'text-reward' : 'text-fg',
        ]"
      >{{ value === null || value === '' ? '—' : value }}</span>
      <span v-if="suffix" class="text-sm text-fg-2 mb-1">{{ suffix }}</span>
    </div>

    <!-- Sub-label / extra content (e.g. progress bar) -->
    <slot />
    <p v-if="sublabel" class="text-[13px] text-fg-muted truncate">{{ sublabel }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], default: null },
  suffix: { type: String, default: null },
  sublabel: { type: String, default: null },
  /** Vue component (e.g. a heroicon) */
  icon: { type: [Object, Function], default: null },
  /** 'default' | 'reward' — reward = gold card, for points/levels only */
  tone: { type: String, default: 'default' },
  /** % change vs the previous period. null = no previous data ("New"). Omit to hide. */
  delta: { type: Number, default: undefined },
  /** Screen-reader / tooltip context for delta, e.g. "vs last week" */
  deltaLabel: { type: String, default: null },
})

const deltaClass = computed(() => {
  if (props.delta === null || props.delta > 0) return 'bg-success/15 text-success'
  if (props.delta < 0) return 'bg-danger/15 text-danger'
  return 'bg-surface-3 text-fg-2'
})

// Words ("Pre-Sales") get a smaller size than numbers so they don't truncate
const isText = computed(() => typeof props.value === 'string' && /[a-z]{2,}/i.test(props.value))
</script>
