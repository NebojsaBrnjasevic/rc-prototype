<template>
  <section aria-labelledby="race-title" class="rounded-panel bg-surface-1 border border-line overflow-hidden">
    <!-- Header: title · period switch · countdown -->
    <div class="px-6 py-5 border-b border-line flex flex-col xl:flex-row xl:items-center gap-5">
      <div class="flex flex-col gap-1 xl:min-w-[160px]">
        <span class="flex items-center gap-2 text-overline text-success">
          <span class="w-2 h-2 rounded-full bg-success ring-4 ring-success/20" aria-hidden="true" />Live
        </span>
        <h2 id="race-title" class="font-display font-bold text-[22px]">{{ race.current.race }}</h2>
      </div>

      <AppPeriodTabs
        v-if="showPeriodTabs"
        class="flex-1"
        aria-label="Race period"
        :model-value="race.period"
        :tabs="tabs"
        @update:model-value="race.setPeriod"
      />

      <AppCountdown :to="race.current.end" label="Ends in" size="sm" align="end" :class="['self-start xl:self-auto', !showPeriodTabs && 'xl:ml-auto']" />
    </div>

    <!-- Body: leader · chasing pack + you -->
    <div class="p-6 grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-6">
      <RaceLeaderCard :leader="race.leader" :runner-up="race.standings[1] ?? null" :this-label="race.current.thisLabel" />

      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between px-1 pb-1">
          <p class="text-overline text-fg-2">Chasing pack</p>
          <RouterLink to="/race" class="text-sm font-bold text-brand hover:text-brand-hover flex items-center gap-1">
            Full rankings <ChevronRightIcon class="w-4 h-4" />
          </RouterLink>
        </div>

        <template v-if="race.chasingPack.length">
          <RaceStandingRow v-for="row in race.chasingPack" :key="row.name" :row="row" />
        </template>
        <div v-else class="flex-1 min-h-[184px] p-6 rounded-[14px] border border-dashed border-line flex flex-col justify-center gap-2">
          <p class="text-[17px] font-extrabold">The podium is wide open</p>
          <p class="text-sm text-fg-2 leading-relaxed">
            <template v-if="race.leader">Only {{ race.leader.name.split(' ')[0] }} has scored {{ race.current.thisLabel }}. Log one activity and you're straight into the top two.</template>
            <template v-else>Nobody has scored {{ race.current.thisLabel }} yet.</template>
          </p>
        </div>

        <RaceYouRow
          v-if="showYou && (!race.me || race.me.rank > 1)"
          class="mt-auto"
          :me="race.me"
          :target="race.nextTarget"
          :name="auth.user?.name ?? ''"
          :this-label="race.current.thisLabel"
          @log="$emit('log')"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import { useRaceStore } from '@/stores/useRaceStore'
import { useAuthStore } from '@/stores/useAuthStore'
import AppPeriodTabs from '@/components/ui/AppPeriodTabs.vue'
import AppCountdown from '@/components/ui/AppCountdown.vue'
import RaceLeaderCard from './RaceLeaderCard.vue'
import RaceStandingRow from './RaceStandingRow.vue'
import RaceYouRow from './RaceYouRow.vue'

defineProps({
  /** Hide when the page already has a global period switch (Home) */
  showPeriodTabs: { type: Boolean, default: true },
  /** Hide the "You" row when the page already shows RaceHero */
  showYou:        { type: Boolean, default: true },
})
defineEmits(['log'])

const race = useRaceStore()
const auth = useAuthStore()

const tabs = computed(() => race.periods.map((p) => ({
  value: p.key,
  label: p.label,
  labelShort: p.labelShort,
  meta: p.daysLeft > 0 ? `${p.daysLeft}d left` : 'Last day',
  metaShort: p.daysLeft > 0 ? `${p.daysLeft}d` : '<1d',
  progress: p.elapsed,
})))
</script>
