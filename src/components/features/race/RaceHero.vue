<template>
  <!-- Front-and-centre card: where you are in the race and what it takes to move up.
       The only card on the page that gets this treatment. -->
  <section
    aria-labelledby="hero-title"
    class="relative isolate overflow-hidden rounded-panel border border-brand/40 bg-surface-1 p-6 sm:p-8 shadow-[0_30px_80px_-40px_rgb(var(--rc-brand)/0.75)]"
  >
    <!-- Gradient mesh + soft light -->
    <span class="absolute -z-10 -left-24 -top-32 w-[520px] h-[420px] rounded-full bg-[radial-gradient(closest-side,rgb(var(--rc-brand)/0.30),transparent)]" aria-hidden="true" />
    <span class="absolute -z-10 right-[-120px] bottom-[-180px] w-[560px] h-[460px] rounded-full bg-[radial-gradient(closest-side,rgb(var(--rc-presales)/0.26),transparent)]" aria-hidden="true" />
    <span class="absolute -z-10 inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/70 to-transparent" aria-hidden="true" />

    <div class="grid grid-cols-1 lg:grid-cols-[auto_minmax(0,1fr)_auto] gap-6 lg:gap-10 items-center">
      <!-- Position -->
      <div class="flex items-end gap-4">
        <div>
          <p class="text-overline text-fg-2">Your position · {{ race.current.thisLabel }}</p>
          <h2 id="hero-title" class="sr-only">Your race position</h2>
          <p class="flex items-baseline gap-2 mt-1">
            <span
              :class="[
                'font-display font-bold tabular leading-[0.9] tracking-tight text-[76px] sm:text-[92px]',
                !me ? 'text-fg-muted/60'
                : 'bg-gradient-to-br from-brand to-presales bg-clip-text text-transparent drop-shadow-[0_6px_24px_rgb(var(--rc-brand)/0.35)]',
              ]"
            >P{{ me ? me.rank : '?' }}</span>
            <span class="text-lg font-bold text-fg-muted">/ {{ race.standings.length || '—' }}</span>
          </p>
          <p class="text-sm text-fg-2 mt-2">
            <span class="font-extrabold text-fg tabular">{{ (me?.points ?? 0).toLocaleString() }}</span> pts ·
            <span class="font-extrabold text-fg tabular">{{ me?.activities ?? 0 }}</span> {{ (me?.activities ?? 0) === 1 ? 'activity' : 'activities' }}
          </p>
        </div>
      </div>

      <!-- Next move -->
      <div class="min-w-0 lg:border-l lg:border-line lg:pl-10">
        <p class="text-[22px] sm:text-[26px] font-display font-bold leading-tight tracking-tight">
          <template v-if="target">
            <span class="text-brand">{{ gap.toLocaleString() }} pts</span>
            to pass {{ firstName(target.name) }} for P{{ target.rank }}
          </template>
          <template v-else-if="me">You're leading — {{ lead.toLocaleString() }} pts clear</template>
          <template v-else>One activity puts you on the board</template>
        </p>

        <!-- Progress towards the next place -->
        <div class="mt-4 h-2.5 rounded-full bg-surface-3 overflow-hidden" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100" aria-label="Progress to the next place">
          <div
            class="h-full rounded-full transition-[width] duration-700 ease-out bg-gradient-to-r from-brand to-presales shadow-[0_0_16px_rgb(var(--rc-brand)/0.8)]"
            :style="{ width: `${progress}%` }"
          />
        </div>

        <!-- What that takes, per record type -->
        <div class="flex flex-wrap items-center gap-2 mt-4">
          <span class="text-[13px] text-fg-muted">{{ target ? 'Any one of:' : me ? 'Stay ahead with:' : 'Start with:' }}</span>
          <span
            v-for="opt in moves"
            :key="opt.type"
            class="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-surface-2/80 border border-line text-[13px] font-bold"
          >
            <span :class="['w-2 h-2 rounded-full', opt.dot]" aria-hidden="true" />
            {{ opt.count }} × {{ opt.type }}
          </span>
        </div>
      </div>

      <!-- Clock + action -->
      <div class="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-end justify-between gap-4">
        <AppCountdown :to="race.current.end" label="Race ends in" size="sm" align="end" class="max-sm:!items-start" />
        <AppButton size="lg" class="max-sm:w-full shadow-glow-brand" @click="$emit('log')">
          <PlusIcon class="w-5 h-5 stroke-[2.5]" />Log activity
        </AppButton>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useRaceStore } from '@/stores/useRaceStore'
import { POINTS } from '@/stores/useActivityStore'
import AppButton from '@/components/ui/AppButton.vue'
import AppCountdown from '@/components/ui/AppCountdown.vue'

defineEmits(['log'])

const race = useRaceStore()
const me = computed(() => race.me)
const target = computed(() => race.nextTarget)

const firstName = (name) => name.split(' ')[0]

/** Points needed to overtake (strictly more than the target). */
const gap = computed(() => (target.value && me.value ? target.value.points - me.value.points + 1 : 0))
const lead = computed(() => (me.value && race.standings[1] ? me.value.points - race.standings[1].points : me.value?.points ?? 0))

const progress = computed(() => {
  if (!me.value) return 0
  if (!target.value) return 100
  return Math.min(99, Math.round((me.value.points / target.value.points) * 100))
})

const DOTS = { Sales: 'bg-sales', 'Pre-Sales': 'bg-presales', Marketing: 'bg-marketing' }
const moves = computed(() => {
  const need = target.value ? gap.value : POINTS.Sales
  return Object.entries(POINTS).map(([type, pts]) => ({
    type,
    dot: DOTS[type],
    count: Math.max(1, Math.ceil(need / pts)),
  }))
})
</script>
