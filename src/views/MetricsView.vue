<template>
  <AppLayout>
    <!-- Page header -->
    <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-5">
      <div>
        <h1 class="font-display font-bold text-[28px] sm:text-[34px] tracking-tight">
          {{ greeting }}, {{ firstName }}
        </h1>
        <p class="mt-2 text-base text-fg-2">
          Your race, your numbers and how the team is doing — all in one place.
        </p>
      </div>
      <AppButton @click="ui.openActivityModal()">
        <PlusIcon class="w-[18px] h-[18px] stroke-[2.5]" />Log activity
      </AppButton>
    </div>

    <!-- Global filters — drive the race, KPIs and Insights. Sticks while scrolling on lg+
         (on phones it would cover half the screen). -->
    <div class="lg:sticky lg:top-0 z-10 -mx-4 sm:-mx-8 px-4 sm:px-8 py-3 mb-6 bg-page/85 backdrop-blur-md border-y border-line">
      <div class="flex flex-col xl:flex-row xl:items-center gap-3">
        <AppSegmentControl
          :model-value="insights.scope"
          :options="scopeOptions"
          aria-label="Scope"
          @update:model-value="insights.setScope"
        />
        <AppPeriodTabs
          class="flex-1"
          aria-label="Period"
          :model-value="race.period"
          :tabs="periodTabs"
          @update:model-value="race.setPeriod"
        />
        <AppButton variant="secondary" class="xl:self-stretch !h-auto min-h-[44px]" @click="insights.exportCSV()">
          <ArrowDownTrayIcon class="w-[18px] h-[18px]" />Export CSV
        </AppButton>
      </div>
    </div>

    <!-- 1 · Race -->
    <RacePanel class="mb-6" :show-period-tabs="false" @log="ui.openActivityModal()" />

    <!-- 2 · KPIs (scope + period, compared with the previous period) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
      <StatCard
        label="Activities"
        :value="insights.kpis.activities.value"
        :delta="insights.kpis.activities.delta"
        :delta-label="vsLabel"
        :sublabel="`${insights.scopeLabel} · ${periodLabel}`"
      />
      <StatCard
        label="Pipeline generated"
        :value="gbp(insights.kpis.pipeline.value)"
        :delta="insights.kpis.pipeline.delta"
        :delta-label="vsLabel"
        :sublabel="`${insights.scopeLabel} · ${periodLabel}`"
      />
      <StatCard
        label="Top activity type"
        :value="insights.kpis.topType"
        :sublabel="insights.kpis.topType ? `${insights.scopeLabel} · ${periodLabel}` : 'Shows once activities are logged'"
      />
      <!-- Personal → lifetime points; Team / All → how many people contributed -->
      <StatCard
        v-if="insights.scope === 'my'"
        label="Total points"
        tone="reward"
        :value="auth.levelInfo.points.toLocaleString()"
      >
        <template #badge>
          <AppBadge color="reward" :pill="false">Lv {{ auth.levelInfo.level }}</AppBadge>
        </template>
        <AppXpBar :level="auth.levelInfo.level" :value="auth.levelInfo.pct" :show-labels="false" size="sm">
          <p class="text-[13px] text-reward/80">
            {{ auth.levelInfo.toNext.toLocaleString() }} pts to Level {{ auth.levelInfo.nextLevel }} · {{ auth.levelInfo.pct }}%
          </p>
        </AppXpBar>
      </StatCard>
      <StatCard
        v-else
        label="Contributors"
        :value="insights.kpis.contributors"
        :sublabel="`People who logged ${race.current.thisLabel}`"
        :icon="UserGroupIcon"
      />
    </div>

    <!-- 3 · Insights -->
    <section id="insights" aria-labelledby="insights-title" class="scroll-mt-28 space-y-5 mb-10">
      <div class="flex items-end justify-between gap-4">
        <div>
          <h2 id="insights-title" class="font-display font-bold text-2xl tracking-tight">Insights</h2>
          <p class="text-sm text-fg-2 mt-1">{{ insights.scopeLabel }} · {{ periodLabel }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-5">
        <InsightsTrend :buckets="insights.trend" :title="trendTitle" />
        <InsightsBreakdown :types="insights.byType" :status="insights.byStatus" />
      </div>

      <InsightsPartners :partners="insights.partners" />

      <InsightsContributors
        v-if="insights.scope !== 'my'"
        :rows="insights.contributors"
        :this-label="race.current.thisLabel"
      />
    </section>

    <!-- 4 · Recent activity -->
    <section class="card p-6" aria-labelledby="recent-title">
      <template v-if="insights.recent.length">
        <div class="flex items-center justify-between mb-4">
          <h2 id="recent-title" class="font-display font-semibold text-xl">Recent activity</h2>
          <RouterLink
            :to="{ path: '/activity', query: { scope: insights.scope, period: race.period } }"
            class="text-sm font-bold text-brand hover:text-brand-hover flex items-center gap-1"
          >
            View all <ChevronRightIcon class="w-4 h-4" />
          </RouterLink>
        </div>
        <ul class="space-y-2">
          <li v-for="act in insights.recent" :key="act.id">
            <button
              type="button"
              class="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-surface-2 hover:bg-surface-3 text-left transition-colors"
              @click="ui.openActivity(act.id)"
            >
              <AppAvatar :name="directory.name(act.vendors[0])" size="md" />
              <span class="min-w-0 flex-1">
                <span class="block text-[15px] font-extrabold truncate">{{ directory.name(act.vendors[0]) }} · {{ act.activityType }}</span>
                <span class="block text-[13px] text-fg-2 truncate">
                  {{ act.recordType }} · {{ act.date }}<template v-if="insights.scope !== 'my'"> · {{ act.createdBy }}</template>
                </span>
              </span>
              <span v-if="act.pipelineValue" class="hidden sm:block text-sm font-semibold text-fg-2 tabular">{{ gbp(act.pipelineValue) }}</span>
              <AppBadge :color="act.stage === 'Completed' ? 'success' : 'brand'" dot>{{ act.stage }}</AppBadge>
            </button>
          </li>
        </ul>
      </template>

      <div v-else class="flex flex-col sm:flex-row sm:items-center gap-6">
        <div class="flex items-center gap-4 flex-1">
          <span class="w-14 h-14 rounded-2xl bg-surface-2 border border-line flex items-center justify-center flex-shrink-0">
            <BoltIcon class="w-6 h-6 text-brand" />
          </span>
          <div>
            <h2 id="recent-title" class="font-display font-semibold text-xl">Recent activity</h2>
            <p class="text-[15px] text-fg-2 mt-1">
              No activities {{ race.current.thisLabel }}. Logged activities, follow-ups and linked opportunities will show here.
            </p>
          </div>
        </div>
        <AppButton variant="secondary" @click="ui.openActivityModal()">
          <PlusIcon class="w-[18px] h-[18px] stroke-[2.5]" />Create your first activity
        </AppButton>
      </div>
    </section>

  </AppLayout>
</template>

<script setup>
import { computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRaceStore } from '@/stores/useRaceStore'
import { useInsightsStore } from '@/stores/useInsightsStore'
import { useUiStore } from '@/stores/useUiStore'
import { useDirectoryStore } from '@/stores/useDirectoryStore'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppAvatar from '@/components/ui/AppAvatar.vue'
import AppSegmentControl from '@/components/ui/AppSegmentControl.vue'
import AppPeriodTabs from '@/components/ui/AppPeriodTabs.vue'
import AppXpBar from '@/components/ui/AppXpBar.vue'
import StatCard from '@/components/ui/StatCard.vue'
import RacePanel from '@/components/features/race/RacePanel.vue'
import InsightsTrend from '@/components/features/insights/InsightsTrend.vue'
import InsightsBreakdown from '@/components/features/insights/InsightsBreakdown.vue'
import InsightsPartners from '@/components/features/insights/InsightsPartners.vue'
import InsightsContributors from '@/components/features/insights/InsightsContributors.vue'
import {
  PlusIcon, BoltIcon, ChevronRightIcon, ArrowDownTrayIcon, UserGroupIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const auth = useAuthStore()
const race = useRaceStore()
const insights = useInsightsStore()
const ui = useUiStore()
const directory = useDirectoryStore()


const scopeOptions = [
  { value: 'my',   label: 'My activity' },
  { value: 'team', label: 'Team' },
  { value: 'all',  label: 'All' },
]

const periodTabs = computed(() => race.periods.map((p) => ({
  value: p.key,
  label: p.label,
  labelShort: p.labelShort,
  meta: p.daysLeft > 0 ? `${p.daysLeft}d left` : 'Last day',
  metaShort: p.daysLeft > 0 ? `${p.daysLeft}d` : '<1d',
  progress: p.elapsed,
})))

const firstName = computed(() => auth.user?.name?.split(' ')[0] ?? 'there')

const greeting = computed(() => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
})

const periodLabel = computed(() => race.current.thisLabel.charAt(0).toUpperCase() + race.current.thisLabel.slice(1))
const vsLabel = computed(() => `vs last ${race.current.label.toLowerCase()}`)
const trendTitle = computed(() => ({
  week: 'Per day, this week',
  month: 'Per week, this month',
  quarter: 'Per month, this quarter',
  year: 'Per month, this year',
}[race.period]))

const gbp = (n) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n)

// /dashboards redirects to /#insights. The page scrolls inside <main> (not the window),
// and scrollIntoView would also shift the fixed app shell — so scroll <main> directly,
// leaving room for the sticky filter bar.
onMounted(async () => {
  if (route.hash !== '#insights') return
  await nextTick()
  const el = document.getElementById('insights')
  const scroller = el?.closest('main')
  if (!el || !scroller) return
  const offset = el.getBoundingClientRect().top - scroller.getBoundingClientRect().top
  scroller.scrollTo({ top: scroller.scrollTop + offset - 112 })
})
</script>
