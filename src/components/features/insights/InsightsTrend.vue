<template>
  <section aria-labelledby="trend-title" class="relative card p-6 flex flex-col gap-5">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-overline text-fg-2">Activity trend</p>
        <h3 id="trend-title" class="font-display font-semibold text-xl mt-1">{{ title }}</h3>
      </div>
      <p class="font-mono text-[13px] text-fg-2 whitespace-nowrap">{{ total }} total</p>
    </div>

    <!-- Bars (div-based so they follow theme tokens). Screen readers get the table below. -->
    <div
      class="grid gap-2 sm:gap-3 items-end h-[200px] pb-7 relative"
      :style="{ gridTemplateColumns: `repeat(${buckets.length}, minmax(0, 1fr))` }"
      aria-hidden="true"
    >
      <div v-for="b in buckets" :key="b.label" class="relative h-full flex flex-col items-center justify-end gap-1.5">
        <span v-if="b.count" :class="['text-xs font-extrabold tabular', b.isCurrent ? 'text-brand' : 'text-fg-2']">{{ b.count }}</span>
        <div
          :class="[
            'w-full max-w-[56px] rounded-t-[10px] rounded-b-[4px] transition-all duration-500',
            b.isFuture ? 'bg-surface-2 border border-dashed border-line' : b.isCurrent ? 'bg-brand' : b.count ? 'bg-brand/35' : 'bg-surface-3',
          ]"
          :style="{ height: b.isFuture ? '12px' : `${Math.max(b.count ? 8 : 4, b.height)}%` }"
        />
        <span :class="['absolute -bottom-6 text-xs font-bold', b.isCurrent ? 'text-fg' : 'text-fg-muted']">{{ b.label }}</span>
      </div>
    </div>

    <table class="sr-only">
      <caption>{{ title }}</caption>
      <tr v-for="b in buckets" :key="b.label"><th scope="row">{{ b.label }}</th><td>{{ b.isFuture ? 'upcoming' : b.count }}</td></tr>
    </table>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** From useInsightsStore().trend */
  buckets: { type: Array, required: true },
  title:   { type: String, required: true },
})

const total = computed(() => props.buckets.reduce((s, b) => s + b.count, 0))
</script>
