<template>
  <div class="rounded-card p-6 bg-reward-fill/[0.07] border border-reward-fill/30 flex flex-col gap-4 min-h-[220px]">
    <div class="flex items-start justify-between gap-4">
      <p class="text-overline text-reward">Leading {{ thisLabel }}</p>
      <span class="w-12 h-12 rounded-[14px] bg-reward-fill text-reward-on flex items-center justify-center flex-shrink-0" aria-hidden="true">
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 12H5L3 7z" /><path d="M5 19h14" />
        </svg>
      </span>
    </div>

    <template v-if="leader">
      <div class="flex items-center gap-3.5 min-w-0">
        <span class="w-14 h-14 rounded-[18px] border-2 border-reward-fill bg-reward-fill/10 text-reward font-display font-bold text-[17px] flex items-center justify-center flex-shrink-0">
          {{ initials(leader.name) }}
        </span>
        <div class="min-w-0">
          <p class="text-xl font-extrabold truncate">
            {{ leader.name }}<span v-if="leader.isMe" class="text-brand"> (you)</span>
          </p>
          <p class="text-sm text-fg-2">
            {{ leader.activities }} {{ leader.activities === 1 ? 'activity' : 'activities' }} · Level {{ leader.level }}
          </p>
        </div>
      </div>
      <div class="mt-auto flex items-end justify-between gap-4">
        <p class="font-display font-bold text-num-xl text-reward tabular whitespace-nowrap">
          {{ leader.points.toLocaleString() }}<span class="text-base text-reward/70"> pts</span>
        </p>
        <p class="text-sm text-reward/80 text-right max-w-[220px]">
          <template v-if="runnerUp">Ahead of {{ runnerUp.name }} by {{ (leader.points - runnerUp.points).toLocaleString() }} pts</template>
          <template v-else>Currently setting the pace</template>
        </p>
      </div>
    </template>

    <p v-else class="mt-auto text-sm text-fg-2">Nobody has scored {{ thisLabel }} yet. The first activity takes the lead.</p>
  </div>
</template>

<script setup>
defineProps({
  /** Standing row of the leader, or null when nobody has scored */
  leader:    { type: Object, default: null },
  /** Standing row of P2, used for the "ahead by" note */
  runnerUp:  { type: Object, default: null },
  /** e.g. 'this week' */
  thisLabel: { type: String, required: true },
})

const initials = (name) => name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
</script>
