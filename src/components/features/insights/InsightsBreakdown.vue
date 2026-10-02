<template>
  <section aria-labelledby="mix-title" class="card p-6 flex flex-col gap-5">
    <div>
      <p class="text-overline text-fg-2">Breakdown</p>
      <h3 id="mix-title" class="font-display font-semibold text-xl mt-1">By type & status</h3>
    </div>

    <!-- Type mix -->
    <div class="flex flex-col gap-3">
      <div class="flex h-3 rounded-full overflow-hidden gap-[3px] bg-surface-3" aria-hidden="true">
        <span v-for="t in types" v-show="t.count" :key="t.type" :class="TYPE[t.type].bar" :style="{ flexGrow: t.count }" />
      </div>
      <ul class="space-y-2">
        <li v-for="t in types" :key="t.type" class="flex items-center justify-between text-sm">
          <span class="flex items-center gap-2 text-fg-2"><span :class="['w-2.5 h-2.5 rounded-[3px]', TYPE[t.type].bar]" />{{ t.type }}</span>
          <span class="font-extrabold tabular">{{ t.count }}</span>
        </li>
      </ul>
    </div>

    <!-- Status -->
    <div class="grid grid-cols-2 gap-3 mt-auto">
      <div class="rounded-2xl bg-success/[0.08] border border-success/25 p-4">
        <p class="font-display font-bold text-[28px] leading-none text-success tabular">{{ status.completed }}</p>
        <p class="text-[13px] font-bold text-fg-2 mt-2">Completed</p>
      </div>
      <div class="rounded-2xl bg-brand/[0.08] border border-brand/25 p-4">
        <p class="font-display font-bold text-[28px] leading-none text-brand tabular">{{ status.upcoming }}</p>
        <p class="text-[13px] font-bold text-fg-2 mt-2">Upcoming</p>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  /** [{ type, count }] from useInsightsStore().byType */
  types:  { type: Array, required: true },
  /** { completed, upcoming } from useInsightsStore().byStatus */
  status: { type: Object, required: true },
})

const TYPE = {
  Sales: { bar: 'bg-sales' },
  'Pre-Sales': { bar: 'bg-presales' },
  Marketing: { bar: 'bg-marketing' },
}
</script>
