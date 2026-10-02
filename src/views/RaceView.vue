<template>
  <AppLayout>
    <!-- Header: title · period switch -->
    <div class="flex flex-col gap-4 mb-6">
      <h1 class="font-display font-bold text-[32px] sm:text-[40px] tracking-tight">Standings</h1>
      <AppPeriodTabs
        class="max-w-3xl"
        aria-label="Race period"
        :model-value="race.period"
        :tabs="tabs"
        @update:model-value="race.setPeriod"
      />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-5 items-start">
      <div class="flex flex-col gap-4 min-w-0">
        <!-- Podium: P2 · P1 · P3 -->
        <section v-if="race.standings.length" aria-label="Podium" class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div
            v-for="p in podium"
            :key="p.rank"
            :class="[
              'rounded-panel p-6 bg-surface-1 border flex flex-col items-center justify-end gap-2.5 text-center',
              p.rank === 1 ? 'sm:min-h-[340px] border-reward-fill/50 shadow-glow-reward sm:order-2' : 'sm:min-h-[290px]',
              p.rank === 2 ? 'sm:order-1' : '', p.rank === 3 ? 'sm:order-3' : '',
              p.row?.isMe ? 'border-brand/60' : p.rank !== 1 ? 'border-line' : '',
            ]"
          >
            <template v-if="p.row">
              <span :class="['w-[72px] h-[72px] rounded-[22px] bg-surface-3 border-[3px] font-display font-bold text-xl flex items-center justify-center', p.border]">
                {{ initials(p.row.name) }}
              </span>
              <span class="text-[17px] font-extrabold">{{ p.row.name }}<span v-if="p.row.isMe" class="text-brand"> (you)</span></span>
              <span class="text-[13px] text-fg-2">{{ p.row.activities }} {{ p.row.activities === 1 ? 'activity' : 'activities' }} · Level {{ p.row.level }}</span>
              <span :class="['font-display font-bold tabular leading-none', p.rank === 1 ? 'text-4xl' : 'text-[28px]', p.text]">
                {{ p.row.points.toLocaleString() }}
              </span>
            </template>
            <template v-else>
              <span class="w-[72px] h-[72px] rounded-[22px] border-[3px] border-dashed border-line flex items-center justify-center text-fg-muted">
                <PlusIcon class="w-6 h-6" />
              </span>
              <span class="text-[15px] font-bold text-fg-2">Open spot</span>
              <span class="text-[13px] text-fg-muted">One activity takes it</span>
            </template>
            <span :class="['mt-1.5 w-full h-11 rounded-control font-display font-bold text-lg flex items-center justify-center', p.bar]">P{{ p.rank }}</span>
          </div>
        </section>

        <!-- Your position -->
        <RaceYouRow
          :me="race.me"
          :target="race.nextTarget"
          :name="auth.user?.name ?? ''"
          :this-label="race.current.thisLabel"
          @log="ui.openActivityModal()"
        />

        <!-- Full standings -->
        <section aria-label="Full standings" class="card p-5 flex flex-col gap-2">
          <div class="flex items-center justify-between px-1 pb-1">
            <h2 class="font-display font-semibold text-xl">{{ race.current.race }}</h2>
            <span class="text-[13px] text-fg-muted">Race points · reset at the end of the {{ race.current.label.toLowerCase() }}</span>
          </div>
          <RaceStandingRow v-for="row in race.standings" :key="row.name" :row="row" />
          <AppEmptyState
            v-if="!race.standings.length"
            title="No scores yet"
            :description="`Nobody has logged an activity ${race.current.thisLabel}.`"
            compact
          />
        </section>
      </div>

      <!-- Side -->
      <!-- Side: countdown + level + explainer — stays in view while the standings scroll -->
      <aside class="flex flex-col gap-4 xl:sticky-aside">
        <section class="card p-5" aria-label="Race countdown">
          <AppCountdown :to="race.current.end" :units="['days', 'hours', 'minutes', 'seconds']" :label="`${race.current.race} ends in`" />
        </section>
        <StatCard label="Your level" tone="reward" :value="`Level ${auth.levelInfo.level}`">
          <AppXpBar
            :level="auth.levelInfo.level"
            :value="auth.levelInfo.pct"
            :current="auth.levelInfo.points"
            :max="auth.levelInfo.levelEnd"
          >
            <p class="text-[13px] text-reward/80">{{ auth.levelInfo.toNext.toLocaleString() }} XP to Level {{ auth.levelInfo.nextLevel }}</p>
          </AppXpBar>
        </StatCard>

        <div class="card p-6 flex flex-col gap-3">
          <h2 class="font-display font-semibold text-lg">Race points vs XP</h2>
          <p class="text-sm leading-relaxed text-fg-2">
            Every activity you log earns points. They count toward the current week, month, quarter and year races,
            which reset when each period ends. The same points add to your lifetime XP, which sets your level.
          </p>
        </div>
      </aside>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRaceStore } from '@/stores/useRaceStore'
import { useUiStore } from '@/stores/useUiStore'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppPeriodTabs from '@/components/ui/AppPeriodTabs.vue'
import AppCountdown from '@/components/ui/AppCountdown.vue'
import AppXpBar from '@/components/ui/AppXpBar.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'
import StatCard from '@/components/ui/StatCard.vue'
import RaceStandingRow from '@/components/features/race/RaceStandingRow.vue'
import RaceYouRow from '@/components/features/race/RaceYouRow.vue'

const auth = useAuthStore()
const race = useRaceStore()
const ui = useUiStore()

const tabs = computed(() => race.periods.map((p) => ({
  value: p.key,
  label: p.race,
  labelShort: p.labelShort,
  meta: p.daysLeft > 0 ? `${p.daysLeft}d` : '<1d',
  progress: p.elapsed,
})))

const MEDAL = {
  1: { border: 'border-podium-gold',   text: 'text-reward',   bar: 'bg-podium-gold text-[#1F1500]' },
  2: { border: 'border-podium-silver', text: 'text-fg', bar: 'bg-podium-silver text-[#0B1D27]' },
  3: { border: 'border-podium-bronze', text: 'text-fg', bar: 'bg-podium-bronze text-[#1E0D02]' },
}

const podium = computed(() => [1, 2, 3].map((rank) => ({
  rank,
  row: race.standings[rank - 1] ?? null,
  ...MEDAL[rank],
})))

const initials = (name) => name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
</script>
