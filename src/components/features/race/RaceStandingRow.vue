<template>
  <div
    :class="[
      'grid grid-cols-[36px_minmax(0,1fr)_auto] gap-3.5 items-center px-3.5 py-2.5 rounded-[14px]',
      row.isMe ? 'bg-brand/10 ring-1 ring-inset ring-brand/40' : 'bg-surface-2',
    ]"
  >
    <span
      :class="['w-9 h-9 rounded-[10px] font-display font-bold text-sm flex items-center justify-center', rankClass]"
      :aria-label="`Rank ${row.rank}`"
    >{{ row.rank }}</span>

    <div class="min-w-0 flex flex-col gap-1.5">
      <div class="flex items-baseline justify-between gap-3">
        <span :class="['text-[15px] font-extrabold truncate', row.isMe ? 'text-brand' : 'text-fg']">
          {{ row.name }}<span v-if="row.isMe"> (you)</span>
        </span>
        <span class="text-xs text-fg-muted whitespace-nowrap hidden sm:inline">
          Lv {{ row.level }} · {{ row.activities }} {{ row.activities === 1 ? 'activity' : 'activities' }}<template v-if="row.gap > 0"> · −{{ row.gap.toLocaleString() }}</template>
        </span>
      </div>
      <span v-if="showBar" class="block h-1 rounded-full bg-surface-3 overflow-hidden" role="presentation">
        <span :class="['block h-full rounded-full', barClass]" :style="{ width: `${Math.max(2, row.share)}%` }" />
      </span>
    </div>

    <span class="text-right font-display font-bold text-base text-reward tabular min-w-[72px]">
      {{ row.points.toLocaleString() }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** { rank, name, level, activities, points, gap, share, isMe? } from useRaceStore */
  row:     { type: Object, required: true },
  /** Bar showing points as a share of the leader's */
  showBar: { type: Boolean, default: true },
})

const PODIUM = {
  1: { rank: 'bg-podium-gold text-[#1F1500]',   bar: 'bg-podium-gold' },
  2: { rank: 'bg-podium-silver text-[#0B1D27]', bar: 'bg-podium-silver' },
  3: { rank: 'bg-podium-bronze text-[#1E0D02]', bar: 'bg-podium-bronze' },
}

const rankClass = computed(() => PODIUM[props.row.rank]?.rank ?? 'bg-surface-3 text-fg-2')
const barClass = computed(() => (props.row.isMe ? 'bg-brand' : PODIUM[props.row.rank]?.bar ?? 'bg-brand/60'))
</script>
